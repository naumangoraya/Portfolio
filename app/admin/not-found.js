import React from 'react';
import Link from 'next/link';

/**
 * Admin-scoped not-found, so an unknown /admin/* route renders inside the panel
 * shell instead of falling through to the public 404 page.
 *
 * Note: the HTTP status may still be 200 here. The admin layout is
 * force-dynamic and its shell is a Client Component, so the response has often
 * begun streaming by the time a nested segment calls notFound() and the status
 * line can no longer be changed. The panel is noindex and auth-gated, so this
 * is cosmetic.
 */
export default function AdminNotFound() {
  return (
    <div style={{ padding: '40px 0', maxWidth: 560 }}>
      <h1 style={{ color: 'var(--green)', fontSize: 'var(--fz-heading)', margin: '0 0 12px' }}>
        Not found
      </h1>
      <p style={{ color: 'var(--slate)', margin: '0 0 24px' }}>
        That admin page does not exist. It may have been renamed, or the content type in the URL is
        not one this panel manages.
      </p>
      <Link href="/admin" style={{ color: 'var(--green)' }}>
        Back to the dashboard
      </Link>
    </div>
  );
}
