
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useTransaction } from '@/context/TransactionContext';
import { useAuth } from '@/context/AuthContext';
import { toast } from '@/hooks/use-toast';
import CardSection from '../ui/card-section';

const DepositForm = () => {
  const { depositRequest } = useTransaction();
  const { user } = useAuth();
  const [walletId, setWalletId] = useState('48090162');
  const [amount, setAmount] = useState('');
  const [screenshot, setScreenshot] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        setScreenshot(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!amount || parseFloat(amount) <= 0) {
      toast({
        title: "خطأ في المبلغ",
        description: "يرجى إدخال مبلغ صحيح للإيداع",
        variant: "destructive",
      });
      return;
    }
    
    if (!screenshot) {
      toast({
        title: "لقطة شاشة مطلوبة",
        description: "يرجى رفع لقطة شاشة تؤكد الإيداع",
        variant: "destructive",
      });
      return;
    }
    
    try {
      setIsLoading(true);
      await depositRequest(parseFloat(amount), walletId, screenshot);
      setAmount('');
      setScreenshot(null);
      // Reset file input
      const fileInput = document.getElementById('screenshot') as HTMLInputElement;
      if (fileInput) fileInput.value = '';
    } catch (error) {
      console.error("Error making deposit request:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <CardSection title="C-Wallet إيداع">
      <form onSubmit={handleSubmit} className="space-y-4">
        {user && (
          <div className="space-y-2">
            <Label htmlFor="userEmail">البريد الإلكتروني</Label>
            <Input
              id="userEmail"
              value={user.email}
              readOnly
              className="bg-[#242C3E] border-[#2A3348] text-white"
            />
            <p className="text-sm text-muted-foreground">
              سيتم إضافة المبلغ لهذا الحساب بعد موافقة الإدارة
            </p>
          </div>
        )}
        
        <div className="space-y-2">
          <Label htmlFor="walletId">معرف المحفظة ID</Label>
          <Input
            id="walletId"
            value={walletId}
            readOnly
            className="bg-[#242C3E] border-[#2A3348] text-white"
          />
          <p className="text-sm text-muted-foreground">
            قم بتحويل USDT إلى معرف المحفظة أعلاه
          </p>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="amount">المبلغ (USDT)</Label>
          <Input
            id="amount"
            type="number"
            step="0.01"
            placeholder="أدخل مبلغ الإيداع"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            required
            className="bg-[#242C3E] border-[#2A3348] text-white"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="screenshot">لقطة شاشة للإثبات</Label>
          <Input
            id="screenshot"
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            required
            className="bg-[#242C3E] border-[#2A3348] text-white"
          />
          {screenshot && (
            <div className="mt-2 border border-[#2A3348] rounded-md p-2">
              <img 
                src={screenshot} 
                alt="لقطة شاشة للتحويل" 
                className="max-h-40 mx-auto rounded"
              />
            </div>
          )}
        </div>
        
        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? "جاري إرسال الطلب..." : "إرسال طلب الإيداع"}
        </Button>
      </form>
    </CardSection>
  );
};

export default DepositForm;
