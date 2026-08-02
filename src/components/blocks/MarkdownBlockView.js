import React from 'react';
import PropTypes from 'prop-types';
import Markdown from '../../utils/markdown';

/**
 * Renderer signature across every block: ({ block, section, index }).
 * Server component — no hooks, no state, no browser globals.
 *
 * Everything is read defensively: a block stored before a field existed, or
 * with a value the schema would now reject, renders a degraded version rather
 * than throwing and taking the whole page down.
 */

const CSS = `
.block--markdown { margin: 0 auto 40px; }
.block--markdown .block-markdown-inner { width: 100%; }
@media (max-width: 480px) { .block--markdown { margin-bottom: 30px; } }
`;

const clampWidth = value => {
  const n = Number(value);
  if (!Number.isFinite(n)) return 700;
  return Math.min(1200, Math.max(320, Math.round(n)));
};

const MarkdownBlockView = ({ block }) => {
  const b = block || {};
  const body = typeof b.body === 'string' ? b.body : '';
  if (!body.trim()) return null;

  const align = b.align === 'center' ? 'center' : 'left';

  return (
    <div className={`block block--${b.type || 'markdown'}`}>
      <style href="block-markdown" precedence="block">
        {CSS}
      </style>
      <div
        className="block-markdown-inner"
        style={{
          maxWidth: `${clampWidth(b.maxWidth)}px`,
          marginLeft: align === 'center' ? 'auto' : undefined,
          marginRight: align === 'center' ? 'auto' : undefined,
          textAlign: align,
        }}
      >
        <Markdown>{body}</Markdown>
      </div>
    </div>
  );
};

MarkdownBlockView.propTypes = {
  block: PropTypes.object,
  section: PropTypes.object,
  index: PropTypes.number,
};

export default MarkdownBlockView;
