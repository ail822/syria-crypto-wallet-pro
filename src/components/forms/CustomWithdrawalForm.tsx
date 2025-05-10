
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useTransaction } from '@/context/TransactionContext';
import { useAuth } from '@/context/AuthContext';
import { toast } from '@/hooks/use-toast';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import CardSection from '../ui/card-section';

const CustomWithdrawalForm = () => {
  const { withdrawRequestWithMethod, withdrawalMethods, exchangeRate } = useTransaction();
  const { user } = useAuth();
  const [selectedMethodId, setSelectedMethodId] = useState<string>('');
  const [amount, setAmount] = useState('');
  const [recipientName, setRecipientName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [province, setProvince] = useState('');
  const [walletId, setWalletId] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  // Syrian provinces list
  const provinces = [
    'دمشق',
    'ريف دمشق',
    'حلب',
    'حمص',
    'حماة',
    'اللاذقية',
    'طرطوس',
    'درعا',
    'السويداء',
    'القنيطرة',
    'دير الزور',
    'الحسكة',
    'الرقة',
    'إدلب',
  ];
  
  // Filter only active withdrawal methods
  const activeMethods = withdrawalMethods.filter(method => method.isActive);
  
  // Reset form fields when method changes
  useEffect(() => {
    if (selectedMethodId) {
      setAmount('');
      setRecipientName('');
      setPhoneNumber('');
      setProvince('');
      setWalletId('');
    }
  }, [selectedMethodId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedMethodId) {
      toast({
        title: "اختر طريقة سحب",
        description: "يرجى اختيار طريقة السحب أولاً",
        variant: "destructive",
      });
      return;
    }
    
    if (!amount || parseFloat(amount) <= 0) {
      toast({
        title: "خطأ في المبلغ",
        description: "يرجى إدخال مبلغ صحيح للسحب",
        variant: "destructive",
      });
      return;
    }
    
    const selectedMethod = withdrawalMethods.find(m => m.id === selectedMethodId);
    if (!selectedMethod) return;
    
    // Check minimum withdrawal amount
    const minAmount = selectedMethod.supportedCurrency === 'usdt' 
      ? exchangeRate.min_withdrawal_usdt || 0 
      : exchangeRate.min_withdrawal_syp || 0;
      
    if (parseFloat(amount) < minAmount) {
      toast({
        title: "المبلغ أقل من الحد الأدنى",
        description: `الحد الأدنى للسحب هو ${minAmount} ${selectedMethod.supportedCurrency === 'usdt' ? 'USDT' : 'ليرة سورية'}`,
        variant: "destructive",
      });
      return;
    }
    
    try {
      setIsLoading(true);
      
      // Prepare recipient data based on form fields
      const recipientData: {
        name?: string;
        phoneNumber?: string;
        province?: string;
        walletId?: string;
      } = {};
      
      if (recipientName) recipientData.name = recipientName;
      if (phoneNumber) recipientData.phoneNumber = phoneNumber;
      if (province) recipientData.province = province;
      if (walletId) recipientData.walletId = walletId;
      
      await withdrawRequestWithMethod(
        selectedMethodId,
        parseFloat(amount),
        selectedMethod.supportedCurrency,
        recipientData
      );
      
      // Reset form
      setAmount('');
      setRecipientName('');
      setPhoneNumber('');
      setProvince('');
      setWalletId('');
    } catch (error) {
      console.error("Error making withdrawal request:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const selectedMethod = withdrawalMethods.find(m => m.id === selectedMethodId);
  const methodRequiresName = selectedMethodId && selectedMethodId !== 'with1'; // Assuming with1 is C-Wallet that doesn't need name
  const methodRequiresPhone = selectedMethodId && ['with2', 'with3'].includes(selectedMethodId); // Assuming with2 is Provinces, with3 is MTN
  const methodRequiresProvince = selectedMethodId === 'with2'; // Assuming with2 is Provinces
  const methodRequiresWalletId = selectedMethodId === 'with1'; // Assuming with1 is C-Wallet

  if (activeMethods.length === 0) {
    return (
      <CardSection title="سحب">
        <div className="text-center py-6">
          <p className="text-muted-foreground">لا توجد طرق سحب متاحة حالياً</p>
        </div>
      </CardSection>
    );
  }

  // Get minimum withdrawal amounts from exchange rates
  const minWithdrawalUsdt = exchangeRate.min_withdrawal_usdt || 0;
  const minWithdrawalSyp = exchangeRate.min_withdrawal_syp || 0;

  return (
    <CardSection title="سحب">
      {user && (
        <div className="mb-4 p-3 bg-blue-900/20 rounded-md border border-blue-800/30">
          <div className="flex justify-between items-center text-sm">
            <span>المستخدم: {user.name}</span>
            <span>البريد الإلكتروني: {user.email}</span>
          </div>
          {(user.telegramId || user.phoneNumber) && (
            <div className="flex justify-between items-center text-sm mt-1">
              {user.telegramId && <span>تلغرام: @{user.telegramId}</span>}
              {user.phoneNumber && <span>الهاتف: {user.phoneNumber}</span>}
            </div>
          )}
          <div className="flex justify-between items-center text-sm mt-1">
            <span>رصيد USDT: {user.balances.usdt}</span>
            <span>رصيد ل.س: {user.balances.syp.toLocaleString()}</span>
          </div>
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="withdrawalMethod">اختر طريقة السحب</Label>
          <Select value={selectedMethodId} onValueChange={setSelectedMethodId}>
            <SelectTrigger className="bg-[#242C3E] border-[#2A3348] text-white">
              <SelectValue placeholder="اختر طريقة السحب" />
            </SelectTrigger>
            <SelectContent className="bg-[#242C3E] border-[#2A3348] text-white">
              {activeMethods.map((method) => (
                <SelectItem key={method.id} value={method.id}>
                  {method.name} ({method.supportedCurrency === 'usdt' ? 'USDT' : 'ليرة سورية'})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        {selectedMethod && (
          <>
            {selectedMethod.description && (
              <div className="p-3 bg-blue-900/20 rounded-md border border-blue-800/30">
                <p className="text-sm">{selectedMethod.description}</p>
              </div>
            )}
            
            <div className="space-y-2">
              <Label htmlFor="amount">
                المبلغ ({selectedMethod.supportedCurrency === 'usdt' ? 'USDT' : 'ليرة سورية'})
              </Label>
              <Input
                id="amount"
                type="number"
                step={selectedMethod.supportedCurrency === 'usdt' ? '0.01' : '1'}
                placeholder={`أدخل مبلغ السحب بالـ ${selectedMethod.supportedCurrency === 'usdt' ? 'USDT' : 'ليرة سورية'}`}
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                required
                min={selectedMethod.supportedCurrency === 'usdt' ? minWithdrawalUsdt : minWithdrawalSyp}
                className="bg-[#242C3E] border-[#2A3348] text-white"
              />
              <p className="text-xs text-muted-foreground">
                الحد الأدنى للسحب: {selectedMethod.supportedCurrency === 'usdt' ? minWithdrawalUsdt : minWithdrawalSyp} {selectedMethod.supportedCurrency === 'usdt' ? 'USDT' : 'ل.س'}
              </p>
            </div>
            
            {methodRequiresWalletId && (
              <div className="space-y-2">
                <Label htmlFor="walletId">معرف محفظة المستلم</Label>
                <Input
                  id="walletId"
                  value={walletId}
                  onChange={(e) => setWalletId(e.target.value)}
                  placeholder="أدخل معرف محفظة المستلم"
                  required
                  className="bg-[#242C3E] border-[#2A3348] text-white"
                />
              </div>
            )}
            
            {methodRequiresName && (
              <div className="space-y-2">
                <Label htmlFor="recipientName">اسم المستلم</Label>
                <Input
                  id="recipientName"
                  value={recipientName}
                  onChange={(e) => setRecipientName(e.target.value)}
                  placeholder="أدخل اسم المستلم الكامل"
                  required={methodRequiresName}
                  className="bg-[#242C3E] border-[#2A3348] text-white"
                />
              </div>
            )}
            
            {methodRequiresPhone && (
              <div className="space-y-2">
                <Label htmlFor="phoneNumber">رقم الهاتف</Label>
                <Input
                  id="phoneNumber"
                  type="tel"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  placeholder="مثال: +963912345678"
                  required={methodRequiresPhone}
                  className="bg-[#242C3E] border-[#2A3348] text-white"
                />
              </div>
            )}
            
            {methodRequiresProvince && (
              <div className="space-y-2">
                <Label htmlFor="province">المحافظة</Label>
                <Select value={province} onValueChange={setProvince}>
                  <SelectTrigger className="bg-[#242C3E] border-[#2A3348] text-white">
                    <SelectValue placeholder="اختر المحافظة" />
                  </SelectTrigger>
                  <SelectContent className="bg-[#242C3E] border-[#2A3348] text-white">
                    {provinces.map((p) => (
                      <SelectItem key={p} value={p}>{p}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
            
            {selectedMethod.feePercentage > 0 && (
              <div className="p-3 bg-amber-900/20 rounded-md border border-amber-800/30">
                <p className="text-sm">
                  يتم خصم عمولة بنسبة {selectedMethod.feePercentage}% على عمليات السحب عبر {selectedMethod.name}
                </p>
              </div>
            )}
            
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "جاري إرسال الطلب..." : `تنفيذ ${selectedMethod.requiresApproval ? 'طلب' : ''} السحب`}
            </Button>
            
            {selectedMethod.requiresApproval && (
              <p className="text-sm text-muted-foreground">
                ملاحظة: سيتم مراجعة الطلب من قبل الإدارة قبل التنفيذ
              </p>
            )}
          </>
        )}
      </form>
    </CardSection>
  );
};

export default CustomWithdrawalForm;
