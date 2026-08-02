'use client';

import React from 'react';
import PropTypes from 'prop-types';
import Link from 'next/link';
import styled from 'styled-components';

/**
 * The bar above the routed content: where you are, a way back to the public
 * site, and the way out. Kept presentational — the shell owns the crumb
 * derivation and the logout side effects.
 */

const StyledTopbar = styled.header`
  position: sticky;
  top: 0;
  z-index: 20;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
  flex-wrap: wrap;
  padding: 16px 28px;
  background: var(--navy);
  border-bottom: 1px solid var(--lightest-navy);

  .crumbs {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    gap: 8px;
    list-style: none;
    margin: 0 0 2px;
    padding: 0;
    color: var(--slate);
    font-family: var(--font-mono);
    font-size: var(--fz-xxs);

    li {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    li + li::before {
      content: '/';
      color: var(--lightest-navy);
    }

    a {
      color: var(--slate);
      text-decoration: none;

      &:hover,
      &:focus-visible {
        color: var(--green);
      }
    }

    [aria-current='page'] {
      color: var(--green);
    }
  }

  h1 {
    margin: 0;
    color: var(--lightest-slate);
    font-size: var(--fz-xxl);
    font-weight: 600;
    line-height: 1.2;
  }

  .topbar-actions {
    display: flex;
    align-items: center;
    gap: 10px;
  }

  .topbar-action {
    display: inline-flex;
    align-items: center;
    padding: 8px 16px;
    border-radius: var(--border-radius);
    border: 1px solid var(--green);
    background: transparent;
    color: var(--green);
    font-family: var(--font-mono);
    font-size: var(--fz-xs);
    font-weight: 600;
    text-decoration: none;
    cursor: pointer;
    transition: var(--transition);

    &:hover,
    &:focus-visible {
      background: var(--green-tint);
    }

    &.logout {
      border-color: var(--lightest-navy);
      color: var(--light-slate);

      &:hover,
      &:focus-visible {
        background: var(--light-navy);
        color: var(--lightest-slate);
      }
    }
  }

  @media (max-width: 600px) {
    padding: 14px 18px;

    h1 {
      font-size: var(--fz-xl);
    }
  }
`;

const AdminTopbar = ({ title, crumbs = [], onLogout }) => (
  <StyledTopbar>
    <div>
      {crumbs.length > 0 ? (
        <ol className="crumbs" aria-label="Breadcrumb">
          {crumbs.map((crumb, index) => {
            const last = index === crumbs.length - 1;
            return (
              <li key={crumb.href || crumb.label}>
                {crumb.href && !last ? (
                  <Link href={crumb.href}>{crumb.label}</Link>
                ) : (
                  <span aria-current={last ? 'page' : undefined}>{crumb.label}</span>
                )}
              </li>
            );
          })}
        </ol>
      ) : null}
      <h1>{title}</h1>
    </div>

    <div className="topbar-actions">
      <Link className="topbar-action" href="/">
        View site
      </Link>
      <button type="button" className="topbar-action logout" onClick={onLogout}>
        Logout
      </button>
    </div>
  </StyledTopbar>
);

AdminTopbar.propTypes = {
  title: PropTypes.node.isRequired,
  crumbs: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      href: PropTypes.string,
    })
  ),
  onLogout: PropTypes.func.isRequired,
};

export default AdminTopbar;
