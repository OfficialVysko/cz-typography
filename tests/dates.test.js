import { describe, expect, it } from 'vitest';
import { fixCzech } from '../src/fixCzech.js';
import { applyDates } from '../src/rules/dates.js';

const NBSP = '\u00A0';

describe('dates', () => {
    it('glues a full date', () => {
        expect(applyDates('5. 12. 2024')).toBe(`5.${NBSP}12.${NBSP}2024`);
        expect(applyDates('25. 12. 2024')).toBe(`25.${NBSP}12.${NBSP}2024`);
    });

    it('accepts two-digit years', () => {
        expect(applyDates('5. 12. 24')).toBe(`5.${NBSP}12.${NBSP}24`);
    });

    it('glues a day + month combo', () => {
        expect(applyDates('5. 12.')).toBe(`5.${NBSP}12.`);
        expect(applyDates('Bylo to 5. 12.')).toBe(`Bylo to 5.${NBSP}12.`);
    });

    it('does not interfere with sentence punctuation', () => {
        expect(applyDates('Kapitola 5. Něco dalšího.')).toBe('Kapitola 5. Něco dalšího.');
    });

    it('integrates through fixCzech', () => {
        expect(fixCzech('Konference proběhne 5. 12. 2024 v Praze.')).toBe(
            `Konference proběhne 5.${NBSP}12.${NBSP}2024 v${NBSP}Praze.`,
        );
    });
});
