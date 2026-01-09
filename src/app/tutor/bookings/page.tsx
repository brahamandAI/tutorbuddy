"use client"

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/Button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Calendar, Clock, Video, MessageSquare, Star, MapPin } from 'lucide-react'
import { formatDate } from '@/lib/utils'

interface Booking {
  id: string
  studentName: string
  subject: string
  date: string
  time: string
  duration: number
  price: number
  status: 'upcoming' | 'completed' | 'cancelled' | 'pending'
  studentAvatar: string
  location: string
  rating?: number
  review?: string
}

export default function TutorBookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedStatus, setSelectedStatus] = useState('all')
  const [updatingBooking, setUpdatingBooking] = useState<string | null>(null)

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        // Get JWT token from localStorage or cookies
        const token = localStorage.getItem('token') || document.cookie.split('token=')[1]?.split(';')[0];
        
        if (!token) {
          console.error('No authentication token found');
          setLoading(false);
          return;
        }

        const response = await fetch('/api/tutor/bookings', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (response.ok) {
          const data = await response.json();
          setBookings(data);
        } else {
          console.error('Failed to fetch bookings');
        }

        setLoading(false);
      } catch (error) {
        console.error('Error fetching bookings:', error);
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);

  const handleBookingAction = async (bookingId: string, status: 'confirmed' | 'cancelled') => {
    try {
      setUpdatingBooking(bookingId);
      
      const token = localStorage.getItem('token') || document.cookie.split('token=')[1]?.split(';')[0];
      
      if (!token) {
        console.error('No authentication token found');
        return;
      }

      const response = await fetch(`/api/bookings/${bookingId}`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status })
      });

      if (response.ok) {
        // Update the booking in the local state
        setBookings(prevBookings => 
          prevBookings.map(booking => 
            booking.id === bookingId 
              ? { ...booking, status: status === 'confirmed' ? 'upcoming' : 'cancelled' }
              : booking
          )
        );
        
        console.log(`✅ Booking ${status} successfully`);
      } else {
        const errorData = await response.json();
        console.error('Failed to update booking:', errorData.error);
        alert(`Failed to ${status} booking: ${errorData.error}`);
      }
    } catch (error) {
      console.error('Error updating booking:', error);
      alert(`Error ${status} booking. Please try again.`);
    } finally {
      setUpdatingBooking(null);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'upcoming': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
      case 'completed': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
      case 'cancelled': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
      case 'pending': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
    }
  }

  const filteredBookings = selectedStatus === 'all' 
    ? bookings 
    : bookings.filter(booking => booking.status === selectedStatus)

  const statusOptions = [
    { value: 'all', label: 'All Bookings' },
    { value: 'upcoming', label: 'Upcoming' },
    { value: 'completed', label: 'Completed' },
    { value: 'pending', label: 'Pending' },
    { value: 'cancelled', label: 'Cancelled' }
  ]

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          {/* Header skeleton */}
          <div className="h-8 bg-muted rounded w-1/4 mb-8"></div>
          <div className="h-4 bg-muted rounded w-1/2 mb-8"></div>
          
          {/* Filters skeleton */}
          <div className="flex gap-2 mb-8">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-8 bg-muted rounded w-20"></div>
            ))}
          </div>
          
          {/* Bookings skeleton */}
          <div className="space-y-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-32 bg-muted rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-4">My Bookings</h1>
        <p className="text-muted-foreground">Manage your tutoring sessions and track your students</p>
      </div>

      {/* Filters */}
      <div className="mb-8">
        <div className="flex flex-wrap gap-2">
          {statusOptions.map(option => (
            <Button
              key={option.value}
              variant={selectedStatus === option.value ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedStatus(option.value)}
            >
              {option.label}
            </Button>
          ))}
        </div>
      </div>

      {/* Bookings List */}
      <div className="space-y-6">
        {filteredBookings.map(booking => (
          <Card key={booking.id}>
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-4">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={booking.studentAvatar} alt={booking.studentName} />
                    <AvatarFallback>{booking.studentName.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <h3 className="font-semibold text-foreground">{booking.studentName}</h3>
                      <Badge className={getStatusColor(booking.status)}>
                        {booking.status}
                      </Badge>
                    </div>
                    <p className="text-muted-foreground mb-2">{booking.subject}</p>
                    <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                      <div className="flex items-center space-x-1">
                        <Calendar className="h-4 w-4" />
                        <span>{formatDate(booking.date)}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Clock className="h-4 w-4" />
                        <span>{booking.time} ({booking.duration} min)</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <MapPin className="h-4 w-4" />
                        <span>{booking.location}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <span>₹{booking.price}</span>
                      </div>
                    </div>
                    {booking.rating && (
                      <div className="flex items-center space-x-1 mt-2">
                        {[...Array(booking.rating)].map((_, i) => (
                          <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        ))}
                        <span className="text-sm text-muted-foreground ml-1">
                          {booking.rating}/5
                        </span>
                      </div>
                    )}
                    {booking.review && (
                      <p className="text-sm text-muted-foreground mt-2 italic">
                        "{booking.review}"
                      </p>
                    )}
                  </div>
                </div>
                <div className="flex flex-col space-y-2">
                  {booking.status === 'upcoming' && (
                    <>
                      <Button size="sm">
                        <Video className="h-4 w-4 mr-2" />
                        Start Session
                      </Button>
                      <Button variant="outline" size="sm">
                        <MessageSquare className="h-4 w-4 mr-2" />
                        Message
                      </Button>
                    </>
                  )}
                  {booking.status === 'pending' && (
                    <>
                      <Button 
                        size="sm"
                        onClick={() => handleBookingAction(booking.id, 'confirmed')}
                        className="bg-green-600 hover:bg-green-700"
                        disabled={updatingBooking === booking.id}
                      >
                        {updatingBooking === booking.id ? 'Accepting...' : 'Accept'}
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleBookingAction(booking.id, 'cancelled')}
                        className="border-red-300 text-red-600 hover:bg-red-50"
                        disabled={updatingBooking === booking.id}
                      >
                        {updatingBooking === booking.id ? 'Declining...' : 'Decline'}
                      </Button>
                    </>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredBookings.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground mb-4">No bookings found</p>
          <Button>View Profile</Button>
        </div>
      )}
    </div>
  )
} 