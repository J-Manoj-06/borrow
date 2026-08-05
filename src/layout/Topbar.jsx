import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { FiMenu, FiBell, FiSearch } from 'react-icons/fi';
import { useAuth } from '../hooks/useAuth';
import useNotifications from '../hooks/useNotifications';
import Avatar from '../components/Avatar';

export const Topbar = ({ onOpenSidebar }) => {
  const { user } = useAuth();
  const { stats } = useNotifications();
  const navigate = useNavigate();
  const location = useLocation();

  // Extract page title from route
  const getPageTitle = () => {
    const path = location.pathname;
    if (path.includes('/dashboard')) return 'Dashboard Overview';
    if (path.includes('/inventory/add')) return 'Add New Book';
    if (path.includes('/inventory/')) return 'Book Specifications';
    if (path.includes('/inventory')) return 'Book Inventory';
    if (path.includes('/requests')) return 'Borrow Requests';
    if (path.includes('/transactions')) return 'Book Transactions';
    if (path.includes('/users')) return 'Student Directory';
    if (path.includes('/reports')) return 'Reports & Analytics';
    if (path.includes('/settings')) return 'System Settings';
    if (path.includes('/notifications')) return 'Notification Center';
    return 'Admin Dashboard';
  };

  return (
    <header className="h-16 bg-[#111111] border-b border-[#2A2A2A] text-white px-4 md:px-6 flex items-center justify-between sticky top-0 z-20">
      {/* Left: Mobile Menu Toggle & Page Context */}
      <div className="flex items-center gap-3">
        <button
          onClick={onOpenSidebar}
          className="md:hidden p-2 rounded-xl text-[#A1A1AA] hover:text-white hover:bg-[#1E1E1E] transition-colors"
          title="Open Navigation Menu"
        >
          <FiMenu className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2">
          <h1 className="text-sm md:text-base font-bold tracking-tight text-white">
            {getPageTitle()}
          </h1>
        </div>
      </div>

      {/* Right Actions & Profile Avatar */}
      <div className="flex items-center gap-3">
        {/* Realtime Notification Center Bell Trigger */}
        <button
          type="button"
          onClick={() => navigate('/notifications')}
          className="relative p-2 rounded-xl text-[#A1A1AA] hover:text-white hover:bg-[#1E1E1E] transition-colors"
          title="Notification Center"
        >
          <FiBell className="w-5 h-5" />
          {stats.unreadCount > 0 && (
            <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-[#EF4444] text-white text-[10px] font-bold flex items-center justify-center animate-pulse">
              {stats.unreadCount > 9 ? '9+' : stats.unreadCount}
            </span>
          )}
        </button>

        {/* Profile Avatar Header */}
        <div 
          onClick={() => navigate('/settings')}
          className="flex items-center gap-2.5 pl-2 border-l border-[#2A2A2A] cursor-pointer group"
        >
          <Avatar name={user?.email || 'Admin'} size="sm" />
          <span className="hidden sm:block text-xs font-semibold text-white group-hover:underline">
            {user?.displayName || user?.email?.split('@')[0] || 'Librarian'}
          </span>
        </div>
      </div>
    </header>
  );
};

export default Topbar;
