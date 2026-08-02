import React from 'react';
import PropTypes from 'prop-types';
import { formatTextWithGreenBackticks } from '../../utils/textFormatting';

const CSS = `
.block--stats { margin: 0 0 50px; }
.block--stats .block-stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
  gap: 20px;
}
.block--stats .block-stat {
  padding: 25px 20px;
  text-align: center;
  background-color: var(--light-navy);
  border: 1px solid var(--lightest-navy);
  border-radius: var(--border-radius);
  box-shadow: 0 10px 30px -15px rgba(2, 12, 27, 0.7);
  transition: var(--transition);
}
.block--stats .block-stat:hover {
  transform: translateY(-5px);
  background-color: var(--navy);
  border-color: var(--green-tint);
  box-shadow: 0 20px 40px -20px rgba(2, 12, 27, 0.8);
}
.block--stats .block-stat-value {
  color: var(--green);
  font-family: var(--font-mono);
  font-size: var(--fz-heading);
  font-weight: 600;
  line-height: 1.1;
  display: block;
}
.block--stats .block-stat-suffix { font-size: 0.7em; margin-left: 2px; }
.block--stats .block-stat-label {
  color: var(--light-slate);
  font-size: var(--fz-sm);
  line-height: 1.5;
  margin: 10px 0 0;
}
@media (max-width: 768px) {
  .block--stats .block-stats-grid { grid-template-columns: repeat(auto-fit, minmax(140px, 1fr)); gap: 15px; }
  .block--stats .block-stat { padding: 20px 15px; }
  .block--stats .block-stat-value { font-size: var(--fz-xxl); }
}
@media (max-width: 480px) {
  .block--stats .block-stats-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
}
`;

const StatsView = ({ block }) => {
  const b = block || {};
  const items = (Array.isArray(b.items) ? b.items : [])
    .filter(Boolean)
    .filter(it => `${it.value ?? ''}`.trim() !== '' || `${it.label ?? ''}`.trim() !== '');
  if (items.length === 0) return null;

  return (
    <div className={`block block--${b.type || 'stats'}`}>
      <style href="block-stats" precedence="block">
        {CSS}
      </style>
      <div className="block-stats-grid">
        {items.map((item, i) => {
          const it = item || {};
          return (
            <div key={it.id || i} className="block-stat">
              <span className="block-stat-value">
                {`${it.value ?? ''}`}
                {it.suffix ? <span className="block-stat-suffix">{it.suffix}</span> : null}
              </span>
              {it.label ? (
                <p className="block-stat-label">{formatTextWithGreenBackticks(it.label)}</p>
              ) : null}
            </div>
          );
        })}
      </div>
    </div>
  );
};

StatsView.propTypes = {
  block: PropTypes.object,
  section: PropTypes.object,
  index: PropTypes.number,
};

export default StatsView;
