'use client';

import { createContext, useContext, useEffect } from 'react';
import { useSocket } from '@/contexts/SocketContext';
import { useToast } from '@/components/ui/use-toast';

interface NotificationContextType {
  markAsRead: (notificationId: string) => void;
}

const NotificationContext = createContext<NotificationContextType>({
  markAsRead: () => {},
});

export const useNotifications = () => {
  return useContext(NotificationContext);
};

interface Notification {
  id: string;
  type: 'message' | 'booking' | 'payment' | 'system';
  title: string;
  message: string;
  data?: any;
}

export function NotificationProvider({ children }: { children: React.ReactNode }) {
  const { socket, isConnected } = useSocket();
  const { toast } = useToast();

  useEffect(() => {
    if (!socket || !isConnected) return;

    // Handle new message notifications
    socket.on('new-message', (data: Notification) => {
      toast({
        title: 'New Message',
        description: `${data.message}`,
        duration: 5000,
      });
    });

    // Handle booking notifications
    socket.on('booking-update', (data: Notification) => {
      toast({
        title: 'Booking Update',
        description: data.message,
        duration: 5000,
      });
    });

    // Handle payment notifications
    socket.on('payment-update', (data: Notification) => {
      toast({
        title: 'Payment Update',
        description: data.message,
        duration: 5000,
      });
    });

    // Handle system notifications
    socket.on('system-notification', (data: Notification) => {
      toast({
        title: data.title,
        description: data.message,
        duration: 5000,
      });
    });

    return () => {
      socket.off('new-message');
      socket.off('booking-update');
      socket.off('payment-update');
      socket.off('system-notification');
    };
  }, [socket, isConnected, toast]);

  const markAsRead = async (notificationId: string) => {
    try {
      const response = await fetch('/api/notifications/mark-read', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ notificationId }),
      });

      if (!response.ok) {
        throw new Error('Failed to mark notification as read');
      }
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  return (
    <NotificationContext.Provider value={{ markAsRead }}>
      {children}
    </NotificationContext.Provider>
  );
} 