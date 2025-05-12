
import React, { useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from '@/hooks/use-toast';
import { AlertCircle } from 'lucide-react';
import { usePlatform } from '@/context/PlatformContext';

const RegisterForm = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [telegramId, setTelegramId] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const navigate = useNavigate();
  const { register } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      toast({
        title: "كلمات المرور غير متطابقة",
        description: "يرجى التأكد من تطابق كلمات المرور",
        variant: "destructive",
      });
      return;
    }
    
    if (password.length < 6) {
      toast({
        title: "كلمة المرور قصيرة جدًا",
        description: "يجب أن تكون كلمة المرور 6 أحرف على الأقل",
        variant: "destructive",
      });
      return;
    }

    // Validate Telegram ID (required now)
    if (!telegramId.trim()) {
      toast({
        title: "معرف تلغرام مطلوب",
        description: "يرجى إدخال معرف تلغرام الخاص بك",
        variant: "destructive",
      });
      return;
    }
    
    try {
      setIsLoading(true);
      await register(name, email, password, phoneNumber, telegramId);
      
      toast({
        title: "تم إنشاء الحساب بنجاح",
        description: "يرجى تسجيل الدخول للمتابعة",
      });
      
      navigate('/login');
    } catch (error) {
      if (error instanceof Error) {
        toast({
          title: "فشل التسجيل",
          description: error.message,
          variant: "destructive",
        });
      } else {
        toast({
          title: "فشل التسجيل",
          description: "حدث خطأ أثناء إنشاء الحساب",
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
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="أدخل اسمك الكامل"
          required
          className="bg-[#242C3E] border-[#2A3348] text-white"
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="email">البريد الإلكتروني</Label>
        <Input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="أدخل بريدك الإلكتروني"
          required
          className="bg-[#242C3E] border-[#2A3348] text-white"
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="phoneNumber">رقم الهاتف (اختياري)</Label>
        <Input
          id="phoneNumber"
          value={phoneNumber}
          onChange={(e) => setPhoneNumber(e.target.value)}
          placeholder="أدخل رقم هاتفك"
          className="bg-[#242C3E] border-[#2A3348] text-white"
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="telegramId">معرف تلغرام</Label>
        <Input
          id="telegramId"
          value={telegramId}
          onChange={(e) => setTelegramId(e.target.value)}
          placeholder="أدخل معرف تلغرام الخاص بك"
          required
          className="bg-[#242C3E] border-[#2A3348] text-white"
        />
        <p className="text-xs flex items-center text-muted-foreground">
          <AlertCircle className="w-3 h-3 mr-1" />
          يرجى ربط البوت في حسابك لكي تتمكن من استعادة الدخول واستلام إشعارات المعاملات
        </p>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="password">كلمة المرور</Label>
        <Input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="أدخل كلمة المرور"
          required
          className="bg-[#242C3E] border-[#2A3348] text-white"
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="confirmPassword">تأكيد كلمة المرور</Label>
        <Input
          id="confirmPassword"
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          placeholder="أكد كلمة المرور"
          required
          className="bg-[#242C3E] border-[#2A3348] text-white"
        />
      </div>
      
      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? "جارٍ التسجيل..." : "إنشاء حساب"}
      </Button>
      
      <div className="mt-4 text-center text-sm">
        <span className="text-muted-foreground">لديك حساب بالفعل؟</span>{' '}
        <Link to="/login" className="text-primary hover:underline">
          تسجيل الدخول
        </Link>
      </div>
    </form>
  );
};

const Register = () => {
  const { isAuthenticated } = useAuth();
  const { platformName } = usePlatform();
  
  if (isAuthenticated) {
    return <Navigate to="/" />;
  }

  return (
    <div className="min-h-screen flex items-center justify-center gradient-bg">
      <div className="w-full max-w-md p-6 animate-slide-in">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">{platformName}</h1>
          <p className="text-muted-foreground">إنشاء حساب جديد</p>
        </div>
        
        <div className="bg-[#1A1E2C] rounded-xl border border-[#2A3348] p-6 shadow-lg">
          <RegisterForm />
        </div>
      </div>
    </div>
  );
};

export default Register;
