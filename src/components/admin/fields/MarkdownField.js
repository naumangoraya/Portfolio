'use client';

import React from 'react';
import PropTypes from 'prop-types';
import Field from './Field';
import MarkdownEditor from '../MarkdownEditor';

/**
 * SchemaForm adapter for `type: 'markdown'` descriptors.
 *
 * Same props as every other field component:
 *   `{ field, value, error, onChange(name, value), disabled }`
 *
 * Register it with `registerFieldComponent('markdown', MarkdownField)` (or add
 * it to FIELD_COMPONENTS) — it is kept out of the map's static imports so the
 * editor's markdown renderer is only pulled in where it is actually used.
 */
const MarkdownField = ({ field, value, error, onChange, disabled = false }) => (
  <Field
    name={field.name}
    label={field.label}
    hint={field.hint}
    error={error}
    required={field.required}
    colSpan={field.colSpan ?? 2}
  >
    {({ id, describedBy, invalid }) => (
      <MarkdownEditor
        id={id}
        name={field.name}
        value={typeof value === 'string' ? value : ''}
        rows={field.rows || 12}
        maxLength={field.max}
        placeholder={field.placeholder || 'Write markdown…'}
        disabled={disabled}
        describedBy={describedBy}
        invalid={invalid}
        onChange={next => onChange(field.name, next)}
      />
    )}
  </Field>
);

MarkdownField.propTypes = {
  field: PropTypes.shape({
    name: PropTypes.string.isRequired,
    label: PropTypes.node,
    hint: PropTypes.node,
    placeholder: PropTypes.string,
    required: PropTypes.bool,
    rows: PropTypes.number,
    max: PropTypes.number,
    colSpan: PropTypes.oneOf([1, 2]),
  }).isRequired,
  value: PropTypes.any,
  error: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  disabled: PropTypes.bool,
};

export default MarkdownField;
