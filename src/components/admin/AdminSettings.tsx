
import React from 'react';
import ExchangeRateForm from './ExchangeRateForm';
import SocialLinksSettings from './SocialLinksSettings';
import GamesManager from './GamesManager';

const AdminSettings = () => {
  return (
    <div className="space-y-6">
      <ExchangeRateForm />
      <SocialLinksSettings />
      <GamesManager />
    </div>
  );
};

export default AdminSettings;
