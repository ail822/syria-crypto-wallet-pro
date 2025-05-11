
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { toast } from '@/hooks/use-toast';
import { useTransaction } from '@/context/TransactionContext';
import CardSection from '@/components/ui/card-section';
import { sendTelegramMessage } from '@/utils/telegramBot';

const ExchangeRateForm = () => {
  const { exchangeRate, updateExchangeRate } = useTransaction();
  const [rates, setRates] = useState({
    usdt_to_syp: exchangeRate.usdt_to_syp,
    syp_to_usdt: exchangeRate.syp_to_usdt,
    fee_percentage: exchangeRate.fee_percentage,
    enabled: exchangeRate.enabled,
    min_deposit_usdt: exchangeRate.min_deposit_usdt,
    min_withdrawal_usdt: exchangeRate.min_withdrawal_usdt,
    min_deposit_syp: exchangeRate.min_deposit_syp,
    min_withdrawal_syp: exchangeRate.min_withdrawal_syp
  });
  
  useEffect(() => {
    setRates({
      usdt_to_syp: exchangeRate.usdt_to_syp,
      syp_to_usdt: exchangeRate.syp_to_usdt,
      fee_percentage: exchangeRate.fee_percentage,
      enabled: exchangeRate.enabled,
      min_deposit_usdt: exchangeRate.min_deposit_usdt,
      min_withdrawal_usdt: exchangeRate.min_withdrawal_usdt,
      min_deposit_syp: exchangeRate.min_deposit_syp,
      min_withdrawal_syp: exchangeRate.min_withdrawal_syp
    });
  }, [exchangeRate]);
  
  const [isLoading, setIsLoading] = useState(false);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setIsLoading(true);
      
      updateExchangeRate(rates);
      
      // Send backup to Telegram
      await sendTelegramMessage(`🔄 *تحديث أسعار الصرف*\n\n` +
        `💱 سعر USDT إلى SYP: ${rates.usdt_to_syp}\n` +
        `💱 سعر SYP إلى USDT: ${rates.syp_to_usdt}\n` +
        `💰 نسبة العمولة: ${rates.fee_percentage}%\n` +
        `🟢 الحالة: ${rates.enabled ? 'مفعل' : 'معطل'}\n\n` +
        `📊 *الحدود الدنيا*\n` +
        `💵 إيداع USDT: ${rates.min_deposit_usdt}\n` +
        `💵 سحب USDT: ${rates.min_withdrawal_usdt}\n` +
        `💴 إيداع SYP: ${rates.min_deposit_syp}\n` +
        `💴 سحب SYP: ${rates.min_withdrawal_syp}\n\n` +
        `⏱️ وقت التحديث: ${new Date().toLocaleString('ar-SA')}`
      );
      
      toast({ title: "تم تحديث أسعار الصرف بنجاح" });
    } catch (error) {
      toast({
        title: "فشل تحديث أسعار الصرف",
        description: "حدث خطأ أثناء تحديث أسعار الصرف",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <CardSection title="إعدادات أسعار الصرف والعمولات">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="usdt_to_syp">سعر الـ USDT بالليرة السورية</Label>
            <Input
              id="usdt_to_syp"
              type="number"
              step="0.01"
              value={rates.usdt_to_syp}
              onChange={(e) => setRates({...rates, usdt_to_syp: parseFloat(e.target.value)})}
              placeholder="5000"
              className="bg-[#242C3E] border-[#2A3348] text-white"
            />
            <p className="text-xs text-muted-foreground">مثال: 1 USDT = 5000 SYP</p>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="syp_to_usdt">سعر الليرة السورية بالـ USDT</Label>
            <Input
              id="syp_to_usdt"
              type="number"
              step="0.0000001"
              value={rates.syp_to_usdt}
              onChange={(e) => setRates({...rates, syp_to_usdt: parseFloat(e.target.value)})}
              placeholder="0.0002"
              className="bg-[#242C3E] border-[#2A3348] text-white"
            />
            <p className="text-xs text-muted-foreground">مثال: 1 SYP = 0.0002 USDT</p>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="fee_percentage">نسبة العمولة (%)</Label>
            <Input
              id="fee_percentage"
              type="number"
              step="0.1"
              value={rates.fee_percentage}
              onChange={(e) => setRates({...rates, fee_percentage: parseFloat(e.target.value)})}
              placeholder="2"
              className="bg-[#242C3E] border-[#2A3348] text-white"
            />
            <p className="text-xs text-muted-foreground">العمولة على عمليات التحويل بين العملات</p>
          </div>
          
          <div className="space-y-2">
            <Label className="block mb-3">تفعيل التحويل بين العملات</Label>
            <div className="flex items-center space-x-2 rtl:space-x-reverse">
              <Switch
                id="enabled"
                checked={rates.enabled}
                onCheckedChange={(enabled) => setRates({...rates, enabled})}
              />
              <Label htmlFor="enabled" className="font-normal">
                {rates.enabled ? 'مفعل' : 'معطل'}
              </Label>
            </div>
            <p className="text-xs text-muted-foreground">إمكانية التحويل بين العملات للمستخدمين</p>
          </div>
        </div>
        
        <div className="border-t border-[#2A3348] pt-6 mt-4">
          <h3 className="font-medium mb-4">الحدود الدنيا للإيداع والسحب</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="min_deposit_usdt">الحد الأدنى للإيداع (USDT)</Label>
              <Input
                id="min_deposit_usdt"
                type="number"
                step="1"
                value={rates.min_deposit_usdt}
                onChange={(e) => setRates({...rates, min_deposit_usdt: parseFloat(e.target.value)})}
                placeholder="10"
                className="bg-[#242C3E] border-[#2A3348] text-white"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="min_withdrawal_usdt">الحد الأدنى للسحب (USDT)</Label>
              <Input
                id="min_withdrawal_usdt"
                type="number"
                step="1"
                value={rates.min_withdrawal_usdt}
                onChange={(e) => setRates({...rates, min_withdrawal_usdt: parseFloat(e.target.value)})}
                placeholder="10"
                className="bg-[#242C3E] border-[#2A3348] text-white"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="min_deposit_syp">الحد الأدنى للإيداع (SYP)</Label>
              <Input
                id="min_deposit_syp"
                type="number"
                step="1000"
                value={rates.min_deposit_syp}
                onChange={(e) => setRates({...rates, min_deposit_syp: parseFloat(e.target.value)})}
                placeholder="100000"
                className="bg-[#242C3E] border-[#2A3348] text-white"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="min_withdrawal_syp">الحد الأدنى للسحب (SYP)</Label>
              <Input
                id="min_withdrawal_syp"
                type="number"
                step="1000"
                value={rates.min_withdrawal_syp}
                onChange={(e) => setRates({...rates, min_withdrawal_syp: parseFloat(e.target.value)})}
                placeholder="100000"
                className="bg-[#242C3E] border-[#2A3348] text-white"
              />
            </div>
          </div>
        </div>
        
        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? "جارٍ التحديث..." : "تحديث أسعار الصرف"}
        </Button>
      </form>
    </CardSection>
  );
};

export default ExchangeRateForm;
