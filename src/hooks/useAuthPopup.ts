import { create } from 'zustand';

type UserRole = 'STUDENT' | 'TUTOR';

interface AuthPopupState {
  isOpen: boolean;
  defaultMode: 'login' | 'register';
  defaultRole?: UserRole;
  openPopup: (mode?: 'login' | 'register', role?: UserRole) => void;
  closePopup: () => void;
}

export const useAuthPopup = create<AuthPopupState>((set: any) => ({
  isOpen: false,
  defaultMode: 'register',
  defaultRole: undefined,
  openPopup: (mode = 'register', role?: UserRole) => set({ isOpen: true, defaultMode: mode, defaultRole: role }),
  closePopup: () => set({ isOpen: false, defaultRole: undefined }),
})); 