import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { sendPasswordResetEmail } from '@/lib/email'

export async function POST(req: Request) {
  try {
    const { email } = await req.json()

    const user = await prisma.user.findUnique({
      where: { email },
    })

    if (user) {
      const resetToken = `${Math.random().toString(36).substring(2, 15)}${Math.random().toString(36).substring(2, 15)}`
      const resetTokenExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 hours from now

      await prisma.user.update({
        where: { id: user.id },
        data: {
          resetToken,
          resetTokenExpiry,
        },
      })

      await sendPasswordResetEmail(email, resetToken)
    }

    // Always return a success message to prevent email enumeration
    return NextResponse.json({ message: 'If an account with that email exists, we have sent a password reset link' })
  } catch (error) {
    console.error('Password reset error:', error)
    return NextResponse.json({ message: 'An error occurred while processing your request' }, { status: 500 })
  }
}