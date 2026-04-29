import { PREPOSITIONS } from '../data/prepositions.js';

const PREPOSITION_REGEX = new RegExp(
    `(?<=^|[\\s(\\["'\u00A0\u2018\u201C\u00BB\u2014\u2013-])(${PREPOSITIONS.join('|')})[ \\t]+(?=\\S)`,
    'giu',
);

/**
 * Glues Czech one-letter prepositions and conjunctions (a, i, k, o, s, u,
 * v, z) to the following word with a non-breaking space.
 *
 * Case-insensitive – also handles capitalised forms at the start of a
 * sentence (`K Tobě`, `V domě`, `S Petrem`).
 *
 * Uses a lookbehind so consecutive prepositions (`v a z`) are all fixed
 * in a single pass.
 *
 * @param {string} text
 * @returns {string}
 */
export function applyPrepositions(text) {
    return text.replace(PREPOSITION_REGEX, '$1\u00A0');
}
