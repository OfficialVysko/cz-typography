import { SAFE_UNITS, STRICT_UNITS } from '../data/units.js';

function escapeRegex(value) {
    return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

const SAFE_PATTERN = SAFE_UNITS.map(escapeRegex).join('|');
const STRICT_PATTERN = STRICT_UNITS.map(escapeRegex).join('|');

const SAFE_UNIT_REGEX = new RegExp(
    `(\\d)[ \\t]+(?=(?:${SAFE_PATTERN})(?![\\p{L}\\p{N}]))`,
    'gu',
);

const STRICT_UNIT_REGEX = new RegExp(
    `(\\d)[ \\t]+(?=(?:${STRICT_PATTERN})(?:[.,;:!?)\\]/\\u00A0]|$))`,
    'gu',
);

/**
 * Glues a number to its unit of measurement with a non-breaking space.
 *
 * Two passes:
 *  1. **Safe units** – multi-character or symbolic units (`km`, `°C`, `Kč`,
 *     `Ω`) match whenever they follow a digit and are not the prefix of a
 *     longer word.
 *  2. **Strict units** – single-letter units that collide with common Czech
 *     words (`s`, `m`, `g`, `K`, `V`, `A`, `W`) match only when followed by
 *     interpunction or end-of-string – never when followed by another
 *     letter (avoids false positives like `5 mužů`).
 *
 * @param {string} text
 * @returns {string}
 */
export function applyUnits(text) {
    return text
        .replace(SAFE_UNIT_REGEX, '$1\u00A0')
        .replace(STRICT_UNIT_REGEX, '$1\u00A0');
}
