import React from 'react';
import PropTypes from 'prop-types';
import { BLOCK_RENDERERS } from './index';

/**
 * Renders one custom section: a heading plus its ordered blocks.
 *
 * Server component. An unknown block type renders `null` instead of throwing —
 * that is the whole point of the lookup-with-fallback below. A section authored
 * against a newer deploy (or a hand-edited document) degrades to "that block is
 * missing" rather than a 500 on the page it lives on.
 */

const CSS = `
.custom-section { max-width: 1000px; margin: 0 auto 100px; padding: 0 20px; }
.custom-section > .block:last-child { margin-bottom: 0; }
@media (max-width: 768px) { .custom-section { margin-bottom: 70px; } }
@media (max-width: 480px) { .custom-section { padding: 0 15px; margin-bottom: 50px; } }
`;

const CustomSection = ({ section }) => {
  const s = section || {};
  const heading = typeof s.title === 'string' ? s.title : s.heading || '';
  const blocks = (Array.isArray(s.blocks) ? s.blocks : []).filter(
    block => block && block.visible !== false
  );

  if (!heading && blocks.length === 0) return null;

  return (
    <section id={s.anchorId || undefined} className="custom-section">
      <style href="custom-section" precedence="block">
        {CSS}
      </style>

      {heading ? <h2 className={s.numbered ? 'numbered-heading' : undefined}>{heading}</h2> : null}

      {blocks.map((block, index) => {
        const Renderer = BLOCK_RENDERERS[block.type];
        if (!Renderer) return null;
        return (
          <Renderer
            key={block.id || `${block.type}-${index}`}
            block={block}
            section={s}
            index={index}
          />
        );
      })}
    </section>
  );
};

CustomSection.propTypes = {
  section: PropTypes.object,
};

export default CustomSection;
