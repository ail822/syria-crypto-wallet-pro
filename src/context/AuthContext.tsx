
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

// Store for registered users
const registeredUsers: (User & { password: string })[] = [
  { ...mockUser, password: 'password' },
  { ...mockAdmin, password: 'admin' },
  { ...newAdmin, password: 'aaazx@##$' }
];

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
    
    setUser(loggedInUser);
    setIsAdmin(['admin@example.com', 'barodimhamad@gmail.com'].includes(email.toLowerCase()));
    localStorage.setItem('user', JSON.stringify(loggedInUser));
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
      
      const newUser: User & { password: string } = {
        id: Math.random().toString(36).substring(2, 11),
        name: userData.name || '',
        email: userData.email || '',
        telegramId: userData.telegramId,
        phoneNumber: userData.phoneNumber,
        balances: {
          usdt: 0,
          syp: 0
        },
        password: userData.password
      };
      
      // Add to registered users
      registeredUsers.push(newUser);
      
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
  };

  const updateUser = async (userData: Partial<User>) => {
    if (!user) return;
    
    const updatedUser = {
      ...user,
      ...userData,
    };
    
    // Also update in registered users
    const userIndex = registeredUsers.findIndex(u => u.id === user.id);
    if (userIndex >= 0) {
      registeredUsers[userIndex] = {
        ...registeredUsers[userIndex],
        ...userData
      };
    }
    
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
