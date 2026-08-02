import dbConnect from '../mongodb.js';
import Section from '../models/Section.js';
import { serializeData } from '../serialize.js';
import { DEFAULT_LAYOUT } from './layout.js';

/**
 * The ordered list of sections to render on the home page.
 *
 * Falls back to the code-defined DEFAULT_LAYOUT on three independent
 * conditions — collection missing, collection empty, query threw — so the
 * composition path can ship and be verified in production *before* any row
 * exists. That is the whole reason this is safe to deploy incrementally.
 */
export async function getSectionLayout() {
  try {
    await dbConnect();

    const rows = await Section.find({ visible: true, status: 'published' })
      .sort({ order: 1 })
      .lean();

    if (!rows.length) return DEFAULT_LAYOUT;

    return serializeData(rows);
  } catch (error) {
    console.error('[sections] registry read failed, using code layout', error);
    return DEFAULT_LAYOUT;
  }
}

/**
 * Nav links derived from the registry.
 *
 * Off by default: until `navMode` is explicitly flipped, the hardcoded array in
 * src/config.js is still what renders, so this cannot change the nav by
 * accident.
 */
export function getNavLinksFromLayout(layout) {
  return layout
    .filter(section => section.navVisible && section.anchorId && section.navLabel)
    .map(section => ({ name: section.navLabel, url: `/#${section.anchorId}` }));
}
