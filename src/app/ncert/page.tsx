'use client'

import React, { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { BookOpen, Users, Award, ArrowRight, GraduationCap, Star, Loader2, FileText, Brain, Sparkles, Zap, Bot } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/badge'

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

  const availableClasses = classes.filter(cls => cls.isAvailable)
  const upcomingClasses = classes.filter(cls => !cls.isAvailable)

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-gray-900 dark:via-blue-900 dark:to-indigo-900">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center min-h-[60vh]">
            <div className="text-center">
              <Loader2 className="h-12 w-12 animate-spin text-blue-500 mx-auto mb-4" />
              <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-300">
                Initializing AI Tutor Hub...
              </h2>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-gray-900 dark:via-blue-900 dark:to-indigo-900">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <div className="relative w-24 h-24 rounded-full bg-gradient-to-r from-purple-600 via-blue-600 to-cyan-500 flex items-center justify-center mx-auto mb-6 shadow-xl">
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-purple-600 via-blue-600 to-cyan-500 animate-pulse opacity-75"></div>
            <Brain className="h-12 w-12 text-white relative z-10" />
          </div>
          <h1 className="text-5xl font-bold bg-gradient-to-r from-purple-600 via-blue-600 to-cyan-500 bg-clip-text text-transparent mb-4 animate-pulse">
            AI Tutor Hub
          </h1>
          <div className="flex items-center justify-center gap-2 mb-6">
            <Sparkles className="h-5 w-5 text-purple-500 animate-spin" />
            <span className="text-sm font-medium text-purple-600 dark:text-purple-400">Powered by Advanced AI</span>
            <Sparkles className="h-5 w-5 text-cyan-500 animate-spin" />
          </div>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto leading-relaxed">
            Experience intelligent, personalized learning with AI-powered summaries, interactive Q&A, and adaptive exercises. 
            Transform your study sessions from Class 1 to 12 with our advanced AI tutor companion.
          </p>
        </div>

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

        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <Card className="text-center bg-gradient-to-br from-white/90 to-purple-50/90 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300">
            <CardContent className="p-6">
              <div className="relative">
                <Brain className="h-8 w-8 text-purple-500 mx-auto mb-3" />
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
              </div>
              <div className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                {availableClasses.length}
              </div>
              <div className="text-gray-600 dark:text-gray-400">AI Learning Paths</div>
            </CardContent>
          </Card>
          <Card className="text-center bg-gradient-to-br from-white/90 to-cyan-50/90 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300">
            <CardContent className="p-6">
              <div className="relative">
                <Zap className="h-8 w-8 text-cyan-500 mx-auto mb-3" />
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-yellow-400 rounded-full animate-bounce"></div>
              </div>
              <div className="text-2xl font-bold bg-gradient-to-r from-cyan-600 to-blue-600 bg-clip-text text-transparent">
                {availableClasses.reduce((sum, cls) => sum + cls.subjects.length, 0)}
              </div>
              <div className="text-gray-600 dark:text-gray-400">Smart Subjects</div>
            </CardContent>
          </Card>
          <Card className="text-center bg-gradient-to-br from-white/90 to-indigo-50/90 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300">
            <CardContent className="p-6">
              <div className="relative">
                <Bot className="h-8 w-8 text-indigo-500 mx-auto mb-3" />
                <Sparkles className="absolute -top-2 -right-2 h-4 w-4 text-yellow-400 animate-pulse" />
              </div>
              <div className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                {availableClasses.reduce((sum, cls) => sum + cls.totalChapters, 0)}
              </div>
              <div className="text-gray-600 dark:text-gray-400">AI-Enhanced Chapters</div>
            </CardContent>
          </Card>
        </div>

        {availableClasses.length > 0 && (
          <div className="mb-12">
            <div className="flex items-center mb-6">
              <div className="relative mr-3">
                <Brain className="h-6 w-6 text-purple-500" />
                <div className="absolute -top-1 -right-1 w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              </div>
              <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                AI-Powered Learning Available
              </h2>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {availableClasses.map((classInfo) => (
                <Card key={classInfo.id} className="group hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 bg-white/80 backdrop-blur-sm border-0">
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
                      <Button className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white transition-all duration-300 group">
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

        <div>
          <div className="flex items-center mb-6">
            <BookOpen className="h-6 w-6 text-gray-500 mr-2" />
            <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-200">
              Coming Soon
            </h2>
          </div>
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
