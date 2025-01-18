import { getUser } from '@/lib/auth'
import db from '@/lib/db'
import { emailVerificationSessions } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'
import { redirect } from 'next/navigation'

export async function GET(
  request: Request,
  { params }: { params: { token: string } },
) {
  const { token } = await params
  const { id: userId } = await getUser()

  const verificationSession =
    await db.query.emailVerificationSessions.findFirst({
      where: (sessions, { and, eq }) =>
        and(eq(sessions.token, token), eq(sessions.userId, userId)),
    })
  if (!verificationSession) {
    redirect('/verify-email')
  }

  await db
    .delete(emailVerificationSessions)
    .where(eq(emailVerificationSessions.id, verificationSession.id))

  redirect('/')
}
