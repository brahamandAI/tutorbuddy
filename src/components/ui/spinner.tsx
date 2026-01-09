import { cn } from '@/lib/utils'

interface SpinnerProps {
  size?: 'sm' | 'md' | 'lg'
  className?: string
  text?: string
}

export function Spinner({ size = 'md', className, text }: SpinnerProps) {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-8 w-8',
    lg: 'h-12 w-12'
  }

  return (
    <div className={cn('flex flex-col items-center justify-center space-y-3', className)}>
      <div
        className={cn(
          'animate-spin rounded-full border-2 border-gray-200 border-t-blue-600',
          sizeClasses[size]
        )}
      />
      {text && (
        <p className="text-sm text-muted-foreground animate-pulse">{text}</p>
      )}
    </div>
  )
}

// Full page loading spinner
export function FullPageSpinner({ text = 'Loading...' }: { text?: string }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <Spinner size="lg" text={text} />
    </div>
  )
}

// Inline loading spinner
export function InlineSpinner({ size = 'sm', className }: Omit<SpinnerProps, 'text'>) {
  return <Spinner size={size} className={className} />
}

// Loading skeleton for cards
export function CardSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="h-48 bg-muted rounded-lg mb-4"></div>
      <div className="h-4 bg-muted rounded w-3/4 mb-2"></div>
      <div className="h-4 bg-muted rounded w-1/2"></div>
    </div>
  )
}

// Loading skeleton for booking cards
export function BookingSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <div className="flex items-start justify-between">
          <div className="flex items-start space-x-4">
            <div className="h-12 w-12 bg-muted rounded-full"></div>
            <div className="flex-1 space-y-3">
              <div className="h-4 bg-muted rounded w-1/3"></div>
              <div className="h-3 bg-muted rounded w-1/4"></div>
              <div className="space-y-2">
                <div className="h-3 bg-muted rounded w-1/2"></div>
                <div className="h-3 bg-muted rounded w-2/3"></div>
                <div className="h-3 bg-muted rounded w-1/3"></div>
              </div>
            </div>
          </div>
          <div className="space-y-2">
            <div className="h-8 bg-muted rounded w-20"></div>
            <div className="h-8 bg-muted rounded w-24"></div>
          </div>
        </div>
      </div>
    </div>
  )
} 