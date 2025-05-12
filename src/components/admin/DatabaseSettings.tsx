
import React from 'react';
import BackupRestoreForm from './BackupRestoreForm';

const DatabaseSettings = () => {
  return (
    <div className="space-y-6">
      <BackupRestoreForm />
      
      {/* Additional database settings can be added here in the future */}
    </div>
  );
};

export default DatabaseSettings;
