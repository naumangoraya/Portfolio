'use client';

import React, { useCallback, useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import Markdown from '../../utils/markdown';

/**
 * A textarea with an insertion toolbar and a live preview.
 *
 * Deliberately not CodeMirror / TipTap / MDXEditor: those are 200–600 kB of
 * client JS, and this is a single-author portfolio admin. A textarea plus six
 * insertion helpers covers the actual authoring surface, and the preview goes
 * through the exact same `<Markdown>` the public page uses, so what the admin
 * sees is what ships.
 */

const StyledEditor = styled.div`
  border: 1px solid var(--lightest-navy);
  border-radius: var(--border-radius);
  background-color: var(--light-navy);
  overflow: hidden;

  &:focus-within {
    border-color: var(--green);
  }

  .md-toolbar {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 4px;
    padding: 6px 8px;
    background-color: var(--navy);
    border-bottom: 1px solid var(--lightest-navy);
  }

  .md-toolbar button {
    background: none;
    border: 1px solid transparent;
    border-radius: var(--border-radius);
    color: var(--light-slate);
    font-family: var(--font-mono);
    font-size: var(--fz-xs);
    padding: 5px 9px;
    cursor: pointer;
    transition: var(--transition);

    &:hover:not(:disabled) {
      color: var(--green);
      background-color: var(--green-tint);
    }

    &:disabled {
      opacity: 0.4;
      cursor: not-allowed;
    }

    &.is-active {
      color: var(--green);
      border-color: var(--green);
    }
  }

  .md-toolbar .spacer {
    flex: 1 1 auto;
  }

  textarea {
    display: block;
    width: 100%;
    border: 0;
    padding: 14px;
    background-color: var(--light-navy);
    color: var(--lightest-slate);
    font-family: var(--font-mono);
    font-size: var(--fz-sm);
    line-height: 1.7;
    resize: vertical;

    &:focus {
      outline: none;
    }

    &::placeholder {
      color: var(--dark-slate);
    }
  }

  .md-preview {
    padding: 14px;
    border-top: 1px dashed var(--lightest-navy);
    background-color: var(--navy);
    max-height: 420px;
    overflow-y: auto;
  }

  .md-preview-empty {
    color: var(--slate);
    font-family: var(--font-mono);
    font-size: var(--fz-xs);
  }

  .md-footer {
    display: flex;
    justify-content: space-between;
    gap: 10px;
    padding: 6px 10px;
    border-top: 1px solid var(--lightest-navy);
    background-color: var(--navy);
    color: var(--slate);
    font-family: var(--font-mono);
    font-size: var(--fz-xxs);
  }

  @media (max-width: 480px) {
    .md-toolbar button {
      padding: 5px 7px;
    }
  }
`;

/** Wrap the selection, or drop a placeholder in when there is none. */
const WRAP_ACTIONS = {
  bold: { before: '**', after: '**', placeholder: 'bold text', label: 'B', title: 'Bold' },
  italic: { before: '_', after: '_', placeholder: 'italic text', label: 'I', title: 'Italic' },
  code: { before: '`', after: '`', placeholder: 'code', label: '`', title: 'Inline code' },
  link: {
    before: '[',
    after: '](https://)',
    placeholder: 'link text',
    label: 'link',
    title: 'Link',
  },
};

/** Prefix every selected line. */
const LINE_ACTIONS = {
  heading: { prefix: '## ', placeholder: 'Heading', label: 'H2', title: 'Heading' },
  list: { prefix: '- ', placeholder: 'List item', label: '• list', title: 'Bulleted list' },
};

const MarkdownEditor = ({
  id,
  name,
  value,
  onChange,
  rows = 12,
  placeholder = 'Write markdown…',
  disabled = false,
  maxLength,
  describedBy,
  invalid = false,
}) => {
  const textareaRef = useRef(null);
  const pendingSelection = useRef(null);
  const [showPreview, setShowPreview] = useState(false);

  const text = typeof value === 'string' ? value : '';

  // Restore the caret after a toolbar insertion, once React has committed.
  useEffect(() => {
    const sel = pendingSelection.current;
    const el = textareaRef.current;
    if (!sel || !el) return;
    pendingSelection.current = null;
    el.focus();
    el.setSelectionRange(sel[0], sel[1]);
  }, [text]);

  const emit = useCallback(
    next => {
      if (typeof onChange === 'function') onChange(next);
    },
    [onChange]
  );

  const applyWrap = useCallback(
    key => {
      const el = textareaRef.current;
      if (!el) return;
      const { before, after, placeholder: ph } = WRAP_ACTIONS[key];
      const start = el.selectionStart ?? text.length;
      const end = el.selectionEnd ?? start;
      const selected = text.slice(start, end) || ph;
      const next = text.slice(0, start) + before + selected + after + text.slice(end);
      pendingSelection.current = [start + before.length, start + before.length + selected.length];
      emit(next);
    },
    [emit, text]
  );

  const applyLinePrefix = useCallback(
    key => {
      const el = textareaRef.current;
      if (!el) return;
      const { prefix, placeholder: ph } = LINE_ACTIONS[key];
      const start = el.selectionStart ?? text.length;
      const end = el.selectionEnd ?? start;
      const lineStart = text.lastIndexOf('\n', start - 1) + 1;
      const lineEnd = text.indexOf('\n', end) === -1 ? text.length : text.indexOf('\n', end);
      const chunk = text.slice(lineStart, lineEnd) || ph;
      const prefixed = chunk
        .split('\n')
        .map(line => (line.startsWith(prefix) ? line : prefix + line))
        .join('\n');
      const next = text.slice(0, lineStart) + prefixed + text.slice(lineEnd);
      pendingSelection.current = [lineStart + prefixed.length, lineStart + prefixed.length];
      emit(next);
    },
    [emit, text]
  );

  return (
    <StyledEditor>
      <div className="md-toolbar">
        {Object.keys(WRAP_ACTIONS).map(key => (
          <button
            key={key}
            type="button"
            title={WRAP_ACTIONS[key].title}
            aria-label={WRAP_ACTIONS[key].title}
            disabled={disabled}
            onClick={() => applyWrap(key)}
          >
            {WRAP_ACTIONS[key].label}
          </button>
        ))}
        {Object.keys(LINE_ACTIONS).map(key => (
          <button
            key={key}
            type="button"
            title={LINE_ACTIONS[key].title}
            aria-label={LINE_ACTIONS[key].title}
            disabled={disabled}
            onClick={() => applyLinePrefix(key)}
          >
            {LINE_ACTIONS[key].label}
          </button>
        ))}
        <span className="spacer" />
        <button
          type="button"
          className={showPreview ? 'is-active' : undefined}
          aria-pressed={showPreview}
          onClick={() => setShowPreview(p => !p)}
        >
          {showPreview ? 'hide preview' : 'preview'}
        </button>
      </div>

      <textarea
        id={id}
        name={name}
        ref={textareaRef}
        value={text}
        rows={rows}
        placeholder={placeholder}
        disabled={disabled}
        maxLength={maxLength}
        aria-describedby={describedBy}
        aria-invalid={invalid || undefined}
        onChange={e => emit(e.target.value)}
        spellCheck
      />

      {showPreview ? (
        <div className="md-preview">
          {text.trim() ? (
            <Markdown>{text}</Markdown>
          ) : (
            <div className="md-preview-empty">Nothing to preview yet.</div>
          )}
        </div>
      ) : null}

      <div className="md-footer">
        <span>markdown + GFM · raw HTML is escaped</span>
        <span>
          {text.length}
          {maxLength ? ` / ${maxLength}` : ''}
        </span>
      </div>
    </StyledEditor>
  );
};

MarkdownEditor.propTypes = {
  id: PropTypes.string,
  name: PropTypes.string,
  value: PropTypes.string,
  /** Called with the next markdown string (not an event). */
  onChange: PropTypes.func,
  rows: PropTypes.number,
  placeholder: PropTypes.string,
  disabled: PropTypes.bool,
  maxLength: PropTypes.number,
  describedBy: PropTypes.string,
  invalid: PropTypes.bool,
};

export default MarkdownEditor;
