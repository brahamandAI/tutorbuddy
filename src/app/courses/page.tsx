"use client"

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { mockCourses, type MockCourse } from '@/data/mockCourses'
import { 
  Search, 
  Filter, 
  Star, 
  Clock, 
  MapPin, 
  BookOpen, 
  Users,
  Brain,
  Monitor,
  Target,
  Award,
  School,
  Trophy,
  GraduationCap,
  BookMarked,
  Calendar,
  Play,
  MessageSquare,
  ArrowRight,
  Sparkles
} from 'lucide-react'

type Course = MockCourse

export default function CoursesPage() {
  const [courses, setCourses] = useState<Course[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedSubject, setSelectedSubject] = useState('')
  const [selectedClass, setSelectedClass] = useState('')
  const [selectedBoard, setSelectedBoard] = useState('')
  const [selectedMode, setSelectedMode] = useState('')

  const subjects = ['Mathematics', 'Physics', 'Chemistry', 'Biology', 'English', 'Hindi', 'Social Studies', 'Computer Science']
  const classes = ['Kindergarten', 'Class 1-5', 'Class 6-8', 'Class 9-10', 'Class 11-12', 'Competitive Exams']
  const boards = ['CBSE', 'ICSE', 'State Board', 'International']
  const modes = ['Online', 'Offline', 'Hybrid']

  useEffect(() => {
    // Simulate API call with comprehensive mock data
    setTimeout(() => {
      setCourses(mockCourses)
      setLoading(false)
    }, 1000)
  }, [])

  const filteredCourses = courses.filter(course => {
    const matchesSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         course.subject.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesSubject = !selectedSubject || course.subject === selectedSubject
    const matchesClass = !selectedClass || course.class === selectedClass
    const matchesBoard = !selectedBoard || course.board === selectedBoard
    const matchesMode = !selectedMode || course.mode === selectedMode.toLowerCase()
    
    return matchesSearch && matchesSubject && matchesClass && matchesBoard && matchesMode
  })

  const getModeIcon = (mode: string) => {
    switch (mode) {
      case 'online': return <Monitor className="h-4 w-4" />
      case 'offline': return <MapPin className="h-4 w-4" />
      case 'hybrid': return <Target className="h-4 w-4" />
      default: return <Monitor className="h-4 w-4" />
    }
  }

  const getModeColor = (mode: string) => {
    switch (mode) {
      case 'online': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
      case 'offline': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
      case 'hybrid': return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200'
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background p-8">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-muted rounded w-1/4 mb-8"></div>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-80 bg-muted rounded-lg"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-4">Explore Courses</h1>
          <p className="text-muted-foreground text-lg">From Kindergarten to Competitive Exams - Find your perfect course</p>
        </div>

        {/* AI Recommendation Banner */}
        <div className="mb-8 bg-gradient-to-r from-primary/10 to-secondary/10 rounded-lg p-6 border-0">
          <div className="flex items-center space-x-3 mb-3">
            <Brain className="h-6 w-6 text-primary" />
            <h2 className="text-xl font-semibold">AI-Powered Course Recommendations</h2>
          </div>
          <p className="text-muted-foreground mb-4">
            Our AI analyzes your learning style and preferences to suggest the best courses for you. 
            Look for the <Sparkles className="h-4 w-4 inline text-primary" /> icon for AI-recommended courses.
          </p>
          <Button variant="outline" size="sm">
            <Brain className="mr-2 h-4 w-4" />
            Get Personalized Recommendations
          </Button>
        </div>

        {/* Search and Filters */}
        <div className="mb-8 space-y-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search courses..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button variant="outline">
              <Filter className="mr-2 h-4 w-4" />
              Filters
            </Button>
          </div>
          
          <div className="flex flex-wrap gap-2">
            <select
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value)}
              className="px-3 py-2 border border-input rounded-md bg-background text-foreground text-sm"
            >
              <option value="">All Subjects</option>
              {subjects.map(subject => (
                <option key={subject} value={subject}>{subject}</option>
              ))}
            </select>
            
            <select
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
              className="px-3 py-2 border border-input rounded-md bg-background text-foreground text-sm"
            >
              <option value="">All Classes</option>
              {classes.map(cls => (
                <option key={cls} value={cls}>{cls}</option>
              ))}
            </select>
            
            <select
              value={selectedBoard}
              onChange={(e) => setSelectedBoard(e.target.value)}
              className="px-3 py-2 border border-input rounded-md bg-background text-foreground text-sm"
            >
              <option value="">All Boards</option>
              {boards.map(board => (
                <option key={board} value={board}>{board}</option>
              ))}
            </select>
            
            <select
              value={selectedMode}
              onChange={(e) => setSelectedMode(e.target.value)}
              className="px-3 py-2 border border-input rounded-md bg-background text-foreground text-sm"
            >
              <option value="">All Modes</option>
              {modes.map(mode => (
                <option key={mode} value={mode}>{mode}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Results */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredCourses.map(course => (
            <Card key={course.id} className="hover:shadow-lg transition-shadow border-0 bg-gradient-to-br from-card to-card/50">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      {course.aiRecommendation && (
                        <Sparkles className="h-4 w-4 text-primary" />
                      )}
                      <Badge className={getModeColor(course.mode)}>
                        {getModeIcon(course.mode)}
                        <span className="ml-1">{course.mode}</span>
                      </Badge>
                    </div>
                    <CardTitle className="text-lg line-clamp-2">{course.title}</CardTitle>
                    <CardDescription className="text-sm">
                      {course.subject} • {course.class} • {course.board}
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent>
                {/* Tutor Info */}
                <div className="flex items-center space-x-3 mb-4">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={course.tutor.avatar} alt={course.tutor.name} />
                    <AvatarFallback>{course.tutor.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <h4 className="font-semibold text-sm">{course.tutor.name}</h4>
                    <div className="flex items-center space-x-1 text-xs text-muted-foreground">
                      <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                      <span>{course.tutor.rating}</span>
                      <span>•</span>
                      <span>{course.tutor.experience}</span>
                    </div>
                  </div>
                </div>

                {/* Course Details */}
                <div className="space-y-3 mb-4">
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center space-x-1 text-muted-foreground">
                      <Clock className="h-4 w-4" />
                      <span>{course.duration}</span>
                    </div>
                    <div className="flex items-center space-x-1 text-muted-foreground">
                      <Users className="h-4 w-4" />
                      <span>{course.students} students</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center space-x-1 text-muted-foreground">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span>{course.rating}</span>
                      <span>({course.reviews})</span>
                    </div>
                    <div className="flex items-center space-x-1 font-semibold text-foreground">
                      <span>₹{course.price}</span>
                    </div>
                  </div>
                </div>

                {/* Syllabus Preview */}
                <div className="mb-4">
                  <h5 className="text-sm font-medium mb-2">Syllabus:</h5>
                  <div className="flex flex-wrap gap-1">
                    {course.syllabus.slice(0, 3).map((topic, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {topic}
                      </Badge>
                    ))}
                    {course.syllabus.length > 3 && (
                      <Badge variant="outline" className="text-xs">
                        +{course.syllabus.length - 3} more
                      </Badge>
                    )}
                  </div>
                </div>

                {/* Location (for offline courses) */}
                {course.location && (
                  <div className="flex items-center space-x-1 text-sm text-muted-foreground mb-4">
                    <MapPin className="h-4 w-4" />
                    <span>{course.location}</span>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex space-x-2">
                  <Button className="flex-1" size="sm">
                    <BookOpen className="mr-2 h-4 w-4" />
                    View Details
                  </Button>
                  <Button variant="outline" size="sm">
                    <MessageSquare className="mr-2 h-4 w-4" />
                    Contact
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredCourses.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground mb-4">No courses found matching your criteria.</p>
            <Button onClick={() => {
              setSearchTerm('')
              setSelectedSubject('')
              setSelectedClass('')
              setSelectedBoard('')
              setSelectedMode('')
            }}>Clear Filters</Button>
          </div>
        )}
      </div>
    </div>
  )
} 