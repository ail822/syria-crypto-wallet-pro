
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import RegisterForm from '@/components/auth/RegisterForm';
import { usePlatform } from '@/context/PlatformContext';

const Register = () => {
  const { isAuthenticated } = useAuth();
  const { platformName } = usePlatform();
  
  if (isAuthenticated) {
    return <Navigate to="/" />;
  }

  return (
    <div className="min-h-screen flex items-center justify-center gradient-bg">
      <div className="w-full max-w-md p-6 animate-slide-in">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-2 platform-name">{platformName}</h1>
          <p className="text-muted-foreground">إنشاء حساب جديد</p>
        </div>
        
        <div className="bg-[#1A1E2C] rounded-xl border border-[#2A3348] p-6 shadow-lg">
          <RegisterForm />
        </div>
      </div>
    </div>
  );
};

export default Register;
