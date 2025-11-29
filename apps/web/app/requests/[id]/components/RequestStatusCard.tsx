import React from 'react';

interface RequestStatusCardProps {
  status: 'DRAFT' | 'PUBLISHED';
  onPublish?: () => void;
}

export const RequestStatusCard: React.FC<RequestStatusCardProps> = ({ status, onPublish }) => {
  if (status !== 'DRAFT') return null;

  return (
    <div className="ios-card relative overflow-hidden p-5 lg:p-6">
      {/* Subtle background decoration */}
      <div className="pointer-events-none absolute right-0 top-0 -mr-20 -mt-20 h-64 w-64 rounded-full bg-gradient-to-br from-indigo-50/40 to-transparent"></div>

      <div className="relative flex flex-col items-start gap-4 sm:flex-row sm:gap-5">
        {/* Icon */}
        <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-primary shadow-sm shadow-indigo-100 ring-4 ring-white">
          <svg className="h-5 w-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
          </svg>
        </div>

        {/* Content */}
        <div className="min-w-0 flex-1 pt-0.5">
          <h2 className="mb-1.5 text-base font-bold text-gray-900 lg:text-lg">Ready to publish!</h2>
          <p className="mb-4 max-w-2xl text-sm leading-relaxed text-gray-600">
            Your request is complete and looks great. Once published, verified providers can view your requirements and send you tailored proposals.
          </p>
          
          {/* Desktop Button */}
          <button 
            type="button"
            onClick={() => onPublish?.()}
            className="hidden items-center gap-2 rounded-xl bg-primary px-6 py-2.5 text-sm font-medium text-white shadow-sm shadow-indigo-200 transition-all hover:-translate-y-0.5 hover:bg-indigo-600 hover:shadow-md lg:inline-flex"
          >
            <span>Publish Request</span>
            <svg className="h-4 w-4 opacity-90" fill="none" stroke="currentColor" viewBox="0 0 24 24">
               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

