
import { useState, useEffect } from 'react';
import * as OTPAuth from 'otpauth';

export interface TwoFactorData {
  secret: string;
  qrCodeUrl: string;
  isEnabled: boolean;
}

export const useTwoFactor = (userId: string) => {
  const [twoFactorData, setTwoFactorData] = useState<TwoFactorData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  // Load or generate 2FA data when component mounts
  useEffect(() => {
    const loadTwoFactorData = () => {
      try {
        setIsLoading(true);
        
        // Try to load existing 2FA data from localStorage
        const savedData = localStorage.getItem(`2fa_${userId}`);
        
        if (savedData) {
          setTwoFactorData(JSON.parse(savedData));
        } else {
          // Generate new 2FA data if none exists
          generateNewSecret();
        }
      } catch (error) {
        console.error('Error loading 2FA data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    if (userId) {
      loadTwoFactorData();
    }
  }, [userId]);
  
  // Generate a new secret for 2FA
  const generateNewSecret = () => {
    try {
      // Generate a new secret
      const secret = generateRandomBase32();
      
      // Create a new TOTP object
      const totp = new OTPAuth.TOTP({
        issuer: 'صرافة الكترونية',
        label: userId,
        algorithm: 'SHA1',
        digits: 6,
        period: 30,
        secret: secret
      });
      
      // Get the URL for the QR code
      const qrCodeUrl = totp.toString();
      
      const newTwoFactorData = {
        secret,
        qrCodeUrl,
        isEnabled: false
      };
      
      // Save to state and localStorage
      setTwoFactorData(newTwoFactorData);
      localStorage.setItem(`2fa_${userId}`, JSON.stringify(newTwoFactorData));
      
      return newTwoFactorData;
    } catch (error) {
      console.error('Error generating 2FA secret:', error);
      throw error;
    }
  };
  
  // Enable 2FA for the user
  const enableTwoFactor = (token: string): boolean => {
    if (!twoFactorData) return false;
    
    // Verify the token is correct before enabling
    if (verifyToken(token)) {
      const updatedData = {
        ...twoFactorData,
        isEnabled: true
      };
      
      setTwoFactorData(updatedData);
      localStorage.setItem(`2fa_${userId}`, JSON.stringify(updatedData));
      
      return true;
    }
    
    return false;
  };
  
  // Disable 2FA for the user
  const disableTwoFactor = (token: string): boolean => {
    if (!twoFactorData || !twoFactorData.isEnabled) return false;
    
    // Verify the token is correct before disabling
    if (verifyToken(token)) {
      const updatedData = {
        ...twoFactorData,
        isEnabled: false
      };
      
      setTwoFactorData(updatedData);
      localStorage.setItem(`2fa_${userId}`, JSON.stringify(updatedData));
      
      return true;
    }
    
    return false;
  };
  
  // Verify a TOTP token
  const verifyToken = (token: string): boolean => {
    if (!twoFactorData) return false;
    
    try {
      // Create a new TOTP object
      const totp = new OTPAuth.TOTP({
        issuer: 'صرافة الكترونية',
        label: userId,
        algorithm: 'SHA1',
        digits: 6,
        period: 30,
        secret: twoFactorData.secret
      });
      
      // Delta = 1 allows the token to be valid for one period before and after
      return totp.validate({ token, window: 1 }) !== null;
    } catch (error) {
      console.error('Error verifying token:', error);
      return false;
    }
  };
  
  // Helper function to generate random base32 string
  const generateRandomBase32 = (): string => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';
    let result = '';
    
    // Generate a 32 character string
    for (let i = 0; i < 32; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    
    return result;
  };
  
  return {
    twoFactorData,
    isLoading,
    generateNewSecret,
    enableTwoFactor,
    disableTwoFactor,
    verifyToken
  };
};
