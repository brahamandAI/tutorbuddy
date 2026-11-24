"use client"

import { ReactNode } from 'react';
import CollapsibleSidebar from './collapsible-sidebar';

interface ConditionalSidebarWrapperProps {
  children: ReactNode;
}

export default function ConditionalSidebarWrapper({ children }: ConditionalSidebarWrapperProps) {
  return (
    <CollapsibleSidebar>
      {children}
    </CollapsibleSidebar>
  );
}
