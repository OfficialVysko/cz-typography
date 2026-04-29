'use client';

import React, { useEffect, useMemo, useRef } from 'react';
import { fixCzech } from './fixCzech.js';
import { observeCzechDom } from './fixCzechDom.js';

function processChildren(node, options) {
    if (typeof node === 'string') {
        return fixCzech(node, options);
    }

    if (typeof node === 'number' || typeof node === 'boolean' || node == null) {
        return node;
    }

    if (Array.isArray(node)) {
        return node.map((child, index) => {
            const processed = processChildren(child, options);
            if (React.isValidElement(processed) && processed.key == null) {
                return React.cloneElement(processed, { key: index });
            }
            return processed;
        });
    }

    if (React.isValidElement(node)) {
        const props = node.props;
        if (props == null || props.children == null) return node;
        return React.cloneElement(node, {
            ...props,
            children: processChildren(props.children, options),
        });
    }

    return node;
}

function normaliseOptions(props) {
    if (props.options) return props.options;
    const {
        prepositions,
        units,
        initials,
        dates,
        ordinals,
        roman,
        thousands,
    } = props;
    const result = {};
    if (prepositions !== undefined) result.prepositions = prepositions;
    if (units !== undefined) result.units = units;
    if (initials !== undefined) result.initials = initials;
    if (dates !== undefined) result.dates = dates;
    if (ordinals !== undefined) result.ordinals = ordinals;
    if (roman !== undefined) result.roman = roman;
    if (thousands !== undefined) result.thousands = thousands;
    return result;
}

/**
 * @typedef {object} TypoWrapperProps
 * @property {React.ReactNode} [children]                 Child JSX/text to process.
 * @property {'jsx' | 'dom'}    [mode='jsx']             Processing strategy.
 * @property {import('./fixCzech.js').FixCzechOptions} [options] All rule toggles in one object.
 * @property {boolean} [prepositions]                    Shortcut for `options.prepositions`.
 * @property {boolean} [units]                           Shortcut for `options.units`.
 * @property {boolean} [initials]                        Shortcut for `options.initials`.
 * @property {boolean} [dates]                           Shortcut for `options.dates`.
 * @property {boolean} [ordinals]                        Shortcut for `options.ordinals`.
 * @property {boolean} [roman]                           Shortcut for `options.roman`.
 * @property {boolean} [thousands]                       Shortcut for `options.thousands`.
 * @property {string} [as='span']                        Element used to host the DOM-mode subtree.
 */

/**
 * React component that applies Czech typography rules to its children.
 *
 * Two modes:
 *
 * - **`mode="jsx"` (default)** – traverses the React children tree at
 *   render time. Fast, no DOM mutations, but only sees text passed
 *   directly as children (won't reach into `<App />`).
 * - **`mode="dom"`** – after mount, walks the rendered DOM subtree and
 *   fixes every text node, then uses a `MutationObserver` to keep
 *   following changes. Works for the entire app even when wrapping
 *   `<App />` in pure React or arbitrary nested components. SSR-safe –
 *   does nothing during server rendering, applies after hydration.
 *
 * @param {TypoWrapperProps} props
 * @returns {JSX.Element}
 */
export function TypoWrapper(props) {
    const { children, mode = 'jsx', as: Tag = 'span' } = props;
    const options = useMemo(
        () => normaliseOptions(props),
        // Each tracked prop is a primitive boolean (or an object reference
        // explicitly supplied by the caller), so listing them keeps the
        // memo stable across renders that pass identical config.
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [
            props.options,
            props.prepositions,
            props.units,
            props.initials,
            props.dates,
            props.ordinals,
            props.roman,
            props.thousands,
        ],
    );

    const containerRef = useRef(null);
    const processedJsx = useMemo(
        () => (mode === 'jsx' ? processChildren(children, options) : null),
        [mode, children, options],
    );

    useEffect(() => {
        if (mode !== 'dom') return undefined;
        const target = containerRef.current;
        if (!target) return undefined;
        return observeCzechDom(target, options);
    }, [mode, options]);

    if (mode === 'dom') {
        return (
            <Tag ref={containerRef} style={{ display: 'contents' }}>
                {children}
            </Tag>
        );
    }

    return <>{processedJsx}</>;
}

export default TypoWrapper;
