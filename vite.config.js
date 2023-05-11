import { resolve } from 'path';

export default {
    resolve: {
        alias: {
            '@core': resolve(__dirname, '../pintura/src/core/'),
        },
    },
    build: {
        type: ['iife', 'es'],
        lib: {
            entry: resolve(__dirname, 'src/index.ts'),
            name: 'FilePondPluginImageEditor',
            fileName: 'FilePondPluginImageEditor',
            formats: ['es', 'iife'],
        },
        rollupOptions: {
            output: {
                globals: 'FilePondPluginImageEditor',
            },
        },
    },
};
