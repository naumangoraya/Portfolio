'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../src/contexts/AuthContext';
import AdminDashboard from './AdminDashboard';

/**
 * /admin is the dashboard. The login screen that used to live here moved to
 * /admin/login unchanged.
 *
 * AdminShell already gates this segment, but the check is repeated here so the
 * dashboard never fires its eight authenticated fetches during the frame
 * between "no token" and the shell's redirect landing.
 */

const AdminPage = () => {
  const { isAdmin, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAdmin) {
      router.replace('/admin/login');
    }
  }, [isAdmin, isLoading, router]);

  if (isLoading || !isAdmin) {
    // AdminShell renders the visible placeholder for both of these states.
    return null;
  }

  return <AdminDashboard />;
};

export default AdminPage;
