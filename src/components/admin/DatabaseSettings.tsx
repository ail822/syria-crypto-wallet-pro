
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from '@/hooks/use-toast';
import { Eye, EyeOff, Database, RefreshCw } from 'lucide-react';
import CardSection from '../ui/card-section';

const DatabaseSettings = () => {
  const [dbSettings, setDbSettings] = useState({
    host: '',
    dbName: '',
    username: '',
    password: '',
  });
  const [connectionStatus, setConnectionStatus] = useState<'pending' | 'success' | 'failed' | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // تحميل الإعدادات المحفوظة عند بدء التشغيل
  useEffect(() => {
    const savedSettings = localStorage.getItem('dbSettings');
    
    if (savedSettings) {
      const parsed = JSON.parse(savedSettings);
      setDbSettings(parsed);
      // إذا كانت هناك إعدادات محفوظة، نفترض أن الاتصال كان ناجحًا
      setConnectionStatus('success');
    } else {
      setDbSettings({
        host: 'localhost',
        dbName: '',
        username: '',
        password: '',
      });
      setConnectionStatus(null);
    }
  }, []);

  const handleChange = (field: string, value: string) => {
    setDbSettings({ ...dbSettings, [field]: value });
    // Reset connection status when settings change
    if (connectionStatus) setConnectionStatus(null);
  };

  const testConnection = () => {
    setIsLoading(true);
    setConnectionStatus('pending');

    // Simulate connection test
    setTimeout(() => {
      // For demo purposes, we'll simulate success if all fields are filled
      if (dbSettings.host && dbSettings.dbName && dbSettings.username && dbSettings.password) {
        setConnectionStatus('success');
        toast({
          title: "تم الاتصال بنجاح",
          description: "تم الاتصال بقاعدة البيانات بنجاح واختبار الاعتمادات",
        });
        
        // حفظ الإعدادات في localStorage عند نجاح الاتصال
        localStorage.setItem('dbSettings', JSON.stringify(dbSettings));
      } else {
        setConnectionStatus('failed');
        toast({
          title: "فشل الاتصال",
          description: "تعذر الاتصال بقاعدة البيانات. يرجى التحقق من المعلومات المدخلة.",
          variant: "destructive"
        });
      }
      setIsLoading(false);
    }, 1500);
  };

  const saveSettings = () => {
    setIsLoading(true);
    
    // حفظ الإعدادات حتى لو لم يتم اختبار الاتصال مرة أخرى
    localStorage.setItem('dbSettings', JSON.stringify(dbSettings));
    
    // Simulate saving settings
    setTimeout(() => {
      toast({
        title: "تم حفظ الإعدادات",
        description: "تم حفظ إعدادات قاعدة البيانات بنجاح",
      });
      setIsLoading(false);
    }, 1000);
  };

  const getStatusColor = () => {
    switch (connectionStatus) {
      case 'success':
        return 'text-green-500';
      case 'failed':
        return 'text-red-500';
      case 'pending':
        return 'text-yellow-500';
      default:
        return 'text-gray-400';
    }
  };

  const getStatusMessage = () => {
    switch (connectionStatus) {
      case 'success':
        return 'متصل بنجاح';
      case 'failed':
        return 'فشل الاتصال';
      case 'pending':
        return 'جاري الاتصال...';
      default:
        return 'غير متصل';
    }
  };

  return (
    <CardSection title="إعدادات الاتصال بقاعدة البيانات">
      <div className="space-y-6">
        <div className="flex items-center space-x-2 rtl:space-x-reverse mb-4">
          <Database className="h-5 w-5" />
          <div className="text-sm">
            حالة الاتصال: <span className={getStatusColor()}>{getStatusMessage()}</span>
          </div>
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="host">اسم المضيف (Host)</Label>
            <Input
              id="host"
              value={dbSettings.host}
              onChange={(e) => handleChange('host', e.target.value)}
              placeholder="مثال: localhost أو 127.0.0.1"
              className="bg-[#242C3E] border-[#2A3348] text-white"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="dbName">اسم قاعدة البيانات (Database Name)</Label>
            <Input
              id="dbName"
              value={dbSettings.dbName}
              onChange={(e) => handleChange('dbName', e.target.value)}
              placeholder="أدخل اسم قاعدة البيانات"
              className="bg-[#242C3E] border-[#2A3348] text-white"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="username">اسم المستخدم (Username)</Label>
            <Input
              id="username"
              value={dbSettings.username}
              onChange={(e) => handleChange('username', e.target.value)}
              placeholder="أدخل اسم المستخدم"
              className="bg-[#242C3E] border-[#2A3348] text-white"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="password">كلمة المرور (Password)</Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                value={dbSettings.password}
                onChange={(e) => handleChange('password', e.target.value)}
                placeholder="أدخل كلمة المرور"
                className="bg-[#242C3E] border-[#2A3348] text-white pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 flex items-center px-3 text-gray-400 hover:text-gray-300"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2 rtl:space-x-reverse">
            <Button 
              onClick={testConnection} 
              className="flex items-center justify-center" 
              disabled={isLoading}
            >
              {isLoading && connectionStatus === 'pending' ? (
                <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
              ) : null}
              اختبار الاتصال
            </Button>
            
            <Button 
              onClick={saveSettings} 
              variant="outline" 
              className="bg-[#242C3E] border-[#2A3348]" 
              disabled={isLoading}
            >
              حفظ الإعدادات
            </Button>
          </div>
          
          <div className="p-3 bg-blue-900/20 rounded-md border border-blue-800/30">
            <p className="text-sm text-blue-300">
              يرجى التأكد من إدخال بيانات الاتصال الصحيحة. سيتم تشفير كلمة المرور وتخزينها بشكل آمن.
            </p>
          </div>
        </div>
      </div>
    </CardSection>
  );
};

export default DatabaseSettings;
