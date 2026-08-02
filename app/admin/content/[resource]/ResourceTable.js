'use client';

import React, { useCallback, useEffect, useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import toast from 'react-hot-toast';
import { authFetch } from '../../../../src/lib/authFetch';
import { useAdminResource } from '../../../../src/hooks/useAdminResource';
import AdminModal from '../../../../src/components/admin/AdminModal';
import ConfirmDialog from '../../../../src/components/admin/ConfirmDialog';
import SchemaForm from '../../../../src/components/admin/SchemaForm';
import SortableList from '../../../../src/components/admin/SortableList';
import {
  AboutSchema,
  ContactSchema,
  EducationSchema,
  HeroSchema,
  JobSchema,
  ProjectSchema,
  ServiceSchema,
} from '../../../../lib/schemas/content.js';

/**
 * The editor for one content model, in either of its two shapes.
 *
 * Collections get a sortable list with add / edit / delete; singletons get a
 * single always-present form, because their endpoint upserts and there is
 * nothing to list.
 *
 * The Zod schemas are resolved here rather than passed down from the page: a
 * Zod schema is a class instance and cannot cross the RSC boundary. Keep this
 * map in step with RESOURCE_REGISTRY in ./page.js — they are keyed by the same
 * slugs, and a missing entry only costs client-side validation, not the form.
 */

const SCHEMAS = {
  jobs: JobSchema,
  services: ServiceSchema,
  projects: ProjectSchema,
  education: EducationSchema,
  hero: HeroSchema,
  about: AboutSchema,
  contact: ContactSchema,
};

/**
 * Document -> form values, where the stored shape and the writable shape differ.
 *
 * Hero is the only one: /api/hero's `transformIn` renames `tagline` to
 * `description` on the way in, so the stored `description` has to be read back
 * out as `tagline`, and the stored `description` key must not survive into the
 * payload (it would be re-interpreted as the long copy).
 */
const ADAPTERS = {
  hero: doc => {
    const { description, ...rest } = doc || {};
    return { ...rest, tagline: rest.tagline || description || '' };
  },
};

/** First of these present on a record becomes the row's secondary line. */
const SUBTITLE_KEYS = ['company', 'school', 'institution', 'category', 'range', 'year', 'location'];

const toTagString = entry => {
  if (typeof entry === 'string') return entry;
  if (entry && typeof entry === 'object') {
    return entry.name || entry.title || entry.label || '';
  }
  return entry == null ? '' : String(entry);
};

function toFormValues(resource, doc, fields) {
  const adapt = ADAPTERS[resource];
  const values = adapt ? adapt(doc) : { ...(doc || {}) };

  // Records written before these lists were string arrays can still hold
  // objects. TagsField renders its entries straight into JSX, so an object
  // would throw rather than degrade — coerce before it gets the chance.
  fields.forEach(field => {
    if (field.type !== 'tags') return;
    const value = values[field.name];
    if (!Array.isArray(value)) return;
    values[field.name] = value.map(toTagString).filter(Boolean);
  });

  return values;
}

const StyledResource = styled.div`
  .resource-head {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 20px;
    flex-wrap: wrap;
    margin-bottom: 24px;

    p {
      margin: 0;
      max-width: 68ch;
      color: var(--light-slate);
      font-size: var(--fz-sm);
      line-height: 1.6;
    }
  }

  .primary-action {
    flex: 0 0 auto;
    padding: 10px 20px;
    border: none;
    border-radius: var(--border-radius);
    background: var(--green);
    color: var(--navy);
    font-size: var(--fz-sm);
    font-weight: 600;
    cursor: pointer;
    transition: var(--transition);

    &:hover:not(:disabled) {
      background: var(--light-green);
    }

    &:disabled {
      opacity: 0.55;
      cursor: not-allowed;
    }
  }

  .state-panel {
    padding: 28px;
    background: var(--light-navy);
    border: 1px solid var(--lightest-navy);
    border-radius: var(--border-radius);
    text-align: center;

    &.is-error {
      border-color: var(--pink);
    }

    h2 {
      margin: 0 0 8px;
      color: var(--lightest-slate);
      font-size: var(--fz-md);
    }

    p {
      margin: 0 auto 16px;
      max-width: 52ch;
      color: var(--light-slate);
      font-size: var(--fz-sm);
      line-height: 1.6;
    }
  }

  .notice {
    margin: 0 0 20px;
    padding: 14px 16px;
    border: 1px solid var(--lightest-navy);
    border-left: 2px solid var(--green);
    border-radius: var(--border-radius);
    background: var(--light-navy);
    color: var(--light-slate);
    font-size: var(--fz-sm);
    line-height: 1.6;
  }

  .singleton-panel {
    padding: 24px;
    background: var(--light-navy);
    border: 1px solid var(--lightest-navy);
    border-radius: var(--border-radius);
  }

  .plain-list {
    list-style: none;
    margin: 0;
    padding: 0;
    display: flex;
    flex-direction: column;
    gap: 12px;
  }

  .row {
    display: grid;
    grid-template-columns: auto minmax(0, 1fr) auto;
    align-items: center;
    gap: 14px;
    padding: 14px 16px;
    background: var(--light-navy);
    border: 1px solid var(--lightest-navy);
    border-radius: var(--border-radius);

    &[data-inactive='true'] {
      opacity: 0.6;
    }

    &.no-handle {
      grid-template-columns: minmax(0, 1fr) auto;
    }
  }

  .drag-handle {
    background: transparent;
    border: none;
    color: var(--slate);
    cursor: grab;
    font-size: var(--fz-lg);
    line-height: 1;
    padding: 4px 6px;
    border-radius: var(--border-radius);

    &:hover,
    &:focus-visible {
      color: var(--green);
      background: var(--navy);
    }

    &:active {
      cursor: grabbing;
    }
  }

  .row-main {
    min-width: 0;

    .row-title {
      display: block;
      color: var(--lightest-slate);
      font-size: var(--fz-md);
      font-weight: 600;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .row-meta {
      display: flex;
      align-items: center;
      flex-wrap: wrap;
      gap: 8px;
      margin-top: 6px;
      color: var(--slate);
      font-family: var(--font-mono);
      font-size: var(--fz-xxs);
    }
  }

  .row-actions {
    display: flex;
    align-items: center;
    gap: 8px;
    justify-content: flex-end;
  }

  .chip {
    padding: 6px 12px;
    border-radius: var(--border-radius);
    border: 1px solid var(--lightest-navy);
    background: transparent;
    color: var(--light-slate);
    font-family: var(--font-mono);
    font-size: var(--fz-xxs);
    cursor: pointer;
    transition: var(--transition);
    white-space: nowrap;

    &:hover:not(:disabled),
    &:focus-visible {
      border-color: var(--green);
      color: var(--green);
    }

    &.danger:hover:not(:disabled) {
      border-color: var(--pink);
      color: var(--pink);
    }

    &:disabled {
      opacity: 0.45;
      cursor: not-allowed;
    }
  }

  @media (max-width: 680px) {
    .row,
    .row.no-handle {
      grid-template-columns: auto minmax(0, 1fr);
    }

    .row-actions {
      grid-column: 1 / -1;
      justify-content: flex-start;
    }
  }
`;

const ResourceTable = ({
  resource,
  label,
  endpoint,
  fields,
  idKey = '_id',
  singleton = false,
  primaryField = 'title',
}) => {
  const { items, setItems, busy, refresh, create, update, remove } = useAdminResource(endpoint, {
    idKey,
  });

  const [status, setStatus] = useState('loading');
  const [doc, setDoc] = useState(null);
  const [savingDoc, setSavingDoc] = useState(false);
  const [adding, setAdding] = useState(false);
  const [editing, setEditing] = useState(null);
  const [deleting, setDeleting] = useState(null);

  const schema = SCHEMAS[resource] || null;
  const sortable = !singleton && fields.some(field => field.name === 'order');

  // 'loading' is the initial state, so the mount path needs no synchronous
  // setState; only the retry button has to reset it.
  const load = useCallback(async () => {
    if (singleton) {
      try {
        const data = await authFetch(endpoint, { silent: true });
        setDoc(data && typeof data === 'object' && !Array.isArray(data) ? data : {});
        setStatus('ready');
      } catch {
        setStatus('error');
      }
      return;
    }

    const next = await refresh();
    setStatus(next === null ? 'error' : 'ready');
  }, [singleton, endpoint, refresh]);

  const reload = useCallback(() => {
    setStatus('loading');
    load();
  }, [load]);

  useEffect(() => {
    load();
  }, [load]);

  /* --- singleton ------------------------------------------------------- */

  const handleSaveDoc = useCallback(
    async values => {
      setSavingDoc(true);
      try {
        const saved = await authFetch(endpoint, { method: 'PUT', body: values });
        setDoc(saved && typeof saved === 'object' ? saved : { ...(doc || {}), ...values });
        toast.success('Saved');
      } catch {
        /* authFetch has already toasted */
      } finally {
        setSavingDoc(false);
      }
    },
    [endpoint, doc]
  );

  /* --- collection ------------------------------------------------------ */

  const handleCreate = useCallback(
    async values => {
      const created = await create(values);
      if (created) setAdding(false);
    },
    [create]
  );

  const handleEdit = useCallback(
    async values => {
      if (!editing) return;
      const saved = await update(editing[idKey], values);
      if (saved) setEditing(null);
    },
    [editing, idKey, update]
  );

  const handleDelete = useCallback(async () => {
    if (!deleting) return;
    const done = await remove(deleting[idKey]);
    if (done) setDeleting(null);
  }, [deleting, idKey, remove]);

  /**
   * These collections have no `/reorder` endpoint — only `PUT /[id]` — so the
   * new order is written as one PUT per row that actually moved. Optimistic,
   * with a rollback, the same contract `useAdminResource.reorder` offers.
   */
  const handleReorder = useCallback(
    async next => {
      const previous = items;
      setItems(next);

      const moved = next
        .map((item, index) => ({ item, index }))
        .filter(({ item, index }) => item?.order !== index);

      if (moved.length === 0) return;

      try {
        await Promise.all(
          moved.map(({ item, index }) =>
            authFetch(`${endpoint}/${item?.[idKey]}`, {
              method: 'PUT',
              body: { order: index },
              silent: true,
            })
          )
        );
        setItems(next.map((item, index) => ({ ...item, order: index })));
        toast.success('Order saved');
      } catch {
        setItems(previous);
        toast.error('Could not save the new order');
      }
    },
    [endpoint, idKey, items, setItems]
  );

  const createDefaults = useMemo(
    () => ({ isActive: true, ...(sortable ? { order: items.length } : {}) }),
    [sortable, items.length]
  );

  const renderRow = useCallback(
    (item, handleProps = {}) => {
      const { dragHandleProps } = handleProps;
      const subtitleKey = SUBTITLE_KEYS.find(key => item?.[key]);

      return (
        <div
          className={`row${dragHandleProps ? '' : ' no-handle'}`}
          data-inactive={item?.isActive === false}
        >
          {dragHandleProps ? (
            <button className="drag-handle" {...dragHandleProps}>
              <span aria-hidden="true">⠿</span>
            </button>
          ) : null}

          <div className="row-main">
            <span className="row-title">{item?.[primaryField] || 'Untitled'}</span>
            <span className="row-meta">
              {subtitleKey ? <span>{String(item[subtitleKey])}</span> : null}
              {item?.isActive === false ? <span>hidden</span> : null}
            </span>
          </div>

          <div className="row-actions">
            <button type="button" className="chip" onClick={() => setEditing(item)}>
              Edit
            </button>
            <button
              type="button"
              className="chip danger"
              disabled={busy}
              onClick={() => setDeleting(item)}
            >
              Delete
            </button>
          </div>
        </div>
      );
    },
    [busy, primaryField]
  );

  /* --- render ---------------------------------------------------------- */

  if (status === 'loading') {
    return (
      <StyledResource>
        <div className="state-panel" role="status">
          <h2>Loading {label.toLowerCase()}</h2>
          <p>Fetching the current records.</p>
        </div>
      </StyledResource>
    );
  }

  if (status === 'error') {
    return (
      <StyledResource>
        <div className="state-panel is-error" role="alert">
          <h2>Could not load {label.toLowerCase()}</h2>
          <p>
            The request to <code>{endpoint}</code> failed. Check the API route and your session,
            then try again.
          </p>
          <button type="button" className="primary-action" onClick={reload}>
            Try again
          </button>
        </div>
      </StyledResource>
    );
  }

  if (singleton) {
    const configured = doc && Object.keys(doc).length > 0;

    return (
      <StyledResource>
        <div className="resource-head">
          <p>
            {label} is a single record. Saving upserts it, so this form works whether or not the
            document exists yet.
          </p>
        </div>

        {!configured ? (
          <p className="notice">
            Nothing saved yet — the site is rendering its built-in defaults for this section. Fill
            this in and save to take it over.
          </p>
        ) : null}

        <div className="singleton-panel">
          <SchemaForm
            fields={fields}
            schema={schema}
            initialValues={toFormValues(resource, doc, fields)}
            disabled={savingDoc}
            submitLabel={savingDoc ? 'Saving...' : 'Save'}
            onSubmit={handleSaveDoc}
          />
        </div>
      </StyledResource>
    );
  }

  return (
    <StyledResource>
      <div className="resource-head">
        <p>
          {items.length} {items.length === 1 ? 'record' : 'records'}.
          {sortable ? ' Drag to change the order they appear in on the site.' : ''}
        </p>
        <button
          type="button"
          className="primary-action"
          disabled={busy}
          onClick={() => setAdding(true)}
        >
          Add {label.toLowerCase()}
        </button>
      </div>

      {items.length === 0 ? (
        <div className="state-panel">
          <h2>No {label.toLowerCase()} yet</h2>
          <p>Nothing here is being rendered on the site. Add the first record to get started.</p>
          <button type="button" className="primary-action" onClick={() => setAdding(true)}>
            Add {label.toLowerCase()}
          </button>
        </div>
      ) : null}

      {items.length > 0 && sortable ? (
        <SortableList
          items={items}
          getId={item => item?.[idKey]}
          onReorder={handleReorder}
          renderItem={renderRow}
        />
      ) : null}

      {items.length > 0 && !sortable ? (
        <ul className="plain-list">
          {items.map(item => (
            <li key={String(item?.[idKey])}>{renderRow(item)}</li>
          ))}
        </ul>
      ) : null}

      <AdminModal
        open={adding}
        title={`Add ${label.toLowerCase()}`}
        size="xl"
        onClose={() => setAdding(false)}
        footer={
          <>
            <button type="button" className="cancel" onClick={() => setAdding(false)}>
              Cancel
            </button>
            <button type="submit" form="resource-create-form" className="save" disabled={busy}>
              {busy ? 'Creating...' : 'Create'}
            </button>
          </>
        }
      >
        <SchemaForm
          id="resource-create-form"
          fields={fields}
          schema={schema}
          initialValues={createDefaults}
          disabled={busy}
          showActions={false}
          onSubmit={handleCreate}
        />
      </AdminModal>

      <AdminModal
        open={Boolean(editing)}
        title={editing ? `Edit ${editing[primaryField] || label.toLowerCase()}` : 'Edit'}
        size="xl"
        onClose={() => setEditing(null)}
        footer={
          <>
            <button type="button" className="cancel" onClick={() => setEditing(null)}>
              Cancel
            </button>
            <button type="submit" form="resource-edit-form" className="save" disabled={busy}>
              {busy ? 'Saving...' : 'Save changes'}
            </button>
          </>
        }
      >
        {editing ? (
          <SchemaForm
            // Remount per record so the form reseeds from the row being edited.
            key={String(editing[idKey])}
            id="resource-edit-form"
            fields={fields}
            schema={schema}
            initialValues={toFormValues(resource, editing, fields)}
            disabled={busy}
            showActions={false}
            onSubmit={handleEdit}
          />
        ) : null}
      </AdminModal>

      <ConfirmDialog
        open={Boolean(deleting)}
        title={`Delete ${label.toLowerCase()}`}
        destructive
        busy={busy}
        confirmLabel="Delete"
        message={
          deleting
            ? `Delete "${deleting[primaryField] || 'this record'}"? This cannot be undone.`
            : ''
        }
        onCancel={() => setDeleting(null)}
        onConfirm={handleDelete}
      />
    </StyledResource>
  );
};

ResourceTable.propTypes = {
  /** Registry slug — also the key for the Zod schema and any value adapter. */
  resource: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  endpoint: PropTypes.string.isRequired,
  fields: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      type: PropTypes.string,
    })
  ).isRequired,
  idKey: PropTypes.string,
  singleton: PropTypes.bool,
  primaryField: PropTypes.string,
};

export default ResourceTable;
