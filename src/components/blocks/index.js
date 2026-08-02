import MarkdownBlockView from './MarkdownBlockView';
import CardGridView from './CardGridView';
import TimelineView from './TimelineView';
import GalleryView from './GalleryView';
import StatsView from './StatsView';
import CtaView from './CtaView';

/**
 * Block type -> renderer. Keys match the `type` discriminator in
 * `lib/schemas/blocks.js`; a type missing from this map renders nothing.
 *
 * `CustomSection` is intentionally not re-exported here — it imports this map,
 * and keeping it out avoids a module cycle.
 */
export const BLOCK_RENDERERS = {
  markdown: MarkdownBlockView,
  cardGrid: CardGridView,
  timeline: TimelineView,
  gallery: GalleryView,
  stats: StatsView,
  cta: CtaView,
};

export { MarkdownBlockView, CardGridView, TimelineView, GalleryView, StatsView, CtaView };

export default BLOCK_RENDERERS;
