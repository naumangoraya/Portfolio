'use client';

import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { usePathname } from 'next/navigation';
import { Nav, Social, Email, Footer } from '@components';

const StyledContent = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
`;

const Layout = ({ children }) => {
  const pathname = usePathname();
  const isHome = pathname === '/';

  // Sets target="_blank" rel="noopener noreferrer" on external links
  const handleExternalLinks = () => {
    Array.from(document.querySelectorAll('a')).forEach(link => {
      if (link.host !== window.location.host) {
        link.setAttribute('rel', 'noopener noreferrer');
        link.setAttribute('target', '_blank');
      }
    });
  };

  useEffect(() => {
    // Clear the hash on initial page load so we start at the top rather than
    // jumping to whatever anchor the browser remembered.
    if (window.location.hash && !sessionStorage.getItem('initialLoad')) {
      window.history.replaceState(null, null, window.location.pathname);
    } else if (window.location.hash) {
      const id = window.location.hash.substring(1);
      setTimeout(() => {
        const el = document.getElementById(id);
        if (el) {
          el.scrollIntoView();
          el.focus();
        }
      }, 0);
    }

    sessionStorage.setItem('initialLoad', 'true');
    handleExternalLinks();
  }, []);

  return (
    <div id="root">
      <a className="skip-to-content" href="#content">
        Skip to Content
      </a>

      <StyledContent>
        <Nav isHome={isHome} />
        <Social isHome={isHome} />
        <Email isHome={isHome} />

        <div id="content">
          {children}
          <Footer />
        </div>
      </StyledContent>
    </div>
  );
};

Layout.propTypes = {
  children: PropTypes.node.isRequired,
};

export default Layout;
