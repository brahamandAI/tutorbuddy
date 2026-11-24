import SavedLibrary from '@/components/student/SavedLibrary'

export default function MyLearningPage() {
  return (
    <div className="mx-auto w-full max-w-6xl space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">My Learning</h1>
        <p className="mt-2 text-muted-foreground">Chapters you opened and added to your personal learning list.</p>
      </div>
      <SavedLibrary type="learning" />
    </div>
  )
}
