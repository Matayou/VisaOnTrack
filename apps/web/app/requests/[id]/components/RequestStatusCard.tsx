import React from 'react';

interface RequestStatusCardProps {
  status: 'DRAFT' | 'PUBLISHED';
  onPublish?: () => void;
}

export const RequestStatusCard: React.FC<RequestStatusCardProps> = ({ status, onPublish }) => {
  if (status !== 'DRAFT') return null;

  return (
    <div className="ios-card p-5 lg:p-6 relative overflow-hidden">
      {/* Subtle background decoration */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-indigo-50/40 to-transparent rounded-full -mr-20 -mt-20 pointer-events-none"></div>

      <div className="relative flex flex-col sm:flex-row gap-4 sm:gap-5 items-start">
        {/* Icon */}
        <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center flex-shrink-0 shadow-sm shadow-indigo-100 ring-4 ring-white">
          <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
          </svg>
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0 pt-0.5">
          <h2 className="font-bold text-gray-900 text-base lg:text-lg mb-1.5">Ready to publish!</h2>
          <p className="text-sm text-gray-600 leading-relaxed max-w-2xl mb-4">
            Your request is complete and looks great. Once published, verified providers can view your requirements and send you tailored proposals.
          </p>
          
          {/* Desktop Button */}
          <button 
            type="button"
            onClick={() => onPublish?.()}
            className="hidden lg:inline-flex items-center gap-2 px-6 py-2.5 bg-primary hover:bg-indigo-600 text-white font-medium rounded-xl text-sm transition-all shadow-sm shadow-indigo-200 hover:shadow-md hover:-translate-y-0.5"
          >
            <span>Publish Request</span>
            <svg className="w-4 h-4 opacity-90" fill="none" stroke="currentColor" viewBox="0 0 24 24">
               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

