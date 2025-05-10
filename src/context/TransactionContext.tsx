import React, { createContext, useState, useContext, ReactNode } from 'react';
import { Transaction, Currency, WithdrawalMethod, DepositMethod, WithdrawalMethodType, ExchangeRate } from '@/types';
import { useAuth } from './AuthContext';
import { toast } from '@/hooks/use-toast';

interface TransactionContextType {
  transactions: Transaction[];
  depositRequest: (amount: number, walletId: string, screenshot: string) => Promise<void>;
  depositRequestWithMethod: (
    methodId: string,
    amount: number,
    transactionId?: string,
    screenshot?: string
  ) => Promise<void>;
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
  withdrawRequestWithMethod: (
    methodId: string,
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
  exchangeRate: ExchangeRate;
  updateExchangeRate: (newRates: Partial<ExchangeRate>) => void;
  depositMethods: DepositMethod[];
  addDepositMethod: (method: Omit<DepositMethod, 'id' | 'createdAt'>) => Promise<void>;
  updateDepositMethodStatus: (id: string, isActive: boolean) => Promise<void>;
  withdrawalMethods: WithdrawalMethodType[];
  addWithdrawalMethod: (method: Omit<WithdrawalMethodType, 'id' | 'createdAt'>) => Promise<void>;
  updateWithdrawalMethodStatus: (id: string, isActive: boolean) => Promise<void>;
  adjustUserBalance: (email: string, amount: number, currency: Currency, operation: 'add' | 'subtract') => Promise<void>;
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

// Sample mock deposit methods
const mockDepositMethods: DepositMethod[] = [
  {
    id: 'dep1',
    name: 'C-Wallet',
    description: 'إيداع مباشر عبر محفظة C-Wallet',
    acceptedCurrency: 'usdt',
    isActive: true,
    requiresImage: true,
    requiresTransactionId: false,
    createdAt: new Date('2023-01-01')
  },
  {
    id: 'dep2',
    name: 'حوالة بنكية',
    description: 'إيداع عبر التحويل البنكي',
    acceptedCurrency: 'syp',
    isActive: true,
    requiresImage: true,
    requiresTransactionId: true,
    createdAt: new Date('2023-01-05')
  }
];

// Sample mock withdrawal methods
const mockWithdrawalMethods: WithdrawalMethodType[] = [
  {
    id: 'with1',
    name: 'C-Wallet',
    description: 'سحب مباشر إلى محفظة C-Wallet',
    supportedCurrency: 'usdt',
    isActive: true,
    requiresApproval: false,
    feePercentage: 1,
    createdAt: new Date('2023-01-01')
  },
  {
    id: 'with2',
    name: 'المحافظات',
    description: 'سحب نقدي في المحافظات السورية',
    supportedCurrency: 'syp',
    isActive: true,
    requiresApproval: true,
    feePercentage: 2,
    createdAt: new Date('2023-01-02')
  },
  {
    id: 'with3',
    name: 'MTN Cash',
    description: 'سحب عبر خدمة MTN Cash',
    supportedCurrency: 'syp',
    isActive: true,
    requiresApproval: true,
    feePercentage: 1.5,
    createdAt: new Date('2023-01-03')
  }
];

const TransactionContext = createContext<TransactionContextType | undefined>(undefined);

export const TransactionProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [transactions, setTransactions] = useState<Transaction[]>(mockTransactions);
  const [depositMethods, setDepositMethods] = useState<DepositMethod[]>(mockDepositMethods);
  const [withdrawalMethods, setWithdrawalMethods] = useState<WithdrawalMethodType[]>(mockWithdrawalMethods);
  const { user, updateUser } = useAuth();
  const [exchangeRate, setExchangeRate] = useState<ExchangeRate>({
    usdt_to_syp: 5000, // 1 USDT = 5000 SYP
    syp_to_usdt: 0.0002, // 1 SYP = 0.0002 USDT
    fee_percentage: 2,
    enabled: true,
    min_deposit_usdt: 10,
    min_deposit_syp: 100000,
    min_withdrawal_usdt: 10,
    min_withdrawal_syp: 100000
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
        screenshot,
        userId: user.id  // Add user ID to track ownership
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

  const depositRequestWithMethod = async (
    methodId: string,
    amount: number,
    transactionId?: string,
    screenshot?: string
  ) => {
    try {
      if (!user) throw new Error('يجب تسجيل الدخول أولاً');
      
      const method = depositMethods.find(m => m.id === methodId);
      if (!method) throw new Error('طريقة الإيداع غير موجودة');
      
      if (!method.isActive) throw new Error('طريقة الإيداع غير متاحة حالياً');
      
      if (method.requiresTransactionId && !transactionId) {
        throw new Error('رقم العملية مطلوب');
      }
      
      if (method.requiresImage && !screenshot) {
        throw new Error('صورة إثبات التحويل مطلوبة');
      }
      
      const newTransaction: Transaction = {
        id: Math.random().toString(36).substring(2, 11),
        type: 'deposit',
        amount,
        currency: method.acceptedCurrency,
        status: 'pending',
        timestamp: new Date(),
        depositMethodId: methodId,
        transactionId,
        screenshot,
        userId: user.id // Add user ID to track ownership
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
      
      // Load supported currencies from localStorage
      let supportedCurrencies = [
        { code: 'usdt', exchangeRate: 1 },
        { code: 'syp', exchangeRate: exchangeRate.usdt_to_syp }
      ];
      
      try {
        const savedCurrencies = localStorage.getItem('supportedCurrencies');
        if (savedCurrencies) {
          const parsedCurrencies = JSON.parse(savedCurrencies);
          supportedCurrencies = parsedCurrencies.map((c: any) => ({
            code: c.code,
            exchangeRate: c.exchangeRate
          }));
        }
      } catch (e) {
        console.error("Error loading currencies:", e);
      }
      
      // Find exchange rates for the currencies
      const fromCurrencyRate = supportedCurrencies.find(c => c.code === fromCurrency)?.exchangeRate || 1;
      const toCurrencyRate = supportedCurrencies.find(c => c.code === toCurrency)?.exchangeRate || 1;
      
      // Calculate exchange rate between the two currencies
      const rate = toCurrencyRate / fromCurrencyRate;
      
      let targetAmount = amount * rate;
      
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
      const updatedBalances = { ...user.balances };
      
      // Ensure the currencies exist in the user balance
      if (updatedBalances[fromCurrency] === undefined) {
        updatedBalances[fromCurrency] = 0;
      }
      
      if (updatedBalances[toCurrency] === undefined) {
        updatedBalances[toCurrency] = 0;
      }
      
      updatedBalances[fromCurrency] -= amount;
      updatedBalances[toCurrency] += targetAmount;
      
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
      
      // For all withdrawal methods, deduct the balance immediately upon request
      // This is a change from the original behavior where only c-wallet was immediate
      const updatedBalances = {
        ...user.balances,
        [currency]: user.balances[currency] - amount
      };
      updateUser({ balances: updatedBalances });
      
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
      
      toast({
        title: 'تم إرسال طلب السحب بنجاح',
        description: method === 'c-wallet' 
          ? 'تم تنفيذ العملية بنجاح' 
          : 'تم خصم المبلغ من رصيدك وسيتم مراجعة ال���لب من قبل الإدارة',
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

  const withdrawRequestWithMethod = async (
    methodId: string,
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
      
      const method = withdrawalMethods.find(m => m.id === methodId);
      if (!method) throw new Error('طريقة السحب غير موجودة');
      
      if (!method.isActive) throw new Error('طريقة السحب غير متاحة حالياً');
      
      // Check if user has enough balance
      if (user.balances[currency] < amount) {
        throw new Error('رصيد غير كافي');
      }
      
      // For all withdrawal methods, deduct the balance immediately upon request
      const updatedBalances = {
        ...user.balances,
        [currency]: user.balances[currency] - amount
      };
      updateUser({ balances: updatedBalances });
      
      const newTransaction: Transaction = {
        id: Math.random().toString(36).substring(2, 11),
        type: 'withdrawal',
        amount,
        currency,
        status: method.requiresApproval ? 'pending' : 'completed',
        timestamp: new Date(),
        withdrawalMethodId: methodId,
        recipient: recipientData
      };
      
      setTransactions([...transactions, newTransaction]);
      
      toast({
        title: 'تم إرسال طلب السحب بنجاح',
        description: method.requiresApproval 
          ? 'تم خصم المبلغ من رصيدك وسيتم مراجعة الطلب من قبل الإدارة' 
          : 'تم تنفيذ العملية بنجاح',
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
      
      // Handle deposit approval - add amount to user balance
      if (status === 'completed' && transaction.type === 'deposit') {
        // In a real app, find the user by userId stored in the transaction
        // For now, we'll update the current user if they're the owner
        if (user && transaction.userId === user.id) {
          const updatedBalances = {
            ...user.balances,
            [transaction.currency]: user.balances[transaction.currency] + transaction.amount
          };
          updateUser({ balances: updatedBalances });
          
          toast({
            title: 'تمت الموافقة على الإيداع',
            description: `تمت إضافة ${transaction.amount} ${transaction.currency.toUpperCase()} إلى رصيدك`,
          });
        }
      } 
      // Handle withdrawal rejection - return funds to user
      else if (status === 'rejected' && transaction.type === 'withdrawal') {
        if (user && transaction.userId === user.id) {
          const updatedBalances = {
            ...user.balances,
            [transaction.currency]: user.balances[transaction.currency] + transaction.amount
          };
          updateUser({ balances: updatedBalances });
          
          toast({
            title: 'تم رفض طلب السحب',
            description: `تمت ��عادة ${transaction.amount} ${transaction.currency.toUpperCase()} إلى رصيدك`,
          });
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

  const updateExchangeRate = (newRates: Partial<ExchangeRate>) => {
    setExchangeRate({
      ...exchangeRate,
      ...newRates
    });
    
    toast({
      title: 'تم تحديث أسعار الصرف',
      description: 'تم تحديث أسعار الصرف والعمولة بنجاح',
    });
  };

  // Deposit methods management
  const addDepositMethod = async (method: Omit<DepositMethod, 'id' | 'createdAt'>) => {
    try {
      const newMethod: DepositMethod = {
        ...method,
        id: Math.random().toString(36).substring(2, 9),
        createdAt: new Date(),
      };
      
      setDepositMethods([...depositMethods, newMethod]);
      
      toast({
        title: 'تمت الإضافة بنجاح',
        description: 'تم إضافة طريقة الإيداع الجديدة',
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
  
  const updateDepositMethodStatus = async (id: string, isActive: boolean) => {
    try {
      const updatedMethods = depositMethods.map(method => 
        method.id === id ? { ...method, isActive } : method
      );
      
      setDepositMethods(updatedMethods);
      
      toast({
        title: 'تم تحديث الحالة',
        description: `تم ${isActive ? 'تفعيل' : 'تعطيل'} طريقة الإيداع بنجاح`,
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
  
  // Withdrawal methods management
  const addWithdrawalMethod = async (method: Omit<WithdrawalMethodType, 'id' | 'createdAt'>) => {
    try {
      const newMethod: WithdrawalMethodType = {
        ...method,
        id: Math.random().toString(36).substring(2, 9),
        createdAt: new Date(),
      };
      
      setWithdrawalMethods([...withdrawalMethods, newMethod]);
      
      toast({
        title: 'تمت الإضافة بن��اح',
        description: 'تم إضافة طريقة السحب الجديدة',
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
  
  const updateWithdrawalMethodStatus = async (id: string, isActive: boolean) => {
    try {
      const updatedMethods = withdrawalMethods.map(method => 
        method.id === id ? { ...method, isActive } : method
      );
      
      setWithdrawalMethods(updatedMethods);
      
      toast({
        title: 'تم تحديث الحالة',
        description: `تم ${isActive ? 'تفعيل' : 'تعطيل'} طريقة السحب بنجاح`,
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

  // New method for admin to adjust user balance
  const adjustUserBalance = async (email: string, amount: number, currency: Currency, operation: 'add' | 'subtract') => {
    try {
      // In a real app, this would involve a database lookup
      // For demo, we'll update the current user if emails match
      if (user && user.email === email) {
        const currentBalance = user.balances[currency];
        let newBalance = currentBalance;
        
        if (operation === 'add') {
          newBalance = currentBalance + amount;
        } else {
          // Check if there's enough balance for subtraction
          if (currentBalance < amount) {
            throw new Error('رصيد المستخدم غير كافي للخصم');
          }
          newBalance = currentBalance - amount;
        }
        
        const updatedBalances = {
          ...user.balances,
          [currency]: newBalance
        };
        
        updateUser({ balances: updatedBalances });
        
        // Create a transaction record for the adjustment
        const newTransaction: Transaction = {
          id: Math.random().toString(36).substring(2, 11),
          type: operation === 'add' ? 'deposit' : 'withdrawal',
          amount,
          currency,
          status: 'completed',
          timestamp: new Date(),
        };
        
        setTransactions([...transactions, newTransaction]);
        
        toast({
          title: 'تم تعديل الرصيد بنجاح',
          description: `تم ${operation === 'add' ? 'إضافة' : 'خصم'} ${amount} ${currency.toUpperCase()} من حساب ${email}`,
        });
      } else {
        // In a real app, we would look up the user
        // For demo, we'll simulate success
        toast({
          title: 'تم تعديل الرصيد بنجاح',
          description: `تم ${operation === 'add' ? 'إضافة' : 'خصم'} ${amount} ${currency.toUpperCase()} من حساب ${email}`,
        });
      }
      
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

  return (
    <TransactionContext.Provider value={{
      transactions,
      depositRequest,
      depositRequestWithMethod,
      convertCurrency,
      withdrawRequest,
      withdrawRequestWithMethod,
      getFilteredTransactions,
      updateTransactionStatus,
      exchangeRate,
      updateExchangeRate,
      depositMethods,
      addDepositMethod,
      updateDepositMethodStatus,
      withdrawalMethods,
      addWithdrawalMethod,
      updateWithdrawalMethodStatus,
      adjustUserBalance
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
