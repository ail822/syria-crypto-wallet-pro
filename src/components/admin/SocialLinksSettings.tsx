
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from '@/hooks/use-toast';
import { Facebook, YoutubeIcon, MessageCircle } from 'lucide-react';
import { usePlatform } from '@/context/PlatformContext';
import CardSection from '@/components/ui/card-section';
import { sendTelegramMessage } from '@/utils/telegramBot';

const SocialLinksSettings = () => {
  const { socialLinks, updateSocialLinks } = usePlatform();
  const [links, setLinks] = useState({
    facebook: '',
    youtube: '',
    telegram: '',
    whatsapp: ''
  });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (socialLinks) {
      setLinks({
        facebook: socialLinks.facebook || '',
        youtube: socialLinks.youtube || '',
        telegram: socialLinks.telegram || '',
        whatsapp: socialLinks.whatsapp || ''
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
        `📱 تلغرام: ${links.telegram || 'لا يوجد'}\n` +
        `📞 واتساب: ${links.whatsapp || 'لا يوجد'}\n\n` +
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
            <Label htmlFor="youtube" className="flex items-center gap-2">
              <YoutubeIcon className="h-4 w-4" /> يوتيوب
            </Label>
            <Input
              id="youtube"
              value={links.youtube}
              onChange={(e) => setLinks({...links, youtube: e.target.value})}
              placeholder="https://youtube.com/yourchannel"
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
        </div>
        
        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? "جارٍ التحديث..." : "حفظ الروابط"}
        </Button>
      </form>
    </CardSection>
  );
};

export default SocialLinksSettings;
