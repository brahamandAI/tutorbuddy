'use client'

import { useState } from 'react'
import Link from 'next/link'
import { BookOpen, Eye, FileText, Lock } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Card, CardContent } from '@/components/ui/card'
import { Modal } from '@/components/ui/Modal'
import { useAuth } from '@/contexts/AuthContext'
import { useAuthPopup } from '@/hooks/useAuthPopup'
import { Spinner } from '@/components/ui/spinner'

const books = [
  {
    name: 'My_First_Learning_Book_Final.pdf',
    path: '/pdfs/kindergarden/My_First_Learning_Book_Final.pdf',
    displayName: 'My First Learning Book',
  },
  {
    name: 'Science_Smart_Learning_Book_Final.pdf',
    path: '/pdfs/kindergarden/Science_Smart_Learning_Book_Final.pdf',
    displayName: 'Science Smart Learning Book',
  },
]

export default function KindergartenPage() {
  const { isAuthenticated, isAuthLoading } = useAuth()
  const { openPopup } = useAuthPopup()
  const [selected, setSelected] = useState<(typeof books)[number] | null>(null)
  const [loading, setLoading] = useState(false)
  const locked = !isAuthLoading && !isAuthenticated

  const openBook = (book: (typeof books)[number]) => {
    if (locked) {
      openPopup('register', 'STUDENT')
      return
    }
    setLoading(true)
    setSelected(book)
  }

  return (
    <div className="mx-auto max-w-4xl px-6 py-12">
      <div className="mb-8">
        <Link href="/" className="text-sm text-muted-foreground hover:text-foreground">
          Home
        </Link>
        <h1 className="mt-3 text-3xl font-bold tracking-tight text-foreground">Kindergarten</h1>
        <p className="mt-2 text-lg text-muted-foreground">
          Learning books for the earliest readers.
        </p>
      </div>

      <div className="space-y-3">
        {books.map((book) => (
          <Card
            key={book.path}
            className="group relative overflow-hidden border border-border/60 shadow-sm hover:border-primary/50 hover:shadow-md cursor-pointer transition-all duration-300"
            onClick={() => openBook(book)}
          >
            <CardContent className="p-4 flex items-center justify-between">
              <div className="flex items-center space-x-3 min-w-0">
                <div className="w-10 h-10 shrink-0 rounded-lg bg-category-1 text-category-1-fg flex items-center justify-center">
                  <BookOpen className="h-5 w-5" />
                </div>
                <div className={`min-w-0 transition-all duration-300 ${locked ? 'blur-[5px] select-none' : ''}`}>
                  <h2 className="font-semibold text-foreground">{book.displayName}</h2>
                  <p className="text-sm text-muted-foreground truncate">{book.name}</p>
                </div>
              </div>
              <Button variant="outline" size="sm" className="shrink-0 pointer-events-none">
                {locked ? <Lock className="h-4 w-4 mr-2" /> : <Eye className="h-4 w-4 mr-2" />}
                {locked ? 'Unlock' : 'Read'}
              </Button>
            </CardContent>
            {locked && (
              <div className="absolute inset-0 bg-background/35 backdrop-blur-[1px] flex items-center justify-center opacity-100 transition-opacity duration-300 md:group-hover:opacity-0">
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-card shadow-sm border border-border/70">
                  <Lock className="h-4 w-4 text-primary" />
                </span>
              </div>
            )}
          </Card>
        ))}
      </div>

      {locked && (
        <div className="mt-10 rounded-2xl border border-border/60 bg-muted/30 px-6 py-8 text-center">
          <h2 className="text-xl font-semibold text-foreground">Sign in to read these books</h2>
          <p className="mt-2 text-muted-foreground">
            Create a free student account to open the Kindergarten books.
          </p>
          <Button className="mt-6" onClick={() => openPopup('register', 'STUDENT')}>
            Get started
          </Button>
        </div>
      )}

      <Modal
        open={selected !== null}
        onClose={() => {
          setSelected(null)
          setLoading(false)
        }}
        title={selected?.displayName ?? ''}
        className="w-full max-w-7xl mx-2 flex flex-col"
      >
        <div className="relative bg-muted" style={{ minHeight: '600px', maxHeight: 'calc(90vh - 120px)' }}>
          {loading && (
            <div className="absolute inset-0 z-50 flex items-center justify-center bg-muted">
              <Spinner text="Loading PDF" />
            </div>
          )}
          {selected && (
            <iframe
              src={`${selected.path}#toolbar=0&navpanes=0&scrollbar=1`}
              className="w-full border-0"
              title={selected.displayName}
              style={{ minHeight: '600px', height: 'calc(90vh - 160px)' }}
              onLoad={() => setTimeout(() => setLoading(false), 200)}
            />
          )}
        </div>
        <div className="p-4 border-t border-border bg-background flex items-center justify-between">
          <p className="text-sm text-muted-foreground flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Read-only
          </p>
          <Button variant="outline" onClick={() => setSelected(null)}>Close</Button>
        </div>
      </Modal>
    </div>
  )
}
