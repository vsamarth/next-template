import AuthForm from '@/components/auth-form'
import { type Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Sign in',
}

export default function Login() {
  return <AuthForm variant='sign-in' />
}
