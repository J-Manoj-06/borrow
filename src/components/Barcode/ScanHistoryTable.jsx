import React from 'react';
import Card from '../Card';
import Badge from '../Badge';
import EmptyState from '../EmptyState';
import { FiActivity } from 'react-icons/fi';

export const ScanHistoryTable = ({ history = [] }) => {
  const formatDate = (val) => {
    if (!val) return 'Just now';
    if (val.toDate) return val.toDate().toLocaleString();
    return new Date(val).toLocaleString();
  };

  if (history.length === 0) {
    return (
      <EmptyState
        icon={FiActivity}
        title="No scan history available."
        description="Every barcode or QR code verification event will be logged here."
      />
    );
  }

  return (
    <Card className="p-0 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="bg-[#111111] border-b border-[#2A2A2A] text-[#A1A1AA] uppercase tracking-wider font-semibold sticky top-0 z-10">
            <tr>
              <th className="py-3.5 px-4 font-mono">Timestamp</th>
              <th className="py-3.5 px-4">Librarian / Device</th>
              <th className="py-3.5 px-4">Book Title</th>
              <th className="py-3.5 px-4 font-mono">Barcode</th>
              <th className="py-3.5 px-4">Operation</th>
              <th className="py-3.5 px-4">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#2A2A2A]">
            {history.map((h) => (
              <tr key={h.id} className="hover:bg-[#1E1E1E]/60 transition-colors">
                <td className="py-3.5 px-4 font-mono text-[11px] text-[#A1A1AA]">
                  {formatDate(h.timestamp)}
                </td>
                <td className="py-3.5 px-4 font-semibold text-white">
                  {h.performedBy || 'Librarian'}
                </td>
                <td className="py-3.5 px-4 text-white font-semibold">{h.bookTitle || 'N/A'}</td>
                <td className="py-3.5 px-4 font-mono text-white">{h.barcode || 'N/A'}</td>
                <td className="py-3.5 px-4 font-mono uppercase text-[#A1A1AA]">{h.operation || 'verify'}</td>
                <td className="py-3.5 px-4">
                  <Badge variant="success">Verified</Badge>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
};

export default ScanHistoryTable;
