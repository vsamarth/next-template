import { verifyEmail } from '@/lib/auth/verification'
import { redirect } from 'next/navigation'

export async function GET(
  request: Request,
  { params }: { params: Promise<{ token: string }> },
) {
  const { token } = await params
  await verifyEmail(token)
  redirect('/')
}
