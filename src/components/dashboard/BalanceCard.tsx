
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { useAuth } from '@/context/AuthContext';
import { useTransaction } from '@/context/TransactionContext';

const BalanceCard = () => {
  const { user } = useAuth();
  const { exchangeRate } = useTransaction();
  
  if (!user) return null;

  return (
    <Card className="border-[#2A3348] bg-[#1A1E2C] shadow-md">
      <CardContent className="p-6">
        <h2 className="text-lg font-medium mb-4 text-white">الرصيد الحالي</h2>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* USDT Balance */}
          <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-xl p-4 text-white shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm opacity-80">رصيد USDT</p>
                <p className="text-2xl font-bold mt-1">${user.balances.usdt.toFixed(2)}</p>
              </div>
              <div className="h-12 w-12 rounded-full bg-white/20 flex items-center justify-center">
                <span className="font-bold">USDT</span>
              </div>
            </div>
          </div>
          
          {/* SYP Balance */}
          <div className="bg-gradient-to-br from-emerald-600 to-teal-700 rounded-xl p-4 text-white shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm opacity-80">رصيد الليرة السورية</p>
                <p className="text-2xl font-bold mt-1">{user.balances.syp.toLocaleString()} ل.س</p>
              </div>
              <div className="h-12 w-12 rounded-full bg-white/20 flex items-center justify-center">
                <span className="font-bold">SYP</span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Exchange Rate Info */}
        <div className="mt-4 p-3 bg-blue-900/30 rounded-lg border border-blue-800/50">
          <div className="flex justify-between items-center mb-1">
            <span className="text-muted-foreground text-sm">1 USDT = </span>
            <span className="text-white">{exchangeRate.usdt_to_syp.toLocaleString()} ل.س</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-muted-foreground text-sm">العمولة:</span>
            <span className="text-white">{exchangeRate.fee_percentage}%</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default BalanceCard;
