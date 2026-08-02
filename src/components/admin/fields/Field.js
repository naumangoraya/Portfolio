'use client';

import React, { useId } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

/**
 * Shared wrapper for every SchemaForm control.
 *
 * Owns the generated id so the `<label htmlFor>` always matches the control,
 * plus the required marker, hint text and `role="alert"` error line. Field
 * components call it with a render-prop so they never invent their own ids.
 */

const StyledField = styled.div`
  margin-bottom: 25px;
  grid-column: ${({ $colSpan }) => ($colSpan === 2 ? 'span 2' : 'span 1')};

  label {
    display: block;
    color: var(--green);
    font-family: var(--font-mono);
    font-size: var(--fz-sm);
    margin-bottom: 8px;
    font-weight: 600;
  }

  .required-marker {
    color: var(--pink);
    margin-left: 4px;
  }

  input[type='text'],
  input[type='number'],
  input[type='url'],
  input[type='email'],
  textarea,
  select {
    width: 100%;
    padding: 12px;
    background: var(--light-navy);
    border: 1px solid var(--lightest-navy);
    border-radius: var(--border-radius);
    color: var(--lightest-slate);
    font-size: var(--fz-sm);
    font-family: inherit;
    transition: border-color 0.2s ease;

    &:focus {
      outline: none;
      border-color: var(--green);
      box-shadow: 0 0 0 2px rgba(100, 255, 218, 0.1);
    }

    &::placeholder {
      color: var(--slate);
      opacity: 0.7;
    }

    &:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }
  }

  textarea {
    min-height: 100px;
    resize: vertical;
    line-height: 1.5;
  }

  select {
    cursor: pointer;
  }

  &[data-invalid='true'] {
    input[type='text'],
    input[type='number'],
    input[type='url'],
    input[type='email'],
    textarea,
    select {
      border-color: var(--pink);
    }
  }

  .field-hint {
    display: block;
    margin-top: 8px;
    color: var(--slate);
    font-size: var(--fz-xxs);
    line-height: 1.4;
  }

  .field-error {
    display: block;
    margin-top: 8px;
    color: var(--pink);
    font-family: var(--font-mono);
    font-size: var(--fz-xxs);
    line-height: 1.4;
  }
`;

const Field = ({ name, label, hint, error, required = false, colSpan = 1, children }) => {
  const reactId = useId();
  const controlId = `field-${name}-${reactId}`;
  const hintId = hint ? `${controlId}-hint` : undefined;
  const errorId = error ? `${controlId}-error` : undefined;
  const describedBy = [hintId, errorId].filter(Boolean).join(' ') || undefined;

  return (
    <StyledField $colSpan={colSpan} data-invalid={error ? 'true' : 'false'}>
      {label ? (
        <label htmlFor={controlId}>
          {label}
          {required && (
            <span className="required-marker" aria-hidden="true">
              *
            </span>
          )}
        </label>
      ) : null}

      {children({ id: controlId, describedBy, invalid: Boolean(error) })}

      {hint ? (
        <small className="field-hint" id={hintId}>
          {hint}
        </small>
      ) : null}

      {error ? (
        <span className="field-error" id={errorId} role="alert">
          {error}
        </span>
      ) : null}
    </StyledField>
  );
};

Field.propTypes = {
  name: PropTypes.string.isRequired,
  label: PropTypes.node,
  hint: PropTypes.node,
  error: PropTypes.string,
  required: PropTypes.bool,
  colSpan: PropTypes.oneOf([1, 2]),
  /** Render prop: ({ id, describedBy, invalid }) => ReactNode */
  children: PropTypes.func.isRequired,
};

export default Field;
