import { pgTable, text, uuid, timestamp } from 'drizzle-orm/pg-core'
import { relations } from 'drizzle-orm'

export const users = pgTable('users', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: text('name').notNull(),
  email: text('email').notNull().unique(),
  passwordHash: text('password_hash').notNull(),
  emailVerified: timestamp('email_verified'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
})

export const emailVerificationSessions = pgTable(
  'email_verification_sessions',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    userId: uuid('user_id')
      .notNull()
      .references(() => users.id),
    token: text('token').notNull(),
    expiresAt: timestamp('expires_at').notNull(),
    createdAt: timestamp('created_at').notNull().defaultNow(),
  },
)

export const emailVerificationSessionsRelation = relations(
  emailVerificationSessions,
  ({ one }) => ({
    users: one(users, {
      fields: [emailVerificationSessions.userId],
      references: [users.id],
    }),
  }),
)
