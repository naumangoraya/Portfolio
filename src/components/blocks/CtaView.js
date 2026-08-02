import React from 'react';
import PropTypes from 'prop-types';
import { formatTextWithGreenBackticks } from '../../utils/textFormatting';

const CSS = `
.block--cta { margin: 0 0 50px; }
.block--cta .block-cta-inner {
  max-width: 700px;
  margin: 0 auto;
  padding: 40px 30px;
  text-align: center;
  background-color: var(--light-navy);
  border: 1px solid var(--lightest-navy);
  border-radius: var(--border-radius);
  box-shadow: 0 10px 30px -15px rgba(2, 12, 27, 0.7);
}
.block--cta .block-cta-heading {
  color: var(--lightest-slate);
  font-size: var(--fz-heading);
  font-weight: 600;
  line-height: 1.2;
  margin: 0 0 15px;
}
.block--cta .block-cta-body {
  color: var(--light-slate);
  font-size: var(--fz-lg);
  line-height: 1.7;
  margin: 0 auto 30px;
  max-width: 540px;
}
.block--cta .block-cta-button {
  display: inline-block;
  padding: 1.15rem 1.75rem;
  border-radius: var(--border-radius);
  font-family: var(--font-mono);
  font-size: var(--fz-sm);
  line-height: 1;
  text-decoration: none;
  cursor: pointer;
  transition: var(--transition);
}
.block--cta .variant-outline {
  color: var(--green);
  background-color: transparent;
  border: 1px solid var(--green);
}
.block--cta .variant-outline:hover,
.block--cta .variant-outline:focus-visible {
  background-color: var(--green-tint);
  outline: none;
}
.block--cta .variant-solid {
  color: var(--navy);
  background-color: var(--green);
  border: 1px solid var(--green);
  font-weight: 600;
}
.block--cta .variant-solid:hover,
.block--cta .variant-solid:focus-visible {
  background-color: var(--light-green);
  border-color: var(--light-green);
  transform: translateY(-2px);
  outline: none;
}
@media (max-width: 768px) {
  .block--cta .block-cta-inner { padding: 30px 20px; }
  .block--cta .block-cta-heading { font-size: var(--fz-xxl); }
  .block--cta .block-cta-body { font-size: var(--fz-md); }
}
@media (max-width: 480px) {
  .block--cta .block-cta-button { width: 100%; }
}
`;

const CtaView = ({ block }) => {
  const b = block || {};
  const heading = typeof b.heading === 'string' ? b.heading : '';
  const body = typeof b.body === 'string' ? b.body : '';
  const label = typeof b.buttonLabel === 'string' ? b.buttonLabel.trim() : '';
  const href = typeof b.href === 'string' ? b.href.trim() : '';
  if (!heading.trim() && !body.trim() && !label) return null;

  const variant = b.variant === 'solid' ? 'solid' : 'outline';
  const external = /^https?:\/\//i.test(href);

  return (
    <div className={`block block--${b.type || 'cta'}`}>
      <style href="block-cta" precedence="block">
        {CSS}
      </style>
      <div className="block-cta-inner">
        {heading ? (
          <h3 className="block-cta-heading">{formatTextWithGreenBackticks(heading)}</h3>
        ) : null}
        {body ? <p className="block-cta-body">{formatTextWithGreenBackticks(body)}</p> : null}
        {label && href ? (
          <a
            className={`block-cta-button variant-${variant}`}
            href={href}
            {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
          >
            {label}
          </a>
        ) : null}
      </div>
    </div>
  );
};

CtaView.propTypes = {
  block: PropTypes.object,
  section: PropTypes.object,
  index: PropTypes.number,
};

export default CtaView;
