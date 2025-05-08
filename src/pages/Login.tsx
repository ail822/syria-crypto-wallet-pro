
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import LoginForm from '@/components/auth/LoginForm';

const Login = () => {
  const { isAuthenticated } = useAuth();
  
  if (isAuthenticated) {
    return <Navigate to="/" />;
  }

  return (
    <div className="min-h-screen flex items-center justify-center gradient-bg">
      <div className="w-full max-w-md p-6 animate-slide-in">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">C-Wallet Pro</h1>
          <p className="text-muted-foreground">تسجيل الدخول إلى حسابك</p>
        </div>
        
        <div className="bg-[#1A1E2C] rounded-xl border border-[#2A3348] p-6 shadow-lg">
          <LoginForm />
        </div>
      </div>
    </div>
  );
};

export default Login;
