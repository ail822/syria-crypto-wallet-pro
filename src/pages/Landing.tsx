
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import Footer from '@/components/layout/Footer';
import { usePlatform } from '@/context/PlatformContext';
import { 
  Mail, 
  ArrowDown, 
  ArrowUp, 
  Bitcoin, 
  Gamepad2, 
  Wallet, 
  MessageCircle
} from 'lucide-react';

const Landing = () => {
  const { platformName } = usePlatform();
  
  return (
    <div className="min-h-screen flex flex-col">
      {/* Hero Section */}
      <div className="bg-gradient-to-b from-[#1A1E2C] to-[#242C3E] pt-16 px-4">
        <div className="container mx-auto">
          {/* Navigation */}
          <nav className="flex justify-between items-center mb-16">
            <div className="text-2xl font-bold text-white">{platformName}</div>
            <div className="space-x-2 rtl:space-x-reverse">
              <Button variant="outline" className="border-[#2A3348]" asChild>
                <Link to="/login">تسجيل الدخول</Link>
              </Button>
              <Button variant="wallet" asChild>
                <Link to="/register">إنشاء حساب</Link>
              </Button>
            </div>
          </nav>
          
          {/* Hero Content */}
          <div className="max-w-4xl mx-auto text-center pb-24">
            <h1 className="text-4xl md:text-5xl font-bold mb-6 text-white leading-tight">
              محفظة رقمية لإدارة عملاتك وشحن ألعابك
            </h1>
            <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
              منصة آمنة وسهلة الاستخدام لتخزين وتحويل وتداول العملات الرقمية والعادية، وشحن رصيد الألعاب الإلكترونية
            </p>
            <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4 rtl:space-x-reverse">
              <Button size="lg" variant="wallet" className="text-lg px-8" asChild>
                <Link to="/register">ابدأ الآن</Link>
              </Button>
              <Button size="lg" variant="outline" className="text-lg px-8 border-[#2A3348]" asChild>
                <Link to="/about">تعرف علينا</Link>
              </Button>
            </div>
          </div>
        </div>
        
        {/* Wave Separator */}
        <div className="wave">
          <svg data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none">
            <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z" className="shape-fill"></path>
          </svg>
        </div>
      </div>
      
      {/* Features Section */}
      <div className="py-16 bg-[#111827]">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">خدماتنا الأساسية</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Wallet Feature */}
            <div className="bg-[#1A1E2C] rounded-lg p-6 border border-[#2A3348] hover:shadow-lg transition">
              <div className="p-4 bg-blue-500/10 rounded-full w-16 h-16 flex items-center justify-center mb-4">
                <Wallet className="h-8 w-8 text-blue-500" />
              </div>
              <h3 className="text-xl font-semibold mb-3">المحفظة الرقمية</h3>
              <p className="text-gray-400">
                محفظة آمنة لإدارة أموالك بكل سهولة. إيداع، سحب، وتحويل العملات بين مختلف الحسابات.
              </p>
            </div>
            
            {/* Exchange Feature */}
            <div className="bg-[#1A1E2C] rounded-lg p-6 border border-[#2A3348] hover:shadow-lg transition">
              <div className="p-4 bg-green-500/10 rounded-full w-16 h-16 flex items-center justify-center mb-4">
                <ArrowDown className="h-8 w-8 text-green-500" />
              </div>
              <h3 className="text-xl font-semibold mb-3">تحويل العملات</h3>
              <p className="text-gray-400">
                أفضل أسعار التحويل بين العملات الرقمية والعملات التقليدية. تحويل فوري بأقل الرسوم.
              </p>
            </div>
            
            {/* Game Credit Feature */}
            <div className="bg-[#1A1E2C] rounded-lg p-6 border border-[#2A3348] hover:shadow-lg transition">
              <div className="p-4 bg-purple-500/10 rounded-full w-16 h-16 flex items-center justify-center mb-4">
                <Gamepad2 className="h-8 w-8 text-purple-500" />
              </div>
              <h3 className="text-xl font-semibold mb-3">شحن الألعاب</h3>
              <p className="text-gray-400">
                شحن رصيد ألعابك المفضلة بسهولة وبأسعار منافسة. دعم للعديد من الألعاب الشهيرة.
              </p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Currencies Section */}
      <div className="py-16 bg-[#0D1117]">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">العملات المدعومة</h2>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
            <div className="bg-[#1A1E2C] rounded-lg p-6 border border-[#2A3348] flex flex-col items-center">
              <Bitcoin className="h-12 w-12 text-yellow-500 mb-4" />
              <h3 className="text-lg font-medium">Bitcoin</h3>
            </div>
            
            <div className="bg-[#1A1E2C] rounded-lg p-6 border border-[#2A3348] flex flex-col items-center">
              <ArrowUp className="h-12 w-12 text-blue-500 mb-4" />
              <h3 className="text-lg font-medium">Ethereum</h3>
            </div>
            
            <div className="bg-[#1A1E2C] rounded-lg p-6 border border-[#2A3348] flex flex-col items-center">
              <Wallet className="h-12 w-12 text-green-500 mb-4" />
              <h3 className="text-lg font-medium">USDT</h3>
            </div>
            
            <div className="bg-[#1A1E2C] rounded-lg p-6 border border-[#2A3348] flex flex-col items-center">
              <Wallet className="h-12 w-12 text-gray-500 mb-4" />
              <h3 className="text-lg font-medium">SYP</h3>
            </div>
          </div>
        </div>
      </div>
      
      {/* CTA Section */}
      <div className="py-16 bg-[#111827]">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">ابدأ رحلتك مع {platformName}</h2>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            انضم إلى آلاف المستخدمين الذين يثقون بنا في إدارة عملاتهم الرقمية وشحن ألعابهم
          </p>
          
          <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4 rtl:space-x-reverse">
            <Button size="lg" variant="wallet" className="text-lg px-8" asChild>
              <Link to="/register">إنشاء حساب جديد</Link>
            </Button>
            <Button size="lg" variant="outline" className="text-lg px-8 border-[#2A3348]" asChild>
              <Link to="/contact">تواصل معنا</Link>
            </Button>
          </div>
        </div>
      </div>
      
      {/* Contact Section */}
      <div className="py-16 bg-[#0D1117]">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto bg-[#1A1E2C] rounded-lg border border-[#2A3348] p-8">
            <h2 className="text-2xl font-bold mb-6 text-center">تحتاج مساعدة؟ تواصل معنا</h2>
            <div className="flex flex-col md:flex-row items-center justify-center gap-8">
              <div className="flex flex-col items-center">
                <div className="p-4 bg-blue-500/10 rounded-full mb-4">
                  <Mail className="h-8 w-8 text-blue-500" />
                </div>
                <h3 className="text-lg font-medium mb-2">البريد الإلكتروني</h3>
                <a href="mailto:support@walletexchange.com" className="text-[#1E88E5] hover:underline">
                  support@walletexchange.com
                </a>
              </div>
              
              <div className="flex flex-col items-center">
                <div className="p-4 bg-blue-500/10 rounded-full mb-4">
                  <MessageCircle className="h-8 w-8 text-blue-500" />
                </div>
                <h3 className="text-lg font-medium mb-2">تلجرام</h3>
                <a href="https://t.me/walletexchange_support" target="_blank" rel="noopener noreferrer" className="text-[#1E88E5] hover:underline">
                  @walletexchange_support
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default Landing;
