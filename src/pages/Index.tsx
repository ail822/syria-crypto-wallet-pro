
import React, { useState } from 'react';
import { Navigate, Link } from 'react-router-dom';
import DashboardLayout from '@/components/layout/DashboardLayout';
import BalanceCard from '@/components/dashboard/BalanceCard';
import ActivityChart from '@/components/dashboard/ActivityChart';
import DepositForm from '@/components/forms/DepositForm';
import CustomDepositForm from '@/components/forms/CustomDepositForm';
import ConversionForm from '@/components/forms/ConversionForm';
import WithdrawalForm from '@/components/forms/WithdrawalForm';
import CustomWithdrawalForm from '@/components/forms/CustomWithdrawalForm';
import { useAuth } from '@/context/AuthContext';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Coins, DollarSign, Gamepad2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Dashboard = () => {
  const { user, isAuthenticated } = useAuth();
  const [showNewForms, setShowNewForms] = useState(true);
  
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  return (
    <DashboardLayout>
      <div className="animate-fade-in">
        <h1 className="text-2xl font-bold mb-6">مرحباً, {user?.name}</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <BalanceCard 
            label="رصيد USDT" 
            currency="usdt" 
            icon={<Coins className="h-5 w-5 text-blue-400" />} 
          />
          <ActivityChart />
        </div>
        
        <Card className="border-[#2A3348] bg-[#1A1E2C] shadow-md mb-6">
          <Tabs defaultValue="deposit" className="p-4">
            <TabsList className="grid grid-cols-4 mb-4">
              <TabsTrigger value="deposit">إيداع</TabsTrigger>
              <TabsTrigger value="conversion">تحويل العملات</TabsTrigger>
              <TabsTrigger value="withdrawal">سحب</TabsTrigger>
              <TabsTrigger value="games">شحن الألعاب</TabsTrigger>
            </TabsList>
            <TabsContent value="deposit">
              {showNewForms ? <CustomDepositForm /> : <DepositForm />}
            </TabsContent>
            <TabsContent value="conversion">
              <ConversionForm />
            </TabsContent>
            <TabsContent value="withdrawal">
              {showNewForms ? <CustomWithdrawalForm /> : <WithdrawalForm />}
            </TabsContent>
            <TabsContent value="games">
              <div className="text-center p-4">
                <Gamepad2 className="mx-auto h-12 w-12 text-purple-500 mb-4" />
                <h3 className="text-xl font-medium mb-2">شحن الألعاب</h3>
                <p className="text-muted-foreground mb-4">احصل على رصيد للألعاب الخاصة بك بسهولة وسرعة</p>
                <Button asChild className="bg-purple-600 hover:bg-purple-700">
                  <Link to="/games">استعراض الألعاب</Link>
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
