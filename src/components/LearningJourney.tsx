'use client'

import Link from 'next/link'
import {
  ArrowRight,
  Award,
  BookOpen,
  GraduationCap,
  School,
  Target,
  Trophy,
} from 'lucide-react'

const levels = [
  {
    id: 'kindergarten',
    name: 'Kindergarten',
    detail: 'Fun learning for young minds',
    href: '/learn/kindergarten',
    icon: School,
    card: 'from-rose-400 to-orange-400',
  },
  {
    id: 'primary',
    name: 'Primary (1-5)',
    detail: 'Explore core subjects',
    href: '/ncert',
    icon: BookOpen,
    card: 'from-sky-400 to-cyan-400',
  },
  {
    id: 'middle',
    name: 'Middle (6-8)',
    detail: 'Build strong fundamentals',
    href: '/ncert',
    icon: GraduationCap,
    card: 'from-emerald-400 to-lime-400',
  },
  {
    id: 'secondary',
    name: 'Secondary (9-10)',
    detail: 'Board exam preparation',
    href: '/ncert',
    icon: Target,
    card: 'from-amber-400 to-yellow-400',
  },
  {
    id: 'senior',
    name: 'Senior Secondary',
    detail: 'Advanced subject learning',
    href: '/ncert',
    icon: Trophy,
    card: 'from-violet-500 to-fuchsia-400',
  },
  {
    id: 'competitive',
    name: 'Competitive exams',
    detail: 'JEE Main & Advanced',
    href: '/jee',
    icon: Award,
    card: 'from-slate-800 to-amber-500',
  },
]

export default function LearningJourney() {
  return (
    <section className="px-4 py-8 sm:px-6">
      <div className="mx-auto max-w-6xl">
        <div className="mb-6 text-center">
          <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">Learn at your level</h1>
          <p className="mt-2 text-muted-foreground">Pick a stage and start.</p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {levels.map((level) => {
            const Icon = level.icon
            return (
              <Link
                key={level.id}
                href={level.href}
                className={`group relative overflow-hidden rounded-3xl bg-gradient-to-br ${level.card} p-6 text-white shadow-md transition hover:-translate-y-0.5 hover:shadow-lg`}
              >
                <Icon className="mb-8 h-10 w-10 text-white/90" />
                <h2 className="text-xl font-bold">{level.name}</h2>
                <p className="mt-1 text-sm text-white/85">{level.detail}</p>
                <span className="mt-4 inline-flex items-center text-sm font-medium">
                  Open
                  <ArrowRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                </span>
              </Link>
            )
          })}
        </div>
      </div>
    </section>
  )
}
