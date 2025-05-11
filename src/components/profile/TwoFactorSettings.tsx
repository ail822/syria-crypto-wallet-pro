
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { useAuth } from '@/context/AuthContext';
import { useTwoFactor } from '@/hooks/useTwoFactor';
import { toast } from '@/hooks/use-toast';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp';
import QRCode from 'qrcode.react';
import CardSection from '../ui/card-section';

const TwoFactorSettings = () => {
  const { user } = useAuth();
  const [isEnabling, setIsEnabling] = useState(false);
  const [isDisabling, setIsDisabling] = useState(false);
  const [token, setToken] = useState('');
  const { twoFactorData, enableTwoFactor, disableTwoFactor, generateNewSecret } = useTwoFactor(user?.id ?? '');

  const handleEnableClick = () => {
    setIsEnabling(true);
  };

  const handleDisableClick = () => {
    setIsDisabling(true);
  };

  const handleCancelClick = () => {
    setIsEnabling(false);
    setIsDisabling(false);
    setToken('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isEnabling) {
      const success = enableTwoFactor(token);
      if (success) {
        toast({ title: "تم تفعيل المصادقة الثنائية بنجاح" });
        setIsEnabling(false);
      } else {
        toast({ 
          title: "فشل تفعيل المصادقة الثنائية", 
          description: "تأكد من إدخال الرمز الصحيح",
          variant: "destructive" 
        });
      }
    } else if (isDisabling) {
      const success = disableTwoFactor(token);
      if (success) {
        toast({ title: "تم إيقاف المصادقة الثنائية بنجاح" });
        setIsDisabling(false);
      } else {
        toast({ 
          title: "فشل إيقاف المصادقة الثنائية", 
          description: "تأكد من إدخال الرمز الصحيح",
          variant: "destructive" 
        });
      }
    }
    
    setToken('');
  };
  
  const handleRegenerateSecret = () => {
    if (window.confirm('سيؤدي إعادة توليد المفتاح السري إلى إيقاف المصادقة الثنائية. هل أنت متأكد؟')) {
      generateNewSecret();
      toast({ title: "تم إعادة توليد المفتاح السري بنجاح" });
    }
  };

  return (
    <CardSection title="المصادقة الثنائية">
      <div className="space-y-6">
        {!isEnabling && !isDisabling ? (
          <>
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-medium">المصادقة الثنائية</h3>
                <p className="text-sm text-muted-foreground">
                  حماية حسابك بإضافة طبقة أمان إضافية عند تسجيل الدخول
                </p>
              </div>
              <Switch checked={twoFactorData?.isEnabled} disabled className="data-[state=checked]:bg-green-500" />
            </div>
            
            <div className="p-4 bg-amber-900/20 rounded-md border border-amber-800/30 mb-6">
              <p className="text-sm text-amber-300">
                {twoFactorData?.isEnabled 
                  ? "المصادقة الثنائية مفعلة. ستحتاج إلى إدخال رمز من تطبيق Google Authenticator في كل مرة تقوم فيها بتسجيل الدخول."
                  : "المصادقة الثنائية غير مفعلة. نوصي بتفعيلها لزيادة أمان حسابك."
                }
              </p>
            </div>
            
            <div className="flex justify-end space-x-3 space-x-reverse">
              {twoFactorData?.isEnabled ? (
                <Button onClick={handleDisableClick} variant="destructive">إيقاف المصادقة الثنائية</Button>
              ) : (
                <Button onClick={handleEnableClick}>تفعيل المصادقة الثنائية</Button>
              )}
            </div>
          </>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            {isEnabling && (
              <div className="space-y-4">
                <h3 className="text-xl font-medium">تفعيل المصادقة الثنائية</h3>
                <p className="text-sm text-muted-foreground">
                  امسح رمز QR التالي باستخدام تطبيق Google Authenticator أو أي تطبيق TOTP آخر.
                </p>
                
                <div className="flex justify-center my-6 bg-white p-4 rounded-lg">
                  {twoFactorData?.qrCodeUrl && (
                    <QRCode value={twoFactorData.qrCodeUrl} size={200} />
                  )}
                </div>
                
                <div className="p-4 bg-blue-900/20 rounded-md border border-blue-800/30">
                  <p className="text-sm text-blue-300">
                    يمكنك إدخال هذا المفتاح يدويًا في التطبيق إذا لم تتمكن من مسح الرمز:
                  </p>
                  <p className="text-sm font-mono bg-blue-900/30 p-2 rounded mt-2 text-center select-all">
                    {twoFactorData?.secret}
                  </p>
                </div>
              </div>
            )}
            
            {isDisabling && (
              <div>
                <h3 className="text-xl font-medium">إيقاف المصادقة الثنائية</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  للتأكيد، يرجى إدخال الرمز الحالي من تطبيق المصادقة.
                </p>
              </div>
            )}
            
            <div className="space-y-2">
              <label className="block text-sm font-medium">
                أدخل الرمز المؤقت من تطبيق المصادقة:
              </label>
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
            </div>
            
            <div className="flex justify-end space-x-3 space-x-reverse">
              <Button type="button" variant="outline" onClick={handleCancelClick}>إلغاء</Button>
              <Button type="submit" disabled={token.length !== 6}>
                {isEnabling ? "تفعيل" : "إيقاف"}
              </Button>
            </div>
          </form>
        )}
        
        {twoFactorData?.isEnabled && !isEnabling && !isDisabling && (
          <div className="mt-6 pt-6 border-t border-border">
            <h3 className="text-lg font-medium mb-2">إعادة ضبط المصادقة الثنائية</h3>
            <p className="text-sm text-muted-foreground mb-4">
              إذا فقدت الوصول إلى تطبيق المصادقة، يمكنك إعادة ضبط المفتاح السري. سيؤدي هذا إلى إيقاف المصادقة الثنائية حتى تقوم بتفعيلها مرة أخرى.
            </p>
            <Button variant="outline" onClick={handleRegenerateSecret}>
              إعادة توليد المفتاح السري
            </Button>
          </div>
        )}
      </div>
    </CardSection>
  );
};

export default TwoFactorSettings;
