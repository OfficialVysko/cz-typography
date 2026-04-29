import { describe, expect, it } from 'vitest';
import { fixCzechHtml } from '../src/fixCzechHtml.js';

const NBSP = '\u00A0';

describe('fixCzechHtml', () => {
    it('fixes text inside elements', () => {
        expect(fixCzechHtml('<p>v domě</p>')).toBe(`<p>v${NBSP}domě</p>`);
        expect(fixCzechHtml('<h1>Karel IV.</h1>')).toBe(`<h1>Karel${NBSP}IV.</h1>`);
    });

    it('does not touch attributes', () => {
        const input = '<a href="v domě">link</a>';
        expect(fixCzechHtml(input)).toBe('<a href="v domě">link</a>');
    });

    it('does not touch script content', () => {
        const input = '<script>const x = "v domě";</script>';
        expect(fixCzechHtml(input)).toBe(input);
    });

    it('does not touch style content', () => {
        const input = '<style>.x { content: "v domě"; }</style>';
        expect(fixCzechHtml(input)).toBe(input);
    });

    it('does not touch pre/code/textarea content', () => {
        expect(fixCzechHtml('<pre>v domě</pre>')).toBe('<pre>v domě</pre>');
        expect(fixCzechHtml('<code>v domě</code>')).toBe('<code>v domě</code>');
        expect(fixCzechHtml('<textarea>v domě</textarea>')).toBe('<textarea>v domě</textarea>');
    });

    it('preserves HTML comments', () => {
        const input = '<p>v domě <!-- v komentáři --></p>';
        expect(fixCzechHtml(input)).toBe(`<p>v${NBSP}domě <!-- v komentáři --></p>`);
    });

    it('preserves doctype and processing instructions', () => {
        const input = '<!DOCTYPE html><p>v domě</p>';
        expect(fixCzechHtml(input)).toBe(`<!DOCTYPE html><p>v${NBSP}domě</p>`);
    });

    it('handles nested tags', () => {
        const input = '<div><p>v domě <strong>a hodně</strong> jistě.</p></div>';
        expect(fixCzechHtml(input)).toBe(
            `<div><p>v${NBSP}domě <strong>a${NBSP}hodně</strong> jistě.</p></div>`,
        );
    });

    it('fixes preposition right before a tag boundary', () => {
        const input = '<p>v <strong>domě</strong></p>';
        expect(fixCzechHtml(input)).toBe(`<p>v${NBSP}<strong>domě</strong></p>`);
    });

    it('returns non-strings unchanged', () => {
        expect(fixCzechHtml(null)).toBe(null);
        expect(fixCzechHtml(undefined)).toBe(undefined);
        expect(fixCzechHtml('')).toBe('');
    });

    it('respects options', () => {
        expect(fixCzechHtml('<p>v domě</p>', { prepositions: false })).toBe('<p>v domě</p>');
    });

    it('handles self-closing void elements', () => {
        const input = '<p>v domě<br/>a v práci</p>';
        expect(fixCzechHtml(input)).toBe(`<p>v${NBSP}domě<br/>a${NBSP}v${NBSP}práci</p>`);
    });
});
