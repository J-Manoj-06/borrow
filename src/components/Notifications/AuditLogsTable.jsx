import React from 'react';
import Card from '../Card';
import Badge from '../Badge';
import EmptyState from '../EmptyState';
import { FiActivity } from 'react-icons/fi';

export const AuditLogsTable = ({ logs = [] }) => {
  const formatDate = (val) => {
    if (!val) return 'Just now';
    if (val.toDate) return val.toDate().toLocaleString();
    return new Date(val).toLocaleString();
  };

  if (logs.length === 0) {
    return (
      <EmptyState
        icon={FiActivity}
        title="No audit logs available."
        description="System actions will be recorded here automatically."
      />
    );
  }

  return (
    <Card className="p-0 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="bg-[#111111] border-b border-[#2A2A2A] text-[#A1A1AA] uppercase tracking-wider font-semibold sticky top-0 z-10">
            <tr>
              <th className="py-3.5 px-4">Timestamp</th>
              <th className="py-3.5 px-4">User</th>
              <th className="py-3.5 px-4">Role</th>
              <th className="py-3.5 px-4">Action</th>
              <th className="py-3.5 px-4">Module</th>
              <th className="py-3.5 px-4">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#2A2A2A]">
            {logs.map((l) => (
              <tr key={l.id} className="hover:bg-[#1E1E1E]/60 transition-colors">
                <td className="py-3.5 px-4 font-mono text-[11px] text-[#A1A1AA]">
                  {formatDate(l.timestamp)}
                </td>
                <td className="py-3.5 px-4 font-semibold text-white">
                  {l.userEmail || l.performedBy || 'Librarian'}
                </td>
                <td className="py-3.5 px-4 text-[#A1A1AA]">
                  {l.role || 'Administrator'}
                </td>
                <td className="py-3.5 px-4 text-white">
                  <p className="font-semibold">{l.title || l.type || 'Action'}</p>
                  <p className="text-[10px] text-[#A1A1AA]">{l.action || l.description || ''}</p>
                </td>
                <td className="py-3.5 px-4 font-mono text-[11px] text-white">
                  {l.module || l.type?.split('_')[0] || 'System'}
                </td>
                <td className="py-3.5 px-4">
                  <Badge variant="success">Success</Badge>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
};

export default AuditLogsTable;
