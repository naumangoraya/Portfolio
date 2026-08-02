'use client';

import Field from './Field';
import TextField from './TextField';
import TextAreaField from './TextAreaField';
import NumberField from './NumberField';
import SelectField from './SelectField';
import SwitchField from './SwitchField';
import TagsField from './TagsField';
import ImageField from './ImageField';
import MarkdownField from './MarkdownField';
import RepeaterField from './RepeaterField';

/**
 * Descriptor `type` -> component. SchemaForm looks fields up here, so adding a
 * new control means adding one entry.
 *
 * Every component in the map takes the same props:
 *   `{ field, value, error, onChange(name, value), disabled }`
 *
 * ── the RepeaterField cycle ──────────────────────────────────────────────
 * `RepeaterField` renders nested descriptors, so it needs this map, while this
 * module needs `RepeaterField` — a genuine import cycle. It is resolved by the
 * `getFieldComponent` accessor below rather than by exporting the map into the
 * cycle:
 *
 *   - `getFieldComponent` is a *function declaration*, so its binding is
 *     initialised at module-instantiation time and is never in the temporal
 *     dead zone, however the cycle is entered.
 *   - It reads `FIELD_COMPONENTS` when *called* (at render), by which point
 *     this module has finished evaluating.
 *   - `RepeaterField` is likewise a hoisted `function` declaration, so the
 *     `repeater:` entry below is safe to read even when RepeaterField.js is
 *     the module that starts the cycle.
 *
 * Net effect: no `await import()` in a render path, no dynamic require, and no
 * TDZ crash in either import order.
 */
export const FIELD_COMPONENTS = {
  text: TextField,
  textarea: TextAreaField,
  number: NumberField,
  select: SelectField,
  switch: SwitchField,
  tags: TagsField,
  image: ImageField,
  markdown: MarkdownField,
  repeater: RepeaterField,
};

/**
 * Cycle-safe lookup. Prefer this over reaching into `FIELD_COMPONENTS`
 * directly from any module that this one imports.
 */
export function getFieldComponent(type) {
  return FIELD_COMPONENTS[type || 'text'] || null;
}

/** Register an extra field type at runtime. */
export function registerFieldComponent(type, component) {
  FIELD_COMPONENTS[type] = component;
}

export {
  Field,
  TextField,
  TextAreaField,
  NumberField,
  SelectField,
  SwitchField,
  TagsField,
  ImageField,
  MarkdownField,
  RepeaterField,
};

export default FIELD_COMPONENTS;
