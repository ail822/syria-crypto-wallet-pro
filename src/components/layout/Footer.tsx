import React from 'react';
import { Facebook, Youtube, MessageCircle } from 'lucide-react';
import { usePlatform } from '@/context/PlatformContext';

const Footer = () => {
  const { platformName, socialLinks } = usePlatform();
  
  const renderSocialIcon = (name: string, url: string | undefined) => {
    if (!url) return null;
    
    const iconProps = { className: "h-5 w-5", "aria-hidden": true };
    let icon;
    
    switch (name) {
      case 'facebook':
        icon = <Facebook {...iconProps} />;
        break;
      case 'youtube':
        icon = <Youtube {...iconProps} />;
        break;
      case 'telegram':
        icon = <MessageCircle {...iconProps} />;
        break;
      case 'whatsapp':
        icon = <MessageCircle {...iconProps} />;
        break;
      default:
        return null;
    }
    
    return (
      <a 
        href={url} 
        target="_blank" 
        rel="noopener noreferrer"
        className="flex items-center justify-center h-10 w-10 rounded-full bg-[#1A1E2C] hover:bg-primary/20 transition-colors"
      >
        {icon}
      </a>
    );
  };

  return (
    <footer className="bg-[#0F131A] text-white py-8">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-6 md:mb-0">
            <div className="text-xl font-bold mb-2">{platformName}</div>
            <p className="text-sm text-white/60">منصة تحويل العملات وإدارة الأرصدة</p>
          </div>
          
          <div className="flex flex-col sm:flex-row items-center gap-6">
            <div className="flex gap-3">
              {renderSocialIcon('facebook', socialLinks?.facebook)}
              {renderSocialIcon('youtube', socialLinks?.youtube)}
              {renderSocialIcon('telegram', socialLinks?.telegram)}
              {renderSocialIcon('whatsapp', socialLinks?.whatsapp)}
            </div>
            
            <div className="h-8 w-px bg-white/20 hidden sm:block"></div>
            
            <div className="flex gap-6">
              <a href="/terms" className="text-sm text-white/60 hover:text-white">شروط الاستخدام</a>
              <a href="/privacy" className="text-sm text-white/60 hover:text-white">سياسة الاستخدام</a>
              <a href="/contact" className="text-sm text-white/60 hover:text-white">اتصل بنا</a>
            </div>
          </div>
        </div>
        
        <div className="text-center mt-8 text-xs text-white/40">
          © {new Date().getFullYear()} {platformName}. جميع الحقوق محفوظة
        </div>
      </div>
    </footer>
  );
};

export default Footer;
