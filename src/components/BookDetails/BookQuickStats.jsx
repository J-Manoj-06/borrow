import React from 'react';
import Card from '../Card';
import Badge from '../Badge';
import { FiBookOpen, FiRepeat, FiClock, FiUser, FiCalendar } from 'react-icons/fi';

export const BookQuickStats = ({ book }) => {
  if (!book) return null;

  const {
    status = 'available',
    availableCopies = 1,
    totalCopies = 1,
    borrowCount = 0,
    createdAt,
    updatedAt,
    createdBy = 'Librarian',
  } = book;

  const getStatusVariant = (st) => {
    switch (st?.toLowerCase()) {
      case 'available':
        return { variant: 'success', label: 'Available' };
      case 'borrowed':
        return { variant: 'warning', label: 'Borrowed' };
      case 'maintenance':
        return { variant: 'danger', label: 'Maintenance' };
      case 'archived':
        return { variant: 'neutral', label: 'Archived' };
      default:
        return { variant: 'success', label: 'Available' };
    }
  };

  const statusInfo = getStatusVariant(status);

  const formatDate = (val) => {
    if (!val) return 'N/A';
    if (val.toDate) return val.toDate().toLocaleDateString();
    return new Date(val).toLocaleDateString();
  };

  return (
    <Card className="p-5 space-y-4">
      <div className="flex items-center justify-between pb-3 border-b border-[#2A2A2A]">
        <span className="text-xs font-semibold text-[#A1A1AA] uppercase tracking-wider">
          Quick Metrics
        </span>
        <Badge variant={statusInfo.variant}>{statusInfo.label}</Badge>
      </div>

      <div className="space-y-3 text-xs">
        <div className="flex items-center justify-between p-2.5 rounded-xl bg-[#111111] border border-[#2A2A2A]">
          <span className="text-[#A1A1AA] flex items-center gap-2">
            <FiBookOpen className="w-4 h-4 text-white" /> Copies Ratio
          </span>
          <span className="font-bold text-white">
            {availableCopies} / {totalCopies} copies
          </span>
        </div>

        <div className="flex items-center justify-between p-2.5 rounded-xl bg-[#111111] border border-[#2A2A2A]">
          <span className="text-[#A1A1AA] flex items-center gap-2">
            <FiRepeat className="w-4 h-4 text-white" /> Total Borrows
          </span>
          <span className="font-bold text-white">{borrowCount} times</span>
        </div>

        <div className="flex items-center justify-between p-2.5 rounded-xl bg-[#111111] border border-[#2A2A2A]">
          <span className="text-[#A1A1AA] flex items-center gap-2">
            <FiCalendar className="w-4 h-4 text-white" /> Cataloged On
          </span>
          <span className="font-medium text-white">{formatDate(createdAt)}</span>
        </div>

        <div className="flex items-center justify-between p-2.5 rounded-xl bg-[#111111] border border-[#2A2A2A]">
          <span className="text-[#A1A1AA] flex items-center gap-2">
            <FiClock className="w-4 h-4 text-white" /> Last Updated
          </span>
          <span className="font-medium text-white">{formatDate(updatedAt)}</span>
        </div>

        <div className="flex items-center justify-between p-2.5 rounded-xl bg-[#111111] border border-[#2A2A2A]">
          <span className="text-[#A1A1AA] flex items-center gap-2">
            <FiUser className="w-4 h-4 text-white" /> Cataloged By
          </span>
          <span className="font-medium text-white truncate max-w-[120px]" title={createdBy}>
            {createdBy}
          </span>
        </div>
      </div>
    </Card>
  );
};

export default BookQuickStats;
