
import React, { useState, useEffect } from 'react';
import { useTransaction } from '@/context/TransactionContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { toast } from '@/hooks/use-toast';
import CardSection from '@/components/ui/card-section';
import { Currency } from '@/types';

interface AdminDepositMethodProps {
  refreshMethods: () => void;
}

const AdminDepositMethod = ({ refreshMethods }: AdminDepositMethodProps) => {
  const { addDepositMethod } = useTransaction();
  const [isLoading, setIsLoading] = useState(false);
  const [activeCurrencies, setActiveCurrencies] = useState<{ code: string; name: string }[]>([
    { code: 'usdt', name: 'USDT' },
    { code: 'syp', name: 'الليرة السورية' }
  ]);
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    acceptedCurrency: 'usdt',
    isActive: true,
    requiresImage: true,
    requiresTransactionId: false
  });

  // Load active currencies
  useEffect(() => {
    try {
      const currenciesStr = localStorage.getItem('supportedCurrencies');
      if (currenciesStr) {
        const allCurrencies = JSON.parse(currenciesStr);
        // Filter only active currencies
        const active = allCurrencies
          .filter((c: { isActive: boolean }) => c.isActive)
          .map((c: { code: string; name: string }) => ({
            code: c.code,
            name: c.name
          }));
        
        if (active.length > 0) {
          setActiveCurrencies(active);
        }
      }
    } catch (error) {
      console.error('Error loading currencies:', error);
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setIsLoading(true);
      
      if (!formData.name.trim()) {
        toast({
          title: "اسم طريقة الإيداع مطلوب",
          description: "الرجاء إدخال اسم طريقة الإيداع",
          variant: "destructive",
        });
        return;
      }
      
      await addDepositMethod({
        name: formData.name,
        description: formData.description,
        acceptedCurrency: formData.acceptedCurrency as Currency,
        isActive: formData.isActive,
        requiresImage: formData.requiresImage,
        requiresTransactionId: formData.requiresTransactionId
      });
      
      // Reset form
      setFormData({
        name: '',
        description: '',
        acceptedCurrency: 'usdt',
        isActive: true,
        requiresImage: true,
        requiresTransactionId: false
      });
      
      // Refresh methods list
      refreshMethods();
    } catch (error) {
      toast({
        title: "حدث خطأ",
        description: "فشل إضافة طريقة الإيداع",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <CardSection title="إضافة طريقة إيداع جديدة">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="name">اسم طريقة الإيداع</Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="مثال: بنك X"
            className="bg-[#242C3E] border-[#2A3348] text-white"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="description">الوصف (اختياري)</Label>
          <Input
            id="description"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            placeholder="تفاصيل إضافية عن طريقة الإيداع"
            className="bg-[#242C3E] border-[#2A3348] text-white"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="acceptedCurrency">العملة المقبولة</Label>
          <select
            id="acceptedCurrency"
            value={formData.acceptedCurrency}
            onChange={(e) => setFormData({ ...formData, acceptedCurrency: e.target.value })}
            className="w-full p-2 rounded bg-[#242C3E] border border-[#2A3348] text-white"
          >
            {activeCurrencies.map((currency) => (
              <option key={currency.code} value={currency.code}>
                {currency.name} ({currency.code.toUpperCase()})
              </option>
            ))}
          </select>
        </div>
        
        <div className="flex items-center space-x-2 rtl:space-x-reverse">
          <Switch
            id="isActive"
            checked={formData.isActive}
            onCheckedChange={(checked) => setFormData({ ...formData, isActive: checked })}
          />
          <Label htmlFor="isActive">تفعيل طريقة الإيداع</Label>
        </div>
        
        <div className="flex items-center space-x-2 rtl:space-x-reverse">
          <Switch
            id="requiresImage"
            checked={formData.requiresImage}
            onCheckedChange={(checked) => setFormData({ ...formData, requiresImage: checked })}
          />
          <Label htmlFor="requiresImage">تتطلب صورة إثبات</Label>
        </div>
        
        <div className="flex items-center space-x-2 rtl:space-x-reverse">
          <Switch
            id="requiresTransactionId"
            checked={formData.requiresTransactionId}
            onCheckedChange={(checked) => setFormData({ ...formData, requiresTransactionId: checked })}
          />
          <Label htmlFor="requiresTransactionId">تتطلب رقم العملية</Label>
        </div>
        
        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? "جارٍ الإضافة..." : "إضافة طريقة إيداع جديدة"}
        </Button>
      </form>
    </CardSection>
  );
};

export default AdminDepositMethod;
