import React from 'react';
import PropTypes from 'prop-types';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeSanitize, { defaultSchema } from 'rehype-sanitize';

/**
 * Markdown rendering for block content.
 *
 * `rehype-raw` is deliberately NOT in the plugin list. Without it, raw HTML
 * sitting in a stored document is escaped and shown as text instead of being
 * parsed into elements — so a `<script>` or an `onerror=` attribute that ever
 * reaches the database is inert, and rehype-sanitize is a second line of
 * defence rather than the only one.
 *
 * Note this is only for *block* content. The existing content fields
 * (hero, services, education, …) are not markdown and keep using
 * `formatTextWithBackticks`; inline code is mapped to the same green span here
 * so the two conventions look identical on the page and the admin's backtick
 * muscle memory carries over.
 */

const dedupe = list => Array.from(new Set(list));

/** GitHub's default schema, plus the few attributes the renderers rely on. */
export const SANITIZE_SCHEMA = {
  ...defaultSchema,
  tagNames: dedupe([...(defaultSchema.tagNames || []), 'span']),
  attributes: {
    ...defaultSchema.attributes,
    code: dedupe([...(defaultSchema.attributes?.code || []), 'className']),
    span: dedupe([...(defaultSchema.attributes?.span || []), 'className']),
    a: dedupe([...(defaultSchema.attributes?.a || []), 'target', 'rel']),
  },
};

const REMARK_PLUGINS = [remarkGfm];
const REHYPE_PLUGINS = [[rehypeSanitize, SANITIZE_SCHEMA]];

/** Pull the raw source out of a hast <pre><code> so we can rebuild it ourselves. */
const codeTextOf = node => {
  const child = node?.children?.[0];
  if (!child || child.tagName !== 'code') return { text: '', className: undefined };
  const text = (child.children || []).map(n => n.value || '').join('');
  const className = child.properties?.className;
  return {
    text,
    className: Array.isArray(className) ? className.join(' ') : className || undefined,
  };
};

/**
 * react-markdown passes the hast `node` to every override. It must not reach
 * the DOM element or React renders `node="[object Object]"` as an attribute.
 */
const omitNode = props => {
  const rest = { ...props };
  delete rest.node;
  return rest;
};

export const MD_COMPONENTS = {
  /**
   * Block code. Rendered from the hast node rather than from `children`, which
   * means the `code` override below only ever has to deal with the inline case
   * — react-markdown v9+ dropped the `inline` prop and there is otherwise no
   * reliable way to tell a fenced block without a language from inline code.
   */
  pre: ({ node, ...props }) => {
    const { text, className } = codeTextOf(node);
    return (
      <pre className="md-pre" {...props}>
        <code className={className}>{text}</code>
      </pre>
    );
  },

  /** Inline code → the same green span the backtick mini-syntax produces. */
  code: ({ children, className, ...props }) => (
    <span className={['md-code', className].filter(Boolean).join(' ')} {...omitNode(props)}>
      {children}
    </span>
  ),

  a: ({ children, href, ...props }) => (
    <a href={href} target="_blank" rel="noopener noreferrer" {...omitNode(props)}>
      {children}
    </a>
  ),

  img: ({ alt, ...props }) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img alt={alt || ''} loading="lazy" {...omitNode(props)} />
  ),

  table: ({ children, ...props }) => (
    <div className="md-table-scroll">
      <table {...omitNode(props)}>{children}</table>
    </div>
  ),
};

MD_COMPONENTS.pre.propTypes = { node: PropTypes.object };
MD_COMPONENTS.code.propTypes = { children: PropTypes.node, className: PropTypes.string };
MD_COMPONENTS.a.propTypes = { children: PropTypes.node, href: PropTypes.string };
MD_COMPONENTS.img.propTypes = { alt: PropTypes.string };
MD_COMPONENTS.table.propTypes = { children: PropTypes.node };

const PROSE_CSS = `
.md-prose { color: var(--slate); font-size: var(--fz-lg); line-height: 1.7; }
.md-prose > *:first-child { margin-top: 0; }
.md-prose > *:last-child { margin-bottom: 0; }
.md-prose h1, .md-prose h2, .md-prose h3, .md-prose h4 {
  color: var(--lightest-slate); line-height: 1.25; margin: 1.6em 0 0.6em;
}
.md-prose h1 { font-size: var(--fz-heading); }
.md-prose h2 { font-size: var(--fz-xxl); }
.md-prose h3 { font-size: var(--fz-xl); }
.md-prose h4 { font-size: var(--fz-lg); }
.md-prose p { margin: 0 0 1em; }
.md-prose strong { color: var(--lightest-slate); font-weight: 600; }
.md-prose em { color: var(--light-slate); }
.md-prose ul, .md-prose ol { margin: 0 0 1em; padding-left: 1.4em; }
.md-prose li { margin-bottom: 0.4em; }
.md-prose ul li::marker { color: var(--green); }
.md-prose a {
  color: var(--green); text-decoration: none;
  border-bottom: 1px solid transparent; transition: var(--transition);
}
.md-prose a:hover, .md-prose a:focus-visible { border-bottom-color: var(--green); }
.md-code {
  color: var(--green); font-family: var(--font-mono);
  font-size: 0.92em; word-break: break-word;
}
.md-prose .md-pre {
  background-color: var(--light-navy); border: 1px solid var(--lightest-navy);
  border-radius: var(--border-radius); padding: 1.1em 1.2em; margin: 0 0 1em;
  overflow-x: auto;
}
.md-prose .md-pre code {
  color: var(--light-slate); font-family: var(--font-mono);
  font-size: var(--fz-sm); line-height: 1.6; background: none; white-space: pre;
}
.md-prose blockquote {
  margin: 0 0 1em; padding: 0.2em 0 0.2em 1.2em;
  border-left: 2px solid var(--green); color: var(--light-slate);
}
.md-prose hr { border: 0; border-top: 1px solid var(--lightest-navy); margin: 2em 0; }
.md-prose img { max-width: 100%; height: auto; border-radius: var(--border-radius); }
.md-table-scroll { overflow-x: auto; margin: 0 0 1em; }
.md-prose table { border-collapse: collapse; width: 100%; font-size: var(--fz-md); }
.md-prose th, .md-prose td {
  border: 1px solid var(--lightest-navy); padding: 0.5em 0.8em; text-align: left;
}
.md-prose th { color: var(--lightest-slate); font-family: var(--font-mono); font-size: var(--fz-sm); }
.md-prose input[type='checkbox'] { margin-right: 0.5em; accent-color: var(--green); }
`;

/** Prose stylesheet, hoisted and de-duplicated by React via href + precedence. */
export const MarkdownStyles = () => (
  <style href="md-prose" precedence="block">
    {PROSE_CSS}
  </style>
);

/**
 * Render a markdown string. Safe to call with `undefined`, `null` or a
 * non-string — a bad value renders nothing rather than throwing.
 */
const Markdown = ({ children, className }) => {
  const source = typeof children === 'string' ? children : '';
  return (
    <div className={['md-prose', className].filter(Boolean).join(' ')}>
      <MarkdownStyles />
      {source ? (
        <ReactMarkdown
          remarkPlugins={REMARK_PLUGINS}
          rehypePlugins={REHYPE_PLUGINS}
          components={MD_COMPONENTS}
        >
          {source}
        </ReactMarkdown>
      ) : null}
    </div>
  );
};

Markdown.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
};

export { Markdown };
export default Markdown;
