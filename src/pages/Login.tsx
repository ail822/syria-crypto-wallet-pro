
import React, { useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from '@/hooks/use-toast';
import { usePlatform } from '@/context/PlatformContext';
import { useAuth } from '@/context/AuthContext';
import { Checkbox } from '@/components/ui/checkbox';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [skipTelegramVerify, setSkipTelegramVerify] = useState(false);
  
  const navigate = useNavigate();
  const { platformName } = usePlatform();
  const { login, isAuthenticated } = useAuth();
  
  // Redirect if already authenticated
  if (isAuthenticated) {
    return <Navigate to="/" />;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setIsLoading(true);
      const result = await login(email, password);
      
      // تخطي التحقق بالتلجرام إذا تم اختياره
      if (result.requiresTwoFactor && !skipTelegramVerify) {
        // Redirect to 2FA page
        navigate('/verify-2fa', { 
          state: { 
            userId: result.userId,
            // Redirect to dashboard after successful 2FA
            redirectTo: '/' 
          }
        });
        return;
      }
      
      // If login successful and no 2FA required, or if skipped
      // navigation will happen automatically
      
    } catch (error) {
      if (error instanceof Error) {
        toast({
          title: "فشل تسجيل الدخول",
          description: error.message,
          variant: "destructive",
        });
      } else {
        toast({
          title: "فشل تسجيل الدخول",
          description: "حدث خطأ أثناء تسجيل الدخول",
          variant: "destructive",
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-purple-900 to-purple-700">
      <div className="w-full max-w-md p-6 animate-slide-in">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">{platformName}</h1>
          <p className="text-gray-200">تسجيل الدخول إلى حسابك</p>
        </div>
        
        <div className="bg-[#1A1E2C] rounded-xl border border-[#2A3348] p-6 shadow-lg">
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
                autoComplete="email"
              />
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">كلمة المرور</Label>
                <Link 
                  to="/forgot-password"
                  className="text-xs text-purple-400 hover:underline"
                >
                  نسيت كلمة المرور؟
                </Link>
              </div>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="أدخل كلمة المرور"
                required
                className="bg-[#242C3E] border-[#2A3348] text-white"
                autoComplete="current-password"
              />
            </div>
            
            {/* إضافة خيار تخطي التحقق بالتلجرام */}
            <div className="flex items-center space-x-2 rtl:space-x-reverse">
              <Checkbox 
                id="skipTelegramVerify" 
                checked={skipTelegramVerify}
                onCheckedChange={(checked) => setSkipTelegramVerify(checked === true)}
              />
              <Label htmlFor="skipTelegramVerify" className="text-sm cursor-pointer">
                تخطي التحقق عبر تلجرام
              </Label>
            </div>
            
            <Button type="submit" className="w-full bg-purple-600 hover:bg-purple-700" disabled={isLoading}>
              {isLoading ? "جارٍ تسجيل الدخول..." : "تسجيل الدخول"}
            </Button>
          </form>
          
          <div className="mt-6 text-center text-sm">
            <span className="text-muted-foreground">ليس لديك حساب؟</span>{' '}
            <Link to="/register" className="text-purple-400 hover:underline">
              إنشاء حساب جديد
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
