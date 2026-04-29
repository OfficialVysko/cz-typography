/**
 * Units of measurement that are safe to glue to a preceding number with a
 * non-breaking space, regardless of what follows.
 *
 * Sorted from longest to shortest so the regex alternation matches the most
 * specific unit first (e.g. `kWh` before `kW` before `W`).
 *
 * @type {readonly string[]}
 */
export const SAFE_UNITS = Object.freeze(
    [
        'km/h',
        'm/s',
        'kWh',
        'mAh',
        'mbar',
        'kbps',
        'Mbps',
        'Gbit',
        'kPa',
        'bar',
        'kg',
        'mg',
        'cm',
        'mm',
        'µm',
        'nm',
        'km',
        'ml',
        'cl',
        'dl',
        'kJ',
        'Nm',
        'Wb',
        'lm',
        'lx',
        'cd',
        'mol',
        'min',
        'ms',
        'ns',
        'Hz',
        'Pa',
        'kW',
        'MW',
        'Ohm',
        '°C',
        '°F',
        '°',
        '‰',
        '%',
        'px',
        'pt',
        'dpi',
        'bpm',
        'EUR',
        'USD',
        'CZK',
        'Kč',
        'mg/m³',
        'str',
        'osob',
        'ks',
        'MJ',
        'TB',
        'GB',
        'MB',
        'kB',
        'bit',
        'GBit',
        'mol',
        'Ω',
        '€',
        '$',
        '£',
    ].sort((a, b) => b.length - a.length),
);

/**
 * Units that collide with common Czech words/letters when used as a
 * single character (e.g. `s` is also a preposition, `m` matches `m` in
 * "5 mužů"). They are applied only when the unit is followed by a clear
 * word boundary that is not another letter (interpunction or end of string).
 *
 * @type {readonly string[]}
 */
export const STRICT_UNITS = Object.freeze(
    ['m', 's', 'l', 't', 'g', 'V', 'A', 'W', 'J', 'K', 'B'].sort(
        (a, b) => b.length - a.length,
    ),
);
