'use client';

import React from 'react';
import AdminLogin from '../../src/components/AdminLogin';
import { useAuth } from '../../src/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import styled from 'styled-components';

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

const AdminPage = () => {
  const { isAdmin, isLoading } = useAuth();
  const router = useRouter();

  // Redirect to home if already logged in
  useEffect(() => {
    if (!isLoading && isAdmin) {
      router.push('/');
    }
  }, [isAdmin, isLoading, router]);

  const handleLogin = (token) => {
    // After successful login, redirect to home page
    router.push('/');
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
    return null; // Will redirect to home
  }

  return (
    <StyledAdminPage>
      <StyledAdminContainer>
        <StyledTitle>Admin Access</StyledTitle>
        <StyledSubtitle>
          Enter your credentials to access the admin panel and manage your portfolio content.
        </StyledSubtitle>
        <AdminLogin 
          onLogin={handleLogin}
          onClose={() => router.push('/')}
        />
      </StyledAdminContainer>
    </StyledAdminPage>
  );
};

export default AdminPage;
