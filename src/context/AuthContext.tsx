
import React, { createContext, useState, useEffect, useContext } from 'react';
import { User } from '@/types';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (userData: Partial<User> & { password: string }) => Promise<void>;
  logout: () => void;
  updateUser: (userData: Partial<User>) => Promise<void>;
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

const AuthContext = createContext<AuthContextType>({
  user: null,
  isAuthenticated: false,
  isAdmin: false,
  login: async () => {},
  register: async () => {},
  logout: () => {},
  updateUser: async () => {},
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  
  // Check for saved user in localStorage on mount
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
      setIsAdmin(parsedUser.email === 'admin@example.com' || parsedUser.email === 'barodimhamad@gmail.com');
    }
  }, []);

  const login = async (email: string, password: string) => {
    // Mock login functionality
    try {
      let loggedInUser;
      
      if (email === 'admin@example.com' && password === 'admin') {
        loggedInUser = mockAdmin;
        setIsAdmin(true);
      } else if (email === 'barodimhamad@gmail.com' && password === 'aaazx@##$') {
        loggedInUser = newAdmin;
        setIsAdmin(true);
      } else if (email === 'user@example.com' && password === 'password') {
        loggedInUser = mockUser;
        setIsAdmin(false);
      } else {
        throw new Error('بيانات الدخول غير صحيحة');
      }
      
      setUser(loggedInUser);
      localStorage.setItem('user', JSON.stringify(loggedInUser));
    } catch (error) {
      throw error;
    }
  };

  const register = async (userData: Partial<User> & { password: string }) => {
    // Mock registration
    try {
      // تأكد من أن البريد الإلكتروني ليس مستخدمًا بالفعل
      if (userData.email === 'admin@example.com' || 
          userData.email === 'user@example.com' || 
          userData.email === 'barodimhamad@gmail.com') {
        throw new Error('البريد الإلكتروني مستخدم بالفعل');
      }
      
      const newUser: User = {
        id: Math.random().toString(36).substring(2, 11),
        name: userData.name || '',
        email: userData.email || '',
        telegramId: userData.telegramId,
        phoneNumber: userData.phoneNumber,
        balances: {
          usdt: 0,
          syp: 0
        }
      };
      
      setUser(newUser);
      setIsAdmin(false);
      localStorage.setItem('user', JSON.stringify(newUser));
    } catch (error) {
      throw error;
    }
  };

  const logout = () => {
    setUser(null);
    setIsAdmin(false);
    localStorage.removeItem('user');
  };

  const updateUser = async (userData: Partial<User>) => {
    if (!user) return;
    
    const updatedUser = {
      ...user,
      ...userData,
    };
    
    setUser(updatedUser);
    localStorage.setItem('user', JSON.stringify(updatedUser));
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      isAuthenticated: !!user,
      isAdmin,
      login, 
      register, 
      logout,
      updateUser
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
