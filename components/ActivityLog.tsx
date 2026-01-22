
import React from 'react';
import { ActivityLogEntry } from '../types';

interface ActivityLogProps {
  entries: ActivityLogEntry[];
}

const ActivityLog: React.FC<ActivityLogProps> = ({ entries }) => {
  const formatTime = (ts: number) => {
    return new Date(ts).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  };

  const getActionColor = (action: ActivityLogEntry['action']) => {
    switch (action) {
      case 'added': return 'text-green-400';
      case 'deleted': return 'text-red-400';
      case 'modified': return 'text-blue-400';
      case 'promoted': return 'text-amber-400';
      default: return 'text-gray-400';
    }
  };

  return (
    <div className="bg-gray-900 rounded-xl shadow-inner border border-gray-700 mb-8 overflow-hidden animate-fadeIn">
      <div className="flex items-center justify-between px-4 py-2 bg-gray-800 border-b border-gray-700">
        <h2 className="text-xs font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
          Admin Activity Log
        </h2>
      </div>
      <div className="max-h-48 overflow-y-auto p-4 space-y-2 font-mono text-[11px] scrollbar-thin scrollbar-thumb-gray-700">
        {entries.length === 0 ? (
          <p className="text-gray-500 italic">No recent activity recorded.</p>
        ) : (
          [...entries].reverse().map((entry) => (
            <div key={entry.id} className="flex gap-3 border-b border-gray-800 pb-1 last:border-0">
              <span className="text-gray-600 flex-shrink-0">[{formatTime(entry.timestamp)}]</span>
              <span className="text-gray-300 font-bold flex-shrink-0">{entry.userName}</span>
              <span className={`font-bold flex-shrink-0 ${getActionColor(entry.action)}`}>{entry.action.toUpperCase()}</span>
              <span className="text-gray-400 truncate">{entry.details}</span>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ActivityLog;
