'use client'

import { useState, useEffect } from 'react'
import {
  ChevronLeft,
  ChevronRight,
  ZoomIn,
  ZoomOut,
  Download,
  Maximize,
  Sparkles,
  CheckCircle,
  Loader2,
  Brain,
  X,
  MessageCircle,
  Lightbulb,
  FileText,
  Zap,
} from 'lucide-react'
import { Button } from '@/components/ui/Button'
import InteractiveAITutor from './InteractiveAITutor'
import InteractiveLearningHub from './InteractiveLearningHub'
import { motion, AnimatePresence } from 'framer-motion'

interface ModernPDFViewerProps {
  pdfUrl: string
  title?: string
  className?: string
}

interface Summary {
  pages: number[]
  summary: string
  timestamp: string
}

/**
 * ModernPDFViewer
 *
 * Clean, single-source implementation of the original component.
 * Preserves all behaviour:
 *  - zooming
 *  - page navigation
 *  - fullscreen toggle
 *  - download
 *  - page selection for AI summarization
 *  - calling POST /api/ncert/summarize
 *  - rendering InteractiveAITutor
 *
 * Removed duplicated JSX blocks and consolidated UI into one responsive layout.
 */
export default function ModernPDFViewer({
  pdfUrl,
  title,
  className = '',
}: ModernPDFViewerProps) {
  const [zoom, setZoom] = useState<number>(100)
  const [page, setPage] = useState<number>(1)
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false)
  const [selectedPages, setSelectedPages] = useState<number[]>([])
  const [summary, setSummary] = useState<Summary | null>(null)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [totalPages, setTotalPages] = useState<number>(10) // Default fallback
  const [isLoadingPages, setIsLoadingPages] = useState<boolean>(true)
  const [activeTab, setActiveTab] = useState<'summary' | 'chat' | 'learning'>('summary')

  // Detect total pages from PDF using PDF.js
  useEffect(() => {
    const detectPDFPages = async () => {
      setIsLoadingPages(true)
      try {
        // Method 1: Use PDF.js to load and get page count (most accurate)
        // Dynamic import to avoid SSR issues
        const pdfjsLib = await import('pdfjs-dist')
        
        // Configure worker
        pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`
        
        const loadingTask = pdfjsLib.getDocument(pdfUrl)
        const pdf = await loadingTask.promise
        const pageCount = pdf.numPages
        
        if (pageCount && pageCount > 0) {
          console.log(`PDF loaded successfully: ${pageCount} pages`)
          setTotalPages(pageCount)
          setIsLoadingPages(false)
          return
        }
      } catch (error) {
        console.log('PDF.js loading failed, trying API fallback:', error)
        
        // Method 2: Try to get page count from API
        try {
          const response = await fetch('/api/pdf/metadata', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ pdfPath: pdfUrl }),
          })

          if (response.ok) {
            const data = await response.json()
            if (data.pageCount && data.pageCount > 0) {
              console.log(`PDF metadata from API: ${data.pageCount} pages`)
              setTotalPages(data.pageCount)
              setIsLoadingPages(false)
              return
            }
          }
        } catch (apiError) {
          console.log('API metadata fetch failed:', apiError)
        }
      }

      // Method 3: Fallback - Use intelligent defaults based on URL pattern
      console.log('Using fallback page count detection')
      const urlLower = pdfUrl.toLowerCase()
      
      if (urlLower.includes('class1') && !urlLower.includes('class10') && !urlLower.includes('class11') && !urlLower.includes('class12')) {
        setTotalPages(20) // Primary classes (1-5)
      } else if (urlLower.includes('class') && (urlLower.includes('6') || urlLower.includes('7') || urlLower.includes('8'))) {
        setTotalPages(30) // Middle classes
      } else if (urlLower.includes('class') && (urlLower.includes('9') || urlLower.includes('10'))) {
        setTotalPages(40) // Secondary classes
      } else if (urlLower.includes('class') && (urlLower.includes('11') || urlLower.includes('12'))) {
        setTotalPages(50) // Senior classes
      } else {
        setTotalPages(30) // General default
      }
      
      setIsLoadingPages(false)
    }

    if (pdfUrl) {
      detectPDFPages()
    }
  }, [pdfUrl])

  const enhancedPdfUrl = `${pdfUrl}#toolbar=1&navpanes=1&scrollbar=1&page=${page}&zoom=${zoom}&view=FitH`

  const handleZoomIn = () => setZoom((z) => Math.min(z + 25, 200))
  const handleZoomOut = () => setZoom((z) => Math.max(z - 25, 50))
  const handleFullscreen = () => setIsFullscreen((f) => !f)

  const handleDownload = () => {
    const link = document.createElement('a')
    link.href = pdfUrl
    link.download = title || 'document.pdf'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const togglePageSelection = (pageNum: number) => {
    setSelectedPages((prev) =>
      prev.includes(pageNum) ? prev.filter((p) => p !== pageNum) : [...prev, pageNum].sort((a, b) => a - b)
    )
  }

  const clearSelection = () => {
    setSelectedPages([])
    setSummary(null)
    setActiveTab('summary') // Reset to summary tab
  }

  const handleSummarize = async () => {
    if (selectedPages.length === 0) return

    setIsLoading(true)
    try {
      const response = await fetch('/api/ncert/summarize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          pdfPath: pdfUrl,
          pages: selectedPages,
        }),
      })

      if (response.ok) {
        const data = await response.json()
        setSummary({
          pages: selectedPages,
          summary: data.summary,
          timestamp: new Date().toISOString(),
        })
        setActiveTab('summary') // Always show summary tab first when new summary is generated
      } else {
        console.error('Failed to generate summary')
      }
    } catch (error) {
      console.error('Error generating summary:', error)
    } finally {
      setIsLoading(false)
    }
  }

  // Generate page numbers array based on detected total pages
  const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1)

  return (
    <div className={`w-full ${isFullscreen ? 'fixed inset-0 z-50 bg-gray-900' : ''}`}>
      <div
        className={`bg-gradient-to-br from-slate-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 rounded-2xl shadow-lg p-4 md:p-6 overflow-hidden ${className} ${
          isFullscreen ? 'h-full' : ''
        }`}
      >
        {/* Toolbar */}
        <div className="backdrop-blur-md bg-white/80 dark:bg-gray-800/60 border-b border-gray-200/50 dark:border-gray-700/50 px-4 py-3 rounded-xl mb-4">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full animate-pulse" />
                <div>
                  <div className="text-sm font-semibold text-gray-700 dark:text-white">{title || 'PDF Document'}</div>
                  <div className="text-xs text-gray-500 dark:text-gray-300">AI Enhanced</div>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              {/* Page navigation */}
              <div className="flex items-center space-x-2 rounded-lg px-2 py-1 border border-gray-200/50 dark:border-gray-600/50">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page <= 1}
                  className="hover:bg-blue-500/10 transition-all duration-150"
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <div className="px-3 py-1 text-sm font-medium">{page}</div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setPage((p) => p + 1)}
                  className="hover:bg-blue-500/10 transition-all duration-150"
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>

              {/* Zoom controls */}
              <div className="flex items-center space-x-2 rounded-lg px-2 py-1 border border-gray-200/50 dark:border-gray-600/50">
                <Button variant="ghost" size="sm" onClick={handleZoomOut}>
                  <ZoomOut className="h-4 w-4" />
                </Button>
                <div className="text-sm font-medium">{zoom}%</div>
                <Button variant="ghost" size="sm" onClick={handleZoomIn}>
                  <ZoomIn className="h-4 w-4" />
                </Button>
              </div>

              {/* Actions */}
              <div className="flex items-center space-x-2">
                <Button variant="ghost" size="sm" onClick={handleDownload} className="flex items-center">
                  <Download className="h-4 w-4 mr-2" />
                  Download
                </Button>

                <Button variant="ghost" size="sm" onClick={handleFullscreen} className="flex items-center">
                  <Maximize className="h-4 w-4 mr-2" />
                  {isFullscreen ? 'Fullscreen' : 'Fullscreen'}
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Viewer */}
        <div className={`relative ${isFullscreen ? 'h-[calc(100vh-140px)]' : 'h-[70vh] min-h-[420px]'}`}>
          <div className="absolute inset-4 bg-white dark:bg-gray-900/60 rounded-xl overflow-hidden border border-gray-200/50 dark:border-gray-700/50">
            <iframe src={enhancedPdfUrl} className="w-full h-full border-0 rounded-xl" title={title || 'PDF Document'} loading="lazy" />
          </div>

          {/* Overlay loader (subtle) */}
          <div
            className={`absolute inset-4 rounded-xl pointer-events-none transition-opacity duration-300 ${
              isLoading ? 'opacity-80 bg-black/30' : 'opacity-0'
            }`}
          >
            {isLoading && (
              <div className="flex items-center justify-center h-full">
                <div className="flex flex-col items-center text-white">
                  <Loader2 className="h-10 w-10 animate-spin mb-4" />
                  <div>Generating AI summary — please wait...</div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Status Bar */}
        <div className="mt-4 flex items-center justify-between text-sm text-gray-600 dark:text-gray-300">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
              <span>AI Active</span>
            </div>
            <div>📱 Touch optimized</div>
            <div>Premium PDF Experience</div>
          </div>

          <div className="flex items-center space-x-3">
            <div className="text-xs text-gray-500">Pages: {totalPages}</div>
            <div className="text-xs text-gray-500">Zoom: {zoom}%</div>
          </div>
        </div>

        {/* AI Tutor / Page Selection */}
        <div className="mt-6 bg-white/60 dark:bg-gray-800/60 rounded-xl border border-gray-200/50 dark:border-gray-700/50 p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-lg font-semibold flex items-center">
              <Sparkles className="h-5 w-5 text-indigo-500 mr-2" />
              Select Pages for AI Summary
            </h3>

            <div className="flex items-center space-x-2">
              {isLoadingPages ? (
                <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-300 bg-gray-200 dark:bg-gray-700 px-3 py-1 rounded-md">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span className="text-sm">Detecting pages...</span>
                </div>
              ) : (
                <div className="flex items-center space-x-2 text-white bg-indigo-600 px-3 py-1 rounded-md">
                  <Brain className="h-4 w-4" />
                  <span className="text-sm">AI Tutor Mode • {totalPages} pages</span>
                </div>
              )}
            </div>
          </div>

          {isLoadingPages ? (
            <div className="flex items-center justify-center py-8">
              <div className="text-center">
                <Loader2 className="h-8 w-8 animate-spin text-indigo-500 mx-auto mb-2" />
                <p className="text-sm text-gray-600 dark:text-gray-300">Loading PDF page information...</p>
              </div>
            </div>
          ) : (
            <>
              <div className="flex flex-wrap gap-2 mb-4">
            {pageNumbers.map((pageNum) => {
              const selected = selectedPages.includes(pageNum)
              return (
                <button
                  key={pageNum}
                  onClick={() => togglePageSelection(pageNum)}
                  aria-pressed={selected}
                  className={`relative px-4 py-2 rounded-xl font-medium transition-all duration-150 border-2 ${
                    selected
                      ? 'bg-indigo-600 text-white border-indigo-500 shadow-lg'
                      : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 border-gray-200/50 dark:border-gray-600 hover:border-indigo-300 hover:shadow-sm'
                  }`}
                >
                  {pageNum}
                  {selected && (
                    <div className="absolute -top-2 -right-2 w-5 h-5 bg-green-400 rounded-full flex items-center justify-center">
                      <CheckCircle className="h-3 w-3 text-white" />
                    </div>
                  )}
                </button>
              )
            })}
          </div>

          <div className="flex items-center space-x-3">
            <Button onClick={handleSummarize} className="px-6 py-3 rounded-xl font-medium" disabled={isLoading || selectedPages.length === 0}>
              {isLoading ? (
                <div className="flex items-center">
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  <span>Generating...</span>
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <Brain className="h-4 w-4" />
                  <span>Generate AI Summary</span>
                </div>
              )}
            </Button>

            <Button onClick={clearSelection} variant="outline" className="px-6 py-3 rounded-xl font-medium">
              Clear Selection
            </Button>
          </div>
            </>
          )}

        </div>

        {/* AI Dashboard - Tabbed Interface */}
        {summary && (
          <div className="mt-6 bg-gradient-to-br from-slate-50/80 to-gray-100/80 dark:from-gray-800/80 dark:to-gray-900/80 backdrop-blur-xl rounded-2xl border border-gray-200/50 dark:border-gray-700/50 shadow-2xl overflow-hidden">
            {/* Tab Navigation */}
            <div className="relative">
              {/* Background gradient bar */}
              <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/5 via-purple-500/5 to-pink-500/5" />
              
              <div className="relative flex items-center justify-between border-b border-gray-200/50 dark:border-gray-700/50 bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm px-6 py-4">
                <div className="flex items-center space-x-2">
                  <div className="flex items-center space-x-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-3 py-1.5 rounded-lg shadow-lg">
                    <Sparkles className="h-4 w-4" />
                    <span className="text-sm font-semibold">AI Workspace</span>
                  </div>
                  <div className="hidden md:flex items-center space-x-2 text-xs text-gray-500 dark:text-gray-400">
                    <span>•</span>
                    <span>Pages: {summary.pages.join(', ')}</span>
                    <span>•</span>
                    <CheckCircle className="h-3 w-3 text-green-500" />
                    <span>Ready</span>
                  </div>
                </div>
                
                {/* Tab Buttons */}
                <div className="flex items-center space-x-1 bg-gray-100 dark:bg-gray-700/50 p-1 rounded-xl">
                  <button
                    onClick={() => setActiveTab('summary')}
                    className={`relative px-4 py-2 rounded-lg font-medium text-sm transition-all duration-300 ${
                      activeTab === 'summary'
                        ? 'bg-white dark:bg-gray-800 text-indigo-600 dark:text-indigo-400 shadow-md'
                        : 'text-gray-600 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400'
                    }`}
                  >
                    <div className="flex items-center space-x-2">
                      <FileText className="h-4 w-4" />
                      <span>Summary</span>
                    </div>
                    {activeTab === 'summary' && (
                      <motion.div
                        layoutId="activeTab"
                        className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-indigo-500 to-purple-500"
                        initial={false}
                        transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                      />
                    )}
                  </button>
                  
                  <button
                    onClick={() => setActiveTab('chat')}
                    className={`relative px-4 py-2 rounded-lg font-medium text-sm transition-all duration-300 ${
                      activeTab === 'chat'
                        ? 'bg-white dark:bg-gray-800 text-purple-600 dark:text-purple-400 shadow-md'
                        : 'text-gray-600 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400'
                    }`}
                  >
                    <div className="flex items-center space-x-2">
                      <MessageCircle className="h-4 w-4" />
                      <span>Follow-up Chat</span>
                    </div>
                    {activeTab === 'chat' && (
                      <motion.div
                        layoutId="activeTab"
                        className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-purple-500 to-pink-500"
                        initial={false}
                        transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                      />
                    )}
                  </button>
                  
                  <button
                    onClick={() => setActiveTab('learning')}
                    className={`relative px-4 py-2 rounded-lg font-medium text-sm transition-all duration-300 ${
                      activeTab === 'learning'
                        ? 'bg-white dark:bg-gray-800 text-pink-600 dark:text-pink-400 shadow-md'
                        : 'text-gray-600 dark:text-gray-400 hover:text-pink-600 dark:hover:text-pink-400'
                    }`}
                  >
                    <div className="flex items-center space-x-2">
                      <Zap className="h-4 w-4" />
                      <span>Interactive Learning</span>
                    </div>
                    {activeTab === 'learning' && (
                      <motion.div
                        layoutId="activeTab"
                        className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-pink-500 to-rose-500"
                        initial={false}
                        transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                      />
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* Tab Content with Animations */}
            <div className="relative min-h-[400px]">
              <AnimatePresence mode="wait">
                {activeTab === 'summary' && (
                  <motion.div
                    key="summary"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ duration: 0.3, ease: 'easeInOut' }}
                    className="p-6"
                  >
                    <div className="bg-gradient-to-br from-blue-50/80 to-indigo-100/80 dark:from-gray-800/50 dark:to-indigo-900/30 backdrop-blur-sm rounded-xl p-6 border border-blue-200/30 dark:border-indigo-700/30">
                      <div className="flex items-center space-x-3 mb-4">
                        <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full flex items-center justify-center shadow-lg">
                          <FileText className="h-5 w-5 text-white" />
                        </div>
                        <div>
                          <h3 className="text-lg font-bold text-gray-800 dark:text-white">
                            AI-Generated Summary
                          </h3>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            Generated: {new Date(summary.timestamp).toLocaleString()}
                          </p>
                        </div>
                      </div>
                      <div className="bg-white/70 dark:bg-gray-700/50 rounded-lg p-5 border border-blue-200/30 dark:border-indigo-600/30">
                        <p className="text-gray-800 dark:text-gray-200 leading-relaxed whitespace-pre-wrap">
                          {summary.summary}
                        </p>
                      </div>
                      
                      {/* Quick tips */}
                      <div className="mt-4 flex items-center space-x-2 text-xs text-gray-600 dark:text-gray-400">
                        <Lightbulb className="h-3 w-3 text-yellow-500" />
                        <span>💡 Switch to <strong>Follow-up Chat</strong> to ask questions or <strong>Interactive Learning</strong> for practice exercises</span>
                      </div>
                    </div>
                  </motion.div>
                )}

                {activeTab === 'chat' && (
                  <motion.div
                    key="chat"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ duration: 0.3, ease: 'easeInOut' }}
                    className="p-6"
                  >
                    <InteractiveAITutor 
                      summary={summary}
                      subject={title?.toLowerCase().includes('math') ? 'mathematics' : 
                               title?.toLowerCase().includes('english') ? 'english' : 'general'}
                      chapterTitle={title}
                      pdfPath={pdfUrl}
                    />
                  </motion.div>
                )}

                {activeTab === 'learning' && (
                  <motion.div
                    key="learning"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ duration: 0.3, ease: 'easeInOut' }}
                    className="p-6"
                  >
                    <InteractiveLearningHub
                      summary={summary}
                      subject={title?.toLowerCase().includes('math') ? 'mathematics' : 
                               title?.toLowerCase().includes('english') ? 'english' : 
                               title?.toLowerCase().includes('science') ? 'science' : 'general'}
                      pdfPath={pdfUrl}
                    />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        )}
      </div>

      {/* Fullscreen Exit Button */}
      {isFullscreen && (
        <Button variant="outline" size="sm" onClick={() => setIsFullscreen(false)} className="fixed top-4 right-4 z-50 bg-white/90 dark:bg-gray-800/90 border border-gray-200/50 dark:border-gray-600 shadow-lg hover:shadow-xl transition-all duration-200">
          <X className="h-4 w-4 mr-2" />
          Exit Fullscreen
        </Button>
      )}
    </div>
  )
}
