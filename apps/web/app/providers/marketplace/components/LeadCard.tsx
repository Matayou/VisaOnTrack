import React from 'react';
import { type Request } from '@visaontrack/client';
import { Bookmark, Unlock, MessageSquare } from 'lucide-react';
import { FeatureGate } from '@/components/FeatureGate';
import { useRouter } from 'next/navigation';

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
  const router = useRouter();
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
    <div className="ios-card hover:border-primary/30 p-5 transition-colors">
      <div className="mb-3 flex items-start justify-between gap-3">
        <div className="flex-1">
          <div className="mb-2 flex flex-wrap items-center gap-2">
            {matchScore >= 90 && (
              <span className="rounded-full bg-green-50 px-2.5 py-1 text-xs font-semibold text-green-700 ring-1 ring-inset ring-green-600/10">
                {matchScore}% match
              </span>
            )}
            {matchScore >= 75 && matchScore < 90 && (
              <span className="rounded-full bg-blue-50 px-2.5 py-1 text-xs font-semibold text-blue-700 ring-1 ring-inset ring-blue-600/10">
                {matchScore}% match
              </span>
            )}
            {matchScore < 75 && (
              <span className="rounded-full bg-gray-50 px-2.5 py-1 text-xs font-semibold text-gray-700 ring-1 ring-inset ring-gray-600/10">
                {matchScore}% match
              </span>
            )}
            <span className="text-xs text-gray-500">{getTimePosted()}</span>
          </div>
          <h3 className="mb-1 text-base font-semibold text-gray-900">
            {request.title}
          </h3>
          <p className="mb-3 line-clamp-2 text-sm text-gray-600">
            {request.description || 'No description provided'}
          </p>
          <div className="grid grid-cols-2 gap-3 text-sm sm:grid-cols-4">
            <div>
              <p className="mb-0.5 text-xs uppercase tracking-wide text-gray-400">Budget</p>
              <p className="font-semibold text-gray-900">{getBudgetDisplay()}</p>
            </div>
            <div>
              <p className="mb-0.5 text-xs uppercase tracking-wide text-gray-400">Nationality</p>
              <p className="font-semibold text-gray-900">{nationality}</p>
            </div>
            <div>
              <p className="mb-0.5 text-xs uppercase tracking-wide text-gray-400">Location</p>
              <p className="font-semibold text-gray-900">{request.location || 'Not specified'}</p>
            </div>
            <div>
              <p className="mb-0.5 text-xs uppercase tracking-wide text-gray-400">Competition</p>
              <p className="font-semibold text-gray-900">{(request as any).proposalCount || 0} proposals</p>
            </div>
          </div>
        </div>
      </div>
      <div className="flex flex-col items-start justify-between gap-3 border-t border-gray-100 pt-3 sm:flex-row sm:items-center">
        {isLocked ? (
          <>
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <Unlock className="h-4 w-4 text-primary" />
              <span>Unlock with <span className="font-semibold text-gray-900">1 credit</span> to view full details</span>
            </div>
            <div className="flex w-full items-center gap-2 sm:w-auto">
              <button 
                onClick={() => onSave(request.id)}
                className="hover:border-primary/30 flex flex-1 items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-600 transition-all hover:text-primary sm:flex-none"
              >
                <Bookmark className="h-4 w-4" />
                <span>Save</span>
              </button>
              <button 
                onClick={() => onUnlock(request.id)}
                className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-primary px-5 py-2 text-sm font-semibold text-white shadow-sm shadow-indigo-200 transition-all hover:bg-indigo-600 sm:flex-none"
              >
                <Unlock className="h-4 w-4" />
                <span>Unlock lead</span>
              </button>
            </div>
          </>
        ) : (
          <>
            <div className="flex items-center gap-2 text-sm">
              <span className="rounded-full bg-green-50 px-2.5 py-1 text-xs font-semibold text-green-700 ring-1 ring-inset ring-green-600/10">
                Unlocked
              </span>
              <span className="text-gray-500">You can now send a proposal</span>
            </div>
            <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row">
              <FeatureGate
                feature="messaging.enabled"
                fallback={
                  <div className="rounded-lg border-2 border-amber-200 bg-amber-50 p-3">
                    <div className="flex items-start gap-2">
                      <span className="text-lg">💎</span>
                      <div>
                        <p className="text-sm font-medium text-amber-900">
                          Messaging is a PRO Feature
                        </p>
                        <p className="text-xs text-amber-700 mt-1">
                          Upgrade to communicate directly with this client
                        </p>
                        <button
                          onClick={() => router.push('/pricing')}
                          className="mt-2 text-xs font-medium text-amber-900 underline hover:text-amber-800"
                        >
                          View Plans →
                        </button>
                      </div>
                    </div>
                  </div>
                }
              >
                <button
                  onClick={() => router.push(`/requests/${request.id}/thread`)}
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-5 py-2 text-sm font-semibold text-white shadow-sm shadow-indigo-200 transition-all hover:bg-indigo-600"
                >
                  <MessageSquare className="h-4 w-4" />
                  Send Message
                </button>
              </FeatureGate>
              <button
                onClick={() => {/* TODO: Navigate to proposal form */}}
                className="rounded-xl border border-gray-300 bg-white px-5 py-2 text-sm font-semibold text-gray-700 transition-all hover:bg-gray-50"
              >
                Send proposal
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

