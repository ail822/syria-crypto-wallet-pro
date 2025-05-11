
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from '@/hooks/use-toast';
import { useAuth } from '@/context/AuthContext';
import CardSection from '../ui/card-section';

const PasswordChangeForm = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  
  const { user, updatePassword } = useAuth();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswordData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast({
        title: "خطأ في تسجيل الدخول",
        description: "يرجى تسجيل الدخول وإعادة المحاولة",
        variant: "destructive",
      });
      return;
    }
    
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast({
        title: "كلمة المرور غير متطابقة",
        description: "يرجى التأكد من تطابق كلمة المرور الجديدة",
        variant: "destructive",
      });
      return;
    }
    
    if (passwordData.newPassword.length < 6) {
      toast({
        title: "كلمة المرور قصيرة",
        description: "يجب أن تكون كلمة المرور 6 أحرف على الأقل",
        variant: "destructive",
      });
      return;
    }
    
    try {
      setIsLoading(true);
      
      const success = await updatePassword(
        user.id, 
        passwordData.currentPassword, 
        passwordData.newPassword
      );
      
      if (success) {
        toast({ title: "تم تغيير كلمة المرور بنجاح" });
        setPasswordData({
          currentPassword: '',
          newPassword: '',
          confirmPassword: '',
        });
      } else {
        toast({
          title: "فشل تغيير كلمة المرور",
          description: "تأكد من صحة كلمة المرور الحالية وحاول مرة أخرى",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "فشل تغيير كلمة المرور",
        description: "تأكد من صحة كلمة المرور الحالية وحاول مرة أخرى",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <CardSection title="تغيير كلمة المرور">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="currentPassword">كلمة المرور الحالية</Label>
          <Input
            id="currentPassword"
            name="currentPassword"
            type="password"
            value={passwordData.currentPassword}
            onChange={handleChange}
            placeholder="أدخل كلمة المرور الحالية"
            required
            className="bg-[#242C3E] border-[#2A3348] text-white"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="newPassword">كلمة المرور الجديدة</Label>
          <Input
            id="newPassword"
            name="newPassword"
            type="password"
            value={passwordData.newPassword}
            onChange={handleChange}
            placeholder="أدخل كلمة المرور الجديدة"
            required
            className="bg-[#242C3E] border-[#2A3348] text-white"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="confirmPassword">تأكيد كلمة المرور الجديدة</Label>
          <Input
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            value={passwordData.confirmPassword}
            onChange={handleChange}
            placeholder="أعد إدخال كلمة المرور الجديدة"
            required
            className="bg-[#242C3E] border-[#2A3348] text-white"
          />
        </div>
        
        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? "جاري تغيير كلمة المرور..." : "تغيير كلمة المرور"}
        </Button>
      </form>
    </CardSection>
  );
};

export default PasswordChangeForm;
