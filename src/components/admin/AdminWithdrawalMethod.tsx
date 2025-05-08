
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Currency } from '@/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from '@/hooks/use-toast';
import { useTransaction } from '@/context/TransactionContext';

interface AdminWithdrawalMethodProps {
  refreshMethods?: () => void;
}

const AdminWithdrawalMethod = ({ refreshMethods }: AdminWithdrawalMethodProps) => {
  const { addWithdrawalMethod } = useTransaction();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [isActive, setIsActive] = useState(true);
  const [supportedCurrency, setSupportedCurrency] = useState<Currency>('usdt');
  const [requiresApproval, setRequiresApproval] = useState(true);
  const [feePercentage, setFeePercentage] = useState('1');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name) {
      toast({
        title: "خطأ في البيانات",
        description: "يرجى إدخال اسم طريقة السحب",
        variant: "destructive",
      });
      return;
    }
    
    if (parseFloat(feePercentage) < 0 || parseFloat(feePercentage) > 100) {
      toast({
        title: "خطأ في البيانات",
        description: "يرجى إدخال نسبة عمولة صحيحة (0-100)",
        variant: "destructive",
      });
      return;
    }
    
    try {
      setIsLoading(true);
      
      await addWithdrawalMethod({
        name,
        description,
        isActive,
        supportedCurrency,
        requiresApproval,
        feePercentage: parseFloat(feePercentage),
      });
      
      // Reset form
      setName('');
      setDescription('');
      setSupportedCurrency('usdt');
      setRequiresApproval(true);
      setFeePercentage('1');
      
      if (refreshMethods) {
        refreshMethods();
      }
    } catch (error) {
      console.error("Error adding withdrawal method:", error);
      toast({
        title: "حدث خطأ",
        description: "لم نتمكن من إضافة طريقة السحب",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="border-[#2A3348] bg-[#1A1E2C] shadow-md">
      <CardHeader>
        <CardTitle className="text-lg font-medium text-white">إضافة طريقة سحب جديدة</CardTitle>
        <CardDescription className="text-muted-foreground">
          أضف طريقة سحب جديدة ليستخدمها المستخدمين
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">اسم طريقة السحب</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="مثال: بنك سوريا الدولي"
              required
              className="bg-[#242C3E] border-[#2A3348] text-white"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">وصف الطريقة (اختياري)</Label>
            <Input
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="تعليمات وتفاصيل للمستخدم"
              className="bg-[#242C3E] border-[#2A3348] text-white"
            />
          </div>
          
          <div className="space-y-2">
            <Label>العملة المدعومة</Label>
            <RadioGroup 
              value={supportedCurrency} 
              onValueChange={(value) => setSupportedCurrency(value as Currency)}
              className="flex gap-4"
            >
              <div className="flex items-center gap-2">
                <RadioGroupItem value="usdt" id="usdt-currency" />
                <Label htmlFor="usdt-currency" className="font-medium">USDT</Label>
              </div>
              <div className="flex items-center gap-2">
                <RadioGroupItem value="syp" id="syp-currency" />
                <Label htmlFor="syp-currency" className="font-medium">ليرة سورية</Label>
              </div>
            </RadioGroup>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="fee">نسبة العمولة (%)</Label>
            <Input
              id="fee"
              type="number"
              min="0"
              max="100"
              step="0.1"
              value={feePercentage}
              onChange={(e) => setFeePercentage(e.target.value)}
              placeholder="أدخل النسبة المئوية"
              className="bg-[#242C3E] border-[#2A3348] text-white"
            />
          </div>
          
          <div className="flex items-center space-x-2 rtl:space-x-reverse">
            <Switch
              id="requires-approval"
              checked={requiresApproval}
              onCheckedChange={setRequiresApproval}
            />
            <Label htmlFor="requires-approval" className="flex-grow">تحتاج موافقة الإدارة</Label>
          </div>
          
          <div className="flex items-center space-x-2 rtl:space-x-reverse">
            <Switch
              id="is-active"
              checked={isActive}
              onCheckedChange={setIsActive}
            />
            <Label htmlFor="is-active" className="flex-grow">مفعّلة</Label>
          </div>
          
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "جاري الإضافة..." : "إضافة طريقة السحب"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default AdminWithdrawalMethod;
