"use client";

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/components/ui/use-toast';
import { 
  X, 
  Mail, 
  Lock, 
  User, 
  Eye, 
  EyeOff, 
  Loader2,
  GraduationCap,
  BookOpen
} from 'lucide-react';

// Google OAuth types
declare global {
  interface Window {
    google: {
      accounts: {
        oauth2: {
          initTokenClient: (config: {
            client_id: string;
            scope: string;
            callback: (response: { access_token?: string; error?: string }) => void;
          }) => {
            requestAccessToken: () => void;
          };
        };
      };
    };
  }
}

interface AuthPopupProps {
  open: boolean;
  onClose: () => void;
  defaultMode?: 'login' | 'register';
  defaultRole?: 'STUDENT' | 'TUTOR';
}

type UserRole = 'STUDENT' | 'TUTOR';

export function AuthPopup({ open, onClose, defaultMode = 'register', defaultRole }: AuthPopupProps) {
  const [mode, setMode] = useState<'login' | 'register'>(defaultMode);
  const [role, setRole] = useState<UserRole>(defaultRole || 'STUDENT');

  // Update mode when defaultMode prop changes
  useEffect(() => {
    setMode(defaultMode);
  }, [defaultMode]);

  // Update role when defaultRole prop changes
  useEffect(() => {
    if (defaultRole) {
      setRole(defaultRole);
    }
  }, [defaultRole]);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  
  // Form states
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });

  const { login, register, loginWithGoogle } = useAuth();
  const { toast } = useToast();

  if (!open) return null;

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleGoogleAuth = async () => {
    setIsGoogleLoading(true);
    try {
      // Initialize Google Identity Services
      if (!window.google) {
        // Load Google Identity Services script
        const script = document.createElement('script');
        script.src = 'https://accounts.google.com/gsi/client';
        script.async = true;
        script.defer = true;
        document.head.appendChild(script);

        await new Promise((resolve) => {
          script.onload = resolve;
        });
      }

      // Initialize Google OAuth client
      const client = window.google.accounts.oauth2.initTokenClient({
        client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!,
        scope: 'email profile',
        callback: async (response: { access_token?: string; error?: string }) => {
          if (response.error) {
            toast({
              variant: "destructive",
              title: "Error",
              description: response.error,
            });
            setIsGoogleLoading(false);
            return;
          }

          try {
            console.log('AuthPopup: Starting Google authentication with role:', role);
            
            // Use AuthContext to handle Google authentication
            await loginWithGoogle(response.access_token!, role);
            
            // Authentication successful
            
            toast({
              title: "Success",
              description: "Successfully signed in with Google!",
            });

            onClose();

          } catch (error) {
            console.error('Google auth error:', error);
            toast({
              variant: "destructive",
              title: "Error",
              description: error instanceof Error ? error.message : "Authentication failed. Please try again.",
            });
          } finally {
            setIsGoogleLoading(false);
          }
        },
      });

      // Request access token
      client.requestAccessToken();

    } catch (error) {
      console.error('Google OAuth error:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Google authentication failed. Please try again.",
      });
      setIsGoogleLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (mode === 'register') {
        await register(formData.name, formData.email, formData.password, role);
        toast({
          title: "Success",
          description: "Account created successfully!",
        });
      } else {
        await login(formData.email, formData.password);
        toast({
          title: "Success",
          description: "Logged in successfully!",
        });
      }
      onClose();
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error instanceof Error ? error.message : "Authentication failed. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const toggleMode = () => {
    setMode(mode === 'login' ? 'register' : 'login');
    setFormData({ name: '', email: '', password: '' });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-background rounded-lg shadow-xl w-full max-w-md mx-4 p-0 relative animate-in fade-in-0 zoom-in-95 duration-200">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-muted-foreground hover:text-foreground transition-colors z-10"
        >
          <X size={20} />
        </button>

        <Card className="border-0 shadow-none">
          <CardHeader className="pb-4">
            <CardTitle className="text-2xl font-bold text-center">
              {mode === 'login' ? 'Welcome Back' : 'Create Account'}
            </CardTitle>
            <CardDescription className="text-center">
              {mode === 'login' 
                ? 'Sign in to your account to continue' 
                : 'Join our platform to start learning or teaching'
              }
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Google OAuth Button */}
            <Button
              variant="outline"
              onClick={handleGoogleAuth}
              disabled={isGoogleLoading}
              className="w-full border-gray-300 hover:bg-gray-50 hover:border-gray-400 transition-colors"
            >
              {isGoogleLoading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
              )}
              Continue with Google
            </Button>

            {/* Divider */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">
                  Or continue with
                </span>
              </div>
            </div>

            {/* Role Toggle - Only show for register mode */}
            {mode === 'register' && (
              <div className="space-y-3">
                <label className="text-sm font-medium">I am a:</label>
                <div className="flex gap-2">
                  <Button
                    type="button"
                    variant={role === 'STUDENT' ? 'default' : 'outline'}
                    onClick={() => setRole('STUDENT')}
                    className="flex-1"
                  >
                    <GraduationCap className="mr-2 h-4 w-4" />
                    Student
                  </Button>
                  <Button
                    type="button"
                    variant={role === 'TUTOR' ? 'default' : 'outline'}
                    onClick={() => setRole('TUTOR')}
                    className="flex-1"
                  >
                    <BookOpen className="mr-2 h-4 w-4" />
                    Tutor
                  </Button>
                </div>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {mode === 'register' && (
                <div className="space-y-2">
                  <label htmlFor="name" className="text-sm font-medium">
                    Full Name
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="name"
                      type="text"
                      placeholder="Enter your full name"
                      value={formData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      className="pl-10"
                      required={mode === 'register'}
                    />
                  </div>
                </div>
              )}

              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium">
                  Email
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="password" className="text-sm font-medium">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Enter your password"
                    value={formData.password}
                    onChange={(e) => handleInputChange('password', e.target.value)}
                    className="pl-10 pr-10"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3 text-muted-foreground hover:text-foreground"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full"
              >
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {mode === 'login' ? 'Sign In' : 'Create Account'}
              </Button>
            </form>

            {/* Mode Toggle */}
            <div className="text-center text-sm">
              {mode === 'login' ? (
                <span>
                  Don't have an account?{' '}
                  <button
                    onClick={toggleMode}
                    className="text-primary hover:underline font-medium"
                  >
                    Sign up
                  </button>
                </span>
              ) : (
                <span>
                  Already have an account?{' '}
                  <button
                    onClick={toggleMode}
                    className="text-primary hover:underline font-medium"
                  >
                    Sign in
                  </button>
                </span>
              )}
            </div>

            {/* Forgot Password - Only show for login mode */}
            {mode === 'login' && (
              <div className="text-center">
                <button className="text-sm text-muted-foreground hover:text-primary hover:underline">
                  Forgot your password?
                </button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 