'use client';

import Field from './Field';
import TextField from './TextField';
import TextAreaField from './TextAreaField';
import NumberField from './NumberField';
import SelectField from './SelectField';
import SwitchField from './SwitchField';
import TagsField from './TagsField';

/**
 * Descriptor `type` -> component. SchemaForm looks fields up here, so adding a
 * new control means adding one entry: image and markdown land here next.
 *
 * Every component in the map takes the same props:
 *   `{ field, value, error, onChange(name, value), disabled }`
 */
export const FIELD_COMPONENTS = {
  text: TextField,
  textarea: TextAreaField,
  number: NumberField,
  select: SelectField,
  switch: SwitchField,
  tags: TagsField,
};

/** Register an extra field type at runtime (used by the image/markdown kit). */
export function registerFieldComponent(type, component) {
  FIELD_COMPONENTS[type] = component;
}

export { Field, TextField, TextAreaField, NumberField, SelectField, SwitchField, TagsField };

export default FIELD_COMPONENTS;
