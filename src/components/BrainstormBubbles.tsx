'use client'

import { useState } from 'react'
import { 
  DollarSign, 
  Globe, 
  BookOpen, 
  MapPin,
  X,
  FileText,
  Eye,
  Loader2
} from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Card, CardContent } from '@/components/ui/card'
import { Modal } from '@/components/ui/Modal'

interface PDFResource {
  name: string
  path: string
  displayName: string
}

interface Category {
  id: string
  name: string
  icon: React.ReactNode
  color: string
  gradient: string
  pdfs: PDFResource[]
}

const categories: Category[] = [
  {
    id: 'economy',
    name: 'Economy',
    icon: <DollarSign className="h-8 w-8" />,
    color: 'text-green-600',
    gradient: 'from-green-500 to-emerald-600',
    pdfs: [
      { name: 'economy part1.pdf', path: '/footer/pdfs/economy/economy part1.pdf', displayName: 'Economy Part 1' },
      { name: 'economy part2.pdf', path: '/footer/pdfs/economy/economy part2.pdf', displayName: 'Economy Part 2' },
      { name: 'economy part3.pdf', path: '/footer/pdfs/economy/economy part3.pdf', displayName: 'Economy Part 3' },
    ]
  },
  {
    id: 'geo',
    name: 'Geography',
    icon: <Globe className="h-8 w-8" />,
    color: 'text-blue-600',
    gradient: 'from-blue-500 to-cyan-600',
    pdfs: [
      { name: 'PART-3-indian-geography.pdf', path: '/footer/pdfs/geo/PART-3-indian-geography.pdf', displayName: 'Indian Geography Part 3' },
      { name: 'part1-Indian-geography .pdf', path: '/footer/pdfs/geo/part1-Indian-geography .pdf', displayName: 'Indian Geography Part 1' },
      { name: 'part2-indian-geography.pdf', path: '/footer/pdfs/geo/part2-indian-geography.pdf', displayName: 'Indian Geography Part 2' },
      { name: 'Physical-geography.pdf', path: '/footer/pdfs/geo/Physical-geography.pdf', displayName: 'Physical Geography' },
    ]
  },
  {
    id: 'history',
    name: 'History',
    icon: <BookOpen className="h-8 w-8" />,
    color: 'text-purple-600',
    gradient: 'from-purple-500 to-pink-600',
    pdfs: [
      { name: 'PART-1-modern-Indian-history.pdf', path: '/footer/pdfs/history/PART-1-modern-Indian-history.pdf', displayName: 'Modern Indian History Part 1' },
      { name: 'part-2-modern-indian-history.pdf', path: '/footer/pdfs/history/part-2-modern-indian-history.pdf', displayName: 'Modern Indian History Part 2' },
      { name: 'Part-3-modern-indian-history.pdf', path: '/footer/pdfs/history/Part-3-modern-indian-history.pdf', displayName: 'Modern Indian History Part 3' },
    ]
  },
  {
    id: 'maps',
    name: 'Maps',
    icon: <MapPin className="h-8 w-8" />,
    color: 'text-orange-600',
    gradient: 'from-orange-500 to-red-600',
    pdfs: [
      { name: 'Africa.pdf', path: '/footer/pdfs/maps/Africa.pdf', displayName: 'Africa Map' },
      { name: 'Asia.pdf', path: '/footer/pdfs/maps/Asia.pdf', displayName: 'Asia Map' },
      { name: 'Europe.pdf', path: '/footer/pdfs/maps/Europe.pdf', displayName: 'Europe Map' },
      { name: 'South-America.pdf', path: '/footer/pdfs/maps/South-America.pdf', displayName: 'South America Map' },
    ]
  }
]

export default function BrainstormBubbles() {
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null)
  const [selectedPDF, setSelectedPDF] = useState<PDFResource | null>(null)
  const [isPDFLoading, setIsPDFLoading] = useState(false)

  const handleCategoryClick = (category: Category) => {
    setSelectedCategory(category)
  }

  const handlePDFClick = (pdf: PDFResource) => {
    setIsPDFLoading(true)
    setSelectedPDF(pdf)
  }

  const handleCloseCategoryModal = () => {
    setSelectedCategory(null)
  }

  const handleClosePDFModal = () => {
    setSelectedPDF(null)
    setIsPDFLoading(false)
  }

  return (
    <>
      {/* Brainstorm Bubbles Section */}
      <section className="relative py-24 px-6 sm:px-6 lg:px-8 bg-gradient-to-br from-background via-muted/20 to-background overflow-hidden">
        {/* Animated Background Bubbles */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {/* Large floating bubbles */}
          <div className="absolute top-20 left-10 w-32 h-32 bg-primary/10 rounded-full blur-xl animate-float-bubble" style={{ animationDelay: '0s' }} />
          <div className="absolute top-40 right-20 w-24 h-24 bg-secondary/10 rounded-full blur-xl animate-float-bubble-reverse" style={{ animationDelay: '1s' }} />
          <div className="absolute bottom-32 left-1/4 w-40 h-40 bg-primary/5 rounded-full blur-2xl animate-float-bubble" style={{ animationDelay: '2s' }} />
          <div className="absolute top-1/3 right-1/3 w-28 h-28 bg-secondary/10 rounded-full blur-xl animate-float-bubble-reverse" style={{ animationDelay: '1.5s' }} />
          
          {/* Rising bubbles */}
          <div className="absolute bottom-0 left-1/4 w-16 h-16 bg-primary/20 rounded-full blur-md animate-bubble-rise" style={{ animationDelay: '0s', animationDuration: '25s' }} />
          <div className="absolute bottom-0 left-1/2 w-12 h-12 bg-secondary/20 rounded-full blur-md animate-bubble-rise" style={{ animationDelay: '5s', animationDuration: '30s' }} />
          <div className="absolute bottom-0 right-1/4 w-20 h-20 bg-primary/15 rounded-full blur-lg animate-bubble-rise" style={{ animationDelay: '10s', animationDuration: '28s' }} />
          <div className="absolute bottom-0 left-3/4 w-14 h-14 bg-secondary/15 rounded-full blur-md animate-bubble-rise" style={{ animationDelay: '15s', animationDuration: '32s' }} />
        </div>

        <div className="relative z-10 mx-auto max-w-7xl">
          <div className="text-center mb-16">
            <div className="flex items-center justify-center mb-4">
              <div className="w-16 h-16 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-full flex items-center justify-center animate-bubble-pulse">
                <FileText className="h-8 w-8 text-primary" />
              </div>
            </div>
            <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl mb-4">
              Brainstorm Bubbles
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Explore our collection of educational PDFs. Click on any category to browse and read resources.
            </p>
          </div>

          {/* Bubbles Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
            {categories.map((category, index) => (
              <button
                key={category.id}
                onClick={() => handleCategoryClick(category)}
                className="group relative focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded-2xl transition-all duration-300 animate-bubble-float"
                style={{ animationDelay: `${index * 0.2}s` }}
              >
                <Card className="border-0 shadow-lg hover:shadow-2xl transition-all duration-300 group-hover:scale-110 bg-gradient-to-br from-card to-card/80 overflow-hidden relative">
                  {/* Animated bubble glow effect */}
                  <div className={`absolute -inset-1 bg-gradient-to-br ${category.gradient} opacity-0 group-hover:opacity-20 blur-xl transition-opacity duration-500 rounded-2xl animate-bubble-pulse`} />
                  
                  <CardContent className="p-8 text-center relative z-10">
                    {/* Gradient Background */}
                    <div className={`absolute inset-0 bg-gradient-to-br ${category.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-300`} />
                    
                    {/* Content */}
                    <div className="relative z-10">
                      <div className={`mx-auto mb-4 w-20 h-20 bg-gradient-to-br ${category.gradient} rounded-full flex items-center justify-center text-white shadow-lg group-hover:scale-125 transition-transform duration-300 animate-bubble-float`} style={{ animationDelay: `${index * 0.2 + 0.1}s` }}>
                        {category.icon}
                      </div>
                      <h3 className="text-xl font-bold text-foreground mb-2 group-hover:text-primary transition-colors">
                        {category.name}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {category.pdfs.length} {category.pdfs.length === 1 ? 'PDF' : 'PDFs'}
                      </p>
                    </div>

                    {/* Hover Effect */}
                    <div className={`absolute inset-0 bg-gradient-to-br ${category.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-300 rounded-2xl`} />
                  </CardContent>
                </Card>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Category PDF List Modal */}
      <Modal
        open={selectedCategory !== null}
        onClose={handleCloseCategoryModal}
        title={selectedCategory ? `${selectedCategory.name} Resources` : ''}
        className="w-full max-w-2xl mx-2"
      >
        <div className="flex-1 overflow-y-auto p-6">
          <div className="space-y-3">
            {selectedCategory?.pdfs.map((pdf, index) => (
              <Card
                key={index}
                className="border hover:border-primary/50 transition-all duration-200 hover:shadow-md cursor-pointer group"
                onClick={() => handlePDFClick(pdf)}
              >
                <CardContent className="p-4 flex items-center justify-between">
                  <div className="flex items-center space-x-3 flex-1">
                    <div className="w-10 h-10 bg-muted rounded-lg flex items-center justify-center">
                      <FileText className="h-5 w-5 text-primary" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-foreground group-hover:text-primary transition-colors">
                        {pdf.displayName}
                      </h4>
                      <p className="text-sm text-muted-foreground">{pdf.name}</p>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    className="ml-4 group-hover:bg-primary group-hover:text-primary-foreground transition-colors"
                  >
                    <Eye className="h-4 w-4 mr-2" />
                    Read
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </Modal>

      {/* PDF Viewer Modal */}
      <Modal
        open={selectedPDF !== null}
        onClose={handleClosePDFModal}
        title={selectedPDF ? selectedPDF.displayName : ''}
        className="w-full max-w-7xl mx-2 flex flex-col"
      >
        <div className="flex-1 overflow-hidden relative bg-gray-100 dark:bg-gray-900" style={{ minHeight: '600px', maxHeight: 'calc(90vh - 120px)' }}>
          {isPDFLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-100 dark:bg-gray-900 z-50">
              <div className="text-center">
                <div className="relative mb-6">
                  <Loader2 className="h-16 w-16 animate-spin text-primary mx-auto" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <FileText className="h-8 w-8 text-primary/50" />
                  </div>
                </div>
                <p className="text-lg font-semibold text-foreground mb-2">Loading PDF</p>
                <p className="text-sm text-muted-foreground">{selectedPDF?.displayName}</p>
                <div className="mt-4 flex justify-center space-x-1">
                  <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0s' }} />
                  <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                  <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.4s' }} />
                </div>
              </div>
            </div>
          )}
          {selectedPDF && (
            <div 
              className={`w-full h-full ${isPDFLoading ? 'opacity-0' : 'opacity-100'} transition-opacity duration-300`}
              onContextMenu={(e) => e.preventDefault()}
              onDragStart={(e) => e.preventDefault()}
            >
              <iframe
                src={`${selectedPDF.path}#toolbar=0&navpanes=0&scrollbar=1&view=FitH`}
                className="w-full h-full border-0"
                title={selectedPDF.displayName}
                style={{ minHeight: '600px' }}
                onContextMenu={(e) => e.preventDefault()}
                onLoad={() => {
                  // Add small delay to ensure smooth transition
                  setTimeout(() => setIsPDFLoading(false), 300)
                }}
                onError={() => {
                  setIsPDFLoading(false)
                }}
              />
            </div>
          )}
        </div>
        <div className="p-4 border-t border-border bg-background flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Read-only mode • Download disabled
          </p>
          <Button variant="outline" onClick={handleClosePDFModal}>
            Close
          </Button>
        </div>
      </Modal>
    </>
  )
}

