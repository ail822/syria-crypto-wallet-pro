
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RefreshCcw } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { ar } from 'date-fns/locale';
import { useBalanceRefresh } from '@/hooks/useBalanceRefresh';

const BalanceCard = () => {
  const { balances, isRefreshing, lastRefreshed, forceRefresh } = useBalanceRefresh();
  
  // Format date for last refreshed time
  const getLastRefreshedText = () => {
    if (!lastRefreshed) return 'لم يتم التحديث بعد';
    return `آخر تحديث ${formatDistanceToNow(lastRefreshed, { addSuffix: true, locale: ar })}`;
  };

  const getCurrencyColor = (currency: string): string => {
    switch (currency.toLowerCase()) {
      case 'usdt':
        return 'bg-blue-600';
      case 'syp':
        return 'bg-emerald-600';
      case 'aed':
        return 'bg-purple-600';
      default:
        return 'bg-slate-600';
    }
  };

  const getCurrencySymbol = (currency: string): string => {
    switch (currency.toLowerCase()) {
      case 'syp':
        return 'ل.س';
      case 'usdt':
        return '$';
      case 'aed':
        return 'AED';
      default:
        return currency.toUpperCase();
    }
  };

  return (
    <Card className="border-[#2A3348] bg-[#1A1E2C] shadow-md">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-xl font-bold">رصيدك الحالي</CardTitle>
        <Button
          variant="ghost"
          size="sm"
          className="h-8 w-8 p-0"
          onClick={forceRefresh}
          disabled={isRefreshing}
        >
          <RefreshCcw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
          <span className="sr-only">تحديث الرصيد</span>
        </Button>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {Object.entries(balances).map(([currency, balance]) => (
            <div 
              key={currency}
              className={`rounded-lg p-4 ${getCurrencyColor(currency)} text-white`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center justify-center bg-white/20 rounded-full h-9 w-9 mb-2">
                  <span className="font-bold text-white">{currency.toUpperCase()}</span>
                </div>
                <div className="text-xs text-right">
                  <span className="block text-white/70">رصيد {currency.toUpperCase()}</span>
                </div>
              </div>
              <p className="text-xl font-bold text-white mt-2">
                {formatCurrency(balance, currency)} {getCurrencySymbol(currency)}
              </p>
            </div>
          ))}
        </div>
        
        <p className="text-xs text-muted-foreground mt-4 text-center">
          {getLastRefreshedText()} (يتم التحديث تلقائيًا كل 10 ثوانٍ)
        </p>
      </CardContent>
    </Card>
  );
};

// Helper functions
const formatCurrency = (amount: number, code: string): string => {
  const formatter = new Intl.NumberFormat('ar-SA', {
    style: 'decimal',
    minimumFractionDigits: code.toLowerCase() === 'usdt' ? 2 : 0,
    maximumFractionDigits: code.toLowerCase() === 'usdt' ? 2 : 0,
  });
  
  return formatter.format(amount);
};

export default BalanceCard;
