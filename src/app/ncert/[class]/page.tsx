'use client'

import React, { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { BookOpen, ArrowLeft, FileText, ChevronRight, Loader2, Brain, Sparkles, Zap } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/Button'

interface Subject {
  id: string
  name: string
  displayName: string
  chapters: number
  description: string
  color: string
}

export default function ClassPage() {
  const params = useParams()
  const className = params.class as string
  const [subjects, setSubjects] = useState<Subject[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const loadSubjects = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)

      // Fetch available subjects for this class
      const response = await fetch(`/api/ncert/subjects?class=${className}`)
      if (!response.ok) {
        throw new Error('Failed to load subjects')
      }

      const data = await response.json()
      setSubjects(data.subjects || [])
    } catch (err) {
      console.error('Error loading subjects:', err)
      setError('Failed to load subjects. Please try again.')
      
      // Fallback: Load known subjects for class 1
      if (className === '1') {
        setSubjects([
          {
            id: 'english',
            name: 'class1english',
            displayName: 'English',
            chapters: 9,
            description: 'Basic English language learning with stories and vocabulary',
            color: 'bg-blue-500'
          },
          {
            id: 'hindi',
            name: 'class1hindi', 
            displayName: 'Hindi',
            chapters: 19,
            description: 'Hindi language fundamentals and basic reading skills',
            color: 'bg-orange-500'
          },
          {
            id: 'maths',
            name: 'class1maths',
            displayName: 'Mathematics',
            chapters: 13,
            description: 'Basic mathematical concepts, numbers, and simple operations',
            color: 'bg-green-500'
          }
        ])
      }
    } finally {
      setLoading(false)
    }
  }, [className])

  useEffect(() => {
    loadSubjects()
  }, [loadSubjects])

  const getClassDisplayName = (classNum: string) => {
    const num = parseInt(classNum)
    if (num === 1) return '1st'
    if (num === 2) return '2nd'  
    if (num === 3) return '3rd'
    return `${num}th`
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center min-h-[60vh]">
            <div className="text-center">
              <Loader2 className="h-12 w-12 animate-spin text-blue-500 mx-auto mb-4" />
              <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-300">
                AI is preparing your learning path...
              </h2>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center mb-4">
            <Link href="/ncert">
              <Button variant="ghost" size="sm" className="mr-4">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to AI Hub
              </Button>
            </Link>
          </div>
          
          <div className="text-center">
            <div className="flex items-center justify-center mb-4">
              <Brain className="h-8 w-8 text-purple-500 mr-3" />
              <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                Class {getClassDisplayName(className)} AI Learning
              </h1>
              <Sparkles className="h-6 w-6 text-cyan-500 ml-3 animate-pulse" />
            </div>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Select a subject to begin your personalized AI-powered learning journey with intelligent summaries and interactive experiences
            </p>
          </div>
        </div>

        {/* Error State */}
        {error && (
          <div className="mb-8 p-4 bg-red-50 dark:bg-red-900/50 border border-red-200 dark:border-red-700 rounded-lg">
            <p className="text-red-700 dark:text-red-300 text-center">{error}</p>
            <div className="text-center mt-2">
              <Button variant="outline" size="sm" onClick={loadSubjects}>
                Try Again
              </Button>
            </div>
          </div>
        )}

        {/* Subjects Grid */}
        {subjects.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {subjects.map((subject) => (
              <Link key={subject.id} href={`/ncert/${className}/${subject.id}`}>
                <Card className="group hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 cursor-pointer border-0 bg-gradient-to-br from-white/90 to-purple-50/50 dark:from-gray-800/90 dark:to-purple-900/30 backdrop-blur-sm hover:bg-gradient-to-br hover:from-white hover:to-purple-100/70 dark:hover:from-gray-800 dark:hover:to-purple-800/50">
                  <CardHeader className="pb-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className={`w-12 h-12 bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg flex items-center justify-center text-white shadow-lg relative`}>
                        <Brain className="h-6 w-6 relative z-10" />
                        <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      </div>
                      <div className="flex items-center">
                        <Sparkles className="h-4 w-4 text-purple-400 mr-2 animate-pulse" />
                        <ChevronRight className="h-5 w-5 text-gray-400 group-hover:text-purple-600 transition-colors" />
                      </div>
                    </div>
                    
                    <CardTitle className="text-xl font-semibold text-gray-800 dark:text-white">
                      {subject.displayName}
                    </CardTitle>
                    <CardDescription className="text-gray-600 dark:text-gray-400">
                      {subject.description}
                    </CardDescription>
                  </CardHeader>
                  
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                        <FileText className="h-4 w-4 mr-2" />
                        {subject.chapters} Chapters
                      </div>
                      
                      <Button 
                        size="sm" 
                        className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white shadow-lg transition-all duration-300"
                      >
                        Learn with AI
                        <Zap className="h-4 w-4 ml-1" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        ) : (
          !loading && (
            <div className="text-center py-16">
              <BookOpen className="h-16 w-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
              <h2 className="text-2xl font-semibold text-gray-600 dark:text-gray-400 mb-2">
                No Subjects Available
              </h2>
              <p className="text-gray-500 dark:text-gray-500 mb-4">
                Subjects for Class {className} are not available yet.
              </p>
              <Link href="/ncert">
                <Button variant="outline">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Classes
                </Button>
              </Link>
            </div>
          )
        )}
        
        {/* Statistics */}
        {subjects.length > 0 && (
          <div className="mt-12 p-6 bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm rounded-lg border border-gray-200 dark:border-gray-700">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
              <div>
                <h3 className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                  {subjects.length}
                </h3>
                <p className="text-gray-600 dark:text-gray-400">Subjects</p>
              </div>
              <div>
                <h3 className="text-2xl font-bold text-green-600 dark:text-green-400">
                  {subjects.reduce((sum, subject) => sum + subject.chapters, 0)}
                </h3>
                <p className="text-gray-600 dark:text-gray-400">Total Chapters</p>
              </div>
              <div>
                <h3 className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                  Class {getClassDisplayName(className)}
                </h3>
                <p className="text-gray-600 dark:text-gray-400">Grade Level</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}