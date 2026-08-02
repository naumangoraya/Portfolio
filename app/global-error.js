'use client';

import React, { useEffect } from 'react';
import PropTypes from 'prop-types';

// Replaces the whole document when the root layout itself throws, so it cannot
// rely on ThemeProvider, GlobalStyle or any styled-component.
export default function GlobalError({ error, reset }) {
  useEffect(() => {
    console.error('Root layout error:', error);
  }, [error]);

  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '16px',
          background: '#0a192f',
          color: '#ccd6f6',
          fontFamily: 'system-ui, -apple-system, sans-serif',
          textAlign: 'center',
          padding: '0 20px',
        }}
      >
        <h1 style={{ color: '#64ffda', margin: 0 }}>Something went wrong</h1>
        <p style={{ color: '#8892b0', maxWidth: 500 }}>
          The site failed to start. Please try again in a moment.
        </p>
        <button
          type="button"
          onClick={reset}
          style={{
            background: 'transparent',
            border: '1px solid #64ffda',
            borderRadius: 4,
            color: '#64ffda',
            cursor: 'pointer',
            fontSize: 14,
            padding: '12px 24px',
          }}
        >
          Try again
        </button>
      </body>
    </html>
  );
}

GlobalError.propTypes = {
  error: PropTypes.object,
  reset: PropTypes.func.isRequired,
};
