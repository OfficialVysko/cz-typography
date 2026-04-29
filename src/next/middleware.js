import { NextResponse } from 'next/server';
import { createFixCzechStream } from '../fixCzechHtml.js';

/**
 * @typedef {object} WithCzTypographyOptions
 * @property {import('../fixCzech.js').FixCzechOptions} [options] Rule toggles.
 * @property {(request: any) => boolean} [shouldProcess]          Custom predicate – return false to skip.
 * @property {string[]} [contentTypes=['text/html']]              Content-Type substrings that trigger transformation.
 */

const DEFAULT_CONTENT_TYPES = ['text/html'];

/**
 * Build a Next.js middleware that pipes every HTML response through
 * {@link createFixCzechStream}. Streaming-friendly – the response body
 * is not buffered, which keeps Suspense and RSC payload behaviour
 * intact.
 *
 * Usage in `middleware.ts`:
 *
 * ```ts
 * import { withCzTypography } from 'cz-typography/next/middleware';
 *
 * export const middleware = withCzTypography();
 *
 * export const config = {
 *     matcher: '/((?!api|_next/static|_next/image|favicon.ico).*)',
 * };
 * ```
 *
 * @param {WithCzTypographyOptions} [config]
 */
export function withCzTypography(config = {}) {
    const {
        options,
        shouldProcess,
        contentTypes = DEFAULT_CONTENT_TYPES,
    } = config;

    return async function middleware(request) {
        if (typeof shouldProcess === 'function' && !shouldProcess(request)) {
            return NextResponse.next();
        }

        const response = NextResponse.next();

        const contentType = response.headers.get('content-type') ?? '';
        const matches = contentTypes.some((ct) => contentType.includes(ct));
        if (!matches || !response.body) {
            return response;
        }

        const transformed = response.body.pipeThrough(createFixCzechStream(options));
        const headers = new Headers(response.headers);
        headers.delete('content-length');

        return new NextResponse(transformed, {
            status: response.status,
            statusText: response.statusText,
            headers,
        });
    };
}

export { withCzTypography as default };
