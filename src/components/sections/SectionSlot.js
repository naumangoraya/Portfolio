import React from 'react';
import PropTypes from 'prop-types';
import { BUILTIN_SECTIONS } from '../../../lib/sections/builtins';
import CustomSection from '../blocks/CustomSection';

/**
 * Renders one section from the registry.
 *
 * Server Component — it only picks a component and hands it data, exactly as
 * app/page.js used to do inline.
 *
 * An unrecognised type returns null rather than throwing, so a stray row can
 * never take the whole page down.
 */
export default function SectionSlot({ section, data }) {
  if (!section) return null;

  if (section.source === 'custom') {
    return <CustomSection section={section} />;
  }

  const def = BUILTIN_SECTIONS[section.type];
  if (!def) return null;

  const Component = def.component;
  const raw = data?.[def.loader] ?? def.fallback;
  const value = def.select ? def.select(raw) : raw;

  // `sectionTitle` is additive and optional: when the registry stores '' the
  // component falls through to its own hardcoded heading, so day one output is
  // unchanged and no section component needed editing.
  return <Component data={value} sectionTitle={section.title || undefined} />;
}

SectionSlot.propTypes = {
  section: PropTypes.shape({
    key: PropTypes.string,
    type: PropTypes.string,
    source: PropTypes.string,
    title: PropTypes.string,
  }),
  data: PropTypes.object,
};
