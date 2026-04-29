import { describe, expect, it } from 'vitest';
import { fixCzech } from '../src/fixCzech.js';
import { applyUnits } from '../src/rules/units.js';

const NBSP = '\u00A0';

describe('units', () => {
    it('glues common length/weight units to numbers', () => {
        expect(applyUnits('5 km')).toBe(`5${NBSP}km`);
        expect(applyUnits('100 cm')).toBe(`100${NBSP}cm`);
        expect(applyUnits('80 kg')).toBe(`80${NBSP}kg`);
        expect(applyUnits('500 ml')).toBe(`500${NBSP}ml`);
    });

    it('glues temperature with the degree sign', () => {
        expect(applyUnits('30 °C')).toBe(`30${NBSP}°C`);
        expect(applyUnits('100 °F')).toBe(`100${NBSP}°F`);
    });

    it('glues currency units', () => {
        expect(applyUnits('100 Kč')).toBe(`100${NBSP}Kč`);
        expect(applyUnits('5 €')).toBe(`5${NBSP}€`);
        expect(applyUnits('20 $')).toBe(`20${NBSP}$`);
        expect(applyUnits('15 EUR')).toBe(`15${NBSP}EUR`);
        expect(applyUnits('100 CZK')).toBe(`100${NBSP}CZK`);
    });

    it('glues electrical units including Ω', () => {
        expect(applyUnits('230 V')).toBe(`230${NBSP}V`);
        expect(applyUnits('5 A.')).toBe(`5${NBSP}A.`);
        expect(applyUnits('10 W')).toBe(`10${NBSP}W`);
        expect(applyUnits('1.5 kW')).toBe(`1.5${NBSP}kW`);
        expect(applyUnits('100 Ω')).toBe(`100${NBSP}Ω`);
    });

    it('respects unit ordering – longer units win', () => {
        expect(applyUnits('1.5 kWh')).toBe(`1.5${NBSP}kWh`);
        expect(applyUnits('120 km/h')).toBe(`120${NBSP}km/h`);
        expect(applyUnits('15 m/s')).toBe(`15${NBSP}m/s`);
    });

    it('does not match strict single-letter units mid-sentence', () => {
        expect(applyUnits('5 m něco')).toBe('5 m něco');
        expect(applyUnits('5 g cukru')).toBe('5 g cukru');
        expect(applyUnits('5 K později')).toBe('5 K později');
    });

    it('matches strict single-letter units before punctuation or end', () => {
        expect(applyUnits('5 m.')).toBe(`5${NBSP}m.`);
        expect(applyUnits('5 g,')).toBe(`5${NBSP}g,`);
        expect(applyUnits('Hmotnost: 5 g')).toBe(`Hmotnost: 5${NBSP}g`);
    });

    it('does not match digit-prefix as part of a longer word', () => {
        expect(applyUnits('5 kmh')).toBe('5 kmh');
        expect(applyUnits('5 mGB')).toBe('5 mGB');
    });

    it('handles percent and per mille', () => {
        expect(applyUnits('25 %')).toBe(`25${NBSP}%`);
        expect(applyUnits('0.5 ‰')).toBe(`0.5${NBSP}‰`);
    });

    it('is idempotent', () => {
        const once = applyUnits('5 km a 30 °C');
        const twice = applyUnits(once);
        expect(twice).toBe(once);
    });

    it('integrates through fixCzech', () => {
        expect(fixCzech('Cestoval 5 km do 30 °C.')).toBe(
            `Cestoval 5${NBSP}km do 30${NBSP}°C.`,
        );
    });
});
