import { Education, Services, Featured, Projects, Contact } from '../../src/components';
import EditableHero from '../../src/components/sections/EditableHero';
import EditableAbout from '../../src/components/sections/EditableAbout';
import EditableJobs from '../../src/components/sections/EditableJobs';
import { BUILTIN_META, BUILTIN_TYPES, DEFAULT_LAYOUT } from './layout.js';

/**
 * type -> React component for the eight sections that already exist.
 *
 * Components cannot be stored in Mongo, so the DB only ever holds `type` and
 * code resolves it here. The layout metadata lives in ./layout.js, which stays
 * free of React imports so plain-Node scripts can read it.
 */
const COMPONENTS = {
  hero: EditableHero,
  about: EditableAbout,
  education: Education,
  jobs: EditableJobs,
  services: Services,
  featured: Featured,
  projects: Projects,
  contact: Contact,
};

// Featured receives only the featured subset; Projects gets the whole list.
const SELECTORS = {
  featured: rows => (Array.isArray(rows) ? rows.filter(p => p.featured) : []),
};

const FALLBACKS = {
  hero: null,
  about: null,
  contact: null,
};

export const BUILTIN_SECTIONS = Object.fromEntries(
  BUILTIN_TYPES.map(key => [
    key,
    {
      ...BUILTIN_META[key],
      component: COMPONENTS[key],
      select: SELECTORS[key],
      fallback: key in FALLBACKS ? FALLBACKS[key] : [],
    },
  ])
);

export { BUILTIN_TYPES, DEFAULT_LAYOUT };
