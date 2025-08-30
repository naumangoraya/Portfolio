'use client';

import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { usePathname } from 'next/navigation';
import { Head, Loader, Nav, Social, Email, Footer } from '@components';
import { useAuth } from '../contexts/AuthContext';

const StyledContent = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
`;



const Layout = ({ children }) => {
  const pathname = usePathname();
  const isHome = pathname === '/';
  const [isLoading, setIsLoading] = useState(isHome);
  const { isAdmin } = useAuth();

  // Sets target="_blank" rel="noopener noreferrer" on external links
  const handleExternalLinks = () => {
    const allLinks = Array.from(document.querySelectorAll('a'));
    if (allLinks.length > 0) {
      allLinks.forEach(link => {
        if (link.host !== window.location.host) {
          link.setAttribute('rel', 'noopener noreferrer');
          link.setAttribute('target', '_blank');
        }
      });
    }
  };

  useEffect(() => {
    if (isLoading) {
      return;
    }

    // Clear hash on initial page load to start at the top
    if (typeof window !== 'undefined' && window.location.hash && !sessionStorage.getItem('initialLoad')) {
      // Remove the hash from URL without triggering scroll
      const url = window.location.pathname;
      window.history.replaceState(null, null, url);
    }

    // Handle hash navigation - only scroll if it's not the initial page load
    if (typeof window !== 'undefined' && window.location.hash && !sessionStorage.getItem('initialLoad')) {
      const id = window.location.hash.substring(1);
      setTimeout(() => {
        const el = document.getElementById(id);
        if (el) {
          el.scrollIntoView();
          el.focus();
        }
      }, 0);
    }

    // Mark that initial load is complete
    sessionStorage.setItem('initialLoad', 'true');

    handleExternalLinks();
  }, [isLoading]);

  return (
    <>
      <Head />

      <div id="root">
        <a className="skip-to-content" href="#content">
          Skip to Content
        </a>



        {isLoading && isHome ? (
          <Loader finishLoading={() => setIsLoading(false)} />
        ) : (
          <StyledContent>
            <Nav isHome={isHome} />
            <Social isHome={isHome} />
            <Email isHome={isHome} />

            <div id="content">
              {children}
              <Footer />
            </div>
          </StyledContent>
        )}
      </div>
    </>
  );
};

Layout.propTypes = {
  children: PropTypes.node.isRequired,
};

export default Layout;
