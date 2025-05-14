
import React, { useState, useEffect } from 'react';
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
import { Coins, DollarSign, Gamepad2, Wallet } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Currency, CurrencyItem } from '@/types';

const Dashboard = () => {
  const { user, isAuthenticated } = useAuth();
  const [showNewForms, setShowNewForms] = useState(true);
  const [currencies, setCurrencies] = useState<CurrencyItem[]>([]);
  
  useEffect(() => {
    // Load currencies from localStorage
    const storedCurrencies = localStorage.getItem('supportedCurrencies');
    if (storedCurrencies) {
      try {
        const parsedCurrencies = JSON.parse(storedCurrencies);
        // Filter to only show active currencies
        const activeCurrencies = parsedCurrencies.filter((c: CurrencyItem) => c.isActive);
        setCurrencies(activeCurrencies);
      } catch (error) {
        console.error('Error parsing currencies data:', error);
        // Default currencies if parsing fails
        setCurrencies([
          { 
            code: 'usdt', 
            name: 'Tether USD', 
            exchangeRate: 1, 
            isActive: true, 
            minDeposit: 10, 
            minWithdrawal: 10 
          },
          { 
            code: 'syp', 
            name: 'الليرة السورية', 
            exchangeRate: 5000, 
            isActive: true, 
            minDeposit: 50000, 
            minWithdrawal: 50000 
          }
        ]);
      }
    } else {
      // Default currencies if not found in localStorage
      setCurrencies([
        { 
          code: 'usdt', 
          name: 'Tether USD', 
          exchangeRate: 1, 
          isActive: true, 
          minDeposit: 10, 
          minWithdrawal: 10 
        },
        { 
          code: 'syp', 
          name: 'الليرة السورية', 
          exchangeRate: 5000, 
          isActive: true, 
          minDeposit: 50000, 
          minWithdrawal: 50000 
        }
      ]);
    }
  }, []);
  
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  // Get currency color for display
  const getCurrencyColor = (code: string) => {
    switch (code.toLowerCase()) {
      case 'usdt':
        return '#26A17B';
      case 'syp':
        return '#CE1126';
      case 'aed':
        return '#00732f';
      case 'eur':
        return '#0052b4';
      case 'usd':
        return '#3C3B6E';
      case 'gbp':
        return '#C8102E';
      default:
        return '#6e56cf'; // Default color for other currencies
    }
  };

  // Get currency icon for display
  const getCurrencyIcon = (code: string) => {
    switch (code.toLowerCase()) {
      case 'usdt':
        return <DollarSign className="h-6 w-6" style={{ color: getCurrencyColor(code) }} />;
      default:
        return <Wallet className="h-6 w-6" style={{ color: getCurrencyColor(code) }} />;
    }
  };

  return (
    <DashboardLayout>
      <div className="animate-fade-in">
        <h1 className="text-2xl font-bold mb-6">مرحباً, {user?.name}</h1>
        
        {/* Currency Balance Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
          {currencies.map(currency => (
            <div 
              key={currency.code} 
              className="bg-[#1A1E2C] border border-[#2A3348] rounded-lg overflow-hidden shadow-md"
            >
              <div className="p-4 flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-medium text-white">{currency.name}</h3>
                  <div className="flex items-baseline space-x-1 rtl:space-x-reverse mt-1">
                    <span className="text-2xl font-bold text-white">
                      {user?.balances?.[currency.code as Currency] || 0}
                    </span>
                    <span className="text-sm text-gray-400">{currency.code.toUpperCase()}</span>
                  </div>
                </div>
                <div 
                  className="w-12 h-12 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: `${getCurrencyColor(currency.code)}20` }}
                >
                  {getCurrencyIcon(currency.code)}
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          <div className="lg:col-span-2">
            <ActivityChart />
          </div>
          <div>
            <Button asChild className="w-full bg-[#9b87f5] hover:bg-[#7E69AB] mb-4">
              <Link to="/games" className="flex items-center justify-center">
                <Gamepad2 className="mr-2 h-5 w-5" />
                شحن الألعاب
              </Link>
            </Button>
            <Button asChild variant="outline" className="w-full">
              <Link to="/profile" className="flex items-center justify-center">
                إعدادات الحساب
              </Link>
            </Button>
          </div>
        </div>
        
        <Card className="border-[#2A3348] bg-[#1A1E2C] shadow-md mb-6">
          <Tabs defaultValue="deposit" className="p-4">
            <TabsList className="grid grid-cols-3 mb-4">
              <TabsTrigger value="deposit">إيداع</TabsTrigger>
              <TabsTrigger value="conversion">تحويل العملات</TabsTrigger>
              <TabsTrigger value="withdrawal">سحب</TabsTrigger>
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
          </Tabs>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
