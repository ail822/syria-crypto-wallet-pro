
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from '@/hooks/use-toast';
import { useTransaction } from '@/context/TransactionContext';
import { Currency } from '@/types';
import CardSection from '../ui/card-section';
import { Badge } from '@/components/ui/badge';
import { Edit, Trash } from 'lucide-react';

const CurrencyManager = () => {
  const { exchangeRate, updateExchangeRate } = useTransaction();
  
  const [newCurrency, setNewCurrency] = useState({
    code: '',
    name: '',
    exchangeRate: '',
    minDeposit: '',
    minWithdrawal: ''
  });
  
  // استخدام localStorage لتخزين العملات
  const [supportedCurrencies, setSupportedCurrencies] = useState<Array<{
    code: string, 
    name: string, 
    exchangeRate: number,
    minDeposit?: number,
    minWithdrawal?: number
  }>>([]);
  
  // تحميل العملات المحفوظة عند بدء التشغيل
  useEffect(() => {
    const savedCurrencies = localStorage.getItem('supportedCurrencies');
    
    if (savedCurrencies) {
      setSupportedCurrencies(JSON.parse(savedCurrencies));
    } else {
      // إضافة العملات الافتراضية إذا لم تكن هناك عملات محفوظة
      const defaultCurrencies = [
        { 
          code: 'usdt', 
          name: 'USDT', 
          exchangeRate: 1,
          minDeposit: exchangeRate.min_deposit_usdt,
          minWithdrawal: exchangeRate.min_withdrawal_usdt
        },
        { 
          code: 'syp', 
          name: 'الليرة السورية', 
          exchangeRate: exchangeRate.usdt_to_syp,
          minDeposit: exchangeRate.min_deposit_syp,
          minWithdrawal: exchangeRate.min_withdrawal_syp
        }
      ];
      
      setSupportedCurrencies(defaultCurrencies);
      localStorage.setItem('supportedCurrencies', JSON.stringify(defaultCurrencies));
    }
  }, []);
  
  // حفظ العملات عند تغييرها
  useEffect(() => {
    if (supportedCurrencies.length > 0) {
      localStorage.setItem('supportedCurrencies', JSON.stringify(supportedCurrencies));
      
      // تحديث الحد الأدنى للعملات الأساسية
      const usdt = supportedCurrencies.find(c => c.code === 'usdt');
      const syp = supportedCurrencies.find(c => c.code === 'syp');
      
      if (usdt && syp) {
        updateExchangeRate({
          min_deposit_usdt: usdt.minDeposit || 10,
          min_withdrawal_usdt: usdt.minWithdrawal || 10,
          min_deposit_syp: syp.minDeposit || 100000,
          min_withdrawal_syp: syp.minWithdrawal || 100000
        });
      }
    }
  }, [supportedCurrencies]);
  
  const [isLoading, setIsLoading] = useState(false);
  
  const handleAddCurrency = () => {
    if (!newCurrency.code || !newCurrency.name || !newCurrency.exchangeRate) {
      toast({
        title: "بيانات غير مكتملة",
        description: "يرجى تعبئة جميع بيانات العملة",
        variant: "destructive",
      });
      return;
    }
    
    const currencyCode = newCurrency.code.toLowerCase();
    if (supportedCurrencies.some(c => c.code === currencyCode)) {
      toast({
        title: "العملة موجودة",
        description: "هذه العملة موجودة بالفعل",
        variant: "destructive",
      });
      return;
    }
    
    setIsLoading(true);
    
    // إضافة العملة الجديدة مع الحد الأدنى للإيداع والسحب
    setTimeout(() => {
      const newCurrencyObj = {
        code: currencyCode,
        name: newCurrency.name,
        exchangeRate: parseFloat(newCurrency.exchangeRate),
        minDeposit: newCurrency.minDeposit ? parseFloat(newCurrency.minDeposit) : 0,
        minWithdrawal: newCurrency.minWithdrawal ? parseFloat(newCurrency.minWithdrawal) : 0
      };
      
      const updatedCurrencies = [...supportedCurrencies, newCurrencyObj];
      
      setSupportedCurrencies(updatedCurrencies);
      localStorage.setItem('supportedCurrencies', JSON.stringify(updatedCurrencies));
      
      // Reset form
      setNewCurrency({
        code: '',
        name: '',
        exchangeRate: '',
        minDeposit: '',
        minWithdrawal: ''
      });
      
      setIsLoading(false);
      
      toast({
        title: "تمت الإضافة بنجاح",
        description: `تم إضافة عملة ${newCurrency.name} بنجاح`,
      });
    }, 500);
  };
  
  const handleDeleteCurrency = (code: string) => {
    // Don't allow deletion of base currencies
    if (code === 'usdt' || code === 'syp') {
      toast({
        title: "لا يمكن الحذف",
        description: "لا يمكن حذف العملات الأساسية",
        variant: "destructive",
      });
      return;
    }
    
    const updatedCurrencies = supportedCurrencies.filter(c => c.code !== code);
    setSupportedCurrencies(updatedCurrencies);
    localStorage.setItem('supportedCurrencies', JSON.stringify(updatedCurrencies));
    
    toast({
      title: "تم الحذف",
      description: "تم حذف العملة بنجاح",
    });
  };
  
  return (
    <CardSection title="إدارة العملات">
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-medium mb-3">إضافة عملة جديدة</h3>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="currency_code">رمز العملة</Label>
                <Input
                  id="currency_code"
                  value={newCurrency.code}
                  onChange={(e) => setNewCurrency({...newCurrency, code: e.target.value})}
                  placeholder="USD"
                  className="bg-[#242C3E] border-[#2A3348] text-white dark:bg-[#242C3E] dark:border-[#2A3348] dark:text-white"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="currency_name">اسم العملة</Label>
                <Input
                  id="currency_name"
                  value={newCurrency.name}
                  onChange={(e) => setNewCurrency({...newCurrency, name: e.target.value})}
                  placeholder="دولار أمريكي"
                  className="bg-[#242C3E] border-[#2A3348] text-white dark:bg-[#242C3E] dark:border-[#2A3348] dark:text-white"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="exchange_rate">سعر الصرف (مقابل USDT)</Label>
                <Input
                  id="exchange_rate"
                  type="number"
                  value={newCurrency.exchangeRate}
                  onChange={(e) => setNewCurrency({...newCurrency, exchangeRate: e.target.value})}
                  placeholder="1.0"
                  className="bg-[#242C3E] border-[#2A3348] text-white dark:bg-[#242C3E] dark:border-[#2A3348] dark:text-white"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="min_deposit">الحد الأدنى للإيداع</Label>
                <Input
                  id="min_deposit"
                  type="number"
                  value={newCurrency.minDeposit}
                  onChange={(e) => setNewCurrency({...newCurrency, minDeposit: e.target.value})}
                  placeholder="10"
                  className="bg-[#242C3E] border-[#2A3348] text-white dark:bg-[#242C3E] dark:border-[#2A3348] dark:text-white"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="min_withdrawal">الحد الأدنى للسحب</Label>
                <Input
                  id="min_withdrawal"
                  type="number"
                  value={newCurrency.minWithdrawal}
                  onChange={(e) => setNewCurrency({...newCurrency, minWithdrawal: e.target.value})}
                  placeholder="10"
                  className="bg-[#242C3E] border-[#2A3348] text-white dark:bg-[#242C3E] dark:border-[#2A3348] dark:text-white"
                />
              </div>
            </div>
            
            <Button 
              className="w-full" 
              onClick={handleAddCurrency}
              disabled={isLoading}
            >
              {isLoading ? "جاري الإضافة..." : "إضافة العملة"}
            </Button>
          </div>
        </div>
        
        <div>
          <h3 className="text-lg font-medium mb-3">العملات المدعومة</h3>
          <div className="space-y-3">
            {supportedCurrencies.map((currency) => (
              <div 
                key={currency.code}
                className="p-3 bg-[#1E293B] dark:bg-[#1E293B] border border-[#2A3348] dark:border-[#2A3348] rounded-lg"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-3 rtl:space-x-reverse">
                    <Badge variant="secondary" className="uppercase">{currency.code}</Badge>
                    <span className="font-medium">{currency.name}</span>
                  </div>
                  
                  <div className="flex items-center space-x-2 rtl:space-x-reverse">
                    {currency.code !== 'usdt' && (
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => handleDeleteCurrency(currency.code)}
                      >
                        <Trash className="h-4 w-4 text-destructive" />
                      </Button>
                    )}
                  </div>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-sm">
                  <div className="flex justify-between sm:block">
                    <span className="text-muted-foreground">سعر الصرف:</span>
                    <span>1 USDT = {currency.exchangeRate} {currency.code.toUpperCase()}</span>
                  </div>
                  <div className="flex justify-between sm:block">
                    <span className="text-muted-foreground">الحد الأدنى للإيداع:</span>
                    <span>{currency.minDeposit || 0} {currency.code.toUpperCase()}</span>
                  </div>
                  <div className="flex justify-between sm:block">
                    <span className="text-muted-foreground">الحد الأدنى للسحب:</span>
                    <span>{currency.minWithdrawal || 0} {currency.code.toUpperCase()}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </CardSection>
  );
};

export default CurrencyManager;
