'use client'

import React, { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { BookOpen, ArrowLeft, FileText, Eye, Download, Clock, ChevronRight, Loader2, Brain, Sparkles, Bot } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/badge'

interface Chapter {
  number: number
  title: string
  filename: string
  pdfUrl: string
  description?: string
}

export default function SubjectPage() {
  const params = useParams()
  const className = params.class as string
  const subjectId = params.subject as string
  const [chapters, setChapters] = useState<Chapter[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const generateFallbackChapters = useCallback(() => {
    const subjectMap: Record<string, { name: string, count: number, folder: string }> = {
      'english': { name: 'English', count: 9, folder: 'class1english' },
      'hindi': { name: 'Hindi', count: 19, folder: 'class1hindi' },
      'maths': { name: 'Mathematics', count: 13, folder: 'class1maths' }
    }

    const subject = subjectMap[subjectId]
    if (subject && className === '1') {
      const generatedChapters: Chapter[] = []
      for (let i = 1; i <= subject.count; i++) {
        generatedChapters.push({
          number: i,
          title: `Chapter ${i}`,
          filename: `chapter${i}.pdf`,
          pdfUrl: `/pdfs/class${className}/${subject.folder}/chapter${i}.pdf`,
          description: `${subject.name} - Chapter ${i} learning materials`
        })
      }
      setChapters(generatedChapters)
    }
  }, [className, subjectId])

  const loadChapters = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)

      // Fetch available chapters for this class and subject
      const response = await fetch(`/api/ncert/chapters?class=${className}&subject=${subjectId}`)
      if (!response.ok) {
        throw new Error('Failed to load chapters')
      }

      const data = await response.json()
      setChapters(data.chapters || [])
    } catch (err) {
      console.error('Error loading chapters:', err)
      setError('Failed to load chapters. Please try again.')
      
      // Fallback: Generate chapters for known subjects
      generateFallbackChapters()
    } finally {
      setLoading(false)
    }
  }, [className, subjectId, generateFallbackChapters])

  useEffect(() => {
    loadChapters()
  }, [loadChapters])

  const getSubjectDisplayName = (subjectId: string) => {
    const subjectNames: Record<string, string> = {
      'english': 'English',
      'hindi': 'Hindi', 
      'maths': 'Mathematics',
      'science': 'Science',
      'social': 'Social Studies'
    }
    return subjectNames[subjectId] || subjectId.charAt(0).toUpperCase() + subjectId.slice(1)
  }

  const getClassDisplayName = (classNum: string) => {
    const num = parseInt(classNum)
    if (num === 1) return '1st'
    if (num === 2) return '2nd'  
    if (num === 3) return '3rd'
    return `${num}th`
  }

  const getSubjectColor = (subjectId: string) => {
    const colors: Record<string, string> = {
      'english': 'bg-blue-500',
      'hindi': 'bg-orange-500',
      'maths': 'bg-green-500',
      'science': 'bg-purple-500',
      'social': 'bg-red-500'
    }
    return colors[subjectId] || 'bg-gray-500'
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center min-h-[60vh]">
            <div className="text-center">
              <Loader2 className="h-12 w-12 animate-spin text-blue-500 mx-auto mb-4" />
              <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-300">
                Loading Chapters...
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
            <Link href={`/ncert/${className}`}>
              <Button variant="ghost" size="sm" className="mr-4">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Subjects
              </Button>
            </Link>
            
            <nav className="text-sm text-gray-500 dark:text-gray-400">
              <Link href="/ncert" className="hover:text-blue-600">NCERT</Link>
              <span className="mx-2">/</span>
              <Link href={`/ncert/${className}`} className="hover:text-blue-600">Class {className}</Link>
              <span className="mx-2">/</span>
              <span className="text-gray-800 dark:text-white">{getSubjectDisplayName(subjectId)}</span>
            </nav>
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-gray-800 dark:text-white mb-2">
                {getSubjectDisplayName(subjectId)}
              </h1>
              <p className="text-lg text-gray-600 dark:text-gray-400">
                Class {getClassDisplayName(className)} • {chapters.length} Chapters Available
              </p>
            </div>
            
            <div className={`w-16 h-16 ${getSubjectColor(subjectId)} rounded-xl flex items-center justify-center text-white`}>
              <BookOpen className="h-8 w-8" />
            </div>
          </div>
        </div>

        {/* Error State */}
        {error && (
          <div className="mb-8 p-4 bg-red-50 dark:bg-red-900/50 border border-red-200 dark:border-red-700 rounded-lg">
            <p className="text-red-700 dark:text-red-300 text-center">{error}</p>
            <div className="text-center mt-2">
              <Button variant="outline" size="sm" onClick={loadChapters}>
                Try Again
              </Button>
            </div>
          </div>
        )}

        {/* Chapters Grid */}
        {chapters.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {chapters.map((chapter) => (
              <Card 
                key={chapter.number}
                className="group hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-0"
              >
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between mb-2">
                    <Badge variant="secondary" className="text-xs">
                      Chapter {chapter.number}
                    </Badge>
                    <ChevronRight className="h-4 w-4 text-gray-400 group-hover:text-gray-600 transition-colors" />
                  </div>
                  
                  <CardTitle className="text-lg font-semibold text-gray-800 dark:text-white leading-tight">
                    {chapter.title}
                  </CardTitle>
                  
                  {chapter.description && (
                    <CardDescription className="text-sm text-gray-600 dark:text-gray-400">
                      {chapter.description}
                    </CardDescription>
                  )}
                </CardHeader>
                
                <CardContent className="pt-0">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                      <FileText className="h-4 w-4 mr-1" />
                      PDF
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Link href={`/ncert/${className}/${subjectId}/${chapter.number}`}>
                        <Button size="sm" variant="outline">
                          <Eye className="h-4 w-4 mr-1" />
                          View
                        </Button>
                      </Link>
                      
                      <a 
                        href={chapter.pdfUrl} 
                        download={chapter.filename}
                        className="inline-flex"
                      >
                        <Button size="sm" variant="ghost">
                          <Download className="h-4 w-4" />
                        </Button>
                      </a>
                    </div>
                  </div>
                  
                  {/* Quick Preview Link */}
                  <Link 
                    href={`/ncert/${className}/${subjectId}/${chapter.number}`}
                    className="block mt-3"
                  >
                    <div className="w-full h-24 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center group-hover:bg-gray-200 dark:group-hover:bg-gray-600 transition-colors cursor-pointer">
                      <div className="text-center">
                        <FileText className="h-8 w-8 text-gray-400 mx-auto mb-1" />
                        <p className="text-xs text-gray-500 dark:text-gray-400">Click to Read</p>
                      </div>
                    </div>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          !loading && (
            <div className="text-center py-16">
              <BookOpen className="h-16 w-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
              <h2 className="text-2xl font-semibold text-gray-600 dark:text-gray-400 mb-2">
                No Chapters Available
              </h2>
              <p className="text-gray-500 dark:text-gray-500 mb-4">
                Chapters for {getSubjectDisplayName(subjectId)} are not available yet.
              </p>
              <Link href={`/ncert/${className}`}>
                <Button variant="outline">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Subjects
                </Button>
              </Link>
            </div>
          )
        )}
        
        {/* Subject Summary */}
        {chapters.length > 0 && (
          <div className="mt-12 p-6 bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm rounded-lg border border-gray-200 dark:border-gray-700">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-center">
              <div>
                <h3 className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                  {chapters.length}
                </h3>
                <p className="text-gray-600 dark:text-gray-400">Chapters</p>
              </div>
              <div>
                <h3 className="text-2xl font-bold text-green-600 dark:text-green-400">
                  {getSubjectDisplayName(subjectId)}
                </h3>
                <p className="text-gray-600 dark:text-gray-400">Subject</p>
              </div>
              <div>
                <h3 className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                  Class {getClassDisplayName(className)}
                </h3>
                <p className="text-gray-600 dark:text-gray-400">Grade Level</p>
              </div>
              <div>
                <h3 className="text-2xl font-bold text-orange-600 dark:text-orange-400">
                  PDF
                </h3>
                <p className="text-gray-600 dark:text-gray-400">Format</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}