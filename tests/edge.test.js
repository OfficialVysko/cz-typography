import { describe, expect, it } from 'vitest';
import { fixCzech } from '../src/fixCzech.js';
import { fixCzechHtml } from '../src/fixCzechHtml.js';

describe('edge cases', () => {
    it('handles empty/null/undefined gracefully', () => {
        expect(fixCzech('')).toBe('');
        expect(fixCzech(null)).toBe(null);
        expect(fixCzech(undefined)).toBe(undefined);
        expect(fixCzech(42)).toBe(42);
        expect(fixCzech({})).toEqual({});

        expect(fixCzechHtml('')).toBe('');
        expect(fixCzechHtml(null)).toBe(null);
        expect(fixCzechHtml(undefined)).toBe(undefined);
    });

    it('handles a long text without crashing', () => {
        const fragment = 'Karel IV. žil v 14. století. Měl 5 km cestu k autu. ';
        const long = fragment.repeat(2000);
        const out = fixCzech(long);
        expect(typeof out).toBe('string');
        expect(out.length).toBe(long.length);
        expect(out.includes('\u00A0')).toBe(true);
    });

    it('handles text with only whitespace', () => {
        expect(fixCzech('   ')).toBe('   ');
    });

    it('preserves unrelated whitespace', () => {
        expect(fixCzech('\n\tjeden text\n\t')).toBe('\n\tjeden text\n\t');
    });

    it('does not crash on partial regex inputs', () => {
        expect(fixCzech('5.')).toBe('5.');
        expect(fixCzech('K')).toBe('K');
        expect(fixCzech('v')).toBe('v');
    });
});
