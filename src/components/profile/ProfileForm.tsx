
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/context/AuthContext';
import { toast } from '@/hooks/use-toast';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import CardSection from '../ui/card-section';

const ProfileForm = () => {
  const { user, updateUser } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [profileData, setProfileData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    telegramId: user?.telegramId || '',
    phoneNumber: user?.phoneNumber || '',
    profileImage: user?.profileImage || '',
  });
  
  const [previewImage, setPreviewImage] = useState<string | null>(user?.profileImage || null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProfileData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setIsLoading(true);
      await updateUser({
        name: profileData.name,
        email: profileData.email,
        telegramId: profileData.telegramId || undefined,
        phoneNumber: profileData.phoneNumber || undefined,
        profileImage: previewImage || undefined,
      });
      
      toast({ title: "تم تحديث الملف الشخصي بنجاح" });
    } catch (error) {
      toast({
        title: "فشل تحديث الملف الشخصي",
        description: "حدث خطأ أثناء تحديث بياناتك",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <CardSection title="تعديل الملف الشخصي">
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Profile Image */}
        <div className="flex flex-col items-center mb-6">
          <Avatar className="h-24 w-24 mb-3 border-2 border-primary">
            <AvatarImage src={previewImage || undefined} />
            <AvatarFallback className="bg-primary/20 text-white text-lg">
              {profileData.name.substring(0, 2)}
            </AvatarFallback>
          </Avatar>
          
          <Label 
            htmlFor="profileImage"
            className="cursor-pointer px-3 py-1 bg-primary/20 text-primary rounded-md hover:bg-primary/30 transition-colors"
          >
            تغيير الصورة
          </Label>
          <Input
            id="profileImage"
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="hidden"
          />
        </div>
        
        {/* Name */}
        <div className="space-y-2">
          <Label htmlFor="name">الاسم الكامل</Label>
          <Input
            id="name"
            name="name"
            value={profileData.name}
            onChange={handleChange}
            placeholder="أدخل اسمك الكامل"
            required
            className="bg-[#242C3E] border-[#2A3348] text-white"
          />
        </div>
        
        {/* Email */}
        <div className="space-y-2">
          <Label htmlFor="email">البريد الإلكتروني</Label>
          <Input
            id="email"
            name="email"
            type="email"
            value={profileData.email}
            onChange={handleChange}
            placeholder="أدخل بريدك الإلكتروني"
            required
            className="bg-[#242C3E] border-[#2A3348] text-white"
          />
        </div>
        
        {/* Telegram ID */}
        <div className="space-y-2">
          <Label htmlFor="telegramId">معرف تلغرام (اختياري)</Label>
          <div className="flex">
            <span className="inline-flex items-center px-3 rounded-r-none rounded-md border border-l-0 border-[#2A3348] bg-[#1E293B] text-white">
              @
            </span>
            <Input
              id="telegramId"
              name="telegramId"
              value={profileData.telegramId}
              onChange={handleChange}
              placeholder="معرف تلغرام الخاص بك"
              className="rounded-r-none bg-[#242C3E] border-[#2A3348] text-white"
            />
          </div>
        </div>
        
        {/* Phone Number */}
        <div className="space-y-2">
          <Label htmlFor="phoneNumber">رقم الهاتف أو واتساب (اختياري)</Label>
          <Input
            id="phoneNumber"
            name="phoneNumber"
            type="tel"
            value={profileData.phoneNumber}
            onChange={handleChange}
            placeholder="مثال: +963912345678"
            className="bg-[#242C3E] border-[#2A3348] text-white"
          />
        </div>
        
        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? "جاري الحفظ..." : "حفظ التغييرات"}
        </Button>
      </form>
    </CardSection>
  );
};

export default ProfileForm;
