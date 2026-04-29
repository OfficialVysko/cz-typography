# cz-typography

Universal Czech typography fixer for JavaScript, React, Next.js and any SSR framework.

Replaces regular spaces with **non-breaking spaces** (`\u00A0`) so the resulting text obeys [Czech orthography rules](https://prirucka.ujc.cas.cz/?id=880). One-letter prepositions, conjunctions, units, dates, initials and more never end up dangling at the end of a line.

Maintained by [Jan Vyskočil](https://github.com/OfficialVysko) (a.k.a. Vysko).

## Features

- One-letter prepositions and conjunctions: `k`, `s`, `v`, `z`, `o`, `u`, `a`, `i` – glued to the next word, **case-insensitive**.
- Numbers + units: `5 km`, `30 °C`, `100 Kč`, `5 €`, `100 Ω`, `1.5 kWh`, `120 km/h`, `25 %`.
- Dates: `5. 12. 2024`, `5. 12.`.
- Ordinal numbers before lowercase words: `1. ledna`, `25. listopadu`.
- Initials: `J. Novák`, `J. R. R. Tolkien`.
- Roman numerals after names: `Karel IV.`, `Jindřich VIII.`.
- Thousands separators: `10 000` → `10\u00A0000`, `1 000 000`.

Every rule can be turned off individually.

## Installation

```bash
npm install cz-typography
# or
yarn add cz-typography
# or
pnpm add cz-typography
```

Peer deps `react`, `react-dom` and `next` are optional – install only what you actually use.

## Quick start

### Plain JavaScript

```js
import { fixCzech } from 'cz-typography';

fixCzech('J. Novák běžel 5 km v domě.');
// => 'J.\u00A0Novák běžel 5\u00A0km v\u00A0domě.'
```

### Pure React (Vite, CRA, anywhere)

Wrap your application in `<TypoWrapper mode="dom">` and let it walk the rendered DOM after mount. This is the only way to fix text that lives inside nested components (`<App />`, third-party components, …).

```jsx
import { createRoot } from 'react-dom/client';
import { TypoWrapper } from 'cz-typography/react';
import App from './App';

createRoot(document.getElementById('root')).render(
    <TypoWrapper mode="dom">
        <App />
    </TypoWrapper>,
);
```

For small JSX fragments where you control the text directly, the default `mode="jsx"` is fast and side-effect-free:

```jsx
<TypoWrapper>
    <p>v domě</p>
    <p>Karel IV. žil v 14. století.</p>
</TypoWrapper>
```

### React SSR (Express, Vite SSR, Astro, Remix, …)

Run `fixCzechHtml` on the rendered HTML before sending the response.

```js
import { renderToString } from 'react-dom/server';
import { fixCzechHtml } from 'cz-typography';
import App from './App.jsx';

app.get('*', (req, res) => {
    res.send(fixCzechHtml(renderToString(<App />)));
});
```

For streaming SSR pipe the response through `createFixCzechStream`:

```js
import { renderToReadableStream } from 'react-dom/server';
import { createFixCzechStream } from 'cz-typography';

const stream = await renderToReadableStream(<App />);
return new Response(stream.pipeThrough(createFixCzechStream()), {
    headers: { 'content-type': 'text/html' },
});
```

### Next.js App Router (whole-website coverage)

Drop a single `middleware.ts` in your Next.js root and every HTML response will be fixed on the fly. Streaming, RSC payload and Suspense are preserved.

```ts
import { withCzTypography } from 'cz-typography/next/middleware';

export const middleware = withCzTypography();

export const config = {
    matcher: '/((?!api|_next/static|_next/image|favicon.ico).*)',
};
```

Need fine-grained control inside server components?

```jsx
import { Typo } from 'cz-typography/react';

export default async function Page() {
    const post = await getPost();
    return (
        <article>
            <Typo>
                <h1>{post.title}</h1>
                <div dangerouslySetInnerHTML={{ __html: post.body }} />
            </Typo>
        </article>
    );
}
```

For dynamic strings inside server components prefer the runtime utility:

```jsx
import { fixCzech } from 'cz-typography';

const post = await getPost();
return <h1>{fixCzech(post.title)}</h1>;
```

#### Optional build-time loader

For sites with a lot of static JSX text you can opt into compile-time rewriting via a webpack loader, then runtime middleware can be skipped (or reduced). Both can be combined safely.

```js
const { withCzTypography } = require('cz-typography/next');
module.exports = withCzTypography({
    /* the rest of next config */
});
```

## API

### `fixCzech(text, options?)`

Apply the rules to a string. Non-strings are returned unchanged so the function is safe to use without guarding.

### `fixCzechHtml(html, options?)`

Tokenises HTML and applies the rules only to text nodes. Tags, attributes, comments, doctype and the contents of `<script>`, `<style>`, `<pre>`, `<code>` and `<textarea>` are preserved.

### `createFixCzechStream(options?)`

Returns a Web-Streams `TransformStream` that processes HTML on the fly. Works on Vercel Edge, Cloudflare Workers, Node.js 18+, Deno and Bun.

### `<TypoWrapper>` (`cz-typography/react`)

Client component with two modes:

- `mode="jsx"` (default) – traverses children passed in JSX.
- `mode="dom"` – walks the rendered DOM after mount and follows future mutations.

Props (all optional):

- `mode` – `'jsx' \| 'dom'`.
- `as` – element used in DOM mode (default `'span'` with `display: contents`).
- `options` – complete options object.
- Shortcut props: `prepositions`, `units`, `initials`, `dates`, `ordinals`, `roman`, `thousands`.

### `<Typo>` (`cz-typography/react`)

Async server component. Renders children to static markup, applies `fixCzechHtml`, re-injects via `dangerouslySetInnerHTML`. **Loses client interactivity inside the wrapped subtree** – use it only on self-contained static fragments.

### `useFixCzech(text, options?)` (`cz-typography/react`)

Memoised React hook returning the fixed string.

### `fixCzechDom(node, options?)` / `observeCzechDom(node, options?)` (`cz-typography/react`)

Lower-level utilities that the DOM mode of `<TypoWrapper>` is built on. Handy if you want to apply the rules to a specific subtree manually.

### `withCzTypography(config?)` (`cz-typography/next/middleware`)

Build a Next.js middleware that pipes HTML responses through the stream. Accepts:

- `options` – rule toggles.
- `shouldProcess(request)` – custom predicate.
- `contentTypes` – content-type substrings to act on (default `['text/html']`).

## Options

```ts
fixCzech(text, {
    prepositions: true,
    units: true,
    initials: true,
    dates: true,
    ordinals: true,
    roman: true,
    thousands: true,
});
```

All defaults are `true`. Set any to `false` to skip that rule.

## When to use what

- **Pure React SPA (Vite/CRA)** → `<TypoWrapper mode="dom">` around `<App />`.
- **Pure React SSR** → `fixCzechHtml(renderToString(...))`.
- **Streaming SSR** → `stream.pipeThrough(createFixCzechStream())`.
- **Next.js App Router – whole site** → `cz-typography/next/middleware`.
- **Next.js App Router – local fragment** → `<Typo>`.
- **Client React fragment anywhere** → `<TypoWrapper>` (jsx mode).
- **Dynamic server text from DB** → `fixCzech(post.title)`.
- **Hook usage** → `useFixCzech(text)`.
- **Astro/Remix/anything else** → `fixCzech` for strings or `fixCzechHtml` for rendered HTML.

## Migrating from v1

`v2` is a major rewrite – breaking changes:

- The package is **dual ESM/CJS** with proper `exports` map.
- The named export of the React component has moved – `import TypoWrapper from 'cz-typography/react'` still works, but `import { TypoWrapper } from 'cz-typography/react'` is the new canonical form.
- New rules (`dates`, `ordinals`, `roman`, `thousands`) are enabled by default.
- The Czech preposition fix is now case-insensitive – `K Tobě` at the start of a sentence works.
- New universal API surface: `fixCzechHtml`, `createFixCzechStream`, `<Typo>`, `useFixCzech`, `fixCzechDom`, `cz-typography/next/middleware`, `cz-typography/next/loader`.

## License

[MIT](LICENSE.md)
