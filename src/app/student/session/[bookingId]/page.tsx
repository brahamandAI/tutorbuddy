"use client"
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { LearningToolsProvider } from '@/components/learning-tools';
import { ToolsLauncher } from '@/components/learning-tools';
import { Button } from '@/components/ui/Button';

interface Booking {
  id: string;
  startTime: string;
  endTime: string;
  status: string;
  tutor: {
    user: {
      name: string;
    };
  };
}

export default function SessionPage({ params }: { params: { bookingId: string } }) {
  const { user } = useAuth();
  const [booking, setBooking] = useState<Booking | null>(null);
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBooking = async () => {
      try {
        const response = await fetch(`/api/bookings/${params.bookingId}`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch booking details');
        }

        const data = await response.json();
        setBooking(data);
      } catch (error) {
        setError('Failed to load session details');
      } finally {
        setLoading(false);
      }
    };

    fetchBooking();
  }, [params.bookingId]);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          {/* Header skeleton */}
          <div className="h-8 bg-muted rounded w-1/3 mb-8"></div>
          
          {/* Session info skeleton */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 space-y-4">
            <div className="h-6 bg-muted rounded w-1/3"></div>
            <div className="h-4 bg-muted rounded w-1/2"></div>
          </div>
          
          {/* Video area skeleton */}
          <div className="h-[calc(100vh-4rem)] bg-muted rounded-lg"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-md mx-auto mt-8 p-4 bg-red-50 border border-red-200 rounded-lg">
        <p className="text-red-600">{error}</p>
      </div>
    );
  }

  if (!booking) {
    return <div>Session not found</div>;
  }

  // Check if the session is ready to start
  const now = new Date();
  const startTime = new Date(booking.startTime);
  const endTime = new Date(booking.endTime);
  const isSessionTime = now >= startTime && now <= endTime;

  if (!isSessionTime) {
    return (
      <div className="max-w-2xl mx-auto py-8 px-4">
        <h1 className="text-2xl font-bold text-gray-900 mb-8">
          Session with {booking.tutor.user.name}
        </h1>

        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
          <h2 className="text-lg font-semibold text-yellow-900 mb-4">
            Session Not Started
          </h2>
          <p className="text-yellow-800">
            {now < startTime
              ? `This session will start at ${startTime.toLocaleTimeString()}`
              : 'This session has ended'}
          </p>
        </div>
      </div>
    );
  }

  return (
    <LearningToolsProvider questionRef={booking.id} initialText="">
      <div className="h-[calc(100vh-4rem)]">
        <iframe
          src={`https://meet.jit.si/tutorbuddy-${params.bookingId}#userInfo.displayName=${encodeURIComponent(user?.name || '')}&userInfo.email=${encodeURIComponent(user?.email || '')}`}
          style={{ width: '100%', height: '100%', border: 0 }}
          allow="camera; microphone; fullscreen; display-capture"
          title="Jitsi Meeting"
        />
        <ToolsLauncher />
      </div>
    </LearningToolsProvider>
  );
} 