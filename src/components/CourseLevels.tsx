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

const categories = [
  { name: 'Kindergarten', icon: <School className="h-6 w-6" />, detail: '2 learning books', href: '/learn/kindergarten' },
  { name: 'Primary (1-5)', icon: <BookOpen className="h-6 w-6" />, detail: '25 courses available', href: '/courses' },
  { name: 'Middle (6-8)', icon: <GraduationCap className="h-6 w-6" />, detail: '30 courses available', href: '/courses' },
  { name: 'Secondary (9-10)', icon: <Target className="h-6 w-6" />, detail: '35 courses available', href: '/courses' },
  { name: 'Senior Secondary', icon: <Trophy className="h-6 w-6" />, detail: '40 courses available', href: '/courses' },
  { name: 'JEE Main & Advanced', icon: <Award className="h-6 w-6" />, detail: '2026 syllabus, paper by paper', href: '/jee' },
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

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {categories.map((category, index) => (
            <Link key={category.name} href={category.href} className="block">
              <Card className="group border border-border/60 bg-card shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer">
                <CardContent className="p-6">
                  <div className="flex items-center space-x-4">
                    <div className={`w-12 h-12 rounded-lg flex items-center justify-center group-hover:scale-105 transition-transform duration-300 ${iconClass[index]}`}>
                      {category.icon}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg">{category.name}</h3>
                      <p className="text-sm text-muted-foreground">{category.detail}</p>
                    </div>
                    <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors duration-300" />
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
