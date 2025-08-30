'use client';

import React from 'react';
import styled from 'styled-components';
import { useAuth } from '../contexts/AuthContext';

const StyledAdminControls = styled.div`
  position: fixed;
  top: 100px;
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
  const { isAdmin, isLoading, editMode, logout, toggleEditMode } = useAuth();

  if (isLoading || !isAdmin) {
    return null;
  }

  return (
    <StyledAdminControls>
      <StyledButton 
        className={`edit-mode ${editMode ? 'active' : ''}`}
        onClick={toggleEditMode}
      >
        {editMode ? 'Exit Edit Mode' : 'Enter Edit Mode'}
      </StyledButton>
      <StyledButton className="logout" onClick={logout}>
        Logout
      </StyledButton>
    </StyledAdminControls>
  );
};

export default AdminControls;
