import React from 'react';
import PropTypes from 'prop-types';
import AdminShell from '../../src/components/admin/AdminShell';

/**
 * Segment layout for the whole admin panel.
 *
 * `robots: noindex` matters more than it looks: /admin used to be a plain page
 * inheriting the site-wide `index, follow`. `force-dynamic` keeps every admin
 * route out of the static/ISR path so a build never bakes in one session's view.
 */
export const metadata = {
  title: 'Admin',
  robots: { index: false, follow: false },
};

export const dynamic = 'force-dynamic';

export default function AdminLayout({ children }) {
  return <AdminShell>{children}</AdminShell>;
}

AdminLayout.propTypes = {
  children: PropTypes.node,
};
