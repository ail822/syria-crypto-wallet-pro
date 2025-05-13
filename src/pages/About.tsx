
import React from 'react';
import { usePlatform } from '@/context/PlatformContext';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { 
  CoinsIcon, 
  Banknote, 
  Globe, 
  Shield, 
  Users, 
  MessageCircle, 
  Gamepad2,
  DollarSign,
  Bitcoin
} from 'lucide-react';

const About = () => {
  const { platformName } = usePlatform();
  
  return (
    <DashboardLayout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-center mb-8">عن {platformName}</h1>
        
        <section className="mb-12 max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold mb-4">من نحن</h2>
          <p className="text-lg mb-6">
            {platformName} هي منصة متكاملة للخدمات المالية الرقمية، تهدف إلى تسهيل عمليات تحويل وتبادل العملات الرقمية والتقليدية بطريقة آمنة وسريعة. 
            نقدم مجموعة متنوعة من الخدمات التي تلبي احتياجات مختلف المستخدمين، سواء كانوا أفرادًا أو شركات.
          </p>
        </section>
        
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-center mb-8">خدماتنا</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-[#1A1E2C] p-6 rounded-lg border border-[#2A3348]">
              <div className="w-12 h-12 bg-blue-900/30 rounded-full flex items-center justify-center mb-4">
                <CoinsIcon className="text-[#1E88E5]" size={24} />
              </div>
              <h3 className="text-xl font-semibold mb-2">تبادل العملات الرقمية</h3>
              <p className="text-gray-400">تبادل العملات الرقمية المختلفة بأسعار منافسة وعمولات منخفضة.</p>
            </div>
            
            <div className="bg-[#1A1E2C] p-6 rounded-lg border border-[#2A3348]">
              <div className="w-12 h-12 bg-amber-900/30 rounded-full flex items-center justify-center mb-4">
                <Banknote className="text-[#FFC107]" size={24} />
              </div>
              <h3 className="text-xl font-semibold mb-2">تحويل الأموال</h3>
              <p className="text-gray-400">تحويل الأموال بسرعة وأمان بين مستخدمي المنصة أو إلى حسابات خارجية.</p>
            </div>
            
            <div className="bg-[#1A1E2C] p-6 rounded-lg border border-[#2A3348]">
              <div className="w-12 h-12 bg-green-900/30 rounded-full flex items-center justify-center mb-4">
                <DollarSign className="text-green-500" size={24} />
              </div>
              <h3 className="text-xl font-semibold mb-2">العملات التقليدية</h3>
              <p className="text-gray-400">دعم للعملات التقليدية المختلفة مثل الدولار واليورو والليرة السورية.</p>
            </div>
            
            <div className="bg-[#1A1E2C] p-6 rounded-lg border border-[#2A3348]">
              <div className="w-12 h-12 bg-purple-900/30 rounded-full flex items-center justify-center mb-4">
                <Bitcoin className="text-purple-500" size={24} />
              </div>
              <h3 className="text-xl font-semibold mb-2">العملات الرقمية</h3>
              <p className="text-gray-400">دعم لمختلف العملات الرقمية مثل Bitcoin وEthereum وUSDT وغيرها.</p>
            </div>
            
            <div className="bg-[#1A1E2C] p-6 rounded-lg border border-[#2A3348]">
              <div className="w-12 h-12 bg-red-900/30 rounded-full flex items-center justify-center mb-4">
                <Gamepad2 className="text-red-500" size={24} />
              </div>
              <h3 className="text-xl font-semibold mb-2">شحن الألعاب</h3>
              <p className="text-gray-400">خدمة شحن رصيد الألعاب الإلكترونية الشهيرة مثل PUBG و Free Fire وغيرها.</p>
            </div>
            
            <div className="bg-[#1A1E2C] p-6 rounded-lg border border-[#2A3348]">
              <div className="w-12 h-12 bg-indigo-900/30 rounded-full flex items-center justify-center mb-4">
                <Shield className="text-indigo-500" size={24} />
              </div>
              <h3 className="text-xl font-semibold mb-2">حماية وأمان</h3>
              <p className="text-gray-400">أنظمة حماية متطورة لضمان أمان معاملاتك المالية والبيانات الشخصية.</p>
            </div>
          </div>
        </section>
        
        <section className="mb-12 max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold mb-4">لماذا نحن؟</h2>
          <ul className="space-y-4">
            <li className="flex items-start">
              <div className="mt-1 ml-3 bg-blue-900/20 p-1 rounded-full">
                <Globe className="text-[#1E88E5] h-5 w-5" />
              </div>
              <div>
                <h3 className="font-semibold">خدمة دولية</h3>
                <p className="text-gray-400">نقدم خدماتنا في مختلف أنحاء العالم بدعم للعديد من العملات.</p>
              </div>
            </li>
            
            <li className="flex items-start">
              <div className="mt-1 ml-3 bg-amber-900/20 p-1 rounded-full">
                <Shield className="text-[#FFC107] h-5 w-5" />
              </div>
              <div>
                <h3 className="font-semibold">أمان عالي</h3>
                <p className="text-gray-400">نستخدم أحدث تقنيات الحماية والتشفير لضمان أمان معاملاتك.</p>
              </div>
            </li>
            
            <li className="flex items-start">
              <div className="mt-1 ml-3 bg-green-900/20 p-1 rounded-full">
                <Users className="text-green-500 h-5 w-5" />
              </div>
              <div>
                <h3 className="font-semibold">دعم فني متميز</h3>
                <p className="text-gray-400">فريق دعم متخصص متاح على مدار الساعة للإجابة على استفساراتك.</p>
              </div>
            </li>
            
            <li className="flex items-start">
              <div className="mt-1 ml-3 bg-indigo-900/20 p-1 rounded-full">
                <MessageCircle className="text-indigo-500 h-5 w-5" />
              </div>
              <div>
                <h3 className="font-semibold">تواصل سريع</h3>
                <p className="text-gray-400">قنوات تواصل متعددة للوصول إلينا بسرعة عبر البريد الإلكتروني أو التلغرام.</p>
              </div>
            </li>
          </ul>
        </section>
        
        <section className="text-center mb-12">
          <h2 className="text-2xl font-bold mb-6">انضم إلينا الآن</h2>
          <div className="flex flex-wrap justify-center gap-4">
            <Button asChild variant="wallet" size="lg" className="min-w-[150px]">
              <Link to="/register">إنشاء حساب جديد</Link>
            </Button>
            <Button asChild variant="walletOutline" size="lg" className="min-w-[150px]">
              <Link to="/login">تسجيل الدخول</Link>
            </Button>
          </div>
        </section>
      </div>
    </DashboardLayout>
  );
};

export default About;
