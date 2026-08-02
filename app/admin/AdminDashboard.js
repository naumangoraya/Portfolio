'use client';

import React, { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import styled from 'styled-components';
import { authFetch } from '../../src/lib/authFetch';

/**
 * Landing view for the panel: one card per content type with a live count (or
 * a configured/not-configured state for the singletons), plus the shortcuts
 * that would otherwise be a hunt through the sidebar.
 *
 * Every card is fetched independently and `silent`, so one endpoint being down
 * (or, during the CMS migration, not existing yet) degrades that single card
 * instead of toasting six errors and blanking the page.
 */

const SOURCES = [
  {
    key: 'sections',
    label: 'Sections',
    endpoint: '/api/sections',
    href: '/admin/sections',
    singleton: false,
    hint: 'Page layout and order',
  },
  {
    key: 'hero',
    label: 'Hero',
    endpoint: '/api/hero',
    href: '/admin/content/hero',
    singleton: true,
    hint: 'Landing headline',
  },
  {
    key: 'about',
    label: 'About',
    endpoint: '/api/about',
    href: '/admin/content/about',
    singleton: true,
    hint: 'Bio and skills',
  },
  {
    key: 'education',
    label: 'Education',
    endpoint: '/api/education',
    href: '/admin/content/education',
    singleton: false,
    hint: 'Degrees and courses',
  },
  {
    key: 'jobs',
    label: 'Experience',
    endpoint: '/api/jobs',
    href: '/admin/content/jobs',
    singleton: false,
    hint: 'Roles and companies',
  },
  {
    key: 'services',
    label: 'Services',
    endpoint: '/api/services',
    href: '/admin/content/services',
    singleton: false,
    hint: 'What you offer',
  },
  {
    key: 'projects',
    label: 'Projects',
    endpoint: '/api/projects',
    href: '/admin/content/projects',
    singleton: false,
    hint: 'Featured and archive work',
  },
  {
    key: 'contact',
    label: 'Contact',
    endpoint: '/api/contact',
    href: '/admin/content/contact',
    singleton: true,
    hint: 'Email and socials',
  },
];

const QUICK_LINKS = [
  { href: '/admin/sections', label: 'Reorder sections' },
  { href: '/admin/content/projects', label: 'Add a project' },
  { href: '/admin/content/jobs', label: 'Add a role' },
  { href: '/', label: 'View the live site' },
];

const StyledDashboard = styled.div`
  .dash-intro {
    margin: 0 0 24px;
    color: var(--light-slate);
    font-size: var(--fz-sm);
    line-height: 1.6;
    max-width: 70ch;
  }

  .dash-section-head {
    display: flex;
    align-items: baseline;
    justify-content: space-between;
    gap: 16px;
    margin: 0 0 14px;

    h2 {
      margin: 0;
      color: var(--lightest-slate);
      font-size: var(--fz-lg);
    }

    button {
      background: transparent;
      border: none;
      color: var(--green);
      cursor: pointer;
      font-family: var(--font-mono);
      font-size: var(--fz-xs);
      padding: 4px 6px;
      border-radius: var(--border-radius);

      &:hover:not(:disabled),
      &:focus-visible {
        background: var(--green-tint);
      }

      &:disabled {
        color: var(--slate);
        cursor: not-allowed;
      }
    }
  }

  .card-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
    gap: 16px;
    list-style: none;
    margin: 0 0 36px;
    padding: 0;
  }

  .card {
    display: block;
    height: 100%;
    padding: 20px;
    background: var(--light-navy);
    border: 1px solid var(--lightest-navy);
    border-radius: var(--border-radius);
    text-decoration: none;
    transition: var(--transition);

    &:hover,
    &:focus-visible {
      border-color: var(--green);
      transform: translateY(-2px);
    }

    .card-label {
      display: block;
      color: var(--green);
      font-family: var(--font-mono);
      font-size: var(--fz-xxs);
      letter-spacing: 0.08em;
      text-transform: uppercase;
      margin-bottom: 10px;
    }

    .card-value {
      display: block;
      color: var(--lightest-slate);
      font-size: var(--fz-heading);
      font-weight: 600;
      line-height: 1.1;
    }

    .card-value.is-text {
      font-size: var(--fz-lg);
    }

    .card-value.is-error {
      color: var(--pink);
      font-family: var(--font-mono);
      font-size: var(--fz-sm);
    }

    .card-hint {
      display: block;
      margin-top: 8px;
      color: var(--slate);
      font-size: var(--fz-xxs);
    }
  }

  .card-skeleton {
    padding: 20px;
    background: var(--light-navy);
    border: 1px solid var(--lightest-navy);
    border-radius: var(--border-radius);

    .bar {
      background: var(--lightest-navy);
      border-radius: var(--border-radius);
      animation: dash-pulse 1.4s ease-in-out infinite;
    }

    .bar.label {
      width: 55%;
      height: 10px;
      margin-bottom: 14px;
    }

    .bar.value {
      width: 35%;
      height: 26px;
    }
  }

  @keyframes dash-pulse {
    0%,
    100% {
      opacity: 1;
    }
    50% {
      opacity: 0.45;
    }
  }

  .dash-error {
    margin: 0 0 28px;
    padding: 20px;
    background: var(--light-navy);
    border: 1px solid var(--pink);
    border-radius: var(--border-radius);

    h2 {
      margin: 0 0 8px;
      color: var(--lightest-slate);
      font-size: var(--fz-md);
    }

    p {
      margin: 0 0 16px;
      color: var(--light-slate);
      font-size: var(--fz-sm);
      line-height: 1.6;
    }

    button {
      padding: 10px 20px;
      border: none;
      border-radius: var(--border-radius);
      background: var(--green);
      color: var(--navy);
      font-size: var(--fz-sm);
      font-weight: 600;
      cursor: pointer;

      &:hover:not(:disabled) {
        background: var(--light-green);
      }
    }
  }

  .quick-links {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
    list-style: none;
    margin: 0;
    padding: 0;

    a {
      display: inline-flex;
      padding: 9px 16px;
      border: 1px solid var(--lightest-navy);
      border-radius: var(--border-radius);
      color: var(--light-slate);
      font-family: var(--font-mono);
      font-size: var(--fz-xs);
      text-decoration: none;
      transition: var(--transition);

      &:hover,
      &:focus-visible {
        border-color: var(--green);
        color: var(--green);
      }
    }
  }
`;

/** Both envelopes in the wild: a bare array, or `{ items: [] }` / `{ data: [] }`. */
function countOf(payload) {
  if (Array.isArray(payload)) return payload.length;
  if (Array.isArray(payload?.items)) return payload.items.length;
  if (Array.isArray(payload?.data)) return payload.data.length;
  return 0;
}

function isConfigured(payload) {
  if (!payload || typeof payload !== 'object') return false;
  if (Array.isArray(payload)) return payload.length > 0;
  return Object.keys(payload).length > 0;
}

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [status, setStatus] = useState('loading');

  // No `setStatus('loading')` here: 'loading' is the initial state, and the
  // retry button sets it before calling. Keeping the synchronous setState out
  // of the mount effect avoids a cascading render on first paint.
  const load = useCallback(async () => {
    const results = await Promise.all(
      SOURCES.map(async source => {
        try {
          const payload = await authFetch(source.endpoint, { silent: true });
          return [
            source.key,
            source.singleton
              ? { ok: true, text: isConfigured(payload) ? 'Configured' : 'Not set' }
              : { ok: true, count: countOf(payload) },
          ];
        } catch (error) {
          return [
            source.key,
            { ok: false, message: error?.status === 404 ? 'No route' : 'Failed' },
          ];
        }
      })
    );

    setStats(Object.fromEntries(results));
    setStatus(results.every(([, value]) => !value.ok) ? 'error' : 'ready');
  }, []);

  const reload = useCallback(() => {
    setStatus('loading');
    load();
  }, [load]);

  useEffect(() => {
    load();
  }, [load]);

  const busy = status === 'loading';

  return (
    <StyledDashboard>
      <p className="dash-intro">
        Everything the public page renders is managed from here. <strong>Sections</strong> owns the
        order and visibility of the page; the <strong>Content</strong> screens own what goes inside
        each one.
      </p>

      {status === 'error' ? (
        <div className="dash-error" role="alert">
          <h2>Could not load your content</h2>
          <p>
            Every content endpoint failed to respond. The database may be unreachable, or your
            session may have expired.
          </p>
          <button type="button" onClick={reload}>
            Try again
          </button>
        </div>
      ) : null}

      <div className="dash-section-head">
        <h2>Content</h2>
        <button type="button" onClick={reload} disabled={busy}>
          {busy ? 'Refreshing...' : 'Refresh'}
        </button>
      </div>

      <ul className="card-grid">
        {SOURCES.map(source => {
          const stat = stats?.[source.key];

          if (busy || !stat) {
            return (
              <li key={source.key}>
                <div className="card-skeleton" role="status" aria-label={`Loading ${source.label}`}>
                  <div className="bar label" />
                  <div className="bar value" />
                </div>
              </li>
            );
          }

          return (
            <li key={source.key}>
              <Link className="card" href={source.href}>
                <span className="card-label">{source.label}</span>

                {!stat.ok ? (
                  <span className="card-value is-error">{stat.message}</span>
                ) : (
                  <span className={`card-value${source.singleton ? ' is-text' : ''}`}>
                    {source.singleton ? stat.text : stat.count}
                  </span>
                )}

                <span className="card-hint">{source.hint}</span>
              </Link>
            </li>
          );
        })}
      </ul>

      <div className="dash-section-head">
        <h2>Shortcuts</h2>
      </div>

      <ul className="quick-links">
        {QUICK_LINKS.map(link => (
          <li key={link.href + link.label}>
            <Link href={link.href}>{link.label}</Link>
          </li>
        ))}
      </ul>
    </StyledDashboard>
  );
};

export default AdminDashboard;
