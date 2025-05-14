
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { toast } from '@/hooks/use-toast';
import { Link } from 'react-router-dom';
import { Mail, MessageCircle, Phone, User, Send, Facebook, Instagram, Twitter } from 'lucide-react';
import { SocialLinks } from '@/types';
import { usePlatform } from '@/context/PlatformContext';

const Contact = () => {
  const { platformName } = usePlatform();
  const [socialLinks, setSocialLinks] = useState<SocialLinks>({
    facebook: '',
    youtube: '',
    telegram: '',
    whatsapp: '',
    instagram: '',
    twitter: '',
    email: 'support@example.com',
    phone: '',
    termsAndConditions: ''
  });
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  useEffect(() => {
    // Load saved social links
    try {
      const savedLinks = localStorage.getItem('social_links');
      if (savedLinks) {
        setSocialLinks(JSON.parse(savedLinks));
      }
    } catch (error) {
      console.error('Error loading social links:', error);
    }
  }, []);
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.email || !formData.message) {
      toast({
        title: "يرجى تعبئة جميع الحقول المطلوبة",
        variant: "destructive",
      });
      return;
    }
    
    setIsSubmitting(true);
    
    // Simulate sending email
    setTimeout(() => {
      toast({
        title: "تم إرسال رسالتك بنجاح",
        description: "سنقوم بالرد عليك في أقرب وقت ممكن",
      });
      
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: ''
      });
      
      setIsSubmitting(false);
    }, 1500);
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#1A1E2C] to-[#0D1117] flex flex-col">
      {/* Header */}
      <header className="py-4 px-4 bg-[#1A1E2C]/80 backdrop-blur-sm">
        <div className="container mx-auto flex justify-between items-center">
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
        </div>
      </header>
      
      {/* Main content */}
      <main className="flex-1 container mx-auto px-4 py-12">
        <div className="max-w-5xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-bold mb-8 text-center text-white">
            تواصل معنا
          </h1>
          
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
            {/* Contact Information */}
            <div className="lg:col-span-2 space-y-8">
              <div className="bg-[#1A1E2C] border border-[#2A3348] rounded-lg p-6">
                <h2 className="text-xl font-semibold mb-6 text-white">معلومات التواصل</h2>
                
                {socialLinks.email && (
                  <div className="flex items-start space-x-4 rtl:space-x-reverse mb-6">
                    <div className="p-3 rounded-full bg-[#9b87f5]/20">
                      <Mail className="h-5 w-5 text-[#9b87f5]" />
                    </div>
                    <div>
                      <h3 className="text-lg font-medium text-white">البريد الإلكتروني</h3>
                      <a href={`mailto:${socialLinks.email}`} className="text-[#9b87f5] hover:underline">
                        {socialLinks.email}
                      </a>
                    </div>
                  </div>
                )}
                
                {socialLinks.phone && (
                  <div className="flex items-start space-x-4 rtl:space-x-reverse mb-6">
                    <div className="p-3 rounded-full bg-[#9b87f5]/20">
                      <Phone className="h-5 w-5 text-[#9b87f5]" />
                    </div>
                    <div>
                      <h3 className="text-lg font-medium text-white">الهاتف</h3>
                      <a href={`tel:${socialLinks.phone}`} className="text-[#9b87f5] hover:underline">
                        {socialLinks.phone}
                      </a>
                    </div>
                  </div>
                )}
                
                {socialLinks.telegram && (
                  <div className="flex items-start space-x-4 rtl:space-x-reverse mb-6">
                    <div className="p-3 rounded-full bg-[#9b87f5]/20">
                      <MessageCircle className="h-5 w-5 text-[#9b87f5]" />
                    </div>
                    <div>
                      <h3 className="text-lg font-medium text-white">تلغرام</h3>
                      <a 
                        href={socialLinks.telegram.startsWith('http') ? socialLinks.telegram : `https://t.me/${socialLinks.telegram.replace('@', '')}`} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="text-[#9b87f5] hover:underline"
                      >
                        {socialLinks.telegram}
                      </a>
                    </div>
                  </div>
                )}
                
                {/* Social Links */}
                <div className="flex items-center justify-center space-x-4 rtl:space-x-reverse mt-8">
                  {socialLinks.facebook && (
                    <a 
                      href={socialLinks.facebook} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="p-3 rounded-full bg-[#9b87f5]/20 text-[#9b87f5] hover:bg-[#9b87f5]/30 transition-colors"
                    >
                      <Facebook className="h-5 w-5" />
                    </a>
                  )}
                  
                  {socialLinks.instagram && (
                    <a 
                      href={socialLinks.instagram} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="p-3 rounded-full bg-[#9b87f5]/20 text-[#9b87f5] hover:bg-[#9b87f5]/30 transition-colors"
                    >
                      <Instagram className="h-5 w-5" />
                    </a>
                  )}
                  
                  {socialLinks.twitter && (
                    <a 
                      href={socialLinks.twitter} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="p-3 rounded-full bg-[#9b87f5]/20 text-[#9b87f5] hover:bg-[#9b87f5]/30 transition-colors"
                    >
                      <Twitter className="h-5 w-5" />
                    </a>
                  )}
                </div>
              </div>
            </div>
            
            {/* Contact Form */}
            <div className="lg:col-span-3">
              <div className="bg-[#1A1E2C] border border-[#2A3348] rounded-lg p-6">
                <h2 className="text-xl font-semibold mb-6 text-white">أرسل لنا رسالة</h2>
                
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">الاسم</Label>
                      <div className="relative">
                        <User className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="name"
                          name="name"
                          value={formData.name}
                          onChange={handleInputChange}
                          placeholder="أدخل اسمك"
                          className="pl-10 bg-[#242C3E] border-[#2A3348]"
                          required
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="email">البريد الإلكتروني</Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          placeholder="أدخل بريدك الإلكتروني"
                          className="pl-10 bg-[#242C3E] border-[#2A3348]"
                          required
                        />
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="subject">الموضوع</Label>
                    <Input
                      id="subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleInputChange}
                      placeholder="أدخل موضوع الرسالة"
                      className="bg-[#242C3E] border-[#2A3348]"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="message">الرسالة</Label>
                    <Textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleInputChange}
                      placeholder="اكتب رسالتك هنا..."
                      className="min-h-32 bg-[#242C3E] border-[#2A3348]"
                      required
                    />
                  </div>
                  
                  <Button 
                    type="submit" 
                    className="w-full bg-[#9b87f5] hover:bg-[#7E69AB]"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>جاري الإرسال...</>
                    ) : (
                      <>
                        <Send className="h-4 w-4 mr-2" />
                        إرسال الرسالة
                      </>
                    )}
                  </Button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Contact;
