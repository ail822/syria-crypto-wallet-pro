
import React, { createContext, useContext, useState, useEffect } from 'react';

export interface SocialLinks {
  facebook?: string;
  youtube?: string;
  telegram?: string;
  whatsapp?: string;
}

interface PlatformContextType {
  platformName: string;
  setPlatformName: (name: string) => void;
  updatePlatformName: (name: string) => void;
  supportEmail: string;
  setSupportEmail: (email: string) => void;
  socialLinks: SocialLinks;
  setSocialLinks: (links: SocialLinks) => void;
}

const PlatformContext = createContext<PlatformContextType>({
  platformName: 'صرافة الكترونية',
  setPlatformName: () => {},
  updatePlatformName: () => {},
  supportEmail: 'support@example.com',
  setSupportEmail: () => {},
  socialLinks: {},
  setSocialLinks: () => {},
});

export const PlatformProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [platformName, setPlatformName] = useState<string>('صرافة الكترونية');
  const [supportEmail, setSupportEmail] = useState<string>('support@example.com');
  const [socialLinks, setSocialLinks] = useState<SocialLinks>({});
  
  useEffect(() => {
    // Load saved platform name from localStorage
    const savedPlatformName = localStorage.getItem('platformName');
    if (savedPlatformName) {
      setPlatformName(savedPlatformName);
    }
    
    // Load saved support email
    const savedSupportEmail = localStorage.getItem('supportEmail');
    if (savedSupportEmail) {
      setSupportEmail(savedSupportEmail);
    }
    
    // Load saved social links
    const savedSocialLinks = localStorage.getItem('socialLinks');
    if (savedSocialLinks) {
      try {
        setSocialLinks(JSON.parse(savedSocialLinks));
      } catch (error) {
        console.error('Error parsing social links:', error);
      }
    }
  }, []);
  
  // Save platform name to localStorage when it changes
  useEffect(() => {
    localStorage.setItem('platformName', platformName);
  }, [platformName]);
  
  // Save support email to localStorage when it changes
  useEffect(() => {
    localStorage.setItem('supportEmail', supportEmail);
  }, [supportEmail]);
  
  // Save social links to localStorage when they change
  useEffect(() => {
    localStorage.setItem('socialLinks', JSON.stringify(socialLinks));
  }, [socialLinks]);

  // Add the updatePlatformName function that was missing
  const updatePlatformName = (name: string) => {
    setPlatformName(name);
  };

  return (
    <PlatformContext.Provider value={{ 
      platformName, 
      setPlatformName, 
      updatePlatformName, 
      supportEmail, 
      setSupportEmail,
      socialLinks,
      setSocialLinks
    }}>
      {children}
    </PlatformContext.Provider>
  );
};

export const usePlatform = () => useContext(PlatformContext);
