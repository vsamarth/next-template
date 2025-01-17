'use client'

import { BadgeCheck, Bell, CreditCard, LogOut, Sparkles } from 'lucide-react'

import {
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from '@/components/shared/dropdown-menu'
import { useSidebar } from './shared/sidebar'
import { Session } from 'next-auth'
import UserAvatar from './user-avatar'
import { signOut } from '@/app/(auth)/actions'

export default function UserDropdown({ user }: { user: Session['user'] }) {
  const { isMobile } = useSidebar()
  return (
    <DropdownMenuContent
      className='w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg'
      side={isMobile ? 'bottom' : 'right'}
      align='end'
      sideOffset={4}
    >
      <DropdownMenuLabel className='p-0 font-normal'>
        <div className='flex items-center gap-2 px-1 py-1.5 text-left text-sm'>
          <UserAvatar user={user} />
          <div className='grid flex-1 text-left text-sm leading-tight'>
            <span className='truncate font-semibold'>{user.name}</span>
            <span className='truncate text-xs'>{user.email}</span>
          </div>
        </div>
      </DropdownMenuLabel>
      <DropdownMenuSeparator />
      <DropdownMenuGroup>
        <DropdownMenuItem>
          <Sparkles />
          Upgrade to Pro
        </DropdownMenuItem>
      </DropdownMenuGroup>
      <DropdownMenuSeparator />
      <DropdownMenuGroup>
        <DropdownMenuItem>
          <BadgeCheck />
          Account
        </DropdownMenuItem>
        <DropdownMenuItem>
          <CreditCard />
          Billing
        </DropdownMenuItem>
        <DropdownMenuItem>
          <Bell />
          Notifications
        </DropdownMenuItem>
      </DropdownMenuGroup>
      <DropdownMenuSeparator />
      <DropdownMenuItem asChild>
        <button
          className='w-full cursor-pointer'
          onClick={async () => {
            await signOut()
          }}
        >
          <LogOut />
          Sign out
        </button>
      </DropdownMenuItem>
    </DropdownMenuContent>
  )
}
