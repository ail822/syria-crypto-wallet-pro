
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from '@/hooks/use-toast';
import { usePlatform } from '@/context/PlatformContext';
import { MessageCircle } from 'lucide-react';
import { sendTelegramMessage } from '@/utils/telegramBot';

const ForgotPassword = () => {
  const navigate = useNavigate();
  const { platformName } = usePlatform();
  
  const [email, setEmail] = useState('');
  const [step, setStep] = useState<'email' | 'telegram' | 'reset'>('email');
  const [userId, setUserId] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [generatedCode, setGeneratedCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [botUsername, setBotUsername] = useState('');
  
  useEffect(() => {
    // Load telegram bot settings to get the username
    const botSettings = localStorage.getItem('telegramBotSettings');
    if (botSettings) {
      const { botUsername } = JSON.parse(botSettings);
      if (botUsername) {
        setBotUsername(botUsername);
      }
    }
  }, []);

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
      
      // Generate random 6-digit code
      const code = Math.floor(100000 + Math.random() * 900000).toString();
      setGeneratedCode(code);
      
      // Send code to admin via Telegram
      const message = `🔑 *طلب استعادة كلمة المرور*\n\nرمز التحقق: \`${code}\`\nالبريد الإلكتروني: ${email}\nمعرف المستخدم: \`${user.id}\``;
      await sendTelegramMessage(message);
      
      // Move to telegram verification step
      setStep('telegram');
      
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

  const handleVerifyCode = () => {
    try {
      setIsLoading(true);
      
      if (verificationCode !== generatedCode) {
        toast({
          title: "رمز التحقق غير صحيح",
          description: "يرجى التحقق من الرمز وإعادة المحاولة",
          variant: "destructive",
        });
        return;
      }
      
      // Move to password reset step
      setStep('reset');
      
    } catch (error) {
      console.error('Error verifying code:', error);
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
      setIsLoading(true);
      
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
    } finally {
      setIsLoading(false);
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
              
              <Button 
                type="submit" 
                className="w-full bg-[#1E88E5] hover:bg-[#1A237E]" 
                disabled={isLoading}
              >
                {isLoading ? "جارٍ البحث..." : "متابعة"}
              </Button>
              
              <div className="text-center mt-4">
                <Link 
                  to="/login" 
                  className="text-sm text-[#1E88E5] hover:underline"
                >
                  العودة إلى تسجيل الدخول
                </Link>
              </div>
            </form>
          )}
          
          {step === 'telegram' && (
            <div className="space-y-6">
              <div className="flex justify-center mb-4">
                <MessageCircle className="w-16 h-16 text-[#1E88E5]" />
              </div>
              
              <h2 className="text-xl font-semibold text-center">التحقق عبر تلغرام</h2>
              <p className="text-center text-sm text-muted-foreground mb-6">
                تم إرسال رمز التحقق إلى المشرف عبر بوت التلغرام، يرجى الاتصال بالمشرف للحصول على الرمز
              </p>
              
              <div className="space-y-2 mt-4">
                <Label htmlFor="verification-code">رمز التحقق</Label>
                <Input
                  id="verification-code"
                  value={verificationCode}
                  onChange={(e) => setVerificationCode(e.target.value)}
                  placeholder="أدخل الرمز المكون من 6 أرقام"
                  className="bg-[#242C3E] border-[#2A3348] text-white text-center text-lg font-mono tracking-widest"
                  maxLength={6}
                />
                <p className="text-xs text-muted-foreground text-center">
                  أدخل الرمز الذي أرسلناه للمشرف على تلغرام
                </p>
              </div>
              
              <div className="space-y-4 pt-2">
                <Button 
                  onClick={handleVerifyCode} 
                  className="w-full bg-[#1E88E5] hover:bg-[#1A237E]" 
                  disabled={isLoading || verificationCode.length !== 6}
                >
                  {isLoading ? "جارٍ التحقق..." : "تحقق من الرمز"}
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
          
          {step === 'reset' && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-center">إعادة تعيين كلمة المرور</h2>
              <p className="text-center text-sm text-muted-foreground">
                أدخل كلمة المرور الجديدة
              </p>
              
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
              
              <Button 
                onClick={handleResetPassword} 
                className="w-full bg-[#1E88E5] hover:bg-[#1A237E]" 
                disabled={isLoading}
              >
                {isLoading ? "جاري إعادة التعيين..." : "إعادة تعيين كلمة المرور"}
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
