'use client';

import React from 'react';
import PropTypes from 'prop-types';
import Field from './Field';

/** Single-line text input. Descriptor: `{ type: 'text', placeholder, max }`. */
const TextField = ({ field, value, error, onChange, disabled = false }) => (
  <Field
    name={field.name}
    label={field.label}
    hint={field.hint}
    error={error}
    required={field.required}
    colSpan={field.colSpan}
  >
    {({ id, describedBy, invalid }) => (
      <input
        id={id}
        name={field.name}
        type={field.inputType || 'text'}
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

TextField.propTypes = {
  field: PropTypes.shape({
    name: PropTypes.string.isRequired,
    label: PropTypes.node,
    hint: PropTypes.node,
    placeholder: PropTypes.string,
    inputType: PropTypes.string,
    required: PropTypes.bool,
    max: PropTypes.number,
    colSpan: PropTypes.oneOf([1, 2]),
  }).isRequired,
  value: PropTypes.any,
  error: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  disabled: PropTypes.bool,
};

export default TextField;
