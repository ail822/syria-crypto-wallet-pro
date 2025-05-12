
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp';
import { toast } from '@/hooks/use-toast';
import { usePlatform } from '@/context/PlatformContext';
import { useTwoFactor } from '@/hooks/useTwoFactor';
import { MessageCircle, Shield } from 'lucide-react';

const ForgotPassword = () => {
  const navigate = useNavigate();
  const { platformName } = usePlatform();
  
  const [email, setEmail] = useState('');
  const [telegramId, setTelegramId] = useState('');
  const [step, setStep] = useState<'email' | '2fa' | 'telegram'>('email');
  const [userId, setUserId] = useState('');
  const [token, setToken] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  const { verifyToken } = useTwoFactor(userId);

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setIsLoading(true);
      
      // Find user by email
      const registeredUsersJSON = localStorage.getItem('registeredUsers');
      if (!registeredUsersJSON) {
        toast({
          title: "البريد الإلكتروني غير موجود",
          description: "لا يوجد مستخدم بهذا البريد الإلكتروني",
          variant: "destructive",
        });
        return;
      }
      
      const registeredUsers = JSON.parse(registeredUsersJSON);
      const user = registeredUsers.find((u: any) => u.email.toLowerCase() === email.toLowerCase());
      
      if (!user) {
        toast({
          title: "البريد الإلكتروني غير موجود",
          description: "لا يوجد مستخدم بهذا البريد الإلكتروني",
          variant: "destructive",
        });
        return;
      }
      
      setUserId(user.id);
      
      // Check if user has 2FA enabled
      const twoFactorData = localStorage.getItem(`2fa_${user.id}`);
      if (twoFactorData) {
        const parsed = JSON.parse(twoFactorData);
        if (parsed.isEnabled) {
          setStep('2fa');
          return;
        }
      }
      
      // Check if user has Telegram ID
      if (user.telegramId) {
        setStep('telegram');
        return;
      }
      
      toast({
        title: "لا يمكن إعادة تعيين كلمة المرور",
        description: "لا يوجد طرق تحقق مفعلة لهذا الحساب. الرجاء التواصل مع الدعم الفني.",
        variant: "destructive",
      });
      
    } catch (error) {
      console.error('Error finding user:', error);
      toast({
        title: "حدث خطأ",
        description: "الرجاء المحاولة مرة أخرى",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handle2FAVerify = () => {
    try {
      setIsLoading(true);
      
      if (token.length !== 6) {
        toast({
          title: "الرمز غير صحيح",
          description: "يرجى إدخال رمز مكون من 6 أرقام",
          variant: "destructive",
        });
        return;
      }
      
      const isValid = verifyToken(token);
      
      if (!isValid) {
        toast({
          title: "الرمز غير صحيح",
          description: "يرجى التحقق من الرمز وإعادة المحاولة",
          variant: "destructive",
        });
        return;
      }
      
      // If 2FA is valid, allow password reset
      handleResetPassword();
      
    } catch (error) {
      console.error('Error verifying 2FA:', error);
      toast({
        title: "حدث خطأ",
        description: "الرجاء المحاولة مرة أخرى",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleTelegramVerify = () => {
    try {
      setIsLoading(true);
      
      // Find user by ID
      const registeredUsersJSON = localStorage.getItem('registeredUsers');
      if (!registeredUsersJSON) {
        toast({
          title: "حدث خطأ",
          description: "لا يمكن التحقق من المستخدم",
          variant: "destructive",
        });
        return;
      }
      
      const registeredUsers = JSON.parse(registeredUsersJSON);
      const user = registeredUsers.find((u: any) => u.id === userId);
      
      if (!user) {
        toast({
          title: "حدث خطأ",
          description: "المستخدم غير موجود",
          variant: "destructive",
        });
        return;
      }
      
      // Verify Telegram ID
      if (user.telegramId !== telegramId) {
        toast({
          title: "معرف تلغرام غير صحيح",
          description: "الرجاء التحقق من معرف تلغرام وإعادة المحاولة",
          variant: "destructive",
        });
        return;
      }
      
      // If Telegram ID is valid, allow password reset
      handleResetPassword();
      
    } catch (error) {
      console.error('Error verifying Telegram ID:', error);
      toast({
        title: "حدث خطأ",
        description: "الرجاء المحاولة مرة أخرى",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPassword = () => {
    if (newPassword.length < 6) {
      toast({
        title: "كلمة المرور قصيرة جدًا",
        description: "يجب أن تكون كلمة المرور 6 أحرف على الأقل",
        variant: "destructive",
      });
      return;
    }
    
    if (newPassword !== confirmPassword) {
      toast({
        title: "كلمات المرور غير متطابقة",
        description: "يرجى التأكد من تطابق كلمات المرور",
        variant: "destructive",
      });
      return;
    }
    
    try {
      // Update user password
      const registeredUsersJSON = localStorage.getItem('registeredUsers');
      if (!registeredUsersJSON) {
        toast({
          title: "حدث خطأ",
          description: "لا يمكن تحديث كلمة المرور",
          variant: "destructive",
        });
        return;
      }
      
      const registeredUsers = JSON.parse(registeredUsersJSON);
      const updatedUsers = registeredUsers.map((u: any) => {
        if (u.id === userId) {
          return { ...u, password: newPassword };
        }
        return u;
      });
      
      localStorage.setItem('registeredUsers', JSON.stringify(updatedUsers));
      
      toast({
        title: "تم إعادة تعيين كلمة المرور بنجاح",
        description: "يمكنك الآن تسجيل الدخول باستخدام كلمة المرور الجديدة",
      });
      
      // Redirect to login page
      setTimeout(() => {
        navigate('/login');
      }, 2000);
      
    } catch (error) {
      console.error('Error resetting password:', error);
      toast({
        title: "حدث خطأ",
        description: "الرجاء المحاولة مرة أخرى",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center gradient-bg">
      <div className="w-full max-w-md p-6 animate-slide-in">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">{platformName}</h1>
          <p className="text-muted-foreground">استعادة كلمة المرور</p>
        </div>
        
        <div className="bg-[#1A1E2C] rounded-xl border border-[#2A3348] p-6 shadow-lg">
          {step === 'email' && (
            <form onSubmit={handleEmailSubmit} className="space-y-4">
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
              
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "جارٍ البحث..." : "متابعة"}
              </Button>
              
              <div className="text-center mt-4">
                <Link to="/login" className="text-sm text-primary hover:underline">
                  العودة إلى تسجيل الدخول
                </Link>
              </div>
            </form>
          )}
          
          {step === '2fa' && (
            <div className="space-y-6">
              <div className="flex justify-center mb-4">
                <Shield className="w-16 h-16 text-primary/80" />
              </div>
              
              <h2 className="text-xl font-semibold text-center">التحقق بخطوتين</h2>
              <p className="text-center text-sm text-muted-foreground">
                أدخل رمز التحقق من تطبيق المصادقة الخاص بك
              </p>
              
              <div className="flex justify-center py-2">
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
              
              <div className="space-y-2">
                <Label htmlFor="new-password">كلمة المرور الجديدة</Label>
                <Input
                  id="new-password"
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="أدخل كلمة المرور الجديدة"
                  required
                  className="bg-[#242C3E] border-[#2A3348] text-white"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="confirm-password">تأكيد كلمة المرور</Label>
                <Input
                  id="confirm-password"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="أكد كلمة المرور الجديدة"
                  required
                  className="bg-[#242C3E] border-[#2A3348] text-white"
                />
              </div>
              
              <div className="space-y-4 pt-2">
                <Button 
                  onClick={handle2FAVerify} 
                  className="w-full" 
                  disabled={isLoading || token.length !== 6}
                >
                  {isLoading ? "جارٍ التحقق..." : "تحقق وإعادة تعيين كلمة المرور"}
                </Button>
                
                <Button 
                  variant="ghost"
                  onClick={() => setStep('email')} 
                  className="w-full"
                  disabled={isLoading}
                >
                  العودة
                </Button>
              </div>
            </div>
          )}
          
          {step === 'telegram' && (
            <div className="space-y-6">
              <div className="flex justify-center mb-4">
                <MessageCircle className="w-16 h-16 text-primary/80" />
              </div>
              
              <h2 className="text-xl font-semibold text-center">التحقق عبر تلغرام</h2>
              <p className="text-center text-sm text-muted-foreground">
                أدخل معرف تلغرام المرتبط بحسابك
              </p>
              
              <div className="space-y-2">
                <Label htmlFor="telegram-id">معرف تلغرام</Label>
                <Input
                  id="telegram-id"
                  value={telegramId}
                  onChange={(e) => setTelegramId(e.target.value)}
                  placeholder="أدخل معرف تلغرام الخاص بك"
                  required
                  className="bg-[#242C3E] border-[#2A3348] text-white"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="new-password">كلمة المرور الجديدة</Label>
                <Input
                  id="new-password"
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="أدخل كلمة المرور الجديدة"
                  required
                  className="bg-[#242C3E] border-[#2A3348] text-white"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="confirm-password">تأكيد كلمة المرور</Label>
                <Input
                  id="confirm-password"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="أكد كلمة المرور الجديدة"
                  required
                  className="bg-[#242C3E] border-[#2A3348] text-white"
                />
              </div>
              
              <div className="space-y-4 pt-2">
                <Button 
                  onClick={handleTelegramVerify} 
                  className="w-full" 
                  disabled={isLoading || !telegramId.trim()}
                >
                  {isLoading ? "جارٍ التحقق..." : "تحقق وإعادة تعيين كلمة المرور"}
                </Button>
                
                <Button 
                  variant="ghost"
                  onClick={() => setStep('email')} 
                  className="w-full"
                  disabled={isLoading}
                >
                  العودة
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
