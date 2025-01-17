import { Avatar, AvatarFallback, AvatarImage } from '@/components/shared/avatar'
import { Session } from 'next-auth'
function avatarInitials(fullName: string): string {
  const nameParts = fullName.trim().split(/\s+/)
  const initials = nameParts
    .filter(Boolean)
    .map((name) => name[0].toUpperCase())
    .slice(0, 2)
    .join('')
  return initials
}

export default function UserAvatar({ user }: { user: Session['user'] }) {
  return (
    <Avatar className='size-8 rounded-full'>
      <AvatarImage src={user.avatar} alt={user.name} />
      <AvatarFallback className='rounded-full'>
        {avatarInitials(user.name)}
      </AvatarFallback>
    </Avatar>
  )
}
