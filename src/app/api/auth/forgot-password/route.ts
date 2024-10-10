import { NextResponse } from 'next/server';
import { findUserByEmail, createPasswordResetToken } from '@/lib/auth-service';
import { sendPasswordResetEmail } from '@/lib/email';

export async function POST(req: Request) {
  try {
    const { email } = await req.json();

    const user = await findUserByEmail(email);

    if (!user) {
      return NextResponse.json({ message: 'If a user with that email exists, a password reset link has been sent.' });
    }

    const resetToken = await createPasswordResetToken(user.id);

    await sendPasswordResetEmail(user.email, resetToken);

    return NextResponse.json({ message: 'If a user with that email exists, a password reset link has been sent.' });
  } catch (error) {
    console.error('Password reset request error:', error);
    return NextResponse.json({ error: 'An error occurred while processing your request.' }, { status: 500 });
  }
}
