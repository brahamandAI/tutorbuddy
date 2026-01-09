"use client"

import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { Button } from '@/components/ui/Button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { User, Mail, GraduationCap, BookOpen, Calendar, Clock, Star } from 'lucide-react'
import { FullPageSpinner } from '@/components/ui/spinner'
import { useRouter } from 'next/navigation'

interface StudentProfile {
  id: string
  userId: string
  grade: string
  subjects: string[]
  createdAt: string
  updatedAt: string
}

interface Booking {
  id: string
  tutorName: string
  subject: string
  date: string
  time: string
  status: string
  rating?: number
}

export default function StudentProfilePage() {
  const { user, isAuthenticated } = useAuth()
  const router = useRouter()
  const [profile, setProfile] = useState<StudentProfile | null>(null)
  const [bookings, setBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [saveError, setSaveError] = useState('')
  const [saveSuccess, setSaveSuccess] = useState('')
  const [formData, setFormData] = useState({
    grade: '',
    subjects: [] as string[],
  })

  const availableSubjects = [
    'Mathematics', 'Physics', 'Chemistry', 'Biology', 
    'English', 'History', 'Geography', 'Computer Science',
    'Economics', 'Psychology', 'Literature', 'Art'
  ]



  useEffect(() => {
    if (!isAuthenticated || !user) {
      router.push('/')
      return
    }

    if (user.role !== 'STUDENT') {
      router.push('/')
      return
    }

    fetchProfile()
    fetchBookings()
  }, [isAuthenticated, user, router])

  const fetchProfile = async () => {
    try {
      const token = localStorage.getItem('token')
      const response = await fetch('/api/student/profile', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      })

      if (response.ok) {
        const data = await response.json()
        setProfile(data)
        setFormData({
          grade: data.grade || '',
          subjects: data.subjects || [],
        })
      }
    } catch (error) {
      console.error('Error fetching profile:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchBookings = async () => {
    try {
      const token = localStorage.getItem('token')
      const response = await fetch('/api/student/bookings', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      })

      if (response.ok) {
        const data = await response.json()
        setBookings(data.slice(0, 5)) // Show last 5 bookings
      }
    } catch (error) {
      console.error('Error fetching bookings:', error)
    }
  }

  const handleSave = async () => {
    setSaving(true)
    setSaveError('')
    setSaveSuccess('')
    
    try {
      const token = localStorage.getItem('token')
      const response = await fetch('/api/student/profile', {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        const updatedProfile = await response.json()
        setProfile(updatedProfile)
        setIsEditing(false)
        setSaveSuccess('Profile updated successfully!')
      } else {
        const errorData = await response.json()
        setSaveError(errorData.error || 'Failed to update profile')
      }
    } catch (error) {
      console.error('Error updating profile:', error)
      setSaveError('Failed to update profile. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  const handleSubjectToggle = (subject: string) => {
    setFormData(prev => ({
      ...prev,
      subjects: prev.subjects.includes(subject)
        ? prev.subjects.filter(s => s !== subject)
        : [...prev.subjects, subject]
    }))
  }

  if (loading) {
    return <FullPageSpinner text="Loading profile..." />
  }

  if (!user || user.role !== 'STUDENT') {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg">
          Access denied. Student profile only.
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Student Profile</h1>
          <p className="text-muted-foreground">Manage your learning preferences and view your progress</p>
        </div>
        <Button
          onClick={() => setIsEditing(!isEditing)}
          variant={isEditing ? "outline" : "default"}
        >
          {isEditing ? 'Cancel' : 'Edit Profile'}
        </Button>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Profile Information */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <User className="h-5 w-5" />
                <span>Personal Information</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-4">
                <Avatar className="h-16 w-16">
                  <AvatarFallback className="text-lg">
                    {user.name?.split(' ').map((n: string) => n[0]).join('').toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="text-xl font-semibold">{user.name}</h3>
                  <p className="text-muted-foreground flex items-center">
                    <Mail className="h-4 w-4 mr-1" />
                    {user.email}
                  </p>
                  <Badge variant="secondary" className="mt-1">
                    <GraduationCap className="h-3 w-3 mr-1" />
                    Student
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <BookOpen className="h-5 w-5" />
                <span>Academic Information</span>
              </CardTitle>
            </CardHeader>
            
            {saveError && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg mb-4">
                {saveError}
              </div>
            )}

            {saveSuccess && (
              <div className="bg-green-50 border border-green-200 text-green-600 px-4 py-3 rounded-lg mb-4">
                {saveSuccess}
              </div>
            )}
            <CardContent className="space-y-4">
              {isEditing ? (
                <>
                  <div>
                    <label className="block text-sm font-medium mb-2">Grade Level</label>
                    <Select
                      value={formData.grade}
                      onChange={(value) => setFormData(prev => ({ ...prev, grade: value }))}
                      options={[
                        { value: '', label: 'Select Grade' },
                        { value: '9th Grade', label: '9th Grade' },
                        { value: '10th Grade', label: '10th Grade' },
                        { value: '11th Grade', label: '11th Grade' },
                        { value: '12th Grade', label: '12th Grade' },
                        { value: 'College', label: 'College' },
                        { value: 'University', label: 'University' }
                      ]}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Subjects</label>
                    <div className="grid grid-cols-2 gap-2">
                      {availableSubjects.map(subject => (
                        <label key={subject} className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            checked={formData.subjects.includes(subject)}
                            onChange={() => handleSubjectToggle(subject)}
                            className="rounded"
                          />
                          <span className="text-sm">{subject}</span>
                        </label>
                      ))}
                    </div>
                  </div>



                  <div className="flex space-x-2">
                    <Button onClick={handleSave} disabled={saving}>
                      {saving ? 'Saving...' : 'Save Changes'}
                    </Button>
                    <Button variant="outline" onClick={() => setIsEditing(false)}>
                      Cancel
                    </Button>
                  </div>
                </>
              ) : (
                <>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Grade Level</label>
                      <p className="text-foreground">{profile?.grade || 'Not specified'}</p>
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Subjects</label>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {profile?.subjects?.map(subject => (
                        <Badge key={subject} variant="secondary">
                          {subject}
                        </Badge>
                      )) || <span className="text-muted-foreground">No subjects selected</span>}
                    </div>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Stats */}
          <Card>
            <CardHeader>
              <CardTitle>Learning Stats</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">Total Sessions</span>
                </div>
                <span className="font-semibold">{bookings.length}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Star className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">Average Rating</span>
                </div>
                <span className="font-semibold">
                  {bookings.filter(b => b.rating).length > 0 
                    ? (bookings.reduce((sum, b) => sum + (b.rating || 0), 0) / bookings.filter(b => b.rating).length).toFixed(1)
                    : 'N/A'
                  }
                </span>
              </div>
            </CardContent>
          </Card>

          {/* Recent Bookings */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Sessions</CardTitle>
            </CardHeader>
            <CardContent>
              {bookings.length > 0 ? (
                <div className="space-y-3">
                  {bookings.map(booking => (
                    <div key={booking.id} className="flex items-center justify-between p-2 rounded-lg bg-muted/50">
                      <div>
                        <p className="text-sm font-medium">{booking.tutorName}</p>
                        <p className="text-xs text-muted-foreground">{booking.subject}</p>
                      </div>
                      <Badge variant={booking.status === 'completed' ? 'default' : 'secondary'}>
                        {booking.status}
                      </Badge>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">No sessions yet</p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
} 