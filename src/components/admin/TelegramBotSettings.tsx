
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from '@/hooks/use-toast';
import { MessageCircle, Save } from 'lucide-react';

const TelegramBotSettings = () => {
  const [botSettings, setBotSettings] = useState({
    botToken: '',
    botUsername: '',
    isEnabled: false,
    welcomeMessage: 'مرحباً بك في بوت محفظتنا! يمكنك استخدام هذا البوت للتحقق والحصول على إشعارات عن حسابك.',
  });
  const [isLoading, setIsLoading] = useState(false);
  
  useEffect(() => {
    // Load saved bot settings from localStorage if they exist
    const savedSettings = localStorage.getItem('telegramBotSettings');
    if (savedSettings) {
      setBotSettings(JSON.parse(savedSettings));
    }
  }, []);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setBotSettings(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      // Save settings to localStorage
      localStorage.setItem('telegramBotSettings', JSON.stringify(botSettings));
      
      toast({
        title: "تم حفظ الإعدادات بنجاح",
        description: "تم تحديث إعدادات بوت تلغرام",
      });
    } catch (error) {
      console.error('Error saving settings:', error);
      toast({
        title: "خطأ في حفظ الإعدادات",
        description: "يرجى المحاولة مرة أخرى",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <Card className="border-[#2A3348] bg-[#1A1E2C] shadow-md">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MessageCircle className="h-5 w-5 text-[#1E88E5]" />
          <span>إعدادات بوت تلغرام</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="botUsername">معرف البوت (مع @)</Label>
            <Input
              id="botUsername"
              name="botUsername"
              value={botSettings.botUsername}
              onChange={handleChange}
              placeholder="@example_bot"
              className="bg-[#242C3E] border-[#2A3348] text-white"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="botToken">رمز البوت (Bot Token)</Label>
            <Input
              id="botToken"
              name="botToken"
              value={botSettings.botToken}
              onChange={handleChange}
              placeholder="123456789:ABCDEFGHIJKLMNOPQRSTUVWXYZ"
              className="bg-[#242C3E] border-[#2A3348] text-white"
            />
            <p className="text-xs text-muted-foreground">
              يمكنك الحصول على رمز البوت من BotFather على تلغرام
            </p>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="welcomeMessage">رسالة الترحيب</Label>
            <Input
              id="welcomeMessage"
              name="welcomeMessage"
              value={botSettings.welcomeMessage}
              onChange={handleChange}
              placeholder="رسالة الترحيب للمستخدمين الجدد"
              className="bg-[#242C3E] border-[#2A3348] text-white"
            />
          </div>
          
          <div className="flex items-center space-x-2 rtl:space-x-reverse">
            <input
              type="checkbox"
              id="isEnabled"
              name="isEnabled"
              checked={botSettings.isEnabled}
              onChange={handleChange}
              className="h-4 w-4 rounded border-[#2A3348] bg-[#242C3E]"
            />
            <Label htmlFor="isEnabled" className="text-sm">تفعيل البوت</Label>
          </div>
          
          <Button 
            type="submit" 
            className="bg-[#1E88E5] hover:bg-[#1A237E] w-full"
            disabled={isLoading}
          >
            {isLoading ? "جاري الحفظ..." : (
              <>
                <Save className="ml-2" /> 
                حفظ الإعدادات
              </>
            )}
          </Button>
        </form>
        
        <div className="mt-6 p-4 bg-[#111827] rounded-lg">
          <h3 className="text-lg font-semibold mb-2 text-white">طريقة الإعداد:</h3>
          <ol className="list-decimal list-inside space-y-2 text-gray-300 text-sm">
            <li>افتح تطبيق تلغرام وابحث عن @BotFather</li>
            <li>أرسل الأمر /newbot واتبع التعليمات لإنشاء بوت جديد</li>
            <li>بعد إنشاء البوت، ستحصل على رمز البوت (Bot Token) واسم المستخدم الخاص به</li>
            <li>قم بإدخال هذه المعلومات هنا وتفعيل البوت</li>
            <li>سيتم استخدام البوت للتحقق من المستخدمين وإرسال إشعارات المعاملات</li>
          </ol>
        </div>
      </CardContent>
    </Card>
  );
};

export default TelegramBotSettings;
