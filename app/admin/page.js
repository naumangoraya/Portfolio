'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import styled from 'styled-components';
import AdminSidebar from './components/AdminSidebar';
import AdminHeader from './components/AdminHeader';
import Dashboard from './components/Dashboard';
import HeroEditor from './components/HeroEditor';
import ProjectsEditor from './components/ProjectsEditor';
import JobsEditor from './components/JobsEditor';
import ServicesEditor from './components/ServicesEditor';
import AboutEditor from './components/AboutEditor';
import ContactEditor from './components/ContactEditor';

const AdminContainer = styled.div`
  display: flex;
  min-height: 100vh;
  background: var(--light-navy);
`;

const AdminContent = styled.div`
  flex: 1;
  overflow-y: auto;
`;

const AdminPage = () => {
  const [user, setUser] = useState(null);
  const [activeSection, setActiveSection] = useState('dashboard');
  const router = useRouter();

  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem('adminToken');
    const userData = localStorage.getItem('adminUser');
    
    if (!token || !userData) {
      router.push('/admin/login');
      return;
    }

    try {
      setUser(JSON.parse(userData));
    } catch (error) {
      console.error('Error parsing user data:', error);
      router.push('/admin/login');
    }
  }, [router]);

  const renderContent = () => {
    switch (activeSection) {
      case 'dashboard':
        return <Dashboard />;
      case 'hero':
        return <HeroEditor />;
      case 'projects':
        return <ProjectsEditor />;
      case 'jobs':
        return <JobsEditor />;
      case 'services':
        return <ServicesEditor />;
      case 'about':
        return <AboutEditor />;
      case 'contact':
        return <ContactEditor />;
      default:
        return <Dashboard />;
    }
  };

  if (!user) {
    return null; // Loading state
  }

  return (
    <AdminContainer>
      <AdminSidebar activeSection={activeSection} onSectionChange={setActiveSection} />
      <div style={{ flex: 1 }}>
        <AdminHeader user={user} />
        <AdminContent>
          {renderContent()}
        </AdminContent>
      </div>
    </AdminContainer>
  );
};

export default AdminPage;
