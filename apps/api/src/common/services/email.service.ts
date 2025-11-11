import { Injectable } from '@nestjs/common';

@Injectable()
export class EmailService {
  /**
   * Send password reset email with reset token link
   * Per spec Section 1: Use Resend/SES for email delivery
   * 
   * ⚠️ SECURITY WARNING: This is currently a stub implementation.
   * Password reset (and future verification) flows will silently fail in production
   * because no actual email is sent. This MUST be replaced with a concrete Resend/SES
   * integration (or at minimum an injectable adapter) before treating those flows as complete.
   * 
   * @param email User email address
   * @param token Plaintext reset token (NOT stored in DB, only in email)
   * @param resetUrl Full reset URL with token parameter
   */
  async sendPasswordResetEmail(email: string, token: string, resetUrl: string): Promise<void> {
    // TODO: CRITICAL - Implement Resend/SES integration per spec Section 1
    // This is currently a stub that only logs "email sent" but does not actually send emails.
    // Password reset flows will silently fail in production until this is implemented.
    
    const resetLink = resetUrl || `${process.env.APP_URL || 'http://localhost:3000'}/auth/reset-password?token=${token}`;
    
    // Email template
    const subject = 'Reset Your Password - VisaOnTrack';
    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <title>Reset Your Password</title>
        </head>
        <body>
          <h1>Reset Your Password</h1>
          <p>You requested to reset your password. Click the link below to set a new password:</p>
          <p><a href="${resetLink}">Reset Password</a></p>
          <p><strong>This link will expire in 1 hour.</strong></p>
          <p>If you did not request this password reset, please ignore this email.</p>
          <hr>
          <p><small>This is an automated message. Please do not reply to this email.</small></p>
        </body>
      </html>
    `;
    
    // Log email sending (in development, can use console.log or actual email service)
    // SECURITY: Never log tokens or reset links - they contain sensitive tokens
    console.log(`[EmailService] Password reset email sent to: ${email} at ${new Date().toISOString()}`);
    
    // TODO: Replace with actual email service integration
    // await resend.emails.send({
    //   from: 'noreply@visaontrack.com',
    //   to: email,
    //   subject,
    //   html,
    // });
  }

  /**
   * Send email verification email with verification token link
   * RFC-003: Email verification flow
   * Per spec Section 1: Use Resend/SES for email delivery
   * 
   * ⚠️ SECURITY WARNING: This is currently a stub implementation.
   * Email verification flows will silently fail in production
   * because no actual email is sent. This MUST be replaced with a concrete Resend/SES
   * integration (or at minimum an injectable adapter) before treating those flows as complete.
   * 
   * @param email User email address
   * @param token Plaintext verification token (NOT stored in DB, only in email)
   * @param verifyUrl Full verification URL with token parameter
   */
  async sendVerificationEmail(email: string, token: string, verifyUrl: string): Promise<void> {
    // TODO: CRITICAL - Implement Resend/SES integration per spec Section 1
    // This is currently a stub that only logs "email sent" but does not actually send emails.
    // Email verification flows will silently fail in production until this is implemented.
    
    const verifyLink = verifyUrl || `${process.env.APP_URL || 'http://localhost:3000'}/auth/verify-email?token=${token}`;
    
    // Email template
    const subject = 'Verify Your Email - VisaOnTrack';
    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <title>Verify Your Email</title>
        </head>
        <body>
          <h1>Verify Your Email</h1>
          <p>Thank you for registering! Please verify your email address by clicking the link below:</p>
          <p><a href="${verifyLink}">Verify Email</a></p>
          <p><strong>This link will expire in 24 hours.</strong></p>
          <p>If you did not create an account, please ignore this email.</p>
          <hr>
          <p><small>This is an automated message. Please do not reply to this email.</small></p>
        </body>
      </html>
    `;
    
    // Log email sending (in development, can use console.log or actual email service)
    // SECURITY: Never log tokens or verification links in production - they contain sensitive tokens
    if (process.env.NODE_ENV !== 'production') {
      console.log(`\n🔧 [EmailService] DEV MODE - Verification email would be sent to: ${email}`);
      console.log(`🔧 [EmailService] Verification link: ${verifyLink}\n`);
    } else {
      console.log(`[EmailService] Verification email sent to: ${email} at ${new Date().toISOString()}`);
    }
    
    // TODO: Replace with actual email service integration
    // await resend.emails.send({
    //   from: 'noreply@visaontrack.com',
    //   to: email,
    //   subject,
    //   html,
    // });
  }
}

