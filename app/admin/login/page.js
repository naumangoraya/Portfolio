'use client';

import React from 'react';
import AdminLogin from '../../../src/components/AdminLogin';
import { useAuth } from '../../../src/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import styled from 'styled-components';

/**
 * The login screen, moved here verbatim from `app/admin/page.js` when /admin
 * became the dashboard. Only the two destinations changed: a successful login
 * now lands in the panel rather than on the public home page.
 *
 * AdminShell deliberately renders this route without the sidebar/topbar chrome
 * and without its auth gate, so this stays a standalone full-viewport screen.
 */

const StyledAdminPage = styled.div`
  min-height: 100vh;
  background: var(--navy);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
`;

const StyledAdminContainer = styled.div`
  background: var(--light-navy);
  border: 1px solid var(--green);
  border-radius: 8px;
  padding: 40px;
  max-width: 400px;
  width: 100%;
  text-align: center;
`;

const StyledTitle = styled.h1`
  color: var(--lightest-slate);
  margin-bottom: 30px;
  font-size: var(--fz-xxl);
  font-weight: 600;
`;

const StyledSubtitle = styled.p`
  color: var(--light-slate);
  margin-bottom: 30px;
  font-size: var(--fz-md);
  line-height: 1.6;
`;

const AdminLoginPage = () => {
  const { isAdmin, isLoading, login } = useAuth();
  const router = useRouter();

  // Redirect into the panel if already logged in
  useEffect(() => {
    if (!isLoading && isAdmin) {
      router.replace('/admin');
    }
  }, [isAdmin, isLoading, router]);

  const handleLogin = token => {
    // Persist the token AND flip isAdmin before navigating; router.push() is a
    // client-side nav that does not remount AuthProvider, so without this the
    // admin UI stayed hidden until a manual reload.
    login(token);
    router.replace('/admin');
  };

  if (isLoading) {
    return (
      <StyledAdminPage>
        <StyledAdminContainer>
          <StyledTitle>Loading...</StyledTitle>
        </StyledAdminContainer>
      </StyledAdminPage>
    );
  }

  if (isAdmin) {
    return null; // Will redirect to the dashboard
  }

  return (
    <StyledAdminPage>
      <StyledAdminContainer>
        <StyledTitle>Admin Access</StyledTitle>
        <StyledSubtitle>
          Enter your credentials to access the admin panel and manage your portfolio content.
        </StyledSubtitle>
        <AdminLogin onLogin={handleLogin} onClose={() => router.push('/')} />
      </StyledAdminContainer>
    </StyledAdminPage>
  );
};

export default AdminLoginPage;
