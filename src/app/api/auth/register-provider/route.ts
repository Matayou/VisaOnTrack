import { NextResponse } from 'next/server'
import { AuthService } from '@/lib/auth-service'

export async function POST(req: Request) {
  try {
    const { firstName, lastName, email, password } = await req.json()

    console.log('Received registration data:', { firstName, lastName, email })

    const user = await AuthService.registerUser(firstName, lastName, email, password, 'PROVIDER')

    console.log('User created successfully:', user.id)

    return NextResponse.json({ message: 'User created successfully. Please check your email to verify your account.' }, { status: 201 })
  } catch (error: unknown) {
    console.error('Registration error:', error)
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred'
    return NextResponse.json({ message: 'An error occurred during registration', error: errorMessage }, { status: 500 })
  }
}