
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from '@/hooks/use-toast';
import { useTransaction } from '@/context/TransactionContext';
import CardSection from '../ui/card-section';
import { formatDistanceToNow } from 'date-fns';
import { ar } from 'date-fns/locale';
import { Mail, User, MessageCircle, Phone, Gamepad2 } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Transaction, User as UserType } from '@/types';
import { useAuth } from '@/context/AuthContext';
import { sendTransactionBackup } from '@/utils/telegramBot';

const PendingTransactions = () => {
  const { transactions, updateTransactionStatus, depositMethods, withdrawalMethods } = useTransaction();
  const [isLoading, setIsLoading] = useState(false);
  const [rejectReason, setRejectReason] = useState('');
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  const [showRejectDialog, setShowRejectDialog] = useState(false);

  // Filter only pending transactions
  const pendingTransactions = transactions.filter(t => t.status === 'pending');

  // Safe formatting function to prevent null errors
  const formatNumber = (value: number | null | undefined) => {
    if (value === null || value === undefined) return '0';
    
    // Ensure the value is a number
    const numValue = typeof value === 'number' ? value : parseFloat(String(value));
    
    // Handle NaN case
    if (isNaN(numValue)) return '0';
    
    return numValue.toLocaleString('en-US');
  };

  const handleApprove = async (id: string) => {
    try {
      setIsLoading(true);
      await updateTransactionStatus(id, 'completed');
      
      // Get the transaction that was just approved
      const transaction = transactions.find(t => t.id === id);
      if (transaction) {
        // Find the user associated with this transaction
        const userInfo = findUserInfo(transaction.userId);
        
        // Send transaction backup to Telegram
        if (userInfo) {
          await sendTransactionBackup(transaction, userInfo);
        }
      }
      
      toast({ title: 'تم الموافقة على المعاملة بنجاح' });
    } catch (error) {
      toast({ 
        title: 'حدث خطأ',
        description: 'لم يتم تحديث حالة المعاملة',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const openRejectDialog = (transaction: Transaction) => {
    setSelectedTransaction(transaction);
    setRejectReason('');
    setShowRejectDialog(true);
  };

  const handleReject = async () => {
    if (!selectedTransaction) return;
    
    try {
      setIsLoading(true);
      await updateTransactionStatus(selectedTransaction.id, 'rejected');
      
      // Get the transaction that was just rejected
      const transaction = transactions.find(t => t.id === selectedTransaction.id);
      if (transaction) {
        // Find the user associated with this transaction
        const userInfo = findUserInfo(transaction.userId);
        
        // Send transaction backup to Telegram with rejected status
        if (userInfo) {
          await sendTransactionBackup({...transaction, status: 'rejected'}, userInfo);
        }
      }
      
      toast({ 
        title: 'تم رفض المعاملة',
        description: selectedTransaction.type === 'withdrawal' || selectedTransaction.type === 'game_recharge'
          ? 'تم إرجاع المبلغ إلى رصيد المستخدم' 
          : undefined 
      });
      setShowRejectDialog(false);
    } catch (error) {
      toast({ 
        title: 'حدث خطأ',
        description: 'لم يتم تحديث حالة المعاملة',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (date: Date) => {
    return formatDistanceToNow(new Date(date), { addSuffix: true, locale: ar });
  };

  const getTransactionTypeLabel = (type: Transaction['type']) => {
    switch (type) {
      case 'deposit': return 'إيداع';
      case 'withdrawal': return 'سحب';
      case 'conversion': return 'تحويل';
      case 'game_recharge': return 'شحن ألعاب';
      default: return type;
    }
  };

  // Get the name of the deposit method by ID
  const getDepositMethodName = (methodId?: string) => {
    if (!methodId) return '';
    const method = depositMethods.find(m => m.id === methodId);
    return method?.name || '';
  };

  // Get the name of the withdrawal method by ID
  const getWithdrawalMethodName = (methodId?: string) => {
    if (!methodId) return '';
    const method = withdrawalMethods.find(m => m.id === methodId);
    return method?.name || '';
  };

  // Get method name based on transaction type and ID
  const getMethodName = (transaction: Transaction) => {
    if (transaction.type === 'deposit' && transaction.depositMethodId) {
      return getDepositMethodName(transaction.depositMethodId);
    } else if (transaction.type === 'withdrawal' && transaction.withdrawalMethodId) {
      return getWithdrawalMethodName(transaction.withdrawalMethodId);
    } else if (transaction.type === 'withdrawal' && transaction.withdrawalMethod) {
      // Legacy method name
      switch (transaction.withdrawalMethod) {
        case 'province': return 'محافظة';
        case 'mtn': return 'MTN';
        case 'syriatel': return 'Syriatel';
        case 'c-wallet': return 'C-Wallet';
        default: return transaction.withdrawalMethod;
      }
    } else if (transaction.type === 'game_recharge') {
      return transaction.gameName || 'شحن لعبة';
    }
    return '';
  };

  // Improved helper function to display user information
  const UserInfoCard = ({ userInfo }: { userInfo: UserType | null }) => {
    if (!userInfo) return null;
    
    return (
      <div className="p-3 bg-[#242C3E] rounded-md text-sm space-y-2">
        <h4 className="font-medium text-white/80 mb-2">بيانات المستخدم</h4>
        
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <User className="h-4 w-4 text-white/60" />
            <span>{userInfo.name}</span>
          </div>
          
          <div className="flex items-center gap-2">
            <Mail className="h-4 w-4 text-white/60" />
            <span>{userInfo.email}</span>
          </div>
          
          {userInfo.telegramId && (
            <div className="flex items-center gap-2">
              <MessageCircle className="h-4 w-4 text-white/60" />
              <span>@{userInfo.telegramId}</span>
            </div>
          )}
          
          {userInfo.phoneNumber && (
            <div className="flex items-center gap-2">
              <Phone className="h-4 w-4 text-white/60" />
              <span>{userInfo.phoneNumber}</span>
            </div>
          )}
        </div>
      </div>
    );
  };

  // Function to render transaction-specific details based on type
  const renderTransactionDetails = (transaction: Transaction) => {
    if (transaction.type === 'deposit' && transaction.screenshot) {
      return (
        <div className="mt-2">
          <p className="text-sm font-medium mb-1">لقطة الإثبات:</p>
          <img 
            src={transaction.screenshot} 
            alt="لقطة تحويل" 
            className="max-h-40 rounded-md border border-[#2A3348]" 
          />
        </div>
      );
    }
    
    if (transaction.type === 'withdrawal' && transaction.recipient) {
      return (
        <div className="p-2 bg-[#242C3E] rounded-md text-sm space-y-1">
          {transaction.recipient.name && (
            <p>الاسم: {transaction.recipient.name}</p>
          )}
          {transaction.recipient.phoneNumber && (
            <p>الهاتف: {transaction.recipient.phoneNumber}</p>
          )}
          {transaction.recipient.province && (
            <p>المحافظة: {transaction.recipient.province}</p>
          )}
          {transaction.recipient.walletId && (
            <p>معرف المحفظة: {transaction.recipient.walletId}</p>
          )}
        </div>
      );
    }
    
    if (transaction.type === 'game_recharge') {
      return (
        <div className="p-2 bg-[#242C3E] rounded-md text-sm space-y-1">
          <div className="flex items-center gap-2">
            <Gamepad2 className="h-4 w-4 text-white/60" />
            <p>اللعبة: {transaction.gameName}</p>
          </div>
          {transaction.accountId && (
            <p>معرف الحساب: {transaction.accountId}</p>
          )}
        </div>
      );
    }
    
    return null;
  };

  return (
    <>
      <CardSection title="المعاملات المعلقة">
        {pendingTransactions.length === 0 ? (
          <div className="text-center py-6">
            <p className="text-muted-foreground">لا توجد معاملات معلقة</p>
          </div>
        ) : (
          <div className="space-y-4">
            {pendingTransactions.map((transaction) => {
              const userInfo = findUserInfo(transaction.userId);
              const methodName = getMethodName(transaction);
              
              return (
                <div 
                  key={transaction.id} 
                  className="p-4 bg-[#1E293B] border border-[#2A3348] rounded-lg space-y-3"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="inline-block w-2 h-2 rounded-full bg-yellow-400"></span>
                        <span className="font-medium">
                          {getTransactionTypeLabel(transaction.type)}
                          {methodName && (
                            <Badge variant="outline" className="mr-2">
                              {methodName}
                            </Badge>
                          )}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">
                        {formatDate(transaction.timestamp)}
                      </p>
                    </div>
                    <div className="text-left">
                      <p className="font-medium">
                        {formatNumber(transaction.amount)} {transaction.currency.toUpperCase()}
                      </p>
                    </div>
                  </div>
                  
                  {/* User information - Now always displayed prominently */}
                  <UserInfoCard userInfo={userInfo} />
                  
                  {/* Transaction-specific details */}
                  {renderTransactionDetails(transaction)}
                  
                  <div className="flex gap-2 mt-4">
                    <Button 
                      className="flex-1" 
                      onClick={() => handleApprove(transaction.id)}
                      disabled={isLoading}
                    >
                      موافقة
                    </Button>
                    <Button 
                      variant="outline"
                      className="flex-1 border-destructive/50 text-destructive hover:bg-destructive/10" 
                      onClick={() => openRejectDialog(transaction)}
                      disabled={isLoading}
                    >
                      رفض
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </CardSection>
      
      {/* Reject Dialog */}
      <Dialog open={showRejectDialog} onOpenChange={setShowRejectDialog}>
        <DialogContent className="bg-[#1A1E2C] border-[#2A3348]">
          <DialogHeader>
            <DialogTitle>رفض المعاملة</DialogTitle>
            <DialogDescription>
              أدخل سبب رفض هذه المعاملة. سيتم إبلاغ المستخدم بهذا السبب.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <Input
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              placeholder="سبب الرفض"
              className="bg-[#242C3E] border-[#2A3348] text-white"
            />
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowRejectDialog(false)}>
              إلغاء
            </Button>
            <Button 
              variant="destructive" 
              onClick={handleReject}
              disabled={isLoading}
            >
              رفض المعاملة
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

// Helper function to find user information based on userId
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
  
  // Also look in registeredUsers
  try {
    const registeredUsersStr = localStorage.getItem('registeredUsers');
    if (registeredUsersStr) {
      const registeredUsers = JSON.parse(registeredUsersStr);
      if (Array.isArray(registeredUsers)) {
        registeredUsers.forEach(user => {
          if (!allUsers.some(u => u.id === user.id)) {
            allUsers.push(user);
          }
        });
      }
    }
  } catch (e) {
    // Skip invalid JSON
  }
  
  return allUsers.find(user => user.id === userId) || null;
};

export default PendingTransactions;
