import { applyDates } from './rules/dates.js';
import { applyInitials } from './rules/initials.js';
import { applyOrdinals } from './rules/ordinals.js';
import { applyPrepositions } from './rules/prepositions.js';
import { applyRoman } from './rules/roman.js';
import { applyThousands } from './rules/thousands.js';
import { applyUnits } from './rules/units.js';

/**
 * @typedef {object} FixCzechOptions
 * @property {boolean} [prepositions=true] Glue one-letter prepositions/conjunctions to the next word.
 * @property {boolean} [units=true]        Glue numbers to units of measurement.
 * @property {boolean} [initials=true]     Glue initials (J., A.) to surnames.
 * @property {boolean} [dates=true]        Glue dates (5. 12. 2024) together.
 * @property {boolean} [ordinals=true]     Glue ordinal numbers (1. ledna) to the next word.
 * @property {boolean} [roman=true]        Glue names to Roman numerals (Karel IV.).
 * @property {boolean} [thousands=true]    Replace thousands separators (10 000) with nbsp.
 */

const DEFAULT_OPTIONS = Object.freeze({
    prepositions: true,
    units: true,
    initials: true,
    dates: true,
    ordinals: true,
    roman: true,
    thousands: true,
});

/**
 * Apply Czech typography rules to a string.
 *
 * Returns the input unchanged when it isn't a string, so the function is
 * safe to call on `null`, `undefined`, numbers etc. without guarding.
 *
 * Pipeline order matters – `thousands` runs before `units`, otherwise the
 * "10 000 km" case would steal the thousand-separator space as the
 * number-to-unit space.
 *
 * @param {string} text
 * @param {FixCzechOptions} [options]
 * @returns {string}
 */
export function fixCzech(text, options) {
    if (typeof text !== 'string' || text.length === 0) {
        return text;
    }

    const opts = options ? { ...DEFAULT_OPTIONS, ...options } : DEFAULT_OPTIONS;

    let result = text;
    if (opts.thousands) result = applyThousands(result);
    if (opts.dates) result = applyDates(result);
    if (opts.ordinals) result = applyOrdinals(result);
    if (opts.units) result = applyUnits(result);
    if (opts.initials) result = applyInitials(result);
    if (opts.roman) result = applyRoman(result);
    if (opts.prepositions) result = applyPrepositions(result);
    return result;
}

export default fixCzech;
