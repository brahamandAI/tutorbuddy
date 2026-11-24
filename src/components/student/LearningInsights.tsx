'use client'

import { useMemo, useState } from 'react'
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

type Range = 'day' | 'week' | 'month'

export interface InsightBooking {
  subject: string
  date: string
  duration: number
  status: string
}

const RANGES: { id: Range; label: string }[] = [
  { id: 'day', label: 'Daily' },
  { id: 'week', label: 'Weekly' },
  { id: 'month', label: 'Monthly' },
]

const COLORS = {
  current: '#7C6BF2',
  previous: '#F5B942',
  subject: '#5BA8F5',
}

function startOfDay(date: Date) {
  const next = new Date(date)
  next.setHours(0, 0, 0, 0)
  return next
}

function addDays(date: Date, days: number) {
  const next = new Date(date)
  next.setDate(next.getDate() + days)
  return next
}

function minutesOn(bookings: InsightBooking[], from: Date, to: Date) {
  return bookings.reduce((sum, booking) => {
    const when = new Date(booking.date)
    if (Number.isNaN(when.getTime()) || when < from || when >= to) return sum
    if (booking.status !== 'completed') return sum
    return sum + (booking.duration || 0)
  }, 0)
}

function bucketSeries(bookings: InsightBooking[], range: Range) {
  const today = startOfDay(new Date())
  if (range === 'day') {
    return Array.from({ length: 7 }, (_, index) => {
      const currentStart = addDays(today, index - 6)
      const previousStart = addDays(currentStart, -7)
      return {
        label: currentStart.toLocaleDateString(undefined, { weekday: 'short' }),
        current: minutesOn(bookings, currentStart, addDays(currentStart, 1)),
        previous: minutesOn(bookings, previousStart, addDays(previousStart, 1)),
      }
    })
  }
  if (range === 'week') {
    const thisWeek = addDays(today, -today.getDay())
    return Array.from({ length: 4 }, (_, index) => {
      const currentStart = addDays(thisWeek, (index - 3) * 7)
      const previousStart = addDays(currentStart, -28)
      return {
        label: currentStart.toLocaleDateString(undefined, { month: 'short', day: 'numeric' }),
        current: minutesOn(bookings, currentStart, addDays(currentStart, 7)),
        previous: minutesOn(bookings, previousStart, addDays(previousStart, 7)),
      }
    })
  }
  const monthStart = new Date(today.getFullYear(), today.getMonth(), 1)
  return Array.from({ length: 6 }, (_, index) => {
    const currentStart = new Date(monthStart.getFullYear(), monthStart.getMonth() - (5 - index), 1)
    const currentEnd = new Date(currentStart.getFullYear(), currentStart.getMonth() + 1, 1)
    const previousStart = new Date(currentStart.getFullYear() - 1, currentStart.getMonth(), 1)
    const previousEnd = new Date(previousStart.getFullYear(), previousStart.getMonth() + 1, 1)
    return {
      label: currentStart.toLocaleDateString(undefined, { month: 'short' }),
      current: minutesOn(bookings, currentStart, currentEnd),
      previous: minutesOn(bookings, previousStart, previousEnd),
    }
  })
}

function formatMinutes(value: number) {
  if (value >= 60) return `${Math.round(value / 60)}h`
  return `${value}m`
}

function changeLabel(current: number, previous: number) {
  if (previous === 0 && current === 0) return 'No completed time in either period'
  if (previous === 0) return 'New activity compared with the previous period'
  const delta = Math.round(((current - previous) / previous) * 100)
  if (delta === 0) return 'Same as the previous period'
  return `${delta > 0 ? 'Up' : 'Down'} ${Math.abs(delta)}% versus the previous period`
}

export function InsightsSkeleton() {
  return (
    <div className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <div key={index} className="h-28 animate-pulse rounded-2xl bg-muted" />
        ))}
      </div>
      <div className="grid gap-4 lg:grid-cols-2">
        <div className="h-80 animate-pulse rounded-2xl bg-muted" />
        <div className="h-80 animate-pulse rounded-2xl bg-muted" />
      </div>
    </div>
  )
}

export default function LearningInsights({
  bookings,
  subjectCount,
}: {
  bookings: InsightBooking[]
  subjectCount: number
}) {
  const [range, setRange] = useState<Range>('week')
  const completed = bookings.filter((booking) => booking.status === 'completed')
  const hasHistory = completed.length > 0

  const series = useMemo(() => bucketSeries(bookings, range), [bookings, range])
  const currentTotal = series.reduce((sum, point) => sum + point.current, 0)
  const previousTotal = series.reduce((sum, point) => sum + point.previous, 0)

  const bySubject = useMemo(() => {
    const totals = new Map<string, number>()
    const today = startOfDay(new Date())
    const from = range === 'day' ? addDays(today, -6) : range === 'week' ? addDays(today, -27) : new Date(today.getFullYear(), today.getMonth() - 5, 1)
    completed.forEach((booking) => {
      const when = new Date(booking.date)
      if (Number.isNaN(when.getTime()) || when < from) return
      totals.set(booking.subject, (totals.get(booking.subject) || 0) + (booking.duration || 0))
    })
    return Array.from(totals.entries()).map(([subject, minutes]) => ({ subject, minutes }))
  }, [completed, range])

  const studiedDays = new Set(
    completed.map((booking) => new Date(booking.date).toDateString()).filter((value) => value !== 'Invalid Date')
  )
  let streak = 0
  const cursor = new Date()
  if (!studiedDays.has(cursor.toDateString())) cursor.setDate(cursor.getDate() - 1)
  while (studiedDays.has(cursor.toDateString())) {
    streak += 1
    cursor.setDate(cursor.getDate() - 1)
  }

  const completion = bookings.length ? Math.round((completed.length / bookings.length) * 100) : null
  const periodName = range === 'day' ? 'these 7 days' : range === 'week' ? 'these 4 weeks' : 'these 6 months'
  const previousName = range === 'month' ? 'the same months last year' : 'the previous window'

  const cards = [
    { label: 'Learning', value: String(subjectCount), note: 'Subjects on your profile', className: 'bg-violet-100 text-violet-950 dark:bg-violet-500/15 dark:text-violet-100' },
    { label: 'Activity', value: formatMinutes(currentTotal), note: changeLabel(currentTotal, previousTotal), className: 'bg-sky-100 text-sky-950 dark:bg-sky-500/15 dark:text-sky-100' },
    { label: 'Progress', value: completion === null ? '—' : `${completion}%`, note: 'Completed sessions out of all bookings', className: 'bg-amber-100 text-amber-950 dark:bg-amber-500/15 dark:text-amber-100' },
    { label: 'Consistency', value: String(streak), note: streak === 1 ? 'day with a completed session' : 'days with a completed session', className: 'bg-rose-100 text-rose-950 dark:bg-rose-500/15 dark:text-rose-100' },
  ]

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-muted-foreground">
          {formatMinutes(currentTotal)} in {periodName}, compared with {formatMinutes(previousTotal)} in {previousName}.
        </p>
        <div className="flex w-full rounded-xl bg-muted p-1 sm:w-auto">
          {RANGES.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setRange(item.id)}
              className={`flex-1 rounded-lg px-3 py-1.5 text-sm font-medium sm:flex-none ${
                range === item.id ? 'bg-card text-foreground shadow-sm' : 'text-muted-foreground'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {cards.map((card) => (
          <Card key={card.label} className={`border-0 shadow-sm ${card.className}`}>
            <CardHeader className="pb-2">
              <CardDescription className="text-current/70">{card.label}</CardDescription>
              <CardTitle className="text-3xl">{card.value}</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-current/80">{card.note}</CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card className="border-border/60 shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg">Study time</CardTitle>
            <CardDescription>Completed session minutes, current period against the previous one.</CardDescription>
          </CardHeader>
          <CardContent className="h-72">
            {hasHistory ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={series} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="label" tick={{ fontSize: 12 }} interval={0} />
                  <YAxis tick={{ fontSize: 12 }} width={36} unit="m" />
                  <Tooltip formatter={(value: number, name: string) => [formatMinutes(value), name === 'current' ? 'This period' : 'Previous period']} />
                  <Legend formatter={(value) => (value === 'current' ? 'This period' : 'Previous period')} />
                  <Bar dataKey="current" fill={COLORS.current} radius={[6, 6, 0, 0]} />
                  <Bar dataKey="previous" fill={COLORS.previous} radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <EmptyChart message="Completed sessions will show your study time here." />
            )}
          </CardContent>
        </Card>

        <Card className="border-border/60 shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg">Time by subject</CardTitle>
            <CardDescription>Where your completed minutes went in the selected range.</CardDescription>
          </CardHeader>
          <CardContent className="h-72">
            {bySubject.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={bySubject} layout="vertical" margin={{ top: 8, right: 8, left: 8, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                  <XAxis type="number" tick={{ fontSize: 12 }} unit="m" />
                  <YAxis type="category" dataKey="subject" tick={{ fontSize: 12 }} width={88} />
                  <Tooltip formatter={(value: number) => [formatMinutes(value), 'Completed time']} />
                  <Legend formatter={() => 'Completed time'} />
                  <Bar dataKey="minutes" name="minutes" fill={COLORS.subject} radius={[0, 6, 6, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <EmptyChart message="Subject time appears after you complete a session." />
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

function EmptyChart({ message }: { message: string }) {
  return (
    <div className="flex h-full items-center justify-center rounded-xl border border-dashed border-border px-6 text-center text-sm text-muted-foreground">
      {message}
    </div>
  )
}
