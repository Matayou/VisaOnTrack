import React from 'react';

interface ProposalsListProps {
  proposals: any[]; // Replace with actual Proposal type
  onPublish?: () => void;
}

export const ProposalsList: React.FC<ProposalsListProps> = ({ proposals, onPublish }) => {
  return (
    <div className="ios-card p-5 lg:p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-bold text-gray-900 text-base lg:text-lg">Proposals</h2>
        <span className="text-xs font-medium text-gray-400 bg-gray-100 px-2 py-1 rounded-full">
          {proposals.length}
        </span>
      </div>

      {proposals.length === 0 ? (
        /* Empty State */
        <div className="text-center py-12 relative overflow-hidden rounded-2xl bg-gray-50/50 border border-gray-100/50">
          {/* Decorative background elements */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-gradient-to-tr from-primary/5 to-transparent rounded-full blur-2xl pointer-events-none"></div>
          
          <div className="relative z-10">
            <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-white shadow-sm border border-gray-100 flex items-center justify-center ring-4 ring-gray-50">
              <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" strokeWidth="1.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h3 className="font-bold text-gray-900 mb-2">No proposals yet</h3>
            <p className="text-sm text-gray-500 mb-6 max-w-xs mx-auto leading-relaxed">
              Publish your request to start receiving proposals from verified visa providers
            </p>
            <button 
              onClick={onPublish}
              className="px-6 py-2.5 bg-white border border-gray-200 hover:border-primary/30 hover:text-primary text-gray-600 font-medium rounded-xl text-sm transition-all shadow-sm hover:shadow flex items-center gap-2 mx-auto"
            >
              <span>Publish Request</span>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </button>
          </div>
        </div>
      ) : (
        /* Placeholder for actual proposals list */
        <div className="space-y-4">
          {proposals.map((proposal) => (
            <div key={proposal.id} className="p-4 border rounded-lg">
              {/* Proposal Item Content */}
              Proposal #{proposal.id}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

