'use client'

import Link from 'next/link'
import { ArrowRight, Award, BookOpen, GraduationCap, School, Target, Trophy } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'

const iconClass = [
  'bg-category-1 text-category-1-fg',
  'bg-category-2 text-category-2-fg',
  'bg-category-3 text-category-3-fg',
  'bg-category-4 text-category-4-fg',
  'bg-category-5 text-category-5-fg',
  'bg-category-6 text-category-6-fg',
] as const

const schoolCategories = [
  { name: 'Kindergarten', icon: <School className="h-6 w-6" />, detail: 'Fun learning for young minds', href: '/learn/kindergarten' },
  { name: 'Primary (1-5)', icon: <BookOpen className="h-6 w-6" />, detail: 'Explore core subjects', href: '/courses' },
  { name: 'Middle (6-8)', icon: <GraduationCap className="h-6 w-6" />, detail: 'Build strong fundamentals', href: '/courses' },
  { name: 'Secondary (9-10)', icon: <Target className="h-6 w-6" />, detail: 'Board exam preparation', href: '/courses' },
  { name: 'Senior Secondary', icon: <Trophy className="h-6 w-6" />, detail: 'Advanced subject learning', href: '/courses' },
]

const examCategories = [
  { name: 'JEE Main & Advanced', icon: <Award className="h-6 w-6" />, detail: 'Competitive exam preparation', href: '/jee' },
]

export default function CourseLevels({ embedded = false }: { embedded?: boolean }) {
  return (
    <section className={embedded ? 'rounded-2xl border border-border/60 bg-muted/30 px-6 py-10 sm:px-8' : 'py-24 px-6 sm:px-6 lg:px-8 bg-muted/30'}>
      <div className={embedded ? '' : 'mx-auto max-w-7xl'}>
        <div className="text-center mb-10 sm:mb-16">
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Courses for Every Level
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            From Kindergarten to Competitive Exams - We&apos;ve got you covered
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {schoolCategories.map((category, index) => (
            <Link key={category.name} href={category.href} className="block">
              <Card className="group h-full border border-border/60 bg-card shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md">
                <CardContent className="flex items-center gap-4 p-5">
                  <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl transition-transform duration-300 group-hover:scale-105 ${iconClass[index]}`}>
                    {category.icon}
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="font-semibold text-foreground">{category.name}</h3>
                    <p className="text-sm text-muted-foreground">{category.detail}</p>
                  </div>
                  <ArrowRight className="h-5 w-5 shrink-0 text-muted-foreground transition-colors duration-300 group-hover:text-primary" />
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

        <h3 className="mb-4 mt-10 text-center text-sm font-semibold uppercase tracking-wider text-muted-foreground">
          Competitive exams
        </h3>
        <div className="mx-auto grid max-w-xl gap-4">
          {examCategories.map((category) => (
            <Link key={category.name} href={category.href} className="block">
              <Card className="group border border-border/60 bg-card shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md">
                <CardContent className="flex items-center gap-4 p-5">
                  <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${iconClass[5]}`}>
                    {category.icon}
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="font-semibold text-foreground">{category.name}</h3>
                    <p className="text-sm text-muted-foreground">{category.detail}</p>
                  </div>
                  <ArrowRight className="h-5 w-5 shrink-0 text-muted-foreground transition-colors group-hover:text-primary" />
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
