import React from 'react';

interface ProposalsListProps {
  proposals: any[]; // Replace with actual Proposal type
  status: 'DRAFT' | 'PUBLISHED'; // Add status prop
  onPublish?: () => void;
}

export const ProposalsList: React.FC<ProposalsListProps> = ({ proposals, status, onPublish }) => {
  const isDraft = status === 'DRAFT';
  return (
    <div className="ios-card p-5 lg:p-6">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-base font-bold text-gray-900 lg:text-lg">Proposals</h2>
        <span className="rounded-full bg-gray-100 px-2 py-1 text-xs font-medium text-text-secondary">
          {proposals.length}
        </span>
      </div>

      {proposals.length === 0 ? (
        /* Empty State */
        <div className="relative overflow-hidden rounded-2xl border border-gray-100/50 bg-gray-50/50 py-12 text-center">
          {/* Decorative background elements */}
          <div className="from-primary/5 pointer-events-none absolute left-1/2 top-1/2 h-48 w-48 -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-to-tr to-transparent blur-2xl"></div>
          
          <div className="relative z-10">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl border border-gray-100 bg-white shadow-sm ring-4 ring-gray-50">
              <svg className="h-8 w-8 text-text-tertiary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h3 className="mb-2 font-bold text-gray-900">No proposals yet</h3>
            <p className="mx-auto mb-6 max-w-xs text-sm leading-relaxed text-gray-500">
              {isDraft 
                ? 'Publish your request to start receiving proposals from verified visa providers'
                : 'We are waiting for verified providers to review your request and send proposals'
              }
            </p>
            {isDraft && (
              <button 
                type="button"
                onClick={() => onPublish?.()}
                className="hover:border-primary/30 mx-auto flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-6 py-2.5 text-sm font-medium text-gray-600 shadow-sm transition-all hover:text-primary hover:shadow"
              >
                <span>Publish Request</span>
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </button>
            )}
          </div>
        </div>
      ) : (
        /* Placeholder for actual proposals list */
        <div className="space-y-4">
          {proposals.map((proposal) => (
            <div key={proposal.id} className="rounded-lg border p-4">
              {/* Proposal Item Content */}
              Proposal #{proposal.id}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

