
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useTransaction } from '@/context/TransactionContext';
import { useTheme } from '@/context/ThemeContext';
import {
  Area,
  AreaChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { ArrowUp, ArrowDown, CreditCard } from 'lucide-react';

const ActivityChart = () => {
  const { transactions } = useTransaction();
  const { theme } = useTheme();
  
  // Get past 7 days for chart
  const getLast7Days = () => {
    const data = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const day = date.toLocaleDateString('ar-SY', { weekday: 'short' });
      
      // Calculate total amounts for each day
      const dayTransactions = transactions.filter(t => {
        const txDate = new Date(t.timestamp);
        return txDate.getDate() === date.getDate() && 
               txDate.getMonth() === date.getMonth() &&
               txDate.getFullYear() === date.getFullYear();
      });
      
      const deposits = dayTransactions
        .filter(t => t.type === 'deposit' && t.status === 'completed')
        .reduce((sum, t) => sum + (t.currency === 'usdt' ? t.amount * 15000 : t.amount), 0);
      
      const withdrawals = dayTransactions
        .filter(t => t.type === 'withdrawal' && t.status === 'completed')
        .reduce((sum, t) => sum + (t.currency === 'usdt' ? t.amount * 15000 : t.amount), 0);
        
      const conversions = dayTransactions
        .filter(t => t.type === 'conversion' && t.status === 'completed')
        .reduce((sum, t) => sum + (t.currency === 'usdt' ? t.amount * 15000 : t.amount), 0);
      
      data.push({
        name: day,
        deposits,
        withdrawals,
        conversions
      });
    }
    return data;
  };
  
  const data = getLast7Days();
  
  const isDark = theme === 'dark';
  
  return (
    <Card className="border-[#2A3348] bg-[#1A1E2C] shadow-md h-full">
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          <span>نشاط الحساب</span>
          <div className="flex space-x-2 rtl:space-x-reverse text-sm">
            <div className="flex items-center">
              <span className="w-3 h-3 rounded-full bg-emerald-500 mr-1"></span>
              <span>إيداع</span>
            </div>
            <div className="flex items-center">
              <span className="w-3 h-3 rounded-full bg-rose-500 mr-1"></span>
              <span>سحب</span>
            </div>
            <div className="flex items-center">
              <span className="w-3 h-3 rounded-full bg-blue-500 mr-1"></span>
              <span>تحويل</span>
            </div>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[250px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={data}
              margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
            >
              <defs>
                <linearGradient id="colorDeposit" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10B981" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorWithdraw" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#F43F5E" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#F43F5E" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorConversion" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis 
                dataKey="name" 
                axisLine={false}
                tickLine={false}
                tick={{ fill: isDark ? '#9ca3af' : '#6b7280' }}
              />
              <YAxis 
                axisLine={false}
                tickLine={false}
                tick={{ fill: isDark ? '#9ca3af' : '#6b7280' }}
                tickFormatter={(value) => value > 1000 ? `${(value / 1000).toFixed(0)}k` : value}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: isDark ? '#1F2937' : '#ffffff',
                  borderColor: isDark ? '#374151' : '#e5e7eb',
                  borderRadius: '0.5rem'
                }}
                formatter={(value) => [`${value.toLocaleString()} ل.س`]}
              />
              <Area
                type="monotone"
                dataKey="deposits"
                stroke="#10B981"
                fillOpacity={1}
                fill="url(#colorDeposit)"
                strokeWidth={2}
              />
              <Area
                type="monotone"
                dataKey="withdrawals"
                stroke="#F43F5E"
                fillOpacity={1}
                fill="url(#colorWithdraw)"
                strokeWidth={2}
              />
              <Area
                type="monotone"
                dataKey="conversions"
                stroke="#3B82F6"
                fillOpacity={1}
                fill="url(#colorConversion)"
                strokeWidth={2}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
        
        <div className="grid grid-cols-3 gap-2 mt-4">
          <div className="bg-emerald-500/10 p-3 rounded-lg border border-emerald-500/20 flex flex-col items-center">
            <ArrowDown className="text-emerald-500 mb-1" />
            <span className="text-sm text-emerald-500 font-medium">الإيداعات</span>
          </div>
          <div className="bg-rose-500/10 p-3 rounded-lg border border-rose-500/20 flex flex-col items-center">
            <ArrowUp className="text-rose-500 mb-1" />
            <span className="text-sm text-rose-500 font-medium">السحوبات</span>
          </div>
          <div className="bg-blue-500/10 p-3 rounded-lg border border-blue-500/20 flex flex-col items-center">
            <CreditCard className="text-blue-500 mb-1" />
            <span className="text-sm text-blue-500 font-medium">التحويلات</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ActivityChart;
