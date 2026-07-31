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

  /* Below the nav breakpoint this collided with EditableHero's own
     .admin-controls at top: 90px; dock it to the bottom instead. */
  @media (max-width: 768px) {
    top: auto;
    bottom: 16px;
    right: 16px;
    left: 16px;
    justify-content: flex-end;
  }
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

  /* $active is transient: styled-components v6 no longer filters unknown
     props, so a plain \`active\` would also leak onto the DOM node. It was
     previously read here but never passed at all, so the "on" state of the
     edit-mode toggle has never actually rendered. */
  &.edit-mode {
    background: ${props => (props.$active ? 'var(--light-green)' : 'var(--navy)')};
    border: 1px solid var(--green);
    color: ${props => (props.$active ? 'var(--navy)' : 'var(--green)')};

    &:hover {
      background: ${props => (props.$active ? 'var(--green)' : 'var(--light-navy)')};
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
        className="edit-mode"
        $active={editMode}
        aria-pressed={editMode}
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
