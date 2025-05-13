
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/context/AuthContext';
import { Coins } from 'lucide-react';

interface BalanceCardProps {
  label: string;
  currency: string;
  icon: React.ReactNode;
}

const BalanceCard: React.FC<BalanceCardProps> = ({ label, currency, icon }) => {
  const { user } = useAuth();

  const balance = user?.balances[currency] || 0;

  const formatCurrency = (value: number) => {
    return value.toLocaleString('en-US', {
      maximumFractionDigits: 2,
    });
  };

  return (
    <Card className="bg-[#1A1E2C] border-[#2A3348] shadow-md">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-medium text-white">
            {label}
          </CardTitle>
          {icon}
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex items-baseline space-x-1">
          <CardDescription className="text-2xl font-bold text-white">
            {formatCurrency(balance)}
          </CardDescription>
          <span className="text-sm text-gray-400">{currency.toUpperCase()}</span>
        </div>
      </CardContent>
    </Card>
  );
};

export default BalanceCard;
