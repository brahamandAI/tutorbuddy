'use client'

import React, { useState, useEffect, useRef } from 'react'
import { 
  ChevronLeft, 
  ChevronRight, 
  ZoomIn, 
  ZoomOut, 
  RotateCcw, 
  Download, 
  BookOpen, 
  Loader2, 
  Sparkles, 
  CheckSquare, 
  Square, 
  Search, 
  Grid, 
  Maximize2, 
  FileText,
  SkipBack,
  SkipForward,
  Eye,
  Monitor,
  RotateCw,
  Minimize2
} from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

interface EnhancedPDFViewerProps {
  pdfUrl: string
  chapterName: string
  totalPages?: number
}

interface PageSummary {
  pageNumber: number
  summary: string
  isLoading: boolean
}

type ViewMode = 'fit-width' | 'fit-page' | 'original' | 'custom'

export default function EnhancedPDFViewer({ pdfUrl, chapterName, totalPages = 10 }: EnhancedPDFViewerProps) {
  const [currentPage, setCurrentPage] = useState<number>(1)
  const [zoom, setZoom] = useState<number>(125) // Default 125% zoom for better readability
  const [viewMode, setViewMode] = useState<ViewMode>('fit-width')
  const [rotation, setRotation] = useState<number>(0)
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [selectedPages, setSelectedPages] = useState<Set<number>>(new Set())
  const [summaries, setSummaries] = useState<Map<number, PageSummary>>(new Map())
  const [isSummarizing, setIsSummarizing] = useState(false)
  const [showSummaryPanel, setShowSummaryPanel] = useState(false)
  const [showThumbnails, setShowThumbnails] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [showSearch, setShowSearch] = useState(false)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [showControls, setShowControls] = useState(true)
  
  const containerRef = useRef<HTMLDivElement>(null)
  const iframeRef = useRef<HTMLIFrameElement>(null)

  // Generate PDF URL with optimal parameters
  const getPDFUrl = () => {
    const params = new URLSearchParams({
      page: currentPage.toString(),
      zoom: getZoomValue(),
      toolbar: '0', // Hide default toolbar
      navpanes: '0', // Hide navigation panes
      scrollbar: '1', // Keep scrollbar
      statusbar: '0', // Hide status bar
      messages: '0', // Hide messages
      printDialog: '0' // Hide print dialog
    })
    
    return `${pdfUrl}#${params.toString()}`
  }

  // Get zoom value based on view mode
  const getZoomValue = () => {
    switch (viewMode) {
      case 'fit-width':
        return 'FitH' // Fit horizontally
      case 'fit-page':
        return 'Fit' // Fit entire page
      case 'original':
        return '100'
      case 'custom':
        return zoom.toString()
      default:
        return zoom.toString()
    }
  }

  // Navigation functions
  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page)
    }
  }

  const goToPreviousPage = () => goToPage(currentPage - 1)
  const goToNextPage = () => goToPage(currentPage + 1)
  const goToFirstPage = () => goToPage(1)
  const goToLastPage = () => goToPage(totalPages)

  // Zoom functions
  const zoomIn = () => {
    setViewMode('custom')
    setZoom(prev => Math.min(prev + 25, 300))
  }
  
  const zoomOut = () => {
    setViewMode('custom')
    setZoom(prev => Math.max(prev - 25, 50))
  }
  
  const resetZoom = () => {
    setViewMode('fit-width')
    setZoom(125)
  }

  // View mode functions
  const setFitWidth = () => setViewMode('fit-width')
  const setFitPage = () => setViewMode('fit-page')
  const setOriginalSize = () => {
    setViewMode('original')
    setZoom(100)
  }

  // Rotation
  const rotateClockwise = () => setRotation(prev => (prev + 90) % 360)
  const rotateCounterClockwise = () => setRotation(prev => (prev - 90 + 360) % 360)

  // Fullscreen
  const toggleFullscreen = () => {
    if (!document.fullscreenElement && containerRef.current) {
      containerRef.current.requestFullscreen()
      setIsFullscreen(true)
      setShowControls(false)
    } else if (document.exitFullscreen) {
      document.exitFullscreen()
      setIsFullscreen(false)
      setShowControls(true)
    }
  }

  // Page selection for summaries
  const togglePageSelection = (page: number) => {
    const newSelected = new Set(selectedPages)
    if (newSelected.has(page)) {
      newSelected.delete(page)
    } else {
      newSelected.add(page)
    }
    setSelectedPages(newSelected)
  }

  // AI Summary function
  const summarizePage = async (page: number) => {
    setIsSummarizing(true)
    setSummaries(prev => new Map(prev.set(page, {
      pageNumber: page,
      summary: '',
      isLoading: true
    })))

    try {
      const response = await fetch('/api/pdf/summarize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          pdfUrl,
          pageNumber: page,
          chapterName
        })
      })

      if (!response.ok) throw new Error('Failed to summarize page')

      const data = await response.json()
      setSummaries(prev => new Map(prev.set(page, {
        pageNumber: page,
        summary: data.summary,
        isLoading: false
      })))
      setShowSummaryPanel(true)
    } catch (error) {
      console.error('Error summarizing page:', error)
      setSummaries(prev => new Map(prev.set(page, {
        pageNumber: page,
        summary: 'AI summary service is currently unavailable. The PDF content is still accessible for reading.',
        isLoading: false
      })))
      setShowSummaryPanel(true)
    } finally {
      setIsSummarizing(false)
    }
  }

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      // Don't interfere with input fields
      if (event.target instanceof HTMLInputElement || event.target instanceof HTMLTextAreaElement) {
        return
      }

      switch (event.key) {
        case 'ArrowLeft':
          event.preventDefault()
          goToPreviousPage()
          break
        case 'ArrowRight':
          event.preventDefault()
          goToNextPage()
          break
        case 'Home':
          event.preventDefault()
          goToFirstPage()
          break
        case 'End':
          event.preventDefault()
          goToLastPage()
          break
        case '=':
        case '+':
          event.preventDefault()
          zoomIn()
          break
        case '-':
          event.preventDefault()
          zoomOut()
          break
        case '0':
          event.preventDefault()
          resetZoom()
          break
        case 'f':
          event.preventDefault()
          setFitWidth()
          break
        case 'p':
          event.preventDefault()
          setFitPage()
          break
        case 'r':
          event.preventDefault()
          rotateClockwise()
          break
        case 'F11':
          event.preventDefault()
          toggleFullscreen()
          break
        case 'Escape':
          if (isFullscreen) {
            setShowControls(true)
          }
          break
        case 'c':
          event.preventDefault()
          setShowControls(!showControls)
          break
      }
    }

    window.addEventListener('keydown', handleKeyPress)
    return () => window.removeEventListener('keydown', handleKeyPress)
  }, [currentPage, totalPages, isFullscreen, showControls])

  // Handle iframe load
  useEffect(() => {
    const handleIframeLoad = () => {
      setIsLoading(false)
    }

    const iframe = iframeRef.current
    if (iframe) {
      iframe.addEventListener('load', handleIframeLoad)
      return () => iframe.removeEventListener('load', handleIframeLoad)
    }
  }, [])

  // Update iframe source when parameters change
  useEffect(() => {
    setIsLoading(true)
  }, [currentPage, zoom, viewMode])

  // Auto-hide controls in fullscreen
  useEffect(() => {
    let timeout: NodeJS.Timeout
    
    if (isFullscreen && showControls) {
      timeout = setTimeout(() => {
        setShowControls(false)
      }, 3000) // Hide after 3 seconds
    }

    return () => {
      if (timeout) clearTimeout(timeout)
    }
  }, [isFullscreen, showControls])

  return (
    <div 
      ref={containerRef}
      className={`flex h-screen bg-gray-50 dark:bg-gray-900 ${isFullscreen ? 'fixed inset-0 z-50' : ''}`}
      onMouseMove={() => isFullscreen && setShowControls(true)}
    >
      {/* Thumbnails Sidebar */}
      {showThumbnails && !isFullscreen && (
        <div className="w-64 border-r bg-white dark:bg-gray-800 overflow-y-auto">
          <div className="p-4">
            <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3 flex items-center">
              <Grid className="h-4 w-4 mr-2" />
              Pages ({totalPages})
            </h3>
            <div className="space-y-2">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                <div
                  key={pageNum}
                  onClick={() => goToPage(pageNum)}
                  className={`relative cursor-pointer border-2 rounded-lg p-2 transition-all hover:border-blue-500 ${
                    currentPage === pageNum 
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' 
                      : 'border-gray-200 dark:border-gray-600'
                  }`}
                >
                  <div className="aspect-[3/4] bg-gray-100 dark:bg-gray-700 rounded flex items-center justify-center">
                    <FileText className="h-8 w-8 text-gray-400" />
                  </div>
                  <div className="text-xs text-center mt-1 font-medium">
                    {pageNum}
                  </div>
                  {selectedPages.has(pageNum) && (
                    <div className="absolute top-1 right-1 w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center">
                      <CheckSquare className="h-3 w-3 text-white" />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className={`flex-1 flex flex-col ${showSummaryPanel && !isFullscreen ? 'w-2/3' : 'w-full'}`}>
        {/* Header Controls */}
        {(!isFullscreen || showControls) && (
          <Card className={`rounded-none border-0 border-b transition-all duration-300 ${isFullscreen && !showControls ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
            <CardHeader className="py-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <BookOpen className="h-5 w-5 text-blue-500" />
                  <div>
                    <CardTitle className="text-lg font-semibold">{chapterName}</CardTitle>
                    <p className="text-sm text-gray-500">
                      Page {currentPage} of {totalPages}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2 flex-wrap">
                  {/* Page Navigation */}
                  <div className="flex items-center space-x-1 border-r pr-2">
                    <Button variant="outline" size="sm" onClick={goToFirstPage} disabled={currentPage === 1}>
                      <SkipBack className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="sm" onClick={goToPreviousPage} disabled={currentPage === 1}>
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <input
                      type="number"
                      min="1"
                      max={totalPages}
                      value={currentPage}
                      onChange={(e) => goToPage(parseInt(e.target.value) || 1)}
                      className="w-16 px-2 py-1 text-sm border rounded text-center"
                    />
                    <Button variant="outline" size="sm" onClick={goToNextPage} disabled={currentPage === totalPages}>
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="sm" onClick={goToLastPage} disabled={currentPage === totalPages}>
                      <SkipForward className="h-4 w-4" />
                    </Button>
                  </div>

                  {/* View Mode Controls */}
                  <div className="flex items-center space-x-1 border-r pr-2">
                    <Button 
                      variant={viewMode === 'fit-width' ? 'default' : 'outline'} 
                      size="sm" 
                      onClick={setFitWidth}
                      title="Fit Width (F)"
                    >
                      <Monitor className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant={viewMode === 'fit-page' ? 'default' : 'outline'} 
                      size="sm" 
                      onClick={setFitPage}
                      title="Fit Page (P)"
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant={viewMode === 'original' ? 'default' : 'outline'} 
                      size="sm" 
                      onClick={setOriginalSize}
                      title="Original Size"
                    >
                      <FileText className="h-4 w-4" />
                    </Button>
                  </div>

                  {/* Zoom Controls */}
                  <div className="flex items-center space-x-1 border-r pr-2">
                    <Button variant="outline" size="sm" onClick={zoomOut} title="Zoom Out (-)">
                      <ZoomOut className="h-4 w-4" />
                    </Button>
                    <span className="text-sm min-w-[3rem] text-center">
                      {viewMode === 'custom' ? `${zoom}%` : viewMode}
                    </span>
                    <Button variant="outline" size="sm" onClick={zoomIn} title="Zoom In (+)">
                      <ZoomIn className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="sm" onClick={resetZoom} title="Reset (0)">
                      <RotateCcw className="h-4 w-4" />
                    </Button>
                  </div>

                  {/* Tools */}
                  <div className="flex items-center space-x-1 border-r pr-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={rotateClockwise}
                      title="Rotate (R)"
                    >
                      <RotateCw className="h-4 w-4" />
                    </Button>
                    {!isFullscreen && (
                      <Button
                        variant={showThumbnails ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setShowThumbnails(!showThumbnails)}
                        title="Thumbnails"
                      >
                        <Grid className="h-4 w-4" />
                      </Button>
                    )}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => summarizePage(currentPage)}
                      disabled={isSummarizing}
                      title="AI Summary"
                    >
                      {isSummarizing ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Sparkles className="h-4 w-4" />
                      )}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={toggleFullscreen}
                      title="Fullscreen (F11)"
                    >
                      {isFullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
                    </Button>
                  </div>

                  {/* Download */}
                  <a href={pdfUrl} download>
                    <Button variant="outline" size="sm" title="Download PDF">
                      <Download className="h-4 w-4" />
                    </Button>
                  </a>
                </div>
              </div>
            </CardHeader>
          </Card>
        )}

        {/* PDF Viewer */}
        <div className="flex-1 overflow-hidden bg-gray-200 dark:bg-gray-800 relative">
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-white/80 dark:bg-gray-900/80 z-10">
              <div className="text-center">
                <Loader2 className="h-12 w-12 animate-spin text-blue-500 mx-auto mb-4" />
                <p className="text-gray-600 dark:text-gray-400">Loading PDF...</p>
              </div>
            </div>
          )}
          
          <iframe
            ref={iframeRef}
            src={getPDFUrl()}
            className="w-full h-full border-0"
            style={{ 
              transform: `rotate(${rotation}deg)`,
              transition: 'transform 0.3s ease'
            }}
            title={`${chapterName} - Page ${currentPage}`}
            onLoad={() => setIsLoading(false)}
          />
        </div>

        {/* Keyboard Shortcuts Help */}
        {(!isFullscreen || showControls) && (
          <div className={`bg-gray-50 dark:bg-gray-800 px-4 py-2 text-xs text-gray-500 dark:text-gray-400 border-t transition-all duration-300 ${isFullscreen && !showControls ? 'opacity-0' : 'opacity-100'}`}>
            <div className="flex items-center justify-between">
              <div>
                Shortcuts: ← → (pages) | + - 0 (zoom) | F (fit width) | P (fit page) | R (rotate) | F11 (fullscreen) | C (toggle controls)
              </div>
              <Badge variant="secondary" className="text-xs">
                Enhanced PDF Viewer v2.0
              </Badge>
            </div>
          </div>
        )}
      </div>

      {/* Summary Panel */}
      {showSummaryPanel && !isFullscreen && (
        <div className="w-1/3 border-l bg-white dark:bg-gray-800 overflow-auto">
          <Card className="rounded-none border-0 h-full">
            <CardHeader className="border-b">
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center">
                  <Sparkles className="h-5 w-5 mr-2 text-purple-500" />
                  AI Summaries
                </CardTitle>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => setShowSummaryPanel(false)}
                >
                  ×
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-4 space-y-4">
              {Array.from(summaries.entries())
                .sort(([a], [b]) => a - b)
                .map(([pageNum, summary]) => (
                <div key={pageNum} className="border rounded-lg p-3">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium text-sm">
                      Page {pageNum}
                    </h4>
                    {summary.isLoading && (
                      <Loader2 className="h-4 w-4 animate-spin text-blue-500" />
                    )}
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 whitespace-pre-wrap">
                    {summary.summary || 'Generating summary...'}
                  </p>
                </div>
              ))}
              
              {summaries.size === 0 && (
                <div className="text-center text-gray-500 py-8">
                  <Sparkles className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p>No summaries yet. Click the sparkle icon to generate AI summaries!</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}