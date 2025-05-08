
import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { 
  Home, 
  User, 
  LogOut, 
  CreditCard, 
  BarChart4,
  Settings
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  const { user, isAdmin, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };
  
  const navItems = [
    {
      icon: Home,
      label: 'الرئيسية',
      path: '/',
      adminOnly: false,
    },
    {
      icon: User,
      label: 'حسابي',
      path: '/profile',
      adminOnly: false,
    },
    {
      icon: BarChart4,
      label: 'لوحة التحكم',
      path: '/admin',
      adminOnly: true,
    },
    {
      icon: Settings,
      label: 'الإعدادات',
      path: '/admin/settings',
      adminOnly: true,
    },
  ];

  return (
    <div className="flex min-h-screen gradient-bg">
      {/* Sidebar */}
      <aside className="hidden md:flex flex-col fixed right-0 top-0 h-full w-64 bg-[#1A1E2C] border-l border-[#2A3348] p-4">
        <div className="flex items-center justify-center py-6">
          <h1 className="text-xl font-bold text-white">C-Wallet Pro</h1>
        </div>
        
        <div className="flex flex-col items-center mb-6 mt-2">
          <Avatar className="h-16 w-16 mb-3 border-2 border-primary">
            <AvatarImage src={user?.profileImage} />
            <AvatarFallback className="bg-primary/20 text-white">
              {user?.name.substring(0, 2)}
            </AvatarFallback>
          </Avatar>
          <h2 className="text-white text-lg font-medium">{user?.name}</h2>
          <p className="text-muted-foreground text-sm">{user?.email}</p>
        </div>
        
        <nav className="flex-1 mt-6">
          <ul className="space-y-2">
            {navItems
              .filter(item => !item.adminOnly || isAdmin)
              .map(item => (
                <li key={item.path}>
                  <Link
                    to={item.path}
                    className={cn(
                      "flex items-center gap-3 px-4 py-3 rounded-md text-[#B4B7C3] hover:bg-primary/20 hover:text-white transition-colors",
                      location.pathname === item.path && "bg-primary/20 text-white"
                    )}
                  >
                    <item.icon className="h-5 w-5" />
                    <span>{item.label}</span>
                  </Link>
                </li>
              ))}
          </ul>
        </nav>
        
        <Button 
          variant="outline" 
          className="mt-auto border-[#2A3348] text-muted-foreground hover:text-white hover:bg-destructive/20 hover:border-destructive/50"
          onClick={handleLogout}
        >
          <LogOut className="mr-2 h-4 w-4" />
          تسجيل الخروج
        </Button>
      </aside>
      
      {/* Mobile navbar */}
      <div className="fixed bottom-0 right-0 left-0 md:hidden bg-[#1A1E2C] border-t border-[#2A3348] z-50">
        <nav className="flex justify-around py-2">
          {navItems
            .filter(item => !item.adminOnly || isAdmin)
            .map(item => (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  "flex flex-col items-center justify-center px-3 py-2",
                  location.pathname === item.path ? "text-primary" : "text-[#B4B7C3]"
                )}
              >
                <item.icon className="h-5 w-5" />
                <span className="text-xs mt-1">{item.label}</span>
              </Link>
            ))}
            <button
              onClick={handleLogout}
              className="flex flex-col items-center justify-center px-3 py-2 text-[#B4B7C3]"
            >
              <LogOut className="h-5 w-5" />
              <span className="text-xs mt-1">خروج</span>
            </button>
        </nav>
      </div>
      
      {/* Main content */}
      <main className="flex-1 md:mr-64 p-4 md:p-8 pb-20 md:pb-8">
        {children}
      </main>
    </div>
  );
};

export default DashboardLayout;
