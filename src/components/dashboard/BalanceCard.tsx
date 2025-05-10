import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { useAuth } from '@/context/AuthContext';
import { useTransaction } from '@/context/TransactionContext';

const BalanceCard = () => {
  const { user } = useAuth();
  const { exchangeRate } = useTransaction();
  const [supportedCurrencies, setSupportedCurrencies] = useState<Array<{code: string, name: string, exchangeRate: number}>>([]);
  
  // تحميل العملات المدعومة
  useEffect(() => {
    const savedCurrencies = localStorage.getItem('supportedCurrencies');
    if (savedCurrencies) {
      setSupportedCurrencies(JSON.parse(savedCurrencies));
    }
  }, []);
  
  if (!user) return null;

  // إنشاء أرصدة افتراضية للعملات المضافة مؤخرا إذا لم تكن موجودة
  const getBalanceForCurrency = (code: string) => {
    return (user.balances as any)[code] !== undefined ? (user.balances as any)[code] : 0;
  };

  // تحديد ألوان مختلفة للعملات
  const getCurrencyColor = (index: number) => {
    const colors = [
      "from-blue-600 to-indigo-700", // USDT
      "from-emerald-600 to-teal-700", // SYP
      "from-purple-600 to-indigo-700",
      "from-rose-600 to-pink-700",
      "from-amber-600 to-yellow-700",
      "from-sky-600 to-blue-700"
    ];
    return colors[index % colors.length];
  };

  // Safe formatting function to prevent null errors
  const formatNumber = (value: number | null | undefined) => {
    if (value === null || value === undefined) return '0';
    return value.toLocaleString();
  };

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
                <p className="text-2xl font-bold mt-1">${formatNumber(user.balances.usdt)}</p>
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
                <p className="text-2xl font-bold mt-1">{formatNumber(user.balances.syp)} ل.س</p>
              </div>
              <div className="h-12 w-12 rounded-full bg-white/20 flex items-center justify-center">
                <span className="font-bold">SYP</span>
              </div>
            </div>
          </div>
          
          {/* Other Currencies */}
          {supportedCurrencies
            .filter(currency => currency.code !== 'usdt' && currency.code !== 'syp')
            .map((currency, index) => (
              <div 
                key={currency.code}
                className={`bg-gradient-to-br ${getCurrencyColor(index + 2)} rounded-xl p-4 text-white shadow-lg`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm opacity-80">رصيد {currency.name}</p>
                    <p className="text-2xl font-bold mt-1">
                      {formatNumber(getBalanceForCurrency(currency.code))} {currency.code.toUpperCase()}
                    </p>
                  </div>
                  <div className="h-12 w-12 rounded-full bg-white/20 flex items-center justify-center">
                    <span className="font-bold">{currency.code.toUpperCase()}</span>
                  </div>
                </div>
              </div>
            ))
          }
        </div>
        
        {/* Exchange Rate Info */}
        <div className="mt-4 p-3 bg-blue-900/30 rounded-lg border border-blue-800/50">
          <div className="flex justify-between items-center mb-1">
            <span className="text-muted-foreground text-sm">1 USDT = </span>
            <span className="text-white">{formatNumber(exchangeRate.usdt_to_syp)} ل.س</span>
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
