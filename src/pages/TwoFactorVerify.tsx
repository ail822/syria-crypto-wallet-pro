
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';
import { usePlatform } from '@/context/PlatformContext';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp';
import { useTwoFactor } from '@/hooks/useTwoFactor';
import { Shield } from 'lucide-react';

const TwoFactorVerify = () => {
  const [token, setToken] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { platformName } = usePlatform();
  
  // Extract user ID and redirect path from state
  const userId = location.state?.userId;
  const redirectTo = location.state?.redirectTo || '/';
  
  const { verifyToken } = useTwoFactor(userId || '');
  
  // If no user ID is provided, redirect to login
  useEffect(() => {
    if (!userId) {
      navigate('/login');
    }
  }, [userId, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (token.length !== 6) {
      toast({
        title: "الرمز غير صحيح",
        description: "يرجى إدخال رمز مكون من 6 أرقام",
        variant: "destructive",
      });
      return;
    }
    
    try {
      setIsLoading(true);
      
      const isValid = verifyToken(token);
      
      if (isValid) {
        // Store a session token in localStorage to indicate successful 2FA
        localStorage.setItem('2fa_verified', 'true');
        localStorage.setItem('2fa_time', Date.now().toString());
        
        // Navigate to the redirect path or dashboard
        navigate(redirectTo);
        
        toast({ title: "تم التحقق بنجاح" });
      } else {
        toast({
          title: "الرمز غير صحيح",
          description: "يرجى التحقق من الرمز وإعادة المحاولة",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "حدث خطأ",
        description: "يرجى المحاولة مرة أخرى",
        variant: "destructive",
      });
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center gradient-bg">
      <div className="w-full max-w-md p-6 animate-fade-in">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">{platformName}</h1>
          <p className="text-muted-foreground">التحقق الثنائي</p>
        </div>
        
        <div className="bg-[#1A1E2C] rounded-xl border border-[#2A3348] p-6 shadow-lg">
          <div className="flex justify-center mb-6">
            <div className="bg-primary/20 p-4 rounded-full">
              <Shield className="h-8 w-8 text-primary" />
            </div>
          </div>
          
          <h2 className="text-xl font-bold text-center mb-4">أدخل رمز التحقق</h2>
          <p className="text-sm text-muted-foreground text-center mb-6">
            يرجى إدخال رمز المصادقة من تطبيق Google Authenticator
          </p>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="flex justify-center">
              <InputOTP maxLength={6} value={token} onChange={setToken}>
                <InputOTPGroup>
                  <InputOTPSlot index={0} />
                  <InputOTPSlot index={1} />
                  <InputOTPSlot index={2} />
                  <InputOTPSlot index={3} />
                  <InputOTPSlot index={4} />
                  <InputOTPSlot index={5} />
                </InputOTPGroup>
              </InputOTP>
            </div>
            
            <Button type="submit" className="w-full" disabled={token.length !== 6 || isLoading}>
              {isLoading ? "جارٍ التحقق..." : "تحقق"}
            </Button>
            
            <div className="text-center">
              <p className="text-sm text-muted-foreground">
                واجهت مشكلة؟{" "}
                <a href="/login" className="text-primary hover:underline">
                  العودة لتسجيل الدخول
                </a>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default TwoFactorVerify;
