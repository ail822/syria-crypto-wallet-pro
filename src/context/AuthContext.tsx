
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User } from '@/types';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; requiresTwoFactor?: boolean; userId?: string }>;
  logout: () => void;
  register: (name: string, email: string, password: string, phoneNumber?: string, telegramId?: string) => Promise<void>;
  updateUser: (updates: Partial<User>) => void;
  refreshUser: () => Promise<void>;
  updatePassword: (userId: string, currentPassword: string, newPassword: string) => Promise<boolean>;
}

interface RegisteredUser extends User {
  password: string;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isAuthenticated: false,
  isAdmin: false,
  login: async () => ({ success: false }),
  logout: () => {},
  register: async () => {},
  updateUser: () => {},
  refreshUser: async () => {},
  updatePassword: async () => false,
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  
  useEffect(() => {
    // Check if user is already logged in
    const storedUser = localStorage.getItem('user');
    
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    
    // Initialize admin account if it doesn't exist
    initializeAdminAccount();
  }, []);
  
  // Function to initialize admin account
  const initializeAdminAccount = () => {
    const registeredUsersJSON = localStorage.getItem('registeredUsers');
    let registeredUsers: RegisteredUser[] = [];
    
    if (registeredUsersJSON) {
      registeredUsers = JSON.parse(registeredUsersJSON);
      
      // Check if admin account exists - update to new admin email
      const adminExists = registeredUsers.some(
        (u) => u.email.toLowerCase() === 'barodimhamad110@gmail.com'
      );
      
      if (!adminExists) {
        // Create admin account with new credentials
        const adminUser: RegisteredUser = {
          id: 'admin-' + Math.random().toString(36).substring(2, 11),
          email: 'barodimhamad110@gmail.com',
          name: 'Admin User',
          isAdmin: true,
          password: 'barodimhamad110',
          balances: {
            usdt: 1000,
            syp: 500000,
            aed: 0
          }
        };
        
        registeredUsers.push(adminUser);
        localStorage.setItem('registeredUsers', JSON.stringify(registeredUsers));
      }
      
      // Remove old admin account if it exists
      const updatedUsers = registeredUsers.filter(
        (u) => u.email.toLowerCase() !== 'barodimhamad@gmail.com'
      );
      
      if (updatedUsers.length !== registeredUsers.length) {
        localStorage.setItem('registeredUsers', JSON.stringify(updatedUsers));
      }
    } else {
      // No users registered yet, create admin account
      const adminUser: RegisteredUser = {
        id: 'admin-' + Math.random().toString(36).substring(2, 11),
        email: 'barodimhamad110@gmail.com',
        name: 'Admin User',
        isAdmin: true,
        password: 'barodimhamad110',
        balances: {
          usdt: 1000,
          syp: 500000,
          aed: 0
        }
      };
      
      registeredUsers.push(adminUser);
      localStorage.setItem('registeredUsers', JSON.stringify(registeredUsers));
    }
  };
  
  const login = async (email: string, password: string) => {
    // Look for the user in localStorage
    const registeredUsersJSON = localStorage.getItem('registeredUsers');
    
    if (!registeredUsersJSON) {
      throw new Error('البريد الإلكتروني أو كلمة المرور غير صحيحة');
    }
    
    const registeredUsers: RegisteredUser[] = JSON.parse(registeredUsersJSON);
    const foundUser = registeredUsers.find(
      (u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password
    );
    
    if (!foundUser) {
      throw new Error('البريد الإلكتروني أو كلمة المرور غير صحيحة');
    }

    // Check for 2FA
    const twoFactorDataJSON = localStorage.getItem(`2fa_${foundUser.id}`);
    
    if (twoFactorDataJSON) {
      const twoFactorData = JSON.parse(twoFactorDataJSON);
      
      if (twoFactorData.isEnabled) {
        // Return early, requiring 2FA verification
        return { 
          success: true,
          requiresTwoFactor: true,
          userId: foundUser.id
        };
      }
    }
    
    // User authenticated, remove password for security
    const { password: _, ...userWithoutPassword } = foundUser;
    
    // Save to state and localStorage
    setUser(userWithoutPassword);
    localStorage.setItem('user', JSON.stringify(userWithoutPassword));
    
    return { success: true };
  };
  
  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
    localStorage.removeItem('2fa_verified');
    localStorage.removeItem('2fa_time');
  };
  
  const register = async (name: string, email: string, password: string, phoneNumber?: string, telegramId?: string) => {
    // Check if user already exists
    const registeredUsersJSON = localStorage.getItem('registeredUsers');
    let registeredUsers: RegisteredUser[] = [];
    
    if (registeredUsersJSON) {
      registeredUsers = JSON.parse(registeredUsersJSON);
      
      const userExists = registeredUsers.some(
        (u) => u.email.toLowerCase() === email.toLowerCase()
      );
      
      if (userExists) {
        throw new Error('البريد الإلكتروني مسجل بالفعل');
      }
    }
    
    // Create new user
    const newUser: RegisteredUser = {
      id: Math.random().toString(36).substring(2, 11),
      email,
      name,
      phoneNumber,
      telegramId,
      isAdmin: false, // New users are not admins by default
      password, // Store password for authentication
      balances: {
        usdt: 0,
        syp: 0
      }
    };
    
    // Add to registered users
    registeredUsers.push(newUser);
    localStorage.setItem('registeredUsers', JSON.stringify(registeredUsers));
  };
  
  const updatePassword = async (userId: string, currentPassword: string, newPassword: string): Promise<boolean> => {
    try {
      // Get registered users from localStorage
      const registeredUsersJSON = localStorage.getItem('registeredUsers');
      if (!registeredUsersJSON) return false;
      
      const registeredUsers: RegisteredUser[] = JSON.parse(registeredUsersJSON);
      
      // Find the user and verify their current password
      const userIndex = registeredUsers.findIndex(u => u.id === userId);
      
      if (userIndex === -1 || registeredUsers[userIndex].password !== currentPassword) {
        return false;
      }
      
      // Update the password
      registeredUsers[userIndex].password = newPassword;
      
      // Save back to localStorage
      localStorage.setItem('registeredUsers', JSON.stringify(registeredUsers));
      
      return true;
    } catch (error) {
      console.error('Error updating password:', error);
      return false;
    }
  };
  
  const updateUser = (updates: Partial<User>) => {
    if (!user) return;
    
    const updatedUser = { ...user, ...updates };
    setUser(updatedUser);
    localStorage.setItem('user', JSON.stringify(updatedUser));
    
    // Also update in registeredUsers
    const registeredUsersJSON = localStorage.getItem('registeredUsers');
    
    if (registeredUsersJSON) {
      const registeredUsers: RegisteredUser[] = JSON.parse(registeredUsersJSON);
      const updatedRegisteredUsers = registeredUsers.map((u) => {
        if (u.id === user.id) {
          return { ...u, ...updates };
        }
        return u;
      });
      
      localStorage.setItem('registeredUsers', JSON.stringify(updatedRegisteredUsers));
    }
  };
  
  const refreshUser = async () => {
    if (!user?.id) return;
    
    // Get the latest user data from localStorage (registeredUsers)
    const registeredUsersJSON = localStorage.getItem('registeredUsers');
    
    if (!registeredUsersJSON) return;
    
    const registeredUsers: RegisteredUser[] = JSON.parse(registeredUsersJSON);
    const freshUserData = registeredUsers.find((u) => u.id === user.id);
    
    if (freshUserData) {
      // Remove password for security
      const { password: _, ...userWithoutPassword } = freshUserData;
      
      // Update state and localStorage
      setUser(userWithoutPassword);
      localStorage.setItem('user', JSON.stringify(userWithoutPassword));
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isAdmin: user?.isAdmin || false,
        login,
        logout,
        register,
        updateUser,
        refreshUser,
        updatePassword
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
