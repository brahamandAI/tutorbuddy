import SavedLibrary from '@/components/student/SavedLibrary'

export default function MyCoursesPage() {
  return (
    <div className="mx-auto w-full max-w-6xl space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">My Courses</h1>
        <p className="mt-2 text-muted-foreground">Courses you chose to save for your learning plan.</p>
      </div>
      <SavedLibrary type="course" />
    </div>
  )
}
