
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { toast } from '@/hooks/use-toast';
import { MessageCircle, CheckCircle, AlertCircle } from 'lucide-react';
import { 
  loadTelegramConfig, 
  enableTelegramBot, 
  disableTelegramBot, 
  sendTelegramMessage 
} from '@/utils/telegramBot';
import CardSection from '@/components/ui/card-section';

const TelegramBotSettings = () => {
  const [config, setConfig] = useState({
    enabled: false,
    adminId: '',
    token: '',
    lastSyncTime: 0
  });
  const [isLoading, setIsLoading] = useState(false);
  const [testMessage, setTestMessage] = useState('');

  // Load configuration on mount
  useEffect(() => {
    const savedConfig = loadTelegramConfig();
    setConfig(savedConfig);
  }, []);

  const handleEnableBot = async () => {
    try {
      setIsLoading(true);
      
      // Validate admin ID
      if (!config.adminId.trim()) {
        toast({
          title: "معرف الإدارة مطلوب",
          description: "يرجى إدخال معرف الإدارة",
          variant: "destructive",
        });
        return;
      }
      
      // Validate token
      if (!config.token.trim()) {
        toast({
          title: "رمز البوت مطلوب",
          description: "يرجى إدخال رمز البوت من @BotFather",
          variant: "destructive",
        });
        return;
      }
      
      const success = enableTelegramBot(config.adminId, config.token);
      
      if (success) {
        // Refresh config
        const updatedConfig = loadTelegramConfig();
        setConfig(updatedConfig);
        
        toast({
          title: "تم تفعيل البوت بنجاح",
        });
      } else {
        toast({
          title: "فشل تفعيل البوت",
          description: "تأكد من أن معرف الإدارة صحيح (يجب أن يكون 904718229)",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error(error);
      toast({
        title: "حدث خطأ",
        description: "يرجى المحاولة مرة أخرى",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDisableBot = async () => {
    try {
      setIsLoading(true);
      
      const success = disableTelegramBot(config.adminId);
      
      if (success) {
        // Refresh config
        const updatedConfig = loadTelegramConfig();
        setConfig(updatedConfig);
        
        toast({
          title: "تم إيقاف البوت بنجاح",
        });
      } else {
        toast({
          title: "فشل إيقاف البوت",
          description: "تأكد من أنك تملك الصلاحيات اللازمة",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error(error);
      toast({
        title: "حدث خطأ",
        description: "يرجى المحاولة مرة أخرى",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendTestMessage = async () => {
    try {
      setIsLoading(true);
      
      if (!testMessage.trim()) {
        toast({
          title: "الرسالة فارغة",
          description: "يرجى إدخال رسالة الاختبار",
          variant: "destructive",
        });
        return;
      }
      
      const success = await sendTelegramMessage(testMessage);
      
      if (success) {
        toast({
          title: "تم إرسال الرسالة بنجاح",
        });
        setTestMessage('');
      } else {
        toast({
          title: "فشل إرسال الرسالة",
          description: "تأكد من تكوين البوت بشكل صحيح",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error(error);
      toast({
        title: "حدث خطأ",
        description: "يرجى المحاولة مرة أخرى",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <CardSection title="إعدادات بوت التلغرام">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-medium">حالة الاتصال</h3>
            <p className="text-sm text-muted-foreground">
              {config.enabled 
                ? `آخر اتصال: ${new Date(config.lastSyncTime).toLocaleString('ar-SA')}`
                : "البوت غير مفعل"
              }
            </p>
          </div>
          <div className="flex items-center">
            <span className={`mr-2 ${config.enabled ? "text-green-500" : "text-gray-500"}`}>
              {config.enabled ? <CheckCircle className="h-5 w-5" /> : <AlertCircle className="h-5 w-5" />}
            </span>
            <Switch checked={config.enabled} disabled />
          </div>
        </div>
        
        <Alert className={config.enabled ? "border-green-500 bg-green-500/10" : "border-amber-500 bg-amber-500/10"}>
          <MessageCircle className={`h-4 w-4 ${config.enabled ? "text-green-500" : "text-amber-500"}`} />
          <AlertTitle>
            {config.enabled ? "البوت نشط" : "البوت غير نشط"}
          </AlertTitle>
          <AlertDescription>
            {config.enabled 
              ? "البوت متصل ويرسل النسخ الاحتياطية بنجاح"
              : "البوت غير متصل حاليًا. قم بالتفعيل أدناه"
            }
          </AlertDescription>
        </Alert>
        
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="adminId">معرف الإدارة</Label>
            <Input
              id="adminId"
              value={config.adminId}
              onChange={(e) => setConfig({...config, adminId: e.target.value})}
              placeholder="أدخل معرف الإدارة"
              className="bg-[#242C3E] border-[#2A3348] text-white"
            />
            <p className="text-sm text-muted-foreground">
              يجب أن يكون المعرف 904718229 للتفعيل
            </p>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="botToken">رمز البوت (Bot Token)</Label>
            <Input
              id="botToken"
              value={config.token}
              onChange={(e) => setConfig({...config, token: e.target.value})}
              placeholder="أدخل رمز البوت من @BotFather"
              className="bg-[#242C3E] border-[#2A3348] text-white"
            />
          </div>
          
          <div className="flex gap-3">
            {config.enabled ? (
              <Button
                variant="destructive"
                onClick={handleDisableBot}
                disabled={isLoading}
                className="flex-1"
              >
                إيقاف البوت
              </Button>
            ) : (
              <Button 
                onClick={handleEnableBot}
                disabled={isLoading}
                className="flex-1"
              >
                تفعيل البوت
              </Button>
            )}
          </div>
        </div>
        
        {config.enabled && (
          <div className="space-y-4 pt-4 mt-4 border-t border-[#2A3348]">
            <h3 className="text-lg font-medium">اختبار الاتصال</h3>
            
            <div className="space-y-2">
              <Label htmlFor="testMessage">رسالة اختبارية</Label>
              <Input
                id="testMessage"
                value={testMessage}
                onChange={(e) => setTestMessage(e.target.value)}
                placeholder="أدخل رسالة لاختبار الاتصال مع البوت"
                className="bg-[#242C3E] border-[#2A3348] text-white"
              />
            </div>
            
            <Button
              onClick={handleSendTestMessage}
              disabled={isLoading || !testMessage.trim()}
            >
              إرسال رسالة اختبارية
            </Button>
          </div>
        )}
      </div>
    </CardSection>
  );
};

export default TelegramBotSettings;
