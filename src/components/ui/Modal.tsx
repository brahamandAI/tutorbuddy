import React, { ReactNode, useEffect } from 'react';
import { X } from 'lucide-react';

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  className?: string;
}

export const Modal = ({ open, onClose, title, children, className = "w-full max-w-md mx-2" }: ModalProps) => {
  // Handle ESC key to close modal
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && open) {
        onClose();
      }
    };
    
    if (open) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }
    
    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [open, onClose]);

  // Handle click outside to close
  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  if (!open) return null;
  
  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 dark:bg-black/70 backdrop-blur-sm"
      onClick={handleBackdropClick}
    >
      <div className={`bg-background dark:bg-gray-900 rounded-lg shadow-2xl ${className} relative animate-fade-in max-h-[90vh] flex flex-col`}>
        <div className="flex items-center justify-between p-6 border-b border-border">
          {title && <div className="text-lg font-bold text-foreground">{title}</div>}
          <button
            className={`${title ? 'ml-auto' : 'ml-auto'} text-muted-foreground hover:text-foreground transition-colors p-1 rounded-full hover:bg-muted`}
            onClick={onClose}
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="flex-1 overflow-auto">
          {children}
        </div>
      </div>
    </div>
  );
}; 