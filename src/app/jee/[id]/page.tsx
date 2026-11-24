'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { ArrowLeft, Download, FileText } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/Button'
import ModernPDFViewer from '@/components/ModernPDFViewer'
import { getJeeDocument, getJeeExam, jeePdfUrl } from '@/data/jee-syllabus'

export default function JeeDocumentPage() {
  const params = useParams()
  const id = String(params.id || '')
  const doc = getJeeDocument(id)
  const exam = doc ? getJeeExam(doc.exam) : null
  const [topicIndex, setTopicIndex] = useState(0)

  useEffect(() => {
    setTopicIndex(0)
  }, [id])

  if (!doc || !exam) {
    return (
      <div className="mx-auto max-w-3xl py-16 text-center">
        <h1 className="text-2xl font-semibold text-foreground">Syllabus not found</h1>
        <p className="mt-2 text-muted-foreground">That JEE section is not in the library.</p>
        <Link href="/jee" className="mt-6 inline-block">
          <Button>Back to JEE</Button>
        </Link>
      </div>
    )
  }

  const pdfUrl = jeePdfUrl(doc.file)
  const activeTopic = doc.topics[topicIndex] ?? doc.topics[0]

  return (
    <div className="mx-auto w-full max-w-6xl space-y-5">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <Link href={`/jee#${exam.id}`} className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-foreground">
            <ArrowLeft className="mr-1.5 h-4 w-4" />
            {exam.name}
          </Link>
          <div className="mt-3 flex flex-wrap items-center gap-2">
            <Badge variant="secondary">{exam.name}</Badge>
            <Badge variant="outline">{doc.subject}</Badge>
          </div>
          <h1 className="mt-3 text-3xl font-bold tracking-tight text-foreground">{doc.title}</h1>
          <p className="mt-2 max-w-2xl text-muted-foreground">{doc.description}</p>
        </div>
        <a href={pdfUrl} download={doc.file}>
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Download PDF
          </Button>
        </a>
      </div>

      <div className="rounded-2xl border border-border/60 bg-card p-4 shadow-sm">
        <div className="mb-3 flex items-center justify-between gap-3">
          <p className="text-sm font-semibold text-foreground">Syllabus sections</p>
          <p className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
            <FileText className="h-3.5 w-3.5" />
            {doc.pageCount} {doc.pageCount === 1 ? 'page' : 'pages'}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          {doc.topics.map((topic, index) => {
            const selected = activeTopic?.title === topic.title
            return (
              <button
                key={`${topic.title}-${index}`}
                type="button"
                onClick={() => setTopicIndex(index)}
                className={`rounded-full border px-3 py-1.5 text-left text-sm transition ${
                  selected
                    ? 'border-primary bg-primary/10 font-medium text-primary'
                    : 'border-border bg-background text-foreground hover:border-primary/40 hover:bg-muted'
                }`}
              >
                {topic.title}
              </button>
            )
          })}
        </div>
      </div>

      <ModernPDFViewer key={doc.id} pdfUrl={pdfUrl} title={doc.title} initialPage={activeTopic?.page ?? 1} />
    </div>
  )
}
