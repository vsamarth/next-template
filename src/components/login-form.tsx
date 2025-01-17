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
import { signInSchema } from '@/lib/validation'
import { startTransition, useActionState, useEffect } from 'react'
import { signIn } from '@/app/(auth)/actions'
import Icons from './icons'

type FormValues = z.infer<typeof signInSchema>

const fields = [
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

export function LoginForm() {
  const [serverError, formAction, isPending] = useActionState(signIn, undefined)
  const form = useForm<FormValues>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  })

  useEffect(() => {
    if (serverError && !isPending)
      form.setError(
        'password',
        { type: 'server', message: serverError },
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
        className='flex flex-col gap-6'
        noValidate
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <div className='flex flex-col items-center gap-2 text-center'>
          <h1 className='text-2xl font-bold'>Welcome Back</h1>
          <p className='text-balance text-sm text-muted-foreground'>
            Sign in below to continue to your account
          </p>
        </div>
        <div className='grid gap-6'>
          {fields.map(({ name, label, type }) => (
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
          ))}
          <Button type='submit' className='mt-2 w-full' disabled={isPending}>
            <span className='relative flex items-center'>
              Sign in
              <Icons.spinner
                className={cn(
                  'absolute -right-6 size-4 animate-spin',
                  !isPending && 'hidden',
                )}
              />
            </span>
          </Button>
        </div>
        <div className='text-center text-sm'>
          Don&apos;t have an account?{' '}
          <Link href='/register' className='underline underline-offset-4'>
            Sign up
          </Link>
        </div>
      </form>
    </Form>
  )
}
