
import { NavigateFunction } from 'react-router-dom';

// هذه دالة تفحص إذا كان المستخدم مسجل الدخول قبل توجيهه إلى الصفحات المحظورة
export const checkAuthBeforeNavigate = (
  isAuthenticated: boolean, 
  navigate: NavigateFunction, 
  targetPath: string,
  publicPaths: string[] = ['/login', '/register', '/forgot-password', '/home', '/about', '/contact']
) => {
  // إذا كان المسار عام يمكن الوصول إليه بدون تسجيل دخول
  if (publicPaths.includes(targetPath)) {
    return true;
  }
  
  // إذا كان المستخدم مسجل دخول يمكنه الوصول إلى أي صفحة
  if (isAuthenticated) {
    return true;
  }
  
  // إذا لم يكن مسجل دخول ويحاول الوصول لصفحة محظورة، نوجهه إلى صفحة تسجيل الدخول
  navigate('/login', { replace: true });
  return false;
};

// دالة لحل مشكلة إعادة توجيه المستخدمين إلى الصفحة الرئيسية بعد التنقل
export const fixNavigationIssue = () => {
  // تعطيل إعادة التوجيه التلقائي - نضيف هذه السطور لحل المشكلة
  localStorage.removeItem('has_navigated');
  return true;
};
