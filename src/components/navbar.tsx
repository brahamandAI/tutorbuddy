"use client"

import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { Button } from '@/components/ui/Button'
import {
  User,
  GraduationCap,
  Menu,
  ChevronDown,
  Brain,
  Sparkles,
  Star,
  Zap,
  Camera,
  Presentation,
} from 'lucide-react'
import { useAuthPopup } from '@/hooks/useAuthPopup'
import { useAuth } from '@/contexts/AuthContext'
import { useSidebar } from '@/contexts/SidebarContext'
import { UserNav } from '@/components/user-nav'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

const aiTools = [
  { name: 'AI Tutor', href: '/ai-teaching', icon: Brain },
  { name: 'Magic Explain', href: '/magic-explain', icon: Sparkles },
  { name: 'Micro Quiz', href: '/micro-quiz', icon: Star },
  { name: 'Doubt Battle', href: '/doubt-battle', icon: Zap },
  { name: 'Snap & Solve', href: '/snap-solve', icon: Camera },
  { name: 'Whiteboard', href: '/whiteboard', icon: Presentation },
]

export default function Navbar() {
  const { openPopup } = useAuthPopup()
  const { user, isAuthenticated } = useAuth()
  const { toggleSidebar } = useSidebar()
  const pathname = usePathname()
  const homeActive = pathname === '/'
  const aiActive = aiTools.some((tool) => pathname === tool.href || pathname?.startsWith(`${tool.href}/`))

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

        <div className="pointer-events-none absolute inset-0 hidden items-center justify-center sm:flex">
          <div className="pointer-events-auto flex items-center gap-1">
          <Link
            href="/"
            className={`rounded-xl px-3 py-2 text-sm font-medium ${
              homeActive ? 'bg-primary/10 text-primary' : 'text-muted-foreground hover:bg-muted hover:text-foreground'
            }`}
          >
            Home
          </Link>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                type="button"
                className={`inline-flex items-center gap-1 rounded-xl px-3 py-2 text-sm font-medium ${
                  aiActive ? 'bg-primary/10 text-primary' : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                }`}
              >
                AI Learning Tools
                <ChevronDown className="h-4 w-4" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-52">
              {aiTools.map((tool) => {
                const Icon = tool.icon
                return (
                  <DropdownMenuItem
                    key={tool.href}
                    asChild
                    onClick={(event) => {
                      if (!isAuthenticated) {
                        event.preventDefault()
                        openPopup('login')
                      }
                    }}
                  >
                    <Link href={tool.href}>
                      <Icon className="mr-2 h-4 w-4" />
                      {tool.name}
                    </Link>
                  </DropdownMenuItem>
                )
              })}
            </DropdownMenuContent>
          </DropdownMenu>
          </div>
        </div>

        <div className="ml-auto flex items-center">
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

      </div>
    </nav>
  )
}
