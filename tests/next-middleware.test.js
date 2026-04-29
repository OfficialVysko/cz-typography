import { describe, expect, it, vi } from 'vitest';

const NBSP = '\u00A0';

function streamFromString(str) {
    const encoder = new TextEncoder();
    return new ReadableStream({
        start(controller) {
            controller.enqueue(encoder.encode(str));
            controller.close();
        },
    });
}

async function readStream(stream) {
    const reader = stream.getReader();
    const decoder = new TextDecoder();
    let result = '';
    while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        result += decoder.decode(value, { stream: true });
    }
    result += decoder.decode();
    return result;
}

class MockNextResponse {
    constructor(body, init = {}) {
        this.body = body;
        this.status = init.status ?? 200;
        this.statusText = init.statusText ?? 'OK';
        this.headers = init.headers instanceof Headers ? init.headers : new Headers(init.headers);
    }
}

let mockResponseFactory = () =>
    new MockNextResponse(streamFromString('<p>v domě</p>'), {
        status: 200,
        headers: new Headers({ 'content-type': 'text/html; charset=utf-8' }),
    });

vi.mock('next/server', () => ({
    NextResponse: Object.assign(
        function NextResponse(body, init) {
            return new MockNextResponse(body, init);
        },
        {
            next: () => mockResponseFactory(),
        },
    ),
}));

describe('withCzTypography middleware', () => {
    it('transforms HTML responses through the stream pipeline', async () => {
        mockResponseFactory = () =>
            new MockNextResponse(streamFromString('<p>v domě a v práci</p>'), {
                status: 200,
                headers: new Headers({ 'content-type': 'text/html; charset=utf-8' }),
            });

        const { withCzTypography } = await import('../src/next/middleware.js');
        const middleware = withCzTypography();
        const response = await middleware({});
        const body = await readStream(response.body);

        expect(body).toBe(`<p>v${NBSP}domě a${NBSP}v${NBSP}práci</p>`);
    });

    it('passes non-HTML responses through untouched', async () => {
        const passthrough = streamFromString('{"v":"domě"}');
        mockResponseFactory = () =>
            new MockNextResponse(passthrough, {
                status: 200,
                headers: new Headers({ 'content-type': 'application/json' }),
            });

        const { withCzTypography } = await import('../src/next/middleware.js');
        const middleware = withCzTypography();
        const response = await middleware({});
        expect(response.body).toBe(passthrough);
    });

    it('respects custom shouldProcess predicate', async () => {
        const passthrough = streamFromString('<p>v domě</p>');
        mockResponseFactory = () =>
            new MockNextResponse(passthrough, {
                status: 200,
                headers: new Headers({ 'content-type': 'text/html' }),
            });

        const { withCzTypography } = await import('../src/next/middleware.js');
        const middleware = withCzTypography({ shouldProcess: () => false });
        const response = await middleware({});
        expect(response.body).toBe(passthrough);
    });
});
