
import React, { useState } from 'react';
import { usePlatform } from '@/context/PlatformContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from '@/hooks/use-toast';
import { MessageCircle, Mail, Phone, Facebook, Instagram } from 'lucide-react';
import Footer from '@/components/layout/Footer';

const Contact = () => {
  const { platformName, socialLinks } = usePlatform();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name || !email || !message) {
      toast({
        title: "يرجى ملء جميع الحقول",
        description: "جميع الحقول مطلوبة",
        variant: "destructive",
      });
      return;
    }
    
    setIsLoading(true);
    
    // إعداد نص البريد الإلكتروني
    const emailText = `اسم المرسل: ${name}
البريد الإلكتروني: ${email}
الرسالة: ${message}`;

    // محاولة فتح تطبيق البريد الإلكتروني
    const mailtoLink = `mailto:${socialLinks?.email || 'info@example.com'}?subject=رسالة من ${encodeURIComponent(name)}&body=${encodeURIComponent(emailText)}`;
    
    window.open(mailtoLink);
    
    setTimeout(() => {
      setIsLoading(false);
      toast({
        title: "تم إرسال الرسالة",
        description: "سنتواصل معك في أقرب وقت ممكن",
      });
      setName('');
      setEmail('');
      setMessage('');
    }, 1000);
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Hero Section */}
      <div className="bg-gradient-to-b from-purple-900 to-purple-700 pt-16 px-4">
        <div className="container mx-auto">
          {/* Navigation */}
          <nav className="flex justify-between items-center mb-16">
            <div className="text-2xl font-bold text-white">{platformName}</div>
            <div className="space-x-2 rtl:space-x-reverse">
              <Button variant="outline" className="border-white text-white" asChild>
                <a href="/">العودة للصفحة الرئيسية</a>
              </Button>
            </div>
          </nav>
          
          {/* Hero Content */}
          <div className="max-w-4xl mx-auto text-center pb-24">
            <h1 className="text-4xl md:text-5xl font-bold mb-6 text-white leading-tight">
              تواصل معنا
            </h1>
            <p className="text-xl text-gray-200 mb-8 max-w-2xl mx-auto">
              نحن هنا للإجابة على جميع استفساراتك وتقديم أفضل خدمة ممكنة
            </p>
          </div>
        </div>
        
        {/* Wave Separator */}
        <div className="wave">
          <svg data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none">
            <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z" className="shape-fill fill-[#111827]"></path>
          </svg>
        </div>
      </div>
      
      {/* Contact Section */}
      <div className="flex-grow bg-[#111827] py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-5xl mx-auto">
            {/* Contact Form */}
            <div className="bg-[#1A1E2C] rounded-lg p-6 border border-[#2A3348]">
              <h2 className="text-2xl font-bold mb-6">أرسل لنا رسالة</h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">الاسم</Label>
                  <Input
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="أدخل اسمك الكامل"
                    className="bg-[#242C3E] border-[#2A3348]"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="email">البريد الإلكتروني</Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="أدخل بريدك الإلكتروني"
                    className="bg-[#242C3E] border-[#2A3348]"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="message">الرسالة</Label>
                  <Textarea
                    id="message"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="اكتب رسالتك هنا..."
                    className="bg-[#242C3E] border-[#2A3348] h-32"
                    required
                  />
                </div>
                
                <Button 
                  type="submit" 
                  className="w-full bg-purple-600 hover:bg-purple-700" 
                  disabled={isLoading}
                >
                  {isLoading ? "جاري الإرسال..." : "إرسال الرسالة"}
                </Button>
              </form>
            </div>
            
            {/* Contact Info */}
            <div className="space-y-6">
              <h2 className="text-2xl font-bold mb-6">معلومات الاتصال</h2>
              
              {/* وسائل التواصل الاجتماعي */}
              <div className="space-y-4">
                {socialLinks?.email && (
                  <div className="flex items-center space-x-3 rtl:space-x-reverse">
                    <div className="bg-purple-900/30 p-3 rounded-full">
                      <Mail className="h-6 w-6 text-purple-400" />
                    </div>
                    <div>
                      <h3 className="text-lg font-medium">البريد الإلكتروني</h3>
                      <a href={`mailto:${socialLinks.email}`} className="text-gray-300 hover:text-purple-400">
                        {socialLinks.email}
                      </a>
                    </div>
                  </div>
                )}
                
                {socialLinks?.phone && (
                  <div className="flex items-center space-x-3 rtl:space-x-reverse">
                    <div className="bg-purple-900/30 p-3 rounded-full">
                      <Phone className="h-6 w-6 text-purple-400" />
                    </div>
                    <div>
                      <h3 className="text-lg font-medium">رقم الهاتف</h3>
                      <a href={`tel:${socialLinks.phone}`} className="text-gray-300 hover:text-purple-400">
                        {socialLinks.phone}
                      </a>
                    </div>
                  </div>
                )}
                
                {socialLinks?.telegram && (
                  <div className="flex items-center space-x-3 rtl:space-x-reverse">
                    <div className="bg-purple-900/30 p-3 rounded-full">
                      <MessageCircle className="h-6 w-6 text-purple-400" />
                    </div>
                    <div>
                      <h3 className="text-lg font-medium">تلغرام</h3>
                      <a href={socialLinks.telegram} target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-purple-400">
                        {socialLinks.telegram.replace(/https:\/\/t\.me\//g, '@')}
                      </a>
                    </div>
                  </div>
                )}
                
                {socialLinks?.facebook && (
                  <div className="flex items-center space-x-3 rtl:space-x-reverse">
                    <div className="bg-purple-900/30 p-3 rounded-full">
                      <Facebook className="h-6 w-6 text-purple-400" />
                    </div>
                    <div>
                      <h3 className="text-lg font-medium">فيسبوك</h3>
                      <a href={socialLinks.facebook} target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-purple-400">
                        صفحتنا على فيسبوك
                      </a>
                    </div>
                  </div>
                )}
                
                {socialLinks?.instagram && (
                  <div className="flex items-center space-x-3 rtl:space-x-reverse">
                    <div className="bg-purple-900/30 p-3 rounded-full">
                      <Instagram className="h-6 w-6 text-purple-400" />
                    </div>
                    <div>
                      <h3 className="text-lg font-medium">إنستغرام</h3>
                      <a href={socialLinks.instagram} target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-purple-400">
                        تابعنا على إنستغرام
                      </a>
                    </div>
                  </div>
                )}
              </div>
              
              {/* نص البطاقة */}
              <div className="bg-[#1A1E2C] rounded-lg p-6 border border-[#2A3348] mt-6">
                <h3 className="text-xl font-bold mb-4">أوقات العمل</h3>
                <p className="text-gray-300">نحن متاحون على مدار الساعة طوال أيام الأسبوع لمساعدتك والإجابة على استفساراتك.</p>
                <p className="text-gray-300 mt-2">سيتم الرد على رسائلك في أقرب وقت ممكن.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default Contact;
