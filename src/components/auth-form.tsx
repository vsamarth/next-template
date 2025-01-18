'use client'

import { Button } from '@/components/shared/button'
import { Input } from '@/components/shared/input'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/shared/form'
import { cn } from '@/lib/utils'
import Link from 'next/link'
import { signInSchema, signUpSchema } from '@/lib/validation'
import { startTransition, useActionState, useEffect } from 'react'
import { signIn, signUp } from '@/app/(auth)/actions'
import Icons from './icons'

type FormValues = z.infer<typeof signUpSchema>

const registerFields = [
  { name: 'email' as const, label: 'Email', type: 'email' },
  { name: 'name' as const, label: 'Full Name', type: 'text' },
  { name: 'password' as const, label: 'Password', type: 'password' },
]
const signInFields = [
  { name: 'email' as const, label: 'Email', type: 'email' },
  {
    name: 'password' as const,
    label: () => (
      <div className='flex items-center'>
        <FormLabel>Password</FormLabel>
        <Link
          href='/forgot-password'
          className='ml-auto text-sm underline-offset-4 hover:underline'
        >
          Forgot your password?
        </Link>
      </div>
    ),
    type: 'password',
  },
]

export default function AuthForm({
  variant = 'sign-in',
}: {
  variant?: 'sign-in' | 'register'
}) {
  const isSignIn = variant === 'sign-in'
  const [serverError, formAction, isPending] = useActionState(
    isSignIn ? signIn : signUp,
    undefined,
  )
  const form = useForm<FormValues>({
    resolver: zodResolver(isSignIn ? signInSchema : signUpSchema),
    defaultValues: isSignIn
      ? { email: '', password: '' }
      : { email: '', name: '', password: '' },
  })

  useEffect(() => {
    if (serverError && !isPending)
      form.setError(
        serverError.field,
        { type: 'server', message: serverError.error },
        { shouldFocus: true },
      )
  }, [serverError, form, isPending])

  function onSubmit(data: FormValues) {
    startTransition(() => {
      formAction(data)
    })
  }

  return (
    <Form {...form}>
      <form
        className='mx-auto grid w-full max-w-sm gap-6'
        noValidate
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <div className='flex flex-col items-center gap-2 text-center'>
          <h1 className='text-2xl font-semibold'>
            {isSignIn ? 'Welcome Back' : 'Create your account'}
          </h1>
          {isSignIn && (
            <p className='text-balance text-sm font-medium text-muted-foreground'>
              Sign in below to continue to your account
            </p>
          )}
        </div>
        <div className='grid gap-6'>
          {(isSignIn ? signInFields : registerFields).map(
            ({ name, label, type }) => (
              <FormField
                key={name}
                control={form.control}
                name={name}
                render={({ field, fieldState: { invalid } }) => (
                  <FormItem>
                    <FormLabel>
                      {typeof label === 'function' ? label() : label}
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type={type}
                        className={cn(
                          invalid &&
                            'border-destructive focus-visible:ring-destructive/30',
                        )}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            ),
          )}
          <Button type='submit' className='mt-2 w-full' disabled={isPending}>
            <span className='relative flex items-center'>
              {isSignIn ? 'Sign in' : 'Create account'}
              <Icons.spinner
                className={cn(
                  'absolute -right-6 size-4 animate-spin',
                  !isPending && 'hidden',
                )}
              />
            </span>
          </Button>
        </div>
        <div className='text-center text-sm text-muted-foreground'>
          {isSignIn ? "Don't" : 'Already'} have an account?{' '}
          <Link
            href={isSignIn ? '/register' : '/login'}
            className='text-primary underline underline-offset-4'
          >
            {isSignIn ? 'Sign up' : 'Sign in'}
          </Link>
        </div>
      </form>
    </Form>
  )
}
