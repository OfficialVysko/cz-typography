import { describe, expect, it } from 'vitest';
import { createFixCzechProcessor, createFixCzechStream } from '../src/fixCzechHtml.js';

const NBSP = '\u00A0';

describe('createFixCzechProcessor', () => {
    it('produces the same output as fixCzechHtml when fed in one piece', () => {
        const proc = createFixCzechProcessor();
        const out = proc.feed('<p>v domě a v práci.</p>') + proc.flush();
        expect(out).toBe(`<p>v${NBSP}domě a${NBSP}v${NBSP}práci.</p>`);
    });

    it('handles a word split across two chunks', () => {
        const proc = createFixCzechProcessor();
        let out = '';
        out += proc.feed('<p>tady text v ');
        out += proc.feed('domě a v práci.</p>');
        out += proc.flush();
        expect(out).toBe(`<p>tady text v${NBSP}domě a${NBSP}v${NBSP}práci.</p>`);
    });

    it('handles a tag split across chunks', () => {
        const proc = createFixCzechProcessor();
        let out = '';
        out += proc.feed('<p>v dom');
        out += proc.feed('ě</p>');
        out += proc.flush();
        expect(out).toBe(`<p>v${NBSP}domě</p>`);
    });

    it('preserves script content across chunks', () => {
        const proc = createFixCzechProcessor();
        let out = '';
        out += proc.feed('<script>let x = "v dom');
        out += proc.feed('ě";</script><p>v domě</p>');
        out += proc.flush();
        expect(out).toBe(`<script>let x = "v domě";</script><p>v${NBSP}domě</p>`);
    });

    it('handles many small chunks', () => {
        const html =
            '<article><h1>Karel IV.</h1><p>žil v 14. století a byl významný panovník v Čechách.</p></article>';
        const proc = createFixCzechProcessor();
        let out = '';
        for (let i = 0; i < html.length; i += 3) {
            out += proc.feed(html.slice(i, i + 3));
        }
        out += proc.flush();
        expect(out).toBe(
            `<article><h1>Karel${NBSP}IV.</h1><p>žil v${NBSP}14.${NBSP}století a${NBSP}byl významný panovník v${NBSP}Čechách.</p></article>`,
        );
    });

    it('handles empty input', () => {
        const proc = createFixCzechProcessor();
        expect(proc.feed('')).toBe('');
        expect(proc.flush()).toBe('');
    });
});

describe('createFixCzechStream', () => {
    it('transforms an HTML stream chunk by chunk', async () => {
        const html = '<p>v domě a v práci</p>';
        const encoder = new TextEncoder();
        const decoder = new TextDecoder();

        const source = new ReadableStream({
            start(controller) {
                controller.enqueue(encoder.encode(html.slice(0, 10)));
                controller.enqueue(encoder.encode(html.slice(10)));
                controller.close();
            },
        });

        const transformed = source.pipeThrough(createFixCzechStream());
        const reader = transformed.getReader();
        let result = '';
        while (true) {
            const { value, done } = await reader.read();
            if (done) break;
            result += decoder.decode(value, { stream: true });
        }
        result += decoder.decode();

        expect(result).toBe(`<p>v${NBSP}domě a${NBSP}v${NBSP}práci</p>`);
    });
});
