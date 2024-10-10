import { NextResponse } from 'next/server';
import { findPasswordResetToken, updateUserPassword, deletePasswordResetToken } from '@/lib/auth-service';

export async function POST(req: Request) {
  try {
    const { token, newPassword } = await req.json();

    const resetToken = await findPasswordResetToken(token);

    if (!resetToken || resetToken.expires < new Date()) {
      return NextResponse.json({ error: 'Invalid or expired token' }, { status: 400 });
    }

    await updateUserPassword(resetToken.userId, newPassword);
    await deletePasswordResetToken(token);

    return NextResponse.json({ message: 'Password reset successfully' });
  } catch (error) {
    console.error('Password reset error:', error);
    return NextResponse.json({ error: 'An error occurred while resetting the password' }, { status: 500 });
  }
}
