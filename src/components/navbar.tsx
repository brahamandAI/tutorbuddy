"use client"

import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui/Button'
import { ThemeToggle } from '@/components/theme-toggle'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { 
  BookOpen, 
  User, 
  GraduationCap, 
  Brain, 
  MapPin, 
  MessageSquare,
  Menu,
  X,
  Home,
  Users,
  Target,
  Settings,
  LogOut,
  Video, // Add Video icon for online teaching
  Sparkles,
  Star,
  Zap,
  Camera,
  Shield,
  Presentation
} from 'lucide-react'
import { useState } from 'react'
import { useAuthPopup } from '@/hooks/useAuthPopup'
import { useAuth } from '@/contexts/AuthContext'
import { usePathname } from 'next/navigation'
import { useSidebar } from '@/contexts/SidebarContext'
import { UserNav } from '@/components/user-nav'

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const { openPopup } = useAuthPopup()
  const { user, isAuthenticated, logout } = useAuth()
  const pathname = usePathname()
  const { toggleSidebar, isCollapsed } = useSidebar()
  
  // Check if user is on authenticated pages (student/tutor dashboard pages)
  const isOnAuthenticatedPage = pathname?.startsWith('/student/') || pathname?.startsWith('/tutor/')

  const mainNavigation = [
    { name: 'Home', href: '/', icon: <Home className="h-4 w-4" /> },
    { name: 'Courses', href: '/courses', icon: <BookOpen className="h-4 w-4" /> },
    { name: 'AI Teaching', href: '/ai-teaching', icon: <Brain className="h-4 w-4" /> }
  ]

  const toolsNavigation = [
    { name: 'All Learning Tools', href: '/learning-tools', icon: <Target className="h-4 w-4" /> },
    { name: 'Magic Explain', href: '/magic-explain', icon: <Sparkles className="h-4 w-4" /> },
    { name: 'Micro Quiz', href: '/micro-quiz', icon: <Star className="h-4 w-4" /> },
    { name: 'Doubt Battle', href: '/doubt-battle', icon: <Zap className="h-4 w-4" /> },
    { name: 'Snap & Solve', href: '/snap-solve', icon: <Camera className="h-4 w-4" /> },
    { name: 'Whiteboard', href: '/whiteboard', icon: <Presentation className="h-4 w-4" /> }
  ]

  const otherNavigation = [
    { name: 'Offline Meet', href: '/offline-meet', icon: <MapPin className="h-4 w-4" /> },
    { name: 'Online Teaching', href: '/study-groups', icon: <Video className="h-4 w-4" /> } // Add Online Teaching link
  ]



  return (
    <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 fixed top-0 left-0 right-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
            {/* Sidebar Toggle Button - Edge of Screen */}
            <button
              onClick={toggleSidebar}
              className="fixed top-4 left-4 z-50 p-3 bg-background/90 backdrop-blur-sm rounded-xl shadow-lg hover:bg-background hover:shadow-xl transition-all duration-200 border border-border"
              title="Toggle sidebar"
            >
              <div className="flex flex-col space-y-1">
                <div className={`w-5 h-0.5 bg-foreground transition-all duration-200 ${!isCollapsed ? 'rotate-45 translate-y-1.5' : ''}`}></div>
                <div className={`w-5 h-0.5 bg-foreground transition-all duration-200 ${!isCollapsed ? 'opacity-0' : ''}`}></div>
                <div className={`w-5 h-0.5 bg-foreground transition-all duration-200 ${!isCollapsed ? '-rotate-45 -translate-y-1.5' : ''}`}></div>
              </div>
            </button>

            {/* Logo - Center */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-3 hover:opacity-80 transition-opacity">
              <Image 
                src="/images/logo.jpeg" 
                alt="TutorBuddy Logo" 
                width={64}
                height={64}
                className="h-16 w-auto rounded-lg"
              />
              <span className="font-bold text-xl bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                TutorBuddy
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-6">
            {/* Main Navigation */}
            <div className="flex items-center space-x-6">
              {mainNavigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="flex items-center space-x-1 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                >
                  {item.icon}
                  <span>{item.name}</span>
                </Link>
              ))}
            </div>

            {/* Tools Dropdown */}
            <div className="relative group">
              <button className="flex items-center space-x-1 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                <Target className="h-4 w-4" />
                <span>Tools</span>
                <svg className="w-4 h-4 ml-1 transition-transform group-hover:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              <div className="absolute top-full left-0 mt-2 w-64 bg-background border rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                <div className="py-2 max-h-96 overflow-y-auto">
                  {toolsNavigation.map((item) => (
                    <Link
                      key={item.name}
                      href={item.href}
                      className="flex items-center space-x-3 px-4 py-3 text-sm text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                    >
                      {item.icon}
                      <span>{item.name}</span>
                    </Link>
                  ))}
                </div>
              </div>
            </div>

            {/* Other Navigation */}
            <div className="flex items-center space-x-6">
              {otherNavigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="flex items-center space-x-1 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                >
                  {item.icon}
                  <span>{item.name}</span>
                </Link>
              ))}
            </div>
          </div>

          {/* Desktop Auth Buttons */}
          <div className="hidden lg:flex items-center space-x-4">
            {!isAuthenticated ? (
            <div className="flex space-x-2">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => openPopup('register')}
                className="hover:bg-primary/10"
              >
                <User className="mr-2 h-4 w-4" />
                Sign Up
              </Button>
              <Button 
                size="sm" 
                onClick={() => openPopup('login')}
                className="bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70"
              >
                <GraduationCap className="mr-2 h-4 w-4" />
                Sign In
              </Button>
            </div>
            ) : (
              <UserNav user={user} />
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 border-t">
              {/* Main Navigation */}
              <div className="space-y-1">
                <h3 className="px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Main
                </h3>
                {mainNavigation.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className="flex items-center space-x-2 px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted rounded-md transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {item.icon}
                    <span>{item.name}</span>
                  </Link>
                ))}
              </div>

              {/* Tools Navigation */}
              <div className="space-y-1 pt-4 border-t">
                <h3 className="px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Learning Tools
                </h3>
                {toolsNavigation.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className="flex items-center space-x-2 px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted rounded-md transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {item.icon}
                    <span>{item.name}</span>
                  </Link>
                ))}
              </div>

              {/* Other Navigation */}
              <div className="space-y-1 pt-4 border-t">
                <h3 className="px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Other
                </h3>
                {otherNavigation.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className="flex items-center space-x-2 px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted rounded-md transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {item.icon}
                    <span>{item.name}</span>
                  </Link>
                ))}
              </div>

              {/* Auth Links */}
              <div className="space-y-1 pt-4 border-t">
                {!isAuthenticated ? (
                  <>
                <h3 className="px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Get Started
                </h3>
                <button
                  onClick={() => {
                    openPopup('register');
                    setIsMenuOpen(false);
                  }}
                  className="flex items-center space-x-2 px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted rounded-md transition-colors w-full text-left"
                >
                  <User className="h-4 w-4" />
                  <span>Sign Up</span>
                </button>
                <button
                  onClick={() => {
                    openPopup('login');
                    setIsMenuOpen(false);
                  }}
                  className="flex items-center space-x-2 px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted rounded-md transition-colors w-full text-left"
                >
                  <GraduationCap className="h-4 w-4" />
                  <span>Sign In</span>
                </button>
                  </>
                ) : (
                  <>
                <h3 className="px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Account
                </h3>
                <div className="flex items-center space-x-2 px-3 py-2">
                  <Avatar className="h-6 w-6">
                    <AvatarFallback>{user?.name?.split(' ').map((n: string) => n[0]).join('').toUpperCase()}</AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col">
                    <span className="text-sm font-medium">{user?.name}</span>
                    <span className="text-xs text-muted-foreground">{user?.email}</span>
                  </div>
                </div>
                <button
                  onClick={() => {
                    // Navigate to profile page based on role
                    const profilePath = user?.role === 'TUTOR' ? '/tutor/profile' : '/student/profile';
                    window.location.href = profilePath;
                    setIsMenuOpen(false);
                  }}
                  className="flex items-center space-x-2 px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted rounded-md transition-colors w-full text-left"
                >
                  <User className="h-4 w-4" />
                  <span>Profile</span>
                </button>
                <button
                  onClick={() => {
                    logout();
                    setIsMenuOpen(false);
                  }}
                  className="flex items-center space-x-2 px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted rounded-md transition-colors w-full text-left"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Log out</span>
                </button>
                  </>
                )}
              </div>

                            {/* Theme Toggle removed - available in sidebar */}
            </div>
          </div>
        )}
      </div>
    </nav>
  )
} 