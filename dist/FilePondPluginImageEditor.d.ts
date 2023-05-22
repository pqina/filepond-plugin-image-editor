// @ts-ignore
import { FilePondOptions } from 'filepond';

declare module 'filepond' {
    export interface FilePondOptions {
        /** Enable or disable image editor */
        allowImageEditor?: boolean;

        /** Enable or disable instant edit mode */
        imageEditorInstantEdit?: boolean;

        /** Enable or disable edit button */
        imageEditorAllowEdit?: boolean;

        /** Override detection of edit support */
        imageEditorSupportEdit?: boolean;

        /** Override detection of write support */
        imageEditorSupportWriteImage?: boolean;

        /** Enable or disable outputing an image */
        imageEditorWriteImage?: boolean;

        /** Receives image write output expects file or array of file items in return */
        imageEditorAfterWriteImage?: (res: {
            src: File | Blob;
            imageState: any;
            dest: File;
        }) => File | { name: null | string; file: File | Blob }[];

        /** Image Editor configuration object */
        imageEditor?: any;

        /** Image Editor edit icon */
        imageEditorIconEdit?: string;

        /** Image Editor edit button position */
        styleImageEditorButtonEditItemPosition?: string;
    }
}
