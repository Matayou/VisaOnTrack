import { NextResponse } from 'next/server'
import { AuthService } from '@/lib/auth-service'

export async function POST(req: Request) {
  try {
    const { token, password } = await req.json()

    await AuthService.resetPassword(token, password)

    return NextResponse.json({ message: 'Password reset successfully' })
  } catch (error) {
    console.error('Password reset error:', error)
    const errorMessage = error instanceof Error ? error.message : 'An error occurred while resetting your password'
    return NextResponse.json({ message: errorMessage }, { status: 400 })
  }
}