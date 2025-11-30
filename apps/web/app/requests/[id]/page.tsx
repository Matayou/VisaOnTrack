'use client';

import React, { useEffect, useState, useMemo } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { SeekerHeader } from '@/components/SeekerHeader';
import { api, type Request } from '@visaontrack/client';
import { mapDurationToTimeline } from '@/lib/eligibilityMapping';
import { RequestStatusCard } from './components/RequestStatusCard';
import { RequestOverview } from './components/RequestOverview';
import { ProposalsList } from './components/ProposalsList';
import { ActivityTimeline, AuditLogEntry } from './components/ActivityTimeline';
import { RequestStats } from './components/RequestStats';
import { NextSteps } from './components/NextSteps';
import { MobileActionSheet } from './components/MobileActionSheet';
import { getErrorDisplayMessage } from '@/lib/error-handling';
import { Loader, AlertCircle, ArrowLeft, MessageSquare } from 'lucide-react';

const currencyFormatter = new Intl.NumberFormat('th-TH', {
  style: 'currency',
  currency: 'THB',
  maximumFractionDigits: 0,
});

export default function RequestDetailPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const requestId = Array.isArray(params?.id) ? params?.id[0] : params?.id;

  const [request, setRequest] = useState<Request | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isPublishing, setIsPublishing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch Request Data
  useEffect(() => {
    if (!requestId) return;

    const loadRequest = async () => {
      try {
        setIsLoading(true);
        const data = await api.requests.getRequest({ id: requestId });
        setRequest(data);
      } catch (err: any) {
        console.error('[RequestDetailPage] load error', err);
        setError(getErrorDisplayMessage(err, 'load this request'));
      } finally {
        setIsLoading(false);
      }
    };

    loadRequest();
  }, [requestId]);

  const handlePublish = async () => {
    if (!request) return;
    setIsPublishing(true);
    try {
      // @ts-ignore - Using 'OPEN' to signify published state
      const updated = await api.requests.updateRequest({
        id: request.id,
        requestBody: { status: 'OPEN' },
      });
      setRequest(updated);
    } catch (err) {
      console.error('Publish failed', err);
      alert(getErrorDisplayMessage(err, 'publish request'));
    } finally {
      setIsPublishing(false);
    }
  };

  const handleEdit = () => {
    // Navigate to edit page
    router.push(`/requests/${requestId}/edit`);
  };

  // Data Mapping
  const mappedData = useMemo(() => {
    if (!request) return null;

    const isDraft = request.status === 'DRAFT';
    // Map OPEN/CLOSED/HIRED to PUBLISHED for UI logic
    const uiStatus = isDraft ? 'DRAFT' : 'PUBLISHED';

    // Format Budget
    let budgetLabel = 'Not provided';
    if (request.budgetMin != null && request.budgetMax != null) {
      budgetLabel = `${currencyFormatter.format(request.budgetMin)} – ${currencyFormatter.format(request.budgetMax)}`;
    } else if (request.budgetMin != null) {
      budgetLabel = `From ${currencyFormatter.format(request.budgetMin)}`;
    } else if (request.budgetMax != null) {
      budgetLabel = `Up to ${currencyFormatter.format(request.budgetMax)}`;
    }

    // Extract info from intakeData if available
    const intakeData = request.intakeData;
    
    // Format Date
    let updatedAtLabel = 'recently';
    try {
      const lastUpdate = request.updatedAt ? new Date(request.updatedAt) : new Date(request.createdAt);
      const diffDays = -Math.round((Date.now() - lastUpdate.getTime()) / (1000 * 60 * 60 * 24));
      if (!isNaN(diffDays)) {
         updatedAtLabel = new Intl.RelativeTimeFormat('en', { numeric: 'auto' }).format(diffDays, 'day');
      }
    } catch (e) {
      console.warn('Error formatting date', e);
    }

    return {
      id: request.id,
      status: uiStatus,
      title: request.title,
      description: request.description || 'No description provided.',
      updatedAt: updatedAtLabel === '0 days ago' ? 'today' : updatedAtLabel,
      createdAt: new Date(request.createdAt),

      applicant: {
        nationality: intakeData?.nationality || 'See Profile',
        ageRange: intakeData?.age || '—',
        location: request.location || intakeData?.location || 'Not specified',
        purpose: intakeData?.purpose || '—',
      },

      visa: {
        type: request.visaType || 'Not specified',
        duration: intakeData?.duration ? mapDurationToTimeline(intakeData.duration) : '—',
        incomeSource: intakeData?.incomeType || '—',
      },

      budget: {
        range: budgetLabel,
        savings: intakeData?.savings ? `Savings: ${intakeData.savings.replace('_', '-')}` : '—',
      },

      stats: {
        views: null,
        proposals: 0, // TODO: Fetch from quotes API when available
        messages: 0, // TODO: Fetch from messages API when available
      },

      auditLogs: [], // TODO: Fetch audit logs via API when available
      proposalsList: [], // TODO: Fetch from quotes API when available
    };
  }, [request]);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="flex items-center gap-3 text-gray-500">
          <Loader className="h-5 w-5 animate-spin" />
          <span>Loading request...</span>
        </div>
      </div>
    );
  }

  if (error || !mappedData) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 p-4">
        <div className="w-full max-w-md rounded-xl border border-red-100 bg-white p-6 text-center">
          <AlertCircle className="mx-auto mb-4 h-10 w-10 text-red-500" />
          <h2 className="mb-2 text-lg font-bold text-gray-900">Unable to load request</h2>
          <p className="mb-6 text-gray-600">{error || 'Request not found'}</p>
          <button 
            onClick={() => router.push('/dashboard')}
            className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 font-medium text-gray-700 transition-colors hover:bg-gray-50"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-32 lg:pb-12">
      <SeekerHeader />
      <main className="mx-auto max-w-7xl px-6 py-4 sm:px-8 lg:py-6">
        <div className="mb-4 flex items-center justify-between lg:mb-6">
          <button
            onClick={() => router.push('/dashboard')}
            className="-ml-2 inline-flex items-center gap-2 rounded-lg px-2 py-1 text-sm font-medium text-gray-500 transition-colors hover:bg-gray-100/50 hover:text-gray-900"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Dashboard
          </button>

          {mappedData?.status === 'PUBLISHED' && (
            <button
              onClick={() => router.push(`/requests/${requestId}/thread`)}
              className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-primary-hover"
            >
              <MessageSquare className="h-4 w-4" />
              Messages
            </button>
          )}
        </div>

        <div className="lg:grid lg:grid-cols-3 lg:gap-6">
          
          {/* Main Column (Left) */}
          <div className="mb-4 space-y-4 lg:col-span-2 lg:mb-0">
            
            <RequestStatusCard 
              status={mappedData.status} 
              onPublish={handlePublish} 
            />

            <RequestOverview 
              title={mappedData.title}
              description={mappedData.description}
              status={mappedData.status}
              updatedAt={mappedData.updatedAt}
              applicant={mappedData.applicant}
              visa={mappedData.visa}
              budget={mappedData.budget}
              onEdit={handleEdit}
            />

            <ProposalsList 
              proposals={mappedData.proposalsList}
              status={mappedData.status}
              onPublish={handlePublish}
            />

          </div>

          {/* Sidebar (Right) - Desktop Only */}
          <aside className="hidden space-y-6 lg:block">
            
            <NextSteps status={mappedData.status} />

            <ActivityTimeline 
              requestCreatedAt={mappedData.createdAt}
              status={mappedData.status}
              auditLogs={mappedData.auditLogs}
            />

            <RequestStats 
              status={mappedData.status}
              counts={mappedData.stats}
            />

          </aside>

          {/* Mobile Activity (Below main content on mobile) */}
          <div className="space-y-4 lg:hidden">
             <ActivityTimeline 
              requestCreatedAt={mappedData.createdAt}
              status={mappedData.status}
              auditLogs={mappedData.auditLogs}
            />
          </div>

        </div>
      </main>

      {/* Sticky Mobile Bottom Bar */}
      <MobileActionSheet 
        status={mappedData.status}
        onPublish={handlePublish}
        onEdit={handleEdit}
      />
    </div>
  );
}
