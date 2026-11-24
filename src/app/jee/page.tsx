"use client"

import { useState } from 'react'
import Link from 'next/link'
import {
  ArrowRight,
  Atom,
  BookOpen,
  Building2,
  Calculator,
  Compass,
  FileText,
  FlaskConical,
  PenTool,
  Sparkles,
} from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/Button'
import { Card, CardContent } from '@/components/ui/card'
import { jeeDocuments, jeeExams, type JeeDocument, type JeeExam } from '@/data/jee-syllabus'

const subjectStyle: Record<string, { icon: typeof Atom; tile: string }> = {
  Physics: { icon: Atom, tile: 'bg-sky-500/10 text-sky-700 dark:text-sky-300' },
  Chemistry: { icon: FlaskConical, tile: 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-300' },
  Mathematics: { icon: Calculator, tile: 'bg-violet-500/10 text-violet-700 dark:text-violet-300' },
  Aptitude: { icon: Compass, tile: 'bg-amber-500/10 text-amber-700 dark:text-amber-300' },
  Drawing: { icon: PenTool, tile: 'bg-rose-500/10 text-rose-700 dark:text-rose-300' },
  Planning: { icon: Building2, tile: 'bg-teal-500/10 text-teal-700 dark:text-teal-300' },
  'Complete syllabus': { icon: BookOpen, tile: 'bg-primary/10 text-primary' },
}

function styleFor(subject: string) {
  return subjectStyle[subject] ?? subjectStyle['Complete syllabus']
}

function DocumentCard({ doc }: { doc: JeeDocument }) {
  const style = styleFor(doc.subject)
  const Icon = style.icon
  const preview = doc.topics.slice(0, 4)

  return (
    <Link href={`/jee/${doc.id}`} className="group block h-full">
      <Card className="h-full border-border/60 shadow-sm transition duration-200 hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-md">
        <CardContent className="flex h-full flex-col p-5">
          <div className="mb-4 flex items-start justify-between gap-3">
            <div className={`flex h-11 w-11 items-center justify-center rounded-xl ${style.tile}`}>
              <Icon className="h-5 w-5" />
            </div>
            <Badge variant="secondary" className="shrink-0">
              {doc.topics.length} {doc.topics.length === 1 ? 'section' : 'sections'}
            </Badge>
          </div>
          <h3 className="text-lg font-semibold text-foreground">{doc.subject}</h3>
          <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{doc.description}</p>
          <ul className="mt-4 space-y-1.5">
            {preview.map((topic) => (
              <li key={topic.title} className="truncate text-sm text-foreground/80">
                {topic.title}
              </li>
            ))}
            {doc.topics.length > preview.length && (
              <li className="text-sm text-muted-foreground">+{doc.topics.length - preview.length} more</li>
            )}
          </ul>
          <div className="mt-auto flex items-center justify-between pt-5 text-sm font-medium text-primary">
            <span className="inline-flex items-center gap-1.5">
              <FileText className="h-4 w-4" />
              {doc.topics.length > 0 && doc.topics.every((topic) => topic.page === doc.topics[0].page) && doc.topics[0].page > 1
                ? `Opens on page ${doc.topics[0].page}`
                : `${doc.pageCount} ${doc.pageCount === 1 ? 'page' : 'pages'}`}
            </span>
            <span className="inline-flex items-center gap-1">
              Open PDF
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </span>
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}

function ExamSection({ exam }: { exam: JeeExam }) {
  const complete = jeeDocuments.find((doc) => doc.exam === exam.id && doc.paperId === 'overview')

  return (
    <section id={exam.id} className="scroll-mt-24 overflow-hidden rounded-2xl border border-border/60 bg-card shadow-sm">
      <div className={exam.id === 'main' ? 'bg-primary text-primary-foreground' : 'bg-foreground text-background'}>
        <div className="flex flex-col gap-4 px-6 py-6 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.16em] opacity-80">{exam.kicker}</p>
            <h2 className="mt-1 text-3xl font-bold tracking-tight">{exam.name}</h2>
            <p className="mt-2 max-w-2xl text-sm leading-relaxed opacity-90 sm:text-base">{exam.summary}</p>
          </div>
          <div className="flex flex-wrap gap-2">
            {exam.highlights.map((item) => (
              <span key={item} className="rounded-full bg-white/15 px-3 py-1 text-xs font-medium">
                {item}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="space-y-8 p-5 sm:p-6">
        {complete && (
          <Link
            href={`/jee/${complete.id}`}
            className="flex flex-col gap-3 rounded-xl border border-border/60 bg-muted/30 px-4 py-4 transition hover:border-primary/40 hover:bg-muted/50 sm:flex-row sm:items-center sm:justify-between"
          >
            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <BookOpen className="h-5 w-5" />
              </div>
              <div>
                <p className="font-semibold text-foreground">{complete.title}</p>
                <p className="text-sm text-muted-foreground">{complete.description}</p>
              </div>
            </div>
            <span className="inline-flex items-center gap-1 text-sm font-medium text-primary">
              Read full PDF
              <ArrowRight className="h-4 w-4" />
            </span>
          </Link>
        )}

        {exam.papers.map((paper) => {
          const docs = paper.documentIds
            .map((id) => jeeDocuments.find((doc) => doc.id === id))
            .filter((doc): doc is JeeDocument => Boolean(doc))

          return (
            <div key={paper.id}>
              <div className="mb-4 flex flex-wrap items-end justify-between gap-2">
                <div>
                  <h3 className="text-xl font-semibold text-foreground">
                    {paper.name}
                    <span className="ml-2 text-base font-medium text-muted-foreground">{paper.code}</span>
                  </h3>
                  <p className="mt-1 text-sm text-muted-foreground">{paper.summary}</p>
                </div>
              </div>
              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                {docs.map((doc) => (
                  <DocumentCard key={doc.id} doc={doc} />
                ))}
              </div>
            </div>
          )
        })}
      </div>
    </section>
  )
}

export default function JeePage() {
  const [selectedExam, setSelectedExam] = useState<'main' | 'advanced'>('main')
  const activeExam = jeeExams.find((exam) => exam.id === selectedExam)

  return (
    <div className="mx-auto w-full max-w-6xl space-y-8">
      <section className="overflow-hidden rounded-2xl border border-border/60 bg-card shadow-sm">
        <div className="grid gap-6 p-6 md:grid-cols-[1.4fr_0.8fr] md:p-8">
          <div>
            <Badge className="bg-primary/10 text-primary hover:bg-primary/10">
              <Sparkles className="mr-1.5 h-3.5 w-3.5" />
              Session 2026
            </Badge>
            <h1 className="mt-4 text-4xl font-bold tracking-tight text-foreground">JEE</h1>
            <p className="mt-3 max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg">
              Syllabus for JEE Main and JEE Advanced, organised by paper and subject. Open a section and read the PDF inside TutorBuddy.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Button
                type="button"
                variant={selectedExam === 'main' ? 'default' : 'outline'}
                onClick={() => setSelectedExam('main')}
              >
                JEE Main
              </Button>
              <Button
                type="button"
                variant={selectedExam === 'advanced' ? 'default' : 'outline'}
                onClick={() => setSelectedExam('advanced')}
              >
                JEE Advanced
              </Button>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3 self-end">
            <div className="rounded-xl border border-border/60 bg-muted/30 p-4">
              <p className="text-2xl font-bold text-foreground">2</p>
              <p className="text-sm text-muted-foreground">Exams, Main and Advanced</p>
            </div>
            <div className="rounded-xl border border-border/60 bg-muted/30 p-4">
              <p className="text-2xl font-bold text-foreground">3</p>
              <p className="text-sm text-muted-foreground">JEE Main papers</p>
            </div>
            <div className="rounded-xl border border-border/60 bg-muted/30 p-4">
              <p className="text-2xl font-bold text-foreground">PCM</p>
              <p className="text-sm text-muted-foreground">Physics, Chemistry, Mathematics</p>
            </div>
            <div className="rounded-xl border border-border/60 bg-muted/30 p-4">
              <p className="text-2xl font-bold text-foreground">13</p>
              <p className="text-sm text-muted-foreground">Syllabus PDFs ready to open</p>
            </div>
          </div>
        </div>
      </section>

      {activeExam && <ExamSection key={activeExam.id} exam={activeExam} />}
    </div>
  )
}
