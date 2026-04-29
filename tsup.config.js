import { defineConfig } from 'tsup';

export default defineConfig([
    {
        entry: { index: 'src/index.js' },
        format: ['esm', 'cjs'],
        outDir: 'dist',
        outExtension({ format }) {
            return { js: format === 'cjs' ? '.cjs' : '.mjs' };
        },
        target: 'node18',
        sourcemap: true,
        clean: true,
        dts: true,
        treeshake: true,
        splitting: false,
        cjsInterop: true,
    },
    {
        entry: { react: 'src/react.js' },
        format: ['esm', 'cjs'],
        outDir: 'dist',
        outExtension({ format }) {
            return { js: format === 'cjs' ? '.cjs' : '.mjs' };
        },
        target: 'es2020',
        platform: 'neutral',
        sourcemap: true,
        clean: false,
        dts: true,
        treeshake: true,
        splitting: false,
        cjsInterop: true,
        external: ['react', 'react-dom', 'react-dom/server'],
        loader: { '.js': 'jsx' },
        esbuildOptions(opts) {
            opts.jsx = 'automatic';
        },
    },
    {
        entry: {
            'next/index': 'src/next/index.js',
            'next/middleware': 'src/next/middleware.js',
        },
        format: ['esm', 'cjs'],
        outDir: 'dist',
        outExtension({ format }) {
            return { js: format === 'cjs' ? '.cjs' : '.mjs' };
        },
        target: 'es2020',
        platform: 'neutral',
        sourcemap: true,
        clean: false,
        dts: true,
        treeshake: true,
        splitting: false,
        cjsInterop: true,
        external: ['next', 'next/server', 'react', 'react-dom'],
    },
    {
        entry: { 'next/loader': 'src/next/loader.cjs' },
        format: ['cjs'],
        outDir: 'dist',
        outExtension() {
            return { js: '.cjs' };
        },
        target: 'node18',
        platform: 'node',
        sourcemap: true,
        clean: false,
        dts: false,
        treeshake: true,
        splitting: false,
        cjsInterop: false,
    },
]);
