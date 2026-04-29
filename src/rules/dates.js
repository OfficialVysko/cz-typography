const FULL_DATE_REGEX = /(\d{1,2})\.[ \t]+(\d{1,2})\.[ \t]+(\d{2,4})\b/g;
const DAY_MONTH_REGEX = /(\d{1,2})\.[ \t]+(\d{1,2})\.(?=[^\p{L}\p{N}]|$)/gu;

/**
 * Glues date components together with non-breaking spaces.
 *
 * - `5. 12. 2024` → `5.\u00A012.\u00A02024`
 * - `5. 12.` → `5.\u00A012.`
 *
 * @param {string} text
 * @returns {string}
 */
export function applyDates(text) {
    return text
        .replace(FULL_DATE_REGEX, '$1.\u00A0$2.\u00A0$3')
        .replace(DAY_MONTH_REGEX, '$1.\u00A0$2.');
}
