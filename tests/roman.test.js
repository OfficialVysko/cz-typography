import { describe, expect, it } from 'vitest';
import { fixCzech } from '../src/fixCzech.js';
import { applyRoman } from '../src/rules/roman.js';

const NBSP = '\u00A0';

describe('roman', () => {
    it('glues a name to a Roman numeral with a dot', () => {
        expect(applyRoman('Karel IV.')).toBe(`Karel${NBSP}IV.`);
        expect(applyRoman('Jindřich VIII.')).toBe(`Jindřich${NBSP}VIII.`);
        expect(applyRoman('Ludvík XIV.')).toBe(`Ludvík${NBSP}XIV.`);
    });

    it('handles long names with diacritics', () => {
        expect(applyRoman('Václav II.')).toBe(`Václav${NBSP}II.`);
        expect(applyRoman('František Josef I.')).toBe(`František Josef${NBSP}I.`);
    });

    it('does not match without trailing dot', () => {
        expect(applyRoman('Karel IV')).toBe('Karel IV');
    });

    it('does not match arbitrary uppercase letters that look Roman-ish', () => {
        expect(applyRoman('Praha X.')).toBe(`Praha${NBSP}X.`);
        expect(applyRoman('Praha X je město')).toBe('Praha X je město');
    });

    it('integrates through fixCzech', () => {
        expect(fixCzech('Vládl Karel IV. od roku 1346.')).toBe(
            `Vládl Karel${NBSP}IV. od roku 1346.`,
        );
    });
});
