import { NextResponse } from 'next/server'
import { AuthService } from '@/lib/auth-service'

export async function POST(req: Request) {
  try {
    const { email } = await req.json()

    await AuthService.requestPasswordReset(email)

    return NextResponse.json({ message: 'If an account with that email exists, we have sent a password reset link.' })
  } catch (error) {
    console.error('Password reset request error:', error)
    return NextResponse.json({ message: 'An error occurred while processing your request' }, { status: 500 })
  }
}