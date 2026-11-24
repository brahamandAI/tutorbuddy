'use client'

import React, { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { BookOpen, Users, Award, ArrowRight, FileText, Search, Filter } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/Input'
import { FullPageSpinner } from '@/components/ui/spinner'

interface ClassInfo {
  id: number
  name: string
  description: string
  subjects: string[]
  isAvailable: boolean
  totalChapters: number
}

export default function NCERTPage() {
  const [classes, setClasses] = useState<ClassInfo[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedClass, setSelectedClass] = useState('')
  const [selectedSubject, setSelectedSubject] = useState('')
  const [selectedStage, setSelectedStage] = useState('')
  const [selectedAvailability, setSelectedAvailability] = useState('')

  const stages = [
    { id: 'primary', label: 'Primary (1-5)', ids: [1, 2, 3, 4, 5] },
    { id: 'middle', label: 'Middle (6-8)', ids: [6, 7, 8] },
    { id: 'secondary', label: 'Secondary (9-10)', ids: [9, 10] },
    { id: 'senior', label: 'Senior Secondary (11-12)', ids: [11, 12] },
  ]

  const getClassInfo = (classId: number): ClassInfo => {
    const classDescriptions = {
      1: "Foundation level learning with basic concepts in English, Hindi, and Mathematics",
      2: "Building on foundation with expanded vocabulary and number concepts",
      3: "Introduction to more complex language and mathematical concepts",
      4: "Enhanced learning with additional subjects and deeper understanding",
      5: "Intermediate level with science and social studies introduction",
      6: "Middle school concepts with expanded curriculum",
      7: "Advanced middle school learning across all subjects",
      8: "Pre-secondary education with comprehensive subjects",
      9: "Secondary education foundation with board preparation",
      10: "Board examination preparation with detailed study materials",
      11: "Higher secondary education with stream specialization",
      12: "Final year preparation for competitive exams and higher studies"
    }
    
    const subjectsByClass = {
      1: ["English", "Hindi", "Mathematics"],
      2: ["English", "Hindi", "Mathematics"],
      3: ["English", "Hindi", "Mathematics", "Environmental Studies"],
      4: ["English", "Hindi", "Mathematics", "Environmental Studies"],
      5: ["English", "Hindi", "Mathematics", "Environmental Studies"],
      6: ["English", "Hindi", "Mathematics", "Science", "Social Studies"],
      7: ["English", "Hindi", "Mathematics", "Science", "Social Studies"],
      8: ["English", "Hindi", "Mathematics", "Science", "Social Studies"],
      9: ["English", "Hindi", "Mathematics", "Science", "Social Studies"],
      10: ["English", "Hindi", "Mathematics", "Science", "Social Studies"],
      11: ["English", "Physics", "Chemistry", "Mathematics", "Biology", "History", "Geography", "Political Science", "Economics"],
      12: ["English", "Physics", "Chemistry", "Mathematics", "Biology", "History", "Geography", "Political Science", "Economics"]
    }
    
    return {
      id: classId,
      name: `Class ${classId}`,
      description: classDescriptions[classId as keyof typeof classDescriptions] || `Class ${classId} learning materials`,
      subjects: subjectsByClass[classId as keyof typeof subjectsByClass] || ["English", "Hindi", "Mathematics"],
      isAvailable: false,
      totalChapters: 0
    }
  }

  const loadAvailableClasses = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)

      const allClasses = Array.from({ length: 12 }, (_, i) => i + 1).map(classId => {
        return getClassInfo(classId)
      })

      const classesWithAvailability = await Promise.all(
        allClasses.map(async (classInfo) => {
          try {
            const response = await fetch(`/api/ncert/subjects?class=${classInfo.id}`)
            if (response.ok) {
              const data = await response.json()
              const totalChapters = data.subjects?.reduce((sum: number, subject: any) => sum + subject.chapters, 0) || 0
              return {
                ...classInfo,
                isAvailable: data.subjects && data.subjects.length > 0,
                totalChapters
              }
            }
            return classInfo
          } catch (err) {
            console.warn(`Error checking class ${classInfo.id}:`, err)
            return classInfo
          }
        })
      )

      setClasses(classesWithAvailability)
    } catch (err) {
      console.error('Error loading classes:', err)
      setError('Failed to load class information')
      
      const fallbackClasses = Array.from({ length: 12 }, (_, i) => i + 1).map(classId => ({
        ...getClassInfo(classId),
        isAvailable: classId === 1,
        totalChapters: classId === 1 ? 41 : 0
      }))
      setClasses(fallbackClasses)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadAvailableClasses()
  }, [loadAvailableClasses])

  const subjects = Array.from(new Set(classes.flatMap((cls) => cls.subjects))).sort()

  const filteredClasses = classes.filter((cls) => {
    const haystack = `${cls.name} ${cls.description} ${cls.subjects.join(' ')}`.toLowerCase()
    const matchesSearch = !searchTerm || haystack.includes(searchTerm.toLowerCase())
    const matchesClass = !selectedClass || String(cls.id) === selectedClass
    const matchesSubject = !selectedSubject || cls.subjects.includes(selectedSubject)
    const stage = stages.find((item) => item.id === selectedStage)
    const matchesStage = !stage || stage.ids.includes(cls.id)
    const matchesAvailability =
      !selectedAvailability ||
      (selectedAvailability === 'available' && cls.isAvailable) ||
      (selectedAvailability === 'upcoming' && !cls.isAvailable)
    return matchesSearch && matchesClass && matchesSubject && matchesStage && matchesAvailability
  })
  const availableClasses = filteredClasses.filter((cls) => cls.isAvailable)
  const upcomingClasses = filteredClasses.filter((cls) => !cls.isAvailable)
  const clearFilters = () => {
    setSearchTerm('')
    setSelectedClass('')
    setSelectedSubject('')
    setSelectedStage('')
    setSelectedAvailability('')
  }

  if (loading) {
    return <FullPageSpinner text="Loading your classes..." />
  }

  return (
    <div>
      <div className="mx-auto w-full max-w-6xl space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Learning Library</h1>
          <p className="mt-2 max-w-2xl text-base text-muted-foreground">
            Explore all available classes and open a chapter to add it to My Learning.
          </p>
        </div>

        <div className="space-y-4">
          <div className="flex flex-col gap-4 md:flex-row">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search classes or subjects..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button variant="outline" type="button" onClick={clearFilters}>
              <Filter className="mr-2 h-4 w-4" />
              Clear filters
            </Button>
          </div>
          <div className="flex flex-wrap gap-2">
            <select
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
              className="rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground"
            >
              <option value="">All Classes</option>
              {Array.from({ length: 12 }, (_, i) => i + 1).map((id) => (
                <option key={id} value={String(id)}>Class {id}</option>
              ))}
            </select>
            <select
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value)}
              className="rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground"
            >
              <option value="">All Subjects</option>
              {subjects.map((subject) => (
                <option key={subject} value={subject}>{subject}</option>
              ))}
            </select>
            <select
              value={selectedStage}
              onChange={(e) => setSelectedStage(e.target.value)}
              className="rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground"
            >
              <option value="">All Stages</option>
              {stages.map((stage) => (
                <option key={stage.id} value={stage.id}>{stage.label}</option>
              ))}
            </select>
            <select
              value={selectedAvailability}
              onChange={(e) => setSelectedAvailability(e.target.value)}
              className="rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground"
            >
              <option value="">All Status</option>
              <option value="available">Available</option>
              <option value="upcoming">Coming soon</option>
            </select>
          </div>
        </div>

        <Card className="border-border/60 shadow-sm">
          <CardHeader>
            <CardTitle className="text-xl">Continue learning</CardTitle>
            <CardDescription>Open a class and start with the first available chapter.</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-3">
            {availableClasses[0] ? (
              <Link href={`/ncert/${availableClasses[0].id}`}>
                <Button>Continue with {availableClasses[0].name}</Button>
              </Link>
            ) : null}
            <Link href="/ai-teaching">
              <Button variant="outline">Ask AI Tutor</Button>
            </Link>
          </CardContent>
        </Card>

        {error && (
          <div className="mb-8 p-4 bg-red-50 dark:bg-red-900/50 border border-red-200 dark:border-red-700 rounded-lg">
            <p className="text-red-700 dark:text-red-300 text-center">{error}</p>
            <div className="text-center mt-2">
              <Button variant="outline" size="sm" onClick={loadAvailableClasses}>
                Try Again
              </Button>
            </div>
          </div>
        )}

        {availableClasses.length === 0 && upcomingClasses.length === 0 && (
          <div className="rounded-2xl border border-dashed border-border px-6 py-12 text-center">
            <p className="text-muted-foreground">No classes match these filters.</p>
            <Button className="mt-4" variant="outline" onClick={clearFilters}>Clear filters</Button>
          </div>
        )}

        {availableClasses.length > 0 && (
          <div className="mb-12">
            <h2 className="mb-4 text-xl font-semibold text-foreground">Choose a class</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {availableClasses.map((classInfo) => (
                <Card key={classInfo.id} className="border-border/60 shadow-sm">
                  <CardHeader className="pb-4">
                    <div className="flex items-center justify-between mb-2">
                      <Badge variant="default" className="bg-green-500 text-white">
                        Available
                      </Badge>
                      <div className="flex items-center text-sm text-gray-500">
                        <FileText className="h-4 w-4 mr-1" />
                        {classInfo.totalChapters} chapters
                      </div>
                    </div>
                    <CardTitle className="text-2xl font-bold text-gray-800 dark:text-gray-200 group-hover:text-blue-600 transition-colors">
                      {classInfo.name}
                    </CardTitle>
                    <CardDescription className="text-gray-600 dark:text-gray-400">
                      {classInfo.description}
                    </CardDescription>
                  </CardHeader>
                  
                  <CardContent className="pt-0">
                    <div className="mb-4">
                      <div className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Subjects:</div>
                      <div className="flex flex-wrap gap-2">
                        {classInfo.subjects.map((subject) => (
                          <span 
                            key={subject} 
                            className="px-2 py-1 bg-blue-50 text-blue-700 rounded text-xs font-medium dark:bg-blue-900/30 dark:text-blue-400"
                          >
                            {subject}
                          </span>
                        ))}
                      </div>
                    </div>
                    
                    <Link href={`/ncert/${classInfo.id}`}>
                      <Button className="w-full">
                        <span className="mr-2">Explore {classInfo.name}</span>
                        <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        <div className="grid gap-6 md:grid-cols-3">
          <Card className="border-border/60 text-center shadow-sm">
            <CardContent className="p-6">
              <div className="text-2xl font-bold text-foreground">{availableClasses.length}</div>
              <div className="text-sm text-muted-foreground">Classes ready</div>
            </CardContent>
          </Card>
          <Card className="border-border/60 text-center shadow-sm">
            <CardContent className="p-6">
              <div className="text-2xl font-bold text-foreground">{availableClasses.reduce((sum, cls) => sum + cls.subjects.length, 0)}</div>
              <div className="text-sm text-muted-foreground">Subjects</div>
            </CardContent>
          </Card>
          <Card className="border-border/60 text-center shadow-sm">
            <CardContent className="p-6">
              <div className="text-2xl font-bold text-foreground">{availableClasses.reduce((sum, cls) => sum + cls.totalChapters, 0)}</div>
              <div className="text-sm text-muted-foreground">Chapters</div>
            </CardContent>
          </Card>
        </div>

        {upcomingClasses.length > 0 && (
        <div>
          <h2 className="mb-4 text-xl font-semibold text-foreground">Coming soon</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {upcomingClasses.map((classInfo) => (
              <Card key={classInfo.id} className="opacity-75 hover:opacity-90 transition-opacity bg-white/60 backdrop-blur-sm border-0">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between mb-2">
                    <Badge variant="secondary" className="text-gray-600">
                      Coming Soon
                    </Badge>
                  </div>
                  <CardTitle className="text-lg font-bold text-gray-700 dark:text-gray-300">
                    {classInfo.name}
                  </CardTitle>
                  <CardDescription className="text-sm text-gray-500 dark:text-gray-500">
                    {classInfo.subjects.length} subjects planned
                  </CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
        )}

        <div className="mt-16">
          <Card className="max-w-4xl mx-auto bg-white/80 backdrop-blur-sm border-0">
            <CardContent className="p-8">
              <div className="text-center mb-8">
                <BookOpen className="h-12 w-12 text-blue-500 mx-auto mb-4" />
                <h3 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-4">
                  About NCERT Digital Library
                </h3>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed max-w-2xl mx-auto">
                  Our digital library provides free access to all NCERT textbooks with modern PDF viewing capabilities. 
                  Features include zoom, search, AI-powered summaries, and offline download. Perfect for students, 
                  teachers, and anyone looking to access quality educational content.
                </p>
              </div>
              
              <div className="grid md:grid-cols-3 gap-6 text-center">
                <div>
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                    <BookOpen className="h-6 w-6 text-blue-600" />
                  </div>
                  <h4 className="font-semibold text-gray-800 dark:text-gray-200 mb-2">Modern PDF Viewer</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Advanced viewer with zoom, search, and AI summaries
                  </p>
                </div>
                <div>
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                    <Users className="h-6 w-6 text-green-600" />
                  </div>
                  <h4 className="font-semibold text-gray-800 dark:text-gray-200 mb-2">Download PDFs</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Download chapters for offline reading and study
                  </p>
                </div>
                <div>
                  <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                    <Award className="h-6 w-6 text-purple-600" />
                  </div>
                  <h4 className="font-semibold text-gray-800 dark:text-gray-200 mb-2">Official Content</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    All content follows official NCERT curriculum
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
