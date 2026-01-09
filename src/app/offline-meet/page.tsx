"use client"

import { useState } from 'react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { 
  MapPin, 
  Clock, 
  Users, 
  Star, 
  Calendar, 
  Phone, 
  Mail, 
  MessageSquare,
  Navigation,
  Building,
  CheckCircle,
  ArrowRight,
  Filter,
  Search,
  MapPin as Location,
  Clock4,
  User,
  GraduationCap,
  BookOpen,
  Target,
  Award,
  School,
  Trophy
} from 'lucide-react'

interface Location {
  id: string
  name: string
  address: string
  area: string
  coordinates: { lat: number; lng: number }
  tutors: number
  students: number
  rating: number
  facilities: string[]
  availableSlots: Slot[]
  contact: {
    phone: string
    email: string
  }
}

interface Slot {
  id: string
  time: string
  date: string
  available: boolean
  tutor?: string
  subject?: string
}

export default function OfflineMeetPage() {
  const [selectedLocation, setSelectedLocation] = useState<string>('')
  const [selectedDate, setSelectedDate] = useState('')
  const [selectedSubject, setSelectedSubject] = useState('')
  const [searchTerm, setSearchTerm] = useState('')

  const locations: Location[] = [
    {
      id: '1',
      name: 'Lajpat Nagar Learning Center',
      address: 'Shop No. 15, Lajpat Nagar Central Market, New Delhi - 110024',
      area: 'Lajpat Nagar',
      coordinates: { lat: 28.5679, lng: 77.2434 },
      tutors: 25,
      students: 150,
      rating: 4.8,
      facilities: ['Wi-Fi', 'AC Classrooms', 'Library', 'Computer Lab', 'Parking'],
      availableSlots: [
        { id: '1', time: '9:00 AM', date: '2024-01-20', available: true, tutor: 'Dr. Priya Sharma', subject: 'Mathematics' },
        { id: '2', time: '10:30 AM', date: '2024-01-20', available: true, tutor: 'Prof. Rajesh Kumar', subject: 'Physics' },
        { id: '3', time: '2:00 PM', date: '2024-01-20', available: false },
        { id: '4', time: '4:30 PM', date: '2024-01-20', available: true, tutor: 'Ms. Sarah Johnson', subject: 'English' }
      ],
      contact: {
        phone: '+91 98765 43212',
        email: 'lajpat@tutorbuddy.com'
      }
    },
    {
      id: '2',
      name: 'Dwarka Study Hub',
      address: 'Plot No. 8, Sector 12, Dwarka, New Delhi - 110078',
      area: 'Dwarka',
      coordinates: { lat: 28.5892, lng: 77.0591 },
      tutors: 30,
      students: 180,
      rating: 4.9,
      facilities: ['Wi-Fi', 'AC Classrooms', 'Science Lab', 'Study Rooms', 'Cafeteria'],
      availableSlots: [
        { id: '1', time: '9:00 AM', date: '2024-01-20', available: true, tutor: 'Dr. Amit Patel', subject: 'Biology' },
        { id: '2', time: '11:00 AM', date: '2024-01-20', available: true, tutor: 'Prof. Meera Singh', subject: 'Chemistry' },
        { id: '3', time: '3:00 PM', date: '2024-01-20', available: true, tutor: 'Mr. Rahul Verma', subject: 'Computer Science' }
      ],
      contact: {
        phone: '+91 98765 43213',
        email: 'dwarka@tutorbuddy.com'
      }
    },
    {
      id: '3',
      name: 'Saket Education Center',
      address: 'Shop No. 22, Saket District Center, New Delhi - 110017',
      area: 'Saket',
      coordinates: { lat: 28.5275, lng: 77.2189 },
      tutors: 15,
      students: 90,
      rating: 4.6,
      facilities: ['Wi-Fi', 'AC Classrooms', 'Library', 'Parking'],
      availableSlots: [
        { id: '1', time: '10:00 AM', date: '2024-01-20', available: true, tutor: 'Ms. Anjali Gupta', subject: 'Hindi' },
        { id: '2', time: '2:30 PM', date: '2024-01-20', available: true, tutor: 'Mr. Suresh Kumar', subject: 'Social Studies' }
      ],
      contact: {
        phone: '+91 98765 43214',
        email: 'saket@tutorbuddy.com'
      }
    },
    {
      id: '4',
      name: 'Rohini Learning Zone',
      address: 'Shop No. 45, Rohini Sector 7, New Delhi - 110085',
      area: 'Rohini',
      coordinates: { lat: 28.7439, lng: 77.0727 },
      tutors: 20,
      students: 120,
      rating: 4.7,
      facilities: ['Wi-Fi', 'AC Classrooms', 'Computer Lab', 'Study Rooms'],
      availableSlots: [
        { id: '1', time: '9:30 AM', date: '2024-01-20', available: true, tutor: 'Dr. Neha Sharma', subject: 'Mathematics' },
        { id: '2', time: '1:00 PM', date: '2024-01-20', available: true, tutor: 'Prof. Vikram Singh', subject: 'Physics' }
      ],
      contact: {
        phone: '+91 98765 43215',
        email: 'rohini@tutorbuddy.com'
      }
    }
  ]

  const subjects = ['Mathematics', 'Physics', 'Chemistry', 'Biology', 'English', 'Hindi', 'Social Studies', 'Computer Science']

  const filteredLocations = locations.filter(location =>
    location.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    location.area.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleBooking = (locationId: string, slotId: string) => {
    // Handle booking logic
    console.log(`Booking slot ${slotId} at location ${locationId}`)
  }

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-4">Delhi Offline Meet Locations</h1>
          <p className="text-muted-foreground text-lg">
            Book in-person sessions at our conveniently located centers across Delhi
          </p>
        </div>

        {/* Search and Filters */}
        <div className="mb-8 space-y-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search locations..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <select
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value)}
              className="px-3 py-2 border border-input rounded-md bg-background text-foreground"
            >
              <option value="">All Subjects</option>
              {subjects.map(subject => (
                <option key={subject} value={subject}>{subject}</option>
              ))}
            </select>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="px-3 py-2 border border-input rounded-md bg-background text-foreground"
            />
          </div>
        </div>

        {/* Map Placeholder */}
        <Card className="mb-8 border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <MapPin className="h-5 w-5" />
              <span>Interactive Map</span>
            </CardTitle>
            <CardDescription>
              Click on a location to view details and book sessions
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64 bg-muted rounded-lg flex items-center justify-center">
              <div className="text-center">
                <MapPin className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">Interactive map will be integrated here</p>
                <p className="text-sm text-muted-foreground">Showing {filteredLocations.length} locations in Delhi</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Locations Grid */}
        <div className="grid gap-6 md:grid-cols-2">
          {filteredLocations.map(location => (
            <Card key={location.id} className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-xl">{location.name}</CardTitle>
                    <CardDescription className="flex items-center space-x-2 mt-2">
                      <MapPin className="h-4 w-4" />
                      <span>{location.address}</span>
                    </CardDescription>
                  </div>
                  <Badge variant="secondary">
                    {location.area}
                  </Badge>
                </div>
              </CardHeader>
              
              <CardContent>
                {/* Stats */}
                <div className="grid grid-cols-3 gap-4 mb-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-foreground">{location.tutors}</div>
                    <div className="text-sm text-muted-foreground">Tutors</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-foreground">{location.students}</div>
                    <div className="text-sm text-muted-foreground">Students</div>
                  </div>
                  <div className="text-center">
                    <div className="flex items-center justify-center space-x-1">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span className="text-lg font-bold">{location.rating}</span>
                    </div>
                    <div className="text-sm text-muted-foreground">Rating</div>
                  </div>
                </div>

                {/* Facilities */}
                <div className="mb-4">
                  <h4 className="font-semibold mb-2">Facilities</h4>
                  <div className="flex flex-wrap gap-1">
                    {location.facilities.map(facility => (
                      <Badge key={facility} variant="outline" className="text-xs">
                        {facility}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Available Slots */}
                <div className="mb-4">
                  <h4 className="font-semibold mb-2">Available Slots Today</h4>
                  <div className="space-y-2">
                    {location.availableSlots.filter(slot => slot.available).slice(0, 3).map(slot => (
                      <div key={slot.id} className="flex items-center justify-between p-2 bg-muted rounded-lg">
                        <div className="flex items-center space-x-2">
                          <Clock className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm font-medium">{slot.time}</span>
                          {slot.tutor && (
                            <>
                              <span className="text-muted-foreground">•</span>
                              <span className="text-sm text-muted-foreground">{slot.tutor}</span>
                            </>
                          )}
                        </div>
                        <Button size="sm" onClick={() => handleBooking(location.id, slot.id)}>
                          Book
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Contact Info */}
                <div className="flex items-center justify-between pt-4 border-t">
                  <div className="flex items-center space-x-4">
                    <Button variant="outline" size="sm">
                      <Phone className="mr-2 h-4 w-4" />
                      Call
                    </Button>
                    <Button variant="outline" size="sm">
                      <MessageSquare className="mr-2 h-4 w-4" />
                      Message
                    </Button>
                  </div>
                  <Button>
                    <Calendar className="mr-2 h-4 w-4" />
                    View All Slots
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Booking Instructions */}
        <Card className="mt-8 border-0 shadow-lg">
          <CardHeader>
            <CardTitle>How to Book Offline Sessions</CardTitle>
            <CardDescription>
              Follow these simple steps to book your in-person learning session
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-6 md:grid-cols-3">
              <div className="text-center">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <MapPin className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold mb-2">1. Choose Location</h3>
                <p className="text-sm text-muted-foreground">
                  Select a convenient center from our Delhi locations
                </p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Calendar className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold mb-2">2. Pick Time Slot</h3>
                <p className="text-sm text-muted-foreground">
                  Choose from available time slots and subjects
                </p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold mb-2">3. Confirm Booking</h3>
                <p className="text-sm text-muted-foreground">
                  Get confirmation and meet your tutor at the center
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 