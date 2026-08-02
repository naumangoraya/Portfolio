'use client';

import React, { useCallback, useId, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import styled, { keyframes } from 'styled-components';
import AdminModal from './AdminModal';
import { authFetch } from '../../lib/authFetch';

/**
 * The one image chooser for the admin panel.
 *
 * Three ways to set an image, all funnelling into the same `{ publicId, url,
 * alt }` value (`ImageRef` in `lib/schemas/_shared.js`):
 *
 *   1. Upload a file  - POST multipart to `/api/upload` under the field name
 *                       `image`, via `authFetch` so 401s log out consistently.
 *   2. Paste a URL    - for assets already hosted somewhere.
 *   3. Clear          - blanks the value.
 *
 * Alt text is always editable: it is part of the stored value, not a nicety.
 *
 * Mount-on-open: callers should render this only while it is open (see
 * `ImageField`), so every session starts from a clean draft without any
 * derived-state-from-props gymnastics.
 */

/* Mirrors the server: `lib/api/fileValidation.js` re-checks both by magic
   bytes and byte length, this is only the fast client-side rejection. */
export const ACCEPTED_IMAGE_TYPES = ['image/png', 'image/jpeg', 'image/webp', 'image/gif'];
export const ACCEPT_ATTRIBUTE = ACCEPTED_IMAGE_TYPES.join(',');
export const MAX_IMAGE_BYTES = 5 * 1024 * 1024;

const EMPTY_IMAGE = { publicId: '', url: '', alt: '' };

/**
 * Coerce whatever is in the document into an `ImageRef`.
 * Tolerates `undefined`, `{}`, and a bare URL string (some older descriptors
 * stored just the url).
 */
export function normalizeImageValue(value) {
  if (typeof value === 'string') {
    return { ...EMPTY_IMAGE, url: value };
  }
  if (!value || typeof value !== 'object') {
    return { ...EMPTY_IMAGE };
  }
  return {
    publicId: typeof value.publicId === 'string' ? value.publicId : '',
    url: typeof value.url === 'string' ? value.url : '',
    alt: typeof value.alt === 'string' ? value.alt : '',
  };
}

/** True when the value carries no image (so callers can show a placeholder). */
export function isEmptyImage(value) {
  return !normalizeImageValue(value).url;
}

function formatBytes(bytes) {
  if (bytes >= 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1)}MB`;
  return `${Math.max(1, Math.round(bytes / 1024))}KB`;
}

const indeterminate = keyframes`
  0%   { transform: translateX(-100%); }
  100% { transform: translateX(300%); }
`;

const StyledPicker = styled.div`
  display: flex;
  flex-direction: column;
  gap: 22px;

  .picker-section {
    border: 1px solid var(--lightest-navy);
    border-radius: var(--border-radius);
    padding: 16px;
    background: var(--light-navy);
  }

  .picker-section h4 {
    margin: 0 0 10px;
    color: var(--green);
    font-family: var(--font-mono);
    font-size: var(--fz-xs);
    font-weight: 600;
    text-transform: lowercase;
  }

  .picker-preview {
    display: flex;
    align-items: center;
    gap: 16px;
  }

  .picker-thumb {
    width: 96px;
    height: 96px;
    flex: 0 0 96px;
    border-radius: var(--border-radius);
    border: 1px solid var(--lightest-navy);
    background: var(--navy);
    object-fit: cover;
    display: block;
  }

  .picker-thumb-empty {
    width: 96px;
    height: 96px;
    flex: 0 0 96px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: var(--border-radius);
    border: 1px dashed var(--lightest-navy);
    background: var(--navy);
    color: var(--dark-slate);
    font-family: var(--font-mono);
    font-size: var(--fz-xxs);
  }

  .picker-meta {
    min-width: 0;
    color: var(--slate);
    font-family: var(--font-mono);
    font-size: var(--fz-xxs);
    line-height: 1.6;
    word-break: break-all;
  }

  label {
    display: block;
    color: var(--green);
    font-family: var(--font-mono);
    font-size: var(--fz-xs);
    font-weight: 600;
    margin-bottom: 8px;
  }

  input[type='text'],
  input[type='url'],
  input[type='file'] {
    width: 100%;
    padding: 12px;
    background: var(--navy);
    border: 1px solid var(--lightest-navy);
    border-radius: var(--border-radius);
    color: var(--lightest-slate);
    font-size: var(--fz-sm);
    font-family: inherit;
    transition: border-color 0.2s ease;

    &:focus {
      outline: none;
      border-color: var(--green);
      box-shadow: 0 0 0 2px var(--green-tint);
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

  input[type='file'] {
    font-family: var(--font-mono);
    font-size: var(--fz-xxs);
    cursor: pointer;
    padding: 10px;
  }

  input[type='file']::file-selector-button {
    margin-right: 12px;
    padding: 6px 12px;
    border: 1px solid var(--green);
    border-radius: var(--border-radius);
    background: var(--green-tint);
    color: var(--green);
    font-family: var(--font-mono);
    font-size: var(--fz-xxs);
    cursor: pointer;
  }

  .picker-hint {
    display: block;
    margin-top: 8px;
    color: var(--slate);
    font-size: var(--fz-xxs);
    line-height: 1.5;
  }

  .picker-error {
    display: block;
    margin-top: 10px;
    color: var(--pink);
    font-family: var(--font-mono);
    font-size: var(--fz-xxs);
    line-height: 1.5;
  }

  .picker-status {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-top: 10px;
    color: var(--green);
    font-family: var(--font-mono);
    font-size: var(--fz-xxs);
  }

  .picker-progress {
    position: relative;
    flex: 1 1 auto;
    height: 3px;
    border-radius: 3px;
    background: var(--lightest-navy);
    overflow: hidden;
  }

  .picker-progress span {
    position: absolute;
    inset: 0 auto 0 0;
    width: 33%;
    background: var(--green);
    animation: ${indeterminate} 1.1s ease-in-out infinite;
  }

  .picker-clear {
    background: transparent;
    border: 1px solid var(--lightest-navy);
    border-radius: var(--border-radius);
    color: var(--light-slate);
    cursor: pointer;
    font-family: var(--font-mono);
    font-size: var(--fz-xxs);
    padding: 8px 14px;
    transition: all 0.2s ease;

    &:hover:not(:disabled),
    &:focus-visible:not(:disabled) {
      border-color: var(--pink);
      color: var(--pink);
    }

    &:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }
  }
`;

const ImagePicker = ({
  open = true,
  value = null,
  title = 'Choose image',
  onClose,
  onConfirm,
  uploadUrl = '/api/upload',
}) => {
  const [draft, setDraft] = useState(() => normalizeImageValue(value));
  const [pending, setPending] = useState(false);
  const [localError, setLocalError] = useState(null);
  const [fileName, setFileName] = useState('');
  const fileInputRef = useRef(null);
  const reactId = useId();
  const altId = `image-picker-alt-${reactId}`;
  const fileId = `image-picker-file-${reactId}`;

  const patch = useCallback(next => {
    setDraft(prev => ({ ...prev, ...next }));
  }, []);

  const handleFile = useCallback(
    async file => {
      setLocalError(null);

      if (!file) return;

      if (file.type && !ACCEPTED_IMAGE_TYPES.includes(file.type)) {
        setLocalError('Unsupported format. Use PNG, JPEG, WebP or GIF.');
        return;
      }

      if (file.size > MAX_IMAGE_BYTES) {
        setLocalError(
          `That file is ${formatBytes(file.size)}. The limit is ${formatBytes(MAX_IMAGE_BYTES)}.`
        );
        return;
      }

      const form = new FormData();
      // Field name must be `image` - see app/api/upload/route.js.
      form.append('image', file);

      setPending(true);
      setFileName(file.name || '');

      try {
        const result = await authFetch(uploadUrl, { method: 'POST', form, silent: true });
        // `authFetch` unwraps `data` when the new envelope is used; the route
        // also mirrors url/publicId at the root, so accept either.
        const url = result?.url || result?.data?.url || '';
        const publicId = result?.publicId || result?.data?.publicId || '';

        if (!url) {
          setLocalError('Upload succeeded but no URL came back.');
          return;
        }

        patch({ url, publicId });
      } catch (uploadError) {
        setLocalError(uploadError?.message || 'Upload failed. Please try again.');
      } finally {
        setPending(false);
      }
    },
    [patch, uploadUrl]
  );

  const handleClear = useCallback(() => {
    setLocalError(null);
    setFileName('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    setDraft({ ...EMPTY_IMAGE });
  }, []);

  const handleConfirm = useCallback(() => {
    if (pending) return;
    onConfirm?.({
      publicId: draft.publicId || '',
      url: draft.url || '',
      alt: draft.alt || '',
    });
  }, [draft, onConfirm, pending]);

  const footer = (
    <>
      <button type="button" className="cancel" onClick={onClose} disabled={pending}>
        Cancel
      </button>
      <button type="button" className="save" onClick={handleConfirm} disabled={pending}>
        {pending ? 'Uploading…' : 'Save image'}
      </button>
    </>
  );

  return (
    <AdminModal open={open} title={title} onClose={onClose} size="md" footer={footer}>
      <StyledPicker>
        <div className="picker-preview">
          {draft.url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img className="picker-thumb" src={draft.url} alt={draft.alt || 'Selected image'} />
          ) : (
            <div className="picker-thumb-empty" aria-hidden="true">
              no image
            </div>
          )}
          <div className="picker-meta">
            {draft.url ? (
              <>
                <div>{draft.url}</div>
                {draft.publicId ? <div>id: {draft.publicId}</div> : null}
                {fileName ? <div>from: {fileName}</div> : null}
              </>
            ) : (
              <div>Nothing selected yet.</div>
            )}
          </div>
        </div>

        <div className="picker-section">
          <h4>upload</h4>
          <input
            id={fileId}
            ref={fileInputRef}
            type="file"
            accept={ACCEPT_ATTRIBUTE}
            disabled={pending}
            aria-label="Upload an image file"
            onChange={event => handleFile(event.target.files?.[0])}
          />
          <small className="picker-hint">
            PNG, JPEG, WebP or GIF, up to {formatBytes(MAX_IMAGE_BYTES)}. The server re-checks the
            format by magic bytes.
          </small>
          {pending ? (
            <div className="picker-status" role="status">
              <span>Uploading…</span>
              <span className="picker-progress" aria-hidden="true">
                <span />
              </span>
            </div>
          ) : null}
        </div>

        <div className="picker-section">
          <h4>or paste a url</h4>
          <input
            type="url"
            value={draft.url}
            placeholder="https://res.cloudinary.com/…"
            disabled={pending}
            aria-label="Image URL"
            onChange={event => patch({ url: event.target.value, publicId: '' })}
          />
          <small className="picker-hint">
            Pasting a URL clears the Cloudinary public id, since the asset is no longer ours to
            delete.
          </small>
        </div>

        <div className="picker-section">
          <label htmlFor={altId}>Alt text</label>
          <input
            id={altId}
            type="text"
            value={draft.alt}
            placeholder="Describe the image for screen readers"
            disabled={pending}
            onChange={event => patch({ alt: event.target.value })}
          />
          <small className="picker-hint">Leave empty only if the image is purely decorative.</small>
        </div>

        <div>
          <button
            type="button"
            className="picker-clear"
            onClick={handleClear}
            disabled={pending || (!draft.url && !draft.alt && !draft.publicId)}
          >
            Clear image
          </button>
          {localError ? (
            <span className="picker-error" role="alert">
              {localError}
            </span>
          ) : null}
        </div>
      </StyledPicker>
    </AdminModal>
  );
};

ImagePicker.propTypes = {
  open: PropTypes.bool,
  /** Current `{ publicId, url, alt }` (or a bare url string, or nothing). */
  value: PropTypes.oneOfType([PropTypes.object, PropTypes.string]),
  title: PropTypes.node,
  onClose: PropTypes.func.isRequired,
  /** Called with the full `{ publicId, url, alt }` object. */
  onConfirm: PropTypes.func.isRequired,
  uploadUrl: PropTypes.string,
};

export default ImagePicker;
