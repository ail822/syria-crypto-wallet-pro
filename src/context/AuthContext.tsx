
import React, { createContext, useState, useEffect, useContext } from 'react';
import { User } from '@/types';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  login: (email: string, password: string) => Promise<{ userId: string; requires2FA: boolean; }>;
  register: (userData: Partial<User> & { password: string }) => Promise<void>;
  logout: () => void;
  updateUser: (userData: Partial<User>) => Promise<void>;
  updatePassword: (userId: string, currentPassword: string, newPassword: string) => Promise<boolean>;
  getUser: (userId: string) => User | null;
}

// Mock user data
const mockUser: User = {
  id: '1',
  name: 'محمد أحمد',
  email: 'user@example.com',
  balances: {
    usdt: 500,
    syp: 2500000,
  }
};

const mockAdmin: User = {
  id: 'admin1',
  name: 'المدير',
  email: 'admin@example.com',
  balances: {
    usdt: 10000,
    syp: 50000000,
  }
};

// إضافة المدير الجديد
const newAdmin: User = {
  id: 'admin2',
  name: 'محمد بارودي',
  email: 'barodimhamad@gmail.com',
  balances: {
    usdt: 10000,
    syp: 50000000,
  }
};

// Persistent storage for registered users
const REGISTERED_USERS_KEY = 'registeredUsers';

// Initialize registered users with defaults if not in localStorage
const initializeRegisteredUsers = () => {
  const storedUsers = localStorage.getItem(REGISTERED_USERS_KEY);
  if (!storedUsers) {
    const initialUsers = [
      { ...mockUser, password: 'password', twoFactorEnabled: false },
      { ...mockAdmin, password: 'admin', twoFactorEnabled: true },
      { ...newAdmin, password: 'aaazx@##$', twoFactorEnabled: true }
    ];
    localStorage.setItem(REGISTERED_USERS_KEY, JSON.stringify(initialUsers));
    return initialUsers;
  }
  
  try {
    return JSON.parse(storedUsers);
  } catch (e) {
    console.error('Error parsing registered users:', e);
    return [];
  }
};

const AuthContext = createContext<AuthContextType>({
  user: null,
  isAuthenticated: false,
  isAdmin: false,
  login: async () => ({ userId: '', requires2FA: false }),
  register: async () => {},
  logout: () => {},
  updateUser: async () => {},
  updatePassword: async () => false,
  getUser: () => null,
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [registeredUsers, setRegisteredUsers] = useState(() => initializeRegisteredUsers());
  
  // Check for saved user in localStorage on mount
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        
        // Check if 2FA verification is required but not completed
        const requires2FA = checkUserRequires2FA(parsedUser.id);
        const is2FAVerified = check2FAVerified();
        
        if (requires2FA && !is2FAVerified) {
          // If 2FA is required but not verified, don't set the user
          localStorage.removeItem('user');
        } else {
          setUser(parsedUser);
          setIsAdmin(['admin@example.com', 'barodimhamad@gmail.com'].includes(parsedUser.email.toLowerCase()));
        }
      } catch (error) {
        console.error('Error parsing stored user:', error);
        localStorage.removeItem('user');
      }
    }
  }, []);
  
  // Update registeredUsers in localStorage when it changes
  useEffect(() => {
    localStorage.setItem(REGISTERED_USERS_KEY, JSON.stringify(registeredUsers));
  }, [registeredUsers]);

  // Check if a user has 2FA enabled
  const checkUserRequires2FA = (userId: string): boolean => {
    const userData = registeredUsers.find(u => u.id === userId);
    return userData?.twoFactorEnabled === true;
  };
  
  // Check if 2FA is verified in the current session
  const check2FAVerified = (): boolean => {
    const verified = localStorage.getItem('2fa_verified');
    const time = localStorage.getItem('2fa_time');
    
    if (!verified || verified !== 'true' || !time) {
      return false;
    }
    
    // 2FA session expires after 12 hours
    const expirationTime = 12 * 60 * 60 * 1000; // 12 hours in milliseconds
    const timestamp = parseInt(time);
    
    if (isNaN(timestamp) || Date.now() - timestamp > expirationTime) {
      localStorage.removeItem('2fa_verified');
      localStorage.removeItem('2fa_time');
      return false;
    }
    
    return true;
  };

  const login = async (email: string, password: string) => {
    // Check registered users
    const foundUser = registeredUsers.find(u => u.email.toLowerCase() === email.toLowerCase());
    
    if (!foundUser) {
      throw new Error('بيانات الدخول غير صحيحة');
    }
    
    if (foundUser.password !== password) {
      throw new Error('كلمة المرور غير صحيحة');
    }
    
    const loggedInUser = { ...foundUser };
    delete (loggedInUser as any).password; // Remove password before setting user
    
    // Check if 2FA is required
    const requires2FA = checkUserRequires2FA(foundUser.id);
    
    if (!requires2FA) {
      // If 2FA is not required, log the user in directly
      setUser(loggedInUser);
      setIsAdmin(['admin@example.com', 'barodimhamad@gmail.com'].includes(email.toLowerCase()));
      localStorage.setItem('user', JSON.stringify(loggedInUser));
    } else {
      // If 2FA is required, store the user temporarily until 2FA verification
      localStorage.setItem('user', JSON.stringify(loggedInUser));
    }
    
    return {
      userId: foundUser.id,
      requires2FA
    };
  };

  const register = async (userData: Partial<User> & { password: string }) => {
    try {
      // تأكد من أن البريد الإلكتروني ليس مستخدمًا بالفعل
      const emailExists = registeredUsers.some(u => 
        u.email.toLowerCase() === userData.email?.toLowerCase()
      );
      
      if (emailExists) {
        throw new Error('البريد الإلكتروني مستخدم بالفعل، الرجاء استخدام بريد إلكتروني آخر');
      }
      
      const newUser = {
        id: Math.random().toString(36).substring(2, 11),
        name: userData.name || '',
        email: userData.email || '',
        telegramId: userData.telegramId,
        phoneNumber: userData.phoneNumber,
        balances: {
          usdt: 0,
          syp: 0
        },
        password: userData.password,
        twoFactorEnabled: false
      };
      
      // Add to registered users
      const updatedUsers = [...registeredUsers, newUser];
      setRegisteredUsers(updatedUsers);
      
      // Set as current user but remove password
      const userWithoutPassword = { ...newUser };
      delete (userWithoutPassword as any).password;
      
      setUser(userWithoutPassword);
      setIsAdmin(false);
      localStorage.setItem('user', JSON.stringify(userWithoutPassword));
    } catch (error) {
      throw error;
    }
  };

  const logout = () => {
    setUser(null);
    setIsAdmin(false);
    localStorage.removeItem('user');
    localStorage.removeItem('2fa_verified');
    localStorage.removeItem('2fa_time');
  };

  const updateUser = async (userData: Partial<User>) => {
    if (!user) return;
    
    const updatedUser = {
      ...user,
      ...userData,
    };
    
    // Also update in registered users
    const updatedRegisteredUsers = registeredUsers.map(u => {
      if (u.id === user.id) {
        return {
          ...u,
          ...userData
        };
      }
      return u;
    });
    
    setRegisteredUsers(updatedRegisteredUsers);
    setUser(updatedUser);
    localStorage.setItem('user', JSON.stringify(updatedUser));
  };
  
  const updatePassword = async (userId: string, currentPassword: string, newPassword: string): Promise<boolean> => {
    try {
      // Find the user in registered users
      const userIndex = registeredUsers.findIndex(u => u.id === userId);
      
      if (userIndex === -1) {
        throw new Error('المستخدم غير موجود');
      }
      
      // Check current password
      if (registeredUsers[userIndex].password !== currentPassword) {
        throw new Error('كلمة المرور الحالية غير صحيحة');
      }
      
      // Update password
      const updatedRegisteredUsers = [...registeredUsers];
      updatedRegisteredUsers[userIndex] = {
        ...updatedRegisteredUsers[userIndex],
        password: newPassword
      };
      
      setRegisteredUsers(updatedRegisteredUsers);
      return true;
    } catch (error) {
      console.error('Error updating password:', error);
      return false;
    }
  };
  
  const getUser = (userId: string): User | null => {
    const foundUser = registeredUsers.find(u => u.id === userId);
    
    if (!foundUser) {
      return null;
    }
    
    // Create a copy without the password
    const userCopy = { ...foundUser };
    delete (userCopy as any).password;
    
    return userCopy;
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      isAuthenticated: !!user,
      isAdmin,
      login, 
      register, 
      logout,
      updateUser,
      updatePassword,
      getUser
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
