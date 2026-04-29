# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [2.0.0] – 2026-04-29

Universal rewrite – every layer is new.

### Added

- New core rules: `dates`, `ordinals`, `roman`, `thousands`.
- Currency, Ohm, percent and many other units (`Kč`, `€`, `$`, `£`, `EUR`, `USD`, `Ω`, `‰`).
- `fixCzechHtml(html, options?)` – HTML-aware processor that ignores tags, attributes, scripts, styles, pre/code/textarea blocks and HTML comments.
- `createFixCzechStream(options?)` – Web-Streams `TransformStream` for streaming SSR responses.
- `createFixCzechProcessor(options?)` – stateful synchronous processor for chunked input.
- `<TypoWrapper mode="dom">` – walks the rendered DOM after mount and observes future mutations, so it can fix text inside arbitrarily nested components.
- `<Typo>` async server component for RSC frameworks.
- `useFixCzech(text, options?)` React hook.
- `fixCzechDom(node, options?)` and `observeCzechDom(node, options?)` low-level DOM utilities.
- `cz-typography/next/middleware` – ready-made Next.js middleware that pipes the HTML response stream through `createFixCzechStream`.
- `cz-typography/next/loader` – optional webpack loader that rewrites static JSX text literals at build time.
- TypeScript declarations (`.d.ts`) generated from JSDoc.
- Vitest test suite (≥ 89 tests covering rules, HTML processor, streaming, React components, Next.js middleware).
- ESLint flat config + Prettier.
- GitHub Actions CI matrix (Node 18, 20, 22) and release workflow.
- Examples (`examples/`).

### Changed

- Package is now **dual ESM/CJS** with a proper `exports` map.
- `<TypoWrapper>` is explicitly marked `'use client'`, accepts both shortcut props and an `options` object, memoises its work and fixes the cloneElement key fall-through bug.
- One-letter preposition fix is **case-insensitive** (`K Tobě`, `V domě`, `S Petrem`).
- Strict single-letter units (`m`, `s`, `g`, `K`, `V`, `A`, `W`, `J`, `B`, `l`, `t`) are gated by punctuation/end-of-string boundaries to avoid false positives like `5 m něco` or `5 K později`.
- Number-to-unit fix runs **after** thousands so `10 000 km` becomes `10\u00A0000\u00A0km`.

### Fixed

- `K Tobě` and other capitalised prepositions at the start of a sentence are now glued.
- Initials inside HTML tags (`<h1>Karel IV.</h1>`) get fixed thanks to the new HTML-aware processor.
- The cloneElement key conflict for non-element children.
- Chains of initials (`J. R. R. Tolkien`) are fully fixed.

### Migration

Read [README.md → Migrating from v1](README.md#migrating-from-v1).

## [1.0.0]

Initial release: `fixCzech` and `<TypoWrapper>`.
