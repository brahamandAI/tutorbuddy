'use client'

import { useState } from 'react'
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
  X
} from 'lucide-react'
import { Button } from '@/components/ui/Button'

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

export default function ModernPDFViewer({ pdfUrl, title, className = '' }: ModernPDFViewerProps) {
  const [zoom, setZoom] = useState(100)
  const [page, setPage] = useState(1)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [selectedPages, setSelectedPages] = useState<number[]>([])
  const [summary, setSummary] = useState<Summary | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  
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

  const clearSelection = () => {
    setSelectedPages([])
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
          summaryType: 'brief'
        })
      })
      
      if (response.ok) {
        const data = await response.json()
        setSummary({
          pages: selectedPages,
          summary: data.summary,
          timestamp: new Date().toISOString()
        })
      } else {
        console.error('Failed to generate summary')
      }
    } catch (error) {
      console.error('Error generating summary:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className={`w-full ${isFullscreen ? 'fixed inset-0 z-50 bg-gray-900' : ''}`}>
      
      {/* Premium PDF Viewer Section */}
      <div className={`bg-gradient-to-br from-slate-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 rounded-2xl shadow-2xl overflow-hidden ${className} ${isFullscreen ? 'h-full' : ''}`}>
        
        {/* Premium Toolbar with Glassmorphism Effect */}
        <div className="backdrop-blur-md bg-white/80 dark:bg-gray-900/80 border-b border-gray-200/50 dark:border-gray-700/50 px-6 py-4">
          <div className="flex items-center justify-between">
            
            {/* Title Section with AI Badge */}
            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full animate-pulse"></div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
                  {title || 'NCERT Chapter'}
                </h1>
              </div>
              <div className="px-3 py-1 bg-gradient-to-r from-blue-500 to-purple-500 text-white text-xs font-medium rounded-full shadow-lg">
                AI Enhanced
              </div>
            </div>

            {/* Control Center */}
            <div className="flex items-center space-x-4">
              
              {/* Page Navigation with Premium Styling */}
              <div className="flex items-center space-x-2 bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm rounded-xl px-4 py-2 border border-gray-200/50 dark:border-gray-600/50">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setPage(Math.max(1, page - 1))}
                  disabled={page <= 1}
                  className="hover:bg-blue-500/10 transition-all duration-200"
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <div className="text-sm font-medium text-gray-700 dark:text-gray-300 min-w-[80px] text-center">
                  Page {page}
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setPage(page + 1)}
                  className="hover:bg-blue-500/10 transition-all duration-200"
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>

              {/* Zoom Controls */}
              <div className="flex items-center space-x-2 bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm rounded-xl px-4 py-2 border border-gray-200/50 dark:border-gray-600/50">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleZoomOut}
                  disabled={zoom <= 50}
                  className="hover:bg-orange-500/10 transition-all duration-200"
                >
                  <ZoomOut className="h-4 w-4" />
                </Button>
                <div className="text-sm font-medium text-gray-700 dark:text-gray-300 min-w-[50px] text-center">
                  {zoom}%
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleZoomIn}
                  disabled={zoom >= 200}
                  className="hover:bg-orange-500/10 transition-all duration-200"
                >
                  <ZoomIn className="h-4 w-4" />
                </Button>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center space-x-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleFullscreen}
                  className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm border border-gray-200/50 dark:border-gray-600/50 hover:bg-purple-500/10 transition-all duration-200"
                  title={isFullscreen ? "Exit Fullscreen" : "Fullscreen"}
                >
                  <Maximize className="h-4 w-4" />
                </Button>
                
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleDownload}
                  className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm border border-gray-200/50 dark:border-gray-600/50 hover:bg-green-500/10 transition-all duration-200"
                  title="Download PDF"
                >
                  <Download className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Premium PDF Viewer */}
        <div className={`relative ${isFullscreen ? 'h-[calc(100vh-100px)]' : 'h-[70vh] min-h-[500px]'}`}>
          <div className="absolute inset-4 bg-white dark:bg-gray-800 rounded-xl shadow-inner overflow-hidden border border-gray-200/50 dark:border-gray-700/50">
            <iframe
              src={enhancedPdfUrl}
              className="w-full h-full border-0 rounded-xl"
              title={title || 'PDF Document'}
              loading="lazy"
            />
          </div>
          
          {/* Elegant Loading Overlay */}
          <div className="absolute inset-4 bg-gradient-to-br from-blue-50/90 to-purple-50/90 dark:from-gray-800/90 dark:to-gray-900/90 rounded-xl flex items-center justify-center opacity-0 pointer-events-none transition-opacity duration-300">
            <div className="text-center">
              <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-500 rounded-full animate-spin mb-4"></div>
              <p className="text-gray-600 dark:text-gray-400 font-medium">Loading Premium View...</p>
            </div>
          </div>
        </div>

        {/* Premium Status Bar */}
        <div className="backdrop-blur-md bg-white/60 dark:bg-gray-900/60 border-t border-gray-200/50 dark:border-gray-700/50 px-6 py-3">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center space-x-6 text-gray-600 dark:text-gray-400">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span>Interactive Mode</span>
              </div>
              <span>🔍 Mouse wheel: Zoom</span>
              <span>📱 Touch optimized</span>
            </div>
            <div className="text-gray-500 dark:text-gray-500 font-medium">
              Premium PDF Experience
            </div>
          </div>
        </div>
      </div>

      {/* AI Tutor Mode Section - Below PDF Viewer */}
      {!isFullscreen && (
        <div className="mt-8 bg-gradient-to-br from-indigo-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-indigo-900 rounded-2xl shadow-2xl border border-indigo-200/50 dark:border-indigo-800/50 overflow-hidden">
          
          {/* AI Tutor Header */}
          <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                  <Brain className="h-6 w-6 text-white animate-pulse" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-white">AI Tutor Mode</h2>
                  <p className="text-indigo-100 text-sm">Intelligent learning assistance powered by AI</p>
                </div>
              </div>
              
              {/* AI Mode Toggle */}
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2 text-white">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  <span className="text-sm font-medium">AI Active</span>
                </div>
              </div>
            </div>
          </div>

          {/* Page Selection Interface */}
          <div className="p-6 border-b border-indigo-200/50 dark:border-indigo-800/50 bg-white/50 dark:bg-gray-800/50">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4 flex items-center">
              <Sparkles className="h-5 w-5 text-indigo-500 mr-2" />
              Select Pages for AI Summary
            </h3>
            
            {/* Premium Page Selection */}
            <div className="flex flex-wrap gap-2 mb-4">
              {Array.from({ length: 10 }, (_, i) => i + 1).map((pageNum) => (
                <button
                  key={pageNum}
                  onClick={() => togglePageSelection(pageNum)}
                  className={`relative px-4 py-3 rounded-xl font-medium transition-all duration-200 border-2 ${
                    selectedPages.includes(pageNum)
                      ? 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white border-indigo-400 shadow-lg transform scale-105'
                      : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-600 hover:border-indigo-300 hover:shadow-md'
                  }`}
                >
                  {pageNum}
                  {selectedPages.includes(pageNum) && (
                    <div className="absolute -top-1 -right-1 w-5 h-5 bg-green-400 rounded-full flex items-center justify-center">
                      <CheckCircle className="h-3 w-3 text-white" />
                    </div>
                  )}
                </button>
              ))}
            </div>
            
            {/* Action Buttons */}
            <div className="flex items-center space-x-4">
              <Button
                onClick={handleSummarize}
                disabled={selectedPages.length === 0 || isLoading}
                className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white border-0 px-6 py-3 rounded-xl font-medium shadow-lg transition-all duration-200 disabled:opacity-50"
              >
                {isLoading ? (
                  <div className="flex items-center space-x-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>AI Thinking...</span>
                  </div>
                ) : (
                  <div className="flex items-center space-x-2">
                    <Brain className="h-4 w-4" />
                    <span>Generate AI Summary</span>
                  </div>
                )}
              </Button>
              
              <Button
                onClick={clearSelection}
                variant="outline"
                className="border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 px-6 py-3 rounded-xl font-medium transition-all duration-200"
              >
                Clear Selection
              </Button>
              
              {selectedPages.length > 0 && (
                <div className="text-sm text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 px-3 py-2 rounded-lg">
                  {selectedPages.length} page{selectedPages.length > 1 ? 's' : ''} selected
                </div>
              )}
            </div>
          </div>

          {/* AI Summary Display */}
          {summary && (
            <div className="p-6 bg-gradient-to-br from-white via-indigo-50/30 to-purple-50/30 dark:from-gray-800 dark:via-indigo-900/20 dark:to-purple-900/20">
              <div className="flex items-center mb-4">
                <div className="w-8 h-8 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-lg flex items-center justify-center mr-3">
                  <Sparkles className="h-4 w-4 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white">AI Summary</h3>
                <div className="ml-auto text-xs text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">
                  Pages {summary.pages.join(', ')}
                </div>
              </div>
              
              <div className="bg-white/70 dark:bg-gray-700/70 backdrop-blur-sm rounded-xl p-6 border border-indigo-200/50 dark:border-indigo-700/50 shadow-lg">
                <div className="prose prose-gray dark:prose-invert max-w-none">
                  {summary.summary.split('\n').map((paragraph, index) => (
                    <p key={index} className="mb-3 last:mb-0 text-gray-700 dark:text-gray-300 leading-relaxed">
                      {paragraph}
                    </p>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Fullscreen Exit Button */}
      {isFullscreen && (
        <Button
          variant="outline"
          size="sm"
          onClick={() => setIsFullscreen(false)}
          className="fixed top-4 right-4 z-50 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm border border-gray-300 dark:border-gray-600 shadow-lg hover:shadow-xl transition-all duration-200"
        >
          <X className="h-4 w-4 mr-2" />
          Exit Fullscreen
        </Button>
      )}
    </div>
  )
}