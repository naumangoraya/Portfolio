'use client';

import React, { useCallback, useEffect, useId, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import PropTypes from 'prop-types';
import styled from 'styled-components';

/**
 * The one modal for the admin panel.
 *
 * Visual style is lifted verbatim from `src/components/sections/EditableHero.js`
 * so the CMS modals stay pixel-identical to the inline editors they replace.
 * Behaviour adds what the hand-rolled ones lacked: a portal, a real focus trap,
 * Escape handling, focus restoration, and a refcounted scroll lock.
 */

const SIZES = {
  sm: '420px',
  md: '600px',
  lg: '840px',
  xl: '1080px',
};

const FOCUSABLE = [
  'a[href]',
  'button:not([disabled])',
  'input:not([disabled]):not([type="hidden"])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  '[tabindex]:not([tabindex="-1"])',
].join(', ');

/* --- refcounted body scroll lock ------------------------------------- */
/* Stacked modals must not each stomp on document.body.style, and closing
   an inner modal must not unlock the page while the outer one is open. */

let lockCount = 0;
let previousOverflow = '';
let previousPaddingRight = '';

function lockBodyScroll() {
  if (typeof document === 'undefined') return;
  lockCount += 1;
  if (lockCount > 1) return;

  const { body, documentElement } = document;
  const scrollbarWidth = window.innerWidth - documentElement.clientWidth;

  previousOverflow = body.style.overflow;
  previousPaddingRight = body.style.paddingRight;

  body.style.overflow = 'hidden';
  if (scrollbarWidth > 0) {
    const current = parseFloat(window.getComputedStyle(body).paddingRight) || 0;
    body.style.paddingRight = `${current + scrollbarWidth}px`;
  }
}

function unlockBodyScroll() {
  if (typeof document === 'undefined') return;
  if (lockCount === 0) return;
  lockCount -= 1;
  if (lockCount > 0) return;

  document.body.style.overflow = previousOverflow;
  document.body.style.paddingRight = previousPaddingRight;
  previousOverflow = '';
  previousPaddingRight = '';
}

/* --- styles ----------------------------------------------------------- */

const StyledOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.8);
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;

  .modal-content {
    background: var(--navy);
    border: 1px solid var(--green);
    border-radius: 8px;
    padding: 30px;
    max-width: ${({ $maxWidth }) => $maxWidth};
    width: 100%;
    max-height: 80vh;
    overflow-y: auto;
    outline: none;
  }

  .modal-header {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 20px;
    margin-bottom: 20px;

    h3 {
      color: var(--lightest-slate);
      font-size: var(--fz-xl);
      margin: 0;
    }
  }

  .modal-close {
    background: transparent;
    border: none;
    color: var(--slate);
    cursor: pointer;
    font-family: var(--font-mono);
    font-size: var(--fz-lg);
    line-height: 1;
    padding: 4px 8px;
    border-radius: var(--border-radius);
    transition: all 0.2s ease;

    &:hover,
    &:focus-visible {
      color: var(--green);
      background: var(--light-navy);
    }
  }

  .modal-body {
    color: var(--light-slate);
    font-size: var(--fz-sm);
  }

  .modal-footer {
    display: flex;
    gap: 15px;
    justify-content: flex-end;
    margin-top: 35px;
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

      &.save {
        background: var(--green);
        color: var(--navy);

        &:hover:not(:disabled) {
          background: var(--light-green);
          transform: translateY(-1px);
          box-shadow: 0 4px 8px rgba(100, 255, 218, 0.2);
        }
      }

      &.cancel {
        background: var(--lightest-navy);
        color: var(--lightest-slate);

        &:hover:not(:disabled) {
          background: var(--light-navy);
          transform: translateY(-1px);
        }
      }

      &.danger {
        background: #ff6b6b;
        color: var(--navy);

        &:hover:not(:disabled) {
          filter: brightness(1.1);
          transform: translateY(-1px);
        }
      }

      &:disabled {
        opacity: 0.55;
        cursor: not-allowed;
      }

      &:active:not(:disabled) {
        transform: translateY(0);
      }
    }
  }
`;

/* --- component --------------------------------------------------------- */

const AdminModal = ({
  open,
  title,
  onClose,
  children,
  size = 'md',
  dismissOnBackdrop = true,
  footer = null,
  showCloseButton = true,
  labelledBy,
  className,
}) => {
  const [mounted, setMounted] = useState(false);
  const dialogRef = useRef(null);
  const triggerRef = useRef(null);
  const reactId = useId();
  const titleId = labelledBy || `admin-modal-title-${reactId}`;

  useEffect(() => {
    setMounted(true);
  }, []);

  // Remember the element that opened us so focus can go home on close.
  useEffect(() => {
    if (!open) return undefined;

    triggerRef.current = typeof document !== 'undefined' ? document.activeElement : null;

    return () => {
      const trigger = triggerRef.current;
      triggerRef.current = null;
      if (trigger && typeof trigger.focus === 'function' && document.contains(trigger)) {
        trigger.focus();
      }
    };
  }, [open]);

  // Body scroll lock, refcounted for stacked modals.
  useEffect(() => {
    if (!open) return undefined;
    lockBodyScroll();
    return unlockBodyScroll;
  }, [open]);

  // Move focus to the first focusable element inside the dialog.
  useEffect(() => {
    if (!open) return;
    const node = dialogRef.current;
    if (!node) return;

    const first = node.querySelector(FOCUSABLE);
    if (first) {
      first.focus();
    } else {
      node.focus();
    }
  }, [open]);

  const handleKeyDown = useCallback(
    event => {
      if (event.key === 'Escape') {
        event.stopPropagation();
        onClose?.();
        return;
      }

      if (event.key !== 'Tab') return;

      const node = dialogRef.current;
      if (!node) return;

      const focusables = Array.from(node.querySelectorAll(FOCUSABLE)).filter(
        el => el.offsetParent !== null || el === document.activeElement
      );

      if (focusables.length === 0) {
        event.preventDefault();
        node.focus();
        return;
      }

      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      const active = document.activeElement;

      if (event.shiftKey) {
        if (active === first || active === node || !node.contains(active)) {
          event.preventDefault();
          last.focus();
        }
      } else if (active === last) {
        event.preventDefault();
        first.focus();
      }
    },
    [onClose]
  );

  const handleBackdropMouseDown = useCallback(
    event => {
      if (!dismissOnBackdrop) return;
      if (event.target !== event.currentTarget) return;
      onClose?.();
    },
    [dismissOnBackdrop, onClose]
  );

  if (!mounted || !open) {
    return null;
  }

  return createPortal(
    // The overlay is a click-away surface, not a control; keyboard users get
    // Escape (handled below) so no redundant key handler is needed here.
    <StyledOverlay
      $maxWidth={SIZES[size] || SIZES.md}
      className={className}
      onMouseDown={handleBackdropMouseDown}
      onKeyDown={handleKeyDown}
    >
      <div
        ref={dialogRef}
        className="modal-content"
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        tabIndex={-1}
      >
        <div className="modal-header">
          <h3 id={titleId}>{title}</h3>
          {showCloseButton && (
            <button
              type="button"
              className="modal-close"
              onClick={onClose}
              aria-label="Close dialog"
            >
              &times;
            </button>
          )}
        </div>

        <div className="modal-body">{children}</div>

        {footer ? <div className="modal-footer">{footer}</div> : null}
      </div>
    </StyledOverlay>,
    document.body
  );
};

AdminModal.propTypes = {
  open: PropTypes.bool,
  title: PropTypes.node.isRequired,
  onClose: PropTypes.func.isRequired,
  children: PropTypes.node,
  size: PropTypes.oneOf(['sm', 'md', 'lg', 'xl']),
  dismissOnBackdrop: PropTypes.bool,
  footer: PropTypes.node,
  showCloseButton: PropTypes.bool,
  labelledBy: PropTypes.string,
  className: PropTypes.string,
};

export default AdminModal;
