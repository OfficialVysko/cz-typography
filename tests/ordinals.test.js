import { describe, expect, it } from 'vitest';
import { fixCzech } from '../src/fixCzech.js';
import { applyOrdinals } from '../src/rules/ordinals.js';

const NBSP = '\u00A0';

describe('ordinals', () => {
    it('glues an ordinal number to a Czech month name', () => {
        expect(applyOrdinals('1. ledna')).toBe(`1.${NBSP}ledna`);
        expect(applyOrdinals('25. listopadu')).toBe(`25.${NBSP}listopadu`);
    });

    it('does not trigger at sentence boundaries', () => {
        expect(applyOrdinals('Kapitola 5. Něco dalšího.')).toBe('Kapitola 5. Něco dalšího.');
    });

    it('does not glue when next word starts with uppercase', () => {
        expect(applyOrdinals('1. Příběh')).toBe('1. Příběh');
    });

    it('integrates through fixCzech', () => {
        expect(fixCzech('Pojede tam 1. ledna 2025.')).toBe(`Pojede tam 1.${NBSP}ledna 2025.`);
    });
});
