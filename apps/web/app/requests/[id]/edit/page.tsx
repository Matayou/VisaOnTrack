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
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  if (error || !request) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-lg font-bold text-red-600 mb-2">Error</h2>
          <p className="text-gray-600 mb-4">{error || 'Request not found'}</p>
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
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md px-4">
          <h2 className="text-xl font-bold text-gray-900 mb-2">Cannot Edit Published Request</h2>
          <p className="text-gray-600 mb-6">
            This request has already been published. To ensure consistency for providers, you cannot edit the details of a published request.
          </p>
          <button
            onClick={() => router.push(`/requests/${requestId}`)}
            className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-hover transition-colors"
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
      
      <main className="max-w-3xl mx-auto px-4 lg:px-8 py-8">
        <div className="mb-6">
          <button 
            onClick={() => router.back()}
            className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900 font-medium transition-colors px-2 py-1 -ml-2 rounded-lg hover:bg-gray-100/50"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Request
          </button>
        </div>

        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Edit Request Details</h1>
          <p className="text-gray-600 mt-1">Update your visa requirements and preferences.</p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <RequestEditForm request={request} />
        </div>
      </main>
    </div>
  );
}

