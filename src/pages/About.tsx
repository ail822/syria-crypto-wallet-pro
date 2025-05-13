
import React from 'react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { usePlatform } from '@/context/PlatformContext';
import Footer from '@/components/layout/Footer';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { 
  Mail, 
  ArrowDown, 
  Bitcoin, 
  ArrowUp,
  Gamepad2, 
  Wallet, 
  Clipboard,
  MessageCircle
} from 'lucide-react';

const AboutPage = () => {
  const { platformName, socialLinks } = usePlatform();
  
  return (
    <DashboardLayout>
      <div className="animate-fade-in max-w-5xl mx-auto py-8 px-4 sm:px-6">
        <h1 className="text-3xl font-bold mb-8 text-center">{platformName} - خدمات الدفع الإلكتروني</h1>
        
        {/* Services Overview */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4 border-r-4 border-[#1E88E5] pr-3">خدماتنا</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Wallet Services */}
            <div className="bg-[#1A1E2C] rounded-lg p-6 border border-[#2A3348] hover:shadow-lg transition">
              <div className="flex items-center mb-4">
                <div className="p-3 rounded-full bg-blue-100/10 mr-4">
                  <Wallet className="text-[#1E88E5] h-8 w-8" />
                </div>
                <h3 className="text-xl font-semibold">المحفظة الإلكترونية</h3>
              </div>
              <p className="text-gray-400">
                محفظة رقمية آمنة لتخزين وإدارة أموالك بسهولة. يمكنك الإيداع والسحب وتحويل العملات بين مختلف العملات.
              </p>
            </div>
            
            {/* Currency Exchange */}
            <div className="bg-[#1A1E2C] rounded-lg p-6 border border-[#2A3348] hover:shadow-lg transition">
              <div className="flex items-center mb-4">
                <div className="p-3 rounded-full bg-green-100/10 mr-4">
                  <ArrowDown className="text-green-500 h-8 w-8" />
                </div>
                <h3 className="text-xl font-semibold">تحويل العملات</h3>
              </div>
              <p className="text-gray-400">
                أفضل أسعار تحويل بين العملات الرقمية والعملات التقليدية. تحويل فوري وآمن بأقل رسوم.
              </p>
            </div>
            
            {/* Game Credit */}
            <div className="bg-[#1A1E2C] rounded-lg p-6 border border-[#2A3348] hover:shadow-lg transition">
              <div className="flex items-center mb-4">
                <div className="p-3 rounded-full bg-purple-100/10 mr-4">
                  <Gamepad2 className="text-purple-500 h-8 w-8" />
                </div>
                <h3 className="text-xl font-semibold">شحن الألعاب</h3>
              </div>
              <p className="text-gray-400">
                شحن رصيد الألعاب الشهيرة مثل PUBG وفري فاير بأسرع وقت وبأسعار منافسة.
              </p>
            </div>
          </div>
        </section>
        
        {/* Cryptocurrencies */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4 border-r-4 border-[#1E88E5] pr-3">العملات الرقمية</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="bg-[#1A1E2C] rounded-lg p-4 border border-[#2A3348] flex flex-col items-center">
              <div className="p-3 rounded-full bg-yellow-100/10 mb-3">
                <Bitcoin className="text-yellow-500 h-8 w-8" />
              </div>
              <span className="font-medium">Bitcoin</span>
            </div>
            <div className="bg-[#1A1E2C] rounded-lg p-4 border border-[#2A3348] flex flex-col items-center">
              <div className="p-3 rounded-full bg-blue-100/10 mb-3">
                <ArrowUp className="text-blue-500 h-8 w-8" />
              </div>
              <span className="font-medium">Ethereum</span>
            </div>
            <div className="bg-[#1A1E2C] rounded-lg p-4 border border-[#2A3348] flex flex-col items-center">
              <div className="p-3 rounded-full bg-green-100/10 mb-3">
                <Clipboard className="text-green-500 h-8 w-8" />
              </div>
              <span className="font-medium">USDT</span>
            </div>
          </div>
        </section>
        
        {/* Contact and Support */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4 border-r-4 border-[#1E88E5] pr-3">الدعم الفني</h2>
          <div className="bg-[#1A1E2C] rounded-lg p-6 border border-[#2A3348]">
            <div className="flex flex-col md:flex-row md:items-center justify-between">
              <div className="mb-4 md:mb-0">
                <h3 className="text-xl font-semibold mb-2">تواصل معنا</h3>
                <p className="text-gray-400 mb-4">
                  فريق الدعم الفني متاح على مدار الساعة لمساعدتك
                </p>
                <div className="flex items-center">
                  <Mail className="text-[#1E88E5] mr-2 h-5 w-5" />
                  <a href="mailto:support@walletexchange.com" className="text-[#1E88E5] hover:underline">
                    support@walletexchange.com
                  </a>
                </div>
                <div className="flex items-center mt-2">
                  <MessageCircle className="text-[#1E88E5] mr-2 h-5 w-5" />
                  <a href="https://t.me/walletexchange_support" target="_blank" rel="noopener noreferrer" className="text-[#1E88E5] hover:underline">
                    @walletexchange_support
                  </a>
                </div>
              </div>
              <div className="flex flex-col">
                <Button variant="wallet" className="mb-2" asChild>
                  <Link to="/register">إنشاء حساب جديد</Link>
                </Button>
                <Button variant="outline" className="border-[#2A3348]" asChild>
                  <Link to="/login">تسجيل الدخول</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>
        
        {/* Social Media */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4 border-r-4 border-[#1E88E5] pr-3">تابعنا على</h2>
          <div className="flex flex-wrap gap-4 justify-center">
            {Object.entries(socialLinks).map(([key, value], index) => (
              value && (
                <a 
                  key={index}
                  href={value.toString()} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="bg-[#1A1E2C] rounded-lg p-4 border border-[#2A3348] hover:bg-[#242C3E] transition"
                >
                  <span className="sr-only">{key}</span>
                  <div className="h-8 w-8 text-[#1E88E5]" />
                </a>
              )
            ))}
          </div>
        </section>
        
        <div className="text-center mt-8">
          <Button variant="wallet" size="lg" className="px-8" asChild>
            <Link to="/register">ابدأ الآن</Link>
          </Button>
          <p className="mt-4 text-gray-400">
            انضم إلى الآلاف من المستخدمين الذين يثقون بنا
          </p>
        </div>
      </div>
      <Footer />
    </DashboardLayout>
  );
};

export default AboutPage;
