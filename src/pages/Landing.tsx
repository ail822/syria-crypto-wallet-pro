
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import Footer from '@/components/layout/Footer';
import { useAuth } from '@/context/AuthContext';
import { usePlatform } from '@/context/PlatformContext';
import { 
  MessageCircle, 
  Wallet, 
  Gamepad, 
  Smartphone, 
  CreditCard, 
  ShieldCheck, 
  Bitcoin,
  Ethereum,
  DollarSign,
  Euro,
  LogIn,
  UserPlus
} from 'lucide-react';

const Landing = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { platformName } = usePlatform();
  
  // Redirect to dashboard if already authenticated
  React.useEffect(() => {
    if (isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

  return (
    <div className="min-h-screen flex flex-col">
      {/* Hero Section */}
      <div className="flex-1 gradient-bg">
        <div className="container mx-auto px-4 py-12 md:py-24">
          <nav className="flex justify-between items-center mb-12">
            <div className="text-2xl font-bold text-white">{platformName}</div>
            <div className="flex gap-4">
              <Button 
                variant="outline" 
                onClick={() => navigate('/login')}
                className="border-white text-white hover:bg-white hover:text-[#1A237E]"
              >
                <LogIn className="ml-2" /> تسجيل الدخول
              </Button>
              <Button 
                className="bg-[#1E88E5] hover:bg-[#1A237E]"
                onClick={() => navigate('/register')}
              >
                <UserPlus className="ml-2" /> إنشاء حساب جديد
              </Button>
            </div>
          </nav>
          
          <div className="flex flex-col md:flex-row items-center justify-between gap-12">
            <div className="md:w-1/2 text-center md:text-right">
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
                منصة المحفظة الإلكترونية المتكاملة
              </h1>
              <p className="text-xl text-white/80 mb-8">
                نقدم لك خدمات آمنة وسريعة لتحويل العملات وإدارة أرصدتك بكل سهولة،
                مع واجهة سهلة الاستخدام وحماية متقدمة لبياناتك.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
                <Button 
                  size="lg" 
                  onClick={() => navigate('/register')}
                  className="text-lg bg-[#1E88E5] hover:bg-[#1A237E]"
                >
                  <UserPlus className="ml-2" /> ابدأ الآن
                </Button>
                <Button 
                  size="lg" 
                  variant="outline"
                  onClick={() => navigate('/login')}
                  className="text-lg border-white text-white hover:bg-white hover:text-[#1A237E]"
                >
                  <LogIn className="ml-2" /> تسجيل الدخول
                </Button>
              </div>
            </div>
            
            <div className="md:w-1/2">
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 shadow-xl border border-white/20">
                <div className="space-y-6">
                  <div className="flex items-center gap-4">
                    <div className="bg-[#1E88E5]/20 p-3 rounded-full">
                      <Wallet className="h-6 w-6 text-[#1E88E5]" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-white">تحويل العملات</h3>
                      <p className="text-white/70">أسعار صرف منافسة وتحويل فوري بين العملات</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <div className="bg-[#FFC107]/20 p-3 rounded-full">
                      <ShieldCheck className="h-6 w-6 text-[#FFC107]" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-white">حماية متقدمة</h3>
                      <p className="text-white/70">تأمين حسابك باستخدام التحقق الثنائي وإشعارات تلغرام</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <div className="bg-[#1E88E5]/20 p-3 rounded-full">
                      <Gamepad className="h-6 w-6 text-[#1E88E5]" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-white">شحن بطاقات الألعاب</h3>
                      <p className="text-white/70">شحن فوري لمختلف الألعاب والتطبيقات</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Currency Section */}
      <div className="py-16 bg-[#111827] text-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-8">العملات المدعومة</h2>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="bg-[#1A1E2C] rounded-xl p-6 border border-[#2A3348] flex flex-col items-center text-center">
              <div className="bg-[#1E88E5]/20 p-4 rounded-full mb-4">
                <Bitcoin className="h-8 w-8 text-[#F7931A]" />
              </div>
              <h3 className="text-xl font-bold">بيتكوين</h3>
              <p className="text-gray-400 text-sm">BTC</p>
            </div>
            
            <div className="bg-[#1A1E2C] rounded-xl p-6 border border-[#2A3348] flex flex-col items-center text-center">
              <div className="bg-[#1E88E5]/20 p-4 rounded-full mb-4">
                <Ethereum className="h-8 w-8 text-[#627EEA]" />
              </div>
              <h3 className="text-xl font-bold">إيثيريوم</h3>
              <p className="text-gray-400 text-sm">ETH</p>
            </div>
            
            <div className="bg-[#1A1E2C] rounded-xl p-6 border border-[#2A3348] flex flex-col items-center text-center">
              <div className="bg-[#1E88E5]/20 p-4 rounded-full mb-4">
                <DollarSign className="h-8 w-8 text-[#85bb65]" />
              </div>
              <h3 className="text-xl font-bold">دولار أمريكي</h3>
              <p className="text-gray-400 text-sm">USD</p>
            </div>
            
            <div className="bg-[#1A1E2C] rounded-xl p-6 border border-[#2A3348] flex flex-col items-center text-center">
              <div className="bg-[#1E88E5]/20 p-4 rounded-full mb-4">
                <Euro className="h-8 w-8 text-[#0066CC]" />
              </div>
              <h3 className="text-xl font-bold">يورو</h3>
              <p className="text-gray-400 text-sm">EUR</p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Services Section */}
      <div className="py-16 bg-[#0F172A] text-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">خدماتنا المتميزة</h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-[#1A1E2C] rounded-xl p-6 border border-[#2A3348] flex flex-col items-center text-center">
              <div className="bg-[#1E88E5]/20 p-4 rounded-full mb-4">
                <CreditCard className="h-8 w-8 text-[#1E88E5]" />
              </div>
              <h3 className="text-xl font-bold mb-3">تحويل العملات</h3>
              <p className="text-gray-400">
                قم بتحويل أموالك بين العملات المختلفة بأفضل أسعار الصرف وبشكل فوري
              </p>
            </div>
            
            <div className="bg-[#1A1E2C] rounded-xl p-6 border border-[#2A3348] flex flex-col items-center text-center">
              <div className="bg-[#FFC107]/20 p-4 rounded-full mb-4">
                <Gamepad className="h-8 w-8 text-[#FFC107]" />
              </div>
              <h3 className="text-xl font-bold mb-3">شحن الألعاب</h3>
              <p className="text-gray-400">
                شحن فوري لمختلف الألعاب الإلكترونية وبطاقات الهدايا للمنصات المختلفة
              </p>
              <Button 
                variant="secondary"
                className="mt-4"
                onClick={() => navigate('/about#services')}
              >
                المزيد من المعلومات
              </Button>
            </div>
            
            <div className="bg-[#1A1E2C] rounded-xl p-6 border border-[#2A3348] flex flex-col items-center text-center">
              <div className="bg-[#1E88E5]/20 p-4 rounded-full mb-4">
                <Smartphone className="h-8 w-8 text-[#1E88E5]" />
              </div>
              <h3 className="text-xl font-bold mb-3">شحن الرصيد</h3>
              <p className="text-gray-400">
                شحن رصيد الهاتف المحمول لمختلف شركات الاتصالات بسهولة وسرعة
              </p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Call to Action */}
      <div className="py-16 bg-[#111827] text-white text-center">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-6">احصل على أفضل الخدمات الآن</h2>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto mb-8">
            انضم إلى آلاف المستخدمين الذين يثقون بنا في إدارة أموالهم وتحويل عملاتهم
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              onClick={() => navigate('/register')}
              className="px-8 text-lg bg-[#1E88E5] hover:bg-[#1A237E]"
            >
              <UserPlus className="ml-2" /> سجل الآن
            </Button>
            <Button 
              size="lg" 
              variant="secondary"
              onClick={() => navigate('/about')}
              className="px-8 text-lg"
            >
              تعرف علينا
            </Button>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default Landing;
