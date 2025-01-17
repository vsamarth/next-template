import AuthForm from '@/components/auth-form'
import { type Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Create your account',
}

export default function Login() {
  return <AuthForm variant='register' />
}
