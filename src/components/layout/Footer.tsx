
import React from 'react';
import { Link } from 'react-router-dom';
import { usePlatform } from '@/context/PlatformContext';
import { Facebook, Twitter, Instagram, MessageCircle } from 'lucide-react';

const Footer = () => {
  const { platformName } = usePlatform();
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#0F172A] text-white pt-8 pb-4">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div>
            <h3 className="text-lg font-bold mb-4">{platformName}</h3>
            <p className="text-gray-400 mb-4">
              منصة متكاملة لإدارة العملات وتحويلها وخدمات الدفع الإلكتروني
            </p>
            <div className="flex space-x-4 rtl:space-x-reverse">
              <a href="#" className="text-gray-400 hover:text-[#1E88E5] transition-colors">
                <Facebook size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-[#1E88E5] transition-colors">
                <Twitter size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-[#1E88E5] transition-colors">
                <Instagram size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-[#1E88E5] transition-colors">
                <MessageCircle size={20} />
              </a>
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-bold mb-4">روابط سريعة</h3>
            <ul className="space-y-2 text-sm">
              <li><Link to="/" className="text-gray-400 hover:text-white transition-colors">الرئيسية</Link></li>
              <li><Link to="/about" className="text-gray-400 hover:text-white transition-colors">عن المنصة</Link></li>
              <li><Link to="/terms" className="text-gray-400 hover:text-white transition-colors">شروط الاستخدام</Link></li>
              <li><Link to="/privacy" className="text-gray-400 hover:text-white transition-colors">سياسة الخصوصية</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-bold mb-4">المساعدة</h3>
            <ul className="space-y-2 text-sm">
              <li><Link to="/contact" className="text-gray-400 hover:text-white transition-colors">تواصل معنا</Link></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">الأسئلة الشائعة</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">كيف يعمل</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">الدعم الفني</a></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-bold mb-4">تواصل معنا</h3>
            <ul className="space-y-2 text-sm">
              <li className="text-gray-400">البريد الإلكتروني: <a href="mailto:support@wallet-example.com" className="text-[#1E88E5] hover:underline">support@wallet-example.com</a></li>
              <li className="text-gray-400">تلغرام: <a href="https://t.me/wallet_support" className="text-[#1E88E5] hover:underline">@wallet_support</a></li>
              <li className="text-gray-400">الهاتف: <span className="text-white">+123456789</span></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-[#2A3348] pt-4 mt-4">
          <p className="text-center text-sm text-gray-400">
            &copy; {currentYear} {platformName}. جميع الحقوق محفوظة.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
