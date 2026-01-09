import { useState, useEffect } from 'react';
import { useSocket } from '@/contexts/SocketContext';

interface Notification {
  id: string;
  type: 'success' | 'error' | 'info';
  message: string;
  timestamp: number;
}

export default function Notifications() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const { socket } = useSocket();

  useEffect(() => {
    if (!socket) return;

    // Listen for various notification events
    socket.on('new_message', (data) => {
      addNotification({
        type: 'info',
        message: `New message from ${data.senderName}`,
      });
    });

    socket.on('booking_confirmed', (data) => {
      addNotification({
        type: 'success',
        message: `Booking confirmed with ${data.tutorName}`,
      });
    });

    socket.on('payment_success', (data) => {
      addNotification({
        type: 'success',
        message: 'Payment processed successfully',
      });
    });

    socket.on('payment_failed', (data) => {
      addNotification({
        type: 'error',
        message: 'Payment failed. Please try again.',
      });
    });

    socket.on('session_reminder', (data) => {
      addNotification({
        type: 'info',
        message: `Your session with ${data.otherPartyName} starts in 15 minutes`,
      });
    });

    return () => {
      socket.off('new_message');
      socket.off('booking_confirmed');
      socket.off('payment_success');
      socket.off('payment_failed');
      socket.off('session_reminder');
    };
  }, [socket]);

  const addNotification = ({ type, message }: { type: Notification['type']; message: string }) => {
    const notification: Notification = {
      id: Math.random().toString(36).substr(2, 9),
      type,
      message,
      timestamp: Date.now(),
    };

    setNotifications((prev) => [...prev, notification]);

    // Remove notification after 5 seconds
    setTimeout(() => {
      setNotifications((prev) =>
        prev.filter((n) => n.id !== notification.id)
      );
    }, 5000);
  };

  const getNotificationStyles = (type: Notification['type']) => {
    switch (type) {
      case 'success':
        return 'bg-green-50 border-green-200 text-green-800';
      case 'error':
        return 'bg-red-50 border-red-200 text-red-800';
      default:
        return 'bg-blue-50 border-blue-200 text-blue-800';
    }
  };

  if (notifications.length === 0) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 space-y-2">
      {notifications.map((notification) => (
        <div
          key={notification.id}
          className={`p-4 rounded-lg border shadow-lg max-w-sm animate-slide-in ${getNotificationStyles(
            notification.type
          )}`}
        >
          <p>{notification.message}</p>
        </div>
      ))}
    </div>
  );
} 