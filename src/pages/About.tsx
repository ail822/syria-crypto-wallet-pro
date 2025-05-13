
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import Footer from '@/components/layout/Footer';
import { usePlatform } from '@/context/PlatformContext';
import { useTheme } from '@/context/ThemeContext';
import { 
  Bitcoin, 
  Ethereum, 
  DollarSign, 
  Euro, 
  Gamepad, 
  MessageCircle, 
  Facebook,
  Twitter, 
  Instagram, 
  Telegram, 
  LogIn,
  UserPlus,
  Phone,
  Mail
} from 'lucide-react';

const About = () => {
  const { platformName } = usePlatform();
  const { theme } = useTheme();
  
  return (
    <div className="min-h-screen flex flex-col">
      {/* Hero Section */}
      <div className="gradient-bg py-12 md:py-20">
        <div className="container mx-auto px-4">
          <nav className="flex justify-between items-center mb-12">
            <div className="text-2xl font-bold text-white">{platformName}</div>
            <div className="flex gap-3">
              <Button 
                variant="outline" 
                className="border-white text-white hover:bg-white hover:text-primary" 
                asChild
              >
                <Link to="/login"><LogIn className="ml-2" /> تسجيل الدخول</Link>
              </Button>
              <Button 
                className="bg-[#1E88E5] hover:bg-[#1A237E] transition-colors"
                asChild
              >
                <Link to="/register"><UserPlus className="ml-2" /> إنشاء حساب</Link>
              </Button>
            </div>
          </nav>
          
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
              منصة المحفظة الإلكترونية المتكاملة
            </h1>
            <p className="text-xl text-white/80 mb-8">
              حلول مالية آمنة وسريعة لتحويل العملات وإدارة أموالك بكل سهولة
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg" 
                className="bg-[#1E88E5] hover:bg-[#1A237E] transition-colors text-lg"
                asChild
              >
                <Link to="/register">ابدأ الآن</Link>
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="text-lg border-white text-white hover:bg-white hover:text-[#1A237E]"
                asChild
              >
                <Link to="#services">تعرف على خدماتنا</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Services Section */}
      <div id="services" className="py-16 bg-[#111827]">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-4 text-white">خدماتنا المتميزة</h2>
          <p className="text-center text-lg text-gray-300 mb-12 max-w-3xl mx-auto">
            نقدم لك مجموعة متكاملة من الخدمات المالية والرقمية لتلبية احتياجاتك اليومية
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-[#1A1E2C] rounded-xl p-6 border border-[#2A3348] shadow-md hover:shadow-lg transition-shadow">
              <div className="flex items-center mb-4">
                <div className="bg-[#1E88E5]/20 p-3 rounded-full mr-4">
                  <DollarSign className="h-6 w-6 text-[#1E88E5]" />
                </div>
                <h3 className="text-xl font-bold text-white">تحويل العملات</h3>
              </div>
              <p className="text-gray-300">
                حول بين مختلف العملات العالمية والرقمية بأفضل الأسعار وبشكل فوري
              </p>
            </div>
            
            <div className="bg-[#1A1E2C] rounded-xl p-6 border border-[#2A3348] shadow-md hover:shadow-lg transition-shadow">
              <div className="flex items-center mb-4">
                <div className="bg-[#FFC107]/20 p-3 rounded-full mr-4">
                  <Gamepad className="h-6 w-6 text-[#FFC107]" />
                </div>
                <h3 className="text-xl font-bold text-white">شحن الألعاب</h3>
              </div>
              <p className="text-gray-300">
                شحن رصيد للألعاب الإلكترونية الشهيرة مثل ببجي وفري فاير بطريقة سهلة وآمنة
              </p>
            </div>
            
            <div className="bg-[#1A1E2C] rounded-xl p-6 border border-[#2A3348] shadow-md hover:shadow-lg transition-shadow">
              <div className="flex items-center mb-4">
                <div className="bg-[#1E88E5]/20 p-3 rounded-full mr-4">
                  <Bitcoin className="h-6 w-6 text-[#1E88E5]" />
                </div>
                <h3 className="text-xl font-bold text-white">العملات الرقمية</h3>
              </div>
              <p className="text-gray-300">
                تداول وتخزين العملات الرقمية المشفرة مثل بيتكوين وإيثيريوم بأمان تام
              </p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Currencies Section */}
      <div className="py-16 bg-[#0F172A]">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-4 text-white">العملات المدعومة</h2>
          <p className="text-center text-lg text-gray-300 mb-12 max-w-3xl mx-auto">
            ندعم مجموعة واسعة من العملات العالمية والرقمية لتلبية احتياجاتك
          </p>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
            <div className="bg-[#1A1E2C] rounded-xl p-6 border border-[#2A3348] text-center hover:border-[#1E88E5] transition-colors">
              <div className="bg-[#1E88E5]/10 p-4 rounded-full inline-flex mb-4">
                <Bitcoin className="h-10 w-10 text-[#F7931A]" />
              </div>
              <h3 className="text-xl font-bold text-white">بيتكوين</h3>
              <p className="text-gray-400 text-sm">BTC</p>
            </div>
            
            <div className="bg-[#1A1E2C] rounded-xl p-6 border border-[#2A3348] text-center hover:border-[#1E88E5] transition-colors">
              <div className="bg-[#1E88E5]/10 p-4 rounded-full inline-flex mb-4">
                <Ethereum className="h-10 w-10 text-[#627EEA]" />
              </div>
              <h3 className="text-xl font-bold text-white">إيثيريوم</h3>
              <p className="text-gray-400 text-sm">ETH</p>
            </div>
            
            <div className="bg-[#1A1E2C] rounded-xl p-6 border border-[#2A3348] text-center hover:border-[#1E88E5] transition-colors">
              <div className="bg-[#1E88E5]/10 p-4 rounded-full inline-flex mb-4">
                <DollarSign className="h-10 w-10 text-[#85bb65]" />
              </div>
              <h3 className="text-xl font-bold text-white">دولار أمريكي</h3>
              <p className="text-gray-400 text-sm">USD</p>
            </div>
            
            <div className="bg-[#1A1E2C] rounded-xl p-6 border border-[#2A3348] text-center hover:border-[#1E88E5] transition-colors">
              <div className="bg-[#1E88E5]/10 p-4 rounded-full inline-flex mb-4">
                <Euro className="h-10 w-10 text-[#0066CC]" />
              </div>
              <h3 className="text-xl font-bold text-white">يورو</h3>
              <p className="text-gray-400 text-sm">EUR</p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Gaming Section */}
      <div className="py-16 bg-[#111827]">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-4 text-white">شحن الألعاب</h2>
          <p className="text-center text-lg text-gray-300 mb-12 max-w-3xl mx-auto">
            شحن فوري لأشهر الألعاب العالمية بأسعار منافسة
          </p>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-[#1A1E2C] rounded-xl p-6 border border-[#2A3348] text-center hover:border-[#FFC107] transition-colors">
              <div className="bg-[#FFC107]/10 p-4 rounded-full inline-flex mb-4">
                <Gamepad className="h-10 w-10 text-[#FFC107]" />
              </div>
              <h3 className="text-xl font-bold text-white">PUBG Mobile</h3>
              <p className="text-gray-400 mb-4">شحن UC بأفضل الأسعار</p>
              <Button variant="outline" className="border-[#FFC107] text-[#FFC107] hover:bg-[#FFC107] hover:text-white">
                شحن الآن
              </Button>
            </div>
            
            <div className="bg-[#1A1E2C] rounded-xl p-6 border border-[#2A3348] text-center hover:border-[#FFC107] transition-colors">
              <div className="bg-[#FFC107]/10 p-4 rounded-full inline-flex mb-4">
                <Gamepad className="h-10 w-10 text-[#FFC107]" />
              </div>
              <h3 className="text-xl font-bold text-white">Free Fire</h3>
              <p className="text-gray-400 mb-4">شحن الماس بأفضل الأسعار</p>
              <Button variant="outline" className="border-[#FFC107] text-[#FFC107] hover:bg-[#FFC107] hover:text-white">
                شحن الآن
              </Button>
            </div>
            
            <div className="bg-[#1A1E2C] rounded-xl p-6 border border-[#2A3348] text-center hover:border-[#FFC107] transition-colors">
              <div className="bg-[#FFC107]/10 p-4 rounded-full inline-flex mb-4">
                <Gamepad className="h-10 w-10 text-[#FFC107]" />
              </div>
              <h3 className="text-xl font-bold text-white">Fortnite</h3>
              <p className="text-gray-400 mb-4">شحن V-Bucks بأفضل الأسعار</p>
              <Button variant="outline" className="border-[#FFC107] text-[#FFC107] hover:bg-[#FFC107] hover:text-white">
                شحن الآن
              </Button>
            </div>
            
            <div className="bg-[#1A1E2C] rounded-xl p-6 border border-[#2A3348] text-center hover:border-[#FFC107] transition-colors">
              <div className="bg-[#FFC107]/10 p-4 rounded-full inline-flex mb-4">
                <Gamepad className="h-10 w-10 text-[#FFC107]" />
              </div>
              <h3 className="text-xl font-bold text-white">Minecraft</h3>
              <p className="text-gray-400 mb-4">شحن Minecoins بأفضل الأسعار</p>
              <Button variant="outline" className="border-[#FFC107] text-[#FFC107] hover:bg-[#FFC107] hover:text-white">
                شحن الآن
              </Button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Contact Section */}
      <div className="py-16 bg-[#0F172A]">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-4 text-white">تواصل معنا</h2>
          <p className="text-center text-lg text-gray-300 mb-12 max-w-3xl mx-auto">
            فريق الدعم الفني متاح على مدار الساعة لمساعدتك في أي وقت
          </p>
          
          <div className="flex flex-col md:flex-row justify-center gap-8 mb-12">
            <div className="bg-[#1A1E2C] rounded-xl p-6 border border-[#2A3348] text-center flex flex-col items-center">
              <div className="bg-[#1E88E5]/20 p-4 rounded-full mb-4">
                <Mail className="h-8 w-8 text-[#1E88E5]" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">البريد الإلكتروني</h3>
              <p className="text-[#1E88E5] text-lg">support@wallet-example.com</p>
            </div>
            
            <div className="bg-[#1A1E2C] rounded-xl p-6 border border-[#2A3348] text-center flex flex-col items-center">
              <div className="bg-[#1E88E5]/20 p-4 rounded-full mb-4">
                <Telegram className="h-8 w-8 text-[#1E88E5]" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">تلغرام</h3>
              <p className="text-[#1E88E5] text-lg">@wallet_support</p>
            </div>
            
            <div className="bg-[#1A1E2C] rounded-xl p-6 border border-[#2A3348] text-center flex flex-col items-center">
              <div className="bg-[#1E88E5]/20 p-4 rounded-full mb-4">
                <Phone className="h-8 w-8 text-[#1E88E5]" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">الهاتف</h3>
              <p className="text-[#1E88E5] text-lg">+123456789</p>
            </div>
          </div>
          
          <div className="flex justify-center space-x-6 rtl:space-x-reverse">
            <a href="#" className="text-gray-400 hover:text-[#1E88E5] transition-colors">
              <Facebook className="h-8 w-8" />
              <span className="sr-only">فيسبوك</span>
            </a>
            <a href="#" className="text-gray-400 hover:text-[#1E88E5] transition-colors">
              <Twitter className="h-8 w-8" />
              <span className="sr-only">تويتر</span>
            </a>
            <a href="#" className="text-gray-400 hover:text-[#1E88E5] transition-colors">
              <Instagram className="h-8 w-8" />
              <span className="sr-only">انستغرام</span>
            </a>
            <a href="#" className="text-gray-400 hover:text-[#1E88E5] transition-colors">
              <Telegram className="h-8 w-8" />
              <span className="sr-only">تلغرام</span>
            </a>
          </div>
        </div>
      </div>
      
      {/* CTA Section */}
      <div className="py-16 bg-[#111827] text-center">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-6 text-white">انضم إلينا الآن</h2>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            انضم إلى آلاف المستخدمين الذين يثقون بنا في إدارة أموالهم وتحويل عملاتهم
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              className="bg-[#1E88E5] hover:bg-[#1A237E] transition-colors text-lg"
              asChild
            >
              <Link to="/register"><UserPlus className="ml-2" /> إنشاء حساب</Link>
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="text-lg border-white text-white hover:bg-white hover:text-[#1A237E]"
              asChild
            >
              <Link to="/login"><LogIn className="ml-2" /> تسجيل الدخول</Link>
            </Button>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default About;
