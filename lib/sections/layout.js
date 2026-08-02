/**
 * Pure layout metadata for the eight built-in sections — no React imports, so
 * this file is safe to load from plain Node (scripts/seed-sections.mjs) as well
 * as from the bundler.
 *
 * Every value here was read off the live markup, not guessed. Two are
 * counter-intuitive and getting either wrong breaks the site silently:
 *
 *   - `featured` owns anchor `projects` (featured.js renders
 *     <section id="projects">), and `projects` renders NO id at all. The nav's
 *     "/#projects" link therefore points at Featured, not Projects.
 *   - Exactly five sections are numbered: about, education, jobs, services,
 *     featured. Hero, Projects and Contact are not. The visible 01.-05. labels
 *     come from `counter-increment: section` with no `counter-reset` anywhere,
 *     so they are a pure function of DOM order over those five.
 */
export const BUILTIN_META = {
  hero: {
    loader: 'hero',
    anchorId: '',
    numbered: false,
    navLabel: '',
    order: 10,
    resource: 'hero',
  },
  about: {
    loader: 'about',
    anchorId: 'about',
    numbered: true,
    navLabel: 'About',
    order: 20,
    resource: 'about',
  },
  education: {
    loader: 'education',
    anchorId: 'education',
    numbered: true,
    navLabel: 'Education',
    order: 30,
    resource: 'education',
  },
  jobs: {
    loader: 'jobs',
    anchorId: 'jobs',
    numbered: true,
    navLabel: 'Experience',
    order: 40,
    resource: 'jobs',
  },
  services: {
    loader: 'services',
    anchorId: 'services',
    numbered: true,
    navLabel: 'Services',
    order: 50,
    resource: 'services',
  },
  featured: {
    loader: 'projects',
    anchorId: 'projects',
    numbered: true,
    navLabel: 'Projects',
    order: 60,
    resource: 'projects',
  },
  projects: {
    loader: 'projects',
    anchorId: '',
    numbered: false,
    navLabel: '',
    order: 70,
    resource: 'projects',
  },
  contact: {
    loader: 'contact',
    anchorId: 'contact',
    numbered: false,
    navLabel: 'Contact',
    order: 80,
    resource: 'contact',
  },
};

export const BUILTIN_TYPES = Object.keys(BUILTIN_META);

/**
 * The layout the site renders when the `sections` collection is empty or
 * unreachable. Reproduces the previously hardcoded order in app/page.js
 * exactly, which is what lets the registry ship before any data exists.
 */
export const DEFAULT_LAYOUT = BUILTIN_TYPES.map(key => {
  const meta = BUILTIN_META[key];
  return {
    _id: `default-${key}`,
    key,
    type: key,
    source: 'builtin',
    title: '',
    anchorId: meta.anchorId,
    order: meta.order,
    visible: true,
    status: 'published',
    navLabel: meta.navLabel,
    navVisible: Boolean(meta.navLabel),
    numbered: meta.numbered,
    content: { blocks: [] },
  };
}).sort((a, b) => a.order - b.order);
