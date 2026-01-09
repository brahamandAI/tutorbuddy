'use client';


import { ThemeProvider } from '@/components/theme-provider';
import { Toaster } from '@/components/ui/toaster';
import { AuthProvider } from '@/contexts/AuthContext';
import { SidebarProvider } from '@/contexts/SidebarContext';
import { LearningToolsProvider } from '@/components/learning-tools';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="light"
      enableSystem
      disableTransitionOnChange
    >
      <AuthProvider>
        <SidebarProvider>
          <LearningToolsProvider key="app-learning-tools" questionRef="app-root" initialText="">
            {children}
          </LearningToolsProvider>
        </SidebarProvider>
      </AuthProvider>
      <Toaster />
    </ThemeProvider>
  );
}