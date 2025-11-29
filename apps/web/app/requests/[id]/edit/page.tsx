'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { api, type Request } from '@visaontrack/client';
import { SeekerHeader } from '@/components/SeekerHeader';
import { Spinner } from '@/components/ui';
import { RequestEditForm } from '../components/RequestEditForm';
import { ArrowLeft } from 'lucide-react';

export default function EditRequestPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const requestId = Array.isArray(params?.id) ? params?.id[0] : params?.id;

  const [request, setRequest] = useState<Request | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!requestId) return;

    const loadRequest = async () => {
      try {
        setIsLoading(true);
        const data = await api.requests.getRequest({ id: requestId });
        setRequest(data);
      } catch (err: any) {
        console.error('[EditRequestPage] load error', err);
        setError('Failed to load request data');
      } finally {
        setIsLoading(false);
      }
    };

    loadRequest();
  }, [requestId]);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <Spinner size="lg" />
      </div>
    );
  }

  if (error || !request) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="text-center">
          <h2 className="mb-2 text-lg font-bold text-red-600">Error</h2>
          <p className="mb-4 text-gray-600">{error || 'Request not found'}</p>
          <button
            onClick={() => router.back()}
            className="text-primary hover:underline"
          >
            Go back
          </button>
        </div>
      </div>
    );
  }

  // Redirect if not DRAFT
  if (request.status !== 'DRAFT') {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="max-w-md px-4 text-center">
          <h2 className="mb-2 text-xl font-bold text-gray-900">Cannot Edit Published Request</h2>
          <p className="mb-6 text-gray-600">
            This request has already been published. To ensure consistency for providers, you cannot edit the details of a published request.
          </p>
          <button
            onClick={() => router.push(`/requests/${requestId}`)}
            className="rounded-lg bg-primary px-4 py-2 text-white transition-colors hover:bg-primary-hover"
          >
            Return to Request
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-12">
      <SeekerHeader />
      
      <main className="mx-auto max-w-3xl px-4 py-8 lg:px-8">
        <div className="mb-6">
          <button 
            onClick={() => router.back()}
            className="-ml-2 inline-flex items-center gap-2 rounded-lg px-2 py-1 text-sm font-medium text-gray-500 transition-colors hover:bg-gray-100/50 hover:text-gray-900"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Request
          </button>
        </div>

        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Edit Request Details</h1>
          <p className="mt-1 text-gray-600">Update your visa requirements and preferences.</p>
        </div>

        <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
          <RequestEditForm request={request} />
        </div>
      </main>
    </div>
  );
}

