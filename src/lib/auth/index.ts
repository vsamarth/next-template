import 'server-only'

import NextAuth, {
  CredentialsSignin,
  NextAuthConfig,
  type DefaultSession,
} from 'next-auth'
import Credentials from 'next-auth/providers/credentials'
import { signInSchema } from '../validation'
import db from '../db'
import { verify } from '@node-rs/argon2'
import { unauthorized } from 'next/navigation'
import { cache } from 'react'

declare module 'next-auth' {
  interface Session {
    user: {
      id: string
      email: string
      name: string
    } & DefaultSession['user']
  }
}

const authConfig: NextAuthConfig = {
  trustHost: true,
  pages: {
    signIn: '/login',
    error: '/login',
    newUser: '/register',
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
      }
      return token
    },
    async session({ session, token }) {
      session.user.id = token.id as string
      return session
    },
  },
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

        return user
      },
    }),
  ],
}

export const { auth, handlers, signOut, signIn } = NextAuth(authConfig)

export const getUser = cache(async () => {
  const session = await auth()
  if (!session || !session.user) {
    unauthorized()
  }

  const user = await db.query.users.findFirst({
    where: (users, { eq }) => eq(users.id, session.user.id),
    columns: {
      id: true,
      email: true,
      name: true,
      emailVerified: true,
    },
  })

  if (!user) {
    unauthorized()
  }
  return user
})
