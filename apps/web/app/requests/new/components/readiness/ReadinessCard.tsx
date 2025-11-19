'use client';

import type { DocumentStatus } from '@/app/requests/new/types';

interface ReadinessCardProps {
  item: {
    key: string;
    label: string;
    description: string;
  };
  status: DocumentStatus;
  onStatusChange: (status: DocumentStatus) => void;
}

const statusLabels: Record<DocumentStatus, string> = {
  ready: 'Ready',
  'in-progress': 'In progress',
  'need-help': 'Need help',
};

export function ReadinessCard({ item, status, onStatusChange }: ReadinessCardProps) {
  return (
    <div className="border border-border-light rounded-base p-3 space-y-2">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-sm font-semibold text-text-primary">{item.label}</p>
          <p className="text-xs text-text-tertiary">{item.description}</p>
        </div>
      </div>
      <div className="flex gap-2" role="group" aria-label={`${item.label} readiness`}>
        {(['ready', 'in-progress', 'need-help'] as DocumentStatus[]).map((option) => {
          const isActive = status === option;
          return (
            <button
              key={option}
              type="button"
              className={`flex-1 rounded-base border px-3 py-2 text-sm transition focus-visible:ring-2 focus-visible:ring-primary/40 ${
                isActive
                  ? 'border-primary bg-primary/10 text-primary'
                  : 'border-border-light text-text-secondary hover:border-primary/40 hover:text-primary'
              }`}
              onClick={() => onStatusChange(option)}
              aria-pressed={isActive}
            >
              {statusLabels[option]}
            </button>
          );
        })}
      </div>
    </div>
  );
}
