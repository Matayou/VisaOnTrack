import React from 'react';
import { type Request } from '@visaontrack/client';
import { Bookmark, Unlock } from 'lucide-react';

interface LeadCardProps {
  request: Request & { unlockStatus?: 'LOCKED' | 'UNLOCKED' };
  onUnlock: (requestId: string) => void;
  onSave: (requestId: string) => void;
}

const currencyFormatter = new Intl.NumberFormat('th-TH', {
  style: 'currency',
  currency: 'THB',
  maximumFractionDigits: 0,
});

export const LeadCard: React.FC<LeadCardProps> = ({ request, onUnlock, onSave }) => {
  const isLocked = request.unlockStatus !== 'UNLOCKED';
  
  // Calculate match score (mock for now - would be calculated by backend)
  const matchScore = 95; // TODO: Get from backend
  
  // Calculate time posted
  const getTimePosted = () => {
    const now = new Date();
    const created = new Date(request.createdAt);
    const diffHours = Math.floor((now.getTime() - created.getTime()) / (1000 * 60 * 60));
    
    if (diffHours < 1) return 'Posted just now';
    if (diffHours < 24) return `Posted ${diffHours}h ago`;
    const diffDays = Math.floor(diffHours / 24);
    return `Posted ${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
  };

  // Format budget
  const getBudgetDisplay = () => {
    if (request.budgetMin != null && request.budgetMax != null) {
      return `${currencyFormatter.format(request.budgetMin)} – ${currencyFormatter.format(request.budgetMax)}`;
    } else if (request.budgetMin != null) {
      return `From ${currencyFormatter.format(request.budgetMin)}`;
    } else if (request.budgetMax != null) {
      return `Up to ${currencyFormatter.format(request.budgetMax)}`;
    }
    return 'Budget not specified';
  };

  // Get nationality from intakeData
  const intakeData = (request as any).intakeData;
  const nationality = intakeData?.nationality || 'Not specified';

  return (
    <div className="ios-card p-5 hover:border-primary/30 transition-colors">
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2 flex-wrap">
            {matchScore >= 90 && (
              <span className="px-2.5 py-1 text-xs font-semibold rounded-full ring-1 ring-inset bg-green-50 text-green-700 ring-green-600/10">
                {matchScore}% match
              </span>
            )}
            {matchScore >= 75 && matchScore < 90 && (
              <span className="px-2.5 py-1 text-xs font-semibold rounded-full ring-1 ring-inset bg-blue-50 text-blue-700 ring-blue-600/10">
                {matchScore}% match
              </span>
            )}
            {matchScore < 75 && (
              <span className="px-2.5 py-1 text-xs font-semibold rounded-full ring-1 ring-inset bg-gray-50 text-gray-700 ring-gray-600/10">
                {matchScore}% match
              </span>
            )}
            <span className="text-xs text-gray-500">{getTimePosted()}</span>
          </div>
          <h3 className="text-base font-semibold text-gray-900 mb-1">
            {request.title}
          </h3>
          <p className="text-sm text-gray-600 mb-3 line-clamp-2">
            {request.description || 'No description provided'}
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-sm">
            <div>
              <p className="text-xs uppercase text-gray-400 tracking-wide mb-0.5">Budget</p>
              <p className="font-semibold text-gray-900">{getBudgetDisplay()}</p>
            </div>
            <div>
              <p className="text-xs uppercase text-gray-400 tracking-wide mb-0.5">Nationality</p>
              <p className="font-semibold text-gray-900">{nationality}</p>
            </div>
            <div>
              <p className="text-xs uppercase text-gray-400 tracking-wide mb-0.5">Location</p>
              <p className="font-semibold text-gray-900">{request.location || 'Not specified'}</p>
            </div>
            <div>
              <p className="text-xs uppercase text-gray-400 tracking-wide mb-0.5">Competition</p>
              <p className="font-semibold text-gray-900">{(request as any).proposalCount || 0} proposals</p>
            </div>
          </div>
        </div>
      </div>
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pt-3 border-t border-gray-100">
        {isLocked ? (
          <>
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <Unlock className="w-4 h-4 text-primary" />
              <span>Unlock with <span className="font-semibold text-gray-900">10 credits</span> to view full details</span>
            </div>
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <button 
                onClick={() => onSave(request.id)}
                className="flex-1 sm:flex-none px-4 py-2 text-sm font-medium text-gray-600 bg-white border border-gray-200 hover:border-primary/30 hover:text-primary rounded-xl transition-all flex items-center justify-center gap-2"
              >
                <Bookmark className="w-4 h-4" />
                <span>Save</span>
              </button>
              <button 
                onClick={() => onUnlock(request.id)}
                className="flex-1 sm:flex-none px-5 py-2 text-sm font-semibold text-white bg-primary hover:bg-indigo-600 rounded-xl transition-all shadow-sm shadow-indigo-200 flex items-center justify-center gap-2"
              >
                <Unlock className="w-4 h-4" />
                <span>Unlock lead</span>
              </button>
            </div>
          </>
        ) : (
          <>
            <div className="flex items-center gap-2 text-sm">
              <span className="px-2.5 py-1 text-xs font-semibold rounded-full ring-1 ring-inset bg-green-50 text-green-700 ring-green-600/10">
                Unlocked
              </span>
              <span className="text-gray-500">You can now send a proposal</span>
            </div>
            <button 
              onClick={() => {/* TODO: Navigate to proposal form */}}
              className="px-5 py-2 text-sm font-semibold text-white bg-primary hover:bg-indigo-600 rounded-xl transition-all shadow-sm shadow-indigo-200"
            >
              Send proposal
            </button>
          </>
        )}
      </div>
    </div>
  );
};

