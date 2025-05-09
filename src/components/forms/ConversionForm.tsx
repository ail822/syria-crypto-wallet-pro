
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useTransaction } from '@/context/TransactionContext';
import { useAuth } from '@/context/AuthContext';
import { Currency } from '@/types';
import { toast } from '@/hooks/use-toast';
import CardSection from '../ui/card-section';

const ConversionForm = () => {
  const { convertCurrency, exchangeRate } = useTransaction();
  const { user } = useAuth();
  const [fromCurrency, setFromCurrency] = useState<Currency>('usdt');
  const [toCurrency, setToCurrency] = useState<Currency>('syp');
  const [amount, setAmount] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const [supportedCurrencies, setSupportedCurrencies] = useState<Array<{code: string, name: string, exchangeRate: number}>>([]);
  
  // تحميل العملات المدعومة
  useEffect(() => {
    const savedCurrencies = localStorage.getItem('supportedCurrencies');
    if (savedCurrencies) {
      setSupportedCurrencies(JSON.parse(savedCurrencies));
    } else {
      setSupportedCurrencies([
        { code: 'usdt', name: 'USDT', exchangeRate: 1 },
        { code: 'syp', name: 'الليرة السورية', exchangeRate: exchangeRate.usdt_to_syp }
      ]);
    }
  }, []);

  // حساب سعر الصرف بين أي عملتين
  const getExchangeRate = (from: string, to: string) => {
    // البحث عن العملات في المصفوفة
    const fromCurrencyObj = supportedCurrencies.find(c => c.code === from);
    const toCurrencyObj = supportedCurrencies.find(c => c.code === to);
    
    if (!fromCurrencyObj || !toCurrencyObj) return 0;
    
    // حساب سعر الصرف نسبة إلى USDT
    return toCurrencyObj.exchangeRate / fromCurrencyObj.exchangeRate;
  };
  
  // Calculate the estimated result
  const calculateEstimatedResult = () => {
    if (!amount || isNaN(parseFloat(amount))) return '0';
    
    const numAmount = parseFloat(amount);
    const rate = getExchangeRate(fromCurrency, toCurrency);
    const convertedAmount = numAmount * rate;
    const fee = (convertedAmount * exchangeRate.fee_percentage) / 100;
    const finalAmount = convertedAmount - fee;
    
    return finalAmount.toLocaleString('en-US', { maximumFractionDigits: 2 }) + ` ${toCurrency.toUpperCase()}`;
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
    
    if (fromCurrency === toCurrency) {
      toast({
        title: "خطأ في اختيار العملات",
        description: "لا يمكن التحويل بين نفس العملة",
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
      await convertCurrency(fromCurrency as Currency, toCurrency as Currency, parseFloat(amount));
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="fromCurrency">العملة المصدر</Label>
            <Select 
              value={fromCurrency} 
              onValueChange={(value) => setFromCurrency(value as Currency)}
            >
              <SelectTrigger className="bg-[#242C3E] border-[#2A3348] text-white">
                <SelectValue placeholder="اختر العملة المصدر" />
              </SelectTrigger>
              <SelectContent>
                {supportedCurrencies.map((currency) => (
                  <SelectItem key={`from-${currency.code}`} value={currency.code}>
                    {currency.name} ({currency.code.toUpperCase()})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="toCurrency">العملة الهدف</Label>
            <Select 
              value={toCurrency} 
              onValueChange={(value) => setToCurrency(value as Currency)}
            >
              <SelectTrigger className="bg-[#242C3E] border-[#2A3348] text-white">
                <SelectValue placeholder="اختر العملة الهدف" />
              </SelectTrigger>
              <SelectContent>
                {supportedCurrencies.map((currency) => (
                  <SelectItem key={`to-${currency.code}`} value={currency.code}>
                    {currency.name} ({currency.code.toUpperCase()})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="amount">
            المبلغ ({fromCurrency.toUpperCase()})
          </Label>
          <Input
            id="amount"
            type="number"
            step="0.01"
            placeholder={`أدخل المبلغ بالـ ${fromCurrency.toUpperCase()}`}
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
                {`1 ${fromCurrency.toUpperCase()} =`}
              </span>
              <span className="text-white">
                {getExchangeRate(fromCurrency, toCurrency).toFixed(4)} {toCurrency.toUpperCase()}
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
          disabled={isLoading || !exchangeRate.enabled || !amount || fromCurrency === toCurrency}
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
