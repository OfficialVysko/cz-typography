'use strict';

const { fixCzech } = require('../fixCzech.js');

const JSX_TEXT_REGEX = />([^<>{}]*?[a-zA-Záčďéěíňóřšťúůýž][^<>{}]*?)</g;

/**
 * Webpack loader that rewrites static JSX text nodes by piping them
 * through {@link fixCzech}. Operates on the source string – greps for
 * `>plain text<` segments inside JSX-looking files and replaces the
 * captured text. `{...}` expressions are deliberately ignored, so
 * dynamic interpolations are untouched.
 *
 * For more aggressive rewriting use the runtime middleware – this
 * loader is an opt-in optimisation for build-time processing of
 * obviously-static JSX text.
 *
 * @param {string} source
 * @returns {string}
 */
module.exports = function czTypographyLoader(source) {
    const opts = this.getOptions ? this.getOptions() || {} : {};
    return source.replace(JSX_TEXT_REGEX, function (full, text) {
        const fixed = fixCzech(text, opts.options);
        if (fixed === text) return full;
        return '>' + fixed + '<';
    });
};
