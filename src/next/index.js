import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

/**
 * Wrap a Next.js config so that source files are passed through the
 * cz-typography webpack loader at build time, rewriting static JSX text
 * literals.
 *
 * @param {object} nextConfig
 * @param {{ options?: import('../fixCzech.js').FixCzechOptions, include?: RegExp, exclude?: RegExp }} [loaderOptions]
 */
export function withCzTypography(nextConfig = {}, loaderOptions = {}) {
    const { options, include, exclude = /node_modules/ } = loaderOptions;
    const here = dirname(fileURLToPath(import.meta.url));
    const loaderPath = resolve(here, './loader.cjs');

    return {
        ...nextConfig,
        webpack(webpackConfig, context) {
            webpackConfig.module = webpackConfig.module || { rules: [] };
            webpackConfig.module.rules = webpackConfig.module.rules || [];
            webpackConfig.module.rules.push({
                test: include || /\.(jsx?|tsx?)$/,
                exclude,
                use: [
                    {
                        loader: loaderPath,
                        options: { options },
                    },
                ],
            });

            if (typeof nextConfig.webpack === 'function') {
                return nextConfig.webpack(webpackConfig, context);
            }
            return webpackConfig;
        },
    };
}

