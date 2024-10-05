import nodemailer from 'nodemailer'

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_SERVER_HOST,
  port: parseInt(process.env.EMAIL_SERVER_PORT || '587'),
  auth: {
    user: process.env.EMAIL_SERVER_USER,
    pass: process.env.EMAIL_SERVER_PASSWORD,
  },
  secure: false, // Use TLS
  tls: {
    ciphers: 'SSLv3',
    rejectUnauthorized: false
  }
})

export async function sendVerificationEmail(to: string, token: string) {
  const verificationUrl = `${process.env.NEXT_PUBLIC_APP_URL}/verify-email?token=${token}`

  await transporter.sendMail({
    from: process.env.EMAIL_FROM,
    to,
    subject: 'Verify your email for VisaOnTrack',
    html: `
      <p>Please click the link below to verify your email address:</p>
      <p><a href="${verificationUrl}">${verificationUrl}</a></p>
    `,
  })
}

export async function sendPasswordResetEmail(to: string, token: string) {
  const resetUrl = `${process.env.NEXT_PUBLIC_APP_URL}/reset-password?token=${token}`

  console.log('Sending password reset email to:', to)
  console.log('Reset URL:', resetUrl)

  try {
    const info = await transporter.sendMail({
      from: process.env.EMAIL_FROM,
      to,
      subject: 'Reset your password for VisaOnTrack',
      html: `
        <p>You requested a password reset. Click the link below to reset your password:</p>
        <p><a href="${resetUrl}">${resetUrl}</a></p>
        <p>If you didn't request this, you can safely ignore this email.</p>
      `,
    })

    console.log('Email sent successfully:', info.response)
  } catch (error) {
    console.error('Error sending email:', error)
  }
}