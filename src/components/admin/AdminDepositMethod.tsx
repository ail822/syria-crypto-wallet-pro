
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

interface AdminDepositMethodProps {
  refreshMethods?: () => void;
}

const AdminDepositMethod = ({ refreshMethods }: AdminDepositMethodProps) => {
  const { addDepositMethod } = useTransaction();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [isActive, setIsActive] = useState(true);
  const [acceptedCurrency, setAcceptedCurrency] = useState<Currency>('usdt');
  const [isLoading, setIsLoading] = useState(false);
  const [requiresImage, setRequiresImage] = useState(true);
  const [requiresTransactionId, setRequiresTransactionId] = useState(true);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name) {
      toast({
        title: "خطأ في البيانات",
        description: "يرجى إدخال اسم طريقة الإيداع",
        variant: "destructive",
      });
      return;
    }
    
    try {
      setIsLoading(true);
      
      await addDepositMethod({
        name,
        description,
        isActive,
        acceptedCurrency,
        requiresImage,
        requiresTransactionId,
      });
      
      // Reset form
      setName('');
      setDescription('');
      setAcceptedCurrency('usdt');
      setRequiresImage(true);
      setRequiresTransactionId(true);
      
      if (refreshMethods) {
        refreshMethods();
      }
    } catch (error) {
      console.error("Error adding deposit method:", error);
      toast({
        title: "حدث خطأ",
        description: "لم نتمكن من إضافة طريقة الإيداع",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="border-[#2A3348] bg-[#1A1E2C] shadow-md">
      <CardHeader>
        <CardTitle className="text-lg font-medium text-white">إضافة طريقة إيداع جديدة</CardTitle>
        <CardDescription className="text-muted-foreground">
          أضف طريقة إيداع جديدة ليستخدمها المستخدمين
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">اسم طريقة الإيداع</Label>
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
            <Label>العملة المقبولة</Label>
            <RadioGroup 
              value={acceptedCurrency} 
              onValueChange={(value) => setAcceptedCurrency(value as Currency)}
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
          
          <div className="flex items-center space-x-2 rtl:space-x-reverse">
            <Switch
              id="requires-image"
              checked={requiresImage}
              onCheckedChange={setRequiresImage}
            />
            <Label htmlFor="requires-image" className="flex-grow">طلب صورة إثبات</Label>
          </div>
          
          <div className="flex items-center space-x-2 rtl:space-x-reverse">
            <Switch
              id="requires-transaction"
              checked={requiresTransactionId}
              onCheckedChange={setRequiresTransactionId}
            />
            <Label htmlFor="requires-transaction" className="flex-grow">طلب رقم العملية</Label>
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
            {isLoading ? "جاري الإضافة..." : "إضافة طريقة الإيداع"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default AdminDepositMethod;
