'use client';

import React, { useCallback, useState } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import Field from './Field';
import ImagePicker, { normalizeImageValue } from '../ImagePicker';

/**
 * SchemaForm adapter for `type: 'image'` descriptors.
 *
 * Same props as every other field component:
 *   `{ field, value, error, onChange(name, value), disabled }`
 *
 * The value is the full `ImageRef` from `lib/schemas/_shared.js` -
 * `{ publicId, url, alt }` - and that whole object is what gets emitted, so
 * the alt text travels with the asset instead of living in a sibling field.
 * `undefined`, `{}` and a bare url string are all tolerated on the way in.
 *
 * `ImagePicker` is mounted only while open so each visit starts from a clean
 * draft; nothing is written to the form until the dialog is confirmed.
 */

const StyledImage = styled.div`
  .image-row {
    display: flex;
    align-items: center;
    gap: 16px;
  }

  .image-thumb {
    width: 88px;
    height: 88px;
    flex: 0 0 88px;
    border-radius: var(--border-radius);
    border: 1px solid var(--lightest-navy);
    background: var(--navy);
    object-fit: cover;
    display: block;
  }

  .image-thumb-empty {
    width: 88px;
    height: 88px;
    flex: 0 0 88px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: var(--border-radius);
    border: 1px dashed var(--lightest-navy);
    background: var(--light-navy);
    color: var(--dark-slate);
    font-family: var(--font-mono);
    font-size: var(--fz-xxs);
  }

  .image-side {
    min-width: 0;
    display: flex;
    flex-direction: column;
    gap: 10px;
  }

  .image-alt {
    color: var(--slate);
    font-family: var(--font-mono);
    font-size: var(--fz-xxs);
    line-height: 1.5;
    overflow-wrap: anywhere;
  }

  .image-alt em {
    color: var(--pink);
    font-style: normal;
  }

  .image-actions {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
  }

  .image-actions button {
    background: transparent;
    border: 1px solid var(--green);
    border-radius: var(--border-radius);
    color: var(--green);
    cursor: pointer;
    font-family: var(--font-mono);
    font-size: var(--fz-xxs);
    padding: 8px 14px;
    transition: all 0.2s ease;

    &:hover:not(:disabled),
    &:focus-visible:not(:disabled) {
      background: var(--green-tint);
    }

    &:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }
  }

  .image-actions button.remove {
    border-color: var(--lightest-navy);
    color: var(--light-slate);

    &:hover:not(:disabled),
    &:focus-visible:not(:disabled) {
      border-color: var(--pink);
      color: var(--pink);
      background: transparent;
    }
  }
`;

const ImageField = ({ field, value, error, onChange, disabled = false }) => {
  const [pickerOpen, setPickerOpen] = useState(false);
  const image = normalizeImageValue(value);
  const hasImage = Boolean(image.url);

  const handleConfirm = useCallback(
    next => {
      setPickerOpen(false);
      onChange(field.name, next);
    },
    [field.name, onChange]
  );

  const handleRemove = useCallback(() => {
    onChange(field.name, { publicId: '', url: '', alt: '' });
  }, [field.name, onChange]);

  return (
    <Field
      name={field.name}
      label={field.label}
      hint={field.hint}
      error={error}
      required={field.required}
      colSpan={field.colSpan}
    >
      {({ id, describedBy }) => (
        <StyledImage>
          <div className="image-row">
            {hasImage ? (
              // The repo does not use next/image anywhere; a plain <img> keeps
              // the admin free of the loader/domain config the CMS would need.
              // eslint-disable-next-line @next/next/no-img-element
              <img
                className="image-thumb"
                src={image.url}
                alt={image.alt || `${field.label || field.name} preview`}
              />
            ) : (
              <div className="image-thumb-empty" aria-hidden="true">
                empty
              </div>
            )}

            <div className="image-side">
              <div className="image-alt">
                {hasImage ? (
                  image.alt ? (
                    `alt: ${image.alt}`
                  ) : (
                    <em>No alt text — add one for accessibility.</em>
                  )
                ) : (
                  'No image set.'
                )}
              </div>

              <div className="image-actions">
                <button
                  type="button"
                  id={id}
                  disabled={disabled}
                  aria-describedby={describedBy}
                  onClick={() => setPickerOpen(true)}
                >
                  {hasImage ? 'Change image' : 'Choose image'}
                </button>

                {hasImage ? (
                  <button
                    type="button"
                    className="remove"
                    disabled={disabled}
                    onClick={handleRemove}
                  >
                    Remove
                  </button>
                ) : null}
              </div>
            </div>
          </div>

          {pickerOpen ? (
            <ImagePicker
              open
              value={image}
              title={field.label ? `${field.label}` : 'Choose image'}
              onClose={() => setPickerOpen(false)}
              onConfirm={handleConfirm}
            />
          ) : null}
        </StyledImage>
      )}
    </Field>
  );
};

ImageField.propTypes = {
  field: PropTypes.shape({
    name: PropTypes.string.isRequired,
    label: PropTypes.node,
    hint: PropTypes.node,
    required: PropTypes.bool,
    colSpan: PropTypes.oneOf([1, 2]),
  }).isRequired,
  /** `{ publicId, url, alt }`; also tolerates undefined, {} and a url string. */
  value: PropTypes.any,
  error: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  disabled: PropTypes.bool,
};

export default ImageField;
