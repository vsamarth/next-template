import { z } from 'zod'

export const signInSchema = z.object({
  email: z
    .string()
    .min(1, 'Email address is required')
    .email('Invalid email address'),
  password: z.string(),
})

export const signUpSchema = z.object({
  email: z
    .string()
    .min(1, 'Email address is required')
    .email('Invalid email address'),
  name: z.string().min(1, 'Full name is required'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
})
