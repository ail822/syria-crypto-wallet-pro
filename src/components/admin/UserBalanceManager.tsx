
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { toast } from '@/hooks/use-toast';
import { useAuth } from '@/context/AuthContext';
import { Currency } from '@/types';
import { Database, Plus, Minus } from 'lucide-react';
import CardSection from '../ui/card-section';
import { useTransaction } from '@/context/TransactionContext';
import { sendTransactionBackup } from '@/utils/telegramBot';

const UserBalanceManager = () => {
  const { user: adminUser } = useAuth();
  const { adjustUserBalance } = useTransaction();
  const [userEmail, setUserEmail] = useState('');
  const [amount, setAmount] = useState('');
  const [currency, setCurrency] = useState<Currency>('usdt');
  const [operation, setOperation] = useState<'add' | 'subtract'>('add');
  const [isLoading, setIsLoading] = useState(false);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!userEmail || !amount || parseFloat(amount) <= 0) {
      toast({
        title: "بيانات غير مكتملة",
        description: "يرجى تعبئة جميع الحقول المطلوبة",
        variant: "destructive",
      });
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Adjust user balance using the context function
      await adjustUserBalance(
        userEmail,
        parseFloat(amount),
        currency,
        operation
      );
      
      // Reset form after successful operation
      setUserEmail('');
      setAmount('');
      
    } catch (error) {
      toast({
        title: "فشلت العملية",
        description: error instanceof Error ? error.message : "حدث خطأ أثناء تعديل الرصيد",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <CardSection title="إدارة أرصدة المستخدمين">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="userEmail">بريد المستخدم الإلكتروني</Label>
            <Input
              id="userEmail"
              type="email"
              value={userEmail}
              onChange={(e) => setUserEmail(e.target.value)}
              placeholder="أدخل البريد الإلكتروني للمستخدم"
              required
              className="bg-[#242C3E] border-[#2A3348] text-white"
            />
          </div>
          
          <div className="space-y-2">
            <Label>نوع العملية</Label>
            <div className="flex space-x-4 rtl:space-x-reverse">
              <div 
                className={`flex flex-1 items-center justify-center gap-2 p-3 rounded-md cursor-pointer border ${
                  operation === 'add' 
                    ? 'border-green-500 bg-green-500/20' 
                    : 'border-[#2A3348] bg-[#242C3E]'
                }`}
                onClick={() => setOperation('add')}
              >
                <Plus className="h-5 w-5" />
                <span>إضافة رصيد</span>
              </div>
              
              <div 
                className={`flex flex-1 items-center justify-center gap-2 p-3 rounded-md cursor-pointer border ${
                  operation === 'subtract' 
                    ? 'border-red-500 bg-red-500/20' 
                    : 'border-[#2A3348] bg-[#242C3E]'
                }`}
                onClick={() => setOperation('subtract')}
              >
                <Minus className="h-5 w-5" />
                <span>خصم رصيد</span>
              </div>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label>اختر العملة</Label>
            <RadioGroup 
              value={currency} 
              onValueChange={(value: Currency) => setCurrency(value)}
              className="flex space-x-4 rtl:space-x-reverse"
            >
              <div className="flex items-center space-x-2 rtl:space-x-reverse">
                <RadioGroupItem value="usdt" id="usdt-currency" />
                <Label htmlFor="usdt-currency" className="cursor-pointer">USDT</Label>
              </div>
              
              <div className="flex items-center space-x-2 rtl:space-x-reverse">
                <RadioGroupItem value="syp" id="syp-currency" />
                <Label htmlFor="syp-currency" className="cursor-pointer">الليرة السورية (SYP)</Label>
              </div>
            </RadioGroup>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="amount">المبلغ</Label>
            <Input
              id="amount"
              type="number"
              step={currency === 'usdt' ? '0.01' : '1'}
              min="0"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder={`أدخل المبلغ ${currency === 'usdt' ? 'USDT' : 'ليرة سورية'}`}
              required
              className="bg-[#242C3E] border-[#2A3348] text-white"
            />
          </div>
        </div>
        
        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? "جاري تنفيذ العملية..." : "تنفيذ العملية"}
        </Button>
        
        <div className="p-3 bg-amber-900/20 rounded-md border border-amber-800/30">
          <p className="text-sm text-amber-300 flex items-center">
            <Database className="h-4 w-4 mr-2" />
            سيتم تسجيل هذه العملية في سجل المعاملات مع اسم المسؤول {adminUser?.name}
          </p>
        </div>
      </form>
    </CardSection>
  );
};

export default UserBalanceManager;
