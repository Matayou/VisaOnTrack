import React from 'react';

interface MobileActionSheetProps {
  status: 'DRAFT' | 'PUBLISHED';
  onPublish?: () => void;
  onEdit?: () => void;
}

export const MobileActionSheet: React.FC<MobileActionSheetProps> = ({ status, onPublish, onEdit }) => {
  return (
    <div className="safe-bottom fixed bottom-0 left-0 right-0 z-40 border-t border-gray-200 bg-white/95 pb-[env(safe-area-inset-bottom,20px)] backdrop-blur-xl lg:hidden">
      <div className="mx-auto max-w-7xl px-4 py-3">
        <div className="flex items-center gap-3">
          {status === 'DRAFT' ? (
            <>
              <button 
                type="button"
                onClick={() => onPublish?.()}
                className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-primary py-3 text-sm font-bold text-white shadow-sm shadow-indigo-200 transition-all hover:bg-indigo-600 hover:shadow-md active:scale-[0.98]"
              >
                <span>Publish Request</span>
                <svg className="h-4 w-4 opacity-90" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </button>
              <button 
                type="button"
                onClick={() => onEdit?.()}
                className="rounded-xl border border-gray-200 bg-white px-4 py-3 font-medium text-gray-700 shadow-sm transition-colors hover:bg-gray-50"
              >
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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

