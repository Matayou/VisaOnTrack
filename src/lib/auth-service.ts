import prisma from '@/lib/prisma'
import bcrypt from 'bcrypt'
import { sendVerificationEmail, sendPasswordResetEmail } from '@/lib/email'

export class AuthService {
  static async registerUser(firstName: string, lastName: string, email: string, password: string, role: 'PROVIDER' | 'SEEKER') {
    const existingUser = await prisma.user.findUnique({ where: { email } })
    if (existingUser) {
      throw new Error('User already exists')
    }

    const hashedPassword = await bcrypt.hash(password, 10)
    const verificationToken = this.generateToken()

    const user = await prisma.user.create({
      data: {
        firstName,
        lastName,
        email,
        password: hashedPassword,
        role,
        verificationToken,
      },
    })

    await sendVerificationEmail(email, verificationToken)

    return user
  }

  static async verifyEmail(token: string) {
    const user = await prisma.user.findFirst({ where: { verificationToken: token } })
    if (!user) {
      throw new Error('Invalid verification token')
    }

    await prisma.user.update({
      where: { id: user.id },
      data: { emailVerified: new Date(), verificationToken: null },
    })

    return user
  }

  static async signIn(email: string, password: string) {
    const user = await prisma.user.findUnique({ where: { email } })
    if (!user) {
      throw new Error('Invalid credentials')
    }

    const isPasswordValid = await bcrypt.compare(password, user.password)
    if (!isPasswordValid) {
      throw new Error('Invalid credentials')
    }

    if (!user.emailVerified) {
      throw new Error('Email not verified')
    }

    return user
  }

  static async requestPasswordReset(email: string) {
    const user = await prisma.user.findUnique({ where: { email } })
    if (!user) {
      // Don't reveal that the user doesn't exist
      return
    }

    await prisma.passwordResetToken.deleteMany({ where: { userId: user.id } })

    const token = this.generateToken()
    const expires = new Date(Date.now() + 3600000) // 1 hour from now

    await prisma.passwordResetToken.create({
      data: {
        token,
        expires,
        userId: user.id,
      },
    })

    await sendPasswordResetEmail(email, token)
  }

  static async resetPassword(token: string, newPassword: string) {
    const passwordReset = await prisma.passwordResetToken.findUnique({
      where: { token },
      include: { user: true },
    })

    if (!passwordReset || passwordReset.expires < new Date()) {
      throw new Error('Invalid or expired password reset token')
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10)

    await prisma.user.update({
      where: { id: passwordReset.userId },
      data: { password: hashedPassword },
    })

    await prisma.passwordResetToken.delete({ where: { id: passwordReset.id } })
  }

  private static generateToken() {
    return `${Math.random().toString(36).substring(2, 15)}${Math.random().toString(36).substring(2, 15)}`
  }
}