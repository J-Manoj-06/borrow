import React from 'react';
import Card from '../Card';
import Badge from '../Badge';
import Button from '../Button';
import Avatar from '../Avatar';
import EmptyState from '../EmptyState';
import Dropdown from '../Dropdown';
import { FiUsers, FiEye, FiUserCheck, FiUserX, FiEdit3, FiMoreVertical } from 'react-icons/fi';

export const UserTable = ({
  users = [],
  onSelectUser,
  onStatusChange,
  onLimitChange,
}) => {
  const getStatusBadge = (st) => {
    switch (st?.toLowerCase()) {
      case 'active':
        return <Badge variant="success">Active</Badge>;
      case 'suspended':
        return <Badge variant="danger">Suspended</Badge>;
      case 'pending':
        return <Badge variant="warning">Pending</Badge>;
      case 'graduated':
        return <Badge variant="neutral">Graduated</Badge>;
      default:
        return <Badge variant="success">Active</Badge>;
    }
  };

  const formatDate = (val) => {
    if (!val) return 'Today';
    if (val.toDate) return val.toDate().toLocaleDateString();
    return new Date(val).toLocaleDateString();
  };

  if (users.length === 0) {
    return (
      <EmptyState
        icon={FiUsers}
        title="No users found."
        description="Registered students from the Borrow Flutter app will appear here in real-time."
      />
    );
  }

  return (
    <div>
      {/* Desktop Table View */}
      <Card className="p-0 overflow-hidden hidden sm:block">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#111111] border-b border-[#2A2A2A] text-[#A1A1AA] uppercase tracking-wider font-semibold sticky top-0 z-10">
              <tr>
                <th className="py-3.5 px-4">Student</th>
                <th className="py-3.5 px-4">Reg Number</th>
                <th className="py-3.5 px-4">Dept & Semester</th>
                <th className="py-3.5 px-4">Contact</th>
                <th className="py-3.5 px-4">Active Books</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4">Last Login</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#2A2A2A]">
              {users.map((u) => {
                const activeCount = u.activeBorrowCount || u.currentBorrowedCount || 0;
                const limit = u.borrowLimit || 5;

                const menuItems = [
                  {
                    label: 'Inspect Profile',
                    icon: FiEye,
                    onClick: () => onSelectUser(u),
                  },
                  {
                    label: `Modify Limit (${limit})`,
                    icon: FiEdit3,
                    onClick: () => onLimitChange(u),
                  },
                  { divider: true },
                  u.status === 'suspended'
                    ? {
                        label: 'Reactivate Account',
                        icon: FiUserCheck,
                        onClick: () => onStatusChange(u, 'active'),
                      }
                    : {
                        label: 'Suspend Account',
                        icon: FiUserX,
                        danger: true,
                        onClick: () => onStatusChange(u, 'suspended'),
                      },
                ];

                return (
                  <tr key={u.id} className="hover:bg-[#1E1E1E]/60 transition-colors">
                    <td className="py-3.5 px-4">
                      <div 
                        onClick={() => onSelectUser(u)} 
                        className="flex items-center gap-3 cursor-pointer group"
                      >
                        <Avatar src={u.profileImage} name={u.name || u.email} size="sm" />
                        <div>
                          <p className="font-semibold text-white group-hover:underline">
                            {u.name || 'Library Member'}
                          </p>
                          <p className="text-[10px] text-[#A1A1AA]">{u.email || 'student@borrow.app'}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 font-mono text-[11px] text-[#A1A1AA]">
                      {u.registerNumber || u.rollNo || u.studentId || 'REG-N/A'}
                    </td>
                    <td className="py-3.5 px-4 text-white">
                      <p className="font-medium">{u.department || 'Computer Science'}</p>
                      <p className="text-[10px] text-[#A1A1AA]">{u.semester || 'Semester 4'}</p>
                    </td>
                    <td className="py-3.5 px-4 text-[#A1A1AA]">
                      {u.phone || 'N/A'}
                    </td>
                    <td className="py-3.5 px-4 font-medium text-white">
                      <span className={activeCount >= limit ? 'text-[#F59E0B] font-bold' : ''}>
                        {activeCount}
                      </span>{' '}
                      <span className="text-[#A1A1AA]">/ {limit} limit</span>
                    </td>
                    <td className="py-3.5 px-4">{getStatusBadge(u.status)}</td>
                    <td className="py-3.5 px-4 text-[#A1A1AA]">{formatDate(u.lastLogin || u.createdAt)}</td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <Button
                          variant="secondary"
                          size="sm"
                          icon={FiEye}
                          onClick={() => onSelectUser(u)}
                          className="px-2 py-1 text-[11px]"
                        >
                          Inspect
                        </Button>
                        <Dropdown
                          align="right"
                          trigger={
                            <button
                              type="button"
                              className="p-1 rounded-lg text-[#A1A1AA] hover:text-white hover:bg-[#1E1E1E] transition-colors"
                            >
                              <FiMoreVertical className="w-4 h-4" />
                            </button>
                          }
                          items={menuItems}
                        />
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Mobile Responsive Cards View */}
      <div className="space-y-3 sm:hidden">
        {users.map((u) => {
          const activeCount = u.activeBorrowCount || 0;
          const limit = u.borrowLimit || 5;

          return (
            <Card key={u.id} className="p-4 space-y-3 border-[#2A2A2A]">
              <div className="flex items-center justify-between border-b border-[#2A2A2A] pb-3">
                <div className="flex items-center gap-2.5">
                  <Avatar src={u.profileImage} name={u.name} size="sm" />
                  <div>
                    <h4 className="font-bold text-white text-xs">{u.name || 'Member'}</h4>
                    <p className="text-[10px] text-[#A1A1AA] font-mono">{u.registerNumber || 'REG: N/A'}</p>
                  </div>
                </div>
                {getStatusBadge(u.status)}
              </div>

              <div className="text-xs space-y-1 text-[#A1A1AA]">
                <p><span className="text-white">Department:</span> {u.department || 'General'}</p>
                <p><span className="text-white">Active Loans:</span> {activeCount} / {limit} books</p>
              </div>

              <div className="pt-2 border-t border-[#2A2A2A] flex items-center justify-between">
                <Button variant="secondary" size="sm" icon={FiEye} onClick={() => onSelectUser(u)}>
                  Inspect
                </Button>
                {u.status === 'suspended' ? (
                  <Button variant="success" size="sm" onClick={() => onStatusChange(u, 'active')}>
                    Reactivate
                  </Button>
                ) : (
                  <Button variant="danger" size="sm" onClick={() => onStatusChange(u, 'suspended')}>
                    Suspend
                  </Button>
                )}
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default UserTable;
