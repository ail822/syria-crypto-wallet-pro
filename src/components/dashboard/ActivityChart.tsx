
import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useTransaction } from '@/context/TransactionContext';
import CardSection from '../ui/card-section';

type ChartPeriod = '1m' | '3m' | '6m';
type ChartType = 'bar' | 'line';

const ActivityChart = () => {
  const { getFilteredTransactions } = useTransaction();
  const [period, setPeriod] = useState<ChartPeriod>('1m');
  const [chartType, setChartType] = useState<ChartType>('bar');

  // Calculate start date based on period
  const getStartDate = () => {
    const now = new Date();
    switch (period) {
      case '1m':
        return new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());
      case '3m':
        return new Date(now.getFullYear(), now.getMonth() - 3, now.getDate());
      case '6m':
        return new Date(now.getFullYear(), now.getMonth() - 6, now.getDate());
      default:
        return new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());
    }
  };

  // Get transactions for the selected period
  const transactions = getFilteredTransactions(getStartDate());

  // Process data for chart
  const processChartData = () => {
    const data: { name: string; deposits: number; withdrawals: number; conversions: number }[] = [];
    
    // Create a map for each month/week
    const dataMap = new Map();
    
    transactions.forEach(transaction => {
      const date = new Date(transaction.timestamp);
      let key;
      
      if (period === '1m') {
        // For 1 month, group by day
        key = `${date.getDate()}/${date.getMonth() + 1}`;
      } else {
        // For 3 and 6 months, group by week
        key = `${Math.ceil(date.getDate() / 7)}w ${date.getMonth() + 1}m`;
      }
      
      if (!dataMap.has(key)) {
        dataMap.set(key, { name: key, deposits: 0, withdrawals: 0, conversions: 0 });
      }
      
      const entry = dataMap.get(key);
      
      // Convert all amounts to USDT equivalent for consistency
      let amount = transaction.currency === 'usdt' 
        ? transaction.amount 
        : transaction.amount / 5000; // Simple conversion using a fixed rate
      
      switch (transaction.type) {
        case 'deposit':
          entry.deposits += amount;
          break;
        case 'withdrawal':
          entry.withdrawals += amount;
          break;
        case 'conversion':
          entry.conversions += amount;
          break;
      }
    });
    
    // Convert map to array
    dataMap.forEach(value => {
      data.push(value);
    });
    
    return data.sort((a, b) => {
      // Sort by month and week/day
      const [aNum, aMonth] = a.name.split(' ');
      const [bNum, bMonth] = b.name.split(' ');
      
      if (aMonth && bMonth) {
        const monthDiff = parseInt(aMonth) - parseInt(bMonth);
        if (monthDiff !== 0) return monthDiff;
        return parseInt(aNum) - parseInt(bNum);
      }
      
      // For daily format "day/month"
      const [aDay, aMonthDaily] = a.name.split('/');
      const [bDay, bMonthDaily] = b.name.split('/');
      
      const monthDiff = parseInt(aMonthDaily) - parseInt(bMonthDaily);
      if (monthDiff !== 0) return monthDiff;
      return parseInt(aDay) - parseInt(bDay);
    });
  };

  const chartData = processChartData();

  return (
    <CardSection 
      title="نشاط الحساب" 
      contentClassName="p-0"
    >
      <div className="flex justify-between items-center px-6 pb-2">
        <div className="flex gap-2">
          <Select value={period} onValueChange={(value) => setPeriod(value as ChartPeriod)}>
            <SelectTrigger className="w-[120px] bg-[#242C3E] border-[#2A3348] text-white">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-[#242C3E] border-[#2A3348] text-white">
              <SelectItem value="1m">شهر واحد</SelectItem>
              <SelectItem value="3m">3 أشهر</SelectItem>
              <SelectItem value="6m">6 أشهر</SelectItem>
            </SelectContent>
          </Select>
          
          <Select value={chartType} onValueChange={(value) => setChartType(value as ChartType)}>
            <SelectTrigger className="w-[120px] bg-[#242C3E] border-[#2A3348] text-white">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-[#242C3E] border-[#2A3348] text-white">
              <SelectItem value="bar">عرض بالأعمدة</SelectItem>
              <SelectItem value="line">عرض خطي</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <div className="h-[300px] w-full p-4">
        <ResponsiveContainer width="100%" height="100%">
          {chartType === 'bar' ? (
            <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <XAxis dataKey="name" stroke="#94A3B8" fontSize={12} tickMargin={10} />
              <YAxis stroke="#94A3B8" fontSize={12} />
              <Tooltip
                contentStyle={{ backgroundColor: '#1A1E2C', border: '1px solid #2A3348' }}
                labelStyle={{ color: 'white' }}
              />
              <Bar dataKey="deposits" fill="#3B82F6" name="إيداع" />
              <Bar dataKey="withdrawals" fill="#10B981" name="سحب" />
              <Bar dataKey="conversions" fill="#6366F1" name="تحويل" />
            </BarChart>
          ) : (
            <LineChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <XAxis dataKey="name" stroke="#94A3B8" fontSize={12} tickMargin={10} />
              <YAxis stroke="#94A3B8" fontSize={12} />
              <Tooltip
                contentStyle={{ backgroundColor: '#1A1E2C', border: '1px solid #2A3348' }}
                labelStyle={{ color: 'white' }}
              />
              <Line type="monotone" dataKey="deposits" stroke="#3B82F6" name="إيداع" strokeWidth={2} />
              <Line type="monotone" dataKey="withdrawals" stroke="#10B981" name="سحب" strokeWidth={2} />
              <Line type="monotone" dataKey="conversions" stroke="#6366F1" name="تحويل" strokeWidth={2} />
            </LineChart>
          )}
        </ResponsiveContainer>
      </div>
    </CardSection>
  );
};

export default ActivityChart;
