import { fixCzech } from './fixCzech.js';

const SKIPPED_TAGS = new Set(['SCRIPT', 'STYLE', 'PRE', 'CODE', 'TEXTAREA']);

const ELEMENT_NODE = 1;
const TEXT_NODE = 3;

const processedNodes = new WeakSet();

function shouldSkipParent(element) {
    let parent = element;
    while (parent && parent.nodeType === ELEMENT_NODE) {
        if (SKIPPED_TAGS.has(parent.nodeName)) return true;
        if (parent.isContentEditable) return true;
        parent = parent.parentNode;
    }
    return false;
}

function processTextNode(node, options) {
    if (!node.nodeValue) return;
    if (processedNodes.has(node)) return;
    if (shouldSkipParent(node.parentNode)) return;
    const fixed = fixCzech(node.nodeValue, options);
    if (fixed !== node.nodeValue) {
        node.nodeValue = fixed;
    }
    processedNodes.add(node);
}

function walk(node, options) {
    if (!node) return;
    if (node.nodeType === TEXT_NODE) {
        processTextNode(node, options);
        return;
    }
    if (node.nodeType !== ELEMENT_NODE) return;
    if (SKIPPED_TAGS.has(node.nodeName)) return;
    if (node.isContentEditable) return;

    let child = node.firstChild;
    while (child) {
        const next = child.nextSibling;
        walk(child, options);
        child = next;
    }
}

/**
 * Recursively walk a DOM subtree and apply Czech typography rules to
 * every text node, skipping `<script>`, `<style>`, `<pre>`, `<code>`,
 * `<textarea>` and `contenteditable` elements.
 *
 * Idempotent – calling this on the same subtree twice produces the same
 * output (processed text nodes are tracked in a `WeakSet`).
 *
 * @param {Node} root
 * @param {import('./fixCzech.js').FixCzechOptions} [options]
 */
export function fixCzechDom(root, options) {
    if (!root || typeof root !== 'object' || typeof root.nodeType !== 'number') return;
    walk(root, options);
}

/**
 * Begin observing `root` for DOM mutations and apply Czech typography
 * rules to any text nodes that are added or modified. Returns a
 * disconnect function.
 *
 * @param {Node} root
 * @param {import('./fixCzech.js').FixCzechOptions} [options]
 * @returns {() => void}
 */
export function observeCzechDom(root, options) {
    if (!root) return () => {};
    fixCzechDom(root, options);

    if (typeof MutationObserver === 'undefined') return () => {};

    const observer = new MutationObserver((mutations) => {
        for (const mutation of mutations) {
            if (mutation.type === 'characterData') {
                processedNodes.delete(mutation.target);
                if (mutation.target.nodeType === TEXT_NODE) {
                    processTextNode(mutation.target, options);
                }
                continue;
            }
            for (const added of mutation.addedNodes) {
                walk(added, options);
            }
        }
    });

    observer.observe(root, {
        childList: true,
        subtree: true,
        characterData: true,
    });

    return () => observer.disconnect();
}
