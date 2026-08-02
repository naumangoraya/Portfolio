import React from 'react';
import PropTypes from 'prop-types';
import { formatTextWithGreenBackticks } from '../../utils/textFormatting';

const CSS = `
.block--timeline { margin: 0 0 50px; }
.block--timeline .block-timeline { list-style: none; margin: 0; padding: 0; position: relative; }
.block--timeline .block-timeline::before {
  content: '';
  position: absolute;
  top: 6px;
  bottom: 6px;
  left: 7px;
  width: 1px;
  background-color: var(--lightest-navy);
}
.block--timeline .block-timeline-item { position: relative; padding: 0 0 32px 34px; }
.block--timeline .block-timeline-item:last-child { padding-bottom: 0; }
.block--timeline .block-timeline-item::before {
  content: '';
  position: absolute;
  top: 6px;
  left: 2px;
  width: 11px;
  height: 11px;
  border-radius: 50%;
  background-color: var(--navy);
  border: 2px solid var(--green);
}
.block--timeline .block-timeline-head {
  display: flex;
  align-items: baseline;
  flex-wrap: wrap;
  gap: 6px 10px;
}
.block--timeline .block-timeline-logo {
  width: 34px;
  height: 34px;
  object-fit: contain;
  border-radius: var(--border-radius);
  background-color: var(--light-navy);
  margin-bottom: 8px;
}
.block--timeline .block-timeline-title {
  color: var(--lightest-slate);
  font-size: var(--fz-xl);
  font-weight: 600;
  margin: 0;
  line-height: 1.3;
}
.block--timeline .block-timeline-title a { color: inherit; text-decoration: none; transition: var(--transition); }
.block--timeline .block-timeline-title a:hover,
.block--timeline .block-timeline-title a:focus-visible { color: var(--green); }
.block--timeline .block-timeline-subtitle {
  color: var(--green);
  font-family: var(--font-mono);
  font-size: var(--fz-sm);
}
.block--timeline .block-timeline-range {
  color: var(--slate);
  font-family: var(--font-mono);
  font-size: var(--fz-xs);
  margin: 4px 0 8px;
}
.block--timeline .block-timeline-body {
  color: var(--light-slate);
  font-size: var(--fz-md);
  line-height: 1.7;
  margin: 0;
}
@media (max-width: 768px) {
  .block--timeline .block-timeline-item { padding-left: 28px; padding-bottom: 26px; }
  .block--timeline .block-timeline-title { font-size: var(--fz-lg); }
}
@media (max-width: 480px) {
  .block--timeline .block-timeline-body { font-size: var(--fz-sm); }
}
`;

const TimelineView = ({ block }) => {
  const b = block || {};
  const items = Array.isArray(b.items) ? b.items.filter(Boolean) : [];
  if (items.length === 0) return null;

  return (
    <div className={`block block--${b.type || 'timeline'}`}>
      <style href="block-timeline" precedence="block">
        {CSS}
      </style>
      <ol className="block-timeline">
        {items.map((item, i) => {
          const it = item || {};
          const href = typeof it.href === 'string' ? it.href.trim() : '';
          const external = /^https?:\/\//i.test(href);
          const logoUrl = typeof it.logo?.url === 'string' ? it.logo.url.trim() : '';
          const title = it.title ? formatTextWithGreenBackticks(it.title) : null;

          return (
            <li key={it.id || i} className="block-timeline-item">
              {logoUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  className="block-timeline-logo"
                  src={logoUrl}
                  alt={it.logo?.alt || ''}
                  loading="lazy"
                />
              ) : null}
              <div className="block-timeline-head">
                {title ? (
                  <h3 className="block-timeline-title">
                    {href ? (
                      <a
                        href={href}
                        {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                      >
                        {title}
                      </a>
                    ) : (
                      title
                    )}
                  </h3>
                ) : null}
                {it.subtitle ? (
                  <span className="block-timeline-subtitle">
                    {formatTextWithGreenBackticks(it.subtitle)}
                  </span>
                ) : null}
              </div>
              {it.range ? <div className="block-timeline-range">{it.range}</div> : null}
              {it.body ? (
                <p className="block-timeline-body">{formatTextWithGreenBackticks(it.body)}</p>
              ) : null}
            </li>
          );
        })}
      </ol>
    </div>
  );
};

TimelineView.propTypes = {
  block: PropTypes.object,
  section: PropTypes.object,
  index: PropTypes.number,
};

export default TimelineView;
