"use client"

import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui/Button'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import {
  User,
  GraduationCap,
  Menu,
  LogOut,
} from 'lucide-react'
import { useState, type MouseEvent } from 'react'
import { useAuthPopup } from '@/hooks/useAuthPopup'
import { useAuth } from '@/contexts/AuthContext'
import { usePathname } from 'next/navigation'
import { useSidebar } from '@/contexts/SidebarContext'
import { UserNav } from '@/components/user-nav'
import { globalNav, isNavActive } from '@/components/nav-config'

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const { openPopup } = useAuthPopup()
  const { user, isAuthenticated, logout } = useAuth()
  const pathname = usePathname()
  const { toggleSidebar } = useSidebar()

  const links = globalNav(user?.role)

  const openIfNeeded = (event: MouseEvent, requiresAuth?: boolean) => {
    if (requiresAuth && !isAuthenticated) {
      event.preventDefault()
      openPopup('login')
    }
  }

  return (
    <nav className="border-b border-border/80 bg-card/80 backdrop-blur-md supports-[backdrop-filter]:bg-card/70 fixed top-0 left-0 right-0 z-50">
      <div className="relative flex h-16 items-center px-3 sm:px-4">
        <div className="flex items-center gap-3">
          {isAuthenticated && (
            <button
              onClick={toggleSidebar}
              className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-foreground hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              aria-label="Toggle sidebar"
              title="Toggle sidebar"
            >
              <Menu className="h-5 w-5" />
            </button>
          )}

          <Link href="/" className="flex shrink-0 items-center gap-2 hover:opacity-80 transition-opacity">
            <Image
              src="/images/logo.jpeg"
              alt="TutorBuddy Logo"
              width={36}
              height={36}
              className="h-9 w-9 rounded-lg object-cover"
            />
            <span className="font-bold text-lg bg-gradient-to-r from-primary to-brand-primary-end bg-clip-text text-transparent">
              TutorBuddy
            </span>
          </Link>
        </div>

        {isAuthenticated && (
        <div className="pointer-events-none absolute inset-0 hidden items-center justify-center lg:flex">
          <div className="pointer-events-auto flex items-center gap-1">
            {links.map((item) => {
              const active = isNavActive(pathname, item)
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={(event) => openIfNeeded(event, item.requiresAuth)}
                  className={`rounded-xl px-3 py-2 text-sm font-medium transition-colors ${
                    active
                      ? 'bg-primary/10 text-primary'
                      : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                  }`}
                >
                  {item.name}
                </Link>
              )
            })}
          </div>
        </div>
        )}

        <div className="ml-auto hidden lg:flex items-center">
          {!isAuthenticated ? (
            <div className="flex space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => openPopup('register')}
                className="hover:bg-primary/10"
              >
                <User className="mr-2 h-4 w-4" />
                Sign Up
              </Button>
              <Button
                size="sm"
                onClick={() => openPopup('login')}
                className="bg-gradient-to-r from-primary to-brand-primary-end hover:opacity-95"
              >
                <GraduationCap className="mr-2 h-4 w-4" />
                Sign In
              </Button>
            </div>
          ) : (
            <UserNav user={user} />
          )}
        </div>

        <div className="ml-auto lg:hidden flex items-center gap-1">
          {isAuthenticated && user ? <UserNav user={user} /> : (
            <Button size="sm" onClick={() => openPopup('login')}>
              Sign In
            </Button>
          )}
          {isAuthenticated && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
            >
              <Menu className="h-5 w-5" />
            </Button>
          )}
        </div>
      </div>

      {isAuthenticated && isMenuOpen && (
        <div className="lg:hidden border-t border-border bg-card px-3 py-3">
          <div className="space-y-1">
            {links.map((item) => {
              const active = isNavActive(pathname, item)
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={(event) => {
                    openIfNeeded(event, item.requiresAuth)
                    setIsMenuOpen(false)
                  }}
                  className={`flex items-center rounded-xl px-3 py-2 text-sm font-medium ${
                    active
                      ? 'bg-primary/10 text-primary'
                      : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                  }`}
                >
                  {item.name}
                </Link>
              )
            })}
          </div>

          <div className="mt-3 space-y-1 border-t border-border pt-3">
            {!isAuthenticated ? (
              <>
                <button
                  onClick={() => {
                    openPopup('register')
                    setIsMenuOpen(false)
                  }}
                  className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground"
                >
                  <User className="h-4 w-4" />
                  Sign Up
                </button>
                <button
                  onClick={() => {
                    openPopup('login')
                    setIsMenuOpen(false)
                  }}
                  className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground"
                >
                  <GraduationCap className="h-4 w-4" />
                  Sign In
                </button>
              </>
            ) : (
              <>
                <div className="flex items-center gap-2 px-3 py-2">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback>
                      {user?.name?.split(' ').map((part: string) => part[0]).join('').toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium">{user?.name}</p>
                    <p className="truncate text-xs text-muted-foreground capitalize">
                      {user?.role?.toLowerCase()}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    logout()
                    setIsMenuOpen(false)
                  }}
                  className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground"
                >
                  <LogOut className="h-4 w-4" />
                  Log out
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  )
}
