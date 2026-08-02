import React from 'react';
import PropTypes from 'prop-types';

/**
 * Gallery.
 *
 * The carousel layout is allowed to be a client component, but it does not need
 * to be: CSS scroll-snap gives a swipeable, keyboard-scrollable strip with no
 * JS, so this file stays a server component for both layouts. Less shipped JS,
 * and the images are in the HTML for crawlers either way.
 */

const CSS = `
.block--gallery { margin: 0 0 50px; }
.block--gallery .block-gallery-grid { display: grid; gap: 16px; }
.block--gallery .cols-2 { grid-template-columns: repeat(2, minmax(0, 1fr)); }
.block--gallery .cols-3 { grid-template-columns: repeat(3, minmax(0, 1fr)); }
.block--gallery .cols-4 { grid-template-columns: repeat(4, minmax(0, 1fr)); }
.block--gallery .block-gallery-carousel {
  display: grid;
  grid-auto-flow: column;
  grid-auto-columns: minmax(280px, 40%);
  gap: 16px;
  overflow-x: auto;
  scroll-snap-type: x mandatory;
  padding-bottom: 12px;
  -webkit-overflow-scrolling: touch;
}
.block--gallery .block-gallery-carousel > * { scroll-snap-align: start; }
.block--gallery .block-gallery-carousel::-webkit-scrollbar { height: 8px; }
.block--gallery .block-gallery-carousel::-webkit-scrollbar-track { background: var(--light-navy); border-radius: var(--border-radius); }
.block--gallery .block-gallery-carousel::-webkit-scrollbar-thumb { background: var(--lightest-navy); border-radius: var(--border-radius); }
.block--gallery .block-gallery-carousel::-webkit-scrollbar-thumb:hover { background: var(--dark-slate); }
.block--gallery figure {
  margin: 0;
  background-color: var(--light-navy);
  border: 1px solid var(--lightest-navy);
  border-radius: var(--border-radius);
  overflow: hidden;
  transition: var(--transition);
}
.block--gallery figure:hover {
  transform: translateY(-5px);
  border-color: var(--green-tint);
  box-shadow: 0 20px 40px -20px rgba(2, 12, 27, 0.8);
}
.block--gallery img { display: block; width: 100%; height: 220px; object-fit: cover; }
.block--gallery figcaption {
  padding: 12px 14px;
  color: var(--light-slate);
  font-family: var(--font-mono);
  font-size: var(--fz-xs);
  line-height: 1.5;
}
@media (max-width: 1024px) {
  .block--gallery .cols-4 { grid-template-columns: repeat(3, minmax(0, 1fr)); }
}
@media (max-width: 768px) {
  .block--gallery .cols-3, .block--gallery .cols-4 { grid-template-columns: repeat(2, minmax(0, 1fr)); }
  .block--gallery img { height: 180px; }
  .block--gallery .block-gallery-carousel { grid-auto-columns: minmax(240px, 70%); }
}
@media (max-width: 480px) {
  .block--gallery .cols-2, .block--gallery .cols-3, .block--gallery .cols-4 { grid-template-columns: 1fr; }
  .block--gallery .block-gallery-carousel { grid-auto-columns: 85%; }
}
`;

const COLUMN_CLASSES = { 2: 'cols-2', 3: 'cols-3', 4: 'cols-4' };

const GalleryView = ({ block }) => {
  const b = block || {};
  const images = (Array.isArray(b.images) ? b.images : []).filter(
    img => img && typeof img.url === 'string' && img.url.trim() !== ''
  );
  if (images.length === 0) return null;

  const carousel = b.layout === 'carousel';
  const containerClass = carousel
    ? 'block-gallery-carousel'
    : `block-gallery-grid ${COLUMN_CLASSES[Number(b.columns)] || COLUMN_CLASSES[3]}`;

  return (
    <div className={`block block--${b.type || 'gallery'}`}>
      <style href="block-gallery" precedence="block">
        {CSS}
      </style>
      <div className={containerClass}>
        {images.map((img, i) => (
          <figure key={img.id || img.publicId || i}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={img.url.trim()} alt={img.alt || img.caption || ''} loading="lazy" />
            {img.caption ? <figcaption>{img.caption}</figcaption> : null}
          </figure>
        ))}
      </div>
    </div>
  );
};

GalleryView.propTypes = {
  block: PropTypes.object,
  section: PropTypes.object,
  index: PropTypes.number,
};

export default GalleryView;
