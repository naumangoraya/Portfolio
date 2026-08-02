'use client';

import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import AdminModal from './AdminModal';

/**
 * Accessible replacement for the bare `window.confirm()` calls scattered
 * through the admin sections. Thin wrapper over AdminModal so the focus trap,
 * Escape handling and scroll lock come for free.
 */

const StyledMessage = styled.p`
  color: var(--light-slate);
  font-size: var(--fz-sm);
  line-height: 1.6;
  margin: 0;
`;

const ConfirmDialog = ({
  open,
  title = 'Are you sure?',
  message,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  destructive = false,
  onConfirm,
  onCancel,
  busy = false,
}) => (
  <AdminModal
    open={open}
    title={title}
    onClose={busy ? () => {} : onCancel}
    size="sm"
    dismissOnBackdrop={!busy}
    footer={
      <>
        <button type="button" className="cancel" onClick={onCancel} disabled={busy}>
          {cancelLabel}
        </button>
        <button
          type="button"
          className={destructive ? 'danger' : 'save'}
          onClick={onConfirm}
          disabled={busy}
        >
          {busy ? 'Working...' : confirmLabel}
        </button>
      </>
    }
  >
    {typeof message === 'string' ? <StyledMessage>{message}</StyledMessage> : message}
  </AdminModal>
);

ConfirmDialog.propTypes = {
  open: PropTypes.bool,
  title: PropTypes.node,
  message: PropTypes.node,
  confirmLabel: PropTypes.string,
  cancelLabel: PropTypes.string,
  destructive: PropTypes.bool,
  onConfirm: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  busy: PropTypes.bool,
};

export default ConfirmDialog;
