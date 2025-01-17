import { ChevronsUpDown } from 'lucide-react'

import {
  DropdownMenu,
  DropdownMenuTrigger,
} from '@/components/shared/dropdown-menu'
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/shared/sidebar'
import UserDropdown from './user-dropdown'
import { getUser } from '@/lib/auth'
import UserAvatar from './user-avatar'

export async function NavUser() {
  const user = await getUser()
  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size='lg'
              className='data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground'
            >
              <UserAvatar user={user} />
              <div className='grid flex-1 text-left text-sm leading-tight'>
                <span className='truncate font-semibold'>{user.name}</span>
                <span className='truncate text-xs'>{user.email}</span>
              </div>
              <ChevronsUpDown className='ml-auto size-4' />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <UserDropdown user={user} />
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}
