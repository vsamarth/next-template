import 'server-only'

import NextAuth, {
  CredentialsSignin,
  NextAuthConfig,
  type DefaultSession,
} from 'next-auth'
import Credentials from 'next-auth/providers/credentials'
import { signInSchema } from './validation'
import db from './db'
import { verify } from '@node-rs/argon2'
import { unauthorized } from 'next/navigation'

declare module 'next-auth' {
  interface Session {
    user: {
      email: string
      name: string
      avatar?: string
    } & DefaultSession['user']
  }
}

const authConfig: NextAuthConfig = {
  trustHost: true,
  providers: [
    Credentials({
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        const validationResult = signInSchema.safeParse(credentials)
        if (!validationResult.success) {
          throw new CredentialsSignin()
        }

        const { email, password } = validationResult.data

        const user = await db.query.users.findFirst({
          where: (users, { eq }) => eq(users.email, email),
        })
        if (!user || !(await verify(user.passwordHash, password))) {
          throw new CredentialsSignin()
        }

        return {
          email: user.email,
          name: user.name,
        }
      },
    }),
  ],
}

export const { auth, handlers, signOut, signIn } = NextAuth(authConfig)

export async function getUser() {
  const session = await auth()
  if (!session || !session.user) unauthorized()

  return session.user
}
