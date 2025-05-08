
import React from 'react';
import { Navigate } from 'react-router-dom';
import DashboardLayout from '@/components/layout/DashboardLayout';
import AdminSettingsComponent from '@/components/admin/AdminSettings';
import { useAuth } from '@/context/AuthContext';

const AdminSettings = () => {
  const { isAuthenticated, isAdmin } = useAuth();
  
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }
  
  if (!isAdmin) {
    return <Navigate to="/" />;
  }

  return (
    <DashboardLayout>
      <div className="animate-fade-in">
        <h1 className="text-2xl font-bold mb-6">إعدادات النظام</h1>
        <AdminSettingsComponent />
      </div>
    </DashboardLayout>
  );
};

export default AdminSettings;
