const THOUSANDS_REGEX = /(\d)[ \t](\d{3})(?=\D|$)/g;

/**
 * Replaces a regular space used as a thousand separator with a non-breaking
 * space so the number stays on one line (`10 000` → `10\u00A0000`).
 *
 * Applied repeatedly to handle multiple separators in a single number
 * (`1 000 000`).
 *
 * @param {string} text
 * @returns {string}
 */
export function applyThousands(text) {
    let previous;
    let current = text;
    do {
        previous = current;
        current = current.replace(THOUSANDS_REGEX, '$1\u00A0$2');
    } while (current !== previous);
    return current;
}
