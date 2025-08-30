'use client';

import React from 'react';
import styled from 'styled-components';

const SidebarContainer = styled.div`
  width: 250px;
  background: #2c3e50;
  color: white;
  padding: 20px 0;
  box-shadow: 2px 0 10px rgba(0, 0, 0, 0.1);
`;

const SidebarHeader = styled.div`
  padding: 0 20px 20px;
  border-bottom: 1px solid #34495e;
  margin-bottom: 20px;
`;

const SidebarTitle = styled.h2`
  margin: 0;
  font-size: 20px;
  font-weight: 600;
  color: #ecf0f1;
`;

const SidebarSubtitle = styled.p`
  margin: 5px 0 0;
  font-size: 14px;
  color: #bdc3c7;
`;

const NavMenu = styled.nav`
  padding: 0 20px;
`;

const NavItem = styled.div`
  margin-bottom: 5px;
`;

const NavLink = styled.button`
  width: 100%;
  padding: 12px 16px;
  background: ${props => props.active ? '#3498db' : 'transparent'};
  color: ${props => props.active ? 'white' : '#ecf0f1'};
  border: none;
  border-radius: 8px;
  text-align: left;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 14px;
  display: flex;
  align-items: center;
  gap: 12px;

  &:hover {
    background: ${props => props.active ? '#3498db' : '#34495e'};
    color: white;
  }
`;

const NavIcon = styled.span`
  font-size: 18px;
  width: 20px;
  text-align: center;
`;

const AdminSidebar = ({ currentSection, onSectionChange }) => {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: '📊' },
    { id: 'hero', label: 'Hero Section', icon: '🎯' },
    { id: 'about', label: 'About Section', icon: '👤' },
    { id: 'projects', label: 'Projects', icon: '💼' },
    { id: 'jobs', label: 'Experience', icon: '💻' },
    { id: 'services', label: 'Services', icon: '🛠️' },
    { id: 'contact', label: 'Contact Info', icon: '📞' },
  ];

  return (
    <SidebarContainer>
      <SidebarHeader>
        <SidebarTitle>Portfolio Admin</SidebarTitle>
        <SidebarSubtitle>Manage your content</SidebarSubtitle>
      </SidebarHeader>
      
      <NavMenu>
        {navItems.map((item) => (
          <NavItem key={item.id}>
            <NavLink
              active={currentSection === item.id}
              onClick={() => onSectionChange(item.id)}
            >
              <NavIcon>{item.icon}</NavIcon>
              {item.label}
            </NavLink>
          </NavItem>
        ))}
      </NavMenu>
    </SidebarContainer>
  );
};

export default AdminSidebar;
