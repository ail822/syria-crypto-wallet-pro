
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from '@/hooks/use-toast';
import { useAuth } from '@/context/AuthContext';

const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setIsLoading(true);
      await login(email, password);
      toast({ title: "تم تسجيل الدخول بنجاح" });
      navigate('/');
    } catch (error) {
      if (error instanceof Error) {
        toast({
          title: "فشل تسجيل الدخول",
          description: error.message || "تحقق من بياناتك وحاول مرة أخرى",
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
        <div className="flex justify-between items-center">
          <Label htmlFor="password">كلمة المرور</Label>
          <a href="#" className="text-xs text-primary hover:underline">
            نسيت كلمة المرور؟
          </a>
        </div>
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
      
      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? "جاري تسجيل الدخول..." : "تسجيل الدخول"}
      </Button>
      
      <div className="text-center">
        <p className="text-sm text-muted-foreground">
          ليس لديك حساب؟{" "}
          <a href="/register" className="text-primary hover:underline">
            إنشاء حساب جديد
          </a>
        </p>
      </div>
    </form>
  );
};

export default LoginForm;
