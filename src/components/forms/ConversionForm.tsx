
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useTransaction } from '@/context/TransactionContext';
import { useAuth } from '@/context/AuthContext';
import { Currency } from '@/types';
import { toast } from '@/hooks/use-toast';
import CardSection from '../ui/card-section';

const ConversionForm = () => {
  const { convertCurrency, exchangeRate } = useTransaction();
  const { user } = useAuth();
  const [fromCurrency, setFromCurrency] = useState<Currency>('usdt');
  const [amount, setAmount] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  // Calculate the estimated result
  const calculateEstimatedResult = () => {
    if (!amount || isNaN(parseFloat(amount))) return '0';
    
    const numAmount = parseFloat(amount);
    const fee = (numAmount * exchangeRate.fee_percentage) / 100;
    
    if (fromCurrency === 'usdt') {
      const syp = (numAmount * exchangeRate.usdt_to_syp) - (exchangeRate.usdt_to_syp * fee);
      return syp.toLocaleString('en-US', { maximumFractionDigits: 0 }) + ' ل.س';
    } else {
      const usdt = (numAmount * exchangeRate.syp_to_usdt) - (exchangeRate.syp_to_usdt * fee);
      return usdt.toFixed(2) + ' USDT';
    }
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!amount || parseFloat(amount) <= 0) {
      toast({
        title: "خطأ في المبلغ",
        description: "يرجى إدخال مبلغ صحيح للتحويل",
        variant: "destructive",
      });
      return;
    }
    
    // Check if conversion is enabled
    if (!exchangeRate.enabled) {
      toast({
        title: "التحويل معطل",
        description: "خدمة التحويل بين العملات معطلة مؤقتاً",
        variant: "destructive",
      });
      return;
    }
    
    try {
      setIsLoading(true);
      const toCurrency = fromCurrency === 'usdt' ? 'syp' : 'usdt';
      await convertCurrency(fromCurrency, toCurrency, parseFloat(amount));
      setAmount('');
    } catch (error) {
      console.error("Error converting currency:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <CardSection title="تحويل العملات">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label>اختر العملة المصدر</Label>
          <RadioGroup 
            value={fromCurrency} 
            onValueChange={(value) => setFromCurrency(value as Currency)}
            className="flex gap-4"
          >
            <div className="flex items-center gap-2">
              <RadioGroupItem value="usdt" id="usdt" />
              <Label htmlFor="usdt" className="font-medium">USDT</Label>
            </div>
            <div className="flex items-center gap-2">
              <RadioGroupItem value="syp" id="syp" />
              <Label htmlFor="syp" className="font-medium">ليرة سورية</Label>
            </div>
          </RadioGroup>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="amount">
            المبلغ ({fromCurrency === 'usdt' ? 'USDT' : 'ل.س'})
          </Label>
          <Input
            id="amount"
            type="number"
            step={fromCurrency === 'usdt' ? '0.01' : '1'}
            placeholder={`أدخل المبلغ بالـ ${fromCurrency === 'usdt' ? 'USDT' : 'ليرة السورية'}`}
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            required
            className="bg-[#242C3E] border-[#2A3348] text-white"
          />
        </div>
        
        <div className="space-y-1">
          <Label>التقديرات</Label>
          <div className="bg-[#242C3E] p-3 rounded-md border border-[#2A3348]">
            <div className="flex justify-between items-center mb-1">
              <span className="text-muted-foreground text-sm">
                {fromCurrency === 'usdt' ? '1 USDT =' : '1 SYP ='}
              </span>
              <span className="text-white">
                {fromCurrency === 'usdt' 
                  ? `${exchangeRate.usdt_to_syp.toLocaleString()} ل.س` 
                  : `${exchangeRate.syp_to_usdt.toFixed(6)} USDT`}
              </span>
            </div>
            <div className="flex justify-between items-center mb-1">
              <span className="text-muted-foreground text-sm">العمولة:</span>
              <span className="text-white">{exchangeRate.fee_percentage}%</span>
            </div>
            <div className="flex justify-between items-center font-medium pt-2 border-t border-[#2A3348]">
              <span>المبلغ المقدر:</span>
              <span className="text-primary">{calculateEstimatedResult()}</span>
            </div>
          </div>
        </div>
        
        <Button 
          type="submit" 
          className="w-full" 
          disabled={isLoading || !exchangeRate.enabled}
        >
          {isLoading 
            ? "جاري تنفيذ التحويل..." 
            : !exchangeRate.enabled 
              ? "التحويل معطل مؤقتاً" 
              : "تحويل العملة"}
        </Button>
        
        {!exchangeRate.enabled && (
          <p className="text-sm text-destructive text-center">
            خدمة التحويل بين العملات معطلة مؤقتاً
          </p>
        )}
      </form>
    </CardSection>
  );
};

export default ConversionForm;
