import { describe, expect, it } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';
import Typo from '../src/Typo.server.js';

const NBSP = '\u00A0';

describe('<Typo> server component', () => {
    it('renders fixed HTML', () => {
        const out = renderToStaticMarkup(
            <Typo>
                <p>v domě</p>
            </Typo>,
        );
        expect(out).toContain(`v${NBSP}domě`);
    });

    it('respects options', () => {
        const out = renderToStaticMarkup(
            <Typo options={{ prepositions: false }}>
                <p>v domě 5 km</p>
            </Typo>,
        );
        expect(out).not.toContain(`v${NBSP}domě`);
        expect(out).toContain(`5${NBSP}km`);
    });

    it('honours the `as` prop', () => {
        const out = renderToStaticMarkup(
            <Typo as="div">
                <p>v domě</p>
            </Typo>,
        );
        expect(out.startsWith('<div')).toBe(true);
    });
});
