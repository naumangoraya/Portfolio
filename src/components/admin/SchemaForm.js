'use client';

import React, { useCallback, useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { z } from 'zod';
import { FIELD_COMPONENTS } from './fields';

/**
 * Descriptor-driven form renderer.
 *
 * A `fields` array replaces the ~9 hand-written admin forms. Each descriptor:
 *
 *   {
 *     name,        // required - the value key
 *     label,       // visible label
 *     hint,        // helper text under the control
 *     placeholder,
 *     type,        // key into FIELD_COMPONENTS (default 'text')
 *     required,    // visual marker only - Zod owns real validation
 *     default,     // seed value when initialValues has no entry
 *     options,     // select
 *     min, max,    // number bounds / textarea+tags length caps
 *     rows,        // textarea
 *     when,        // (values) => boolean - conditionally render
 *     colSpan,     // 1 (default) or 2 - grid width
 *   }
 *
 * Validation is delegated to the passed Zod schema on submit; the flattened
 * `fieldErrors` are mapped straight onto the matching controls.
 */

const StyledForm = styled.form`
  .field-grid {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 0 20px;

    @media (max-width: 600px) {
      grid-template-columns: minmax(0, 1fr);

      > * {
        grid-column: span 1 !important;
      }
    }
  }

  .form-error {
    color: var(--pink);
    font-family: var(--font-mono);
    font-size: var(--fz-xs);
    margin: 0 0 20px;
  }

  .form-actions {
    display: flex;
    gap: 15px;
    justify-content: flex-end;
    margin-top: 20px;
    padding-top: 25px;
    border-top: 1px solid var(--lightest-navy);

    button {
      padding: 12px 24px;
      border: none;
      border-radius: var(--border-radius);
      cursor: pointer;
      font-weight: 600;
      font-size: var(--fz-sm);
      transition: all 0.2s ease;
      min-width: 100px;
      background: var(--green);
      color: var(--navy);

      &:hover:not(:disabled) {
        background: var(--light-green);
        transform: translateY(-1px);
        box-shadow: 0 4px 8px rgba(100, 255, 218, 0.2);
      }

      &:disabled {
        opacity: 0.55;
        cursor: not-allowed;
      }
    }
  }
`;

/** Defaults fill the gaps; anything present in `initialValues` wins. */
function seedValues(fields, initialValues) {
  const seed = { ...(initialValues || {}) };

  fields.forEach(field => {
    if (!field?.name) return;
    if (seed[field.name] === undefined && field.default !== undefined) {
      seed[field.name] = field.default;
    }
  });

  return seed;
}

const SchemaForm = ({
  fields = [],
  schema = null,
  initialValues = null,
  onSubmit,
  submitLabel = 'Save',
  children = null,
  disabled = false,
  className,
  id,
  showActions = true,
}) => {
  const [values, setValues] = useState(() => seedValues(fields, initialValues));
  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const setValue = useCallback((name, next) => {
    setValues(prev => ({ ...prev, [name]: next }));
    // Clear the field's error as soon as the user edits it.
    setErrors(prev => {
      if (!prev[name]) return prev;
      const rest = { ...prev };
      delete rest[name];
      return rest;
    });
  }, []);

  const visibleFields = useMemo(
    () =>
      fields.filter(field => {
        if (!field?.name) return false;
        return typeof field.when === 'function' ? Boolean(field.when(values)) : true;
      }),
    [fields, values]
  );

  // Values for hidden fields are kept in state (so toggling `when` back
  // restores them) but excluded from what gets validated and submitted.
  const payload = useMemo(() => {
    const visibleNames = new Set(visibleFields.map(field => field.name));
    const next = {};
    Object.keys(values).forEach(key => {
      if (visibleNames.has(key) || !fields.some(field => field.name === key)) {
        next[key] = values[key];
      }
    });
    return next;
  }, [values, visibleFields, fields]);

  const handleSubmit = useCallback(
    async event => {
      event.preventDefault();
      if (submitting || disabled) return;

      setFormError(null);

      let data = payload;

      if (schema && typeof schema.safeParse === 'function') {
        const result = schema.safeParse(payload);

        if (!result.success) {
          const flattened = z.flattenError(result.error);
          const fieldErrors = {};

          Object.entries(flattened.fieldErrors || {}).forEach(([key, messages]) => {
            if (Array.isArray(messages) && messages.length > 0) {
              fieldErrors[key] = messages[0];
            }
          });

          setErrors(fieldErrors);
          setFormError((flattened.formErrors || [])[0] || null);
          return;
        }

        setErrors({});
        data = result.data;
      }

      setSubmitting(true);
      try {
        await onSubmit(data);
      } finally {
        setSubmitting(false);
      }
    },
    [payload, schema, onSubmit, submitting, disabled]
  );

  const busy = submitting || disabled;

  return (
    <StyledForm className={className} id={id} onSubmit={handleSubmit} noValidate>
      {formError ? (
        <p className="form-error" role="alert">
          {formError}
        </p>
      ) : null}

      <div className="field-grid">
        {visibleFields.map(field => {
          const Control = FIELD_COMPONENTS[field.type || 'text'];

          if (!Control) {
            if (process.env.NODE_ENV !== 'production') {
              console.warn(`[SchemaForm] Unknown field type "${field.type}" for "${field.name}"`);
            }
            return null;
          }

          return (
            <Control
              key={field.name}
              field={field}
              value={values[field.name]}
              error={errors[field.name]}
              onChange={setValue}
              disabled={busy}
            />
          );
        })}
      </div>

      {typeof children === 'function'
        ? children({ values, setValue, errors, submitting: busy })
        : children}

      {showActions ? (
        <div className="form-actions">
          <button type="submit" disabled={busy}>
            {submitting ? 'Saving...' : submitLabel}
          </button>
        </div>
      ) : null}
    </StyledForm>
  );
};

SchemaForm.propTypes = {
  fields: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      label: PropTypes.node,
      hint: PropTypes.node,
      placeholder: PropTypes.string,
      type: PropTypes.string,
      required: PropTypes.bool,
      default: PropTypes.any,
      options: PropTypes.array,
      min: PropTypes.number,
      max: PropTypes.number,
      rows: PropTypes.number,
      when: PropTypes.func,
      colSpan: PropTypes.oneOf([1, 2]),
    })
  ),
  /** Zod schema - validated with `safeParse` on submit. */
  schema: PropTypes.object,
  initialValues: PropTypes.object,
  onSubmit: PropTypes.func.isRequired,
  submitLabel: PropTypes.string,
  /** Node, or a render prop: ({ values, setValue, errors, submitting }) => node */
  children: PropTypes.oneOfType([PropTypes.node, PropTypes.func]),
  disabled: PropTypes.bool,
  className: PropTypes.string,
  id: PropTypes.string,
  /** Set false to render the submit button yourself (e.g. in a modal footer). */
  showActions: PropTypes.bool,
};

export default SchemaForm;
