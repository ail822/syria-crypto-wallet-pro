
import React, { useState, useEffect } from 'react';
import { useTransaction } from '@/context/TransactionContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { toast } from '@/hooks/use-toast';
import CardSection from '@/components/ui/card-section';
import { Currency } from '@/types';

interface AdminWithdrawalMethodProps {
  refreshMethods: () => void;
}

const AdminWithdrawalMethod = ({ refreshMethods }: AdminWithdrawalMethodProps) => {
  const { addWithdrawalMethod } = useTransaction();
  const [isLoading, setIsLoading] = useState(false);
  const [activeCurrencies, setActiveCurrencies] = useState<{ code: string; name: string }[]>([
    { code: 'usdt', name: 'USDT' },
    { code: 'syp', name: 'الليرة السورية' }
  ]);
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    supportedCurrency: 'usdt',
    isActive: true,
    requiresApproval: true,
    feePercentage: 1
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
          title: "اسم طريقة السحب مطلوب",
          description: "الرجاء إدخال اسم طريقة السحب",
          variant: "destructive",
        });
        return;
      }
      
      await addWithdrawalMethod({
        name: formData.name,
        description: formData.description,
        supportedCurrency: formData.supportedCurrency as Currency,
        isActive: formData.isActive,
        requiresApproval: formData.requiresApproval,
        feePercentage: formData.feePercentage
      });
      
      // Reset form
      setFormData({
        name: '',
        description: '',
        supportedCurrency: 'usdt',
        isActive: true,
        requiresApproval: true,
        feePercentage: 1
      });
      
      // Refresh methods list
      refreshMethods();
    } catch (error) {
      toast({
        title: "حدث خطأ",
        description: "فشل إضافة طريقة السحب",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <CardSection title="إضافة طريقة سحب جديدة">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="name">اسم طريقة السحب</Label>
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
            placeholder="تفاصيل إضافية عن طريقة السحب"
            className="bg-[#242C3E] border-[#2A3348] text-white"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="supportedCurrency">العملة المدعومة</Label>
          <select
            id="supportedCurrency"
            value={formData.supportedCurrency}
            onChange={(e) => setFormData({ ...formData, supportedCurrency: e.target.value })}
            className="w-full p-2 rounded bg-[#242C3E] border border-[#2A3348] text-white"
          >
            {activeCurrencies.map((currency) => (
              <option key={currency.code} value={currency.code}>
                {currency.name} ({currency.code.toUpperCase()})
              </option>
            ))}
          </select>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="feePercentage">نسبة العمولة (%)</Label>
          <Input
            id="feePercentage"
            type="number"
            step="0.1"
            value={formData.feePercentage}
            onChange={(e) => setFormData({ ...formData, feePercentage: parseFloat(e.target.value) })}
            placeholder="1"
            className="bg-[#242C3E] border-[#2A3348] text-white"
          />
        </div>
        
        <div className="flex items-center space-x-2 rtl:space-x-reverse">
          <Switch
            id="isActive"
            checked={formData.isActive}
            onCheckedChange={(checked) => setFormData({ ...formData, isActive: checked })}
          />
          <Label htmlFor="isActive">تفعيل طريقة السحب</Label>
        </div>
        
        <div className="flex items-center space-x-2 rtl:space-x-reverse">
          <Switch
            id="requiresApproval"
            checked={formData.requiresApproval}
            onCheckedChange={(checked) => setFormData({ ...formData, requiresApproval: checked })}
          />
          <Label htmlFor="requiresApproval">تتطلب موافقة الإدارة</Label>
        </div>
        
        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? "جارٍ الإضافة..." : "إضافة طريقة سحب جديدة"}
        </Button>
      </form>
    </CardSection>
  );
};

export default AdminWithdrawalMethod;
