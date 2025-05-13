
import React from 'react';
import ExchangeRateForm from './ExchangeRateForm';
import SocialLinksSettings from './SocialLinksSettings';
import GamesManager from './GamesManager';
import { Separator } from '@/components/ui/separator';

const AdminSettings = () => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold mb-2">إعدادات أسعار الصرف</h2>
        <ExchangeRateForm />
      </div>
      
      <Separator className="my-6" />
      
      <div>
        <h2 className="text-xl font-semibold mb-2">إدارة الألعاب</h2>
        <GamesManager />
      </div>
      
      <Separator className="my-6" />
      
      <div>
        <h2 className="text-xl font-semibold mb-2">وسائل التواصل الاجتماعي</h2>
        <SocialLinksSettings />
      </div>
    </div>
  );
};

export default AdminSettings;
