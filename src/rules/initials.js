const INITIAL_REGEX = /(\b\p{Lu})\.[ \t]+(?=\p{Lu})/gu;

/**
 * Glues an initial (a single uppercase letter followed by a dot) to the
 * following word with a non-breaking space. Repeats until stable so chains
 * like `J. R. R. Tolkien` are fully fixed.
 *
 * @param {string} text
 * @returns {string}
 */
export function applyInitials(text) {
    let previous;
    let current = text;
    do {
        previous = current;
        current = current.replace(INITIAL_REGEX, '$1.\u00A0');
    } while (current !== previous);
    return current;
}
