import { describe, expect, it } from 'vitest';
import { fixCzech } from '../src/fixCzech.js';
import { applyPrepositions } from '../src/rules/prepositions.js';

const NBSP = '\u00A0';

describe('prepositions', () => {
    it('glues lowercase one-letter prepositions to the next word', () => {
        expect(applyPrepositions('k autu')).toBe(`k${NBSP}autu`);
        expect(applyPrepositions('v domě')).toBe(`v${NBSP}domě`);
        expect(applyPrepositions('s Petrem')).toBe(`s${NBSP}Petrem`);
        expect(applyPrepositions('z Prahy')).toBe(`z${NBSP}Prahy`);
        expect(applyPrepositions('o tom')).toBe(`o${NBSP}tom`);
        expect(applyPrepositions('u nás')).toBe(`u${NBSP}nás`);
        expect(applyPrepositions('a já')).toBe(`a${NBSP}já`);
        expect(applyPrepositions('i tak')).toBe(`i${NBSP}tak`);
    });

    it('handles capitalised prepositions at the start of a sentence', () => {
        expect(applyPrepositions('K Tobě')).toBe(`K${NBSP}Tobě`);
        expect(applyPrepositions('V domě')).toBe(`V${NBSP}domě`);
        expect(applyPrepositions('S Petrem')).toBe(`S${NBSP}Petrem`);
        expect(applyPrepositions('Z Prahy')).toBe(`Z${NBSP}Prahy`);
    });

    it('does not match a single letter that is part of a word', () => {
        expect(applyPrepositions('sk autu')).toBe('sk autu');
        expect(applyPrepositions('vk autu')).toBe('vk autu');
        expect(applyPrepositions('jezdec na koni')).toBe(`jezdec na koni`);
    });

    it('handles consecutive prepositions in one pass', () => {
        expect(applyPrepositions('v a z')).toBe(`v${NBSP}a${NBSP}z`);
    });

    it('respects opening brackets and quotes as boundaries', () => {
        expect(applyPrepositions('(v domě)')).toBe(`(v${NBSP}domě)`);
        expect(applyPrepositions('"v domě"')).toBe(`"v${NBSP}domě"`);
        expect(applyPrepositions('[v domě]')).toBe(`[v${NBSP}domě]`);
    });

    it('is idempotent', () => {
        const once = applyPrepositions('v domě a v práci');
        const twice = applyPrepositions(once);
        expect(twice).toBe(once);
    });

    it('integrates through fixCzech', () => {
        expect(fixCzech('Šel jsem k autu a v domě.')).toBe(
            `Šel jsem k${NBSP}autu a${NBSP}v${NBSP}domě.`,
        );
    });
});
