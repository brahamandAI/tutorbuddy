"use client"

import { usePathname } from 'next/navigation';
import { ReactNode } from 'react';
import CollapsibleSidebar from './collapsible-sidebar';

interface ConditionalSidebarWrapperProps {
  children: ReactNode;
}

export default function ConditionalSidebarWrapper({ children }: ConditionalSidebarWrapperProps) {
  const pathname = usePathname();
  
  // Don't show sidebar on landing page
  const isLandingPage = pathname === '/';
  
  if (isLandingPage) {
    return <>{children}</>;
  }
  
  // Show sidebar on all other pages
  return (
    <CollapsibleSidebar>
      {children}
    </CollapsibleSidebar>
  );
}