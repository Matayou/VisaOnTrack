// Mock email service for development
const sendEmail = async (to: string, subject: string, html: string) => {
  console.log('Sending email:');
  console.log('To:', to);
  console.log('Subject:', subject);
  console.log('Content:', html);
};

export async function sendVerificationEmail(to: string, token: string) {
  const verificationUrl = `${process.env.NEXTAUTH_URL}/api/auth/verify-email?token=${token}`;

  await sendEmail(
    to,
    'Verify your email for VisaOnTrack',
    `
      <h1>Welcome to VisaOnTrack!</h1>
      <p>Please click the link below to verify your email address:</p>
      <a href="${verificationUrl}">${verificationUrl}</a>
      <p>If you didn't request this email, you can safely ignore it.</p>
    `
  );
}

export async function sendWelcomeEmail(to: string, firstName: string) {
  await sendEmail(
    to,
    'Welcome to VisaOnTrack',
    `
      <h1>Welcome to VisaOnTrack, ${firstName}!</h1>
      <p>We're excited to have you on board. Here are some next steps:</p>
      <ul>
        <li>Complete your profile</li>
        <li>Explore available visa services</li>
        <li>Connect with service providers</li>
      </ul>
      <p>If you have any questions, feel free to reach out to our support team.</p>
    `
  );
}

export async function sendPasswordResetEmail(to: string, token: string) {
  const resetUrl = `${process.env.NEXTAUTH_URL}/reset-password?token=${token}`;

  await sendEmail(
    to,
    'Reset your password for VisaOnTrack',
    `
      <h1>Reset Your Password</h1>
      <p>You requested a password reset for your VisaOnTrack account. Click the link below to set a new password:</p>
      <a href="${resetUrl}">${resetUrl}</a>
      <p>If you didn't request this email, you can safely ignore it.</p>
      <p>This link will expire in 1 hour.</p>
    `
  );
}