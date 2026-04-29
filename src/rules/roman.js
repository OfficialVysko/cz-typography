const ROMAN_NUMERAL =
    '(?:(?=[IVXLCDM])M{0,3}(?:CM|CD|D?C{0,3})(?:XC|XL|L?X{0,3})(?:IX|IV|V?I{0,3}))';
const ROMAN_REGEX = new RegExp(
    `(\\b\\p{Lu}\\p{L}+)[ \\t]+(?=${ROMAN_NUMERAL}\\.(?=[^\\p{L}\\p{N}]|$))`,
    'gu',
);

/**
 * Glues a name to a following Roman numeral (with optional dot) using a
 * non-breaking space.
 *
 * - `Karel IV.` → `Karel\u00A0IV.`
 * - `Jindřich VIII.` → `Jindřich\u00A0VIII.`
 * - `papež Jan Pavel II.` → `papež Jan Pavel\u00A0II.`
 *
 * @param {string} text
 * @returns {string}
 */
export function applyRoman(text) {
    return text.replace(ROMAN_REGEX, '$1\u00A0');
}
