'use server'

import { signIn as authSignIn, signOut as authSignOut } from '@/lib/auth'
import { signInSchema } from '@/lib/validation'
import { CredentialsSignin } from 'next-auth'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'

export async function signIn(
  _: unknown,
  credentials: z.infer<typeof signInSchema>,
) {
  try {
    await authSignIn('credentials', { ...credentials, redirectTo: '/' })
    revalidatePath('/', 'layout')
  } catch (error) {
    if (error instanceof CredentialsSignin) {
      return 'Incorrect email or password'
    }
    throw error
  }
}

export async function signOut() {
  await authSignOut()
  revalidatePath('/', 'layout')
}
