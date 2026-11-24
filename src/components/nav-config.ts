export type GlobalNavItem = {
  name: string
  href: string
  requiresAuth?: boolean
  match?: string[]
}

export function globalNav(role?: string): GlobalNavItem[] {
  const findTutors = role === 'STUDENT' ? '/student/tutors' : '/tutors'
  const sessions = role === 'TUTOR' ? '/tutor/bookings' : '/student/bookings'
  const messages = role === 'TUTOR' ? '/tutor/messages' : '/student/messages'

  return [
    { name: 'Home', href: '/' },
    { name: 'Explore Courses', href: '/courses' },
    { name: 'Find Tutors', href: findTutors, match: ['/tutors', '/student/tutors'] },
    {
      name: 'My Sessions',
      href: sessions,
      requiresAuth: true,
      match: ['/student/bookings', '/tutor/bookings', '/student/session', '/tutor/session'],
    },
    {
      name: 'Messages',
      href: messages,
      requiresAuth: true,
      match: ['/student/messages', '/tutor/messages'],
    },
  ]
}

export function isNavActive(pathname: string | null, item: GlobalNavItem) {
  if (!pathname) return false
  if (item.href === '/' && !item.match) return pathname === '/'
  const targets = item.match ?? [item.href]
  return targets.some((href) => pathname === href || pathname.startsWith(`${href}/`))
}
