'use client';

import React, { useState } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import Field from './Field';

/**
 * String-array editor (tech lists, skills, tags).
 * Descriptor: `{ type: 'tags', placeholder, max }` - `max` caps the tag count.
 *
 * Enter or comma commits the buffer; Backspace on an empty buffer pops the
 * last tag; each chip has its own remove button so it works keyboard-only.
 */

const StyledTags = styled.div`
  .tag-list {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    margin-bottom: 10px;
    padding: 0;
    list-style: none;
  }

  .tag {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    background: var(--green-tint);
    border: 1px solid var(--green);
    border-radius: var(--border-radius);
    color: var(--green);
    font-family: var(--font-mono);
    font-size: var(--fz-xxs);
    padding: 5px 8px;
  }

  .tag-remove {
    background: transparent;
    border: none;
    color: var(--green);
    cursor: pointer;
    font-size: var(--fz-xs);
    line-height: 1;
    padding: 0;

    &:hover,
    &:focus-visible {
      color: var(--light-green);
    }

    &:disabled {
      cursor: not-allowed;
      opacity: 0.6;
    }
  }

  .tag-empty {
    color: var(--slate);
    font-family: var(--font-mono);
    font-size: var(--fz-xxs);
    margin: 0 0 10px;
  }
`;

const toArray = value => (Array.isArray(value) ? value : []);

const TagsField = ({ field, value, error, onChange, disabled = false }) => {
  const [buffer, setBuffer] = useState('');
  const tags = toArray(value);
  const atLimit = typeof field.max === 'number' && tags.length >= field.max;

  const commit = raw => {
    const parts = raw
      .split(',')
      .map(part => part.trim())
      .filter(Boolean);

    if (parts.length === 0) return;

    const next = [...tags];
    parts.forEach(part => {
      if (!next.includes(part) && (typeof field.max !== 'number' || next.length < field.max)) {
        next.push(part);
      }
    });

    if (next.length !== tags.length) {
      onChange(field.name, next);
    }
    setBuffer('');
  };

  const removeAt = index => {
    onChange(
      field.name,
      tags.filter((_, i) => i !== index)
    );
  };

  const handleKeyDown = event => {
    if (event.key === 'Enter' || event.key === ',') {
      event.preventDefault();
      commit(buffer);
      return;
    }
    if (event.key === 'Backspace' && buffer === '' && tags.length > 0) {
      event.preventDefault();
      removeAt(tags.length - 1);
    }
  };

  return (
    <Field
      name={field.name}
      label={field.label}
      hint={field.hint || 'Press Enter or comma to add'}
      error={error}
      required={field.required}
      colSpan={field.colSpan}
    >
      {({ id, describedBy, invalid }) => (
        <StyledTags>
          {tags.length > 0 ? (
            <ul className="tag-list">
              {tags.map((tag, index) => (
                <li className="tag" key={`${tag}-${index}`}>
                  <span>{tag}</span>
                  <button
                    type="button"
                    className="tag-remove"
                    disabled={disabled}
                    aria-label={`Remove ${tag}`}
                    onClick={() => removeAt(index)}
                  >
                    &times;
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <p className="tag-empty">No entries yet</p>
          )}

          <input
            id={id}
            name={`${field.name}-input`}
            type="text"
            value={buffer}
            placeholder={atLimit ? `Limit of ${field.max} reached` : field.placeholder || 'Add...'}
            disabled={disabled || atLimit}
            aria-describedby={describedBy}
            aria-invalid={invalid || undefined}
            onChange={event => setBuffer(event.target.value)}
            onKeyDown={handleKeyDown}
            onBlur={() => commit(buffer)}
          />
        </StyledTags>
      )}
    </Field>
  );
};

TagsField.propTypes = {
  field: PropTypes.shape({
    name: PropTypes.string.isRequired,
    label: PropTypes.node,
    hint: PropTypes.node,
    placeholder: PropTypes.string,
    required: PropTypes.bool,
    max: PropTypes.number,
    colSpan: PropTypes.oneOf([1, 2]),
  }).isRequired,
  value: PropTypes.any,
  error: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  disabled: PropTypes.bool,
};

export default TagsField;
