"use client"

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Search, Star, Clock, MapPin } from 'lucide-react'
import { FullPageSpinner } from '@/components/ui/spinner'

interface Tutor {
  id: string
  name: string
  subjects: string[]
  rating: number
  hourlyRate: number
  location: string
  experience: string
  avatar: string
  description: string
}

export default function TutorsPage() {
  const [tutors, setTutors] = useState<Tutor[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedSubject, setSelectedSubject] = useState('')

  const subjects = ['Mathematics', 'Physics', 'Chemistry', 'Biology', 'English', 'History', 'Computer Science']

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setTutors([
        {
          id: '1',
          name: 'Dr. Sarah Johnson',
          subjects: ['Mathematics', 'Physics'],
          rating: 4.8,
          hourlyRate: 45,
          location: 'New York, NY',
          experience: '5+ years',
          avatar: '/avatars/sarah.jpg',
          description: 'Experienced math and physics tutor with PhD from MIT. Specializes in calculus and mechanics.'
        },
        {
          id: '2',
          name: 'Prof. Michael Chen',
          subjects: ['Chemistry', 'Biology'],
          rating: 4.9,
          hourlyRate: 50,
          location: 'San Francisco, CA',
          experience: '8+ years',
          avatar: '/avatars/michael.jpg',
          description: 'Chemistry professor with extensive experience in organic chemistry and biochemistry.'
        },
        {
          id: '3',
          name: 'Emma Rodriguez',
          subjects: ['English', 'History'],
          rating: 4.7,
          hourlyRate: 35,
          location: 'Chicago, IL',
          experience: '3+ years',
          avatar: '/avatars/emma.jpg',
          description: 'English literature specialist helping students improve writing and critical thinking skills.'
        }
      ])
      setLoading(false)
    }, 1000)
  }, [])

  const filteredTutors = tutors.filter(tutor => {
    const matchesSearch = tutor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         tutor.subjects.some(subject => subject.toLowerCase().includes(searchTerm.toLowerCase()))
    const matchesSubject = !selectedSubject || tutor.subjects.includes(selectedSubject)
    return matchesSearch && matchesSubject
  })

  if (loading) {
    return <FullPageSpinner text="Loading tutors..." />;
  }

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-4">Find Your Perfect Tutor</h1>
          <p className="text-muted-foreground text-lg">Connect with expert tutors for personalized learning</p>
        </div>

        {/* Search and Filters */}
        <div className="mb-8 space-y-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search tutors or subjects..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <select
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value)}
              className="px-4 py-2 border border-input rounded-md bg-background text-foreground"
            >
              <option value="">All Subjects</option>
              {subjects.map(subject => (
                <option key={subject} value={subject}>{subject}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Results */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredTutors.map(tutor => (
            <div key={tutor.id} className="bg-card border rounded-lg p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={tutor.avatar} alt={tutor.name} />
                    <AvatarFallback>{tutor.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-semibold text-foreground">{tutor.name}</h3>
                    <div className="flex items-center space-x-1 text-sm text-muted-foreground">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span>{tutor.rating}</span>
                      <span>•</span>
                      <span>{tutor.experience}</span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="flex items-center space-x-1 text-sm text-muted-foreground">
                    <span className="font-semibold text-foreground">₹{tutor.hourlyRate}/hr</span>
                  </div>
                </div>
              </div>

              <div className="mb-4">
                <div className="flex flex-wrap gap-2 mb-3">
                  {tutor.subjects.map(subject => (
                    <Badge key={subject} variant="secondary" className="text-xs">
                      {subject}
                    </Badge>
                  ))}
                </div>
                <p className="text-sm text-muted-foreground mb-3">{tutor.description}</p>
                <div className="flex items-center space-x-1 text-sm text-muted-foreground">
                  <MapPin className="h-4 w-4" />
                  <span>{tutor.location}</span>
                </div>
              </div>

              <div className="flex space-x-2">
                <Button className="flex-1" size="sm">
                  View Profile
                </Button>
                <Button variant="outline" size="sm">
                  Book Session
                </Button>
              </div>
            </div>
          ))}
        </div>

        {filteredTutors.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No tutors found matching your criteria.</p>
          </div>
        )}
      </div>
    </div>
  )
} 