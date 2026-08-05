import React from 'react';
import Card from '../Card';
import { FiGrid } from 'react-icons/fi';

export const DepartmentGrid = ({ departmentAnalytics = [] }) => {
  if (departmentAnalytics.length === 0) {
    return (
      <div className="mb-6">
        <h3 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
          <FiGrid className="w-4 h-4 text-white" /> Department Analytics
        </h3>
        <div className="p-6 text-center text-[#A1A1AA] text-xs bg-[#111111] rounded-2xl border border-[#2A2A2A]">
          No Department Data Available
        </div>
      </div>
    );
  }

  return (
    <div className="mb-6">
      <h3 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
        <FiGrid className="w-4 h-4 text-white" /> Department Analytics
      </h3>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {departmentAnalytics.map((d) => (
          <Card key={d.name} hoverable className="p-4 space-y-3">
            <h4 className="font-bold text-white text-xs border-b border-[#2A2A2A] pb-2">{d.name}</h4>
            <div className="grid grid-cols-2 gap-2 text-[11px]">
              <div>
                <span className="text-[#A1A1AA] block">Active Users</span>
                <span className="font-bold text-white">{d.usersCount || 0}</span>
              </div>
              <div>
                <span className="text-[#A1A1AA] block">Books Borrowed</span>
                <span className="font-bold text-white">{d.booksBorrowed || 0}</span>
              </div>
            </div>
            <div className="pt-2 border-t border-[#2A2A2A] text-[10px] text-[#A1A1AA] flex justify-between">
              <span>Total Transactions:</span>
              <span className="text-white font-mono font-bold">{d.totalTransactions || 0}</span>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default DepartmentGrid;
