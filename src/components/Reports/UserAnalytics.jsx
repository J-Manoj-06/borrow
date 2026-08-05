import React from 'react';
import Card from '../Card';
import Avatar from '../Avatar';
import { FiUsers, FiAward } from 'react-icons/fi';

export const UserAnalytics = ({ activeStudentsList = [] }) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
      {/* Active Borrowers Summary Card (1 col) */}
      <Card className="p-5 flex flex-col justify-between">
        <div>
          <h3 className="text-sm font-bold text-white flex items-center gap-2 mb-1">
            <FiUsers className="w-4 h-4 text-white" /> Most Active Students
          </h3>
          <p className="text-xs text-[#A1A1AA]">Realtime student loan engagement breakdown</p>
        </div>

        <div className="mt-4 space-y-4 text-xs">
          <div className="bg-[#111111] p-3.5 rounded-xl border border-[#2A2A2A] flex justify-between items-center">
            <span className="text-[#A1A1AA]">Active Student Accounts:</span>
            <span className="text-base font-extrabold text-white">{activeStudentsList.length}</span>
          </div>
        </div>
      </Card>

      {/* Top Student Borrowers Table Grid (2 cols) */}
      <Card className="p-5 lg:col-span-2">
        <h3 className="text-sm font-bold text-white flex items-center gap-2 mb-1">
          <FiAward className="w-4 h-4 text-[#F59E0B]" /> Top Student Borrowers
        </h3>
        <p className="text-xs text-[#A1A1AA] mb-4">Ranked by total books borrowed in library system</p>

        {activeStudentsList.length === 0 ? (
          <div className="p-6 text-center text-[#A1A1AA] text-xs bg-[#111111] rounded-xl border border-[#2A2A2A]">
            No Student Activity Found
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {activeStudentsList.map((st, idx) => (
              <div key={st.studentName + idx} className="flex items-center gap-3 p-3 rounded-xl bg-[#111111] border border-[#2A2A2A]">
                <div className="w-6 text-center text-xs font-bold text-[#A1A1AA] font-mono">
                  #{idx + 1}
                </div>
                <Avatar name={st.studentName} size="sm" />
                <div className="flex-1 overflow-hidden text-xs">
                  <p className="font-bold text-white truncate">{st.studentName}</p>
                  <p className="text-[10px] text-[#A1A1AA]">{st.department || 'General'}</p>
                </div>
                <div className="text-right text-xs">
                  <span className="font-extrabold text-white">{st.booksBorrowed}</span>
                  <span className="text-[10px] text-[#A1A1AA] block">borrowed</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
};

export default UserAnalytics;
