import { useMemo } from 'react';
import { fixCzech } from './fixCzech.js';

/**
 * Hook that returns the input string with Czech typography rules
 * applied. Memoised on the text + serialised options so re-renders with
 * the same input do not redo the work.
 *
 * @param {string} text
 * @param {import('./fixCzech.js').FixCzechOptions} [options]
 * @returns {string}
 */
export function useFixCzech(text, options) {
    const optionsKey = options ? JSON.stringify(options) : '';
    return useMemo(
        () => fixCzech(text, options),
        // optionsKey is a serialised representation of `options`, so it
        // captures the relevant dependencies without re-firing on a fresh
        // object literal with the same values.
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [text, optionsKey],
    );
}

export default useFixCzech;
