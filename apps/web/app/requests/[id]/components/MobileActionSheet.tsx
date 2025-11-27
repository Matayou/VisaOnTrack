import React from 'react';

interface MobileActionSheetProps {
  status: 'DRAFT' | 'PUBLISHED';
  onPublish?: () => void;
  onEdit?: () => void;
}

export const MobileActionSheet: React.FC<MobileActionSheetProps> = ({ status, onPublish, onEdit }) => {
  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-xl border-t border-gray-200 safe-bottom z-40 pb-[env(safe-area-inset-bottom,20px)]">
      <div className="max-w-7xl mx-auto px-4 py-3">
        <div className="flex items-center gap-3">
          {status === 'DRAFT' ? (
            <>
              <button 
                type="button"
                onClick={() => onPublish?.()}
                className="flex-1 py-3 bg-primary hover:bg-indigo-600 text-white font-bold rounded-xl text-sm transition-all shadow-sm shadow-indigo-200 hover:shadow-md active:scale-[0.98] flex items-center justify-center gap-2"
              >
                <span>Publish Request</span>
                <svg className="w-4 h-4 opacity-90" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </button>
              <button 
                type="button"
                onClick={() => onEdit?.()}
                className="px-4 py-3 bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 font-medium rounded-xl transition-colors shadow-sm"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </button>
            </>
          ) : (
             // Placeholder for PUBLISHED state mobile actions (can be expanded later)
             <div className="w-full text-center text-sm text-gray-500">
               Request is published
             </div>
          )}
        </div>
      </div>
    </div>
  );
};

