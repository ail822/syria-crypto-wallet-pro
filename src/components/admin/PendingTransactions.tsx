
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from '@/hooks/use-toast';
import { useTransaction } from '@/context/TransactionContext';
import CardSection from '../ui/card-section';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Transaction } from '@/types';

const PendingTransactions = () => {
  const { transactions, updateTransactionStatus } = useTransaction();
  const [isLoading, setIsLoading] = useState(false);
  const [rejectReason, setRejectReason] = useState('');
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  const [showRejectDialog, setShowRejectDialog] = useState(false);

  // Filter only pending transactions
  const pendingTransactions = transactions.filter(t => t.status === 'pending');

  const handleApprove = async (id: string) => {
    try {
      setIsLoading(true);
      await updateTransactionStatus(id, 'completed');
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
      toast({ 
        title: 'تم رفض المعاملة',
        description: selectedTransaction.type === 'withdrawal' 
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
    return new Date(date).toLocaleString('ar-SY');
  };

  const getTransactionTypeLabel = (type: Transaction['type']) => {
    switch (type) {
      case 'deposit': return 'إيداع';
      case 'withdrawal': return 'سحب';
      case 'conversion': return 'تحويل';
      default: return type;
    }
  };

  const getWithdrawalMethodLabel = (method?: string) => {
    switch (method) {
      case 'province': return 'محافظة';
      case 'mtn': return 'MTN';
      case 'syriatel': return 'Syriatel';
      case 'c-wallet': return 'C-Wallet';
      default: return '';
    }
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
            {pendingTransactions.map((transaction) => (
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
                        {transaction.type === 'withdrawal' && transaction.withdrawalMethod && (
                          <span className="mr-1 text-muted-foreground text-sm">
                            ({getWithdrawalMethodLabel(transaction.withdrawalMethod)})
                          </span>
                        )}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
                      {formatDate(transaction.timestamp)}
                    </p>
                  </div>
                  <div className="text-left">
                    <p className="font-medium">
                      {transaction.amount.toLocaleString()} {transaction.currency === 'usdt' ? 'USDT' : 'ل.س'}
                    </p>
                  </div>
                </div>
                
                {/* Additional transaction details based on type */}
                {transaction.type === 'deposit' && transaction.screenshot && (
                  <div className="mt-2">
                    <p className="text-sm font-medium mb-1">لقطة الإثبات:</p>
                    <img 
                      src={transaction.screenshot} 
                      alt="لقطة تحويل" 
                      className="max-h-40 rounded-md border border-[#2A3348]" 
                    />
                  </div>
                )}
                
                {transaction.type === 'withdrawal' && transaction.recipient && (
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
                )}
                
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
            ))}
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

export default PendingTransactions;
