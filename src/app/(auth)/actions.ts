'use server'

import { signIn as authSignIn, signOut as authSignOut } from '@/lib/auth'
import db, { isUniqueViolationError } from '@/lib/db'
import { users } from '@/lib/db/schema'
import { signInSchema, signUpSchema } from '@/lib/validation'
import { hash } from '@node-rs/argon2'
import { CredentialsSignin } from 'next-auth'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'

export async function signIn(
  _: unknown,
  credentials: z.infer<typeof signInSchema>,
  redirectTo: string = '/',
): Promise<{ error: string; field: 'email' | 'password' } | undefined> {
  try {
    await authSignIn('credentials', { ...credentials, redirectTo })
  } catch (error) {
    if (error instanceof CredentialsSignin) {
      return {
        error: 'Incorrect email or password',
        field: 'password',
      }
    }
    throw error
  }
}

export async function signOut() {
  await authSignOut()
  revalidatePath('/', 'layout')
}

export async function signUp(
  _: unknown,
  credentials: z.infer<typeof signUpSchema>,
): Promise<
  { error: string; field: 'name' | 'email' | 'password' } | undefined
> {
  const validationResult = signUpSchema.safeParse(credentials)
  if (!validationResult.success) {
    const { message, path } = validationResult.error.errors[0]
    return { error: message, field: path[0] as 'name' | 'email' | 'password' }
  }

  const { name, email, password } = validationResult.data
  try {
    const passwordHash = await hash(password)
    await db.insert(users).values({
      name,
      email,
      passwordHash,
    })
    await authSignIn('credentials', { email, password, redirectTo: '/' })
  } catch (error) {
    if (isUniqueViolationError(error)) {
      return {
        error: 'An account with this email already exists.',
        field: 'email',
      }
    }
    throw error
  }
}
