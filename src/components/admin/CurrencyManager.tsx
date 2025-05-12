
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { toast } from '@/hooks/use-toast';
import CardSection from '@/components/ui/card-section';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { useTransaction } from '@/context/TransactionContext';
import { sendTelegramMessage } from '@/utils/telegramBot';
import { CurrencyItem } from '@/types';

const CurrencyManager = () => {
  const { exchangeRate } = useTransaction();
  const [currencies, setCurrencies] = useState<CurrencyItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [currencyToDelete, setCurrencyToDelete] = useState<string | null>(null);
  
  // New currency form state
  const [newCurrency, setNewCurrency] = useState<CurrencyItem>({
    code: '',
    name: '',
    exchangeRate: 1,
    isActive: true,
    minDeposit: 10,
    minWithdrawal: 10
  });

  // Load currencies on component mount
  useEffect(() => {
    loadCurrencies();
  }, []);

  const loadCurrencies = () => {
    try {
      const savedCurrencies = localStorage.getItem('supportedCurrencies');
      if (savedCurrencies) {
        setCurrencies(JSON.parse(savedCurrencies));
      } else {
        // Set default currencies if none exist
        const defaultCurrencies: CurrencyItem[] = [
          { 
            code: 'usdt', 
            name: 'Tether USD',
            exchangeRate: 1,
            isActive: true,
            minDeposit: exchangeRate.min_deposit_usdt,
            minWithdrawal: exchangeRate.min_withdrawal_usdt
          },
          { 
            code: 'syp', 
            name: 'الليرة السورية',
            exchangeRate: exchangeRate.usdt_to_syp,
            isActive: true,
            minDeposit: exchangeRate.min_deposit_syp,
            minWithdrawal: exchangeRate.min_withdrawal_syp
          }
        ];
        setCurrencies(defaultCurrencies);
        localStorage.setItem('supportedCurrencies', JSON.stringify(defaultCurrencies));
      }
    } catch (error) {
      console.error('Error loading currencies:', error);
    }
  };

  const handleAddCurrency = async () => {
    try {
      setIsLoading(true);
      
      // Validate inputs
      if (!newCurrency.code.trim()) {
        toast({
          title: "رمز العملة مطلوب",
          description: "الرجاء إدخال رمز العملة",
          variant: "destructive",
        });
        return;
      }
      
      if (!newCurrency.name.trim()) {
        toast({
          title: "اسم العملة مطلوب",
          description: "الرجاء إدخال اسم العملة",
          variant: "destructive",
        });
        return;
      }
      
      if (newCurrency.exchangeRate <= 0) {
        toast({
          title: "سعر الصرف غير صحيح",
          description: "يجب أن يكون سعر الصرف أكبر من صفر",
          variant: "destructive",
        });
        return;
      }
      
      // Check for duplicate currency code
      if (currencies.some(c => c.code.toLowerCase() === newCurrency.code.toLowerCase())) {
        toast({
          title: "العملة موجودة بالفعل",
          description: "يوجد بالفعل عملة بنفس الرمز",
          variant: "destructive",
        });
        return;
      }
      
      // Add new currency
      const updatedCurrencies = [...currencies, newCurrency];
      setCurrencies(updatedCurrencies);
      localStorage.setItem('supportedCurrencies', JSON.stringify(updatedCurrencies));
      
      // Send backup to Telegram
      await sendTelegramMessage(`🌐 *إضافة عملة جديدة*\n\n` +
        `💱 الرمز: ${newCurrency.code}\n` +
        `📝 الاسم: ${newCurrency.name}\n` +
        `📊 سعر الصرف: ${newCurrency.exchangeRate} USDT\n` +
        `🟢 الحالة: ${newCurrency.isActive ? 'مفعلة' : 'معطلة'}\n` +
        `💵 الحد الأدنى للإيداع: ${newCurrency.minDeposit}\n` +
        `💴 الحد الأدنى للسحب: ${newCurrency.minWithdrawal}\n\n` +
        `⏱️ وقت الإضافة: ${new Date().toLocaleString('ar-SA')}`
      );
      
      // Reset form
      setNewCurrency({
        code: '',
        name: '',
        exchangeRate: 1,
        isActive: true,
        minDeposit: 10,
        minWithdrawal: 10
      });
      
      toast({ title: "تمت إضافة العملة بنجاح" });
    } catch (error) {
      console.error('Error adding currency:', error);
      toast({
        title: "فشل إضافة العملة",
        description: "حدث خطأ أثناء إضافة العملة الجديدة",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteCurrency = async (code: string) => {
    try {
      // Don't allow deletion of USDT or SYP (core currencies)
      if (code === 'usdt' || code === 'syp') {
        toast({
          title: "لا يمكن حذف العملات الأساسية",
          description: "لا يمكن حذف USDT أو الليرة السورية",
          variant: "destructive",
        });
        return;
      }
      
      const currency = currencies.find(c => c.code === code);
      const updatedCurrencies = currencies.filter(c => c.code !== code);
      setCurrencies(updatedCurrencies);
      localStorage.setItem('supportedCurrencies', JSON.stringify(updatedCurrencies));
      
      // Send backup to Telegram
      if (currency) {
        await sendTelegramMessage(`🗑️ *حذف عملة*\n\n` +
          `💱 الرمز: ${currency.code}\n` +
          `📝 الاسم: ${currency.name}\n\n` +
          `⏱️ وقت الحذف: ${new Date().toLocaleString('ar-SA')}`
        );
      }
      
      toast({ title: "تم حذف العملة بنجاح" });
      setShowDeleteDialog(false);
    } catch (error) {
      console.error('Error deleting currency:', error);
      toast({
        title: "فشل حذف العملة",
        description: "حدث خطأ أثناء حذف العملة",
        variant: "destructive",
      });
    }
  };

  const handleToggleActivation = async (code: string, isActive: boolean) => {
    try {
      const updatedCurrencies = currencies.map(c => 
        c.code === code ? { ...c, isActive } : c
      );
      setCurrencies(updatedCurrencies);
      localStorage.setItem('supportedCurrencies', JSON.stringify(updatedCurrencies));
      
      const currency = currencies.find(c => c.code === code);
      
      // Send backup to Telegram
      if (currency) {
        await sendTelegramMessage(`🔄 *تغيير حالة عملة*\n\n` +
          `💱 الرمز: ${currency.code}\n` +
          `📝 الاسم: ${currency.name}\n` +
          `🟢 الحالة الجديدة: ${isActive ? 'مفعلة' : 'معطلة'}\n\n` +
          `⏱️ وقت التغيير: ${new Date().toLocaleString('ar-SA')}`
        );
      }
      
      toast({ 
        title: `تم ${isActive ? 'تفعيل' : 'تعطيل'} العملة بنجاح`, 
      });
    } catch (error) {
      console.error('Error toggling currency activation:', error);
      toast({
        title: "فشل تغيير حالة العملة",
        description: "حدث خطأ أثناء تغيير حالة العملة",
        variant: "destructive",
      });
    }
  };

  const confirmDelete = (code: string) => {
    setCurrencyToDelete(code);
    setShowDeleteDialog(true);
  };

  return (
    <CardSection title="إدارة العملات">
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <h3 className="font-medium">إضافة عملة جديدة</h3>
            
            <div className="space-y-2">
              <Label htmlFor="currency-code">رمز العملة</Label>
              <Input
                id="currency-code"
                value={newCurrency.code}
                onChange={(e) => setNewCurrency({...newCurrency, code: e.target.value.toLowerCase()})}
                placeholder="مثال: usd"
                className="bg-[#242C3E] border-[#2A3348] text-white"
              />
              <p className="text-xs text-muted-foreground">رمز مختصر للعملة (مثل: usdt, eur, btc)</p>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="currency-name">اسم العملة</Label>
              <Input
                id="currency-name"
                value={newCurrency.name}
                onChange={(e) => setNewCurrency({...newCurrency, name: e.target.value})}
                placeholder="مثال: الدولار الأمريكي"
                className="bg-[#242C3E] border-[#2A3348] text-white"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="exchange-rate">سعر الصرف مقابل USDT</Label>
              <Input
                id="exchange-rate"
                type="number"
                step="0.00000001"
                value={newCurrency.exchangeRate}
                onChange={(e) => setNewCurrency({...newCurrency, exchangeRate: parseFloat(e.target.value)})}
                placeholder="1"
                className="bg-[#242C3E] border-[#2A3348] text-white"
              />
              <p className="text-xs text-muted-foreground">1 من العملة الجديدة = ? USDT</p>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="min-deposit">الحد الأدنى للإيداع</Label>
                <Input
                  id="min-deposit"
                  type="number"
                  value={newCurrency.minDeposit}
                  onChange={(e) => setNewCurrency({...newCurrency, minDeposit: parseFloat(e.target.value)})}
                  className="bg-[#242C3E] border-[#2A3348] text-white"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="min-withdrawal">الحد الأدنى للسحب</Label>
                <Input
                  id="min-withdrawal"
                  type="number"
                  value={newCurrency.minWithdrawal}
                  onChange={(e) => setNewCurrency({...newCurrency, minWithdrawal: parseFloat(e.target.value)})}
                  className="bg-[#242C3E] border-[#2A3348] text-white"
                />
              </div>
            </div>
            
            <div className="flex items-center space-x-2 rtl:space-x-reverse pt-2">
              <Switch
                id="currency-active"
                checked={newCurrency.isActive}
                onCheckedChange={(checked) => setNewCurrency({...newCurrency, isActive: checked})}
              />
              <Label htmlFor="currency-active">تفعيل العملة</Label>
            </div>
            
            <Button 
              onClick={handleAddCurrency}
              disabled={isLoading}
              className="w-full"
            >
              {isLoading ? "جارٍ الإضافة..." : "إضافة عملة جديدة"}
            </Button>
          </div>
          
          <div>
            <h3 className="font-medium mb-4">العملات المدعومة</h3>
            
            {currencies.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                لم يتم إضافة عملات بعد
              </div>
            ) : (
              <div className="space-y-3 max-h-96 overflow-y-auto pr-1">
                {currencies.map((currency) => (
                  <div 
                    key={currency.code} 
                    className="p-3 border border-[#2A3348] rounded-lg bg-[#1E293B]"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center">
                        <div className="font-medium uppercase">{currency.code}</div>
                        <Badge variant={currency.isActive ? "default" : "secondary"} className="mr-2">
                          {currency.isActive ? "مفعلة" : "معطلة"}
                        </Badge>
                      </div>
                      <div>
                        <Switch 
                          checked={currency.isActive} 
                          onCheckedChange={(checked) => handleToggleActivation(currency.code, checked)}
                          disabled={currency.code === 'usdt'}
                        />
                      </div>
                    </div>
                    
                    <p className="text-sm text-muted-foreground mb-2">{currency.name}</p>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-2 gap-y-1 text-sm">
                      <div>سعر الصرف: {currency.exchangeRate} USDT</div>
                      <div>الحد الأدنى للإيداع: {currency.minDeposit}</div>
                      <div>الحد الأدنى للسحب: {currency.minWithdrawal}</div>
                      
                      {/* Don't show delete button for core currencies */}
                      {currency.code !== 'usdt' && currency.code !== 'syp' && (
                        <div className="sm:col-span-2 mt-2">
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => confirmDelete(currency.code)}
                            className="w-full"
                          >
                            حذف العملة
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Delete confirmation dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>هل أنت متأكد من حذف هذه العملة؟</AlertDialogTitle>
            <AlertDialogDescription>
              سيتم حذف هذه العملة نهائيًا من النظام. لن تتمكن من استردادها بعد ذلك.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>إلغاء</AlertDialogCancel>
            <AlertDialogAction 
              onClick={() => currencyToDelete && handleDeleteCurrency(currencyToDelete)}
              className="bg-red-600 hover:bg-red-700"
            >
              حذف
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </CardSection>
  );
};

export default CurrencyManager;
