import { renderToStaticMarkup } from 'react-dom/server';
import { fixCzechHtml } from './fixCzechHtml.js';

/**
 * @typedef {object} TypoProps
 * @property {React.ReactNode} [children]
 * @property {import('./fixCzech.js').FixCzechOptions} [options]
 * @property {string} [as='span']
 */

/**
 * Async server component that renders its children to static markup,
 * applies {@link fixCzechHtml}, and re-injects the fixed markup via
 * `dangerouslySetInnerHTML`.
 *
 * Suitable for self-contained text fragments (article body, headline,
 * description). **Loses client interactivity inside the wrapped tree** –
 * for whole-page coverage use the Next.js middleware or a Vite SSR
 * pipeline instead.
 *
 * @param {TypoProps} props
 */
export default function Typo({ children, options, as: Tag = 'span' }) {
    const html = renderToStaticMarkup(<>{children}</>);
    const fixed = fixCzechHtml(html, options);
    return <Tag dangerouslySetInnerHTML={{ __html: fixed }} />;
}
