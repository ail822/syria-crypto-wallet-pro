
import React, { createContext, useState, useContext, ReactNode } from 'react';
import { Transaction, Currency, WithdrawalMethod } from '@/types';
import { useAuth } from './AuthContext';
import { toast } from '@/hooks/use-toast';

interface TransactionContextType {
  transactions: Transaction[];
  depositRequest: (amount: number, walletId: string, screenshot: string) => Promise<void>;
  convertCurrency: (fromCurrency: Currency, toCurrency: Currency, amount: number) => Promise<void>;
  withdrawRequest: (
    method: WithdrawalMethod,
    amount: number,
    currency: Currency,
    recipientData: {
      name?: string;
      phoneNumber?: string;
      province?: string;
      walletId?: string;
    }
  ) => Promise<void>;
  getFilteredTransactions: (
    startDate?: Date,
    endDate?: Date,
    type?: Transaction['type'],
    status?: Transaction['status']
  ) => Transaction[];
  updateTransactionStatus: (id: string, status: Transaction['status']) => Promise<void>;
  exchangeRate: {
    usdt_to_syp: number;
    syp_to_usdt: number;
    fee_percentage: number;
    enabled: boolean;
  };
  updateExchangeRate: (newRates: {
    usdt_to_syp?: number;
    syp_to_usdt?: number;
    fee_percentage?: number;
    enabled?: boolean;
  }) => void;
}

// Sample mock transactions
const mockTransactions: Transaction[] = [
  {
    id: '1',
    type: 'deposit',
    amount: 100,
    currency: 'usdt',
    status: 'completed',
    timestamp: new Date('2023-05-01T10:30:00')
  },
  {
    id: '2',
    type: 'withdrawal',
    amount: 50000,
    currency: 'syp',
    status: 'completed',
    timestamp: new Date('2023-05-05T14:20:00'),
    withdrawalMethod: 'province',
    recipient: {
      name: 'علي محمد',
      phoneNumber: '+963912345678',
      province: 'دمشق'
    }
  },
  {
    id: '3',
    type: 'conversion',
    amount: 50,
    currency: 'usdt',
    targetCurrency: 'syp',
    targetAmount: 250000,
    status: 'completed',
    timestamp: new Date('2023-05-10T09:15:00')
  },
  {
    id: '4',
    type: 'deposit',
    amount: 200,
    currency: 'usdt',
    status: 'pending',
    timestamp: new Date('2023-05-15T16:45:00')
  }
];

const TransactionContext = createContext<TransactionContextType | undefined>(undefined);

export const TransactionProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [transactions, setTransactions] = useState<Transaction[]>(mockTransactions);
  const { user, updateUser } = useAuth();
  const [exchangeRate, setExchangeRate] = useState({
    usdt_to_syp: 5000, // 1 USDT = 5000 SYP
    syp_to_usdt: 0.0002, // 1 SYP = 0.0002 USDT
    fee_percentage: 2,
    enabled: true
  });

  const depositRequest = async (amount: number, walletId: string, screenshot: string) => {
    try {
      if (!user) throw new Error('يجب تسجيل الدخول أولاً');
      
      const newTransaction: Transaction = {
        id: Math.random().toString(36).substring(2, 11),
        type: 'deposit',
        amount,
        currency: 'usdt',
        status: 'pending',
        timestamp: new Date(),
        screenshot
      };
      
      setTransactions([...transactions, newTransaction]);
      toast({
        title: 'تم إرسال طلب الإيداع بنجاح',
        description: 'سيتم مراجعة الطلب من قبل الإدارة',
      });
    } catch (error) {
      if (error instanceof Error) {
        toast({
          title: 'حدث خطأ',
          description: error.message,
          variant: 'destructive',
        });
      }
      throw error;
    }
  };

  const convertCurrency = async (fromCurrency: Currency, toCurrency: Currency, amount: number) => {
    try {
      if (!user) throw new Error('يجب تسجيل الدخول أولاً');
      
      if (!exchangeRate.enabled) {
        throw new Error('خدمة التحويل بين العملات معطلة مؤقتاً');
      }
      
      let targetAmount = 0;
      if (fromCurrency === 'usdt' && toCurrency === 'syp') {
        targetAmount = amount * exchangeRate.usdt_to_syp;
      } else if (fromCurrency === 'syp' && toCurrency === 'usdt') {
        targetAmount = amount * exchangeRate.syp_to_usdt;
      }
      
      // Apply fee
      const fee = (targetAmount * exchangeRate.fee_percentage) / 100;
      targetAmount -= fee;
      
      // Check if user has enough balance
      if (user.balances[fromCurrency] < amount) {
        throw new Error('رصيد غير كافي');
      }
      
      const newTransaction: Transaction = {
        id: Math.random().toString(36).substring(2, 11),
        type: 'conversion',
        amount,
        currency: fromCurrency,
        targetCurrency: toCurrency,
        targetAmount,
        status: 'completed',
        timestamp: new Date()
      };
      
      setTransactions([...transactions, newTransaction]);
      
      // Update user balance
      const updatedBalances = {
        ...user.balances,
        [fromCurrency]: user.balances[fromCurrency] - amount,
        [toCurrency]: user.balances[toCurrency] + targetAmount
      };
      
      updateUser({ balances: updatedBalances });
      
      toast({
        title: 'تم تحويل العملة بنجاح',
        description: `تم تحويل ${amount} ${fromCurrency.toUpperCase()} إلى ${targetAmount.toFixed(2)} ${toCurrency.toUpperCase()}`,
      });
    } catch (error) {
      if (error instanceof Error) {
        toast({
          title: 'حدث خطأ',
          description: error.message,
          variant: 'destructive',
        });
      }
      throw error;
    }
  };

  const withdrawRequest = async (
    method: WithdrawalMethod,
    amount: number,
    currency: Currency,
    recipientData: {
      name?: string;
      phoneNumber?: string;
      province?: string;
      walletId?: string;
    }
  ) => {
    try {
      if (!user) throw new Error('يجب تسجيل الدخول أولاً');
      
      // Check if user has enough balance
      if (user.balances[currency] < amount) {
        throw new Error('رصيد غير كافي');
      }
      
      const newTransaction: Transaction = {
        id: Math.random().toString(36).substring(2, 11),
        type: 'withdrawal',
        amount,
        currency,
        status: method === 'c-wallet' ? 'completed' : 'pending',
        timestamp: new Date(),
        withdrawalMethod: method,
        recipient: recipientData
      };
      
      setTransactions([...transactions, newTransaction]);
      
      // If it's a C-Wallet withdrawal, update balance immediately
      if (method === 'c-wallet') {
        const updatedBalances = {
          ...user.balances,
          [currency]: user.balances[currency] - amount
        };
        updateUser({ balances: updatedBalances });
      }
      
      toast({
        title: 'تم إرسال طلب السحب بنجاح',
        description: method === 'c-wallet' 
          ? 'تم تنفيذ العملية بنجاح' 
          : 'سيتم مراجعة الطلب من قبل الإدارة',
      });
    } catch (error) {
      if (error instanceof Error) {
        toast({
          title: 'حدث خطأ',
          description: error.message,
          variant: 'destructive',
        });
      }
      throw error;
    }
  };

  const getFilteredTransactions = (
    startDate?: Date,
    endDate?: Date,
    type?: Transaction['type'],
    status?: Transaction['status']
  ) => {
    let filteredTransactions = [...transactions];
    
    if (startDate) {
      filteredTransactions = filteredTransactions.filter(t => 
        t.timestamp >= startDate
      );
    }
    
    if (endDate) {
      filteredTransactions = filteredTransactions.filter(t => 
        t.timestamp <= endDate
      );
    }
    
    if (type) {
      filteredTransactions = filteredTransactions.filter(t => 
        t.type === type
      );
    }
    
    if (status) {
      filteredTransactions = filteredTransactions.filter(t => 
        t.status === status
      );
    }
    
    return filteredTransactions;
  };

  const updateTransactionStatus = async (id: string, status: Transaction['status']) => {
    try {
      const transactionIndex = transactions.findIndex(t => t.id === id);
      
      if (transactionIndex === -1) {
        throw new Error('لم يتم العثور على المعاملة');
      }
      
      const transaction = transactions[transactionIndex];
      const updatedTransaction = { ...transaction, status };
      
      const updatedTransactions = [...transactions];
      updatedTransactions[transactionIndex] = updatedTransaction;
      setTransactions(updatedTransactions);
      
      // If approved and it's a deposit or pending withdrawal, update user balance
      if (status === 'completed' && user) {
        if (transaction.type === 'deposit') {
          const updatedBalances = {
            ...user.balances,
            [transaction.currency]: user.balances[transaction.currency] + transaction.amount
          };
          updateUser({ balances: updatedBalances });
        } else if (transaction.type === 'withdrawal' && transaction.status === 'pending') {
          const updatedBalances = {
            ...user.balances,
            [transaction.currency]: user.balances[transaction.currency] - transaction.amount
          };
          updateUser({ balances: updatedBalances });
        }
      }
      
      toast({
        title: 'تم تحديث حالة المعاملة',
        description: `تم تغيير حالة المعاملة إلى ${status === 'completed' ? 'مكتملة' : status === 'rejected' ? 'مرفوضة' : 'قيد الانتظار'}`,
      });
    } catch (error) {
      if (error instanceof Error) {
        toast({
          title: 'حدث خطأ',
          description: error.message,
          variant: 'destructive',
        });
      }
      throw error;
    }
  };

  const updateExchangeRate = (newRates: {
    usdt_to_syp?: number;
    syp_to_usdt?: number;
    fee_percentage?: number;
    enabled?: boolean;
  }) => {
    setExchangeRate({
      ...exchangeRate,
      ...newRates
    });
    
    toast({
      title: 'تم تحديث أسعار الصرف',
      description: 'تم تحديث أسعار الصرف والعمولة بنجاح',
    });
  };

  return (
    <TransactionContext.Provider value={{
      transactions,
      depositRequest,
      convertCurrency,
      withdrawRequest,
      getFilteredTransactions,
      updateTransactionStatus,
      exchangeRate,
      updateExchangeRate
    }}>
      {children}
    </TransactionContext.Provider>
  );
};

export const useTransaction = () => {
  const context = useContext(TransactionContext);
  if (context === undefined) {
    throw new Error('useTransaction must be used within a TransactionProvider');
  }
  return context;
};
