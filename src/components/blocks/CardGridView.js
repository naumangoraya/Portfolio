import React from 'react';
import PropTypes from 'prop-types';
import { formatTextWithGreenBackticks } from '../../utils/textFormatting';

/**
 * Card grid — the services-section card, made configurable.
 *
 * `formatTextWithGreenBackticks` (not `formatTextWithBackticks`) is used on
 * purpose: the link-aware variant attaches onMouseEnter handlers, which a
 * server component cannot emit.
 */

const CSS = `
.block--cardGrid { margin: 0 0 50px; }
.block--cardGrid .block-card-grid { display: grid; gap: 20px; }
.block--cardGrid .cols-2 { grid-template-columns: repeat(2, minmax(0, 1fr)); }
.block--cardGrid .cols-3 { grid-template-columns: repeat(3, minmax(0, 1fr)); }
.block--cardGrid .cols-4 { grid-template-columns: repeat(4, minmax(0, 1fr)); }
.block--cardGrid .block-card {
  position: relative;
  display: flex;
  flex-direction: column;
  padding: 25px;
  background-color: var(--light-navy);
  border: 1px solid var(--lightest-navy);
  border-radius: var(--border-radius);
  box-shadow: 0 10px 30px -15px rgba(2, 12, 27, 0.7);
  transition: var(--transition);
  text-decoration: none;
  color: inherit;
  min-height: 180px;
}
.block--cardGrid a.block-card:hover,
.block--cardGrid a.block-card:focus-visible,
.block--cardGrid .block-card:hover {
  transform: translateY(-5px);
  background-color: var(--navy);
  border-color: var(--green-tint);
  box-shadow: 0 20px 40px -20px rgba(2, 12, 27, 0.8);
}
.block--cardGrid .block-card-icon { font-size: 28px; line-height: 1; margin-bottom: 15px; color: var(--green); }
.block--cardGrid .block-card-media {
  margin: -25px -25px 20px;
  border-radius: var(--border-radius) var(--border-radius) 0 0;
  overflow: hidden;
}
.block--cardGrid .block-card-media img { display: block; width: 100%; height: 160px; object-fit: cover; }
.block--cardGrid .block-card-title {
  color: var(--lightest-slate);
  font-size: var(--fz-xxl);
  font-weight: 600;
  line-height: 1.2;
  margin: 0 0 12px;
}
.block--cardGrid a.block-card:hover .block-card-title { color: var(--green); }
.block--cardGrid .block-card-body {
  color: var(--light-slate);
  font-size: var(--fz-md);
  line-height: 1.7;
  margin: 0;
  flex-grow: 1;
}
@media (max-width: 1024px) {
  .block--cardGrid .cols-4 { grid-template-columns: repeat(3, minmax(0, 1fr)); }
}
@media (max-width: 768px) {
  .block--cardGrid .block-card-grid { gap: 15px; }
  .block--cardGrid .cols-3, .block--cardGrid .cols-4 { grid-template-columns: repeat(2, minmax(0, 1fr)); }
}
@media (max-width: 480px) {
  .block--cardGrid .cols-2, .block--cardGrid .cols-3, .block--cardGrid .cols-4 { grid-template-columns: 1fr; }
}
`;

const COLUMN_CLASSES = { 2: 'cols-2', 3: 'cols-3', 4: 'cols-4' };

const CardGridView = ({ block }) => {
  const b = block || {};
  const cards = Array.isArray(b.cards) ? b.cards.filter(Boolean) : [];
  if (cards.length === 0) return null;

  const columnClass = COLUMN_CLASSES[Number(b.columns)] || COLUMN_CLASSES[3];

  return (
    <div className={`block block--${b.type || 'cardGrid'}`}>
      <style href="block-cardGrid" precedence="block">
        {CSS}
      </style>
      <div className={`block-card-grid ${columnClass}`}>
        {cards.map((card, i) => {
          const c = card || {};
          const href = typeof c.href === 'string' ? c.href.trim() : '';
          const imageUrl = typeof c.image?.url === 'string' ? c.image.url.trim() : '';
          const external = /^https?:\/\//i.test(href);
          const Tag = href ? 'a' : 'div';
          const linkProps = href
            ? {
                href,
                ...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {}),
              }
            : {};

          return (
            <Tag key={c.id || i} className="block-card" {...linkProps}>
              {imageUrl ? (
                <div className="block-card-media">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={imageUrl} alt={c.image?.alt || ''} loading="lazy" />
                </div>
              ) : null}
              {c.icon ? (
                <div className="block-card-icon" aria-hidden="true">
                  {c.icon}
                </div>
              ) : null}
              {c.title ? (
                <h3 className="block-card-title">{formatTextWithGreenBackticks(c.title)}</h3>
              ) : null}
              {c.body ? (
                <p className="block-card-body">{formatTextWithGreenBackticks(c.body)}</p>
              ) : null}
            </Tag>
          );
        })}
      </div>
    </div>
  );
};

CardGridView.propTypes = {
  block: PropTypes.object,
  section: PropTypes.object,
  index: PropTypes.number,
};

export default CardGridView;
