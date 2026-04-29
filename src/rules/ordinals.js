const ORDINAL_REGEX = /(\d{1,2})\.[ \t]+(?=\p{Ll})/gu;

/**
 * Glues ordinal numbers to the following word with a non-breaking space.
 * Triggers only when the next character is a Unicode lowercase letter so
 * sentences ending with an ordinal (e.g. `žil v 19. století. Měl…`)
 * are not affected at the sentence boundary.
 *
 * - `1. ledna` → `1.\u00A0ledna`
 * - `25. listopadu 2024` → `25.\u00A0listopadu 2024`
 *
 * @param {string} text
 * @returns {string}
 */
export function applyOrdinals(text) {
    return text.replace(ORDINAL_REGEX, '$1.\u00A0');
}
