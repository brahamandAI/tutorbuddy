"use client"

import { ReactNode, useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { useSidebar } from '@/contexts/SidebarContext';
import { useAuthPopup } from '@/hooks/useAuthPopup';
import { Modal } from '@/components/ui/Modal';
import { useTheme } from 'next-themes';
import { 
  LayoutDashboard, 
  Users, 
  Calendar, 
  MessageSquare,
  BookOpen,
  User,
  Clock,
  Home,
  Brain,
  Target,
  MapPin,
  Video,
  Mail,
  Moon,
  Sun,
  LogOut,
  Sparkles,
  Star,
  Zap,
  Camera,
  Presentation
} from 'lucide-react';

interface CollapsibleSidebarProps {
  children: ReactNode;
}

export default function CollapsibleSidebar({ children }: CollapsibleSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, isAuthenticated, logout } = useAuth();
  const { isCollapsed, setIsCollapsed } = useSidebar();
  const { openPopup } = useAuthPopup();
  const { theme, setTheme } = useTheme();
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  // Ensure sidebar is open by default for authenticated users
  useEffect(() => {
    if (isAuthenticated && user) {
      setIsCollapsed(false); // Open by default for authenticated users
    }
  }, [isAuthenticated, user, setIsCollapsed]);

  // Handle logout confirmation and redirect
  const handleLogout = async () => {
    setShowLogoutConfirm(false);
    await logout();
    router.push('/');
  };

  // Tools navigation items
  const toolsItems = [
    { name: 'All Learning Tools', href: '/learning-tools', icon: <Target className="h-5 w-5" /> },
    { name: 'Magic Explain', href: '/magic-explain', icon: <Sparkles className="h-5 w-5" /> },
    { name: 'Micro Quiz', href: '/micro-quiz', icon: <Star className="h-5 w-5" /> },
    { name: 'Doubt Battle', href: '/doubt-battle', icon: <Zap className="h-5 w-5" /> },
    { name: 'Snap & Solve', href: '/snap-solve', icon: <Camera className="h-5 w-5" /> },
    { name: 'Whiteboard', href: '/whiteboard', icon: <Presentation className="h-5 w-5" /> },
  ];

  // Navigation items based on user role and authentication
  const getNavigationItems = () => {
    if (!isAuthenticated || !user) {
      return [
        { name: 'Home', href: '/', icon: <Home className="h-5 w-5" /> },
        { name: 'AI Tutor Hub', href: '/ncert', icon: <Brain className="h-5 w-5" /> },
        { name: 'Courses', href: '/courses', icon: <BookOpen className="h-5 w-5" /> },
        { name: 'Tutors', href: '/tutors', icon: <Users className="h-5 w-5" /> },
        { name: 'AI Teaching', href: '/ai-teaching', icon: <Brain className="h-5 w-5" /> },
        { name: 'Offline Meet', href: '/offline-meet', icon: <MapPin className="h-5 w-5" /> },
        { name: 'How It Works', href: '/how-it-works', icon: <Video className="h-5 w-5" /> },
        { name: 'Contact', href: '/contact', icon: <Mail className="h-5 w-5" /> },
      ];
    }

    if (user.role === 'STUDENT') {
      return [
        { name: 'Dashboard', href: '/student/dashboard', icon: <LayoutDashboard className="h-5 w-5" /> },
        { name: 'AI Tutor Hub', href: '/ncert', icon: <Brain className="h-5 w-5" /> },
        { name: 'Profile', href: '/student/profile', icon: <User className="h-5 w-5" /> },
        { name: 'Find Tutors', href: '/student/tutors', icon: <Users className="h-5 w-5" /> },
        { name: 'My Bookings', href: '/student/bookings', icon: <Calendar className="h-5 w-5" /> },
        { name: 'Messages', href: '/student/messages', icon: <MessageSquare className="h-5 w-5" /> },
      ];
    }

    if (user.role === 'TUTOR') {
      return [
        { name: 'Dashboard', href: '/tutor/dashboard', icon: <LayoutDashboard className="h-5 w-5" /> },
        { name: 'AI Tutor Hub', href: '/ncert', icon: <Brain className="h-5 w-5" /> },
        { name: 'Profile', href: '/tutor/profile', icon: <User className="h-5 w-5" /> },
        { name: 'Availability', href: '/tutor/availability', icon: <Clock className="h-5 w-5" /> },
        { name: 'Bookings', href: '/tutor/bookings', icon: <Calendar className="h-5 w-5" /> },
        { name: 'Messages', href: '/tutor/messages', icon: <MessageSquare className="h-5 w-5" /> },
      ];
    }

    return [];
  };

  const navigationItems = getNavigationItems();
  const [showTools, setShowTools] = useState(false);

  return (
    <div className="flex min-h-screen bg-background">
      {/* Collapsible Sidebar - Always render but conditionally show */}
      <div className={`flex flex-col bg-card border-r border-border shadow-sm transition-all duration-300 ease-in-out ${
        isCollapsed ? 'w-16' : 'w-64'
      }`}>
        {/* Sidebar Header */}
        <div className="p-4 border-b border-border bg-muted/40">
          <div className="flex items-center justify-between">
            {!isCollapsed && (
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
                  <span className="text-lg font-bold text-primary-foreground">
                    {isAuthenticated && user ? user.name.charAt(0) : 'T'}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-lg font-bold text-foreground truncate">
                    {isAuthenticated && user ? user.name : 'TutorBuddy'}
                  </p>
                  <p className="text-sm text-muted-foreground capitalize">
                    {isAuthenticated && user ? user.role.toLowerCase() : 'Welcome'}
                  </p>
                </div>
              </div>
            )}
            {isCollapsed && (
              <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center mx-auto">
                <span className="text-lg font-bold text-primary-foreground">
                  {isAuthenticated && user ? user.name.charAt(0) : 'T'}
                </span>
              </div>
            )}
            {/* Toggle Button */}
            <button
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="p-2 rounded-md text-muted-foreground hover:bg-muted hover:text-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ring-offset-card"
              title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            >
              <svg 
                className={`w-4 h-4 transition-transform ${isCollapsed ? 'rotate-180' : ''}`} 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="p-3 space-y-1 flex-1 overflow-y-auto">
          {navigationItems.map((item) => {
            // Handle navigation for unauthenticated users
            const handleClick = (e: React.MouseEvent) => {
              if (!isAuthenticated && item.href !== '/') {
                e.preventDefault();
                openPopup();
              }
            };

            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={handleClick}
                className={`flex items-center space-x-3 px-3 py-2.5 rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ring-offset-card ${
                  pathname === item.href
                    ? 'bg-primary/10 text-primary shadow-sm'
                    : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                }`}
                title={isCollapsed ? item.name : undefined}
              >
                {item.icon}
                {!isCollapsed && <span>{item.name}</span>}
              </Link>
            );
          })}

          {/* Tools Section */}
          <div className="pt-4">
            <button
              onClick={() => setShowTools(!showTools)}
              className="w-full flex items-center justify-between px-3 py-2.5 rounded-md text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ring-offset-card"
              title={isCollapsed ? 'Tools' : undefined}
            >
              <div className="flex items-center space-x-3">
                <Target className="h-5 w-5" />
                {!isCollapsed && <span>Tools</span>}
              </div>
              {!isCollapsed && (
                <svg 
                  className={`w-4 h-4 transition-transform ${showTools ? 'rotate-180' : ''}`} 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              )}
            </button>

            {/* Tools Submenu */}
            {(showTools && !isCollapsed) && (
              <div className="ml-4 mt-2 space-y-1">
                {toolsItems.map((tool) => {
                  const handleToolClick = (e: React.MouseEvent) => {
                    if (!isAuthenticated) {
                      e.preventDefault();
                      openPopup();
                    }
                  };

                  return (
                    <Link
                      key={tool.name}
                      href={tool.href}
                      onClick={handleToolClick}
                      className={`flex items-center space-x-3 px-3 py-2 rounded-md text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ring-offset-card ${
                        pathname === tool.href
                          ? 'bg-primary/10 text-primary font-medium'
                          : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                      }`}
                    >
                      {tool.icon}
                      <span>{tool.name}</span>
                    </Link>
                  );
                })}
              </div>
            )}

            {/* Collapsed Tools - Show tools directly when sidebar is collapsed */}
            {isCollapsed && (
              <div className="mt-2 space-y-1">
                {toolsItems.slice(0, 3).map((tool) => {
                  const handleToolClick = (e: React.MouseEvent) => {
                    if (!isAuthenticated) {
                      e.preventDefault();
                      openPopup();
                    }
                  };

                  return (
                    <Link
                      key={tool.name}
                      href={tool.href}
                      onClick={handleToolClick}
                      className={`flex items-center justify-center p-3 rounded-md text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ring-offset-card ${
                        pathname === tool.href
                          ? 'bg-primary/10 text-primary'
                          : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                      }`}
                      title={tool.name}
                    >
                      {tool.icon}
                    </Link>
                  );
                })}
              </div>
            )}
          </div>
        </nav>

        {/* Sidebar Footer */}
        <div className="p-3 border-t border-border bg-muted/20 space-y-1">
          {/* Contact */}
          <Link
            href="/contact"
            className="w-full flex items-center space-x-3 px-3 py-2 text-sm text-muted-foreground hover:bg-muted hover:text-foreground rounded-md transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ring-offset-card"
            title={isCollapsed ? 'Contact' : undefined}
          >
            <Mail className="h-4 w-4" />
            {!isCollapsed && <span>Contact</span>}
          </Link>
          
          {/* Toggle Theme */}
          <button 
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="w-full flex items-center space-x-3 px-3 py-2 text-sm text-muted-foreground hover:bg-muted hover:text-foreground rounded-md transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ring-offset-card"
            title={isCollapsed ? 'Toggle theme' : undefined}
          >
            {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            {!isCollapsed && <span>Toggle theme</span>}
          </button>
          
          {/* Logout - Only show for authenticated users */}
          {isAuthenticated && user && (
            <button
              onClick={() => setShowLogoutConfirm(true)}
              className="w-full flex items-center space-x-3 px-3 py-2 text-sm text-muted-foreground hover:bg-muted hover:text-foreground rounded-md transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ring-offset-card"
              title={isCollapsed ? 'Logout' : undefined}
            >
              <LogOut className="h-4 w-4" />
              {!isCollapsed && <span>Logout</span>}
            </button>
          )}
        </div>
        </div>

      {/* Main Content */}
      <div className="flex-1">
        <main className="p-6 bg-background">
          {children}
        </main>
      </div>

      {/* Logout Confirmation Modal */}
      <Modal
        open={showLogoutConfirm}
        onClose={() => setShowLogoutConfirm(false)}
        title="Confirm Logout"
      >
        <div className="space-y-4">
          <p className="text-muted-foreground">
            Are you sure you want to logout? You will be redirected to the landing page.
          </p>
          <div className="flex space-x-3 justify-end">
            <button
              onClick={() => setShowLogoutConfirm(false)}
              className="px-4 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleLogout}
              className="px-4 py-2 text-sm bg-destructive text-destructive-foreground rounded-lg hover:bg-destructive/90 transition-colors"
            >
              Logout
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
} 