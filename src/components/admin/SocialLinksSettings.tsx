
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { toast } from '@/hooks/use-toast';
import CardSection from '../ui/card-section';
import { SocialLinks } from '@/types';
import { Facebook, Instagram, Mail, MessageCircle, Phone, Twitter, Check } from 'lucide-react';

const defaultSocialLinks: SocialLinks = {
  facebook: '',
  youtube: '',
  telegram: '',
  whatsapp: '',
  instagram: '',
  twitter: '',
  email: '',
  phone: '',
  termsAndConditions: ''
};

const SocialLinksSettings = () => {
  const [socialLinks, setSocialLinks] = useState<SocialLinks>(defaultSocialLinks);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Load saved social links
    try {
      const savedLinks = localStorage.getItem('social_links');
      if (savedLinks) {
        setSocialLinks(JSON.parse(savedLinks));
      }
    } catch (error) {
      console.error('Error loading social links:', error);
    }
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setSocialLinks(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSave = () => {
    try {
      setIsLoading(true);
      // Save to localStorage
      localStorage.setItem('social_links', JSON.stringify(socialLinks));
      
      toast({
        title: "تم حفظ الإعدادات",
        description: "تم تحديث روابط التواصل الاجتماعي بنجاح",
      });
    } catch (error) {
      console.error('Error saving social links:', error);
      toast({
        title: "فشل حفظ الإعدادات",
        description: "حدث خطأ أثناء حفظ البيانات",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <CardSection title="روابط التواصل الاجتماعي">
      <div className="space-y-6">
        {/* Contact Information */}
        <div className="space-y-4">
          <h3 className="font-medium">معلومات التواصل</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="email">البريد الإلكتروني</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  id="email"
                  name="email"
                  value={socialLinks.email}
                  onChange={handleInputChange}
                  placeholder="أدخل البريد الإلكتروني للتواصل"
                  className="pl-10 bg-[#242C3E] border-[#2A3348]"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="phone">رقم الهاتف</Label>
              <div className="relative">
                <Phone className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  id="phone"
                  name="phone"
                  value={socialLinks.phone}
                  onChange={handleInputChange}
                  placeholder="أدخل رقم الهاتف للتواصل"
                  className="pl-10 bg-[#242C3E] border-[#2A3348]"
                />
              </div>
            </div>
          </div>
        </div>
        
        {/* Social Media Links */}
        <div className="space-y-4">
          <h3 className="font-medium">روابط مواقع التواصل الاجتماعي</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="facebook">فيسبوك</Label>
              <div className="relative">
                <Facebook className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  id="facebook"
                  name="facebook"
                  value={socialLinks.facebook}
                  onChange={handleInputChange}
                  placeholder="رابط صفحة الفيسبوك"
                  className="pl-10 bg-[#242C3E] border-[#2A3348]"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="telegram">تلغرام</Label>
              <div className="relative">
                <MessageCircle className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  id="telegram"
                  name="telegram"
                  value={socialLinks.telegram}
                  onChange={handleInputChange}
                  placeholder="رابط قناة التلغرام أو معرّف البوت"
                  className="pl-10 bg-[#242C3E] border-[#2A3348]"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="instagram">انستغرام</Label>
              <div className="relative">
                <Instagram className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  id="instagram"
                  name="instagram"
                  value={socialLinks.instagram}
                  onChange={handleInputChange}
                  placeholder="رابط حساب انستغرام"
                  className="pl-10 bg-[#242C3E] border-[#2A3348]"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="twitter">تويتر</Label>
              <div className="relative">
                <Twitter className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  id="twitter"
                  name="twitter"
                  value={socialLinks.twitter}
                  onChange={handleInputChange}
                  placeholder="رابط حساب تويتر"
                  className="pl-10 bg-[#242C3E] border-[#2A3348]"
                />
              </div>
            </div>
          </div>
        </div>
        
        {/* Terms and Conditions */}
        <div className="space-y-2">
          <Label htmlFor="termsAndConditions">شروط الاستخدام وسياسة الخصوصية</Label>
          <Textarea
            id="termsAndConditions"
            name="termsAndConditions"
            value={socialLinks.termsAndConditions}
            onChange={handleInputChange}
            placeholder="أدخل نص شروط الاستخدام وسياسة الخصوصية"
            className="min-h-32 bg-[#242C3E] border-[#2A3348]"
          />
        </div>
        
        <Button 
          onClick={handleSave} 
          className="w-full bg-[#9b87f5] hover:bg-[#7E69AB]"
          disabled={isLoading}
        >
          {isLoading ? (
            <Check className="mr-2 h-4 w-4" />
          ) : null}
          {isLoading ? "جاري الحفظ..." : "حفظ الإعدادات"}
        </Button>
      </div>
    </CardSection>
  );
};

export default SocialLinksSettings;
