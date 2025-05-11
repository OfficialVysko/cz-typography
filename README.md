# 📝 CZ-TYPOGRAPHY

Easily fix Czech typography with JavaScript and React.

**Automatically replaces spaces after single-letter conjunctions and prepositions (a, v, s, z...) so they don't stay at the end of the line – in violation of [Czech spelling rules](https://prirucka.ujc.cas.cz/?id=880)!**

Developed and maintained by [Jan Vyskočil](https://github.com/OfficialVysko) (aka Vysko).


## Features

Replace normal spaces with **non-breaking spaces (`\u00A0`)**:

- after one-letter prepositions and conjuctions (`k autu`, `v domě`)
- between numbers and units (`100 km`, `30 °C`)
- between initials and surnames (`J. Vyskočil`)


## Instalation

```bash 
$ npm install cz-typography
# or
$ yarn add cz-typography
```


## 📍 Usage

### JavaScript function

```js
import { fixCzech } from "cz-typography"

fixCzech('J. Novák běžel 5 km v domě.');
// => 'J.\u00A0Novák běžel 5\u00A0km v\u00A0domě.'

```

### React component

> **⚠️ REQUIRES `react@16.8.0` or newer**<br/>
> *(React is not required if you only use the JS function)*

```js
import TypoWrapper from 'cz-typography/react';

<TypoWrapper>
  <p>J. Novák běžel 5 km v domě.</p>
</TypoWrapper>
```
The <TypoWrapper> recursively walks through all text nodes in the JSX tree and applies the same typographic rules.
> ✅ Works in Server-side rendering (SSR) <br/>
> ❌  **Cannot access** nested content inside server components (like `layout.js` in Next.js) – **use it closer to actual content** (e.g. in `page.js`).

## Optional configuration

You can disable individual features.<br/>
All the features are enabled **by default**:

```js
fixCzech(text, {
  prepositions: true, // enables fixing one-letter prepositions/conjunctions
  units: true,        // enables fixing number+unit
  initials: true      // enables fixing initial+surname
});

<TypoWrapper options={
  prepositions: true,
  units: true,
  initials: true
}>
```
