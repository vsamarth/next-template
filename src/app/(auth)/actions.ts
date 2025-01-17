'use server'

import { signIn as authSignIn } from '@/lib/auth'
import { signInSchema } from '@/lib/validation'
import { CredentialsSignin } from 'next-auth'
import { z } from 'zod'

export async function signIn(
  _: unknown,
  credentials: z.infer<typeof signInSchema>,
) {
  try {
    await authSignIn('credentials', { ...credentials, redirectTo: '/' })
  } catch (error) {
    if (error instanceof CredentialsSignin) {
      return 'Incorrect email or password'
    }
    throw error
  }
}
