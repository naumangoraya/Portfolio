'use client';

import React, { useCallback, useRef } from 'react';
import PropTypes from 'prop-types';
import { CSSTransition } from 'react-transition-group';

/**
 * CSSTransition with `nodeRef` wired up.
 *
 * react-transition-group v4 falls back to `ReactDOM.findDOMNode` whenever
 * `nodeRef` is absent, and React 19 removed findDOMNode — so every call site
 * without it is a hard runtime error after the upgrade. This wrapper owns the
 * ref and forwards it to the single child.
 *
 * The child must accept a ref: a DOM element, a styled-component, or a
 * forwardRef component. Any ref the child already had is preserved, not
 * overwritten (src/components/sections/projects.js relies on this).
 */
export default function FadeIn({ children, ...props }) {
  const nodeRef = useRef(null);
  const child = React.Children.only(children);

  // React 19 exposes `ref` as a normal prop; React 18 keeps it on the element.
  const childRef = child.props?.ref ?? child.ref;

  // Held in a ref so `setRef` keeps a stable identity even when the child
  // passes a fresh inline arrow every render.
  const childRefHolder = useRef(childRef);
  childRefHolder.current = childRef;

  const setRef = useCallback(node => {
    nodeRef.current = node;

    const forwarded = childRefHolder.current;
    if (typeof forwarded === 'function') {
      forwarded(node);
    } else if (forwarded && typeof forwarded === 'object') {
      forwarded.current = node;
    }
  }, []);

  return (
    <CSSTransition nodeRef={nodeRef} {...props}>
      {React.cloneElement(child, { ref: setRef })}
    </CSSTransition>
  );
}

FadeIn.propTypes = {
  children: PropTypes.element.isRequired,
};
