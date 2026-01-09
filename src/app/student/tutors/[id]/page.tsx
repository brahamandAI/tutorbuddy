"use client"
import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { FullPageSpinner } from '@/components/ui/spinner';

interface TutorProfile {
  id: string;
  user: {
    name: string;
  };
  subjects: string[];
  hourlyRate: number;
  bio: string;
  rating: number;
  reviewCount: number;
  availability: any; // Can be array or object format
  reviews: {
    id: string;
    rating: number;
    comment: string;
    student: {
      user: {
        name: string;
      };
    };
    createdAt: string;
  }[];
}

const DAYS = [
  'Sunday',
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
];

export default function TutorDetailPage() {
  const params = useParams();
  const [tutor, setTutor] = useState<TutorProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [bookingError, setBookingError] = useState('');
  const [bookingSuccess, setBookingSuccess] = useState('');
  const [isBooking, setIsBooking] = useState(false);

  useEffect(() => {
    fetchTutorDetails();
  }, []);

  const fetchTutorDetails = async () => {
    try {
      const response = await fetch(`/api/tutors/${params.id}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (!response.ok) throw new Error('Failed to fetch tutor details');

      const data = await response.json();
      console.log('🔍 Frontend Debug: Received tutor data:', data);
      setTutor(data);
    } catch (error) {
      setError('Failed to load tutor details');
    } finally {
      setLoading(false);
    }
  };

  const getAvailableTimeSlots = (date: Date) => {
    if (!tutor) {
      console.log('🔍 Frontend Debug: No tutor data');
      return [];
    }

    console.log('🔍 Frontend Debug: Tutor availability:', tutor.availability);
    console.log('🔍 Frontend Debug: Selected date:', date);
    console.log('🔍 Frontend Debug: Day of week:', date.getDay());

    const dayOfWeek = date.getDay();
    
    // Handle both array and object formats
    let dayAvailability: any[] = [];
    
    if (Array.isArray(tutor.availability)) {
      console.log('🔍 Frontend Debug: Processing array format');
      // Array format: [{ dayOfWeek: 0, startTime: "09:00", endTime: "17:00" }]
      dayAvailability = tutor.availability.filter(
        slot => slot.dayOfWeek === dayOfWeek
      );
    } else if (typeof tutor.availability === 'object' && tutor.availability !== null) {
      console.log('🔍 Frontend Debug: Processing object format');
      // Object format: { monday: { available: true, slots: [...] }, ... }
      const dayNames = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
      const dayName = dayNames[dayOfWeek];
      console.log('🔍 Frontend Debug: Day name:', dayName);
      const dayData = (tutor.availability as any)[dayName];
      console.log('🔍 Frontend Debug: Day data:', dayData);
      
      if (dayData && dayData.available && dayData.slots) {
        console.log('🔍 Frontend Debug: Processing slots:', dayData.slots);
        dayAvailability = dayData.slots.map((slot: any) => {
          // Handle both string format ('16:00-17:00') and object format
          if (typeof slot === 'string') {
            const [startTime, endTime] = slot.split('-');
            return { startTime, endTime };
          } else {
            return {
              startTime: slot.startTime || slot.start,
              endTime: slot.endTime || slot.end
            };
          }
        });
      }
    }

    console.log('🔍 Frontend Debug: Day availability:', dayAvailability);

    const slots: string[] = [];
    dayAvailability.forEach((availability, index) => {
      console.log(`🔍 Frontend Debug: Processing slot ${index}:`, availability);
      
      // For each availability slot, just return the start time
      // The slots are already defined as 1-hour intervals in the data
      const timeString = availability.startTime;
      console.log(`🔍 Frontend Debug: Adding slot: ${timeString}`);
      slots.push(timeString);
    });

    console.log('🔍 Frontend Debug: Final generated slots:', slots);
    return slots;
  };

  const handleBooking = async () => {
    if (!selectedDate || !selectedTime) return;

    setBookingError('');
    setBookingSuccess('');
    setIsBooking(true);

    try {
      // Validate that the selected time is actually available
      const availableSlots = getAvailableTimeSlots(selectedDate);
      console.log('🔍 Frontend Debug: Validation check:', {
        selectedTime,
        availableSlots,
        includes: availableSlots.includes(selectedTime)
      });
      
      if (!availableSlots.includes(selectedTime)) {
        setBookingError(`Selected time ${selectedTime} is not available. Please select from: ${availableSlots.join(', ')}`);
        setIsBooking(false);
        return;
      }

      const [hours, minutes] = selectedTime.split(':');
      
      // Create the date in local timezone to avoid UTC conversion issues
      const startTime = new Date(selectedDate);
      startTime.setHours(parseInt(hours), parseInt(minutes), 0, 0);

      const endTime = new Date(startTime);
      endTime.setHours(endTime.getHours() + 1);

      // Convert to UTC for API while preserving the local time
      const utcStartTime = new Date(startTime.getTime() - (startTime.getTimezoneOffset() * 60000));
      const utcEndTime = new Date(endTime.getTime() - (endTime.getTimezoneOffset() * 60000));

      console.log('🔍 Frontend Debug: Time conversion:', {
        selectedTime,
        hours,
        minutes,
        localStartTime: startTime.toLocaleString(),
        localEndTime: endTime.toLocaleString(),
        utcStartTime: utcStartTime.toISOString(),
        utcEndTime: utcEndTime.toISOString()
      });

      console.log('🔍 Frontend Debug: Booking request:', {
        tutorId: tutor?.id,
        startTime: startTime.toISOString(),
        endTime: endTime.toISOString(),
        selectedTime,
        availableSlots
      });

      const response = await fetch('/api/bookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({
          tutorId: tutor?.id,
          startTime: utcStartTime.toISOString(),
          endTime: utcEndTime.toISOString(),
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to book session');
      }

      setBookingSuccess('Session booked successfully!');
      setSelectedDate(null);
      setSelectedTime(null);
    } catch (error) {
      setBookingError(error instanceof Error ? error.message : 'Failed to book session. Please try again.');
    } finally {
      setIsBooking(false);
    }
  };

  if (loading) {
    return <FullPageSpinner text="Loading tutor details..." />;
  }

  if (error || !tutor) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg">
        {error || 'Tutor not found'}
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              {tutor.user.name}
            </h1>
            <div className="flex items-center text-gray-600">
              <span className="text-yellow-400 mr-1">★</span>
              <span>{tutor.rating.toFixed(1)}</span>
              <span className="mx-1">•</span>
              <span>{tutor.reviewCount} reviews</span>
            </div>
          </div>
          <div className="text-2xl font-bold text-gray-900">
            ₹{tutor.hourlyRate}/hr
          </div>
        </div>

        <div className="mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-2">
            About Me
          </h2>
          <p className="text-gray-600 whitespace-pre-line">
            {tutor.bio}
          </p>
        </div>

        <div className="mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-2">
            Subjects
          </h2>
          <div className="flex flex-wrap gap-2">
            {tutor.subjects.map(subject => (
              <span
                key={subject}
                className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800"
              >
                {subject}
              </span>
            ))}
          </div>
        </div>

        <div className="mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Book a Session
          </h2>

          {bookingError && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg mb-4">
              {bookingError}
            </div>
          )}

          {bookingSuccess && (
            <div className="bg-green-50 border border-green-200 text-green-600 px-4 py-3 rounded-lg mb-4">
              {bookingSuccess}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Select Date
              </label>
              <input
                type="date"
                min={new Date().toISOString().split('T')[0]}
                value={selectedDate?.toISOString().split('T')[0] || ''}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  const date = new Date(e.target.value);
                  console.log('🔍 Frontend Debug: Date changed to:', date);
                  console.log('🔍 Frontend Debug: Available slots for new date:', getAvailableTimeSlots(date));
                  setSelectedDate(date);
                  setSelectedTime(null);
                }}
                className="block w-full px-3 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
              />
            </div>

            {selectedDate && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Select Time
                </label>
                <select
                  value={selectedTime || ''}
                  onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setSelectedTime(e.target.value)}
                  className="block w-full px-3 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                >
                  <option value="">Select a time</option>
                  {getAvailableTimeSlots(selectedDate).map(time => {
                    // Convert 24-hour format to 12-hour format for display
                    const [hours, minutes] = time.split(':');
                    const hour = parseInt(hours);
                    const ampm = hour >= 12 ? 'PM' : 'AM';
                    const displayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
                    const displayTime = `${displayHour}:${minutes} ${ampm}`;
                    
                    // Calculate end time (1 hour later)
                    const endHour = hour + 1;
                    const endAmpm = endHour >= 12 ? 'PM' : 'AM';
                    const endDisplayHour = endHour === 0 ? 12 : endHour > 12 ? endHour - 12 : endHour;
                    const endDisplayTime = `${endDisplayHour}:${minutes} ${endAmpm}`;
                    
                    return (
                      <option key={time} value={time}>
                        {displayTime} - {endDisplayTime}
                      </option>
                    );
                  })}
                </select>
                {getAvailableTimeSlots(selectedDate).length === 0 && (
                  <p className="text-sm text-red-600 mt-1">
                    No available time slots for this date. Please select a different date.
                  </p>
                )}
              </div>
            )}
          </div>

          <Button
            onClick={handleBooking}
            disabled={isBooking}
            className="w-full mt-4"
          >
            {isBooking ? 'Booking...' : 'Book Session'}
          </Button>
        </div>

        <div>
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Reviews
          </h2>
          <div className="space-y-4">
            {tutor.reviews.map(review => (
              <div key={review.id} className="border-b pb-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center">
                    <span className="font-medium text-gray-900">
                      {review.student.user.name}
                    </span>
                    <span className="mx-2">•</span>
                    <div className="flex items-center">
                      <span className="text-yellow-400 mr-1">★</span>
                      <span className="text-gray-600">{review.rating}</span>
                    </div>
                  </div>
                  <span className="text-sm text-gray-500">
                    {new Date(review.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <p className="text-gray-600">{review.comment}</p>
              </div>
            ))}

            {tutor.reviews.length === 0 && (
              <p className="text-gray-500 text-center py-4">
                No reviews yet
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 