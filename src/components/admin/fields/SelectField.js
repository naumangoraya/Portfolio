'use client';

import React from 'react';
import PropTypes from 'prop-types';
import Field from './Field';

/**
 * Native select. Descriptor: `{ type: 'select', options }` where each option is
 * either a primitive or `{ value, label }`.
 */
const normalise = option =>
  option !== null && typeof option === 'object'
    ? { value: option.value, label: option.label ?? String(option.value) }
    : { value: option, label: String(option) };

const SelectField = ({ field, value, error, onChange, disabled = false }) => {
  const options = (field.options || []).map(normalise);

  const handleChange = event => {
    const raw = event.target.value;
    // Preserve the original option type (numbers stay numbers).
    const match = options.find(option => String(option.value) === raw);
    onChange(field.name, match ? match.value : raw);
  };

  return (
    <Field
      name={field.name}
      label={field.label}
      hint={field.hint}
      error={error}
      required={field.required}
      colSpan={field.colSpan}
    >
      {({ id, describedBy, invalid }) => (
        <select
          id={id}
          name={field.name}
          value={value === undefined || value === null ? '' : String(value)}
          disabled={disabled}
          required={field.required}
          aria-describedby={describedBy}
          aria-invalid={invalid || undefined}
          onChange={handleChange}
        >
          {(!field.required || value === undefined || value === null || value === '') && (
            <option value="">{field.placeholder || 'Select...'}</option>
          )}
          {options.map(option => (
            <option key={String(option.value)} value={String(option.value)}>
              {option.label}
            </option>
          ))}
        </select>
      )}
    </Field>
  );
};

SelectField.propTypes = {
  field: PropTypes.shape({
    name: PropTypes.string.isRequired,
    label: PropTypes.node,
    hint: PropTypes.node,
    placeholder: PropTypes.string,
    required: PropTypes.bool,
    options: PropTypes.array,
    colSpan: PropTypes.oneOf([1, 2]),
  }).isRequired,
  value: PropTypes.any,
  error: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  disabled: PropTypes.bool,
};

export default SelectField;
