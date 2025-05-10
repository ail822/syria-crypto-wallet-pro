
import React from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import DashboardLayout from '@/components/layout/DashboardLayout';
import PendingTransactions from '@/components/admin/PendingTransactions';
import TransactionsTable from '@/components/transactions/TransactionsTable';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useTransaction } from '@/context/TransactionContext';

const Admin = () => {
  const { isAuthenticated, isAdmin } = useAuth();
  const { transactions } = useTransaction();
  const navigate = useNavigate();
  
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }
  
  if (!isAdmin) {
    return <Navigate to="/" />;
  }

  // Count pending transactions
  const pendingTransactions = transactions.filter(t => t.status === 'pending').length;
  
  // Count total transactions by type
  const depositCount = transactions.filter(t => t.type === 'deposit').length;
  const withdrawalCount = transactions.filter(t => t.type === 'withdrawal').length;
  const conversionCount = transactions.filter(t => t.type === 'conversion').length;
  
  // Count completed and rejected transactions 
  const completedCount = transactions.filter(t => t.status === 'completed').length;
  const rejectedCount = transactions.filter(t => t.status === 'rejected').length;

  return (
    <DashboardLayout>
      <div className="animate-fade-in">
        <h1 className="text-2xl font-bold mb-6">لوحة التحكم</h1>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <Card className="bg-gradient-to-br from-blue-600 to-blue-700 border-none">
            <CardHeader className="pb-2">
              <CardDescription className="text-blue-100">المعاملات المعلقة</CardDescription>
              <CardTitle className="text-2xl text-white">{pendingTransactions}</CardTitle>
            </CardHeader>
          </Card>
          
          <Card className="bg-gradient-to-br from-emerald-600 to-emerald-700 border-none">
            <CardHeader className="pb-2">
              <CardDescription className="text-emerald-100">عمليات الإيداع</CardDescription>
              <CardTitle className="text-2xl text-white">{depositCount}</CardTitle>
            </CardHeader>
          </Card>
          
          <Card className="bg-gradient-to-br from-amber-600 to-amber-700 border-none">
            <CardHeader className="pb-2">
              <CardDescription className="text-amber-100">عمليات السحب</CardDescription>
              <CardTitle className="text-2xl text-white">{withdrawalCount}</CardTitle>
            </CardHeader>
          </Card>
          
          <Card className="bg-gradient-to-br from-violet-600 to-violet-700 border-none">
            <CardHeader className="pb-2">
              <CardDescription className="text-violet-100">عمليات التحويل</CardDescription>
              <CardTitle className="text-2xl text-white">{conversionCount}</CardTitle>
            </CardHeader>
          </Card>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <Card className="bg-gradient-to-br from-green-600 to-green-700 border-none">
            <CardHeader className="pb-2">
              <CardDescription className="text-green-100">المعاملات المكتملة</CardDescription>
              <CardTitle className="text-2xl text-white">{completedCount}</CardTitle>
            </CardHeader>
          </Card>
          
          <Card className="bg-gradient-to-br from-red-600 to-red-700 border-none">
            <CardHeader className="pb-2">
              <CardDescription className="text-red-100">المعاملات المرفوضة</CardDescription>
              <CardTitle className="text-2xl text-white">{rejectedCount}</CardTitle>
            </CardHeader>
          </Card>
          
          <Card className="bg-gradient-to-br from-indigo-600 to-indigo-700 border-none">
            <CardHeader className="pb-2">
              <CardDescription className="text-indigo-100">إجمالي المعاملات</CardDescription>
              <CardTitle className="text-2xl text-white">{transactions.length}</CardTitle>
            </CardHeader>
          </Card>
        </div>
        
        <div className="space-y-6">
          <PendingTransactions />
          
          <Card className="border-[#2A3348] bg-[#1A1E2C] shadow-md">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg font-medium text-white">
                  الإعدادات السريعة
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Button onClick={() => navigate('/admin/settings')}>
                  إعدادات الصرف والعمولات
                </Button>
                <Button variant="secondary" onClick={() => navigate('/admin/settings?tab=user-balance')}>
                  إدارة أرصدة المستخدمين
                </Button>
                <Button variant="outline" onClick={() => navigate('/admin/settings?tab=payment-methods')} className="border-[#2A3348] text-white">
                  إدارة طرق الدفع
                </Button>
              </div>
            </CardContent>
          </Card>
          
          <div>
            <h2 className="text-xl font-bold mb-4">سجل المعاملات الكامل</h2>
            <TransactionsTable />
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Admin;
