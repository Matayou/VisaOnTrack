'use client';

import React, { useEffect, useState } from 'react';
import { api, type Quote, QuoteStatus } from '@visaontrack/client';
import { ProposalCard } from './ProposalCard';
import { getErrorDisplayMessage } from '@/lib/error-handling';
import { Loader, FileText, Plus } from 'lucide-react';

interface ProposalsListProps {
  requestId: string;
  status: 'DRAFT' | 'PUBLISHED';
  userRole: 'SEEKER' | 'PROVIDER';
  onPublish?: () => void;
  onSubmitProposal?: () => void;
}

export function ProposalsList({
  requestId,
  status,
  userRole,
  onPublish,
  onSubmitProposal,
}: ProposalsListProps) {
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const isDraft = status === 'DRAFT';

  const loadQuotes = async () => {
    if (isDraft) {
      // Don't load quotes for draft requests
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      // Use the SDK method (now available after OpenAPI spec update)
      const data = await api.quotes.listQuotesForRequest({ id: requestId });
      setQuotes(data || []);
    } catch (err: any) {
      console.error('[ProposalsList] Error loading:', err);
      // Don't show error for 404 - just means no quotes yet
      if (err?.status !== 404) {
        setError(getErrorDisplayMessage(err, 'load proposals'));
      }
      setQuotes([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadQuotes();
  }, [requestId, isDraft]);

  const handleAccept = async (quoteId: string) => {
    if (!confirm('Are you sure you want to accept this proposal? This will hire the provider.')) {
      return;
    }

    try {
      await api.quotes.updateQuote({
        id: quoteId,
        requestBody: { status: QuoteStatus.ACCEPTED },
      });
      await loadQuotes();
      // Optionally redirect to case management
    } catch (err: any) {
      alert(getErrorDisplayMessage(err, 'accept proposal'));
    }
  };

  const handleDecline = async (quoteId: string) => {
    if (!confirm('Are you sure you want to decline this proposal?')) {
      return;
    }

    try {
      await api.quotes.updateQuote({
        id: quoteId,
        requestBody: { status: QuoteStatus.DECLINED },
      });
      await loadQuotes();
    } catch (err: any) {
      alert(getErrorDisplayMessage(err, 'decline proposal'));
    }
  };

  // Group quotes by status
  const pendingQuotes = quotes.filter((q) => q.status === 'PENDING');
  const acceptedQuotes = quotes.filter((q) => q.status === 'ACCEPTED');
  const otherQuotes = quotes.filter(
    (q) => q.status !== 'PENDING' && q.status !== 'ACCEPTED'
  );

  if (isLoading) {
    return (
      <div className="ios-card p-6">
        <div className="flex items-center justify-center gap-2 text-gray-500">
          <Loader className="h-5 w-5 animate-spin" />
          <span>Loading proposals...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="ios-card">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4">
        <div className="flex items-center gap-2">
          <FileText className="h-5 w-5 text-gray-400" />
          <h2 className="font-semibold text-gray-900">Proposals</h2>
          {quotes.length > 0 && (
            <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-600">
              {quotes.length}
            </span>
          )}
        </div>

        {userRole === 'PROVIDER' && !isDraft && onSubmitProposal && (
          <button
            onClick={onSubmitProposal}
            className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-3 py-1.5 text-sm font-medium text-white transition-colors hover:bg-primary-hover"
          >
            <Plus className="h-4 w-4" />
            Submit Proposal
          </button>
        )}
      </div>

      {/* Content */}
      <div className="p-5">
        {error && (
          <div className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-600">
            {error}
            <button
              onClick={loadQuotes}
              className="ml-2 font-medium hover:underline"
            >
              Try again
            </button>
          </div>
        )}

        {quotes.length === 0 ? (
          /* Empty State */
          <div className="relative overflow-hidden rounded-2xl border border-gray-100/50 bg-gray-50/50 py-12 text-center">
            {/* Decorative background */}
            <div className="pointer-events-none absolute left-1/2 top-1/2 h-48 w-48 -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-to-tr from-primary/5 to-transparent blur-2xl"></div>

            <div className="relative z-10">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl border border-gray-100 bg-white shadow-sm ring-4 ring-gray-50">
                <FileText className="h-8 w-8 text-gray-400" />
              </div>
              <h3 className="mb-2 font-bold text-gray-900">No proposals yet</h3>
              <p className="mx-auto mb-6 max-w-xs text-sm leading-relaxed text-gray-500">
                {isDraft
                  ? 'Publish your request to start receiving proposals from verified visa providers'
                  : userRole === 'PROVIDER'
                  ? 'Be the first to submit a proposal for this request'
                  : 'We are waiting for verified providers to review your request and send proposals'}
              </p>

              {isDraft && userRole === 'SEEKER' && (
                <button
                  type="button"
                  onClick={() => onPublish?.()}
                  className="mx-auto flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-6 py-2.5 text-sm font-medium text-gray-600 shadow-sm transition-all hover:border-primary/30 hover:text-primary hover:shadow"
                >
                  <span>Publish Request</span>
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </button>
              )}

              {!isDraft && userRole === 'PROVIDER' && onSubmitProposal && (
                <button
                  type="button"
                  onClick={onSubmitProposal}
                  className="mx-auto flex items-center gap-2 rounded-xl bg-primary px-6 py-2.5 text-sm font-medium text-white shadow-sm transition-colors hover:bg-primary-hover"
                >
                  <Plus className="h-4 w-4" />
                  Submit Proposal
                </button>
              )}
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Accepted Proposals */}
            {acceptedQuotes.length > 0 && (
              <div className="space-y-3">
                <h3 className="text-sm font-medium text-green-600">
                  Accepted ({acceptedQuotes.length})
                </h3>
                {acceptedQuotes.map((quote) => (
                  <ProposalCard
                    key={quote.id}
                    quote={quote}
                    userRole={userRole}
                  />
                ))}
              </div>
            )}

            {/* Pending Proposals */}
            {pendingQuotes.length > 0 && (
              <div className="space-y-3">
                <h3 className="text-sm font-medium text-amber-600">
                  Pending ({pendingQuotes.length})
                </h3>
                {pendingQuotes.map((quote) => (
                  <ProposalCard
                    key={quote.id}
                    quote={quote}
                    userRole={userRole}
                    onAccept={handleAccept}
                    onDecline={handleDecline}
                  />
                ))}
              </div>
            )}

            {/* Other Proposals (Declined/Expired) */}
            {otherQuotes.length > 0 && (
              <div className="space-y-3">
                <h3 className="text-sm font-medium text-gray-400">
                  Other ({otherQuotes.length})
                </h3>
                {otherQuotes.map((quote) => (
                  <ProposalCard
                    key={quote.id}
                    quote={quote}
                    userRole={userRole}
                  />
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
