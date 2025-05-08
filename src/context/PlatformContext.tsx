
import React, { createContext, useState, useContext, ReactNode } from 'react';

interface PlatformContextType {
  platformName: string;
  updatePlatformName: (name: string) => void;
}

const PlatformContext = createContext<PlatformContextType | undefined>(undefined);

export const PlatformProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [platformName, setPlatformName] = useState('C-Wallet Pro');

  const updatePlatformName = (name: string) => {
    setPlatformName(name);
  };

  return (
    <PlatformContext.Provider value={{
      platformName,
      updatePlatformName
    }}>
      {children}
    </PlatformContext.Provider>
  );
};

export const usePlatform = () => {
  const context = useContext(PlatformContext);
  if (context === undefined) {
    throw new Error('usePlatform must be used within a PlatformProvider');
  }
  return context;
};
