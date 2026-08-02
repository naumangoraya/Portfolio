'use client';

import React from 'react';
import PropTypes from 'prop-types';
import Field from './Field';

/**
 * Numeric input. Descriptor: `{ type: 'number', min, max, step }`.
 * Emits `undefined` for an empty box (not 0) so optional numbers stay optional
 * and Zod's `.optional()` sees an absent value rather than NaN.
 */
const NumberField = ({ field, value, error, onChange, disabled = false }) => {
  const handleChange = event => {
    const raw = event.target.value;
    if (raw === '') {
      onChange(field.name, undefined);
      return;
    }
    const parsed = Number(raw);
    onChange(field.name, Number.isNaN(parsed) ? raw : parsed);
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
        <input
          id={id}
          name={field.name}
          type="number"
          value={value === undefined || value === null ? '' : value}
          placeholder={field.placeholder || ''}
          min={field.min}
          max={field.max}
          step={field.step ?? 1}
          disabled={disabled}
          required={field.required}
          aria-describedby={describedBy}
          aria-invalid={invalid || undefined}
          onChange={handleChange}
        />
      )}
    </Field>
  );
};

NumberField.propTypes = {
  field: PropTypes.shape({
    name: PropTypes.string.isRequired,
    label: PropTypes.node,
    hint: PropTypes.node,
    placeholder: PropTypes.string,
    required: PropTypes.bool,
    min: PropTypes.number,
    max: PropTypes.number,
    step: PropTypes.number,
    colSpan: PropTypes.oneOf([1, 2]),
  }).isRequired,
  value: PropTypes.any,
  error: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  disabled: PropTypes.bool,
};

export default NumberField;
