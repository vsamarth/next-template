import crypto from 'node:crypto'
import { getUser } from '.'
import db from '../db'
import { addHours } from 'date-fns'
import { emailVerificationSessions, users } from '../db/schema'
import { hash, verify } from '@node-rs/argon2'
import { eq } from 'drizzle-orm'

function generateToken() {
  return crypto.randomBytes(32).toString('base64url')
}

async function createVerificationSession(userId: string) {
  const token = generateToken()
  const expiresAt = addHours(new Date(), 24)
  const tokenHash = await hash(token)

  await db.insert(emailVerificationSessions).values({
    userId,
    tokenHash,
    expiresAt,
  })

  console.log('Email verification token:', token, ' for user:', userId)
}

async function invalidateVerificationSessions(userId: string) {
  await db
    .delete(emailVerificationSessions)
    .where(eq(emailVerificationSessions.userId, userId))
}

async function activeSessions(userId: string) {
  const now = new Date()
  return db.query.emailVerificationSessions.findFirst({
    where: (sessions, { eq, gt, and }) =>
      and(eq(sessions.userId, userId), gt(sessions.expiresAt, now)),
  })
}

export async function getVerificationSession(force: boolean = false): Promise<{
  email: string
}> {
  const user = await getUser()
  if (user.emailVerified) {
    throw new Error('Email already verified')
  }

  if (force) {
    await invalidateVerificationSessions(user.id)
  } else {
    const verificationSession = await activeSessions(user.id)

    if (verificationSession) {
      return { email: user.email }
    }
  }

  await createVerificationSession(user.id)
  return { email: user.email }
}

export async function verifyEmail(token: string) {
  const { id: userId } = await getUser()
  const verificationSession = await activeSessions(userId)
  if (
    !verificationSession ||
    !(await verify(verificationSession.tokenHash, token))
  ) {
    throw new Error('Invalid token')
  }
  await invalidateVerificationSessions(userId)
  await db
    .update(users)
    .set({ emailVerified: new Date() })
    .where(eq(users.id, userId))
}
