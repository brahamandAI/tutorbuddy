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
  Check, 
  Square, 
  CheckSquare,
  CheckCircle,
  FileText,
  Loader2,
  Copy,
  Save,
  Brain,
  X
} from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

interface ModernPDFViewerProps {
  pdfUrl: string
  title?: string
  className?: string
}

interface PageSummary {
  pages: number[]
  summary: string
  summaryType: 'brief' | 'detailed' | 'key-points'
  timestamp: string
}

export default function ModernPDFViewer({ pdfUrl, title, className = '' }: ModernPDFViewerProps) {
  const [zoom, setZoom] = useState(100)
  const [page, setPage] = useState(1)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [showSummaryPanel, setShowSummaryPanel] = useState(false)
  const [selectedPages, setSelectedPages] = useState<number[]>([])
  const [summaries, setSummaries] = useState<PageSummary[]>([])
  const [isGeneratingSummary, setIsGeneratingSummary] = useState(false)
  const [summaryType, setSummaryType] = useState<'brief' | 'detailed' | 'key-points'>('brief')
  const [estimatedTotalPages, setEstimatedTotalPages] = useState(10) // Default estimate
  
  // Enhanced PDF URL with modern viewer parameters for better UX
  const enhancedPdfUrl = `${pdfUrl}#toolbar=1&navpanes=1&scrollbar=1&page=${page}&zoom=${zoom}&view=FitH`

  const handleZoomIn = () => {
    const newZoom = Math.min(zoom + 25, 200)
    setZoom(newZoom)
  }

  const handleZoomOut = () => {
    const newZoom = Math.max(zoom - 25, 50)
    setZoom(newZoom)
  }

  const handleFullscreen = () => {
    setIsFullscreen(!isFullscreen)
  }

  const handleDownload = () => {
    const link = document.createElement('a')
    link.href = pdfUrl
    link.download = title || 'document.pdf'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const togglePageSelection = (pageNum: number) => {
    setSelectedPages(prev => 
      prev.includes(pageNum) 
        ? prev.filter(p => p !== pageNum)
        : [...prev, pageNum].sort((a, b) => a - b)
    )
  }

  const selectPageRange = (start: number, end: number) => {
    const range = Array.from({ length: end - start + 1 }, (_, i) => start + i)
    setSelectedPages(prev => {
      const combined = [...prev, ...range]
      const newSelection = Array.from(new Set(combined))
      return newSelection.sort((a, b) => a - b)
    })
  }

  const clearSelection = () => {
    setSelectedPages([])
  }

  const generateSummary = async () => {
    if (selectedPages.length === 0) return
    
    setIsGeneratingSummary(true)
    try {
      const response = await fetch('/api/ncert/summarize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          pdfPath: pdfUrl.replace('/pdfs/', 'pdfs/'),
          pages: selectedPages,
          summaryType
        })
      })

      const result = await response.json()
      
      if (result.success) {
        const newSummary: PageSummary = {
          pages: selectedPages,
          summary: result.summary,
          summaryType,
          timestamp: new Date().toISOString()
        }
        setSummaries(prev => [...prev, newSummary])
        clearSelection()
      } else {
        alert(result.error || 'Failed to generate summary')
      }
    } catch (error) {
      console.error('Summary generation error:', error)
      alert('Failed to generate summary. Please try again.')
    } finally {
      setIsGeneratingSummary(false)
    }
  }

  const copySummary = (summary: string) => {
    navigator.clipboard.writeText(summary)
  }

  return (
    <div className={`relative bg-white dark:bg-gray-900 rounded-lg shadow-lg overflow-hidden ${className} ${isFullscreen ? 'fixed inset-0 z-50' : ''}`}>
      {/* Modern Toolbar */}
      <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center space-x-2">
          <h3 className="font-semibold text-gray-800 dark:text-gray-200 truncate">
            {title || 'PDF Document'}
          </h3>
        </div>
        
        <div className="flex items-center space-x-2">
          {/* Page Navigation */}
          <div className="flex items-center space-x-1">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage(Math.max(1, page - 1))}
              disabled={page <= 1}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="text-sm text-gray-600 dark:text-gray-400 min-w-[80px] text-center">
              Page {page}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage(page + 1)}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>

          {/* Zoom Controls */}
          <div className="flex items-center space-x-1">
            <Button
              variant="outline"
              size="sm"
              onClick={handleZoomOut}
              disabled={zoom <= 50}
            >
              <ZoomOut className="h-4 w-4" />
            </Button>
            <span className="text-sm text-gray-600 dark:text-gray-400 min-w-[50px] text-center">
              {zoom}%
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={handleZoomIn}
              disabled={zoom >= 200}
            >
              <ZoomIn className="h-4 w-4" />
            </Button>
          </div>

          {/* AI Summary Button */}
          <Button
            variant={showSummaryPanel ? "default" : "outline"}
            size="sm"
            onClick={() => setShowSummaryPanel(!showSummaryPanel)}
            title="AI Page Summary"
          >
            <Sparkles className="h-4 w-4 mr-1" />
            AI Summary
          </Button>

          {/* Action Buttons */}
          <Button
            variant="outline"
            size="sm"
            onClick={handleFullscreen}
            title={isFullscreen ? "Exit Fullscreen" : "Fullscreen"}
          >
            <Maximize className="h-4 w-4" />
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={handleDownload}
            title="Download PDF"
          >
            <Download className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className={`flex ${isFullscreen ? 'h-[calc(100vh-80px)]' : 'h-[600px]'}`}>
        {/* PDF Viewer */}
        <div className={`relative bg-gray-100 dark:bg-gray-800 ${showSummaryPanel ? 'w-2/3' : 'w-full'} transition-all duration-300`}>
          <iframe
            src={enhancedPdfUrl}
            className="w-full h-full border-0"
            title={title || 'PDF Document'}
            loading="lazy"
          />
        </div>

        {/* AI Summary Panel */}
        {showSummaryPanel && (
          <div className="w-1/3 bg-white dark:bg-gray-900 border-l border-gray-200 dark:border-gray-700 flex flex-col">
            {/* Page Selection Header */}
            <div className="p-4 border-b border-gray-200 dark:border-gray-700">
              <h3 className="font-semibold text-gray-800 dark:text-gray-200 mb-3">
                AI Page Summary
              </h3>
              
              {/* Summary Type Selector */}
              <div className="flex space-x-2 mb-3">
                {(['brief', 'detailed', 'key-points'] as const).map((type) => (
                  <Button
                    key={type}
                    variant={summaryType === type ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSummaryType(type)}
                  >
                    {type === 'key-points' ? 'Key Points' : type.charAt(0).toUpperCase() + type.slice(1)}
                  </Button>
                ))}
              </div>

              {/* Page Selection Grid */}
              <div className="mb-3">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    Select Pages ({selectedPages.length} selected)
                  </span>
                  <div className="flex space-x-1">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => selectPageRange(1, 5)}
                    >
                      1-5
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={clearSelection}
                    >
                      Clear
                    </Button>
                  </div>
                </div>
                
                <div className="grid grid-cols-6 gap-1 max-h-32 overflow-y-auto">
                  {Array.from({ length: estimatedTotalPages }, (_, i) => {
                    const pageNum = i + 1
                    const isSelected = selectedPages.includes(pageNum)
                    return (
                      <button
                        key={pageNum}
                        onClick={() => togglePageSelection(pageNum)}
                        className={`p-1 text-xs border rounded transition-colors ${
                          isSelected 
                            ? 'bg-blue-500 text-white border-blue-600' 
                            : 'bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 border-gray-200 dark:border-gray-600'
                        }`}
                      >
                        {pageNum}
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* Generate Summary Button */}
              <Button
                onClick={generateSummary}
                disabled={selectedPages.length === 0 || isGeneratingSummary}
                className="w-full"
              >
                {isGeneratingSummary ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4 mr-2" />
                    Generate Summary
                  </>
                )}
              </Button>
            </div>

            {/* Summaries Display */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {summaries.length === 0 ? (
                <div className="text-center text-gray-500 dark:text-gray-400 py-8">
                  <FileText className="h-12 w-12 mx-auto mb-2 opacity-50" />
                  <p>No summaries generated yet.</p>
                  <p className="text-sm">Select pages and click "Generate Summary"</p>
                </div>
              ) : (
                summaries.map((summary, index) => (
                  <Card key={index} className="border border-gray-200 dark:border-gray-700">
                    <CardHeader className="pb-2">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-sm">
                          Pages {summary.pages.join(', ')} 
                          <Badge variant="secondary" className="ml-2">
                            {summary.summaryType}
                          </Badge>
                        </CardTitle>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => copySummary(summary.summary)}
                          title="Copy Summary"
                        >
                          <Copy className="h-3 w-3" />
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                        {summary.summary}
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                        {new Date(summary.timestamp).toLocaleString()}
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </div>
        )}
      </div>

      {/* Modern Footer */}
      <div className="flex items-center justify-between px-4 py-2 bg-gray-50 dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 text-sm">
        <div className="flex items-center space-x-4 text-gray-600 dark:text-gray-400">
          <span>🔍 Use mouse wheel to zoom</span>
          <span>📱 Optimized for reading</span>
        </div>
        <div className="text-gray-500 dark:text-gray-500 text-xs">
          Modern PDF Viewer
        </div>
      </div>

      {/* Fullscreen Exit Button */}
      {isFullscreen && (
        <Button
          variant="outline"
          size="sm"
          onClick={() => setIsFullscreen(false)}
          className="absolute top-4 right-4 z-10 bg-white dark:bg-gray-800"
        >
          Exit Fullscreen
        </Button>
      )}
    </div>
  )
}