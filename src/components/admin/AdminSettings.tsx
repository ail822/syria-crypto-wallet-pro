
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { useTransaction } from '@/context/TransactionContext';
import CardSection from '../ui/card-section';

const AdminSettings = () => {
  const { exchangeRate, updateExchangeRate } = useTransaction();
  
  const [rates, setRates] = useState({
    usdt_to_syp: exchangeRate.usdt_to_syp,
    syp_to_usdt: exchangeRate.syp_to_usdt,
    fee_percentage: exchangeRate.fee_percentage,
    enabled: exchangeRate.enabled
  });
  
  const [telegramSettings, setTelegramSettings] = useState({
    botToken: '8182800982:AAGLM8kJ2mwOUrkpj3fLxmHtN5zbLVTfdhk',
    botUsername: 'sy_gmenbot'
  });
  
  const [isLoading, setIsLoading] = useState(false);
  
  const handleRateChange = (field: string, value: string | number | boolean) => {
    setRates({ ...rates, [field]: value });
  };
  
  const handleTelegramChange = (field: string, value: string) => {
    setTelegramSettings({ ...telegramSettings, [field]: value });
  };
  
  const handleSaveRates = () => {
    setIsLoading(true);
    
    setTimeout(() => {
      updateExchangeRate(rates);
      setIsLoading(false);
    }, 500);
  };
  
  const handleSaveTelegramSettings = () => {
    setIsLoading(true);
    
    setTimeout(() => {
      setIsLoading(false);
      // Implement Telegram settings update logic
    }, 500);
  };

  return (
    <div className="space-y-6">
      <CardSection title="إعدادات أسعار الصرف والعمولات">
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="usdt_to_syp">سعر صرف 1 USDT إلى الليرة السورية</Label>
            <Input
              id="usdt_to_syp"
              type="number"
              value={rates.usdt_to_syp}
              onChange={(e) => handleRateChange('usdt_to_syp', parseFloat(e.target.value))}
              className="bg-[#242C3E] border-[#2A3348] text-white"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="syp_to_usdt">سعر صرف 1 ليرة سورية إلى USDT</Label>
            <Input
              id="syp_to_usdt"
              type="number"
              step="0.0000001"
              value={rates.syp_to_usdt}
              onChange={(e) => handleRateChange('syp_to_usdt', parseFloat(e.target.value))}
              className="bg-[#242C3E] border-[#2A3348] text-white"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="fee_percentage">نسبة العمولة (%)</Label>
            <Input
              id="fee_percentage"
              type="number"
              step="0.1"
              value={rates.fee_percentage}
              onChange={(e) => handleRateChange('fee_percentage', parseFloat(e.target.value))}
              className="bg-[#242C3E] border-[#2A3348] text-white"
            />
          </div>
          
          <div className="flex items-center justify-between">
            <Label htmlFor="conversion_enabled">تفعيل التحويل بين العملات</Label>
            <Switch
              id="conversion_enabled"
              checked={rates.enabled}
              onCheckedChange={(value) => handleRateChange('enabled', value)}
            />
          </div>
          
          <Button className="w-full" onClick={handleSaveRates} disabled={isLoading}>
            {isLoading ? "جاري الحفظ..." : "حفظ الإعدادات"}
          </Button>
        </div>
      </CardSection>
      
      <CardSection title="إعدادات بوت تلجرام للمصادقة">
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="telegram_token">API Token</Label>
            <Input
              id="telegram_token"
              value={telegramSettings.botToken}
              onChange={(e) => handleTelegramChange('botToken', e.target.value)}
              className="bg-[#242C3E] border-[#2A3348] text-white"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="bot_username">معرف البوت</Label>
            <div className="flex">
              <span className="inline-flex items-center px-3 rounded-r-none rounded-md border border-l-0 border-[#2A3348] bg-[#1E293B] text-white">
                @
              </span>
              <Input
                id="bot_username"
                value={telegramSettings.botUsername}
                onChange={(e) => handleTelegramChange('botUsername', e.target.value)}
                className="rounded-r-none bg-[#242C3E] border-[#2A3348] text-white"
              />
            </div>
          </div>
          
          <Button className="w-full" onClick={handleSaveTelegramSettings} disabled={isLoading}>
            {isLoading ? "جاري الحفظ..." : "حفظ إعدادات البوت"}
          </Button>
        </div>
      </CardSection>
      
      <CardSection title="إعدادات متقدمة">
        <div className="space-y-4">
          <div className="p-3 bg-yellow-900/20 rounded-md border border-yellow-800/30 mb-4">
            <p className="text-sm text-yellow-300">
              تحذير: تؤثر هذه الإعدادات على أمان النظام. يرجى توخي الحذر عند التعديل.
            </p>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="transaction_limit">الحد الأقصى للتحويل اليومي (USDT)</Label>
            <Input
              id="transaction_limit"
              type="number"
              defaultValue="1000"
              className="bg-[#242C3E] border-[#2A3348] text-white"
            />
          </div>
          
          <div className="flex items-center justify-between">
            <Label htmlFor="maintenance_mode">وضع الصيانة</Label>
            <Switch id="maintenance_mode" />
          </div>
          
          <Button className="w-full">
            حفظ الإعدادات المتقدمة
          </Button>
        </div>
      </CardSection>
    </div>
  );
};

export default AdminSettings;
