import React from 'react';

export default function Loading() {
  return (
    <div
      aria-busy="true"
      aria-label="Loading"
      style={{ minHeight: '100vh', background: 'var(--navy)' }}
    />
  );
}
