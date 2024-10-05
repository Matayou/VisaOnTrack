import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { v4 as uuidv4 } from 'uuid'
import { sendPasswordResetEmail } from '@/lib/email'

export async function POST(req: NextRequest) {
  const { email } = await req.json()

  if (!email) {
    return NextResponse.json({ message: 'Email is required' }, { status: 400 })
  }

  try {
    const user = await prisma.user.findUnique({
      where: { email }
    })

    if (!user) {
      // We don't want to reveal if the email exists or not for security reasons
      return NextResponse.json({ message: 'If an account exists for this email, a password reset link has been sent.' }, { status: 200 })
    }

    const token = uuidv4()
    const expires = new Date(Date.now() + 3600000) // 1 hour from now

    await prisma.passwordResetToken.create({
      data: {
        token,
        expires,
        userId: user.id
      }
    })

    await sendPasswordResetEmail(user.email, token)

    return NextResponse.json({ message: 'If an account exists for this email, a password reset link has been sent.' }, { status: 200 })
  } catch (error) {
    console.error('Forgot password error:', error)
    return NextResponse.json({ message: 'An error occurred while processing your request' }, { status: 500 })
  }
}