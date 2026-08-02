'use client';

import React, { useCallback, useEffect, useMemo } from 'react';
import PropTypes from 'prop-types';
import { usePathname, useRouter } from 'next/navigation';
import styled from 'styled-components';
import toast from 'react-hot-toast';
import { useAuth } from '../../contexts/AuthContext';
import { setUnauthorizedHandler } from '../../lib/authFetch';
import AdminSidebar, { CONTENT_LINKS } from './AdminSidebar';
import AdminTopbar from './AdminTopbar';

/**
 * Chrome + auth gate for everything under /admin.
 *
 * The gate lives here rather than in each page so a new admin route is
 * protected by existing at all. `/admin/login` is the one route that renders
 * bare: it is inside this layout (so the panel keeps one entry point) but must
 * not redirect to itself, and it supplies its own full-screen presentation.
 */

const LOGIN_ROUTE = '/admin/login';

const StyledShell = styled.div`
  min-height: 100vh;
  background: var(--navy);
  display: grid;
  grid-template-columns: 240px minmax(0, 1fr);
  align-items: stretch;

  > .admin-sidebar {
    position: sticky;
    top: 0;
    height: 100vh;
  }

  .admin-body {
    display: flex;
    flex-direction: column;
    min-width: 0;
  }

  main {
    flex: 1 1 auto;
    padding: 28px;
    min-width: 0;
  }

  @media (max-width: 900px) {
    grid-template-columns: minmax(0, 1fr);

    > .admin-sidebar {
      position: static;
      height: auto;
    }

    main {
      padding: 20px 18px 40px;
    }
  }
`;

const StyledPlaceholder = styled.div`
  min-height: 100vh;
  background: var(--navy);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;

  p {
    margin: 0;
    color: var(--slate);
    font-family: var(--font-mono);
    font-size: var(--fz-sm);
  }
`;

const titleCase = value =>
  String(value || '')
    .replace(/[-_]+/g, ' ')
    .replace(/\b\w/g, character => character.toUpperCase());

/** Route -> page title + breadcrumb trail. Kept pure so it is trivially testable. */
export function deriveNav(pathname) {
  const segments = String(pathname || '/admin')
    .split('/')
    .filter(Boolean);

  if (segments.length <= 1) {
    return { title: 'Dashboard', crumbs: [{ label: 'Dashboard' }] };
  }

  const root = { label: 'Dashboard', href: '/admin' };

  if (segments[1] === 'sections') {
    return { title: 'Sections', crumbs: [root, { label: 'Sections' }] };
  }

  if (segments[1] === 'content') {
    const slug = segments[2];
    const match = CONTENT_LINKS.find(link => link.href === `/admin/content/${slug}`);
    const label = match ? match.label : titleCase(slug);
    return { title: label, crumbs: [root, { label: 'Content' }, { label }] };
  }

  const label = titleCase(segments[segments.length - 1]);
  return { title: label, crumbs: [root, { label }] };
}

const AdminShell = ({ children }) => {
  const pathname = usePathname();
  const router = useRouter();
  const { isAdmin, isLoading, logout } = useAuth();

  const isLoginRoute = pathname === LOGIN_ROUTE || pathname?.startsWith(`${LOGIN_ROUTE}/`);

  const handleLogout = useCallback(() => {
    logout();
    router.replace(LOGIN_ROUTE);
  }, [logout, router]);

  // A 401 from anywhere in the panel drops the token and returns to login,
  // instead of leaving a signed-out page silently rendering stale data.
  useEffect(() => {
    setUnauthorizedHandler(({ message } = {}) => {
      toast.error(message || 'Session expired - please sign in again');
      logout();
      router.replace(LOGIN_ROUTE);
    });

    return () => setUnauthorizedHandler(null);
  }, [logout, router]);

  useEffect(() => {
    if (isLoginRoute || isLoading || isAdmin) return;
    router.replace(LOGIN_ROUTE);
  }, [isAdmin, isLoading, isLoginRoute, router]);

  const { title, crumbs } = useMemo(() => deriveNav(pathname), [pathname]);

  // The login screen owns the whole viewport; no sidebar, no gate.
  if (isLoginRoute) {
    return children;
  }

  if (isLoading) {
    return (
      <StyledPlaceholder>
        <p aria-live="polite">Checking your session...</p>
      </StyledPlaceholder>
    );
  }

  if (!isAdmin) {
    return (
      <StyledPlaceholder>
        <p aria-live="polite">Redirecting to sign in...</p>
      </StyledPlaceholder>
    );
  }

  return (
    <StyledShell>
      <AdminSidebar className="admin-sidebar" />

      <div className="admin-body">
        <AdminTopbar title={title} crumbs={crumbs} onLogout={handleLogout} />
        <main>{children}</main>
      </div>
    </StyledShell>
  );
};

AdminShell.propTypes = {
  children: PropTypes.node,
};

export default AdminShell;
