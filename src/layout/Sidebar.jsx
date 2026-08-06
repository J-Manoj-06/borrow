import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  FiGrid, 
  FiBookOpen, 
  FiClock, 
  FiRepeat, 
  FiUsers, 
  FiBarChart2, 
  FiBell, 
  FiMaximize, 
  FiSettings, 
  FiLogOut, 
  FiBook, 
  FiX 
} from 'react-icons/fi';
import { useAuth } from '../hooks/useAuth';
import useNotifications from '../hooks/useNotifications';
import useDashboardData from '../hooks/useDashboardData';
import Avatar from '../components/Avatar';

const navItems = [
  { name: 'Dashboard', path: '/dashboard', icon: FiGrid },
  { name: 'Inventory', path: '/inventory', icon: FiBookOpen },
  { name: 'Borrow Requests', path: '/borrow-requests', icon: FiClock },
  { name: 'Transactions', path: '/transactions', icon: FiRepeat },
  { name: 'Users', path: '/users', icon: FiUsers },
  { name: 'Reports', path: '/reports', icon: FiBarChart2 },
  { name: 'Notifications', path: '/notifications', icon: FiBell },
  { name: 'Settings', path: '/settings', icon: FiSettings },
];

export const Sidebar = ({ isOpen, onClose }) => {
  const { user, logout } = useAuth();
  const { stats } = useNotifications();
  const { stats: dashStats } = useDashboardData();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const sidebarContent = (
    <div className="flex flex-col h-full bg-[#111111] border-r border-[#2A2A2A] text-white">
      {/* Brand Header */}
      <div className="flex items-center justify-between px-6 py-5 border-b border-[#2A2A2A]">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-white text-black flex items-center justify-center font-bold">
            <FiBook className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-sm font-semibold tracking-tight text-white leading-none">Borrow Admin</h2>
            <p className="text-[11px] text-[#A1A1AA] mt-1 font-normal">Library System</p>
          </div>
        </div>
        {/* Mobile close button */}
        {onClose && (
          <button 
            onClick={onClose}
            className="md:hidden text-[#A1A1AA] hover:text-white p-1 rounded-lg hover:bg-[#1E1E1E]"
          >
            <FiX className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Navigation List */}
      <div className="flex-1 py-6 px-3 space-y-1 overflow-y-auto">
        <p className="px-3 text-[10px] font-semibold text-[#A1A1AA] uppercase tracking-wider mb-2">
          Management
        </p>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isNotif = item.path === '/notifications';
          const isRequests = item.path === '/borrow-requests';

          return (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={() => onClose && onClose()}
              className={({ isActive }) =>
                `relative flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 group ${
                  isActive
                    ? 'bg-[#171717] text-white font-semibold'
                    : 'text-[#A1A1AA] hover:bg-[#1E1E1E] hover:text-white'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <div className="flex items-center gap-3">
                    {/* Thin white vertical line active indicator */}
                    {isActive && (
                      <motion.div
                        layoutId="sidebarActiveIndicator"
                        className="absolute left-0 top-1.5 bottom-1.5 w-[3px] bg-white rounded-r-full"
                        transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                      />
                    )}
                    <Icon className={`w-4 h-4 shrink-0 transition-colors ${isActive ? 'text-white' : 'text-[#A1A1AA] group-hover:text-white'}`} />
                    <span>{item.name}</span>
                  </div>

                  {isNotif && stats.unreadCount > 0 && (
                    <span className="px-1.5 py-0.5 rounded-full bg-[#EF4444] text-white text-[10px] font-bold">
                      {stats.unreadCount}
                    </span>
                  )}

                  {isRequests && dashStats.pendingRequests > 0 && (
                    <span className="px-1.5 py-0.5 rounded-full bg-[#F59E0B] text-black text-[10px] font-bold">
                      {dashStats.pendingRequests}
                    </span>
                  )}
                </>
              )}
            </NavLink>
          );
        })}
      </div>

      {/* Bottom Profile & Logout */}
      <div className="p-4 border-t border-[#2A2A2A] bg-[#0E0E0E]">
        <div className="flex items-center justify-between gap-3 p-2 rounded-xl bg-[#171717] border border-[#2A2A2A]">
          <div className="flex items-center gap-2.5 overflow-hidden">
            <Avatar name={user?.email || 'Librarian'} size="sm" />
            <div className="overflow-hidden">
              <p className="text-xs font-semibold text-white truncate">
                {user?.displayName || user?.email?.split('@')[0] || 'Librarian'}
              </p>
              <p className="text-[10px] text-[#A1A1AA] truncate">
                {user?.email || 'librarian@borrow.app'}
              </p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            title="Sign Out"
            className="text-[#A1A1AA] hover:text-[#EF4444] p-1.5 rounded-lg hover:bg-red-950/40 transition-colors shrink-0"
          >
            <FiLogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar (Permanent) */}
      <aside className="hidden md:block w-64 fixed inset-y-0 left-0 z-30">
        {sidebarContent}
      </aside>

      {/* Mobile Drawer (Collapsible) */}
      {isOpen && (
        <div className="md:hidden fixed inset-0 z-50 flex">
          {/* Overlay backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/80 backdrop-blur-xs"
          />
          {/* Sliding drawer */}
          <motion.div
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="relative z-10 w-64 max-w-[80vw] h-full"
          >
            {sidebarContent}
          </motion.div>
        </div>
      )}
    </>
  );
};

export default Sidebar;
