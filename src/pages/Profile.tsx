
import React from 'react';
import { Navigate } from 'react-router-dom';
import DashboardLayout from '@/components/layout/DashboardLayout';
import ProfileForm from '@/components/profile/ProfileForm';
import PasswordChangeForm from '@/components/profile/PasswordChangeForm';
import TwoFactorSettings from '@/components/profile/TwoFactorSettings';
import TransactionsTable from '@/components/transactions/TransactionsTable';
import { useAuth } from '@/context/AuthContext';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const Profile = () => {
  const { isAuthenticated } = useAuth();
  
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  return (
    <DashboardLayout>
      <div className="animate-fade-in">
        <h1 className="text-2xl font-bold mb-6">حسابي</h1>
        
        <Tabs defaultValue="profile" className="mb-6">
          <TabsList className="mb-4">
            <TabsTrigger value="profile">الملف الشخصي</TabsTrigger>
            <TabsTrigger value="password">تغيير كلمة المرور</TabsTrigger>
            <TabsTrigger value="2fa">المصادقة الثنائية</TabsTrigger>
            <TabsTrigger value="transactions">سجل المعاملات</TabsTrigger>
          </TabsList>
          
          <TabsContent value="profile">
            <ProfileForm />
          </TabsContent>
          
          <TabsContent value="password">
            <PasswordChangeForm />
          </TabsContent>
          
          <TabsContent value="2fa">
            <TwoFactorSettings />
          </TabsContent>
          
          <TabsContent value="transactions">
            <h2 className="text-xl font-bold mb-4">سجل المعاملات</h2>
            <TransactionsTable />
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default Profile;
