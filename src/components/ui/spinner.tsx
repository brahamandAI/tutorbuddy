'use client'

import { useEffect, useState } from 'react'
import { Lottie } from 'lottie-react'
import { cn } from '@/lib/utils'

interface SpinnerProps {
  size?: 'sm' | 'md' | 'lg'
  className?: string
  text?: string
}

const sizeClasses = {
  sm: 'h-16 w-16',
  md: 'h-28 w-28',
  lg: 'h-40 w-40',
}

let animationPromise: Promise<unknown> | null = null

function loadAnimation() {
  if (!animationPromise) {
    animationPromise = fetch('/animation/loading.json').then((response) => response.json())
  }
  return animationPromise
}

export function Spinner({ size = 'md', className, text }: SpinnerProps) {
  const [animationData, setAnimationData] = useState<object | null>(null)

  useEffect(() => {
    let active = true
    loadAnimation().then((data) => {
      if (active) setAnimationData(data as object)
    })
    return () => {
      active = false
    }
  }, [])

  return (
    <div className={cn('flex flex-col items-center justify-center', className)}>
      {animationData ? (
        <Lottie src={animationData} autoplay loop className={sizeClasses[size]} />
      ) : (
        <div className={sizeClasses[size]} />
      )}
      {text && <p className="mt-1 text-sm text-muted-foreground">{text}</p>}
    </div>
  )
}

export function FullPageSpinner({ text = 'Loading...' }: { text?: string }) {
  return (
    <div className="flex h-[calc(100dvh-4rem)] w-full items-center justify-center">
      <Spinner size="lg" text={text} />
    </div>
  )
}

export function InlineSpinner({ size = 'sm', className }: Omit<SpinnerProps, 'text'>) {
  return <Spinner size={size} className={className} />
}

export function CardSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="h-48 bg-muted rounded-lg mb-4"></div>
      <div className="h-4 bg-muted rounded w-3/4 mb-2"></div>
      <div className="h-4 bg-muted rounded w-1/2"></div>
    </div>
  )
}

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
