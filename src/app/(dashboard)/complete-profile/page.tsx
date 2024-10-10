import React from 'react';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { ProfileCompletionForm } from '@/components/ProfileCompletionForm';
import prisma from '@/lib/prisma';
import { redirect } from 'next/navigation';

export default async function CompleteProfilePage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect('/signin');
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
  });

  if (!user || user.role !== 'SEEKER') {
    redirect('/dashboard');
  }

  if (user.profileCompleted) {
    redirect('/dashboard');
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Complete Your Profile</h1>
      <ProfileCompletionForm />
    </div>
  );
}
