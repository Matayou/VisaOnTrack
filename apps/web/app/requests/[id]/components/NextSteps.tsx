import React from 'react';

interface NextStepsProps {
  status: 'DRAFT' | 'PUBLISHED';
}

export const NextSteps: React.FC<NextStepsProps> = ({ status }) => {
  // Currently optimized for DRAFT state as per mockup
  if (status !== 'DRAFT') return null;

  return (
    <div className="ios-card p-5">
      <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">Next Steps</h3>
      <div className="space-y-2">
        <div className="flex gap-3.5 items-start p-3 -mx-3 rounded-xl hover:bg-gray-50 transition-colors cursor-default group">
          <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center flex-shrink-0 ring-4 ring-white group-hover:bg-blue-100 transition-colors">
            <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-900">Publish to receive proposals</p>
            <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">Verified providers can view and respond to your request</p>
          </div>
        </div>
        
        <div className="flex gap-3.5 items-start p-3 -mx-3 rounded-xl bg-green-50/50 border border-green-100/50">
          <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0 ring-4 ring-white">
            <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <div>
            <p className="text-sm font-semibold text-green-900">Your information is complete</p>
            <p className="text-xs text-green-700/80 mt-0.5 leading-relaxed">Ready to publish or edit for more details</p>
          </div>
        </div>

        <div className="flex gap-3.5 items-start p-3 -mx-3 rounded-xl hover:bg-gray-50 transition-colors cursor-default group">
          <div className="w-8 h-8 rounded-full bg-purple-50 flex items-center justify-center flex-shrink-0 ring-4 ring-white group-hover:bg-purple-100 transition-colors">
            <svg className="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-900">All information is private</p>
            <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">Only you see drafts. Providers only view published requests</p>
          </div>
        </div>
      </div>
    </div>
  );
};

