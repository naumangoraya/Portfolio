'use client';

import React from 'react';
import PropTypes from 'prop-types';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import styled from 'styled-components';

/**
 * Primary navigation for the admin panel.
 *
 * Below 900px the shell drops its two-column grid and this becomes a
 * horizontally scrolling strip pinned above the content, so the panel stays
 * usable on a phone without a hamburger/drawer to maintain.
 */

export const PRIMARY_LINKS = [
  { href: '/admin', label: 'Dashboard', exact: true },
  { href: '/admin/sections', label: 'Sections' },
];

/**
 * Order mirrors the default order of the sections on the public page, so the
 * sidebar reads like the site rather than like the database.
 */
export const CONTENT_LINKS = [
  { href: '/admin/content/hero', label: 'Hero' },
  { href: '/admin/content/about', label: 'About' },
  { href: '/admin/content/education', label: 'Education' },
  { href: '/admin/content/jobs', label: 'Experience' },
  { href: '/admin/content/services', label: 'Services' },
  { href: '/admin/content/projects', label: 'Projects' },
];

const StyledSidebar = styled.nav`
  background: var(--light-navy);
  border-right: 1px solid var(--lightest-navy);
  padding: 24px 16px;
  overflow-y: auto;

  .brand {
    display: block;
    color: var(--green);
    font-family: var(--font-mono);
    font-size: var(--fz-sm);
    font-weight: 600;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    text-decoration: none;
    margin-bottom: 28px;
    padding: 0 10px;
  }

  .group + .group {
    margin-top: 26px;
  }

  .group-label {
    color: var(--slate);
    font-family: var(--font-mono);
    font-size: var(--fz-xxs);
    letter-spacing: 0.1em;
    text-transform: uppercase;
    margin: 0 0 10px;
    padding: 0 10px;
  }

  ul {
    list-style: none;
    margin: 0;
    padding: 0;
    display: flex;
    flex-direction: column;
    gap: 4px;
  }

  a.nav-link {
    display: block;
    padding: 9px 10px;
    border-radius: var(--border-radius);
    border-left: 2px solid transparent;
    color: var(--light-slate);
    font-size: var(--fz-sm);
    text-decoration: none;
    transition: var(--transition);
    white-space: nowrap;

    &:hover,
    &:focus-visible {
      background: var(--navy);
      color: var(--green);
    }

    &[aria-current='page'] {
      background: var(--green-tint);
      border-left-color: var(--green);
      color: var(--green);
      font-weight: 600;
    }
  }

  @media (max-width: 900px) {
    border-right: none;
    border-bottom: 1px solid var(--lightest-navy);
    padding: 14px 16px;
    overflow-x: auto;

    .brand {
      margin-bottom: 12px;
    }

    .group {
      display: flex;
      align-items: center;
      gap: 10px;
    }

    .group + .group {
      margin-top: 10px;
    }

    .group-label {
      margin: 0;
      padding: 0;
      flex: 0 0 auto;
    }

    ul {
      flex-direction: row;
      flex-wrap: nowrap;
      gap: 6px;
    }

    a.nav-link {
      border-left: none;
      border-bottom: 2px solid transparent;

      &[aria-current='page'] {
        border-left-color: transparent;
        border-bottom-color: var(--green);
      }
    }
  }
`;

/** Exact match for /admin, prefix match elsewhere so nested routes stay lit. */
function isActive(pathname, link) {
  if (!pathname) return false;
  if (link.exact) return pathname === link.href;
  return pathname === link.href || pathname.startsWith(`${link.href}/`);
}

const NavLink = ({ link, pathname }) => {
  const active = isActive(pathname, link);
  return (
    <li>
      <Link className="nav-link" href={link.href} aria-current={active ? 'page' : undefined}>
        {link.label}
      </Link>
    </li>
  );
};

NavLink.propTypes = {
  link: PropTypes.shape({
    href: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired,
    exact: PropTypes.bool,
  }).isRequired,
  pathname: PropTypes.string,
};

const AdminSidebar = ({ className }) => {
  const pathname = usePathname();

  return (
    <StyledSidebar className={className} aria-label="Admin navigation">
      <Link className="brand" href="/admin">
        Portfolio CMS
      </Link>

      <div className="group">
        <p className="group-label">Panel</p>
        <ul>
          {PRIMARY_LINKS.map(link => (
            <NavLink key={link.href} link={link} pathname={pathname} />
          ))}
        </ul>
      </div>

      <div className="group">
        <p className="group-label">Content</p>
        <ul>
          {CONTENT_LINKS.map(link => (
            <NavLink key={link.href} link={link} pathname={pathname} />
          ))}
        </ul>
      </div>
    </StyledSidebar>
  );
};

AdminSidebar.propTypes = {
  className: PropTypes.string,
};

export default AdminSidebar;
