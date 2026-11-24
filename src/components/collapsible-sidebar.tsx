"use client"

import { ReactNode, useEffect, useState, type MouseEvent } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { useSidebar } from '@/contexts/SidebarContext';
import { useAuthPopup } from '@/hooks/useAuthPopup';
import {
  LayoutDashboard,
  BookOpen,
  Library,
  BarChart3,
  Users,
  CalendarDays,
  MessageSquare,
  Trophy,
  Zap,
  Home,
} from 'lucide-react';

interface CollapsibleSidebarProps {
  children: ReactNode;
}

type NavItem = {
  name: string
  href: string
  icon: ReactNode
  requiresAuth?: boolean
  iconClass?: string
  badge?: string
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
  const dashboardHref = user?.role === 'TUTOR' ? '/tutor/dashboard' : '/student/dashboard';

  const homeItems: NavItem[] = [
    { name: 'Home', href: '/', icon: <Home className="h-5 w-5" />, iconClass: 'bg-primary/10 text-primary' },
    { name: 'Dashboard', href: dashboardHref, icon: <LayoutDashboard className="h-5 w-5" />, iconClass: 'bg-primary/12 text-primary' },
    { name: 'Learning Progress', href: '/student/dashboard?section=progress', icon: <BarChart3 className="h-5 w-5" />, iconClass: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300' },
  ];

  const learningItems: NavItem[] = [
    { name: 'My Learning', href: '/student/learning', icon: <BookOpen className="h-5 w-5" />, iconClass: 'bg-sky-100 text-sky-700 dark:bg-sky-500/15 dark:text-sky-300' },
    { name: 'My Courses', href: '/student/courses', icon: <Library className="h-5 w-5" />, iconClass: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-500/15 dark:text-indigo-300' },
    { name: 'JEE / Advanced', href: '/jee', icon: <Trophy className="h-5 w-5" />, iconClass: 'bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-300' },
  ];

  const exploreItems: NavItem[] = [
    { name: 'Available Courses', href: '/courses', icon: <Library className="h-5 w-5" />, iconClass: 'bg-violet-100 text-violet-700 dark:bg-violet-500/15 dark:text-violet-300' },
    { name: 'Learning Library', href: '/ncert', icon: <BookOpen className="h-5 w-5" />, iconClass: 'bg-cyan-100 text-cyan-700 dark:bg-cyan-500/15 dark:text-cyan-300' },
    { name: 'Available Tutors', href: user?.role === 'TUTOR' ? '/tutors' : '/student/tutors', icon: <Users className="h-5 w-5" />, iconClass: 'bg-pink-100 text-pink-700 dark:bg-pink-500/15 dark:text-pink-300' },
  ];

  const connectItems: NavItem[] = [
    { name: 'Messages', href: user?.role === 'TUTOR' ? '/tutor/messages' : '/student/messages', icon: <MessageSquare className="h-5 w-5" />, iconClass: 'bg-blue-100 text-blue-700 dark:bg-blue-500/15 dark:text-blue-300' },
    { name: 'Sessions', href: user?.role === 'TUTOR' ? '/tutor/bookings' : '/student/bookings', icon: <CalendarDays className="h-5 w-5" />, iconClass: 'bg-orange-100 text-orange-700 dark:bg-orange-500/15 dark:text-orange-300' },
  ];

  const groups: { label: string; items: NavItem[] }[] = [
    { label: 'Home', items: homeItems },
    { label: 'Learning', items: learningItems },
    { label: 'Explore', items: exploreItems },
    { label: 'Connect', items: connectItems },
    ...(user?.isAdmin
      ? [{ label: 'Admin', items: [{ name: 'OpenAI key', href: '/admin/openai', icon: <Zap className="h-5 w-5" /> }] }]
      : []),
  ];

  const guard = (event: MouseEvent, requiresAuth?: boolean) => {
    if (requiresAuth && !isAuthenticated) {
      event.preventDefault();
      openPopup('login');
    }
  };

  const itemClass = (href: string) => {
    const active = href === '/'
      ? pathname === '/'
      : pathname === href || pathname?.startsWith(`${href}/`);
    return `group relative flex items-center gap-3 rounded-xl px-2.5 py-2 text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
      active
        ? 'bg-primary/10 text-primary shadow-sm'
        : 'text-muted-foreground hover:bg-muted/80 hover:text-foreground'
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
        className={`flex h-full shrink-0 flex-col overflow-hidden border-border bg-card shadow-[4px_0_24px_-20px_rgba(15,23,42,0.35)] transition-all duration-300 ease-in-out ${
          railHidden
            ? 'w-0 overflow-hidden border-0'
            : isCollapsed
              ? 'w-[72px] border-r'
              : 'w-[268px] border-r'
        }`}
      >
        <nav className={`flex-1 overflow-y-auto ${isCollapsed ? 'space-y-3 px-2 py-4' : 'space-y-5 px-3 py-4'}`}>
          {groups.map((group) => (
            <div key={group.label} className={`${isCollapsed ? 'space-y-2 border-b border-border/70 pb-3 last:border-0' : 'space-y-1'}`}>
              {!isCollapsed && (
                <div className="flex items-center gap-2 px-2 pb-1">
                  <p className="whitespace-nowrap text-[10px] font-bold uppercase tracking-[0.12em] text-muted-foreground">{group.label}</p>
                  <span className="h-px flex-1 bg-border" />
                </div>
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
                  {(item.href === '/' ? pathname === '/' : pathname === item.href || pathname?.startsWith(`${item.href}/`)) && (
                    <span className="absolute -left-3 h-7 w-1 rounded-r-full bg-primary" />
                  )}
                  <span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${item.iconClass ?? 'bg-muted text-muted-foreground'}`}>
                    {item.icon}
                  </span>
                  {!isCollapsed && <span className="min-w-0 flex-1 truncate">{item.name}</span>}
                  {!isCollapsed && item.badge && (
                    <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-semibold text-primary">{item.badge}</span>
                  )}
                </Link>
              ))}
            </div>
          ))}
        </nav>

      </aside>

      <div className="app-scroll min-h-0 min-w-0 flex-1 overflow-y-auto">
        <div className={pathname === '/' ? '' : 'p-4 md:p-5'}>
          {children}
        </div>
      </div>
    </div>
  );
}
