import { describe, expect, it } from 'vitest';
import { fixCzechDom } from '../src/fixCzechDom.js';

const NBSP = '\u00A0';

describe('fixCzechDom (direct)', () => {
    it('walks the DOM and fixes text nodes', () => {
        const root = document.createElement('div');
        root.innerHTML = '<p>v domě a v práci</p>';
        document.body.appendChild(root);

        fixCzechDom(root);
        expect(root.querySelector('p').textContent).toBe(
            `v${NBSP}domě a${NBSP}v${NBSP}práci`,
        );
    });

    it('skips code/pre/script/style/textarea', () => {
        const root = document.createElement('div');
        root.innerHTML =
            '<p id="t">v domě</p><code id="c">v domě</code><pre id="p">v domě</pre>';
        document.body.appendChild(root);

        fixCzechDom(root);
        expect(root.querySelector('#t').textContent).toBe(`v${NBSP}domě`);
        expect(root.querySelector('#c').textContent).toBe('v domě');
        expect(root.querySelector('#p').textContent).toBe('v domě');
    });
});
