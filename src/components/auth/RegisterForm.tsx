
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from '@/hooks/use-toast';
import { useAuth } from '@/context/AuthContext';

const RegisterForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    telegramId: '',
    phoneNumber: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      toast({
        title: "كلمة المرور غير متطابقة",
        description: "يرجى التأكد من تطابق كلمة المرور",
        variant: "destructive",
      });
      return;
    }
    
    try {
      setIsLoading(true);
      await register({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        telegramId: formData.telegramId || undefined,
        phoneNumber: formData.phoneNumber || undefined,
      });
      toast({ title: "تم إنشاء الحساب بنجاح" });
      navigate('/');
    } catch (error) {
      if (error instanceof Error) {
        toast({
          title: "فشل إنشاء الحساب",
          description: error.message || "حدث خطأ أثناء إنشاء الحساب",
          variant: "destructive",
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">الاسم الكامل</Label>
        <Input
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="أدخل اسمك الكامل"
          required
          className="bg-[#242C3E] border-[#2A3348] text-white"
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="email">البريد الإلكتروني</Label>
        <Input
          id="email"
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="أدخل بريدك الإلكتروني"
          required
          className="bg-[#242C3E] border-[#2A3348] text-white"
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="password">كلمة المرور</Label>
        <Input
          id="password"
          name="password"
          type="password"
          value={formData.password}
          onChange={handleChange}
          placeholder="أدخل كلمة المرور"
          required
          className="bg-[#242C3E] border-[#2A3348] text-white"
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="confirmPassword">تأكيد كلمة المرور</Label>
        <Input
          id="confirmPassword"
          name="confirmPassword"
          type="password"
          value={formData.confirmPassword}
          onChange={handleChange}
          placeholder="أعد إدخال كلمة المرور"
          required
          className="bg-[#242C3E] border-[#2A3348] text-white"
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="telegramId">معرف تلغرام (اختياري)</Label>
        <div className="flex">
          <span className="inline-flex items-center px-3 rounded-r-none rounded-md border border-l-0 border-[#2A3348] bg-[#1E293B] text-white">
            @
          </span>
          <Input
            id="telegramId"
            name="telegramId"
            value={formData.telegramId}
            onChange={handleChange}
            placeholder="معرف تلغرام الخاص بك"
            className="rounded-r-none bg-[#242C3E] border-[#2A3348] text-white"
          />
        </div>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="phoneNumber">رقم الهاتف (اختياري)</Label>
        <Input
          id="phoneNumber"
          name="phoneNumber"
          type="tel"
          value={formData.phoneNumber}
          onChange={handleChange}
          placeholder="مثال: +963912345678"
          className="bg-[#242C3E] border-[#2A3348] text-white"
        />
      </div>
      
      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? "جاري إنشاء الحساب..." : "إنشاء حساب"}
      </Button>
      
      <div className="text-center">
        <p className="text-sm text-muted-foreground">
          لديك حساب بالفعل؟{" "}
          <a href="/login" className="text-primary hover:underline">
            تسجيل الدخول
          </a>
        </p>
      </div>
    </form>
  );
};

export default RegisterForm;
