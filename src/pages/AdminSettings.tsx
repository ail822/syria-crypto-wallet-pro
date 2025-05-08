
import React, { useState } from 'react';
import { Navigate } from 'react-router-dom';
import DashboardLayout from '@/components/layout/DashboardLayout';
import AdminSettingsComponent from '@/components/admin/AdminSettings';
import ManagePaymentMethods from '@/components/admin/ManagePaymentMethods';
import DatabaseSettings from '@/components/admin/DatabaseSettings';
import UserBalanceManager from '@/components/admin/UserBalanceManager';
import { useAuth } from '@/context/AuthContext';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const AdminSettings = () => {
  const { isAuthenticated, isAdmin } = useAuth();
  const [activeTab, setActiveTab] = useState<string>('general');
  
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
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="mb-4 flex flex-wrap">
            <TabsTrigger value="general">الإعدادات العامة</TabsTrigger>
            <TabsTrigger value="payment-methods">طرق الدفع</TabsTrigger>
            <TabsTrigger value="database">إعدادات قاعدة البيانات</TabsTrigger>
            <TabsTrigger value="user-balance">إدارة أرصدة المستخدمين</TabsTrigger>
          </TabsList>
          
          <TabsContent value="general">
            <AdminSettingsComponent />
          </TabsContent>
          
          <TabsContent value="payment-methods">
            <ManagePaymentMethods />
          </TabsContent>

          <TabsContent value="database">
            <DatabaseSettings />
          </TabsContent>

          <TabsContent value="user-balance">
            <UserBalanceManager />
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default AdminSettings;
