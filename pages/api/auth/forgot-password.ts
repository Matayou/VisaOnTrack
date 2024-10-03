import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '@/lib/prisma';
import { v4 as uuidv4 } from 'uuid';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { email } = req.body;
  console.log('Received forgot password request for email:', email);

  try {
    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      console.log('No user found with email:', email);
      return res.status(200).json({ message: 'If an account with that email exists, we sent a password reset link.' });
    }

    console.log('User found:', user.id);

    const token = uuidv4();
    const expires = new Date(Date.now() + 3600000); // 1 hour from now

    await prisma.passwordResetToken.create({
      data: {
        token,
        expires,
        userId: user.id,
      },
    });

    const resetLink = `${process.env.NEXT_PUBLIC_APP_URL}/reset-password?token=${token}`;
    console.log('Password reset link:', resetLink);

    // TODO: Send email with reset link
    // For now, we'll just log the link

    res.status(200).json({ message: 'If an account with that email exists, we sent a password reset link.' });
  } catch (error) {
    console.error('Password reset error:', error);
    res.status(500).json({ message: 'An error occurred while processing your request.' });
  }
}