
import React, { useState } from 'react';
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
  });
  
  const [supportedCurrencies, setSupportedCurrencies] = useState<Array<{code: string, name: string, exchangeRate: number}>>([
    { code: 'usdt', name: 'USDT', exchangeRate: 1 },
    { code: 'syp', name: 'الليرة السورية', exchangeRate: exchangeRate.usdt_to_syp }
  ]);
  
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
    
    // Simulate API call
    setTimeout(() => {
      setSupportedCurrencies([
        ...supportedCurrencies,
        {
          code: currencyCode,
          name: newCurrency.name,
          exchangeRate: parseFloat(newCurrency.exchangeRate)
        }
      ]);
      
      // Reset form
      setNewCurrency({
        code: '',
        name: '',
        exchangeRate: '',
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
    
    setSupportedCurrencies(supportedCurrencies.filter(c => c.code !== code));
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
                className="p-3 bg-[#1E293B] dark:bg-[#1E293B] border border-[#2A3348] dark:border-[#2A3348] rounded-lg flex items-center justify-between"
              >
                <div className="flex items-center space-x-3 rtl:space-x-reverse">
                  <Badge variant="secondary" className="uppercase">{currency.code}</Badge>
                  <span className="font-medium">{currency.name}</span>
                </div>
                
                <div className="flex items-center space-x-2 rtl:space-x-reverse">
                  <span className="text-sm text-muted-foreground">
                    1 USDT = {currency.exchangeRate} {currency.code.toUpperCase()}
                  </span>
                  
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
            ))}
          </div>
        </div>
      </div>
    </CardSection>
  );
};

export default CurrencyManager;
