'use client';

import React, { useCallback, useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { nanoid } from 'nanoid';
import Field from './Field';
import SortableList from '../SortableList';
import { getFieldComponent } from './index';

/**
 * SchemaForm adapter for `type: 'repeater'` descriptors - an array of objects
 * edited through a nested descriptor list.
 *
 * Descriptor:
 *   {
 *     name, label, hint,
 *     type: 'repeater',
 *     of: [ ...descriptors ],   // the shape of one item
 *     itemLabel,                // (item, i) => string, or a noun like 'Card'
 *     min, max,                 // item-count bounds
 *   }
 *
 * Same props as every other field component:
 *   `{ field, value, error, onChange(name, value), disabled }`
 *
 * ── circular import ──────────────────────────────────────────────────────
 * `fields/index.js` imports this module, and this module needs the type map
 * that lives there. Rather than importing the `FIELD_COMPONENTS` binding
 * (which is still in its temporal dead zone while index.js is mid-evaluation),
 * we import the hoisted `getFieldComponent` *function declaration*. Function
 * declarations are initialised at module-instantiation time, before any module
 * body runs, so the binding is always live; and it is only ever *called*
 * during render, long after index.js has finished evaluating. No cycle crash,
 * and no lazy `await import()` inside a render.
 */

const StyledRepeater = styled.div`
  .repeater-empty {
    color: var(--slate);
    font-family: var(--font-mono);
    font-size: var(--fz-xxs);
    margin: 0 0 12px;
    padding: 16px;
    border: 1px dashed var(--lightest-navy);
    border-radius: var(--border-radius);
    text-align: center;
  }

  .repeater-item {
    border: 1px solid var(--lightest-navy);
    border-radius: var(--border-radius);
    background: var(--light-navy);
    overflow: hidden;
  }

  .repeater-head {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 8px 10px;
    background: var(--navy);
    border-bottom: 1px solid transparent;
  }

  .repeater-item[data-open='true'] .repeater-head {
    border-bottom-color: var(--lightest-navy);
  }

  .repeater-index {
    color: var(--dark-slate);
    font-family: var(--font-mono);
    font-size: var(--fz-xxs);
    min-width: 22px;
  }

  .repeater-title {
    flex: 1 1 auto;
    min-width: 0;
    text-align: left;
    background: transparent;
    border: none;
    padding: 4px 2px;
    color: var(--lightest-slate);
    font-family: var(--font-mono);
    font-size: var(--fz-xs);
    cursor: pointer;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;

    &:hover,
    &:focus-visible {
      color: var(--green);
    }
  }

  .repeater-title .caret {
    display: inline-block;
    width: 14px;
    color: var(--green);
  }

  .repeater-btn {
    background: transparent;
    border: 1px solid transparent;
    border-radius: var(--border-radius);
    color: var(--light-slate);
    cursor: pointer;
    font-family: var(--font-mono);
    font-size: var(--fz-xxs);
    line-height: 1;
    padding: 6px 8px;
    transition: all 0.2s ease;

    &:hover:not(:disabled),
    &:focus-visible:not(:disabled) {
      color: var(--green);
      border-color: var(--green);
    }

    &.danger:hover:not(:disabled),
    &.danger:focus-visible:not(:disabled) {
      color: var(--pink);
      border-color: var(--pink);
    }

    &:disabled {
      opacity: 0.4;
      cursor: not-allowed;
    }
  }

  .repeater-drag {
    cursor: grab;
    touch-action: none;

    &:active {
      cursor: grabbing;
    }
  }

  .repeater-body {
    padding: 16px 16px 0;
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

  .repeater-footer {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    margin-top: 12px;
  }

  .repeater-add {
    background: transparent;
    border: 1px dashed var(--green);
    border-radius: var(--border-radius);
    color: var(--green);
    cursor: pointer;
    font-family: var(--font-mono);
    font-size: var(--fz-xxs);
    padding: 10px 16px;
    transition: all 0.2s ease;

    &:hover:not(:disabled),
    &:focus-visible:not(:disabled) {
      background: var(--green-tint);
    }

    &:disabled {
      opacity: 0.45;
      cursor: not-allowed;
    }
  }

  .repeater-count {
    color: var(--slate);
    font-family: var(--font-mono);
    font-size: var(--fz-xxs);
  }
`;

/**
 * Fallback keys for rows that reached us without an `id` (documents written
 * before ids existed). Keyed by object identity so the key survives re-renders
 * and reorders; module-level and weak, so it never leaks. Rows created *here*
 * always get a real `nanoid()` id instead.
 */
const FALLBACK_IDS = new WeakMap();

function rowId(item) {
  if (item && typeof item === 'object') {
    if (item.id) return String(item.id);
    let cached = FALLBACK_IDS.get(item);
    if (!cached) {
      cached = nanoid();
      FALLBACK_IDS.set(item, cached);
    }
    return cached;
  }
  return String(item);
}

const toArray = value => (Array.isArray(value) ? value : []);

const asObject = item => (item && typeof item === 'object' && !Array.isArray(item) ? item : {});

/** First non-empty string on the item, ignoring the id — a decent row title. */
function firstText(item) {
  const entries = Object.entries(asObject(item));
  for (const [key, val] of entries) {
    if (key === 'id' || key === '_id' || key === 'type') continue;
    if (typeof val === 'string' && val.trim()) {
      const text = val.trim().replace(/\s+/g, ' ');
      return text.length > 60 ? `${text.slice(0, 60)}…` : text;
    }
  }
  return '';
}

/**
 * `itemLabel` is authored either as a function (see the task descriptors) or
 * as a plain noun (see `BLOCK_DESCRIPTORS`), so handle both rather than
 * calling `field.itemLabel?.(…)` and blowing up on the string form.
 */
function resolveLabel(field, item, index) {
  const { itemLabel } = field;

  if (typeof itemLabel === 'function') {
    const custom = itemLabel(item, index);
    if (custom) return String(custom);
  }

  const text = firstText(item);
  if (text) return text;

  const noun = typeof itemLabel === 'string' && itemLabel.trim() ? itemLabel.trim() : 'Item';
  return `${noun} ${index + 1}`;
}

/** A new row: descriptor defaults plus a stable, client-generated id. */
function createItem(of) {
  const next = { id: nanoid() };
  (Array.isArray(of) ? of : []).forEach(sub => {
    if (sub?.name && sub.default !== undefined) {
      next[sub.name] = sub.default;
    }
  });
  return next;
}

/*
 * Declared (and default-exported) as a hoisted `function`, not a `const` arrow:
 * in the index.js <-> RepeaterField.js cycle, whichever module is entered
 * first, index.js reads this binding while building FIELD_COMPONENTS. A
 * function declaration is initialised at module-instantiation time, so it is
 * never in the temporal dead zone; a `const` would be, and would throw when
 * RepeaterField.js happened to be the entry point.
 */
export default function RepeaterField({ field, value, error, onChange, disabled = false }) {
  const [openRows, setOpenRows] = useState(() => new Set());

  const items = useMemo(() => toArray(value), [value]);
  const of = useMemo(() => (Array.isArray(field.of) ? field.of : []), [field.of]);

  const min = typeof field.min === 'number' ? field.min : 0;
  const max = typeof field.max === 'number' ? field.max : Infinity;
  const atMax = items.length >= max;
  const atMin = items.length <= min;

  const emit = useCallback(next => onChange(field.name, next), [field.name, onChange]);

  const toggleRow = useCallback(id => {
    setOpenRows(prev => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }, []);

  const handleAdd = useCallback(() => {
    if (disabled || atMax) return;
    const item = createItem(of);
    emit([...items, item]);
    setOpenRows(prev => new Set(prev).add(item.id));
  }, [atMax, disabled, emit, items, of]);

  const handleDuplicate = useCallback(
    index => {
      if (disabled || atMax) return;
      const copy = { ...asObject(items[index]), id: nanoid() };
      const next = [...items];
      next.splice(index + 1, 0, copy);
      emit(next);
      setOpenRows(prev => new Set(prev).add(copy.id));
    },
    [atMax, disabled, emit, items]
  );

  const handleRemove = useCallback(
    index => {
      if (disabled || atMin) return;
      emit(items.filter((_, i) => i !== index));
    },
    [atMin, disabled, emit, items]
  );

  const handleItemChange = useCallback(
    (index, key, next) => {
      emit(items.map((item, i) => (i === index ? { ...asObject(item), [key]: next } : item)));
    },
    [emit, items]
  );

  // SortableList hands `renderItem` the item, not its index.
  const indexById = useMemo(() => {
    const map = new Map();
    items.forEach((item, index) => map.set(rowId(item), index));
    return map;
  }, [items]);

  const renderRow = useCallback(
    (item, { dragHandleProps }) => {
      const id = rowId(item);
      const index = indexById.get(id) ?? 0;
      const isOpen = openRows.has(id);
      const data = asObject(item);

      return (
        <div className="repeater-item" data-open={isOpen}>
          <div className="repeater-head">
            <button
              {...dragHandleProps}
              className="repeater-btn repeater-drag"
              disabled={disabled}
              title="Drag to reorder"
            >
              ⠿
            </button>

            <span className="repeater-index" aria-hidden="true">
              {index + 1}.
            </span>

            <button
              type="button"
              className="repeater-title"
              aria-expanded={isOpen}
              onClick={() => toggleRow(id)}
            >
              <span className="caret" aria-hidden="true">
                {isOpen ? '▾' : '▸'}
              </span>
              {resolveLabel(field, data, index)}
            </button>

            <button
              type="button"
              className="repeater-btn"
              disabled={disabled || atMax}
              title={atMax ? `Limit of ${field.max} reached` : 'Duplicate'}
              aria-label={`Duplicate item ${index + 1}`}
              onClick={() => handleDuplicate(index)}
            >
              ⧉
            </button>

            <button
              type="button"
              className="repeater-btn danger"
              disabled={disabled || atMin}
              title={atMin ? `At least ${min} required` : 'Remove'}
              aria-label={`Remove item ${index + 1}`}
              onClick={() => handleRemove(index)}
            >
              &times;
            </button>
          </div>

          {isOpen ? (
            <div className="repeater-body">
              {of.map(sub => {
                if (!sub?.name) return null;
                if (typeof sub.when === 'function' && !sub.when(data)) return null;

                const Control = getFieldComponent(sub.type || 'text');

                if (!Control) {
                  if (process.env.NODE_ENV !== 'production') {
                    console.warn(
                      `[RepeaterField] Unknown field type "${sub.type}" for "${field.name}.${sub.name}"`
                    );
                  }
                  return null;
                }

                return (
                  <Control
                    key={sub.name}
                    field={sub}
                    value={data[sub.name]}
                    onChange={(key, next) => handleItemChange(index, key, next)}
                    disabled={disabled}
                  />
                );
              })}
            </div>
          ) : null}
        </div>
      );
    },
    [
      atMax,
      atMin,
      disabled,
      field,
      handleDuplicate,
      handleItemChange,
      handleRemove,
      indexById,
      min,
      of,
      openRows,
      toggleRow,
    ]
  );

  const countLabel = `${items.length}${max === Infinity ? '' : ` / ${field.max}`} ${
    items.length === 1 ? 'item' : 'items'
  }`;

  return (
    <Field
      name={field.name}
      label={field.label}
      hint={field.hint}
      error={error}
      required={field.required}
      colSpan={field.colSpan ?? 2}
    >
      {() => (
        <StyledRepeater>
          {items.length === 0 ? (
            <p className="repeater-empty">Nothing here yet.</p>
          ) : (
            <SortableList items={items} getId={rowId} onReorder={emit} renderItem={renderRow} />
          )}

          <div className="repeater-footer">
            <button
              type="button"
              className="repeater-add"
              disabled={disabled || atMax}
              onClick={handleAdd}
            >
              {atMax ? `Limit of ${field.max} reached` : '+ Add'}
            </button>
            <span className="repeater-count">{countLabel}</span>
          </div>
        </StyledRepeater>
      )}
    </Field>
  );
}

RepeaterField.propTypes = {
  field: PropTypes.shape({
    name: PropTypes.string.isRequired,
    label: PropTypes.node,
    hint: PropTypes.node,
    required: PropTypes.bool,
    /** Descriptors for one item. */
    of: PropTypes.array,
    /** `(item, index) => string`, or a noun used as `"<noun> N"`. */
    itemLabel: PropTypes.oneOfType([PropTypes.func, PropTypes.string]),
    min: PropTypes.number,
    max: PropTypes.number,
    colSpan: PropTypes.oneOf([1, 2]),
  }).isRequired,
  value: PropTypes.any,
  error: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  disabled: PropTypes.bool,
};
