
import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';

interface SocialLinks {
  [key: string]: string;
  facebook?: string;
  youtube?: string;
  telegram?: string;
  whatsapp?: string;
}

interface PlatformContextType {
  platformName: string;
  updatePlatformName: (name: string) => void;
  socialLinks: SocialLinks;
  updateSocialLinks: (links: SocialLinks) => void;
}

const PlatformContext = createContext<PlatformContextType>({
  platformName: 'صرافة الكترونية',
  updatePlatformName: () => {},
  socialLinks: {},
  updateSocialLinks: () => {}
});

export const PlatformProvider = ({ children }: { children: ReactNode }) => {
  const [platformName, setPlatformName] = useState('صرافة الكترونية');
  const [socialLinks, setSocialLinks] = useState<SocialLinks>({});
  
  useEffect(() => {
    // Load platform name from local storage
    const storedName = localStorage.getItem('platformName');
    if (storedName) {
      setPlatformName(storedName);
    }
    
    // Load social links from local storage
    const storedLinks = localStorage.getItem('socialLinks');
    if (storedLinks) {
      try {
        const parsedLinks = JSON.parse(storedLinks);
        setSocialLinks(parsedLinks);
      } catch (error) {
        console.error('Error parsing social links:', error);
      }
    }
  }, []);
  
  const updatePlatformName = (name: string) => {
    setPlatformName(name);
    localStorage.setItem('platformName', name);
  };
  
  const updateSocialLinks = (links: SocialLinks) => {
    setSocialLinks(links);
    localStorage.setItem('socialLinks', JSON.stringify(links));
  };
  
  return (
    <PlatformContext.Provider 
      value={{ 
        platformName, 
        updatePlatformName,
        socialLinks,
        updateSocialLinks
      }}
    >
      {children}
    </PlatformContext.Provider>
  );
};

export const usePlatform = () => useContext(PlatformContext);
