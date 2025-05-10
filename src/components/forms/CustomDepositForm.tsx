
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

const CustomDepositForm = () => {
  const { depositRequestWithMethod, depositMethods, exchangeRate } = useTransaction();
  const { user } = useAuth();
  const [selectedMethodId, setSelectedMethodId] = useState<string>('');
  const [amount, setAmount] = useState('');
  const [transactionId, setTransactionId] = useState('');
  const [screenshot, setScreenshot] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  
  // Filter only active deposit methods
  const activeMethods = depositMethods.filter(method => method.isActive);
  
  // Reset form fields when method changes
  useEffect(() => {
    if (selectedMethodId) {
      setAmount('');
      setTransactionId('');
      setScreenshot(null);
      // Reset file input
      const fileInput = document.getElementById('screenshot') as HTMLInputElement;
      if (fileInput) fileInput.value = '';
    }
  }, [selectedMethodId]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        setScreenshot(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedMethodId) {
      toast({
        title: "اختر طريقة إيداع",
        description: "يرجى اختيار طريقة الإيداع أولاً",
        variant: "destructive",
      });
      return;
    }
    
    if (!amount || parseFloat(amount) <= 0) {
      toast({
        title: "خطأ في المبلغ",
        description: "يرجى إدخال مبلغ صحيح للإيداع",
        variant: "destructive",
      });
      return;
    }
    
    const selectedMethod = depositMethods.find(m => m.id === selectedMethodId);
    if (!selectedMethod) return;
    
    // Check minimum deposit amount
    const minAmount = selectedMethod.acceptedCurrency === 'usdt' 
      ? exchangeRate.min_deposit_usdt || 0 
      : exchangeRate.min_deposit_syp || 0;
      
    if (parseFloat(amount) < minAmount) {
      toast({
        title: "المبلغ أقل من الحد الأدنى",
        description: `الحد الأدنى للإيداع هو ${minAmount} ${selectedMethod.acceptedCurrency === 'usdt' ? 'USDT' : 'ليرة سورية'}`,
        variant: "destructive",
      });
      return;
    }
    
    try {
      setIsLoading(true);
      await depositRequestWithMethod(
        selectedMethodId,
        parseFloat(amount),
        transactionId || undefined,
        screenshot || undefined
      );
      
      // Reset form
      setAmount('');
      setTransactionId('');
      setScreenshot(null);
      // Reset file input
      const fileInput = document.getElementById('screenshot') as HTMLInputElement;
      if (fileInput) fileInput.value = '';
    } catch (error) {
      console.error("Error making deposit request:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const selectedMethod = depositMethods.find(m => m.id === selectedMethodId);

  if (activeMethods.length === 0) {
    return (
      <CardSection title="إيداع">
        <div className="text-center py-6">
          <p className="text-muted-foreground">لا توجد طرق إيداع متاحة حالياً</p>
        </div>
      </CardSection>
    );
  }

  // Get minimum deposit amounts from exchange rates
  const minDepositUsdt = exchangeRate.min_deposit_usdt || 0;
  const minDepositSyp = exchangeRate.min_deposit_syp || 0;

  return (
    <CardSection title="إيداع">
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
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="depositMethod">اختر طريقة الإيداع</Label>
          <Select value={selectedMethodId} onValueChange={setSelectedMethodId}>
            <SelectTrigger className="bg-[#242C3E] border-[#2A3348] text-white">
              <SelectValue placeholder="اختر طريقة الإيداع" />
            </SelectTrigger>
            <SelectContent className="bg-[#242C3E] border-[#2A3348] text-white">
              {activeMethods.map((method) => (
                <SelectItem key={method.id} value={method.id}>
                  {method.name} ({method.acceptedCurrency === 'usdt' ? 'USDT' : 'ليرة سورية'})
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
                المبلغ ({selectedMethod.acceptedCurrency === 'usdt' ? 'USDT' : 'ليرة سورية'})
              </Label>
              <Input
                id="amount"
                type="number"
                step={selectedMethod.acceptedCurrency === 'usdt' ? '0.01' : '1'}
                placeholder={`أدخل مبلغ الإيداع بالـ ${selectedMethod.acceptedCurrency === 'usdt' ? 'USDT' : 'ليرة سورية'}`}
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                required
                min={selectedMethod.acceptedCurrency === 'usdt' ? minDepositUsdt : minDepositSyp}
                className="bg-[#242C3E] border-[#2A3348] text-white"
              />
              <p className="text-xs text-muted-foreground">
                الحد الأدنى للإيداع: {selectedMethod.acceptedCurrency === 'usdt' ? minDepositUsdt : minDepositSyp} {selectedMethod.acceptedCurrency === 'usdt' ? 'USDT' : 'ل.س'}
              </p>
            </div>
            
            {selectedMethod.requiresTransactionId && (
              <div className="space-y-2">
                <Label htmlFor="transactionId">رقم العملية</Label>
                <Input
                  id="transactionId"
                  value={transactionId}
                  onChange={(e) => setTransactionId(e.target.value)}
                  placeholder="أدخل رقم عملية التحويل"
                  required
                  className="bg-[#242C3E] border-[#2A3348] text-white"
                />
              </div>
            )}
            
            {selectedMethod.requiresImage && (
              <div className="space-y-2">
                <Label htmlFor="screenshot">لقطة شاشة للإثبات</Label>
                <Input
                  id="screenshot"
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  required
                  className="bg-[#242C3E] border-[#2A3348] text-white"
                />
                {screenshot && (
                  <div className="mt-2 border border-[#2A3348] rounded-md p-2">
                    <img 
                      src={screenshot} 
                      alt="لقطة شاشة للتحويل" 
                      className="max-h-40 mx-auto rounded"
                    />
                  </div>
                )}
              </div>
            )}
            
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "جاري إرسال الطلب..." : "إرسال طلب الإيداع"}
            </Button>
          </>
        )}
      </form>
    </CardSection>
  );
};

export default CustomDepositForm;
