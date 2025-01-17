import { z, TypeOf } from 'zod'
const envSchema = z.object({
  AUTH_SECRET: z.string().min(32),
  DATABASE_URL: z.string(),
})
/* eslint-disable */
declare global {
  namespace NodeJS {
    interface ProcessEnv extends TypeOf<typeof envSchema> {}
  }
}
/* eslint-enable */
try {
  envSchema.parse(process.env)
} catch (err) {
  if (err instanceof z.ZodError) {
    const { fieldErrors } = err.flatten()
    const errorMessage = Object.entries(fieldErrors)
      .map(([field, errors]) =>
        errors ? `${field}: ${errors.join(', ')}` : field,
      )
      .join('\n  ')
    throw new Error(`Missing environment variables:\n  ${errorMessage}`)
  }
}
