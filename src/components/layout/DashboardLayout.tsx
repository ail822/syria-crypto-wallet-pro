
import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { 
  Home, 
  User, 
  LogOut, 
  CreditCard, 
  BarChart4,
  Settings,
  Sun,
  Moon
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { usePlatform } from '@/context/PlatformContext';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';
import { useTheme } from '@/context/ThemeContext';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  const { user, isAdmin, logout } = useAuth();
  const { platformName } = usePlatform();
  const location = useLocation();
  const navigate = useNavigate();
  const { theme, setTheme } = useTheme();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };
  
  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
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

  // Available themes with colors
  const themes = [
    { name: 'light', label: 'فاتح', icon: Sun, color: '#FFFFFF' },
    { name: 'dark', label: 'داكن', icon: Moon, color: '#121212' },
    { name: 'blue', label: 'أزرق', color: '#1E3A8A' },
    { name: 'green', label: 'أخضر', color: '#166534' },
    { name: 'purple', label: 'بنفسجي', color: '#581C87' }
  ];

  return (
    <div className={cn("flex min-h-screen", theme === 'light' ? 'bg-gray-100' : 'gradient-bg')}>
      {/* Sidebar */}
      <aside className={cn("hidden md:flex flex-col fixed right-0 top-0 h-full w-64 border-l p-4",
        theme === 'light' 
          ? "bg-white border-gray-200" 
          : "bg-[#1A1E2C] border-[#2A3348]"
      )}>
        <div className="flex items-center justify-center py-6">
          <h1 className={cn("text-xl font-bold platform-name", theme === 'light' ? "text-gray-800" : "text-white")}>
            {platformName}
          </h1>
        </div>
        
        <div className="flex flex-col items-center mb-6 mt-2">
          <Avatar className={cn("h-16 w-16 mb-3 border-2", theme === 'light' ? "border-blue-500" : "border-primary")}>
            <AvatarImage src="" />
            <AvatarFallback className={cn(theme === 'light' ? "bg-blue-100 text-blue-800" : "bg-primary/20 text-white")}>
              {user?.name?.substring(0, 2) || ""}
            </AvatarFallback>
          </Avatar>
          <h2 className={cn("text-lg font-medium", theme === 'light' ? "text-gray-800" : "text-white")}>
            {user?.name}
          </h2>
          <p className={theme === 'light' ? "text-gray-500 text-sm" : "text-muted-foreground text-sm"}>
            {user?.email}
          </p>
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
                      "flex items-center gap-3 px-4 py-3 rounded-md transition-colors",
                      location.pathname === item.path 
                        ? theme === 'light' 
                          ? "bg-blue-100 text-blue-800" 
                          : "bg-primary/20 text-white" 
                        : theme === 'light' 
                          ? "text-gray-600 hover:bg-gray-100 hover:text-gray-900" 
                          : "text-[#B4B7C3] hover:bg-primary/20 hover:text-white"
                    )}
                  >
                    <item.icon className="h-5 w-5" />
                    <span>{item.label}</span>
                  </Link>
                </li>
              ))}
          </ul>
        </nav>
        
        <div className="flex flex-col space-y-3 mt-auto">
          {/* Enhanced theme selector */}
          <div className={cn(
            "p-3 rounded-lg border",
            theme === 'light' ? "border-gray-200 bg-white" : "border-[#2A3348] bg-[#1A1E2C]"
          )}>
            <div className="flex justify-between items-center mb-2">
              <span className={cn(
                "text-sm font-medium",
                theme === 'light' ? "text-gray-700" : "text-gray-200"
              )}>
                المظهر
              </span>
            </div>
            <div className="flex flex-wrap gap-2">
              {themes.map((t) => (
                <button
                  key={t.name}
                  onClick={() => setTheme(t.name as "dark" | "light")}
                  className={cn(
                    "w-8 h-8 rounded-full flex items-center justify-center transition-all",
                    theme === t.name ? "ring-2 ring-primary ring-offset-2" : ""
                  )}
                  style={{ backgroundColor: t.color }}
                  title={t.label}
                >
                  {theme === t.name && (
                    <span className="text-white text-xs">✓</span>
                  )}
                </button>
              ))}
            </div>
          </div>
          
          <Button 
            variant="outline" 
            className={cn(
              theme === 'light' 
                ? "border-gray-200 text-red-600 hover:bg-red-50 hover:text-red-700 hover:border-red-300" 
                : "border-[#2A3348] text-muted-foreground hover:text-white hover:bg-destructive/20 hover:border-destructive/50"
            )}
            onClick={handleLogout}
          >
            <LogOut className="mr-2 h-4 w-4" />
            تسجيل الخروج
          </Button>
        </div>
      </aside>
      
      {/* Mobile navbar */}
      <div className={cn(
        "fixed bottom-0 right-0 left-0 md:hidden z-50 border-t",
        theme === 'light' 
          ? "bg-white border-gray-200" 
          : "bg-[#1A1E2C] border-[#2A3348]"
      )}>
        <nav className="flex justify-around py-2">
          {navItems
            .filter(item => !item.adminOnly || isAdmin)
            .map(item => (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  "flex flex-col items-center justify-center px-3 py-2",
                  location.pathname === item.path 
                    ? theme === 'light' 
                      ? "text-blue-600" 
                      : "text-primary" 
                    : theme === 'light' 
                      ? "text-gray-600" 
                      : "text-[#B4B7C3]"
                )}
              >
                <item.icon className="h-5 w-5" />
                <span className="text-xs mt-1">{item.label}</span>
              </Link>
            ))}
            
            {/* Theme Menu Button */}
            <button
              onClick={toggleTheme}
              className={cn(
                "flex flex-col items-center justify-center px-3 py-2 relative",
                theme === 'light' ? "text-gray-600" : "text-[#B4B7C3]"
              )}
            >
              {theme === 'light' ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
              <span className="text-xs mt-1">المظهر</span>
            </button>
            
            {/* Logout Button */}
            <button
              onClick={handleLogout}
              className={cn(
                "flex flex-col items-center justify-center px-3 py-2",
                theme === 'light' ? "text-gray-600" : "text-[#B4B7C3]"
              )}
            >
              <LogOut className="h-5 w-5" />
              <span className="text-xs mt-1">خروج</span>
            </button>
        </nav>
      </div>
      
      {/* Main content */}
      <main className={cn(
        "flex-1 md:mr-64 p-4 md:p-8 pb-20 md:pb-8", 
        theme === 'light' ? "bg-gray-100 text-gray-900" : ""
      )}>
        {children}
      </main>
    </div>
  );
};

export default DashboardLayout;
