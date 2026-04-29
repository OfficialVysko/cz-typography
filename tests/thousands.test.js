import { describe, expect, it } from 'vitest';
import { fixCzech } from '../src/fixCzech.js';
import { applyThousands } from '../src/rules/thousands.js';

const NBSP = '\u00A0';

describe('thousands', () => {
    it('joins one thousands separator', () => {
        expect(applyThousands('10 000')).toBe(`10${NBSP}000`);
    });

    it('joins multiple separators in a single number', () => {
        expect(applyThousands('1 000 000')).toBe(`1${NBSP}000${NBSP}000`);
        expect(applyThousands('1 234 567 890')).toBe(`1${NBSP}234${NBSP}567${NBSP}890`);
    });

    it('does not glue digits across other content', () => {
        expect(applyThousands('5 12 something')).toBe('5 12 something');
    });

    it('does not split mid-text', () => {
        expect(applyThousands('Price: 1 000 Kč')).toBe(`Price: 1${NBSP}000 Kč`);
    });

    it('is idempotent', () => {
        const once = applyThousands('1 000 000 lidí');
        expect(applyThousands(once)).toBe(once);
    });

    it('integrates through fixCzech with units', () => {
        expect(fixCzech('Cena je 10 000 Kč.')).toBe(`Cena je 10${NBSP}000${NBSP}Kč.`);
    });
});
