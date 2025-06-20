
import { Toaster } from "@/components/ui/toaster";
import { Toaster as SonnerToaster } from "sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { TransactionProvider } from "./context/TransactionContext";
import { ThemeProvider } from "./context/ThemeContext";
import { PlatformProvider } from "./context/PlatformContext";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";
import Profile from "./pages/Profile";
import Admin from "./pages/Admin";
import AdminSettings from "./pages/AdminSettings";
import NotFound from "./pages/NotFound";
import Landing from "./pages/Landing";
import Home from "./pages/Home";
import TwoFactorVerify from "./pages/TwoFactorVerify";
import About from "./pages/About";
import GameRecharge from "./pages/GameRecharge";
import Contact from "./pages/Contact";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <ThemeProvider>
        <PlatformProvider>
          <AuthProvider>
            <TransactionProvider>
              <Toaster />
              <SonnerToaster />
              <BrowserRouter>
                <Routes>
                  <Route path="/" element={<Index />} />
                  <Route path="/home" element={<Home />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />
                  <Route path="/forgot-password" element={<ForgotPassword />} />
                  <Route path="/verify-2fa" element={<TwoFactorVerify />} />
                  <Route path="/profile" element={<Profile />} />
                  <Route path="/about" element={<About />} />
                  <Route path="/contact" element={<Contact />} />
                  <Route path="/games" element={<GameRecharge />} />
                  <Route path="/admin" element={<Admin />} />
                  <Route path="/admin/settings" element={<AdminSettings />} />
                  {/* Static pages */}
                  <Route path="/terms" element={<NotFound />} />
                  <Route path="/privacy" element={<NotFound />} />
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </BrowserRouter>
            </TransactionProvider>
          </AuthProvider>
        </PlatformProvider>
      </ThemeProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
