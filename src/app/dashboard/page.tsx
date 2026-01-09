"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/Button';
import { User, GraduationCap, BookOpen, Target } from 'lucide-react';

export default function Dashboard() {
  const { user, isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/');
      return;
    }

    // Redirect to role-specific dashboard
    if (user?.role === 'STUDENT') {
      router.push('/student/dashboard');
    } else if (user?.role === 'TUTOR') {
      router.push('/tutor/dashboard');
    }
  }, [user, isAuthenticated, router]);

  if (!isAuthenticated) {
    return null; // Will redirect to home
  }

  if (user?.role === 'STUDENT' || user?.role === 'TUTOR') {
    return null; // Will redirect to role-specific dashboard
  }

  // Fallback dashboard for users without specific role
  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Welcome to TutorBuddy</h1>
          <p className="text-muted-foreground">Your learning journey starts here</p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-center space-x-2">
                <User className="h-5 w-5 text-primary" />
                <CardTitle>Profile</CardTitle>
              </div>
              <CardDescription>Manage your account settings</CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="outline" className="w-full">
                View Profile
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-center space-x-2">
                <BookOpen className="h-5 w-5 text-primary" />
                <CardTitle>Courses</CardTitle>
              </div>
              <CardDescription>Explore available courses</CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="outline" className="w-full" onClick={() => router.push('/courses')}>
                Browse Courses
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-center space-x-2">
                <Target className="h-5 w-5 text-primary" />
                <CardTitle>Learning Tools</CardTitle>
              </div>
              <CardDescription>Access AI-powered learning tools</CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="outline" className="w-full" onClick={() => router.push('/learning-tools')}>
                Open Tools
              </Button>
            </CardContent>
          </Card>
        </div>

        <div className="mt-8 p-6 bg-muted rounded-lg">
          <h2 className="text-xl font-semibold mb-4">Complete Your Profile</h2>
          <p className="text-muted-foreground mb-4">
            To get the most out of TutorBuddy, please complete your profile and choose your role.
          </p>
          <div className="flex space-x-4">
            <Button onClick={() => window.location.reload()}>
              <GraduationCap className="mr-2 h-4 w-4" />
              Refresh Page
            </Button>
            <Button variant="outline" onClick={() => router.push('/')}>
              <User className="mr-2 h-4 w-4" />
              Go to Home
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
} 