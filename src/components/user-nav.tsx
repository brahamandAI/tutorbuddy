"use client"

import { useAuth } from '@/contexts/AuthContext'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/Button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export function UserNav({ user }: { user: any }) {
  const { logout } = useAuth()
  const initials = user?.name
    ?.split(' ')
    .map((n: string) => n[0])
    .join('')
    .toUpperCase() || '?'

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-8 w-8 rounded-full">
          <Avatar className="h-8 w-8">
            <AvatarImage src={user?.image} alt={user?.name} />
            <AvatarFallback>{initials}</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{user?.name}</p>
            <p className="text-xs leading-none text-muted-foreground">
              {user?.email}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem onClick={() => {
            const profilePath = user?.role === 'TUTOR' ? '/tutor/profile' : '/student/profile';
            window.location.href = profilePath;
          }}>
            Profile
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => {
            const dashboardPath = user?.role === 'TUTOR' ? '/tutor/dashboard' : '/student/dashboard';
            window.location.href = dashboardPath;
          }}>
            Dashboard
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => {
            const bookingsPath = user?.role === 'TUTOR' ? '/tutor/bookings' : '/student/bookings';
            window.location.href = bookingsPath;
          }}>
            {user?.role === 'TUTOR' ? 'My Bookings' : 'My Bookings'}
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={logout}>
          Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
} 