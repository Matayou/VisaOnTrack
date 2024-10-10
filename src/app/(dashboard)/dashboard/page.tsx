import React from 'react';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { redirect } from 'next/navigation';

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session || !session.user || !session.user.email) {
    redirect('/signin');
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  });

  if (!user) {
    redirect('/signin');
  }

  if (user.role === 'SEEKER' && !user.profileCompleted) {
    redirect('/complete-profile');
  }

  if (user.role === 'SEEKER') {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Welcome, {user.firstName}!</h1>
        <div className="bg-white shadow-md rounded-lg p-6">
          <h2 className="text-2xl font-semibold mb-4">Your Visa Information</h2>
          <p><strong>Nationality:</strong> {user.nationality || 'Not provided'}</p>
          <p><strong>Current Thai Visa Type:</strong> {user.thaiVisaType || 'Not provided'}</p>
          <p><strong>Visa Expiry Date:</strong> {user.visaExpiryDate ? new Date(user.visaExpiryDate).toLocaleDateString() : 'Not provided'}</p>
        </div>
        <div className="mt-8">
          <h2 className="text-2xl font-semibold mb-4">Your Requests</h2>
          {/* Add logic here to display user's requests */}
          <p>You have no active requests at the moment.</p>
        </div>
      </div>
    );
  }

  // For service providers or other roles
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Welcome, {user.firstName}!</h1>
      {/* Add content for service providers here */}
      <p>This is the service provider dashboard. Additional features will be added soon.</p>
    </div>
  );
}
