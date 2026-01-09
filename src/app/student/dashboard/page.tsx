"use client"

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/Button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Calendar, Clock, BookOpen, TrendingUp, Star, Video, MessageSquare } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import { formatDate } from '@/lib/utils'
import { FullPageSpinner } from '@/components/ui/spinner'

interface Booking {
  id: string
  tutorName: string
  tutorId: string
  subject: string
  date: string
  time: string
  duration: number
  status: 'upcoming' | 'completed' | 'cancelled' | 'pending' | 'confirmed'
  tutorAvatar: string
  conversationId?: string
}

interface Progress {
  subject: string
  improvement: number
  sessionsCompleted: number
  totalSessions: number
}

export default function StudentDashboard() {
  const { user, isAuthenticated } = useAuth();
  const router = useRouter();
  const [bookings, setBookings] = useState<Booking[]>([])
  const [progress, setProgress] = useState<Progress[]>([])
  const [loading, setLoading] = useState(true)

  // Redirect if not authenticated or not a student
  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/');
      return;
    }
    
    if (user && user.role !== 'STUDENT') {
      router.push('/');
      return;
    }
  }, [isAuthenticated, user, router]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Get JWT token from localStorage or cookies
        const token = localStorage.getItem('token') || document.cookie.split('token=')[1]?.split(';')[0];
        
        if (!token) {
          console.error('No authentication token found');
          setLoading(false);
          return;
        }

        // Fetch bookings
        const bookingsResponse = await fetch('/api/student/bookings', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (bookingsResponse.ok) {
          const bookingsData = await bookingsResponse.json();
          setBookings(bookingsData);
        } else {
          console.error('Failed to fetch bookings');
        }

        // Fetch progress
        const progressResponse = await fetch('/api/student/progress', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (progressResponse.ok) {
          const progressData = await progressResponse.json();
          setProgress(progressData);
        } else {
          console.error('Failed to fetch progress');
        }

        setLoading(false);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'upcoming': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
      case 'completed': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
      case 'cancelled': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
    }
  }

  const upcomingBookings = bookings.filter(booking => booking.status === 'upcoming' || booking.status === 'confirmed')
  const completedBookings = bookings.filter(booking => booking.status === 'completed')
  const pendingBookings = bookings.filter(booking => booking.status === 'pending')

  const handleMessageTutor = (tutorId: string) => {
    // Navigate to messages page and start/focus on this tutor's conversation
    router.push(`/student/messages?tutorId=${tutorId}`);
  }

  const handleJoinSession = (bookingId: string) => {
    // Navigate to session page
    router.push(`/student/session/${bookingId}`);
  }

  const handleViewBooking = (bookingId: string) => {
    // Navigate to booking details page
    router.push(`/student/bookings`);
  }

  // Show loading while checking authentication - moved after all hooks
  if (!isAuthenticated || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return <FullPageSpinner text="Loading dashboard..." />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">Student Dashboard</h1>
        <p className="text-muted-foreground">Welcome back! Here's your learning progress.</p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-6 mb-8 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Sessions</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{bookings.length}</div>
            <p className="text-xs text-muted-foreground">
              +2 from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Upcoming Sessions</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{upcomingBookings.length}</div>
            <p className="text-xs text-muted-foreground">
              {upcomingBookings.length > 0 ? 'Next session soon' : 'No upcoming sessions'}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Bookings</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingBookings.length}</div>
            <p className="text-xs text-muted-foreground">
              {pendingBookings.length > 0 ? 'Waiting for confirmation' : 'All confirmed'}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Improvement</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">23%</div>
            <p className="text-xs text-muted-foreground">
              +5% from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Subjects</CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{progress.length}</div>
            <p className="text-xs text-muted-foreground">
              Currently studying
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        {/* Upcoming Sessions */}
        <Card>
          <CardHeader>
            <CardTitle>Upcoming Sessions</CardTitle>
            <CardDescription>Your scheduled tutoring sessions</CardDescription>
          </CardHeader>
          <CardContent>
            {upcomingBookings.length > 0 ? (
              <div className="space-y-4">
                {upcomingBookings.map(booking => (
                  <div key={booking.id} className="flex items-center space-x-4 p-4 border rounded-lg">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={booking.tutorAvatar} alt={booking.tutorName} />
                      <AvatarFallback>{booking.tutorName.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <h4 className="font-semibold">{booking.tutorName}</h4>
                        <Badge className={getStatusColor(booking.status)}>
                          {booking.status === 'confirmed' ? 'Confirmed' : booking.status}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">{booking.subject}</p>
                      <div className="flex items-center space-x-2 text-xs text-muted-foreground mt-1">
                        <Calendar className="h-3 w-3" />
                        <span>{formatDate(booking.date)}</span>
                        <Clock className="h-3 w-3" />
                        <span>{booking.time} ({booking.duration} min)</span>
                      </div>
                    </div>
                    <div className="flex flex-col space-y-2">
                      {booking.status === 'confirmed' && (
                        <Button 
                          size="sm" 
                          onClick={() => handleJoinSession(booking.id)}
                          className="bg-green-600 hover:bg-green-700"
                        >
                          <Video className="h-4 w-4 mr-2" />
                          Join Session
                        </Button>
                      )}
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => handleMessageTutor(booking.tutorId)}
                      >
                        <MessageSquare className="h-4 w-4 mr-2" />
                        Message
                      </Button>
                      <Button 
                        size="sm" 
                        variant="ghost"
                        onClick={() => handleViewBooking(booking.id)}
                      >
                        View Details
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-muted-foreground">No upcoming sessions</p>
                <Button 
                  className="mt-4"
                  onClick={() => router.push('/student/tutors')}
                >
                  Book a Session
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Pending Bookings */}
        {pendingBookings.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Pending Bookings</CardTitle>
              <CardDescription>Waiting for tutor confirmation</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {pendingBookings.map(booking => (
                  <div key={booking.id} className="flex items-center space-x-4 p-4 border rounded-lg">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={booking.tutorAvatar} alt={booking.tutorName} />
                      <AvatarFallback>{booking.tutorName.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <h4 className="font-semibold">{booking.tutorName}</h4>
                        <Badge className="bg-yellow-100 text-yellow-800">
                          Pending
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">{booking.subject}</p>
                      <div className="flex items-center space-x-2 text-xs text-muted-foreground mt-1">
                        <Calendar className="h-3 w-3" />
                        <span>{formatDate(booking.date)}</span>
                        <Clock className="h-3 w-3" />
                        <span>{booking.time} ({booking.duration} min)</span>
                      </div>
                    </div>
                    <div className="flex flex-col space-y-2">
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => handleMessageTutor(booking.tutorId)}
                      >
                        <MessageSquare className="h-4 w-4 mr-2" />
                        Message
                      </Button>
                      <Button 
                        size="sm" 
                        variant="ghost"
                        onClick={() => handleViewBooking(booking.id)}
                      >
                        View Details
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Learning Progress */}
        <Card>
          <CardHeader>
            <CardTitle>Learning Progress</CardTitle>
            <CardDescription>Your improvement across subjects</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {progress.map((subject, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="font-medium">{subject.subject}</span>
                    <span className="text-sm text-muted-foreground">
                      {subject.sessionsCompleted}/{subject.totalSessions} sessions
                    </span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div 
                      className="bg-primary h-2 rounded-full transition-all duration-300"
                      style={{ width: `${(subject.sessionsCompleted / subject.totalSessions) * 100}%` }}
                    ></div>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Progress</span>
                    <span className="font-medium text-green-600">+{subject.improvement}%</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
          <CardDescription>Your latest tutoring sessions and achievements</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {completedBookings.map(booking => (
              <div key={booking.id} className="flex items-center space-x-4 p-4 border rounded-lg">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={booking.tutorAvatar} alt={booking.tutorName} />
                  <AvatarFallback>{booking.tutorName.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <h4 className="font-semibold">Session with {booking.tutorName}</h4>
                  <p className="text-sm text-muted-foreground">{booking.subject} • {formatDate(booking.date)}</p>
                </div>
                <Badge className={getStatusColor(booking.status)}>
                  {booking.status}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 