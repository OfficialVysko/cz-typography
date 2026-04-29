import { describe, expect, it } from 'vitest';
import { fixCzech } from '../src/fixCzech.js';

const NBSP = '\u00A0';

describe('fixCzech options', () => {
    it('applies all rules by default', () => {
        const input = 'Karel IV. žil v 14. století a měl 5 km.';
        const out = fixCzech(input);
        expect(out).toContain(`Karel${NBSP}IV.`);
        expect(out).toContain(`v${NBSP}14.`);
        expect(out).toContain(`14.${NBSP}století`);
        expect(out).toContain(`5${NBSP}km.`);
    });

    it('disables prepositions', () => {
        const out = fixCzech('Šel k autu', { prepositions: false });
        expect(out).toBe('Šel k autu');
    });

    it('disables units', () => {
        const out = fixCzech('5 km', { units: false });
        expect(out).toBe('5 km');
    });

    it('disables initials', () => {
        const out = fixCzech('J. Novák', { initials: false });
        expect(out).toBe('J. Novák');
    });

    it('disables dates', () => {
        const out = fixCzech('5. 12. 2024', { dates: false, ordinals: false });
        expect(out).toBe('5. 12. 2024');
    });

    it('disables ordinals', () => {
        const out = fixCzech('1. ledna', { ordinals: false });
        expect(out).toBe('1. ledna');
    });

    it('disables roman', () => {
        const out = fixCzech('Karel IV.', { roman: false });
        expect(out).toBe('Karel IV.');
    });

    it('disables thousands', () => {
        const out = fixCzech('10 000', { thousands: false });
        expect(out).toBe('10 000');
    });

    it('returns non-strings unchanged', () => {
        expect(fixCzech(null)).toBe(null);
        expect(fixCzech(undefined)).toBe(undefined);
        expect(fixCzech(42)).toBe(42);
        expect(fixCzech('')).toBe('');
    });
});
