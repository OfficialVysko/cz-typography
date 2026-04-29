import { fixCzech } from './fixCzech.js';

const RAW_TEXT_TAGS = new Set(['script', 'style', 'pre', 'code', 'textarea']);

const TOKEN_REGEX =
    /<!--[\s\S]*?-->|<!\[CDATA\[[\s\S]*?\]\]>|<![A-Za-z][^>]*>|<\?[\s\S]*?\?>|<\/?([A-Za-z][A-Za-z0-9-]*)\b[^>]*>|[^<]+/g;

const SENTINEL = '\u0001';

function isTextToken(match) {
    return match.charCodeAt(0) !== 60;
}

function isTagToken(match) {
    return (
        match.charCodeAt(0) === 60 &&
        !match.startsWith('<!--') &&
        !match.startsWith('<![') &&
        !match.startsWith('<!') &&
        !match.startsWith('<?')
    );
}

function fixWithLookahead(text, options, nextChar) {
    if (nextChar && /\S/.test(nextChar)) {
        const padded = text + nextChar + SENTINEL;
        const fixed = fixCzech(padded, options);
        if (fixed.endsWith(nextChar + SENTINEL)) {
            return fixed.slice(0, -(nextChar.length + SENTINEL.length));
        }
        return fixed.endsWith(SENTINEL) ? fixed.slice(0, -SENTINEL.length) : fixed;
    }
    return fixCzech(text, options);
}

function transformOne(match, tagName, rawTextStack, options, nextChar) {
    if (!isTagToken(match) && match.charCodeAt(0) === 60) {
        return match;
    }

    if (isTagToken(match)) {
        const isClosing = match.charCodeAt(1) === 47;
        const tag = tagName ? tagName.toLowerCase() : '';
        if (isClosing) {
            const top = rawTextStack[rawTextStack.length - 1];
            if (top && top === tag) rawTextStack.pop();
        } else if (RAW_TEXT_TAGS.has(tag) && !/\/\s*>$/.test(match)) {
            rawTextStack.push(tag);
        }
        return match;
    }

    if (rawTextStack.length > 0) return match;
    return fixWithLookahead(match, options, nextChar);
}

function tokenize(html) {
    const tokens = [];
    TOKEN_REGEX.lastIndex = 0;
    let m;
    while ((m = TOKEN_REGEX.exec(html))) {
        tokens.push({ match: m[0], tagName: m[1], end: m.index + m[0].length });
    }
    return tokens;
}

function lookaheadOf(tokens, index, fallback) {
    const next = tokens[index + 1];
    if (!next) return fallback || '';
    if (isTextToken(next.match)) return next.match.charAt(0);
    return '<';
}

function transformTokens(tokens, rawTextStack, options, trailingChar) {
    let output = '';
    for (let i = 0; i < tokens.length; i++) {
        const { match, tagName } = tokens[i];
        const nextChar = lookaheadOf(tokens, i, trailingChar);
        output += transformOne(match, tagName, rawTextStack, options, nextChar);
    }
    return output;
}

/**
 * Apply Czech typography rules to an HTML string. Tags, attributes,
 * comments, doctypes and the contents of `script`/`style`/`pre`/`code`/
 * `textarea` elements are left untouched.
 *
 * @param {string} html
 * @param {import('./fixCzech.js').FixCzechOptions} [options]
 * @returns {string}
 */
export function fixCzechHtml(html, options) {
    if (typeof html !== 'string' || html.length === 0) return html;
    return transformTokens(tokenize(html), [], options, '');
}

const STREAM_TAIL = 64;

/**
 * Stateful streaming processor – feeds chunks of HTML through the same
 * transformation as {@link fixCzechHtml} while keeping a small tail
 * buffer to handle words and tags split across chunk boundaries.
 *
 * @param {import('./fixCzech.js').FixCzechOptions} [options]
 * @returns {{ feed(chunk: string): string, flush(): string }}
 */
export function createFixCzechProcessor(options) {
    let buffer = '';
    const rawTextStack = [];

    function flushUpTo(cutPoint, trailingChar) {
        if (cutPoint === 0) return '';
        const processable = buffer.slice(0, cutPoint);
        const tokens = tokenize(processable);
        const output = transformTokens(tokens, rawTextStack, options, trailingChar);
        buffer = buffer.slice(cutPoint);
        return output;
    }

    return {
        feed(chunk) {
            if (typeof chunk !== 'string') chunk = String(chunk);
            buffer += chunk;
            if (buffer.length === 0) return '';

            let cutPoint = Math.max(0, buffer.length - STREAM_TAIL);
            const lastLt = buffer.lastIndexOf('<');
            const lastGt = buffer.lastIndexOf('>');
            if (lastLt > lastGt) cutPoint = Math.min(cutPoint, lastLt);

            while (cutPoint > 0 && !/\s/.test(buffer[cutPoint - 1])) cutPoint--;
            while (cutPoint > 0 && /\s/.test(buffer[cutPoint - 1])) cutPoint--;
            while (cutPoint > 0 && !/\s/.test(buffer[cutPoint - 1])) cutPoint--;

            if (cutPoint === 0) return '';

            const trailingChar = buffer.charAt(cutPoint);
            return flushUpTo(cutPoint, trailingChar);
        },

        flush() {
            if (buffer.length === 0) return '';
            return flushUpTo(buffer.length, '');
        },
    };
}

/**
 * Create a Web-Streams `TransformStream` that applies Czech typography
 * rules to an HTML response on the fly. Compatible with Vercel Edge,
 * Cloudflare Workers, Node.js 18+, Deno and Bun.
 *
 * @param {import('./fixCzech.js').FixCzechOptions} [options]
 * @returns {TransformStream<Uint8Array | string, Uint8Array>}
 */
export function createFixCzechStream(options) {
    if (typeof TransformStream === 'undefined') {
        throw new Error(
            'createFixCzechStream requires the Web Streams API. Use Node 18+, Deno, Bun, or run in a browser/Edge runtime.',
        );
    }

    const decoder = new TextDecoder('utf-8');
    const encoder = new TextEncoder();
    const processor = createFixCzechProcessor(options);

    return new TransformStream({
        transform(chunk, controller) {
            const text =
                typeof chunk === 'string' ? chunk : decoder.decode(chunk, { stream: true });
            const out = processor.feed(text);
            if (out.length > 0) controller.enqueue(encoder.encode(out));
        },
        flush(controller) {
            const tail = decoder.decode();
            if (tail.length > 0) {
                const out = processor.feed(tail);
                if (out.length > 0) controller.enqueue(encoder.encode(out));
            }
            const final = processor.flush();
            if (final.length > 0) controller.enqueue(encoder.encode(final));
        },
    });
}
