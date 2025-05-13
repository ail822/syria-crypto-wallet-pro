
import React from 'react';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Facebook, Instagram, Mail, MessageCircle } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { useAuth } from '@/context/AuthContext';
import { usePlatform } from '@/context/PlatformContext';

const About = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { platformName, socialLinks } = usePlatform();
  
  // Convert socialLinks object to array for mapping
  const socialLinksArray = Object.entries(socialLinks || {}).map(([key, value]) => ({
    name: key,
    url: value
  }));

  return (
    <DashboardLayout>
      <div className="animate-fade-in">
        <h1 className="text-2xl font-bold mb-6">حول {platformName}</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>من نحن</CardTitle>
              <CardDescription>تعرّف أكثر على خدماتنا وتاريخنا</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>
                نحن منصة موثوقة للصرافة الإلكترونية تقدم خدمات تحويل الأموال والعملات الرقمية بسرعة وأمان.
                تأسسنا في عام 2021 بهدف تسهيل التعاملات المالية الإلكترونية لعملائنا في جميع أنحاء العالم.
              </p>
              <p>
                نقدم خدمات متنوعة تشمل:
              </p>
              <ul className="list-disc list-inside space-y-1 pr-4">
                <li>تحويل العملات الرقمية</li>
                <li>شحن محافظ إلكترونية</li>
                <li>شحن ألعاب إلكترونية</li>
                <li>خدمات تحويل الأموال</li>
              </ul>
            </CardContent>
            <CardFooter>
              <Button variant="outline" asChild>
                <Link to="/contact">تواصل معنا</Link>
              </Button>
            </CardFooter>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>تواصل معنا</CardTitle>
              <CardDescription>نحن هنا للإجابة على استفساراتك</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-2">
                <Mail className="h-5 w-5" />
                <span>البريد الإلكتروني: support@example.com</span>
              </div>
              
              <div className="flex items-center gap-2">
                <MessageCircle className="h-5 w-5" />
                <span>الدعم الفني: +1 123-456-7890</span>
              </div>
              
              <Separator />
              
              <h3 className="font-medium">تابعنا على وسائل التواصل الاجتماعي</h3>
              
              <div className="flex flex-wrap gap-3">
                {socialLinksArray.length > 0 ? (
                  socialLinksArray.map((socialLink) => (
                    <Button
                      key={socialLink.name}
                      variant="outline"
                      size="sm"
                      asChild
                      className="gap-2"
                    >
                      <a href={socialLink.url} target="_blank" rel="noopener noreferrer">
                        {renderSocialIcon(socialLink.name)}
                        {formatSocialName(socialLink.name)}
                      </a>
                    </Button>
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground">لا توجد روابط اجتماعية مضافة</p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>الشروط والأحكام</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>
                باستخدامك لخدماتنا، فإنك توافق على الالتزام بشروط وأحكام الاستخدام الخاصة بنا.
                يرجى قراءة هذه الشروط بعناية قبل استخدام منصتنا.
              </p>
              
              <h3 className="font-medium">الخصوصية والأمان</h3>
              <p>
                نحن نلتزم بحماية بياناتك الشخصية والحفاظ على خصوصيتك. نستخدم أحدث تقنيات التشفير
                لضمان أمان معلوماتك ومعاملاتك المالية.
              </p>
            </CardContent>
            <CardFooter>
              {!isAuthenticated && (
                <Button
                  onClick={() => navigate('/register')}
                  className="bg-[#1E88E5] hover:bg-[#1A237E]"
                >
                  سجل الآن واستفد من خدماتنا
                </Button>
              )}
            </CardFooter>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

// Helper function to render social icon based on name
const renderSocialIcon = (name: string) => {
  const lowerName = name.toLowerCase();
  
  if (lowerName.includes('facebook')) {
    return <Facebook className="h-4 w-4" />;
  }
  
  if (lowerName.includes('instagram')) {
    return <Instagram className="h-4 w-4" />;
  }
  
  if (lowerName.includes('telegram')) {
    return <MessageCircle className="h-4 w-4" />;
  }
  
  return <MessageCircle className="h-4 w-4" />;
};

// Helper function to format social network name
const formatSocialName = (name: string): string => {
  const capitalizedName = name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();
  return capitalizedName;
};

export default About;
