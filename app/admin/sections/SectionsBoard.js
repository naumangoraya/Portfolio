'use client';

import React, { useCallback, useEffect, useMemo, useState } from 'react';
import styled from 'styled-components';
import { SectionBase } from '../../../lib/schemas/section.js';
import { useAdminResource } from '../../../src/hooks/useAdminResource';
import AdminModal from '../../../src/components/admin/AdminModal';
import ConfirmDialog from '../../../src/components/admin/ConfirmDialog';
import SchemaForm from '../../../src/components/admin/SchemaForm';
import SortableList from '../../../src/components/admin/SortableList';

/**
 * The layout board: what the home page is made of, in the order it renders.
 *
 * The number badge is the reason this screen exists in this shape. The site's
 * "01." / "02." labels come from a single CSS rule in GlobalStyle.js —
 * `.numbered-heading:before { counter-increment: section; content: '0' counter(section) '.' }`
 * — with no `counter-reset` anywhere. That makes the numbers a pure function of
 * DOM order: they are not stored, and nothing in the database knows about them.
 * Dragging a row therefore silently renumbers every heading below it, so the
 * badge recomputes locally from the same rule and shows the result before the
 * admin commits to a save.
 *
 * Only rows that actually reach the DOM increment the counter, which means
 * `numbered && visible && status === 'published'`. Hidden and draft rows show a
 * dash. The literal '0' prefix is reproduced rather than zero-padded, so a
 * tenth numbered section shows "010." here exactly as it does on the site.
 */

const ENDPOINT = '/api/sections';

const STATUS_OPTIONS = [
  { value: 'draft', label: 'Draft' },
  { value: 'published', label: 'Published' },
];

/**
 * Both forms derive from the server's own `SectionBase` instead of restating
 * its rules, so the anchor-id pattern and the length caps cannot drift out of
 * step with what /api/sections will accept.
 *
 * Only the layout fields are picked: `type`, `source`, `order` and `content`
 * are decided by this component, not typed by the admin.
 */
const LAYOUT_KEYS = {
  title: true,
  anchorId: true,
  navLabel: true,
  navVisible: true,
  numbered: true,
  visible: true,
  status: true,
};

/** Mirrors the server's superRefine so this lands on the field, not in a 400 toast. */
const requireAnchorForNav = schema =>
  schema.superRefine((value, ctx) => {
    if (value.navVisible && !value.anchorId) {
      ctx.addIssue({
        code: 'custom',
        path: ['anchorId'],
        message: 'A section shown in the nav needs an anchor id to link to',
      });
    }
  });

const SectionEditSchema = requireAnchorForNav(SectionBase.pick(LAYOUT_KEYS).partial());
const SectionCreateSchema = requireAnchorForNav(SectionBase.pick({ ...LAYOUT_KEYS, key: true }));

const EDIT_FIELDS = [
  {
    name: 'title',
    label: 'Heading',
    type: 'text',
    colSpan: 2,
    max: 200,
    hint: 'Leave blank to keep the component’s own hardcoded heading.',
  },
  {
    name: 'anchorId',
    label: 'Anchor id',
    type: 'text',
    max: 60,
    placeholder: 'about',
    hint: 'The DOM id nav links jump to. Lowercase, digits and dashes. Blank renders no id.',
  },
  {
    name: 'navLabel',
    label: 'Nav label',
    type: 'text',
    max: 60,
    hint: 'Text shown in the site nav. Needs an anchor id to link to.',
  },
  {
    name: 'navVisible',
    label: 'Show in nav',
    type: 'switch',
    onLabel: 'In nav',
    offLabel: 'Hidden',
  },
  {
    name: 'numbered',
    label: 'Numbered heading',
    type: 'switch',
    onLabel: 'Numbered',
    offLabel: 'Plain',
    hint: 'Adds the 01. / 02. counter prefix.',
  },
  { name: 'visible', label: 'Visible', type: 'switch', onLabel: 'Visible', offLabel: 'Hidden' },
  { name: 'status', label: 'Status', type: 'select', options: STATUS_OPTIONS, default: 'draft' },
];

const CREATE_FIELDS = [
  {
    name: 'key',
    label: 'Key',
    type: 'text',
    required: true,
    colSpan: 2,
    max: 60,
    placeholder: 'testimonials',
    hint: 'Unique, permanent identifier for this section. Lowercase, dashes allowed.',
  },
  ...EDIT_FIELDS,
];

const StyledBoard = styled.div`
  .board-head {
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

  .row {
    display: grid;
    grid-template-columns: auto 46px minmax(0, 1fr) auto;
    align-items: center;
    gap: 14px;
    padding: 14px 16px;
    background: var(--light-navy);
    border: 1px solid var(--lightest-navy);
    border-radius: var(--border-radius);

    &[data-hidden='true'] {
      opacity: 0.62;
    }

    &.no-handle {
      grid-template-columns: 46px minmax(0, 1fr) auto;
    }
  }

  .plain-list {
    list-style: none;
    margin: 0;
    padding: 0;
    display: flex;
    flex-direction: column;
    gap: 12px;
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

    code {
      color: var(--green);
      font-family: var(--font-mono);
      font-size: var(--fz-xs);
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

  .row-number {
    color: var(--green);
    font-family: var(--font-mono);
    font-size: var(--fz-sm);
    text-align: right;

    &[data-unnumbered='true'] {
      color: var(--dark-slate);
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

  .badge {
    display: inline-flex;
    align-items: center;
    padding: 2px 7px;
    border-radius: 10px;
    border: 1px solid currentcolor;
    font-family: var(--font-mono);
    font-size: var(--fz-xxs);
    letter-spacing: 0.04em;
  }

  .badge.builtin {
    color: var(--blue);
  }

  .badge.custom {
    color: var(--pink);
  }

  .row-actions {
    display: flex;
    align-items: center;
    gap: 8px;
    flex-wrap: wrap;
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

    &[data-on='true'] {
      border-color: var(--green);
      background: var(--green-tint);
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

  @media (max-width: 780px) {
    .row {
      grid-template-columns: auto 46px minmax(0, 1fr);
    }

    .row-actions {
      grid-column: 1 / -1;
      justify-content: flex-start;
    }
  }
`;

/**
 * Reproduce the CSS counter locally. Returns one entry per section: the label
 * the site will render, or null when the row contributes no number.
 */
export function computeNumbers(sections) {
  let counter = 0;

  return sections.map(section => {
    const rendered = Boolean(section?.visible) && section?.status === 'published';
    if (!rendered || !section?.numbered) return null;
    counter += 1;
    return `0${counter}.`;
  });
}

const SectionsBoard = () => {
  const { items, busy, refresh, create, update, remove, reorder } = useAdminResource(ENDPOINT);

  const [status, setStatus] = useState('loading');
  const [adding, setAdding] = useState(false);
  const [editing, setEditing] = useState(null);
  const [deleting, setDeleting] = useState(null);

  // 'loading' is the initial state, so the mount path needs no synchronous
  // setState; only the retry button has to reset it.
  const load = useCallback(async () => {
    const next = await refresh();
    setStatus(next === null ? 'error' : 'ready');
  }, [refresh]);

  const reload = useCallback(() => {
    setStatus('loading');
    load();
  }, [load]);

  useEffect(() => {
    load();
  }, [load]);

  /**
   * With an empty collection, GET /api/sections answers with DEFAULT_LAYOUT —
   * the code-defined fallback the site is really rendering. Those rows carry
   * synthetic `default-*` ids, so every mutation would PUT to a non-ObjectId
   * and fail. Show what the page looks like, but make it read-only until the
   * seed has actually created the documents.
   */
  const unseeded = useMemo(
    () => items.length > 0 && items.every(section => String(section?._id).startsWith('default-')),
    [items]
  );

  const numberById = useMemo(() => {
    const labels = computeNumbers(items);
    return new Map(items.map((section, index) => [String(section?._id), labels[index]]));
  }, [items]);

  const handleReorder = useCallback(
    next => {
      reorder(next);
    },
    [reorder]
  );

  const handleCreate = useCallback(
    async values => {
      const created = await create({
        ...values,
        type: 'custom',
        source: 'custom',
        order: items.length,
        content: { blocks: [] },
      });

      if (created) setAdding(false);
    },
    [create, items.length]
  );

  const handleEdit = useCallback(
    async values => {
      if (!editing) return;
      const saved = await update(editing._id, values);
      if (saved) setEditing(null);
    },
    [editing, update]
  );

  const handleDelete = useCallback(async () => {
    if (!deleting) return;
    const done = await remove(deleting._id);
    if (done) setDeleting(null);
  }, [deleting, remove]);

  const renderRow = useCallback(
    (section, handleProps = {}) => {
      const { dragHandleProps } = handleProps;
      const number = numberById.get(String(section._id));
      const custom = section.source === 'custom';
      const published = section.status === 'published';
      const locked = busy || unseeded;

      return (
        <div
          className={`row${dragHandleProps ? '' : ' no-handle'}`}
          data-hidden={!section.visible || !published}
        >
          {dragHandleProps ? (
            <button className="drag-handle" {...dragHandleProps}>
              <span aria-hidden="true">⠿</span>
            </button>
          ) : null}

          <span className="row-number" data-unnumbered={!number}>
            {number || '—'}
          </span>

          <div className="row-main">
            <span className="row-title">{section.title || section.key}</span>
            <span className="row-meta">
              <span className={`badge ${custom ? 'custom' : 'builtin'}`}>
                {custom ? 'Custom' : 'Built-in'}
              </span>
              <span>{section.key}</span>
              {section.anchorId ? <span>#{section.anchorId}</span> : null}
              {section.navVisible ? <span>in nav</span> : null}
            </span>
          </div>

          <div className="row-actions">
            <button
              type="button"
              className="chip"
              data-on={section.visible}
              disabled={locked}
              aria-pressed={Boolean(section.visible)}
              onClick={() => update(section._id, { visible: !section.visible })}
            >
              {section.visible ? 'Visible' : 'Hidden'}
            </button>

            <button
              type="button"
              className="chip"
              data-on={published}
              disabled={locked}
              aria-pressed={published}
              onClick={() => update(section._id, { status: published ? 'draft' : 'published' })}
            >
              {published ? 'Published' : 'Draft'}
            </button>

            <button
              type="button"
              className="chip"
              disabled={locked}
              onClick={() => setEditing(section)}
            >
              Edit
            </button>

            <button
              type="button"
              className="chip danger"
              disabled={locked || !custom}
              title={
                custom
                  ? undefined
                  : 'Built-in sections wrap existing components and cannot be deleted — hide them instead.'
              }
              onClick={() => setDeleting(section)}
            >
              Delete
            </button>
          </div>
        </div>
      );
    },
    [busy, numberById, unseeded, update]
  );

  return (
    <StyledBoard>
      <div className="board-head">
        <p>
          Drag to change the order of the home page. The number badge is the heading number each
          section will render once saved — it is derived from position, so moving one row renumbers
          the ones below it. Hidden and draft rows do not take a number.
        </p>
        <button
          type="button"
          className="primary-action"
          disabled={busy || unseeded || status === 'loading'}
          onClick={() => setAdding(true)}
        >
          Add section
        </button>
      </div>

      {unseeded ? (
        <p className="notice">
          These are the code-defined defaults, not database rows — the sections collection is still
          empty, so there is nothing here to edit yet. Run <code>npm run seed:sections</code> to
          create them, then reload this page.
        </p>
      ) : null}

      {status === 'loading' ? (
        <div className="state-panel" role="status">
          <h2>Loading sections</h2>
          <p>Fetching the current page layout.</p>
        </div>
      ) : null}

      {status === 'error' ? (
        <div className="state-panel is-error" role="alert">
          <h2>Could not load sections</h2>
          <p>
            The request to <code>{ENDPOINT}</code> failed. Check the API route and your session,
            then try again.
          </p>
          <button type="button" className="primary-action" onClick={reload}>
            Try again
          </button>
        </div>
      ) : null}

      {status === 'ready' && items.length === 0 ? (
        <div className="state-panel">
          <h2>No sections yet</h2>
          <p>
            The home page is falling back to its code-defined layout. Add a section to start
            managing the order from here.
          </p>
          <button type="button" className="primary-action" onClick={() => setAdding(true)}>
            Add section
          </button>
        </div>
      ) : null}

      {status === 'ready' && items.length > 0 && !unseeded ? (
        <SortableList items={items} onReorder={handleReorder} renderItem={renderRow} />
      ) : null}

      {status === 'ready' && unseeded ? (
        <ul className="plain-list">
          {items.map(section => (
            <li key={String(section._id)}>{renderRow(section)}</li>
          ))}
        </ul>
      ) : null}

      <AdminModal
        open={adding}
        title="Add a custom section"
        size="lg"
        onClose={() => setAdding(false)}
        footer={
          <>
            <button type="button" className="cancel" onClick={() => setAdding(false)}>
              Cancel
            </button>
            <button type="submit" form="section-create-form" className="save" disabled={busy}>
              {busy ? 'Creating...' : 'Create section'}
            </button>
          </>
        }
      >
        <SchemaForm
          id="section-create-form"
          fields={CREATE_FIELDS}
          schema={SectionCreateSchema}
          initialValues={{
            title: '',
            anchorId: '',
            navLabel: '',
            navVisible: false,
            numbered: true,
            visible: true,
            status: 'draft',
          }}
          disabled={busy}
          showActions={false}
          onSubmit={handleCreate}
        />
      </AdminModal>

      <AdminModal
        open={Boolean(editing)}
        title={editing ? `Edit ${editing.title || editing.key}` : 'Edit section'}
        size="lg"
        onClose={() => setEditing(null)}
        footer={
          <>
            <button type="button" className="cancel" onClick={() => setEditing(null)}>
              Cancel
            </button>
            <button type="submit" form="section-edit-form" className="save" disabled={busy}>
              {busy ? 'Saving...' : 'Save changes'}
            </button>
          </>
        }
      >
        {editing ? (
          <SchemaForm
            // Remount per section so the form reseeds from the row being edited.
            key={editing._id}
            id="section-edit-form"
            fields={EDIT_FIELDS}
            schema={SectionEditSchema}
            initialValues={editing}
            disabled={busy}
            showActions={false}
            onSubmit={handleEdit}
          />
        ) : null}
      </AdminModal>

      <ConfirmDialog
        open={Boolean(deleting)}
        title="Delete section"
        destructive
        busy={busy}
        confirmLabel="Delete"
        message={
          deleting
            ? `Delete "${deleting.title || deleting.key}" and its blocks? This cannot be undone.`
            : ''
        }
        onCancel={() => setDeleting(null)}
        onConfirm={handleDelete}
      />
    </StyledBoard>
  );
};

export default SectionsBoard;
