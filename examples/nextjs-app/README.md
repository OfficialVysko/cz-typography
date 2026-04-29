# cz-typography – Next.js App Router example

Minimal Next.js 14 project that demonstrates the four ways of using `cz-typography`:

1. **Whole-website middleware** – `middleware.ts` registers `withCzTypography()` and every HTML response is fixed automatically.
2. **`<Typo>` server component** – wraps a self-contained server-rendered fragment.
3. **`<TypoWrapper>` client component** – wraps a client island.
4. **`fixCzech(text)` runtime utility** – for dynamic strings inside server components.

## Run locally

```bash
cd examples/nextjs-app
npm install
npm run dev
# open http://localhost:3000
```

## Files

- `middleware.ts` – global typography middleware.
- `app/layout.tsx` – the layout wraps everything in `<html><body>{children}</body></html>` and the middleware fixes the whole tree.
- `app/page.tsx` – demonstrates dynamic data, `<Typo>`, `<TypoWrapper>` and direct `fixCzech` calls.

This example deliberately keeps everything tiny so you can copy the shape of `middleware.ts` into your own project.
