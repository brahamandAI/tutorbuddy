'use client'

import React, { useState, useEffect, useCallback, Suspense } from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { ArrowLeft, BookOpen, FileText, Download, Home, Loader2, AlertTriangle, Brain, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import ModernPDFViewer from '@/components/ModernPDFViewer'
import { Badge } from '@/components/ui/badge'

interface ChapterInfo {
  number: number
  title: string
  filename: string
  pdfUrl: string
  description?: string
  totalPages?: number
}

export default function ChapterPage() {
  const params = useParams()
  const className = params.class as string
  const subjectId = params.subject as string
  const chapterNumber = parseInt(params.chapter as string)
  
  const [chapter, setChapter] = useState<ChapterInfo | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [pdfError, setPdfError] = useState<string | null>(null)

  const generateFallbackChapter = useCallback(() => {
    const subjectMap: Record<string, { name: string, folder: string }> = {
      'english': { name: 'English', folder: 'class1english' },
      'hindi': { name: 'Hindi', folder: 'class1hindi' },
      'maths': { name: 'Mathematics', folder: 'class1maths' }
    }

    const subject = subjectMap[subjectId]
    if (subject && className === '1') {
      setChapter({
        number: chapterNumber,
        title: `Chapter ${chapterNumber}`,
        filename: `chapter${chapterNumber}.pdf`,
        pdfUrl: `/pdfs/class${className}/${subject.folder}/chapter${chapterNumber}.pdf`,
        description: `${subject.name} - Chapter ${chapterNumber} learning materials`,
        totalPages: 10 // Default page count, will be updated by PDF viewer
      })
    } else {
      setError('Chapter not found')
    }
  }, [className, subjectId, chapterNumber])

  const loadChapter = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)

      // Fetch chapter information
      const response = await fetch(`/api/ncert/chapter?class=${className}&subject=${subjectId}&chapter=${chapterNumber}`)
      if (!response.ok) {
        throw new Error('Failed to load chapter information')
      }

      const data = await response.json()
      setChapter(data.chapter)
    } catch (err) {
      console.error('Error loading chapter:', err)
      setError('Failed to load chapter information. Using fallback data.')
      
      // Fallback: Generate chapter info
      generateFallbackChapter()
    } finally {
      setLoading(false)
    }
  }, [className, subjectId, chapterNumber, generateFallbackChapter])

  useEffect(() => {
    loadChapter()
  }, [loadChapter])

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
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center min-h-[60vh]">
            <div className="text-center">
              <Loader2 className="h-12 w-12 animate-spin text-blue-500 mx-auto mb-4" />
              <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-300">
                AI is preparing your chapter...
              </h2>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (error && !chapter) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center py-16">
            <AlertTriangle className="h-16 w-16 text-red-400 mx-auto mb-4" />
            <h2 className="text-2xl font-semibold text-gray-600 dark:text-gray-400 mb-2">
              Chapter Not Found
            </h2>
            <p className="text-gray-500 dark:text-gray-500 mb-6">
              The requested chapter could not be loaded.
            </p>
            <div className="space-x-4">
              <Link href={`/ncert/${className}/${subjectId}`}>
                <Button variant="outline">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Chapters
                </Button>
              </Link>
              <Link href="/ncert">
                <Button>
                  <Home className="h-4 w-4 mr-2" />
                  AI Tutor Hub
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link href={`/ncert/${className}/${subjectId}`}>
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Chapters
                </Button>
              </Link>
              
              <div className="flex items-center space-x-3">
                <div className="relative w-10 h-10 bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg flex items-center justify-center text-white shadow-lg">
                  <Brain className="h-5 w-5 relative z-10" />
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg opacity-0 hover:opacity-100 transition-opacity duration-300"></div>
                </div>
                
                <div>
                  <div className="flex items-center space-x-2">
                    <h1 className="text-lg font-semibold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                      {chapter?.title || `Chapter ${chapterNumber}`}
                    </h1>
                    <Sparkles className="h-4 w-4 text-purple-500 animate-pulse" />
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
                    <span>Class {getClassDisplayName(className)}</span>
                    <span>•</span>
                    <span>{getSubjectDisplayName(subjectId)}</span>
                    <Badge variant="secondary" className="text-xs ml-2">
                      Chapter {chapterNumber}
                    </Badge>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              {chapter && (
                <a 
                  href={chapter.pdfUrl} 
                  download={chapter.filename}
                  className="inline-flex"
                >
                  <Button variant="outline" size="sm">
                    <Download className="h-4 w-4 mr-2" />
                    Download PDF
                  </Button>
                </a>
              )}
              
              <nav className="hidden md:block text-sm text-gray-500 dark:text-gray-400">
                <Link href="/ncert" className="hover:text-purple-600">AI Hub</Link>
                <span className="mx-2">/</span>
                <Link href={`/ncert/${className}`} className="hover:text-blue-600">Class {className}</Link>
                <span className="mx-2">/</span>
                <Link href={`/ncert/${className}/${subjectId}`} className="hover:text-blue-600">{getSubjectDisplayName(subjectId)}</Link>
                <span className="mx-2">/</span>
                <span className="text-gray-800 dark:text-white">Chapter {chapterNumber}</span>
              </nav>
            </div>
          </div>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="container mx-auto px-4 py-2">
          <div className="p-3 bg-yellow-50 dark:bg-yellow-900/50 border border-yellow-200 dark:border-yellow-700 rounded text-sm text-yellow-800 dark:text-yellow-200">
            ⚠️ {error}
          </div>
        </div>
      )}

      {/* PDF Viewer */}
      {chapter ? (
        <Suspense 
          fallback={
            <div className="flex items-center justify-center h-96">
              <div className="text-center">
                <Loader2 className="h-8 w-8 animate-spin text-blue-500 mx-auto mb-2" />
                <p className="text-gray-600 dark:text-gray-400">Loading PDF Viewer...</p>
              </div>
            </div>
          }
        >
          <ModernPDFViewer
            pdfUrl={chapter.pdfUrl}
            title={`${getSubjectDisplayName(subjectId)} - ${chapter.title}`}
          />
        </Suspense>
      ) : (
        <div className="container mx-auto px-4 py-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <AlertTriangle className="h-5 w-5 mr-2 text-yellow-500" />
                Unable to Load Chapter
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                The PDF for this chapter could not be loaded. This might be because:
              </p>
              <ul className="list-disc list-inside space-y-2 text-sm text-gray-600 dark:text-gray-400 mb-6">
                <li>The file is not available on the server</li>
                <li>There's a network connectivity issue</li>
                <li>The chapter is still being processed</li>
              </ul>
              <div className="flex space-x-4">
                <Button onClick={loadChapter} variant="outline">
                  <Loader2 className="h-4 w-4 mr-2" />
                  Try Again
                </Button>
                <Link href={`/ncert/${className}/${subjectId}`}>
                  <Button variant="default">
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back to Chapters
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}