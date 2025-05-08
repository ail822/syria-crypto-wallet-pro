
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from '@/hooks/use-toast';
import CardSection from '../ui/card-section';
import { usePlatform } from '@/context/PlatformContext';

const PlatformSettings = () => {
  const { platformName, updatePlatformName } = usePlatform();
  const [name, setName] = useState(platformName);
  const [isLoading, setIsLoading] = useState(false);
  
  const handleSavePlatformName = () => {
    if (!name.trim()) {
      toast({
        title: "اسم غير صالح",
        description: "يرجى إدخال اسم صالح للمنصة",
        variant: "destructive",
      });
      return;
    }
    
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      updatePlatformName(name);
      setIsLoading(false);
      toast({
        title: "تم تحديث اسم المنصة",
        description: `تم تغيير اسم المنصة إلى ${name}`,
      });
    }, 500);
  };
  
  return (
    <CardSection title="إعدادات المنصة">
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="platform_name">اسم المنصة</Label>
          <Input
            id="platform_name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="أدخل اسم المنصة"
            className="bg-[#242C3E] border-[#2A3348] text-white dark:bg-[#242C3E] dark:border-[#2A3348] dark:text-white"
          />
        </div>
        
        <Button 
          className="w-full" 
          onClick={handleSavePlatformName}
          disabled={isLoading}
        >
          {isLoading ? "جاري الحفظ..." : "حفظ اسم المنصة"}
        </Button>
      </div>
    </CardSection>
  );
};

export default PlatformSettings;
