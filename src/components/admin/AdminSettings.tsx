
import React from 'react';
import ExchangeRateForm from './ExchangeRateForm';
import SocialLinksSettings from './SocialLinksSettings';

const AdminSettings = () => {
  return (
    <div className="space-y-6">
      <ExchangeRateForm />
      <SocialLinksSettings />
    </div>
  );
};

export default AdminSettings;
