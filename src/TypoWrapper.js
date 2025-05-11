import React from 'react';
import fixCzech from './fixCzech.js';

/**
 * Recursively processes React nodes and applies fixCzech() to all text nodes.
 */
function processChildren(node, options) {
    if (typeof node === 'string') {
        return fixCzech(node, options);
    }

    if (Array.isArray(node)) {
        return node.map((child, index) => {
            const processed = processChildren(child, options);
            return React.isValidElement(processed)
                ? React.cloneElement(processed, { key: processed.key || index })
                : processed;
        });
    }

    if (React.isValidElement(node)) {
        const newProps = {
            ...node.props,
            children: processChildren(node.props.children, options),
        };
        return React.cloneElement(node, newProps);
    }

    return node;
}

/**
 * React component that automatically applies Czech typographic fixes
 * to all text nodes within its children.
 *
 * Supports three types of fixes, each of which can be individually enabled or disabled via props:
 * - non-breaking spaces after one-letter prepositions/conjunctions (e.g. "k autu")
 * - non-breaking spaces between numbers and units (e.g. "100 km")
 * - non-breaking spaces between initials and surnames (e.g. "J. Novák")
 *
 * @param {object} props
 * @param {React.ReactNode} props.children - The JSX content to process
 * @param {boolean} [props.prepositions=true] - Enable/disable fix for single-letter prepositions/conjunctions
 * @param {boolean} [props.units=true] - Enable/disable fix for numbers followed by units
 * @param {boolean} [props.initials=true] - Enable/disable fix for initials followed by surnames
 * @returns {JSX.Element}
 */
export default function TypoWrapper({
    children,
    prepositions = true,
    units = true,
    initials = true
}) {
    const options = { prepositions, units, initials };
    const processed = processChildren(children, options);
    return <>{processed}</>;
}
