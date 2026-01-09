"use client"

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Users, Calendar, Star, TrendingUp } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'

export default function TutorDashboard() {
  const { user, isAuthenticated } = useAuth();
  const router = useRouter();
  const [stats, setStats] = useState({
    totalStudents: 0,
    upcomingSessions: 0,
    averageRating: 0,
    monthlyEarnings: 0
  });
  const [loading, setLoading] = useState(true);

  // Redirect if not authenticated or not a tutor
  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/');
      return;
    }
    
    if (user && user.role !== 'TUTOR') {
      router.push('/');
      return;
    }
  }, [isAuthenticated, user, router]);

  // Fetch tutor stats
  useEffect(() => {
    const fetchStats = async () => {
      try {
        // Get JWT token from localStorage or cookies
        const token = localStorage.getItem('token') || document.cookie.split('token=')[1]?.split(';')[0];
        
        if (!token) {
          console.error('No authentication token found');
          setLoading(false);
          return;
        }

        const response = await fetch('/api/tutor/stats', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (response.ok) {
          const data = await response.json();
          setStats(data);
        } else {
          console.error('Failed to fetch tutor stats');
        }

        setLoading(false);
      } catch (error) {
        console.error('Error fetching tutor stats:', error);
        setLoading(false);
      }
    };

    if (isAuthenticated && user?.role === 'TUTOR') {
      fetchStats();
    }
  }, [isAuthenticated, user]);


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

  return (
    <div className="space-y-6">
      {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Tutor Dashboard</h1>
          <p className="text-muted-foreground">Welcome! Here you can manage your classes, students, and profile.</p>
        </div>

      {/* Stats Cards */}
      <div className="grid gap-6 mb-8 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Students</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalStudents}</div>
            <p className="text-xs text-muted-foreground">
              Active students
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Upcoming Sessions</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.upcomingSessions}</div>
            <p className="text-xs text-muted-foreground">
              Scheduled sessions
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Rating</CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.averageRating}</div>
            <p className="text-xs text-muted-foreground">
              Student feedback
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Monthly Earnings</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{stats.monthlyEarnings.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              This month's earnings
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Recent Bookings</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Your recent tutoring sessions and upcoming bookings will appear here.</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Student Messages</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Recent messages from your students will appear here.</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 