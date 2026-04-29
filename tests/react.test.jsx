import { afterEach, describe, expect, it } from 'vitest';
import { render, screen, cleanup, waitFor } from '@testing-library/react';
import { TypoWrapper } from '../src/TypoWrapper.js';
import { useFixCzech } from '../src/useFixCzech.js';

const NBSP = '\u00A0';

afterEach(() => cleanup());

describe('<TypoWrapper> in jsx mode', () => {
    it('fixes direct text children', () => {
        render(
            <TypoWrapper>
                <p data-testid="t">v domě</p>
            </TypoWrapper>,
        );
        expect(screen.getByTestId('t').textContent).toBe(`v${NBSP}domě`);
    });

    it('fixes nested elements with direct text', () => {
        render(
            <TypoWrapper>
                <article>
                    <h1 data-testid="title">Karel IV.</h1>
                    <p data-testid="body">v domě a v práci</p>
                </article>
            </TypoWrapper>,
        );
        expect(screen.getByTestId('title').textContent).toBe(`Karel${NBSP}IV.`);
        expect(screen.getByTestId('body').textContent).toBe(`v${NBSP}domě a${NBSP}v${NBSP}práci`);
    });

    it('honours options prop', () => {
        render(
            <TypoWrapper options={{ prepositions: false }}>
                <p data-testid="t">v domě 5 km</p>
            </TypoWrapper>,
        );
        expect(screen.getByTestId('t').textContent).toBe(`v domě 5${NBSP}km`);
    });

    it('accepts shortcut props', () => {
        render(
            <TypoWrapper prepositions={false}>
                <p data-testid="t">v domě</p>
            </TypoWrapper>,
        );
        expect(screen.getByTestId('t').textContent).toBe('v domě');
    });
});

describe('<TypoWrapper> in dom mode', () => {
    it('fixes text inside nested components after mount', async () => {
        function Inner() {
            return <p data-testid="t">v domě a v práci</p>;
        }
        render(
            <TypoWrapper mode="dom">
                <Inner />
            </TypoWrapper>,
        );
        await waitFor(() => {
            expect(screen.getByTestId('t').textContent).toBe(
                `v${NBSP}domě a${NBSP}v${NBSP}práci`,
            );
        });
    });

    it('skips script/style/code/textarea content', async () => {
        render(
            <TypoWrapper mode="dom">
                <div>
                    <p data-testid="text">v domě</p>
                    <code data-testid="code">v domě</code>
                    <textarea data-testid="ta" defaultValue="v domě" />
                </div>
            </TypoWrapper>,
        );
        await waitFor(() => {
            expect(screen.getByTestId('text').textContent).toBe(`v${NBSP}domě`);
        });
        expect(screen.getByTestId('code').textContent).toBe('v domě');
        expect(screen.getByTestId('ta').value).toBe('v domě');
    });
});

describe('useFixCzech hook', () => {
    it('returns the fixed string', () => {
        function Component() {
            const fixed = useFixCzech('v domě');
            return <span data-testid="h">{fixed}</span>;
        }
        render(<Component />);
        expect(screen.getByTestId('h').textContent).toBe(`v${NBSP}domě`);
    });
});
