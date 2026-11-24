'use client'

import { ReactNode, useEffect } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { useAuthPopup } from '@/hooks/useAuthPopup'
import Home from '@/app/page'
import { FullPageSpinner } from '@/components/ui/spinner'

function isHomePath(pathname: string) {
  return pathname === '/' || pathname === ''
}

function pathOf(url: unknown) {
  if (typeof url !== 'string' || url.length === 0) return null
  try {
    const parsed = new URL(url, window.location.origin)
    if (parsed.origin !== window.location.origin) return null
    return parsed.pathname
  } catch {
    return null
  }
}

export default function GuestHomeGate({ children }: { children: ReactNode }) {
  const pathname = usePathname() || '/'
  const router = useRouter()
  const { isAuthenticated, isAuthLoading } = useAuth()
  const { openPopup } = useAuthPopup()
  const guest = !isAuthLoading && !isAuthenticated

  useEffect(() => {
    if (!guest || isHomePath(pathname)) return
    openPopup('login')
    router.replace('/')
  }, [guest, pathname, openPopup, router])

  useEffect(() => {
    if (!guest) return

    const block = () => {
      openPopup('login')
    }

    const onClick = (event: MouseEvent) => {
      const anchor = (event.target as HTMLElement | null)?.closest('a')
      if (!anchor) return
      const href = anchor.getAttribute('href')
      if (!href || href.startsWith('#') || href.startsWith('mailto:') || href.startsWith('tel:')) return
      const nextPath = pathOf(href)
      if (!nextPath || isHomePath(nextPath)) return
      event.preventDefault()
      event.stopPropagation()
      block()
    }

    const originalPush = history.pushState.bind(history)
    const originalReplace = history.replaceState.bind(history)
    const guard = (url: unknown, fallback: (...args: Parameters<History['pushState']>) => void, args: Parameters<History['pushState']>) => {
      const nextPath = pathOf(url)
      if (nextPath && !isHomePath(nextPath)) {
        block()
        if (!isHomePath(window.location.pathname)) {
          originalReplace(null, '', '/')
        }
        return
      }
      fallback(...args)
    }

    history.pushState = ((...args: Parameters<History['pushState']>) => {
      guard(args[2], originalPush, args)
    }) as History['pushState']
    history.replaceState = ((...args: Parameters<History['replaceState']>) => {
      guard(args[2], originalReplace, args)
    }) as History['replaceState']

    document.addEventListener('click', onClick, true)
    return () => {
      history.pushState = originalPush
      history.replaceState = originalReplace
      document.removeEventListener('click', onClick, true)
    }
  }, [guest, openPopup])

  if (isAuthLoading && !isHomePath(pathname)) {
    return <FullPageSpinner />
  }

  if (guest && !isHomePath(pathname)) {
    return <Home />
  }

  return <>{children}</>
}
