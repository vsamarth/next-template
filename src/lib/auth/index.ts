import NextAuth, { CredentialsSignin, NextAuthConfig } from 'next-auth'
import Credentials from 'next-auth/providers/credentials'
import { signInSchema } from '../validation'
import db from '../db'
import { verify } from '@node-rs/argon2'

const authConfig: NextAuthConfig = {
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
          email,
        }
      },
    }),
  ],
}

export const { auth, handlers, signOut, signIn } = NextAuth(authConfig)
