'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import styled from 'styled-components';
import toast from 'react-hot-toast';

const HeaderContainer = styled.header`
  background: white;
  padding: 20px;
  border-bottom: 1px solid #e1e5e9;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const HeaderTitle = styled.h1`
  margin: 0;
  font-size: 24px;
  color: #2c3e50;
  font-weight: 600;
`;

const UserSection = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;
`;

const UserInfo = styled.div`
  text-align: right;
`;

const UserName = styled.div`
  font-weight: 600;
  color: #2c3e50;
  font-size: 16px;
`;

const UserRole = styled.div`
  color: #7f8c8d;
  font-size: 14px;
`;

const LogoutButton = styled.button`
  padding: 10px 20px;
  background: #e74c3c;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  transition: background-color 0.3s ease;

  &:hover {
    background: #c0392b;
  }
`;

const AdminHeader = ({ user }) => {
  const router = useRouter();

  const handleLogout = () => {
    // Clear local storage
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminUser');
    
    toast.success('Logged out successfully');
    router.push('/admin/login');
  };

  return (
    <HeaderContainer>
      <HeaderTitle>Portfolio Administration</HeaderTitle>
      
      <UserSection>
        <UserInfo>
          <UserName>{user?.name || 'Admin User'}</UserName>
          <UserRole>{user?.role || 'ADMIN'}</UserRole>
        </UserInfo>
        
        <LogoutButton onClick={handleLogout}>
          Logout
        </LogoutButton>
      </UserSection>
    </HeaderContainer>
  );
};

export default AdminHeader;
