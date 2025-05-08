
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from '@/components/ui/tabs';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { useTransaction } from '@/context/TransactionContext';
import { useAuth } from '@/context/AuthContext';
import { Currency, WithdrawalMethod } from '@/types';
import { toast } from '@/hooks/use-toast';
import CardSection from '../ui/card-section';

// Syrian provinces list
const provinces = [
  'دمشق',
  'ريف دمشق',
  'حلب',
  'حمص',
  'حماة',
  'اللاذقية',
  'طرطوس',
  'درعا',
  'السويداء',
  'القنيطرة',
  'دير الزور',
  'الحسكة',
  'الرقة',
  'إدلب',
];

const WithdrawalForm = () => {
  const { withdrawRequest } = useTransaction();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<WithdrawalMethod>('province');
  const [isLoading, setIsLoading] = useState(false);
  
  // Province withdrawal form
  const [provinceData, setProvinceData] = useState({
    province: provinces[0],
    recipientName: '',
    phoneNumber: '',
    amount: '',
  });
  
  // Telecom withdrawal form
  const [telecomData, setTelecomData] = useState({
    provider: 'mtn',
    phoneNumber: '',
    amount: '',
  });
  
  // C-Wallet withdrawal form
  const [walletData, setWalletData] = useState({
    recipientWalletId: '',
    amount: '',
    currency: 'usdt' as Currency,
  });
  
  const handleProvinceChange = (field: string, value: string) => {
    setProvinceData({ ...provinceData, [field]: value });
  };
  
  const handleTelecomChange = (field: string, value: string) => {
    setTelecomData({ ...telecomData, [field]: value });
  };
  
  const handleWalletChange = (field: string, value: string) => {
    setWalletData({ ...walletData, [field]: value });
  };
  
  const handleSubmit = async (method: WithdrawalMethod) => {
    try {
      setIsLoading(true);
      
      switch (method) {
        case 'province':
          if (!provinceData.recipientName || !provinceData.phoneNumber || !provinceData.amount || parseFloat(provinceData.amount) <= 0) {
            toast({
              title: "بيانات غير مكتملة",
              description: "يرجى تعبئة جميع الحقول المطلوبة",
              variant: "destructive",
            });
            return;
          }
          
          await withdrawRequest(
            'province',
            parseFloat(provinceData.amount),
            'syp',
            {
              name: provinceData.recipientName,
              phoneNumber: provinceData.phoneNumber,
              province: provinceData.province,
            }
          );
          
          setProvinceData({
            province: provinces[0],
            recipientName: '',
            phoneNumber: '',
            amount: '',
          });
          break;
          
        case 'mtn':
        case 'syriatel':
          if (!telecomData.phoneNumber || !telecomData.amount || parseFloat(telecomData.amount) <= 0) {
            toast({
              title: "بيانات غير مكتملة",
              description: "يرجى تعبئة جميع الحقول المطلوبة",
              variant: "destructive",
            });
            return;
          }
          
          await withdrawRequest(
            method,
            parseFloat(telecomData.amount),
            'syp',
            {
              phoneNumber: telecomData.phoneNumber,
            }
          );
          
          setTelecomData({
            provider: telecomData.provider,
            phoneNumber: '',
            amount: '',
          });
          break;
          
        case 'c-wallet':
          if (!walletData.recipientWalletId || !walletData.amount || parseFloat(walletData.amount) <= 0) {
            toast({
              title: "بيانات غير مكتملة",
              description: "يرجى تعبئة جميع الحقول المطلوبة",
              variant: "destructive",
            });
            return;
          }
          
          await withdrawRequest(
            'c-wallet',
            parseFloat(walletData.amount),
            walletData.currency,
            {
              walletId: walletData.recipientWalletId,
            }
          );
          
          setWalletData({
            recipientWalletId: '',
            amount: '',
            currency: 'usdt',
          });
          break;
      }
      
    } catch (error) {
      console.error("Error processing withdrawal:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <CardSection title="سحب الأموال">
      <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as WithdrawalMethod)}>
        <TabsList className="grid grid-cols-3 mb-4">
          <TabsTrigger value="province">المحافظات</TabsTrigger>
          <TabsTrigger value="mtn">شركات الاتصال</TabsTrigger>
          <TabsTrigger value="c-wallet">C-Wallet</TabsTrigger>
        </TabsList>
        
        {/* Province Withdrawal */}
        <TabsContent value="province" className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="province">المحافظة</Label>
            <Select 
              value={provinceData.province} 
              onValueChange={(value) => handleProvinceChange('province', value)}
            >
              <SelectTrigger className="bg-[#242C3E] border-[#2A3348] text-white">
                <SelectValue placeholder="اختر المحافظة" />
              </SelectTrigger>
              <SelectContent className="bg-[#242C3E] border-[#2A3348] text-white">
                {provinces.map((province) => (
                  <SelectItem key={province} value={province}>
                    {province}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="recipientName">اسم المستلم</Label>
            <Input
              id="recipientName"
              value={provinceData.recipientName}
              onChange={(e) => handleProvinceChange('recipientName', e.target.value)}
              placeholder="أدخل اسم المستلم الكامل"
              required
              className="bg-[#242C3E] border-[#2A3348] text-white"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="phoneNumber">رقم الهاتف</Label>
            <Input
              id="phoneNumber"
              type="tel"
              value={provinceData.phoneNumber}
              onChange={(e) => handleProvinceChange('phoneNumber', e.target.value)}
              placeholder="مثال: +963912345678"
              required
              className="bg-[#242C3E] border-[#2A3348] text-white"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="amount">المبلغ (ليرة سورية)</Label>
            <Input
              id="amount"
              type="number"
              value={provinceData.amount}
              onChange={(e) => handleProvinceChange('amount', e.target.value)}
              placeholder="أدخل المبلغ بالليرة السورية"
              required
              className="bg-[#242C3E] border-[#2A3348] text-white"
            />
          </div>
          
          <Button 
            onClick={() => handleSubmit('province')} 
            className="w-full" 
            disabled={isLoading}
          >
            {isLoading ? "جاري إرسال الطلب..." : "إرسال طلب السحب"}
          </Button>
          
          <p className="text-sm text-muted-foreground">
            ملاحظة: سيتم مراجعة الطلب من قبل الإدارة قبل التنفيذ
          </p>
        </TabsContent>
        
        {/* Telecom Withdrawal */}
        <TabsContent value="mtn" className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="provider">مزود الخدمة</Label>
            <div className="grid grid-cols-2 gap-4">
              <Button
                variant={telecomData.provider === 'mtn' ? 'default' : 'outline'}
                className={telecomData.provider === 'mtn' ? '' : 'bg-[#242C3E] border-[#2A3348] text-white'}
                onClick={() => handleTelecomChange('provider', 'mtn')}
              >
                MTN
              </Button>
              <Button
                variant={telecomData.provider === 'syriatel' ? 'default' : 'outline'}
                className={telecomData.provider === 'syriatel' ? '' : 'bg-[#242C3E] border-[#2A3348] text-white'}
                onClick={() => handleTelecomChange('provider', 'syriatel')}
              >
                Syriatel
              </Button>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="telecomPhone">رقم الهاتف</Label>
            <Input
              id="telecomPhone"
              type="tel"
              value={telecomData.phoneNumber}
              onChange={(e) => handleTelecomChange('phoneNumber', e.target.value)}
              placeholder={`أدخل رقم هاتف ${telecomData.provider === 'mtn' ? 'MTN' : 'Syriatel'}`}
              required
              className="bg-[#242C3E] border-[#2A3348] text-white"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="telecomAmount">المبلغ (ليرة سورية)</Label>
            <Input
              id="telecomAmount"
              type="number"
              value={telecomData.amount}
              onChange={(e) => handleTelecomChange('amount', e.target.value)}
              placeholder="أدخل المبلغ بالليرة السورية"
              required
              className="bg-[#242C3E] border-[#2A3348] text-white"
            />
          </div>
          
          <Button 
            onClick={() => handleSubmit(telecomData.provider as WithdrawalMethod)} 
            className="w-full" 
            disabled={isLoading}
          >
            {isLoading ? "جاري إرسال الطلب..." : "إرسال طلب السحب"}
          </Button>
          
          <p className="text-sm text-muted-foreground">
            ملاحظة: سيتم مراجعة الطلب من قبل الإدارة قبل التنفيذ
          </p>
        </TabsContent>
        
        {/* C-Wallet Withdrawal */}
        <TabsContent value="c-wallet" className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="recipientWalletId">معرف محفظة المستلم</Label>
            <Input
              id="recipientWalletId"
              value={walletData.recipientWalletId}
              onChange={(e) => handleWalletChange('recipientWalletId', e.target.value)}
              placeholder="أدخل معرف المحفظة"
              required
              className="bg-[#242C3E] border-[#2A3348] text-white"
            />
          </div>
          
          <div className="space-y-2">
            <Label>اختر العملة</Label>
            <RadioGroup 
              value={walletData.currency} 
              onValueChange={(value) => handleWalletChange('currency', value)}
              className="flex gap-4"
            >
              <div className="flex items-center gap-2">
                <RadioGroupItem value="usdt" id="wallet-usdt" />
                <Label htmlFor="wallet-usdt" className="font-medium">USDT</Label>
              </div>
              <div className="flex items-center gap-2">
                <RadioGroupItem value="syp" id="wallet-syp" />
                <Label htmlFor="wallet-syp" className="font-medium">ليرة سورية</Label>
              </div>
            </RadioGroup>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="walletAmount">
              المبلغ ({walletData.currency === 'usdt' ? 'USDT' : 'ليرة سورية'})
            </Label>
            <Input
              id="walletAmount"
              type="number"
              step={walletData.currency === 'usdt' ? '0.01' : '1'}
              value={walletData.amount}
              onChange={(e) => handleWalletChange('amount', e.target.value)}
              placeholder={`أدخل المبلغ بالـ ${walletData.currency === 'usdt' ? 'USDT' : 'ليرة السورية'}`}
              required
              className="bg-[#242C3E] border-[#2A3348] text-white"
            />
          </div>
          
          <div className="p-3 bg-blue-900/20 rounded-md border border-blue-800/30">
            <p className="text-sm">
              يتم خصم عمولة بنسبة 1% على جميع عمليات السحب إلى C-Wallet
            </p>
          </div>
          
          <Button 
            onClick={() => handleSubmit('c-wallet')} 
            className="w-full" 
            disabled={isLoading}
          >
            {isLoading ? "جاري تنفيذ السحب..." : "تنفيذ السحب"}
          </Button>
          
          <p className="text-sm text-muted-foreground">
            ملاحظة: يتم تنفيذ عمليات السحب إلى C-Wallet بشكل فوري
          </p>
        </TabsContent>
      </Tabs>
    </CardSection>
  );
};

export default WithdrawalForm;
