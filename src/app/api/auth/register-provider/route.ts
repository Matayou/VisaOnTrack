import { NextResponse } from 'next/server'
import bcrypt from 'bcrypt'
import prisma from '@/lib/prisma'
import { sendVerificationEmail, sendWelcomeEmail } from '@/lib/email'

export async function POST(req: Request) {
  try {
    const { firstName, lastName, email, password } = await req.json()

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    })

    if (existingUser) {
      return NextResponse.json({ message: 'User already exists' }, { status: 400 })
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10)

    // Create user
    const user = await prisma.user.create({
      data: {
        firstName,
        lastName,
        email,
        password: hashedPassword,
        role: 'provider',
      },
    })

    // Generate verification token
    const verificationToken = await prisma.verificationToken.create({
      data: {
        identifier: email,
        token: `${Math.random().toString(36).substring(2, 15)}${Math.random().toString(36).substring(2, 15)}`,
        expires: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours from now
      },
    })

    // Send verification email
    await sendVerificationEmail(email, verificationToken.token)

    // Send welcome email
    await sendWelcomeEmail(email, firstName)

    return NextResponse.json({ message: 'User created successfully. Please check your email to verify your account.' }, { status: 201 })
  } catch (error) {
    console.error('Registration error:', error)
    return NextResponse.json({ message: 'An error occurred during registration' }, { status: 500 })
  }
}