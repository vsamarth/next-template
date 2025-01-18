import { Button } from '@/components/shared/button'
import { getUser } from '@/lib/auth'
import Link from 'next/link'
import Image from 'next/image'
import { type Metadata } from 'next'
import db from '@/lib/db'
import { addHours } from 'date-fns'
import { emailVerificationSessions } from '@/lib/db/schema'

export const metadata: Metadata = {
  title: 'Verify your email',
}

function generateVerificationToken() {
  return 'abcdef'
}

async function sendLink() {
  const now = new Date()
  const { id, email } = await getUser()
  const session = await db.query.emailVerificationSessions.findFirst({
    where: (sessions, { eq, and, gt }) =>
      and(eq(sessions.userId, id), gt(sessions.expiresAt, now)),
    columns: {
      id: true,
    },
  })
  if (session) {
    return {
      email,
    }
  }

  const token = generateVerificationToken()
  const expiresAt = addHours(now, 24)
  await db.insert(emailVerificationSessions).values({
    userId: id,
    token,
    expiresAt,
  })
  console.log('Email verification token:', token)
  return {
    email,
  }
}

export default async function EmailVerification() {
  const { email } = await sendLink()
  return (
    <div className='container relative mx-auto flex max-w-md flex-col items-center justify-center p-4'>
      <div className='flex w-full flex-col items-center gap-8'>
        <div className='text-center'>
          <h1 className='mb-4 text-2xl font-semibold'>Verify your email</h1>
          <p className='text-sm text-muted-foreground'>
            Click on the link we sent to{' '}
            <span className='font-medium text-gray-900'>{email}</span> to finish
            your setting up your account.
          </p>
        </div>

        <div className='flex w-full max-w-80 flex-col gap-6'>
          <Button variant='outline' size='lg' asChild>
            <Link href='https://mail.google.com/mail/u/0' target='_blank'>
              <Image src='/gmail.svg' width={16} height={16} alt='Gmail' />
              Open Gmail
            </Link>
          </Button>
          <Button variant='outline' size='lg' asChild>
            <Link href='https://outlook.live.com/mail/0/inbox' target='_blank'>
              <Image src='/outlook.svg' width={16} height={16} alt='Outlook' />
              Open Outlook
            </Link>
          </Button>
        </div>

        <div className='flex w-full flex-col items-center gap-4 text-sm text-muted-foreground'>
          <p>
            Didn&apos;t receive the email?{' '}
            <button className='text-primary underline underline-offset-4'>
              Resend it
            </button>
            .
          </p>
          <p>
            Wrong address?{' '}
            <button className='text-primary underline underline-offset-4'>
              Sign out
            </button>{' '}
            to continue with a different email.
          </p>
        </div>
      </div>
    </div>
  )
}
