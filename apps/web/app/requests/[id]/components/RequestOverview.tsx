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
  const updatedDate = new Date(updatedAt);
  const updatedLabel = updatedDate.toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short' });
  return (
    <div className="ios-card overflow-hidden">
      {/* Header Section */}
      <div className="p-5 lg:p-6 border-b border-gray-50">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2.5">
            <span className={`px-2.5 py-1 text-xs font-semibold rounded-full ring-1 ring-inset ${
              status === 'DRAFT' 
                ? 'bg-amber-50 text-amber-700 ring-amber-600/10' 
                : 'bg-green-50 text-green-700 ring-green-600/10'
            }`}>
              {status === 'DRAFT' ? 'Draft' : 'Published'}
            </span>
            <span className="text-xs text-text-secondary font-medium flex items-center gap-1">
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
              <time dateTime={updatedDate.toISOString()}>Edited {updatedLabel}</time>
            </span>
          </div>
          {status === 'DRAFT' && (
            <button 
              onClick={onEdit}
              className="text-sm text-text-secondary hover:text-primary font-medium flex items-center gap-1.5 px-3 py-1.5 rounded-lg hover:bg-indigo-50 transition-colors group"
            >
              <svg className="w-4 h-4 text-text-tertiary group-hover:text-primary transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
              Edit details
            </button>
          )}
        </div>

        <h1 className="text-xl lg:text-2xl font-bold text-gray-900 leading-tight mb-3">
          {title}
        </h1>
        <p className="text-sm text-gray-600 leading-relaxed max-w-3xl">
          {description}
        </p>
      </div>

      {/* Data Grid Section */}
      <div className="bg-gray-50/50 p-5 lg:p-6 space-y-6">
        
        {/* Row 1: Key Info */}
        <div>
          <h3 className="text-xs font-bold text-text-secondary uppercase tracking-wider mb-3 flex items-center gap-2">
            Applicant Profile
            <div className="h-px flex-1 bg-gray-200"></div>
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white rounded-xl p-3.5 border border-gray-100 shadow-sm">
              <div className="flex items-center gap-1.5 mb-1">
                <Globe className="w-3 h-3 text-text-tertiary" />
                <span className="text-text-secondary text-xs uppercase tracking-wide">Nationality</span>
              </div>
              <div className="flex items-center gap-2">
                <p className="font-semibold text-gray-900 text-sm">{applicant.nationality}</p>
              </div>
            </div>
            <div className="bg-white rounded-xl p-3.5 border border-gray-100 shadow-sm">
              <div className="flex items-center gap-1.5 mb-1">
                <User className="w-3 h-3 text-text-tertiary" />
                <span className="text-text-secondary text-xs uppercase tracking-wide">Age Range</span>
              </div>
              <p className="font-semibold text-gray-900 text-sm">{applicant.ageRange}</p>
            </div>
            <div className="bg-white rounded-xl p-3.5 border border-gray-100 shadow-sm">
              <div className="flex items-center gap-1.5 mb-1">
                <MapPin className="w-3 h-3 text-text-tertiary" />
                <span className="text-text-secondary text-xs uppercase tracking-wide">Location</span>
              </div>
              <p className="font-semibold text-gray-900 text-sm">{applicant.location}</p>
            </div>
            <div className="bg-white rounded-xl p-3.5 border border-gray-100 shadow-sm">
              <div className="flex items-center gap-1.5 mb-1">
                <Target className="w-3 h-3 text-text-tertiary" />
                <span className="text-text-secondary text-xs uppercase tracking-wide">Purpose</span>
              </div>
              <p className="font-semibold text-gray-900 text-sm">{applicant.purpose}</p>
            </div>
          </div>
        </div>

        {/* Row 2: Requirements */}
        <div>
          <h3 className="text-xs font-bold text-text-secondary uppercase tracking-wider mb-3 flex items-center gap-2">
            Visa Requirements
            <div className="h-px flex-1 bg-gray-200"></div>
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-blue-50/50 rounded-xl p-3.5 border border-blue-100/60 shadow-sm sm:col-span-1">
              <div className="flex items-center gap-1.5 mb-1">
                <FileBadge className="w-3 h-3 text-blue-400" />
                <span className="text-blue-700 text-xs uppercase tracking-wide">Visa Type</span>
              </div>
              <p className="font-bold text-blue-700 text-sm">{visa.type}</p>
            </div>
            <div className="bg-white rounded-xl p-3.5 border border-gray-100 shadow-sm">
              <div className="flex items-center gap-1.5 mb-1">
                <Clock className="w-3 h-3 text-text-tertiary" />
                <span className="text-text-secondary text-xs uppercase tracking-wide">Duration</span>
              </div>
              <p className="font-semibold text-gray-900 text-sm">{visa.duration}</p>
            </div>
            <div className="bg-white rounded-xl p-3.5 border border-gray-100 shadow-sm">
              <div className="flex items-center gap-1.5 mb-1">
                <Wallet className="w-3 h-3 text-text-tertiary" />
                <span className="text-text-secondary text-xs uppercase tracking-wide">Income Source</span>
              </div>
              <p className="font-semibold text-gray-900 text-sm">{visa.incomeSource}</p>
            </div>
          </div>
        </div>

        {/* Footer: Financials */}
        <div className="bg-white rounded-xl p-4 border border-gray-200/80 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-text-secondary text-xs uppercase tracking-wide block mb-0.5">Estimated Budget</span>
            <div className="flex items-baseline gap-2">
              <p className="text-lg font-bold text-gray-900">{budget.range}</p>
              <span className="text-xs text-text-secondary font-medium">total</span>
            </div>
          </div>
          <div className="sm:text-right sm:border-l sm:border-gray-100 sm:pl-6">
            <div className="flex items-center gap-1.5 mb-0.5 justify-start sm:justify-end">
              <PiggyBank className="w-3 h-3 text-text-tertiary" />
              <span className="text-text-secondary text-xs uppercase tracking-wide">Savings Proof</span>
            </div>
             <p className="text-sm font-medium text-gray-700">{budget.savings}</p>
          </div>
        </div>

      </div>
    </div>
  );
};

