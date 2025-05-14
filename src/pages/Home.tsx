
import React from 'react';
import { Link, Navigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import Footer from '@/components/layout/Footer';
import { usePlatform } from '@/context/PlatformContext';
import { useAuth } from '@/context/AuthContext';
import { 
  Wallet, 
  ArrowDown, 
  ArrowUp, 
  Gamepad2,
  MessageCircle,
  Mail,
  User
} from 'lucide-react';
import { AspectRatio } from '@/components/ui/aspect-ratio';

const Home = () => {
  const { platformName } = usePlatform();
  const { isAuthenticated } = useAuth();
  
  // Redirect to dashboard if already logged in
  if (isAuthenticated) {
    return <Navigate to="/" />;
  }
  
  return (
    <div className="min-h-screen flex flex-col bg-[#0D1117]">
      {/* Gradient Header Background */}
      <div className="bg-gradient-to-b from-[#1A1E2C] to-[#242C3E] pt-6 px-4">
        <div className="container mx-auto">
          {/* Navigation */}
          <nav className="flex justify-between items-center mb-16">
            <Link to="/" className="text-2xl font-bold text-[#9b87f5]">
              {platformName}
            </Link>
            <div className="space-x-2 rtl:space-x-reverse">
              <Button variant="outline" className="border-[#2A3348]" asChild>
                <Link to="/login">تسجيل الدخول</Link>
              </Button>
              <Button className="bg-[#9b87f5] hover:bg-[#7E69AB]" asChild>
                <Link to="/register">إنشاء حساب</Link>
              </Button>
            </div>
          </nav>
          
          {/* Hero Content */}
          <div className="max-w-4xl mx-auto text-center pb-16">
            <h1 className="text-4xl md:text-5xl font-bold mb-6 text-white leading-tight">
              محفظة رقمية لإدارة عملاتك وشحن ألعابك
            </h1>
            <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
              منصة آمنة وسهلة الاستخدام لتخزين وتحويل وتداول العملات الرقمية والعادية، وشحن رصيد الألعاب الإلكترونية
            </p>
            <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4 rtl:space-x-reverse">
              <Button size="lg" className="text-lg px-8 bg-[#9b87f5] hover:bg-[#7E69AB]" asChild>
                <Link to="/register">ابدأ الآن</Link>
              </Button>
              <Button size="lg" variant="outline" className="text-lg px-8 border-[#2A3348]" asChild>
                <Link to="/about">تعرف علينا</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Features Section */}
      <div className="py-16 bg-[#111827]">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 text-white">خدماتنا الأساسية</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Wallet Feature */}
            <div className="bg-[#1A1E2C] rounded-lg p-6 border border-[#2A3348] hover:shadow-lg transition">
              <div className="p-4 bg-[#9b87f5]/20 rounded-full w-16 h-16 flex items-center justify-center mb-4">
                <Wallet className="h-8 w-8 text-[#9b87f5]" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-white">المحفظة الرقمية</h3>
              <p className="text-gray-400">
                محفظة آمنة لإدارة أموالك بكل سهولة. إيداع، سحب، وتحويل العملات بين مختلف الحسابات.
              </p>
            </div>
            
            {/* Exchange Feature */}
            <div className="bg-[#1A1E2C] rounded-lg p-6 border border-[#2A3348] hover:shadow-lg transition">
              <div className="p-4 bg-[#9b87f5]/20 rounded-full w-16 h-16 flex items-center justify-center mb-4">
                <ArrowDown className="h-8 w-8 text-[#9b87f5]" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-white">تحويل العملات</h3>
              <p className="text-gray-400">
                أفضل أسعار التحويل بين العملات الرقمية والعملات التقليدية. تحويل فوري بأقل الرسوم.
              </p>
            </div>
            
            {/* Game Credit Feature */}
            <div className="bg-[#1A1E2C] rounded-lg p-6 border border-[#2A3348] hover:shadow-lg transition">
              <div className="p-4 bg-[#9b87f5]/20 rounded-full w-16 h-16 flex items-center justify-center mb-4">
                <Gamepad2 className="h-8 w-8 text-[#9b87f5]" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-white">شحن الألعاب</h3>
              <p className="text-gray-400">
                شحن رصيد ألعابك المفضلة بسهولة وبأسعار منافسة. دعم للعديد من الألعاب الشهيرة.
              </p>
            </div>
          </div>
        </div>
      </div>
      
      {/* CTA Section */}
      <div className="py-16 bg-[#0D1117]">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6 text-white">ابدأ رحلتك معنا الآن</h2>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            انضم إلى آلاف المستخدمين الذين يثقون بنا في إدارة عملاتهم الرقمية وشحن ألعابهم
          </p>
          
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Button size="lg" className="text-lg px-8 bg-[#9b87f5] hover:bg-[#7E69AB]" asChild>
              <Link to="/register">إنشاء حساب جديد</Link>
            </Button>
            <Button size="lg" variant="outline" className="text-lg px-8 border-[#2A3348]" asChild>
              <Link to="/login">تسجيل الدخول</Link>
            </Button>
          </div>
        </div>
      </div>
      
      {/* Contact Section */}
      <div className="py-16 bg-[#111827] mt-auto">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto bg-[#1A1E2C] rounded-lg border border-[#2A3348] p-8">
            <h2 className="text-2xl font-bold mb-6 text-center text-white">تحتاج مساعدة؟ تواصل معنا</h2>
            <div className="flex flex-col md:flex-row items-center justify-center gap-8">
              <div className="flex flex-col items-center">
                <div className="p-4 bg-[#9b87f5]/20 rounded-full mb-4">
                  <Mail className="h-8 w-8 text-[#9b87f5]" />
                </div>
                <h3 className="text-lg font-medium mb-2 text-white">البريد الإلكتروني</h3>
                <a href="mailto:support@walletexchange.com" className="text-[#9b87f5] hover:underline">
                  support@walletexchange.com
                </a>
              </div>
              
              <div className="flex flex-col items-center">
                <div className="p-4 bg-[#9b87f5]/20 rounded-full mb-4">
                  <MessageCircle className="h-8 w-8 text-[#9b87f5]" />
                </div>
                <h3 className="text-lg font-medium mb-2 text-white">تلجرام</h3>
                <a href="https://t.me/walletexchange_support" target="_blank" rel="noopener noreferrer" className="text-[#9b87f5] hover:underline">
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

export default Home;
