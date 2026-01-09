"use client";

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/Button';

const DAYS = [
  'Sunday',
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
];

const TIME_SLOTS = Array.from({ length: 48 }, (_, i) => {
  const hour = Math.floor(i / 2);
  const minute = i % 2 === 0 ? '00' : '30';
  return `${hour.toString().padStart(2, '0')}:${minute}`;
});

interface Availability {
  id: string;
  dayOfWeek: number;
  startTime: string;
  endTime: string;
}

export default function AvailabilityPage() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [availability, setAvailability] = useState<Availability[]>([]);

  useEffect(() => {
    fetchAvailability();
  }, []);

  const fetchAvailability = async () => {
    try {
      const response = await fetch('/api/tutor/availability', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (!response.ok) throw new Error('Failed to fetch availability');

      const data = await response.json();
      setAvailability(data);
    } catch (error) {
      setError('Failed to load availability');
    } finally {
      setLoading(false);
    }
  };

  const addTimeSlot = (dayOfWeek: number) => {
    setAvailability(prev => [
      ...prev,
      {
        id: `temp-${Date.now()}`,
        dayOfWeek,
        startTime: '09:00',
        endTime: '17:00',
      },
    ]);
  };

  const removeTimeSlot = (id: string) => {
    setAvailability(prev => prev.filter(slot => slot.id !== id));
  };

  const updateTimeSlot = (
    id: string,
    field: 'startTime' | 'endTime',
    value: string
  ) => {
    setAvailability(prev =>
      prev.map(slot =>
        slot.id === id
          ? { ...slot, [field]: value }
          : slot
      )
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    setSuccess('');

    try {
      const response = await fetch('/api/tutor/availability', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({ availability }),
      });

      if (!response.ok) throw new Error('Failed to update availability');

      const data = await response.json();
      setAvailability(data);
      setSuccess('Availability updated successfully');
    } catch (err) {
      setError('Failed to update availability');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          {/* Header skeleton */}
          <div className="h-8 bg-muted rounded w-1/3 mb-8"></div>
          
          {/* Days skeleton */}
          <div className="space-y-6">
            {[...Array(7)].map((_, i) => (
              <div key={i} className="border rounded-lg p-4 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="h-6 bg-muted rounded w-1/6"></div>
                  <div className="h-8 bg-muted rounded w-24"></div>
                </div>
                <div className="space-y-4">
                  {[...Array(2)].map((_, j) => (
                    <div key={j} className="flex items-center space-x-4">
                      <div className="h-10 bg-muted rounded w-20"></div>
                      <div className="h-4 bg-muted rounded w-4"></div>
                      <div className="h-10 bg-muted rounded w-20"></div>
                      <div className="h-8 bg-muted rounded w-16"></div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
          
          {/* Submit button skeleton */}
          <div className="h-10 bg-muted rounded w-32"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">
        Availability Settings
      </h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        {success && (
          <div className="bg-green-50 border border-green-200 text-green-600 px-4 py-3 rounded-lg">
            {success}
          </div>
        )}

        <div className="space-y-6">
          {DAYS.map((day, index) => (
            <div key={day} className="border rounded-lg p-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-900">{day}</h3>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => addTimeSlot(index)}
                >
                  Add Time Slot
                </Button>
              </div>

              <div className="space-y-4">
                {availability
                  .filter(slot => slot.dayOfWeek === index)
                  .map(slot => (
                    <div
                      key={slot.id}
                      className="flex items-center space-x-4"
                    >
                      <select
                        value={slot.startTime}
                        onChange={(e) =>
                          updateTimeSlot(slot.id, 'startTime', e.target.value)
                        }
                        className="block w-full px-3 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                      >
                        {TIME_SLOTS.map(time => (
                          <option key={time} value={time}>
                            {time}
                          </option>
                        ))}
                      </select>

                      <span className="text-gray-500">to</span>

                      <select
                        value={slot.endTime}
                        onChange={(e) =>
                          updateTimeSlot(slot.id, 'endTime', e.target.value)
                        }
                        className="block w-full px-3 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                      >
                        {TIME_SLOTS.map(time => (
                          <option key={time} value={time}>
                            {time}
                          </option>
                        ))}
                      </select>

                      <button
                        type="button"
                        onClick={() => removeTimeSlot(slot.id)}
                        className="text-red-600 hover:text-red-800"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
              </div>
            </div>
          ))}
        </div>

        <Button
          type="submit"
          disabled={saving}
          className="w-full md:w-auto"
        >
          {saving ? 'Saving...' : 'Save Changes'}
        </Button>
      </form>
    </div>
  );
} 