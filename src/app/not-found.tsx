'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Compass } from 'lucide-react';

export default function NotFound() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-100 to-white flex flex-col justify-center items-center px-4 sm:px-6 lg:px-8">
      <div className="text-center">
        <Compass className="mx-auto h-24 w-24 text-indigo-600 animate-spin-slow" />
        <h1 className="mt-4 text-3xl font-bold tracking-tight text-gray-900 sm:text-5xl">Page not found</h1>
        <p className="mt-6 text-base leading-7 text-gray-600">Sorry, we couldn't find the page you're looking for.</p>
        <div className="mt-10 flex items-center justify-center gap-x-6">
          <button
            onClick={() => router.back()}
            className="rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            <ArrowLeft className="inline-block mr-2 h-4 w-4" />
            Go back
          </button>
          <Link href="/" className="text-sm font-semibold text-gray-900 hover:underline">
            Go home <span aria-hidden="true">&rarr;</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
