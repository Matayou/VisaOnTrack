import React from 'react';

interface RequestStatsProps {
  status: 'DRAFT' | 'PUBLISHED';
  counts: {
    views: number | null; // Null if not tracked
    proposals: number;
    messages: number;
  };
}

export const RequestStats: React.FC<RequestStatsProps> = ({ status, counts }) => {
  const isDraft = status === 'DRAFT';

  const StatItem = ({ label, value }: { label: string; value: number | string }) => (
    <div className="rounded-lg border border-gray-100 bg-gray-50 p-2">
      <span className="mb-1 block text-[12px] font-semibold uppercase tracking-wide text-text-secondary">{label}</span>
      <span className={`text-lg font-bold ${isDraft || value === '—' ? 'text-text-tertiary' : 'text-text-primary'}`}>
        {typeof value === 'number' ? value.toLocaleString() : value}
      </span>
    </div>
  );

  return (
    <div className="ios-card p-5">
      <h3 className="mb-4 text-xs font-bold uppercase tracking-wider text-text-secondary">Request Stats</h3>
      <div className="mb-3 grid grid-cols-3 gap-2 text-center">
        <StatItem 
          label="Views" 
          value={isDraft || counts.views === null ? '—' : counts.views} 
        />
        <StatItem 
          label="Proposals" 
          value={isDraft ? '—' : counts.proposals} 
        />
        <StatItem 
          label="Messages" 
          value={isDraft ? '—' : counts.messages} 
        />
      </div>
      {isDraft && (
        <p className="text-center text-xs text-text-secondary">Stats available after publishing</p>
      )}
    </div>
  );
};

