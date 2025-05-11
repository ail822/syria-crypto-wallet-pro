
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from '@/hooks/use-toast';
import CardSection from '@/components/ui/card-section';

const ExchangeRateForm = () => {
  const [rates, setRates] = useState({
    USD: 1.0,
    EUR: 0.85,
    GBP: 0.72,
    JPY: 109.5,
  });
  
  const [isLoading, setIsLoading] = useState(false);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setIsLoading(true);
      
      // Simulate API call to update exchange rates
      setTimeout(() => {
        // Save to localStorage
        localStorage.setItem('exchangeRates', JSON.stringify(rates));
        
        setIsLoading(false);
        toast({ title: "تم تحديث أسعار الصرف بنجاح" });
      }, 500);
    } catch (error) {
      toast({
        title: "فشل تحديث أسعار الصرف",
        description: "حدث خطأ أثناء تحديث أسعار الصرف",
        variant: "destructive",
      });
      setIsLoading(false);
    }
  };
  
  const handleRateChange = (currency: string, value: string) => {
    const numericValue = parseFloat(value) || 0;
    setRates({
      ...rates,
      [currency]: numericValue,
    });
  };

  return (
    <CardSection title="أسعار الصرف">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="usdRate">الدولار الأمريكي (USD)</Label>
            <Input
              id="usdRate"
              type="number"
              step="0.01"
              value={rates.USD}
              onChange={(e) => handleRateChange('USD', e.target.value)}
              placeholder="1.00"
              className="bg-[#242C3E] border-[#2A3348] text-white"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="eurRate">اليورو (EUR)</Label>
            <Input
              id="eurRate"
              type="number"
              step="0.01"
              value={rates.EUR}
              onChange={(e) => handleRateChange('EUR', e.target.value)}
              placeholder="0.85"
              className="bg-[#242C3E] border-[#2A3348] text-white"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="gbpRate">الجنيه الإسترليني (GBP)</Label>
            <Input
              id="gbpRate"
              type="number"
              step="0.01"
              value={rates.GBP}
              onChange={(e) => handleRateChange('GBP', e.target.value)}
              placeholder="0.72"
              className="bg-[#242C3E] border-[#2A3348] text-white"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="jpyRate">الين الياباني (JPY)</Label>
            <Input
              id="jpyRate"
              type="number"
              step="0.01"
              value={rates.JPY}
              onChange={(e) => handleRateChange('JPY', e.target.value)}
              placeholder="109.50"
              className="bg-[#242C3E] border-[#2A3348] text-white"
            />
          </div>
        </div>
        
        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? "جارٍ التحديث..." : "تحديث أسعار الصرف"}
        </Button>
      </form>
    </CardSection>
  );
};

export default ExchangeRateForm;
