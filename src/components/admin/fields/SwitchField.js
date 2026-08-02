'use client';

import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import Field from './Field';

/** Boolean toggle. Descriptor: `{ type: 'switch', onLabel, offLabel }`. */

const StyledSwitch = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;

  input[type='checkbox'] {
    appearance: none;
    -webkit-appearance: none;
    margin: 0;
    position: relative;
    width: 44px;
    height: 24px;
    flex: 0 0 auto;
    border-radius: 12px;
    background: var(--lightest-navy);
    border: 1px solid var(--lightest-navy);
    cursor: pointer;
    transition: var(--transition);

    &::after {
      content: '';
      position: absolute;
      top: 2px;
      left: 2px;
      width: 18px;
      height: 18px;
      border-radius: 50%;
      background: var(--light-slate);
      transition: var(--transition);
    }

    &:checked {
      background: var(--green-tint);
      border-color: var(--green);

      &::after {
        transform: translateX(20px);
        background: var(--green);
      }
    }

    &:focus-visible {
      outline: none;
      box-shadow: 0 0 0 2px rgba(100, 255, 218, 0.35);
    }

    &:disabled {
      opacity: 0.55;
      cursor: not-allowed;
    }
  }

  .switch-state {
    color: var(--light-slate);
    font-family: var(--font-mono);
    font-size: var(--fz-xs);
  }
`;

const SwitchField = ({ field, value, error, onChange, disabled = false }) => (
  <Field
    name={field.name}
    label={field.label}
    hint={field.hint}
    error={error}
    required={field.required}
    colSpan={field.colSpan}
  >
    {({ id, describedBy, invalid }) => (
      <StyledSwitch>
        <input
          id={id}
          name={field.name}
          type="checkbox"
          role="switch"
          checked={Boolean(value)}
          disabled={disabled}
          aria-describedby={describedBy}
          aria-invalid={invalid || undefined}
          aria-checked={Boolean(value)}
          onChange={event => onChange(field.name, event.target.checked)}
        />
        <span className="switch-state">
          {value ? field.onLabel || 'On' : field.offLabel || 'Off'}
        </span>
      </StyledSwitch>
    )}
  </Field>
);

SwitchField.propTypes = {
  field: PropTypes.shape({
    name: PropTypes.string.isRequired,
    label: PropTypes.node,
    hint: PropTypes.node,
    required: PropTypes.bool,
    onLabel: PropTypes.string,
    offLabel: PropTypes.string,
    colSpan: PropTypes.oneOf([1, 2]),
  }).isRequired,
  value: PropTypes.any,
  error: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  disabled: PropTypes.bool,
};

export default SwitchField;
