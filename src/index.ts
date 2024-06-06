import isFile from '@core/common/isFile';
import isImage from '@core/common/isImage';
import getImageSize from '@core/common/getImageSize';
import isBlob from '@core/common/isBlob';
import noop from '@core/common/noop';
import isBrowser from '@core/common/isBrowser';
import supportsWebGL from '@core/common/supportsWebGL';
import isModernBrowser from '@core/common/isModernBrowser';

/**
 * Image Edit Proxy Plugin
 */
const plugin = (_) => {
    const { addFilter, utils, views } = _;
    const { Type, createRoute } = utils;
    const { fileActionButton } = views;

    const createQueue = ({ parallel = 1, autoShift = true }) => {
        const queue: any[] = [];

        let jobs = 0;

        const next = () => {
            // done
            if (!queue.length) return api.oncomplete();

            // get next item
            jobs++;
            const job = queue.shift();

            // run
            job(() => {
                jobs--;

                // pick up next item
                if (jobs < parallel) runJobs();
            });
        };

        const runJobs = () => {
            for (let i = 0; i < parallel - jobs; i++) {
                next();
            }
        };

        const api = {
            queue: (cb) => {
                // queue job
                queue.push(cb);

                // run item immidiately
                autoShift && runJobs();
            },
            runJobs,
            oncomplete: () => {},
        };

        return api;
    };

    const renderQueue = createQueue({ parallel: 1 });

    const getEditorSafe = (editor) => (editor === null ? {} : editor);

    addFilter(
        'SHOULD_REMOVE_ON_REVERT',
        (shouldRemove, { item, query }) =>
            new Promise((resolve) => {
                const { file } = item;

                // if this file is editable it shouldn't be removed immidiately even when instant uploading
                const canEdit =
                    query('GET_ALLOW_IMAGE_EDITOR') &&
                    query('GET_IMAGE_EDITOR_ALLOW_EDIT') &&
                    query('GET_IMAGE_EDITOR_SUPPORT_EDIT') &&
                    query('GET_IMAGE_EDITOR_SUPPORT_IMAGE')(file);

                // if the file cannot be edited it should be removed on revert
                resolve(!canEdit);
            })
    );

    // open editor when loading a new item
    addFilter(
        'DID_LOAD_ITEM',
        (item, { query, dispatch }) =>
            new Promise((resolve, reject) => {
                // if is temp or local file
                if (item.origin > 1) {
                    resolve(item);
                    return;
                }

                // get file reference
                const { file } = item;
                if (
                    !query('GET_ALLOW_IMAGE_EDITOR') ||
                    !query(
                        'GET_IMAGE_EDITOR_INSTANT_EDIT' || !query('GET_IMAGE_EDITOR_SUPPORT_EDIT')
                    )
                )
                    return resolve(item);

                // exit if this is not an image
                if (!query('GET_IMAGE_EDITOR_SUPPORT_IMAGE')(file)) return resolve(item);

                // request editing of a file
                const requestEdit = () => {
                    if (!editRequestQueue.length) return;

                    const { item, resolve, reject } = editRequestQueue[0];

                    dispatch('EDIT_ITEM', {
                        id: item.id,
                        handleEditorResponse: createEditorResponseHandler(item, resolve, reject),
                    });
                };

                // is called when the user confirms editing the file
                const createEditorResponseHandler = (item, resolve, reject) => (userDidConfirm) => {
                    // remove item
                    editRequestQueue.shift();

                    // handle item
                    if (userDidConfirm) {
                        resolve(item);
                    } else {
                        reject(item);
                    }

                    // TODO: Fix, should not be needed to kick the internal loop in case no processes are running
                    dispatch('KICK');

                    // handle next item!
                    requestEdit();
                };

                queueEditRequest({ item, resolve, reject });

                if (editRequestQueue.length === 1) {
                    requestEdit();
                }
            })
    );

    // extend item methods
    addFilter('DID_CREATE_ITEM', (item, { query, dispatch }) => {
        // need to backup colors if in color because poster plugin sets color to null as uses it for average color calculation
        const color = item.getMetadata('color');
        if (color) item.setMetadata('colors', item.getMetadata('color'));

        item.extend('edit', () => {
            dispatch('EDIT_ITEM', { id: item.id });
        });
    });

    const editRequestQueue: any[] = [];
    const queueEditRequest = (editRequest: any) => {
        editRequestQueue.push(editRequest);
        return editRequest;
    };

    const couldTransformFile = (query) => {
        // no editor defined, then exit
        const { imageProcessor, imageReader, imageWriter } = getEditorSafe(
            query('GET_IMAGE_EDITOR')
        );

        return (
            query('GET_IMAGE_EDITOR_WRITE_IMAGE') &&
            query('GET_IMAGE_EDITOR_SUPPORT_WRITE_IMAGE') &&
            imageProcessor &&
            imageReader &&
            imageWriter
        );
    };

    // generate preview
    const getPosterTargetSize = (query, targetSize) => {
        const posterHeight = query('GET_FILE_POSTER_HEIGHT');
        const maxPosterHeight = query('GET_FILE_POSTER_MAX_HEIGHT');
        if (posterHeight) {
            targetSize.width = posterHeight * 2;
            targetSize.height = posterHeight * 2;
        } else if (maxPosterHeight) {
            targetSize.width = maxPosterHeight * 2;
            targetSize.height = maxPosterHeight * 2;
        }
        return targetSize;
    };

    const createImagePoster = (query, item, done = () => {}) => {
        if (!item) return;

        // respect poster filter
        if (!query('GET_FILE_POSTER_FILTER_ITEM')(item)) return done();

        const {
            imageProcessor,
            imageReader,
            imageWriter,
            editorOptions,
            legacyDataToImageState,
            imageState: imageBaseState,
        } = getEditorSafe(query('GET_IMAGE_EDITOR'));

        // need image processor to create image poster
        if (!imageProcessor) return;

        const [createImageReader, imageReaderOptions] = imageReader;
        const [createImageWriter = noop, imageWriterOptions] = imageWriter;

        const file = item.file;
        const imageState = item.getMetadata('imageState');

        const targetSize = getPosterTargetSize(query, {
            width: 512,
            height: 512,
        });

        const options = {
            ...editorOptions,
            imageReader: createImageReader(imageReaderOptions),
            imageWriter: createImageWriter({
                // can optionally overwrite poster size
                ...(imageWriterOptions || {}),

                // limit memory so poster is created quicker
                canvasMemoryLimit: targetSize.width * targetSize.height * 2,

                // apply legacy data if needed
                preprocessImageState: (state, options, onprogress, metadata) => {
                    // could be legacy data
                    if (!imageState && legacyDataToImageState) {
                        return {
                            ...state,
                            ...legacyDataToImageState(undefined, metadata.size, {
                                ...item.getMetadata(),
                            }),
                        };
                    }

                    return state;
                },
            }),
            imageState: {
                ...imageBaseState,
                ...imageState,
            },
        };

        renderQueue.queue((next) => {
            imageProcessor(file, options).then(({ dest }) => {
                item.setMetadata('poster', URL.createObjectURL(dest), true);
                next();
                done();
            });
        });
    };

    // called for each view that is created right after the 'create' method
    addFilter('CREATE_VIEW', (viewAPI) => {
        // get reference to created view
        const { is, view, query } = viewAPI;

        if (!query('GET_ALLOW_IMAGE_EDITOR')) return;

        if (!query('GET_IMAGE_EDITOR_SUPPORT_WRITE_IMAGE')) return;

        const supportsFilePoster = query('GET_ALLOW_FILE_POSTER');

        // only run for either the file or the file info panel
        const shouldExtendView =
            (is('file-info') && !supportsFilePoster) || (is('file') && supportsFilePoster);

        if (!shouldExtendView) return;

        // no editor defined, then exit
        const {
            createEditor,
            imageReader,
            imageWriter,
            editorOptions,
            legacyDataToImageState,
            imageState: imageBaseState,
        } = getEditorSafe(query('GET_IMAGE_EDITOR'));

        if (!imageReader || !imageWriter || !editorOptions || !editorOptions.locale) return;

        // remove default image reader and writer if set
        delete editorOptions.imageReader;
        delete editorOptions.imageWriter;

        const [createImageReader, imageReaderOptions] = imageReader;

        // tests if file item has poster
        const getItemByProps = (props) => {
            const { id } = props;
            const item = query('GET_ITEM', id);
            return item;
        };

        const hasPoster = (props) => {
            if (!query('GET_ALLOW_FILE_POSTER')) return false;

            const item = getItemByProps(props);
            if (!item) return;

            // test if is filtered
            if (!query('GET_FILE_POSTER_FILTER_ITEM')(item)) return false;

            const poster = item.getMetadata('poster');

            return !!poster;
        };

        // opens the editor, if it does not already exist, it creates the editor
        const openImageEditor = ({ root, props, action }) => {
            const { handleEditorResponse } = action;

            // get item
            const item = getItemByProps(props);

            // if a function is defined
            const isFileSource = isFile(item.file) || isBlob(item.file);
            const src = isFileSource ? item.file : item.source;

            // open the editor (sets editor properties and imageState property)
            const editor = createEditor({
                ...editorOptions,
                imageReader: createImageReader(imageReaderOptions),
                src,
            });

            // when the image has loaded, update the editor
            editor.on('load', ({ size }) => {
                // get current image edit state
                let imageState = item.getMetadata('imageState');

                // could be legacy data
                if (!imageState && legacyDataToImageState) {
                    imageState = legacyDataToImageState(editor, size, item.getMetadata());
                }

                // update editor view based on image edit state
                editor.imageState = {
                    ...imageBaseState,
                    ...imageState,
                };
            });

            editor.on('process', ({ src, imageState }) => {
                // replace item mock source with dest
                if (!isFileSource) item.setFile(src);

                // store state
                item.setMetadata('imageState', imageState);

                // used in instant edit mode
                if (!handleEditorResponse) return;

                handleEditorResponse(true);
            });

            editor.on('close', () => {
                // used in instant edit mode
                if (!handleEditorResponse) return;

                handleEditorResponse(false);
            });
        };

        //#region view
        const didLoadItem = ({ root, props }) => {
            const { id } = props;

            // try to access item
            const item = query('GET_ITEM', id);
            if (!item) return;

            // get the file object
            const file = item.file;

            // exit if this is not an image
            if (!query('GET_IMAGE_EDITOR_SUPPORT_IMAGE')(file)) return;

            if (query('GET_ALLOW_FILE_POSTER') && !item.getMetadata('poster')) {
                root.dispatch('REQUEST_CREATE_IMAGE_POSTER', { id });
            }

            if (!query('GET_IMAGE_EDITOR_ALLOW_EDIT') || !query('GET_IMAGE_EDITOR_SUPPORT_EDIT'))
                return;

            // draw edit button next to file name
            updateEditButton(root, props);
        };

        const updateEditButton = (root, props) => {
            // handle interactions
            if (!root.ref.handleEdit) {
                root.ref.handleEdit = (e) => {
                    e.stopPropagation();
                    root.dispatch('EDIT_ITEM', { id: props.id });
                };
            }

            if (hasPoster(props)) {
                // remove current editButton
                if (root.ref.editButton && root.ref.editButton.parentNode) {
                    root.ref.editButton.parentNode.removeChild(root.ref.editButton);
                }

                // add edit button to preview
                const buttonView = view.createChildView(fileActionButton, {
                    label: 'edit',
                    icon: query('GET_IMAGE_EDITOR_ICON_EDIT'),
                    opacity: 0,
                });

                // edit item classname
                buttonView.element.classList.add('filepond--action-edit-item');
                buttonView.element.dataset.align = query(
                    'GET_STYLE_IMAGE_EDITOR_BUTTON_EDIT_ITEM_POSITION'
                );
                buttonView.on('click', root.ref.handleEdit);

                root.ref.buttonEditItem = view.appendChildView(buttonView);
            }

            // no poster
            else {
                // remove current button
                if (root.ref.buttonEditItem) {
                    root.removeChildView(root.ref.buttonEditItem);
                }

                // view is file info
                const filenameElement = view.element.querySelector('.filepond--file-info-main');
                const editButton = document.createElement('button');
                editButton.className = 'filepond--action-edit-item-alt';
                editButton.type = 'button';
                editButton.innerHTML = query('GET_IMAGE_EDITOR_ICON_EDIT') + '<span>edit</span>';
                editButton.addEventListener('click', root.ref.handleEdit);
                filenameElement.appendChild(editButton);

                root.ref.editButton = editButton;
            }
        };

        //#endregion
        const didUpdateItemMetadata = ({ root, props, action }) => {
            // handle image state updates
            if (/imageState/.test(action.change.key) && query('GET_ALLOW_FILE_POSTER'))
                return root.dispatch('REQUEST_CREATE_IMAGE_POSTER', { id: props.id });

            // no change to poster, skip
            if (!/poster/.test(action.change.key)) return;

            // no editor allowed so no need to show the button
            if (!query('GET_IMAGE_EDITOR_ALLOW_EDIT') || !query('GET_IMAGE_EDITOR_SUPPORT_EDIT'))
                return;

            updateEditButton(root, props);
        };

        view.registerDestroyer(({ root }) => {
            if (root.ref.buttonEditItem) {
                root.ref.buttonEditItem.off('click', root.ref.handleEdit);
            }
            if (root.ref.editButton) {
                root.ref.editButton.removeEventListener('click', root.ref.handleEdit);
            }
        });

        const routes = {
            EDIT_ITEM: openImageEditor,
            DID_LOAD_ITEM: didLoadItem,
            DID_UPDATE_ITEM_METADATA: didUpdateItemMetadata,
            DID_REMOVE_ITEM: ({ props }) => {
                const { id } = props;
                const item = query('GET_ITEM', id);
                if (!item) return;
                const poster = item.getMetadata('poster');
                poster && URL.revokeObjectURL(poster);
            },
            REQUEST_CREATE_IMAGE_POSTER: ({ root, props }) =>
                createImagePoster(root.query, getItemByProps(props)),
            DID_FILE_POSTER_LOAD: undefined,
        };

        if (supportsFilePoster) {
            // view is file
            const didPosterUpdate = ({ root }) => {
                if (!root.ref.buttonEditItem) return;
                root.ref.buttonEditItem.opacity = 1;
            };

            routes.DID_FILE_POSTER_LOAD = didPosterUpdate;
        }

        // start writing
        view.registerWriter(createRoute(routes));
    });

    //#region write image
    addFilter(
        'SHOULD_PREPARE_OUTPUT',
        (shouldPrepareOutput, { query, change, item }) =>
            new Promise((resolve) => {
                if (!query('GET_IMAGE_EDITOR_SUPPORT_IMAGE')(item.file)) return resolve(false);
                if (change && !/imageState/.test(change.key)) return resolve(false);
                resolve(!query('IS_ASYNC'));
            })
    );

    const shouldTransformFile = (query, file, item) =>
        new Promise((resolve) => {
            // invalid item
            if (
                !couldTransformFile(query) ||
                item.archived ||
                (!isFile(file) && !isBlob(file)) ||
                !query('GET_IMAGE_EDITOR_SUPPORT_IMAGE')(file)
            ) {
                return resolve(false);
            }

            // if size can't be read this browser doesn't support image
            getImageSize(file)
                .then(() => {
                    const fn = query('GET_IMAGE_TRANSFORM_IMAGE_FILTER');
                    if (fn) {
                        const filterResult = fn(file);
                        if (filterResult == null) {
                            // undefined or null
                            // return handleRevert(true);
                        }
                        if (typeof filterResult === 'boolean') {
                            return resolve(filterResult);
                        }
                        if (typeof filterResult.then === 'function') {
                            return filterResult.then(resolve);
                        }
                    }

                    resolve(true);
                })
                .catch(() => {
                    // browser doesn't support image, but perhaps Pintura does?
                    const imageEditorSupportFormat = query('GET_IMAGE_EDITOR_SUPPORT_IMAGE_FORMAT');
                    if (imageEditorSupportFormat && imageEditorSupportFormat(file)) {
                        resolve(true);
                        return;
                    }

                    resolve(false);
                });
        });

    // subscribe to file transformations
    addFilter('PREPARE_OUTPUT', (file, { query, item }) => {
        const writeOutputImage = (file) =>
            new Promise((resolve, reject) => {
                // test if has image poster yet, if not, create poster
                const prepare = () => {
                    // queue for preparing
                    renderQueue.queue((next) => {
                        const imageState = item.getMetadata('imageState');

                        // no editor defined, then exit
                        const {
                            imageProcessor,
                            imageReader,
                            imageWriter,
                            editorOptions,
                            imageState: imageBaseState,
                        } = getEditorSafe(query('GET_IMAGE_EDITOR'));

                        if (!imageProcessor || !imageReader || !imageWriter || !editorOptions)
                            return;

                        const [createImageReader, imageReaderOptions] = imageReader;
                        const [createImageWriter = noop, imageWriterOptions] = imageWriter;

                        imageProcessor(file, {
                            ...editorOptions,
                            imageReader: createImageReader(imageReaderOptions),
                            imageWriter: createImageWriter(imageWriterOptions),
                            imageState: {
                                ...imageBaseState,
                                ...imageState,
                            },
                        })
                            .then(resolve)
                            .catch(reject)
                            .finally(next);
                    });
                };

                if (query('GET_ALLOW_FILE_POSTER') && !item.getMetadata('poster')) {
                    // create poster
                    createImagePoster(query, item, prepare);
                } else {
                    prepare();
                }
            });

        return new Promise((resolve) => {
            shouldTransformFile(query, file, item).then((shouldWrite) => {
                if (!shouldWrite) return resolve(file);

                writeOutputImage(file).then((res) => {
                    const afterFn = query('GET_IMAGE_EDITOR_AFTER_WRITE_IMAGE');

                    // if a function is defined
                    if (afterFn) return Promise.resolve(afterFn(res)).then(resolve);

                    // @ts-ignore
                    resolve(res.dest);
                });
            });
        });
    });

    //#endregion

    // Expose plugin options
    return {
        options: {
            // enable or disable image editing
            allowImageEditor: [true, Type.BOOLEAN],

            // open editor when image is dropped
            imageEditorInstantEdit: [false, Type.BOOLEAN],

            // allow editing
            imageEditorAllowEdit: [true, Type.BOOLEAN],

            // cannot edit if no WebGL or is <=IE11
            imageEditorSupportEdit: [
                isBrowser() && isModernBrowser() && supportsWebGL(),
                Type.BOOLEAN,
            ],

            // receives file and should return true if can edit
            imageEditorSupportImage: [isImage, Type.FUNCTION],

            // receives file, should return true if can be loaded with Pintura
            imageEditorSupportImageFormat: [null, Type.FUNCTION],

            // cannot write if is <= IE11
            imageEditorSupportWriteImage: [isModernBrowser(), Type.BOOLEAN],

            // should output image
            imageEditorWriteImage: [true, Type.BOOLEAN],

            // receives written image and can return single or more images
            imageEditorBeforeOpenImage: [undefined, Type.FUNCTION],

            // receives written image and can return single or more images
            imageEditorAfterWriteImage: [undefined, Type.FUNCTION],

            // editor object
            imageEditor: [null, Type.OBJECT],

            // the icon to use for the edit button
            imageEditorIconEdit: [
                '<svg width="26" height="26" viewBox="0 0 26 26" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false"><path d="M8.5 17h1.586l7-7L15.5 8.414l-7 7V17zm-1.707-2.707l8-8a1 1 0 0 1 1.414 0l3 3a1 1 0 0 1 0 1.414l-8 8A1 1 0 0 1 10.5 19h-3a1 1 0 0 1-1-1v-3a1 1 0 0 1 .293-.707z" fill="currentColor" fill-rule="nonzero"/></svg>',
                Type.STRING,
            ],

            // location of processing button
            styleImageEditorButtonEditItemPosition: ['bottom center', Type.STRING],
        },
    };
};

// fire pluginloaded event if running in browser, this allows registering the plugin when using async script tags
if (isBrowser())
    document.dispatchEvent(new CustomEvent('FilePond:pluginloaded', { detail: plugin }));

export default plugin;
