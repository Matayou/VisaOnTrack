import React from 'react';

// Define the shape of the data we expect
export interface AuditLogEntry {
  id: string;
  action: string; // 'EDIT', 'PUBLISH', etc.
  createdAt: Date | string;
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
  const formatTimestamp = (date: Date) =>
    date.toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short' });

  const getActionLabel = (action: string) => {
    switch (action) {
      case 'REQUEST_CREATED':
        return 'Request created';
      case 'REQUEST_UPDATED':
        return 'Request updated';
      case 'EDIT':
        return 'Request edited';
      default:
        // Convert "SOME_ACTION_NAME" to "Some action name"
        return action.replace(/_/g, ' ').toLowerCase().replace(/^\w/, c => c.toUpperCase());
    }
  };

  const hasCreationLog = auditLogs.some(log => log.action === 'REQUEST_CREATED');

  // Combine creation event with audit logs
  const events = [
    // The creation event always exists (fallback if not in logs)
    ...(!hasCreationLog ? [{
      id: 'created',
      title: 'Request created',
      subtitle: formatTimestamp(requestCreatedAt),
      type: 'creation',
      timestamp: requestCreatedAt
    }] : []),
    // Map audit logs to timeline events
    ...auditLogs.map(log => {
      const date = new Date(log.createdAt);
      return {
        id: log.id,
        title: getActionLabel(log.action),
        subtitle: formatTimestamp(date),
        type: log.action === 'REQUEST_CREATED' ? 'creation' : 'action',
        timestamp: date
      };
    })
  ].sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime()); // Newest first

  return (
    <div className="ios-card p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xs font-bold text-text-secondary uppercase tracking-wider">Recent Activity</h3>
      </div>
      
      <div className="relative pl-2">
        <div className="absolute top-2 bottom-2 left-2 w-px bg-gray-100" aria-hidden="true"></div>
        <ol className="space-y-6" aria-label="Request activity timeline">
          {events.map((event) => (
            <li key={event.id} className="relative flex gap-4">
              <div className={`w-2.5 h-2.5 rounded-full border-2 z-10 mt-1.5 -ml-[5px] ${
                event.type === 'creation' ? 'bg-white border-green-500' : 'bg-white border-blue-500'
              }`}></div>
              <div className="flex-1">
                <p className="text-sm font-semibold text-text-primary">{event.title}</p>
                <time className="text-xs text-text-secondary mt-0.5 block" dateTime={event.timestamp.toISOString()}>{event.subtitle}</time>
              </div>
            </li>
          ))}
          
          {/* Empty state message for DRAFT */}
          {status === 'DRAFT' && (
            <li className="relative flex gap-4 opacity-70">
              <div className="w-2 h-2 rounded-full bg-gray-200 z-10 mt-2 -ml-1"></div>
              <div className="flex-1">
                <p className="text-xs text-text-secondary italic">More activity will appear here after you publish</p>
              </div>
            </li>
          )}
        </ol>
      </div>
    </div>
  );
};

