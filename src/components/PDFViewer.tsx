'use client'

import React, { useState, useRef, useEffect } from 'react'
import { ChevronLeft, ChevronRight, ZoomIn, ZoomOut, RotateCcw, Download, BookOpen, Loader2, Sparkles, CheckSquare, Square, Search, Grid, Maximize2, Menu, FileText } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface PDFViewerProps {
  pdfUrl: string
  chapterName: string
  totalPages?: number
}

interface PageSummary {
  pageNumber: number
  summary: string
  isLoading: boolean
}

export default function PDFViewer({ pdfUrl, chapterName, totalPages = 10 }: PDFViewerProps) {
  const [currentPage, setCurrentPage] = useState(1)
  const [zoom, setZoom] = useState(1)
  const [isLoading, setIsLoading] = useState(false)
  const [selectedPages, setSelectedPages] = useState<Set<number>>(new Set())
  const [summaries, setSummaries] = useState<Map<number, PageSummary>>(new Map())
  const [isSummarizing, setIsSummarizing] = useState(false)
  const [showSummaryPanel, setShowSummaryPanel] = useState(false)
  const [showThumbnails, setShowThumbnails] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [showSearch, setShowSearch] = useState(false)
  
  const containerRef = useRef<HTMLDivElement>(null)

  // Get the PDF URL for a specific page
  const getPageUrl = (pageNumber: number) => {
    return `${pdfUrl}#page=${pageNumber}`
  }

  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page)
    }
  }

  const handleZoomIn = () => {
    setZoom(prev => Math.min(prev + 0.25, 3))
  }

  const handleZoomOut = () => {
    setZoom(prev => Math.max(prev - 0.25, 0.5))
  }

  const handleResetZoom = () => {
    setZoom(1)
  }

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen()
      setIsFullscreen(true)
    } else {
      document.exitFullscreen()
      setIsFullscreen(false)
    }
  }

  const handleSearch = (term: string) => {
    setSearchTerm(term)
    // In a real implementation, you would search through the PDF content
    console.log('Searching for:', term)
  }

  const togglePageSelection = (pageNumber: number) => {
    const newSelected = new Set(selectedPages)
    if (newSelected.has(pageNumber)) {
      newSelected.delete(pageNumber)
    } else {
      newSelected.add(pageNumber)
    }
    setSelectedPages(newSelected)
  }

  const summarizePage = async (pageNumber: number) => {
    setIsSummarizing(true)
    
    // Add loading state for this page
    setSummaries(prev => new Map(prev.set(pageNumber, {
      pageNumber,
      summary: '',
      isLoading: true
    })))

    try {
      const response = await fetch('/api/pdf/summarize', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          pdfUrl,
          pageNumber,
          chapterName
        })
      })

      if (!response.ok) {
        throw new Error('Failed to summarize page')
      }

      const data = await response.json()
      
      setSummaries(prev => new Map(prev.set(pageNumber, {
        pageNumber,
        summary: data.summary,
        isLoading: false
      })))
      
      setShowSummaryPanel(true)
    } catch (error) {
      console.error('Error summarizing page:', error)
      setSummaries(prev => new Map(prev.set(pageNumber, {
        pageNumber,
        summary: 'Failed to generate summary. Please try again.',
        isLoading: false
      })))
    } finally {
      setIsSummarizing(false)
    }
  }

  const summarizeSelectedPages = async () => {
    if (selectedPages.size === 0) return

    setIsSummarizing(true)
    
    try {
      const response = await fetch('/api/pdf/summarize-multiple', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          pdfUrl,
          pageNumbers: Array.from(selectedPages),
          chapterName
        })
      })

      if (!response.ok) {
        throw new Error('Failed to summarize pages')
      }

      const data = await response.json()
      
      // Add the combined summary
      const combinedPageNumber = Math.min(...Array.from(selectedPages))
      setSummaries(prev => new Map(prev.set(-1, {
        pageNumber: -1,
        summary: `Combined Summary (Pages ${Array.from(selectedPages).sort((a, b) => a - b).join(', ')}):\\n\\n${data.summary}`,
        isLoading: false
      })))
      
      setShowSummaryPanel(true)
      setSelectedPages(new Set())
    } catch (error) {
      console.error('Error summarizing pages:', error)
    } finally {
      setIsSummarizing(false)
    }
  }

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
      {/* Main PDF Viewer */}
      <div className={`flex-1 flex flex-col ${showSummaryPanel ? 'w-2/3' : 'w-full'}`}>
        {/* Controls Header */}
        <Card className="rounded-none border-0 border-b">
          <CardHeader className="py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <BookOpen className="h-5 w-5 text-blue-500" />
                <div>
                  <CardTitle className="text-lg font-semibold">{chapterName}</CardTitle>
                  <p className="text-sm text-gray-500">Page {currentPage} of {totalPages}</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                {/* Page Selection Toggle */}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => togglePageSelection(currentPage)}
                  className={selectedPages.has(currentPage) ? 'bg-blue-100 text-blue-700' : ''}
                >
                  {selectedPages.has(currentPage) ? (
                    <CheckSquare className="h-4 w-4" />
                  ) : (
                    <Square className="h-4 w-4" />
                  )}
                </Button>

                {/* Summarize Current Page */}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => summarizePage(currentPage)}
                  disabled={isSummarizing}
                >
                  {isSummarizing ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Sparkles className="h-4 w-4" />
                  )}
                  Summarize Page
                </Button>

                {/* Summarize Selected Pages */}
                {selectedPages.size > 0 && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={summarizeSelectedPages}
                    disabled={isSummarizing}
                    className="bg-blue-50 text-blue-600"
                  >
                    {isSummarizing ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Sparkles className="h-4 w-4" />
                    )}
                    Summarize {selectedPages.size} Pages
                  </Button>
                )}

                {/* Zoom Controls */}
                <div className="flex items-center space-x-1 border-l pl-2">
                  <Button variant="outline" size="sm" onClick={handleZoomOut}>
                    <ZoomOut className="h-4 w-4" />
                  </Button>
                  <span className="text-sm min-w-[3rem] text-center">
                    {Math.round(zoom * 100)}%
                  </span>
                  <Button variant="outline" size="sm" onClick={handleZoomIn}>
                    <ZoomIn className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="sm" onClick={handleResetZoom}>
                    <RotateCcw className="h-4 w-4" />
                  </Button>
                </div>

                {/* Search Toggle */}
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => setShowSearch(!showSearch)}
                  className={showSearch ? 'bg-blue-100 text-blue-700' : ''}
                >
                  <Search className="h-4 w-4" />
                </Button>

                {/* Thumbnail Toggle */}
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => setShowThumbnails(!showThumbnails)}
                  className={showThumbnails ? 'bg-blue-100 text-blue-700' : ''}
                >
                  <Grid className="h-4 w-4" />
                </Button>

                {/* Fullscreen Toggle */}
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={toggleFullscreen}
                >
                  <Maximize2 className="h-4 w-4" />
                </Button>

                {/* Download */}
                <a href={pdfUrl} download>
                  <Button variant="outline" size="sm">
                    <Download className="h-4 w-4" />
                  </Button>
                </a>
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Search Bar */}
        {showSearch && (
          <Card className="rounded-none border-0 border-b">
            <CardContent className="py-3">
              <div className="flex items-center space-x-4">
                <Search className="h-4 w-4 text-gray-500" />
                <input
                  type="text"
                  placeholder="Search in document..."
                  value={searchTerm}
                  onChange={(e) => handleSearch(e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                {searchTerm && (
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => setSearchTerm('')}
                  >
                    Clear
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* PDF Display Area with Thumbnails */}
        <div className="flex flex-1 overflow-hidden">
          {/* Thumbnails Sidebar */}
          {showThumbnails && (
            <div className="w-48 border-r bg-white dark:bg-gray-800 overflow-y-auto">
              <div className="p-4">
                <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3 flex items-center">
                  <Grid className="h-4 w-4 mr-2" />
                  Thumbnails
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
                      <div className="aspect-[3/4] bg-gray-100 dark:bg-gray-700 rounded flex items-center justify-center text-xs text-gray-500">
                        <FileText className="h-8 w-8" />
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

          {/* Main PDF Viewer */}
          <div className="flex-1 overflow-auto bg-gray-100 dark:bg-gray-800" ref={containerRef}>
            <div className="flex justify-center py-8">
              <div 
                className="bg-white shadow-lg"
                style={{ 
                  transform: `scale(${zoom})`,
                  transformOrigin: 'top center',
                  minHeight: '842px', // A4 height
                  width: '595px' // A4 width
                }}
              >
                {isLoading ? (
                  <div className="flex items-center justify-center h-full">
                    <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
                  </div>
                ) : (
                  <iframe
                    src={getPageUrl(currentPage)}
                    className="w-full h-full border-0"
                    style={{ minHeight: '842px' }}
                    title={`${chapterName} - Page ${currentPage}`}
                  />
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Footer */}
        <Card className="rounded-none border-0 border-t">
          <CardContent className="py-4">
            <div className="flex items-center justify-between">
              <Button 
                variant="outline"
                onClick={() => goToPage(currentPage - 1)}
                disabled={currentPage === 1}
              >
                <ChevronLeft className="h-4 w-4 mr-2" />
                Previous
              </Button>

              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-500">Go to page:</span>
                <input
                  type="number"
                  min="1"
                  max={totalPages}
                  value={currentPage}
                  onChange={(e) => goToPage(parseInt(e.target.value) || 1)}
                  className="w-16 px-2 py-1 text-sm border rounded"
                />
                <span className="text-sm text-gray-500">of {totalPages}</span>
              </div>

              <Button 
                variant="outline"
                onClick={() => goToPage(currentPage + 1)}
                disabled={currentPage === totalPages}
              >
                Next
                <ChevronRight className="h-4 w-4 ml-2" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Summary Panel */}
      {showSummaryPanel && (
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
                      {pageNum === -1 ? 'Combined Summary' : `Page ${pageNum}`}
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
                  <p>No summaries yet. Click "Summarize Page" to get started!</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}