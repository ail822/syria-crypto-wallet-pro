
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from '@/hooks/use-toast';
import { usePlatform } from '@/context/PlatformContext';
import { Facebook, Youtube, Telegram, MessageCircle } from 'lucide-react';
import CardSection from '@/components/ui/card-section';

const SocialLinksSettings = () => {
  const { socialLinks, setSocialLinks, platformName, setPlatformName, supportEmail, setSupportEmail } = usePlatform();
  const [isLoading, setIsLoading] = useState(false);
  const [links, setLinks] = useState({
    facebook: socialLinks.facebook || '',
    youtube: socialLinks.youtube || '',
    telegram: socialLinks.telegram || '',
    whatsapp: socialLinks.whatsapp || '',
  });
  const [name, setName] = useState(platformName);
  const [email, setEmail] = useState(supportEmail);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setIsLoading(true);
      
      // Update platform name and support email
      setPlatformName(name);
      setSupportEmail(email);
      
      // Update social links
      setSocialLinks({
        facebook: links.facebook || undefined,
        youtube: links.youtube || undefined, 
        telegram: links.telegram || undefined,
        whatsapp: links.whatsapp || undefined,
      });
      
      toast({ title: "تم حفظ الإعدادات بنجاح" });
    } catch (error) {
      toast({
        title: "فشل حفظ الإعدادات",
        description: "حدث خطأ أثناء حفظ الإعدادات",
        variant: "destructive",
      });
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <CardSection title="إعدادات الموقع">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="platformName">اسم المنصة</Label>
          <Input
            id="platformName"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="أدخل اسم المنصة"
            required
            className="bg-[#242C3E] border-[#2A3348] text-white"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="supportEmail">البريد الإلكتروني للدعم</Label>
          <Input
            id="supportEmail"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="أدخل البريد الإلكتروني للدعم"
            required
            className="bg-[#242C3E] border-[#2A3348] text-white"
          />
        </div>
        
        <div className="pt-4 border-t border-[#2A3348]">
          <h3 className="text-lg font-medium mb-4">روابط التواصل الاجتماعي</h3>
          
          <div className="space-y-4">
            <div className="flex items-center space-x-4 rtl:space-x-reverse">
              <Facebook className="h-5 w-5 text-blue-500" />
              <div className="flex-1">
                <Label htmlFor="facebookLink">فيسبوك</Label>
                <Input
                  id="facebookLink"
                  value={links.facebook}
                  onChange={(e) => setLinks({...links, facebook: e.target.value})}
                  placeholder="أدخل رابط صفحة الفيسبوك"
                  className="bg-[#242C3E] border-[#2A3348] text-white mt-1"
                />
              </div>
            </div>
            
            <div className="flex items-center space-x-4 rtl:space-x-reverse">
              <Youtube className="h-5 w-5 text-red-500" />
              <div className="flex-1">
                <Label htmlFor="youtubeLink">يوتيوب</Label>
                <Input
                  id="youtubeLink"
                  value={links.youtube}
                  onChange={(e) => setLinks({...links, youtube: e.target.value})}
                  placeholder="أدخل رابط قناة اليوتيوب"
                  className="bg-[#242C3E] border-[#2A3348] text-white mt-1"
                />
              </div>
            </div>
            
            <div className="flex items-center space-x-4 rtl:space-x-reverse">
              <Telegram className="h-5 w-5 text-blue-400" />
              <div className="flex-1">
                <Label htmlFor="telegramLink">تلغرام</Label>
                <Input
                  id="telegramLink"
                  value={links.telegram}
                  onChange={(e) => setLinks({...links, telegram: e.target.value})}
                  placeholder="أدخل رابط قناة التلغرام"
                  className="bg-[#242C3E] border-[#2A3348] text-white mt-1"
                />
              </div>
            </div>
            
            <div className="flex items-center space-x-4 rtl:space-x-reverse">
              <MessageCircle className="h-5 w-5 text-green-500" />
              <div className="flex-1">
                <Label htmlFor="whatsappLink">واتساب</Label>
                <Input
                  id="whatsappLink"
                  value={links.whatsapp}
                  onChange={(e) => setLinks({...links, whatsapp: e.target.value})}
                  placeholder="أدخل رابط واتساب"
                  className="bg-[#242C3E] border-[#2A3348] text-white mt-1"
                />
              </div>
            </div>
          </div>
        </div>
        
        <div className="pt-2">
          <p className="text-sm text-muted-foreground mb-4">
            سيتم عرض أيقونات مواقع التواصل الاجتماعي في تذييل الموقع (Footer) إذا تم إدخال روابطها. الروابط الفارغة لن تظهر.
          </p>
          
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "جارٍ الحفظ..." : "حفظ الإعدادات"}
          </Button>
        </div>
      </form>
    </CardSection>
  );
};

export default SocialLinksSettings;
