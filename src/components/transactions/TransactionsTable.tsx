import React, { useState } from 'react';
import { useTransaction } from '@/context/TransactionContext';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Transaction } from '@/types';

const TransactionsTable = () => {
  const { transactions } = useTransaction();
  const [filters, setFilters] = useState({
    type: 'all',
    status: 'all',
    startDate: '',
    endDate: '',
  });

  const handleFilterChange = (key: string, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  // Safe formatting function to prevent null errors
  const formatNumber = (value: number | null | undefined) => {
    if (value === null || value === undefined) return '0';
    
    // Ensure the value is a number
    const numValue = typeof value === 'number' ? value : parseFloat(String(value));
    
    // Handle NaN case
    if (isNaN(numValue)) return '0';
    
    return numValue.toLocaleString();
  };

  // Apply filters to transactions
  const filteredTransactions = transactions.filter(transaction => {
    // Type filter
    if (filters.type !== 'all' && transaction.type !== filters.type) {
      return false;
    }
    
    // Status filter
    if (filters.status !== 'all' && transaction.status !== filters.status) {
      return false;
    }
    
    // Start date filter
    if (filters.startDate && new Date(transaction.timestamp) < new Date(filters.startDate)) {
      return false;
    }
    
    // End date filter
    if (filters.endDate && new Date(transaction.timestamp) > new Date(filters.endDate)) {
      return false;
    }
    
    return true;
  });

  // Format date
  const formatDate = (date: Date) => {
    return new Date(date).toLocaleString('ar-SY');
  };

  // Get status class and label
  const getStatusInfo = (status: Transaction['status']) => {
    switch (status) {
      case 'completed':
        return { class: 'bg-green-500/20 text-green-500', label: 'مكتمل' };
      case 'pending':
        return { class: 'bg-yellow-500/20 text-yellow-500', label: 'قيد الانتظار' };
      case 'rejected':
        return { class: 'bg-red-500/20 text-red-500', label: 'مرفوض' };
      default:
        return { class: '', label: status };
    }
  };

  // Get transaction type label
  const getTransactionTypeLabel = (type: Transaction['type']) => {
    switch (type) {
      case 'deposit': return 'إيداع';
      case 'withdrawal': return 'سحب';
      case 'conversion': return 'تحويل';
      case 'game_recharge': return 'شحن ألعاب';
      default: return type;
    }
  };
  
  // Helper function for finding user information
  const findUserInfo = (userId?: string) => {
    if (!userId) return null;
    
    // This would normally query a database but for now we're using localStorage
    const allUsers = [];
    
    // Get all localStorage items
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key === 'user') {
        try {
          const userData = JSON.parse(localStorage.getItem(key) || '{}');
          if (userData && userData.id) {
            allUsers.push(userData);
          }
        } catch (e) {
          // Skip invalid JSON
        }
      }
    }
    
    return allUsers.find(user => user.id === userId) || null;
  };
  
  // Reset all filters
  const resetFilters = () => {
    setFilters({
      type: 'all',
      status: 'all',
      startDate: '',
      endDate: '',
    });
  };

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="bg-[#1A1E2C] p-4 border border-[#2A3348] rounded-md">
        <h3 className="text-white font-medium mb-3">تصفية النتائج</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="text-sm text-muted-foreground block mb-1">نوع المعاملة</label>
            <Select value={filters.type} onValueChange={(value) => handleFilterChange('type', value)}>
              <SelectTrigger className="bg-[#242C3E] border-[#2A3348] text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-[#242C3E] border-[#2A3348] text-white">
                <SelectItem value="all">الكل</SelectItem>
                <SelectItem value="deposit">إيداع</SelectItem>
                <SelectItem value="withdrawal">سحب</SelectItem>
                <SelectItem value="conversion">تحويل</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <label className="text-sm text-muted-foreground block mb-1">الحالة</label>
            <Select value={filters.status} onValueChange={(value) => handleFilterChange('status', value)}>
              <SelectTrigger className="bg-[#242C3E] border-[#2A3348] text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-[#242C3E] border-[#2A3348] text-white">
                <SelectItem value="all">الكل</SelectItem>
                <SelectItem value="completed">مكتملة</SelectItem>
                <SelectItem value="pending">قيد الانتظار</SelectItem>
                <SelectItem value="rejected">مرفوضة</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <label className="text-sm text-muted-foreground block mb-1">من تاريخ</label>
            <Input
              type="date"
              value={filters.startDate}
              onChange={(e) => handleFilterChange('startDate', e.target.value)}
              className="bg-[#242C3E] border-[#2A3348] text-white"
            />
          </div>
          
          <div>
            <label className="text-sm text-muted-foreground block mb-1">إلى تاريخ</label>
            <Input
              type="date"
              value={filters.endDate}
              onChange={(e) => handleFilterChange('endDate', e.target.value)}
              className="bg-[#242C3E] border-[#2A3348] text-white"
            />
          </div>
        </div>
        
        <div className="flex justify-end mt-3">
          <Button variant="outline" onClick={resetFilters} className="border-[#2A3348] text-white">
            إعادة ضبط
          </Button>
        </div>
      </div>
      
      {/* Transactions Table */}
      <div className="border border-[#2A3348] rounded-md overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-[#1A1E2C] hover:bg-[#1A1E2C]">
              <TableHead className="text-white">التاريخ</TableHead>
              <TableHead className="text-white">النوع</TableHead>
              <TableHead className="text-white">المبلغ</TableHead>
              <TableHead className="text-white">الحالة</TableHead>
              <TableHead className="text-white">التفاصيل</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredTransactions.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-6 text-muted-foreground">
                  لا توجد معاملات متطابقة مع المعايير المحددة
                </TableCell>
              </TableRow>
            ) : (
              filteredTransactions.map((transaction) => {
                const statusInfo = getStatusInfo(transaction.status);
                const userInfo = findUserInfo(transaction.userId);
                
                return (
                  <TableRow key={transaction.id} className="bg-[#1E293B] hover:bg-[#242C3E] border-t border-[#2A3348]">
                    <TableCell className="text-white">
                      {formatDate(transaction.timestamp)}
                    </TableCell>
                    <TableCell>
                      {getTransactionTypeLabel(transaction.type)}
                    </TableCell>
                    <TableCell>
                      <span className="font-medium">
                        {formatNumber(transaction.amount)}
                      </span>
                      {' '}
                      <span className="text-muted-foreground">
                        {transaction.currency === 'usdt' ? 'USDT' : 'ل.س'}
                      </span>
                      
                      {transaction.type === 'conversion' && transaction.targetAmount !== undefined && (
                        <>
                          <span className="mx-1">→</span>
                          <span className="font-medium">
                            {formatNumber(transaction.targetAmount)}
                          </span>
                          {' '}
                          <span className="text-muted-foreground">
                            {transaction.targetCurrency === 'usdt' ? 'USDT' : 'ل.س'}
                          </span>
                        </>
                      )}
                    </TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 rounded text-xs ${statusInfo.class}`}>
                        {statusInfo.label}
                      </span>
                    </TableCell>
                    <TableCell>
                      {userInfo && (
                        <span className="text-sm text-muted-foreground">
                          {userInfo.name} ({userInfo.email})
                        </span>
                      )}
                      
                      {transaction.withdrawalMethod && (
                        <span className="text-sm text-muted-foreground block">
                          {transaction.withdrawalMethod === 'province' && 'محافظة'}
                          {transaction.withdrawalMethod === 'mtn' && 'MTN'}
                          {transaction.withdrawalMethod === 'syriatel' && 'Syriatel'}
                          {transaction.withdrawalMethod === 'c-wallet' && 'C-Wallet'}
                          
                          {transaction.recipient?.province && ` - ${transaction.recipient.province}`}
                          {transaction.recipient?.name && ` - ${transaction.recipient.name}`}
                        </span>
                      )}
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default TransactionsTable;
