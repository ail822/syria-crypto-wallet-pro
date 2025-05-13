
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { toast } from '@/hooks/use-toast';
import { Facebook, Instagram, Twitter, MessageCircle, Mail, Phone, Bookmark } from 'lucide-react';
import { usePlatform } from '@/context/PlatformContext';
import CardSection from '@/components/ui/card-section';
import { sendTelegramMessage } from '@/utils/telegramBot';
import { SocialLinks } from '@/types';

const SocialLinksSettings = () => {
  const { socialLinks, updateSocialLinks } = usePlatform();
  const [links, setLinks] = useState<SocialLinks>({
    facebook: '',
    youtube: '',
    telegram: '',
    whatsapp: '',
    instagram: '',
    twitter: '',
    email: '',
    phone: '',
    termsAndConditions: ''
  });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (socialLinks) {
      setLinks({
        facebook: socialLinks.facebook || '',
        youtube: socialLinks.youtube || '',
        telegram: socialLinks.telegram || '',
        whatsapp: socialLinks.whatsapp || '',
        instagram: socialLinks.instagram || '',
        twitter: socialLinks.twitter || '',
        email: socialLinks.email || '',
        phone: socialLinks.phone || '',
        termsAndConditions: socialLinks.termsAndConditions || ''
      });
    }
  }, [socialLinks]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setIsLoading(true);
      
      updateSocialLinks(links);
      
      // Send backup to Telegram
      await sendTelegramMessage(`🔗 *تحديث روابط التواصل الاجتماعي*\n\n` +
        `📘 فيسبوك: ${links.facebook || 'لا يوجد'}\n` +
        `📺 يوتيوب: ${links.youtube || 'لا يوجد'}\n` +
        `📲 تلغرام: ${links.telegram || 'لا يوجد'}\n` +
        `☎️ واتساب: ${links.whatsapp || 'لا يوجد'}\n` +
        `📷 إنستغرام: ${links.instagram || 'لا يوجد'}\n` +
        `🐦 تويتر: ${links.twitter || 'لا يوجد'}\n` +
        `📧 البريد الإلكتروني: ${links.email || 'لا يوجد'}\n` +
        `📱 رقم الهاتف: ${links.phone || 'لا يوجد'}\n\n` +
        `⏱️ وقت التحديث: ${new Date().toLocaleString('ar-SA')}`
      );
      
      toast({ title: "تم تحديث روابط التواصل الاجتماعي بنجاح" });
    } catch (error) {
      toast({
        title: "فشل تحديث الروابط",
        description: "حدث خطأ أثناء تحديث روابط التواصل الاجتماعي",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <CardSection title="إعدادات روابط التواصل الاجتماعي">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* وسائل التواصل الاجتماعي */}
          <div className="space-y-2">
            <Label htmlFor="facebook" className="flex items-center gap-2">
              <Facebook className="h-4 w-4" /> فيسبوك
            </Label>
            <Input
              id="facebook"
              value={links.facebook}
              onChange={(e) => setLinks({...links, facebook: e.target.value})}
              placeholder="https://facebook.com/yourpage"
              className="bg-[#242C3E] border-[#2A3348] text-white"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="instagram" className="flex items-center gap-2">
              <Instagram className="h-4 w-4" /> إنستغرام
            </Label>
            <Input
              id="instagram"
              value={links.instagram}
              onChange={(e) => setLinks({...links, instagram: e.target.value})}
              placeholder="https://instagram.com/youraccount"
              className="bg-[#242C3E] border-[#2A3348] text-white"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="twitter" className="flex items-center gap-2">
              <Twitter className="h-4 w-4" /> تويتر
            </Label>
            <Input
              id="twitter"
              value={links.twitter}
              onChange={(e) => setLinks({...links, twitter: e.target.value})}
              placeholder="https://twitter.com/youraccount"
              className="bg-[#242C3E] border-[#2A3348] text-white"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="telegram" className="flex items-center gap-2">
              <MessageCircle className="h-4 w-4" /> تلغرام
            </Label>
            <Input
              id="telegram"
              value={links.telegram}
              onChange={(e) => setLinks({...links, telegram: e.target.value})}
              placeholder="https://t.me/yourusername"
              className="bg-[#242C3E] border-[#2A3348] text-white"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="whatsapp" className="flex items-center gap-2">
              <MessageCircle className="h-4 w-4" /> واتساب
            </Label>
            <Input
              id="whatsapp"
              value={links.whatsapp}
              onChange={(e) => setLinks({...links, whatsapp: e.target.value})}
              placeholder="https://wa.me/1234567890"
              className="bg-[#242C3E] border-[#2A3348] text-white"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="youtube" className="flex items-center gap-2">
              <Twitter className="h-4 w-4" /> يوتيوب
            </Label>
            <Input
              id="youtube"
              value={links.youtube}
              onChange={(e) => setLinks({...links, youtube: e.target.value})}
              placeholder="https://youtube.com/yourchannel"
              className="bg-[#242C3E] border-[#2A3348] text-white"
            />
          </div>
          
          {/* معلومات الاتصال */}
          <div className="space-y-2">
            <Label htmlFor="email" className="flex items-center gap-2">
              <Mail className="h-4 w-4" /> البريد الإلكتروني
            </Label>
            <Input
              id="email"
              value={links.email}
              onChange={(e) => setLinks({...links, email: e.target.value})}
              placeholder="info@example.com"
              className="bg-[#242C3E] border-[#2A3348] text-white"
            />
            <p className="text-xs text-muted-foreground">
              يُستخدم في صفحة "تواصل معنا" وعند إرسال الرسائل
            </p>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="phone" className="flex items-center gap-2">
              <Phone className="h-4 w-4" /> رقم الهاتف
            </Label>
            <Input
              id="phone"
              value={links.phone}
              onChange={(e) => setLinks({...links, phone: e.target.value})}
              placeholder="+963123456789"
              className="bg-[#242C3E] border-[#2A3348] text-white"
            />
            <p className="text-xs text-muted-foreground">
              يُعرض في صفحة "تواصل معنا" وللاتصال المباشر
            </p>
          </div>
        </div>
        
        {/* شروط الاستخدام */}
        <div className="space-y-2">
          <Label htmlFor="termsAndConditions" className="flex items-center gap-2">
            <Bookmark className="h-4 w-4" /> شروط الاستخدام وسياسة الخصوصية
          </Label>
          <Textarea
            id="termsAndConditions"
            value={links.termsAndConditions}
            onChange={(e) => setLinks({...links, termsAndConditions: e.target.value})}
            placeholder="أدخل نص شروط الاستخدام وسياسة الخصوصية..."
            className="bg-[#242C3E] border-[#2A3348] text-white min-h-[200px]"
          />
          <p className="text-xs text-muted-foreground">
            سيتم عرض هذا النص في صفحة الشروط والأحكام
          </p>
        </div>
        
        <Button type="submit" className="w-full bg-purple-600 hover:bg-purple-700" disabled={isLoading}>
          {isLoading ? "جارٍ التحديث..." : "حفظ الروابط"}
        </Button>
      </form>
    </CardSection>
  );
};

export default SocialLinksSettings;
