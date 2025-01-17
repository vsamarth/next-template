import { z } from 'zod'

export const signInSchema = z.object({
  email: z
    .string()
    .min(1, 'Email address is required')
    .email('Invalid email address'),
  password: z.string(),
})
