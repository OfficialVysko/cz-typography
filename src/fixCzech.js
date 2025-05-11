const prepositionList = ['k', 's', 'v', 'z', 'o', 'u', 'a', 'i'];
const unitList = [
    // Délka
    'km', 'm', 'cm', 'mm', 'µm', 'nm',
    // Hmotnost
    'kg', 'g', 'mg', 't',
    // Objem
    'l', 'ml', 'cl', 'dl',
    // Teplota
    '°C', '°F', 'K',
    // Čas
    's', 'min', 'h', 'ms', 'ns',
    // Elektrické jednotky
    'V', 'A', 'W', 'kW', 'MW', 'kWh', 'mAh', 'Ohm', 'Hz',
    // Tlak
    'Pa', 'kPa', 'bar', 'mbar',
    // Rychlost
    'km/h', 'm/s',
    // Digitální data
    'B', 'kB', 'MB', 'GB', 'TB', 'bit', 'kbps', 'Mbps', 'Gbit',
    // Síla, energie
    'J', 'kJ', 'Nm', 'Wb',
    // Světlo
    'lm', 'lx', 'cd',
    // Látkové množství
    'mol',
    // Typografie / rozměry
    'px', 'pt', 'dpi',
    // Jiné běžné
    '%', '‰', 'bpm', 'ks', '°', 'str', 'osob', 'MJ', 'mg/m³'
];

const prepositionRegex = new RegExp(`\\b(${prepositionList.join('|')})\\s+(?=\\S)`, 'g');
const unitRegex = new RegExp(`(\\d)\\s+(?=(${unitList.join('|')})\\b)`, 'gi');
const initialNameRegex = /\b([A-Z])\.\s+(?=[A-ZÁČĎÉĚÍŇÓŘŠŤÚŮÝŽ])/g;

export default function fixCzech(text, options = {}) {
    if (typeof text !== "string") return text;

    const {
        prepositions = true,
        units = true,
        initials = true
    } = options;

    let fixed = text;

    if (prepositions) {
        fixed = fixed.replace(prepositionRegex, '$1\u00A0');
    }

    if (units) {
        fixed = fixed.replace(unitRegex, '$1\u00A0');
    }

    if (initials) {
        fixed = fixed.replace(initialNameRegex, '$1.\u00A0');
    }

    return fixed;
}