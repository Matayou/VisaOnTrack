'use client';

import React from 'react';
import { useSession } from "next-auth/react";
import { redirect } from 'next/navigation';

export default function DashboardPage() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return <p>Loading...</p>;
  }

  if (status === "unauthenticated") {
    redirect('/signin');
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
      <p>Welcome to your dashboard, {session?.user?.firstName}!</p>
      {/* Add more dashboard content here */}
    </div>
  );
}