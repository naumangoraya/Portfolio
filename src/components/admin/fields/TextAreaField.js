'use client';

import React from 'react';
import PropTypes from 'prop-types';
import Field from './Field';

/** Multi-line text input. Descriptor: `{ type: 'textarea', rows, placeholder, max }`. */
const TextAreaField = ({ field, value, error, onChange, disabled = false }) => (
  <Field
    name={field.name}
    label={field.label}
    hint={field.hint}
    error={error}
    required={field.required}
    colSpan={field.colSpan}
  >
    {({ id, describedBy, invalid }) => (
      <textarea
        id={id}
        name={field.name}
        rows={field.rows || 4}
        value={value ?? ''}
        placeholder={field.placeholder || ''}
        maxLength={field.max}
        disabled={disabled}
        required={field.required}
        aria-describedby={describedBy}
        aria-invalid={invalid || undefined}
        onChange={event => onChange(field.name, event.target.value)}
      />
    )}
  </Field>
);

TextAreaField.propTypes = {
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

export default TextAreaField;
