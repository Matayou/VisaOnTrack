import React from 'react';
import { 
  Globe, 
  User, 
  MapPin, 
  Target, 
  FileBadge, 
  Clock, 
  Wallet, 
  PiggyBank 
} from 'lucide-react';

interface RequestOverviewProps {
  title: string;
  description: string;
  status: 'DRAFT' | 'PUBLISHED';
  updatedAt: string;
  applicant: {
    nationality: string;
    ageRange: string;
    location: string;
    purpose: string;
  };
  visa: {
    type: string;
    duration: string;
    incomeSource: string;
  };
  budget: {
    range: string;
    savings: string;
  };
  onEdit?: () => void;
}

export const RequestOverview: React.FC<RequestOverviewProps> = ({
  title,
  description,
  status,
  updatedAt,
  applicant,
  visa,
  budget,
  onEdit
}) => {
  const updatedDate = updatedAt ? new Date(updatedAt) : null;
  const hasValidDate = updatedDate instanceof Date && !Number.isNaN(updatedDate.getTime());
  const safeUpdatedDate = hasValidDate ? updatedDate : null;
  const updatedLabel = safeUpdatedDate
    ? safeUpdatedDate.toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short' })
    : 'just now';
  const updatedDateTime = safeUpdatedDate ? safeUpdatedDate.toISOString() : undefined;
  const statusChipBase =
    'inline-flex items-center px-2.5 py-1 text-xs font-semibold rounded-lg ring-1 ring-inset';
  return (
    <div className="ios-card overflow-hidden">
      {/* Header Section */}
      <div className="border-b border-gray-50 p-5 lg:p-6">
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span
              className={`${statusChipBase} ${
                status === 'DRAFT'
                  ? 'bg-amber-50 text-amber-700 ring-amber-600/10'
                  : 'bg-green-50 text-green-700 ring-green-600/10'
              }`}
            >
              {status === 'DRAFT' ? 'Draft' : 'Published'}
            </span>
            <span className="flex items-center gap-1 text-xs font-medium text-text-secondary">
              <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
              <time dateTime={updatedDateTime}>Edited {updatedLabel}</time>
            </span>
          </div>
          {status === 'DRAFT' && onEdit && (
            <button 
              type="button"
              onClick={() => onEdit?.()}
              className="group flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium text-text-secondary transition-colors hover:bg-indigo-50 hover:text-primary"
            >
              <svg className="h-4 w-4 text-text-tertiary transition-colors group-hover:text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
              Edit details
            </button>
          )}
        </div>

        <h1 className="mb-3 text-xl font-bold leading-tight text-gray-900 lg:text-2xl">
          {title}
        </h1>
        <p className="max-w-3xl text-sm leading-relaxed text-gray-600">
          {description}
        </p>
      </div>

      {/* Data Grid Section */}
      <div className="space-y-6 bg-gray-50/50 p-5 lg:p-6">
        
        {/* Row 1: Key Info */}
        <div>
          <h3 className="mb-3 flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-text-secondary">
            Applicant Profile
            <div className="h-px flex-1 bg-gray-200"></div>
          </h3>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            <div className="rounded-xl border border-gray-100 bg-white p-3.5 shadow-sm">
              <div className="mb-1 flex items-center gap-1.5">
                <Globe className="h-3 w-3 text-text-tertiary" />
                <span className="text-xs uppercase tracking-wide text-text-secondary">Nationality</span>
              </div>
              <div className="flex items-center gap-2">
                <p className="text-sm font-semibold text-gray-900">{applicant.nationality}</p>
              </div>
            </div>
            <div className="rounded-xl border border-gray-100 bg-white p-3.5 shadow-sm">
              <div className="mb-1 flex items-center gap-1.5">
                <User className="h-3 w-3 text-text-tertiary" />
                <span className="text-xs uppercase tracking-wide text-text-secondary">Age Range</span>
              </div>
              <p className="text-sm font-semibold text-gray-900">{applicant.ageRange}</p>
            </div>
            <div className="rounded-xl border border-gray-100 bg-white p-3.5 shadow-sm">
              <div className="mb-1 flex items-center gap-1.5">
                <MapPin className="h-3 w-3 text-text-tertiary" />
                <span className="text-xs uppercase tracking-wide text-text-secondary">Location</span>
              </div>
              <p className="text-sm font-semibold text-gray-900">{applicant.location}</p>
            </div>
            <div className="rounded-xl border border-gray-100 bg-white p-3.5 shadow-sm">
              <div className="mb-1 flex items-center gap-1.5">
                <Target className="h-3 w-3 text-text-tertiary" />
                <span className="text-xs uppercase tracking-wide text-text-secondary">Purpose</span>
              </div>
              <p className="text-sm font-semibold text-gray-900">{applicant.purpose}</p>
            </div>
          </div>
        </div>

        {/* Row 2: Requirements */}
        <div>
          <h3 className="mb-3 flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-text-secondary">
            Visa Requirements
            <div className="h-px flex-1 bg-gray-200"></div>
          </h3>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div className="rounded-xl border border-blue-100/60 bg-blue-50/50 p-3.5 shadow-sm sm:col-span-1">
              <div className="mb-1 flex items-center gap-1.5">
                <FileBadge className="h-3 w-3 text-blue-400" />
                <span className="text-xs uppercase tracking-wide text-blue-700">Visa Type</span>
              </div>
              <p className="text-sm font-bold text-blue-700">{visa.type}</p>
            </div>
            <div className="rounded-xl border border-gray-100 bg-white p-3.5 shadow-sm">
              <div className="mb-1 flex items-center gap-1.5">
                <Clock className="h-3 w-3 text-text-tertiary" />
                <span className="text-xs uppercase tracking-wide text-text-secondary">Duration</span>
              </div>
              <p className="text-sm font-semibold text-gray-900">{visa.duration}</p>
            </div>
            <div className="rounded-xl border border-gray-100 bg-white p-3.5 shadow-sm">
              <div className="mb-1 flex items-center gap-1.5">
                <Wallet className="h-3 w-3 text-text-tertiary" />
                <span className="text-xs uppercase tracking-wide text-text-secondary">Income Source</span>
              </div>
              <p className="text-sm font-semibold text-gray-900">{visa.incomeSource}</p>
            </div>
          </div>
        </div>

        {/* Footer: Financials */}
        <div className="flex flex-col justify-between gap-4 rounded-xl border border-gray-200/80 bg-white p-4 shadow-sm sm:flex-row sm:items-center">
          <div>
            <span className="mb-0.5 block text-xs uppercase tracking-wide text-text-secondary">Estimated Budget</span>
            <div className="flex items-baseline gap-2">
              <p className="text-lg font-bold text-gray-900">{budget.range}</p>
              <span className="text-xs font-medium text-text-secondary">total</span>
            </div>
          </div>
          <div className="sm:border-l sm:border-gray-100 sm:pl-6 sm:text-right">
            <div className="mb-0.5 flex items-center justify-start gap-1.5 sm:justify-end">
              <PiggyBank className="h-3 w-3 text-text-tertiary" />
              <span className="text-xs uppercase tracking-wide text-text-secondary">Savings Proof</span>
            </div>
             <p className="text-sm font-medium text-gray-700">{budget.savings}</p>
          </div>
        </div>

      </div>
    </div>
  );
};

