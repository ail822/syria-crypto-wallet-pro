import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import Footer from '@/components/layout/Footer';
import { useAuth } from '@/context/AuthContext';
import { usePlatform } from '@/context/PlatformContext';
import { Facebook, Youtube, MessageCircle } from 'lucide-react';

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
                className="border-white text-white hover:bg-white hover:text-primary"
              >
                تسجيل الدخول
              </Button>
              <Button 
                onClick={() => navigate('/register')}
              >
                إنشاء حساب جديد
              </Button>
            </div>
          </nav>
          
          <div className="flex flex-col md:flex-row items-center justify-between gap-12">
            <div className="md:w-1/2 text-center md:text-right">
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
                منصة تحويل العملات وإدارة الأرصدة
              </h1>
              <p className="text-xl text-white/80 mb-8">
                نقدم لك خدمات آمنة وسريعة لتحويل العملات وإدارة أرصدتك بكل سهولة،
                مع واجهة سهلة الاستخدام وحماية متقدمة لبياناتك.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
                <Button 
                  size="lg" 
                  onClick={() => navigate('/register')}
                  className="text-lg"
                >
                  ابدأ الآن
                </Button>
                <Button 
                  size="lg" 
                  variant="outline"
                  onClick={() => navigate('/login')}
                  className="text-lg border-white text-white hover:bg-white hover:text-primary"
                >
                  تسجيل الدخول
                </Button>
              </div>
            </div>
            
            <div className="md:w-1/2">
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 shadow-xl border border-white/20">
                <div className="space-y-6">
                  <div className="flex items-center gap-4">
                    <div className="bg-primary/20 p-3 rounded-full">
                      <MessageCircle className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-white">تحويل العملات</h3>
                      <p className="text-white/70">أسعار صرف منافسة وتحويل فوري بين العملات</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <div className="bg-primary/20 p-3 rounded-full">
                      <MessageCircle className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-white">إدارة الرصيد</h3>
                      <p className="text-white/70">تتبع رصيدك وإدارته بكل سهولة</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <div className="bg-primary/20 p-3 rounded-full">
                      <MessageCircle className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-white">حماية متقدمة</h3>
                      <p className="text-white/70">تأمين حسابك باستخدام التحقق الثنائي</p>
                    </div>
                  </div>
                </div>
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
