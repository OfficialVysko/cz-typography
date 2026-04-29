import { describe, expect, it } from 'vitest';
import { fixCzech } from '../src/fixCzech.js';
import { applyInitials } from '../src/rules/initials.js';

const NBSP = '\u00A0';

describe('initials', () => {
    it('glues a single initial to a surname', () => {
        expect(applyInitials('J. Novák')).toBe(`J.${NBSP}Novák`);
        expect(applyInitials('K. Čapek')).toBe(`K.${NBSP}Čapek`);
    });

    it('glues a chain of initials', () => {
        expect(applyInitials('J. R. R. Tolkien')).toBe(`J.${NBSP}R.${NBSP}R.${NBSP}Tolkien`);
        expect(applyInitials('A. C. Clarke')).toBe(`A.${NBSP}C.${NBSP}Clarke`);
    });

    it('does not glue when followed by lowercase', () => {
        expect(applyInitials('J. něco')).toBe('J. něco');
    });

    it('handles diacritics in surnames', () => {
        expect(applyInitials('K. Čapek')).toBe(`K.${NBSP}Čapek`);
        expect(applyInitials('J. Žižka')).toBe(`J.${NBSP}Žižka`);
    });

    it('is idempotent', () => {
        const once = applyInitials('J. R. R. Tolkien');
        expect(applyInitials(once)).toBe(once);
    });

    it('integrates through fixCzech', () => {
        expect(fixCzech('Autor je J. R. R. Tolkien.')).toBe(
            `Autor je J.${NBSP}R.${NBSP}R.${NBSP}Tolkien.`,
        );
    });
});
