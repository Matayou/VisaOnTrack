'use client';

import React, { useEffect, useState, useMemo } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { SeekerHeader } from '@/components/SeekerHeader';
import { api, type Request } from '@visaontrack/client';
import { RequestStatusCard } from './components/RequestStatusCard';
import { RequestOverview } from './components/RequestOverview';
import { ProposalsList } from './components/ProposalsList';
import { ActivityTimeline, AuditLogEntry } from './components/ActivityTimeline';
import { RequestStats } from './components/RequestStats';
import { NextSteps } from './components/NextSteps';
import { MobileActionSheet } from './components/MobileActionSheet';
import { getErrorDisplayMessage } from '@/lib/error-handling';
import { Loader, AlertCircle, ArrowLeft } from 'lucide-react';

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
    // Navigate to edit page (placeholder path)
    // router.push(`/requests/${requestId}/edit`);
    alert("Edit functionality coming soon");
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
        nationality: 'See Profile', // Placeholder - implies need to fetch user profile or add to Request model
        ageRange: '—', // Not on Request model yet
        location: request.location || 'Not specified',
        purpose: '—', // Not on Request model yet
      },

      visa: {
        type: request.visaType || 'Not specified',
        duration: '—', // Not on Request model yet
        incomeSource: '—', // Not on Request model yet
      },

      budget: {
        range: budgetLabel,
        savings: '—', // Not on Request model yet
      },

      stats: {
        views: null,
        proposals: 0, // TODO: request.proposals?.length || 0
        messages: 0,  // TODO: request.messages?.length || 0
      },

      auditLogs: [], // TODO: Fetch audit logs
      proposalsList: [], // TODO: Fetch proposals
    };
  }, [request]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex items-center gap-3 text-gray-500">
          <Loader className="h-5 w-5 animate-spin" />
          <span>Loading request...</span>
        </div>
      </div>
    );
  }

  if (error || !mappedData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white p-6 rounded-xl border border-red-100 max-w-md w-full text-center">
          <AlertCircle className="h-10 w-10 text-red-500 mx-auto mb-4" />
          <h2 className="text-lg font-bold text-gray-900 mb-2">Unable to load request</h2>
          <p className="text-gray-600 mb-6">{error || 'Request not found'}</p>
          <button 
            onClick={() => router.push('/dashboard')}
            className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 font-medium text-gray-700 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-32 lg:pb-12">
      <SeekerHeader />
      <main className="max-w-7xl mx-auto px-4 lg:px-8 py-4 lg:py-6">
        <div className="lg:grid lg:grid-cols-3 lg:gap-6">
          
          {/* Main Column (Left) */}
          <div className="lg:col-span-2 space-y-4 mb-4 lg:mb-0">
            
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
              onPublish={handlePublish}
            />

          </div>

          {/* Sidebar (Right) - Desktop Only */}
          <aside className="hidden lg:block space-y-6">
            
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
          <div className="lg:hidden space-y-4">
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
