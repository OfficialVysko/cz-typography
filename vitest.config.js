import { defineConfig } from 'vitest/config';

export default defineConfig({
    esbuild: {
        jsx: 'automatic',
        loader: 'jsx',
        include: [/src\/.*\.[jt]sx?$/, /tests\/.*\.[jt]sx?$/],
        exclude: [],
    },
    optimizeDeps: {
        esbuildOptions: {
            loader: { '.js': 'jsx' },
        },
    },
    test: {
        environment: 'happy-dom',
        globals: false,
        coverage: {
            provider: 'v8',
            reporter: ['text', 'html', 'lcov'],
            include: ['src/**/*.{js,jsx}'],
            exclude: [
                'src/next/loader.cjs',
                'src/**/*.d.ts',
                // Pure re-export entry points – their bodies are exercised
                // through the underlying modules, not the entry itself.
                'src/index.js',
                'src/react.js',
                'src/next/index.js',
            ],
        },
        include: ['tests/**/*.test.{js,jsx}'],
    },
    resolve: {
        extensions: ['.js', '.jsx', '.mjs', '.cjs'],
    },
});
