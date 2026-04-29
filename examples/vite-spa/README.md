# cz-typography – Vite SPA example

Pure client-side React application that wraps `<App />` in `<TypoWrapper mode="dom">`. The wrapper walks the rendered DOM after mount and follows future mutations via `MutationObserver`, so the entire app gets fixed Czech typography without sprinkling `fixCzech()` everywhere.

## Run locally

```bash
cd examples/vite-spa
npm install
npm run dev
# open http://localhost:5173
```
