
import React from 'react';
import { Navigate } from 'react-router-dom';
import DashboardLayout from '@/components/layout/DashboardLayout';
import BalanceCard from '@/components/dashboard/BalanceCard';
import ActivityChart from '@/components/dashboard/ActivityChart';
import DepositForm from '@/components/forms/DepositForm';
import ConversionForm from '@/components/forms/ConversionForm';
import WithdrawalForm from '@/components/forms/WithdrawalForm';
import { useAuth } from '@/context/AuthContext';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const Dashboard = () => {
  const { user, isAuthenticated } = useAuth();
  
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  return (
    <DashboardLayout>
      <div className="animate-fade-in">
        <h1 className="text-2xl font-bold mb-6">مرحباً, {user?.name}</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <BalanceCard />
          <ActivityChart />
        </div>
        
        <Card className="border-[#2A3348] bg-[#1A1E2C] shadow-md mb-6">
          <Tabs defaultValue="deposit" className="p-4">
            <TabsList className="grid grid-cols-3 mb-4">
              <TabsTrigger value="deposit">إيداع</TabsTrigger>
              <TabsTrigger value="conversion">تحويل العملات</TabsTrigger>
              <TabsTrigger value="withdrawal">سحب</TabsTrigger>
            </TabsList>
            <TabsContent value="deposit">
              <DepositForm />
            </TabsContent>
            <TabsContent value="conversion">
              <ConversionForm />
            </TabsContent>
            <TabsContent value="withdrawal">
              <WithdrawalForm />
            </TabsContent>
          </Tabs>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
