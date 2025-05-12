
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {Object.entries(balances).map(([currency, balance]) => (
            <div 
              key={currency}
              className="bg-[#242C3E] rounded-lg p-4 border border-[#2A3348]"
            >
              <p className="text-sm text-muted-foreground mb-1">{getCurrencyName(currency)}</p>
              <p className="text-2xl font-bold">
                {formatCurrency(balance, currency)}
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
const getCurrencyName = (code: string): string => {
  switch (code.toLowerCase()) {
    case 'usdt':
      return 'Tether USD';
    case 'syp':
      return 'الليرة السورية';
    default:
      // Try to load currency name from supportedCurrencies
      try {
        const supportedCurrencies = JSON.parse(localStorage.getItem('supportedCurrencies') || '[]');
        const currency = supportedCurrencies.find((c: any) => c.code.toLowerCase() === code.toLowerCase());
        return currency?.name || code.toUpperCase();
      } catch (e) {
        return code.toUpperCase();
      }
  }
};

const formatCurrency = (amount: number, code: string): string => {
  const formatter = new Intl.NumberFormat('ar-SA', {
    style: 'decimal',
    minimumFractionDigits: code.toLowerCase() === 'usdt' ? 2 : 0,
    maximumFractionDigits: code.toLowerCase() === 'usdt' ? 2 : 0,
  });
  
  return `${formatter.format(amount)} ${code.toUpperCase()}`;
};

export default BalanceCard;
