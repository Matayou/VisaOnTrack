import React from 'react';

// Define the shape of the data we expect
export interface AuditLogEntry {
  id: string;
  action: string; // 'EDIT', 'PUBLISH', etc.
  createdAt: Date;
}

interface ActivityTimelineProps {
  requestCreatedAt: Date;
  status: 'DRAFT' | 'PUBLISHED';
  auditLogs: AuditLogEntry[];
}

export const ActivityTimeline: React.FC<ActivityTimelineProps> = ({ 
  requestCreatedAt, 
  status, 
  auditLogs 
}) => {
  // Combine creation event with audit logs
  const events = [
    // The creation event always exists
    {
      id: 'created',
      title: 'Request created',
      subtitle: `Draft saved · ${new Intl.RelativeTimeFormat('en', { numeric: 'auto' }).format(0, 'second')}`, // Simplified relative time for now
      type: 'creation',
      timestamp: requestCreatedAt
    },
    // Map audit logs to timeline events
    ...auditLogs.map(log => ({
      id: log.id,
      title: log.action === 'EDIT' ? 'Request edited' : log.action,
      subtitle: log.createdAt.toLocaleDateString(),
      type: 'action',
      timestamp: log.createdAt
    }))
  ].sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime()); // Newest first

  return (
    <div className="ios-card p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Recent Activity</h3>
      </div>
      
      <div className="relative pl-2 space-y-6">
        {/* Vertical Line */}
        <div className="absolute top-2 bottom-2 left-2 w-px bg-gray-100"></div>

        {events.map((event) => (
          <div key={event.id} className="relative flex gap-4">
            <div className={`w-2.5 h-2.5 rounded-full border-2 z-10 mt-1.5 -ml-[5px] ${
              event.type === 'creation' ? 'bg-white border-green-500' : 'bg-white border-blue-500'
            }`}></div>
            <div className="flex-1">
              <p className="text-sm font-semibold text-gray-900">{event.title}</p>
              <p className="text-xs text-gray-400 mt-0.5">{event.subtitle}</p>
            </div>
          </div>
        ))}
        
        {/* Empty state message for DRAFT */}
        {status === 'DRAFT' && (
          <div className="relative flex gap-4 opacity-60">
            <div className="w-2 h-2 rounded-full bg-gray-200 z-10 mt-2 -ml-1"></div>
            <div className="flex-1">
               <p className="text-xs text-gray-400 italic">More activity will appear here after you publish</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

