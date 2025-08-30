'use client';

import React, { useState } from 'react';
import styled from 'styled-components';
import { useAuth } from '../contexts/AuthContext';
import AdminLogin from './AdminLogin';

const StyledAdminControls = styled.div`
  position: fixed;
  top: 20px;
  right: 20px;
  z-index: 1000;
  display: flex;
  gap: 10px;
`;

const StyledButton = styled.button`
  background: var(--green);
  color: var(--navy);
  border: none;
  border-radius: 4px;
  padding: 8px 16px;
  font-size: var(--fz-sm);
  font-weight: 600;
  cursor: pointer;
  transition: var(--transition);
  
  &:hover {
    background: var(--light-green);
  }
  
  &.logout {
    background: var(--light-slate);
    
    &:hover {
      background: var(--slate);
    }
  }
  
  &.edit-mode {
    background: ${props => props.active ? 'var(--light-green)' : 'var(--navy)'};
    border: 1px solid var(--green);
    color: ${props => props.active ? 'var(--navy)' : 'var(--green)'};
    
    &:hover {
      background: ${props => props.active ? 'var(--green)' : 'var(--light-navy)'};
    }
  }
`;

const AdminControls = () => {
  const { isAdmin, isLoading, login, logout } = useAuth();
  const [showLogin, setShowLogin] = useState(false);
  const [editMode, setEditMode] = useState(false);

  if (isLoading) {
    return null;
  }

  const handleLogin = (token) => {
    login(token);
    setShowLogin(false);
  };

  const handleLogout = () => {
    logout();
    setEditMode(false);
  };

  return (
    <>
      <StyledAdminControls>
        {isAdmin ? (
          <>
            <StyledButton 
              className={`edit-mode ${editMode ? 'active' : ''}`}
              onClick={() => setEditMode(!editMode)}
            >
              {editMode ? 'Exit Edit Mode' : 'Enter Edit Mode'}
            </StyledButton>
            <StyledButton className="logout" onClick={handleLogout}>
              Logout
            </StyledButton>
          </>
        ) : (
          <StyledButton onClick={() => setShowLogin(true)}>
            Admin Login
          </StyledButton>
        )}
      </StyledAdminControls>

      {showLogin && (
        <AdminLogin 
          onLogin={handleLogin}
          onClose={() => setShowLogin(false)}
        />
      )}
    </>
  );
};

export default AdminControls;
