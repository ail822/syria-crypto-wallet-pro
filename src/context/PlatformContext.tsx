
import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';

interface PlatformContextType {
  platformName: string;
  updatePlatformName: (name: string) => void;
}

const PlatformContext = createContext<PlatformContextType | undefined>(undefined);

export const PlatformProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // استرجاع اسم المنصة من التخزين المحلي إذا كان موجودًا
  const [platformName, setPlatformName] = useState(() => {
    const savedName = localStorage.getItem('platformName');
    return savedName || 'C-Wallet Pro';
  });

  // حفظ اسم المنصة في التخزين المحلي عند تغييره
  useEffect(() => {
    localStorage.setItem('platformName', platformName);
  }, [platformName]);

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
