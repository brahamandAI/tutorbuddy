"use client";

import { AuthPopup } from './AuthPopup';
import { useAuthPopup } from '@/hooks/useAuthPopup';

export function GlobalAuthPopup() {
  const { isOpen, defaultMode, defaultRole, closePopup } = useAuthPopup();

  return (
    <AuthPopup
      open={isOpen}
      onClose={closePopup}
      defaultMode={defaultMode}
      defaultRole={defaultRole}
    />
  );
} 