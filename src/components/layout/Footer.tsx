
import React from 'react';
import { Link } from 'react-router-dom';
import { Facebook, YoutubeIcon, MessageCircle } from 'lucide-react';
import { usePlatform } from '@/context/PlatformContext';

const Footer = () => {
  const { platformName, socialLinks } = usePlatform();

  return (
    <footer className="bg-[#0C1221] text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="space-y-4">
            <h3 className="text-xl font-bold">{platformName}</h3>
            <p className="text-gray-400">
              منصة متكاملة لتحويل العملات وإدارة الأرصدة بطريقة آمنة وسهلة
            </p>
            <div className="flex space-x-4 rtl:space-x-reverse">
              {socialLinks?.facebook && (
                <a href={socialLinks.facebook} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-primary">
                  <Facebook className="h-5 w-5" />
                  <span className="sr-only">Facebook</span>
                </a>
              )}
              {socialLinks?.youtube && (
                <a href={socialLinks.youtube} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-primary">
                  <YoutubeIcon className="h-5 w-5" />
                  <span className="sr-only">YouTube</span>
                </a>
              )}
              {socialLinks?.telegram && (
                <a href={socialLinks.telegram} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-primary">
                  <MessageCircle className="h-5 w-5" />
                  <span className="sr-only">Telegram</span>
                </a>
              )}
            </div>
          </div>
          
          <div className="space-y-4">
            <h3 className="text-lg font-medium">الروابط المفيدة</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-gray-400 hover:text-primary">الرئيسية</Link>
              </li>
              <li>
                <Link to="/login" className="text-gray-400 hover:text-primary">تسجيل الدخول</Link>
              </li>
              <li>
                <Link to="/register" className="text-gray-400 hover:text-primary">إنشاء حساب</Link>
              </li>
            </ul>
          </div>
          
          <div className="space-y-4">
            <h3 className="text-lg font-medium">السياسات والمساعدة</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/terms" className="text-gray-400 hover:text-primary">شروط الاستخدام</Link>
              </li>
              <li>
                <Link to="/privacy" className="text-gray-400 hover:text-primary">سياسة الخصوصية</Link>
              </li>
              <li>
                <Link to="/contact" className="text-gray-400 hover:text-primary">اتصل بنا</Link>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-800 mt-12 pt-8 text-center">
          <p className="text-gray-500">
            © {new Date().getFullYear()} {platformName}. جميع الحقوق محفوظة.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
