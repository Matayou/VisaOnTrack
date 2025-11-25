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

  const StatItem = ({ label, value }: { label: string, value: number | string }) => (
    <div className="bg-gray-50 rounded-lg p-2 border border-gray-100">
      <span className="text-[10px] uppercase text-gray-400 font-semibold block mb-1">{label}</span>
      <span className={`text-lg font-bold ${isDraft || value === '—' ? 'text-gray-300' : 'text-gray-900'}`}>
        {value}
      </span>
    </div>
  );

  return (
    <div className="ios-card p-5">
      <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">Request Stats</h3>
      <div className="grid grid-cols-3 gap-2 text-center mb-3">
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
        <p className="text-xs text-center text-gray-400">Stats available after publishing</p>
      )}
    </div>
  );
};

