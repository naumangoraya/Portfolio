import Hero from '../models/Hero.js';
import About from '../models/About.js';
import Job from '../models/Job.js';
import Service from '../models/Service.js';
import Project from '../models/Project.js';
import Contact from '../models/Contact.js';
import Education from '../models/Education.js';
import { serializeData } from '../serialize.js';
import { BUILTIN_SECTIONS } from './builtins.js';

/**
 * The seven content queries, copied verbatim from the previous app/page.js
 * Promise.all so the rendered output cannot drift.
 */
export const LOADERS = {
  hero: () => Hero.findOne({ isActive: true }).lean(),
  about: () => About.findOne({ isActive: true }).lean(),
  jobs: () => Job.find({ isActive: true }).sort({ order: 1 }).lean(),
  services: () => Service.find({ isActive: true }).sort({ order: 1 }).lean(),
  projects: () => Project.find({ isActive: true }).sort({ order: 1 }).lean(),
  contact: () => Contact.findOne({ isActive: true }).lean(),
  education: () => Education.find({ isActive: true }).sort({ order: 1, startDate: -1 }).lean(),
};

/**
 * Runs only the queries the current layout actually needs, deduplicated —
 * `featured` and `projects` share one `projects` fetch rather than two.
 */
export async function loadSectionData(layout) {
  const needed = [
    ...new Set(
      layout
        .filter(section => section.source !== 'custom')
        .map(section => BUILTIN_SECTIONS[section.type]?.loader)
        .filter(Boolean)
    ),
  ];

  const results = await Promise.all(needed.map(key => LOADERS[key]()));

  return Object.fromEntries(needed.map((key, i) => [key, serializeData(results[i])]));
}
