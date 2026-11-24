"use client"

import { ReactNode, useEffect, useState, type MouseEvent } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { useSidebar } from '@/contexts/SidebarContext';
import { useAuthPopup } from '@/hooks/useAuthPopup';
import { useTheme } from 'next-themes';
import {
  LayoutDashboard,
  BookOpen,
  GraduationCap,
  User,
  Clock,
  Brain,
  Sparkles,
  Star,
  Zap,
  Camera,
  Presentation,
  LifeBuoy,
  Moon,
  Sun,
} from 'lucide-react';
import { globalNav, isNavActive } from '@/components/nav-config';

interface CollapsibleSidebarProps {
  children: ReactNode;
}

type NavItem = {
  name: string
  href: string
  icon: ReactNode
  requiresAuth?: boolean
}

export default function CollapsibleSidebar({ children }: CollapsibleSidebarProps) {
  const pathname = usePathname();
  const { user, isAuthenticated } = useAuth();
  const { isCollapsed } = useSidebar();
  const [isNarrow, setIsNarrow] = useState(false);

  useEffect(() => {
    const media = window.matchMedia('(max-width: 1279px)');
    const apply = () => setIsNarrow(media.matches);
    apply();
    media.addEventListener('change', apply);
    return () => media.removeEventListener('change', apply);
  }, []);

  const { openPopup } = useAuthPopup();
  const { theme, setTheme } = useTheme();

  const profileHref = user?.role === 'TUTOR' ? '/tutor/profile' : '/student/profile';
  const dashboardHref = user?.role === 'TUTOR' ? '/tutor/dashboard' : '/student/dashboard';

  const learnItems: NavItem[] = [
    ...(isAuthenticated
      ? [{ name: 'Dashboard', href: dashboardHref, icon: <LayoutDashboard className="h-5 w-5" /> }]
      : []),
    { name: 'My Learning', href: '/ncert', icon: <BookOpen className="h-5 w-5" /> },
    ...(user?.isAdmin
      ? [{ name: 'OpenAI key', href: '/admin/openai', icon: <Zap className="h-5 w-5" /> }]
      : []),
    { name: 'JEE', href: '/jee', icon: <GraduationCap className="h-5 w-5" /> },
  ];

  const toolItems: NavItem[] = [
    { name: 'AI Tutor', href: '/ai-teaching', icon: <Brain className="h-5 w-5" /> },
    { name: 'Magic Explain', href: '/magic-explain', icon: <Sparkles className="h-5 w-5" />, requiresAuth: true },
    { name: 'Micro Quiz', href: '/micro-quiz', icon: <Star className="h-5 w-5" />, requiresAuth: true },
    { name: 'Doubt Battle', href: '/doubt-battle', icon: <Zap className="h-5 w-5" />, requiresAuth: true },
    { name: 'Snap & Solve', href: '/snap-solve', icon: <Camera className="h-5 w-5" />, requiresAuth: true },
    { name: 'Whiteboard', href: '/whiteboard', icon: <Presentation className="h-5 w-5" />, requiresAuth: true },
  ];

  const accountItems: NavItem[] = [
    { name: 'Profile', href: profileHref, icon: <User className="h-5 w-5" />, requiresAuth: true },
    ...(user?.role === 'TUTOR'
      ? [{ name: 'Availability', href: '/tutor/availability', icon: <Clock className="h-5 w-5" /> }]
      : []),
  ];

  const groups = [
    { label: 'Learn', items: learnItems },
    { label: 'AI Tools', items: toolItems },
    { label: 'Account', items: accountItems },
  ];

  const guard = (event: MouseEvent, requiresAuth?: boolean) => {
    if (requiresAuth && !isAuthenticated) {
      event.preventDefault();
      openPopup('login');
    }
  };

  const itemClass = (href: string) => {
    const active = pathname === href || pathname?.startsWith(`${href}/`);
    return `flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
      active
        ? 'bg-primary/10 text-primary'
        : 'text-muted-foreground hover:bg-muted hover:text-foreground'
    }`;
  };

  const railHidden = isCollapsed && isNarrow;

  if (!isAuthenticated) {
    return (
      <div className="flex h-screen overflow-hidden pt-16">
        <div className="app-scroll min-h-0 min-w-0 flex-1 overflow-y-auto">
          <div className={pathname === '/' ? '' : 'p-4 md:p-5'}>{children}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen overflow-hidden pt-16">
      <aside
        className={`flex h-full shrink-0 flex-col border-border bg-card transition-all duration-300 ease-in-out ${
          railHidden
            ? 'w-0 overflow-hidden border-0'
            : isCollapsed
              ? 'w-16 border-r'
              : 'w-60 border-r'
        }`}
      >
        <nav className="flex-1 space-y-5 overflow-y-auto p-3">
          {!isCollapsed && (
            <div className="space-y-1 lg:hidden">
              <p className="px-3 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                Go
              </p>
              {globalNav(user?.role).map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={(event) => {
                    guard(event, item.requiresAuth);
                  }}
                  className={isNavActive(pathname, item)
                    ? 'flex items-center gap-3 rounded-xl bg-primary/10 px-3 py-2.5 text-sm font-medium text-primary'
                    : 'flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground'}
                >
                  <span>{item.name}</span>
                </Link>
              ))}
            </div>
          )}

          {groups.map((group) => (
            <div key={group.label} className="space-y-1">
              {!isCollapsed && (
                <p className="px-3 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                  {group.label}
                </p>
              )}
              {group.items.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={(event) => {
                    guard(event, item.requiresAuth);
                  }}
                  className={itemClass(item.href)}
                  title={isCollapsed ? item.name : undefined}
                >
                  {item.icon}
                  {!isCollapsed && <span>{item.name}</span>}
                </Link>
              ))}
            </div>
          ))}
        </nav>

        <div className="space-y-1 border-t border-border p-3">
          <Link
            href="/contact"
            className={itemClass('/contact')}
            title={isCollapsed ? 'Help & Support' : undefined}
          >
            <LifeBuoy className="h-5 w-5" />
            {!isCollapsed && <span>Help & Support</span>}
          </Link>
          <button
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground"
            title={isCollapsed ? 'Toggle theme' : undefined}
          >
            {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            {!isCollapsed && <span>{theme === 'dark' ? 'Light mode' : 'Dark mode'}</span>}
          </button>
        </div>
      </aside>

      <div className="app-scroll min-h-0 min-w-0 flex-1 overflow-y-auto">
        <div className={pathname === '/' ? '' : 'p-4 md:p-5'}>
          {children}
        </div>
      </div>
    </div>
  );
}
