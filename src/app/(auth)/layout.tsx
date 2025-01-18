import Icons from '@/components/icons'
import Link from 'next/link'

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <div className='container relative mx-auto grid min-h-svh'>
      <div className='flex flex-col gap-4 p-6 md:p-10'>
        <div className='flex justify-center gap-2 md:justify-start'>
          <Link href='#' className='flex items-center gap-2 font-medium'>
            <div className='flex h-6 w-6 items-center justify-center rounded-md bg-primary text-primary-foreground'>
              <Icons.logo className='size-4' />
            </div>
            Acme Inc.
          </Link>
        </div>
        <div className='flex flex-1 items-center justify-center'>
          <div className='w-full'>{children}</div>
        </div>
      </div>
    </div>
  )
}
