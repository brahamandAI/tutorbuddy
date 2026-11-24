'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { BookOpen, BookmarkMinus } from 'lucide-react'
import { FullPageSpinner } from '@/components/ui/spinner'
import { Button } from '@/components/ui/Button'
import { Card, CardContent } from '@/components/ui/card'

type SavedItem = {
  id: string
  type: 'course' | 'learning'
  resourceId: string
  title: string
  subtitle?: string | null
  href: string
}

export default function SavedLibrary({ type }: { type: 'course' | 'learning' }) {
  const [items, setItems] = useState<SavedItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('token') || document.cookie.split('token=')[1]?.split(';')[0]
    fetch(`/api/student/saved-items?type=${type}`, {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    })
      .then((response) => response.ok ? response.json() : [])
      .then(setItems)
      .finally(() => setLoading(false))
  }, [type])

  const remove = async (item: SavedItem) => {
    const token = localStorage.getItem('token') || document.cookie.split('token=')[1]?.split(';')[0]
    const response = await fetch(
      `/api/student/saved-items?type=${item.type}&resourceId=${encodeURIComponent(item.resourceId)}`,
      { method: 'DELETE', headers: token ? { Authorization: `Bearer ${token}` } : {} }
    )
    if (response.ok) setItems((current) => current.filter((saved) => saved.id !== item.id))
  }

  if (loading) {
    return <FullPageSpinner text="Loading your list..." />
  }

  if (items.length === 0) {
    return (
      <Card className="border-dashed border-border shadow-none">
        <CardContent className="flex flex-col items-center px-6 py-14 text-center">
          <BookOpen className="mb-4 h-10 w-10 text-muted-foreground" />
          <h2 className="text-lg font-semibold">Nothing added yet</h2>
          <p className="mt-2 max-w-md text-sm text-muted-foreground">
            {type === 'course'
              ? 'Explore available courses and add the ones you want to follow.'
              : 'Open a chapter from the learning library and it will be added here.'}
          </p>
          <Button className="mt-6" asChild>
            <Link href={type === 'course' ? '/courses' : '/ncert'}>
              Explore {type === 'course' ? 'courses' : 'learning library'}
            </Link>
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      {items.map((item) => (
        <Card key={item.id} className="border-border/60 shadow-sm transition hover:shadow-md">
          <CardContent className="flex h-full flex-col p-5">
            <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <BookOpen className="h-5 w-5" />
            </div>
            <h2 className="font-semibold text-foreground">{item.title}</h2>
            {item.subtitle && <p className="mt-1 text-sm text-muted-foreground">{item.subtitle}</p>}
            <div className="mt-auto flex gap-2 pt-5">
              <Button size="sm" className="flex-1" asChild><Link href={item.href}>Open</Link></Button>
              <Button size="sm" variant="outline" onClick={() => remove(item)} aria-label={`Remove ${item.title}`}>
                <BookmarkMinus className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
