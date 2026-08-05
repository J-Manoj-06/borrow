import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Avatar from '../Avatar';
import Badge from '../Badge';
import Button from '../Button';
import Input from '../Input';
import { subscribeToUserTransactions } from '../../services/userService';
import { 
  FiX, 
  FiUser, 
  FiMail, 
  FiPhone, 
  FiMapPin, 
  FiBookOpen, 
  FiClock, 
  FiUserCheck, 
  FiUserX, 
  FiEdit3, 
  FiSave, 
  FiBook 
} from 'react-icons/fi';
import { cn } from '../../utils/cn';

export const UserDrawer = ({
  isOpen,
  onClose,
  user,
  onStatusChange,
  onLimitChange,
  onProfileSave,
  isUpdatingProfile,
}) => {
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('overview'); // 'overview' | 'active_books' | 'history' | 'edit'
  const [userTransactions, setUserTransactions] = useState([]);

  // Editable Profile Form State
  const [phone, setPhone] = useState('');
  const [department, setDepartment] = useState('');
  const [semester, setSemester] = useState('');
  const [address, setAddress] = useState('');
  const [emergencyContact, setEmergencyContact] = useState('');
  const [notes, setNotes] = useState('');

  useEffect(() => {
    if (user) {
      setPhone(user.phone || '');
      setDepartment(user.department || 'Computer Science');
      setSemester(user.semester || 'Semester 4');
      setAddress(user.address || '');
      setEmergencyContact(user.emergencyContact || '');
      setNotes(user.notes || '');

      const unsubscribe = subscribeToUserTransactions(user.id, (list) => {
        setUserTransactions(list);
      });
      return () => unsubscribe && unsubscribe();
    }
  }, [user]);

  if (!user) return null;

  const activeBooks = userTransactions.filter((t) => t.status === 'issued' || t.status === 'active' || t.status === 'extended');
  const pastBooks = userTransactions.filter((t) => t.status === 'returned' || t.status === 'completed');

  const formatDate = (val) => {
    if (!val) return 'N/A';
    if (val.toDate) return val.toDate().toLocaleDateString();
    return new Date(val).toLocaleDateString();
  };

  const handleProfileFormSubmit = (e) => {
    e.preventDefault();
    onProfileSave(user.id, {
      phone,
      department,
      semester,
      address,
      emergencyContact,
      notes,
    });
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex justify-end">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/80 backdrop-blur-xs"
          />

          {/* Sliding Drawer */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', stiffness: 320, damping: 32 }}
            className="relative z-10 w-full max-w-xl h-full bg-[#111111] border-l border-[#2A2A2A] text-white flex flex-col justify-between overflow-y-auto"
          >
            {/* Header */}
            <div className="p-6 border-b border-[#2A2A2A] flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Avatar src={user.profileImage} name={user.name || user.email} size="md" />
                <div>
                  <h3 className="text-lg font-bold tracking-tight text-white">{user.name || 'Member'}</h3>
                  <p className="text-xs text-[#A1A1AA] font-mono">Reg: {user.registerNumber || user.rollNo || 'N/A'}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="text-[#A1A1AA] hover:text-white p-2 rounded-xl hover:bg-[#1E1E1E] transition-colors"
              >
                <FiX className="w-5 h-5" />
              </button>
            </div>

            {/* Navigation Tabs */}
            <div className="flex border-b border-[#2A2A2A] bg-[#171717] px-4">
              {[
                { id: 'overview', label: 'Overview' },
                { id: 'active_books', label: `Active Books (${activeBooks.length})` },
                { id: 'history', label: `Borrow History (${userTransactions.length})` },
                { id: 'edit', label: 'Status & Edit' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  className={cn(
                    'py-3 px-4 text-xs font-semibold border-b-2 transition-colors',
                    activeTab === tab.id
                      ? 'border-white text-white'
                      : 'border-transparent text-[#A1A1AA] hover:text-white'
                  )}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Drawer Body Content */}
            <div className="p-6 space-y-6 flex-1 text-xs">
              {/* TAB 1: OVERVIEW */}
              {activeTab === 'overview' && (
                <div className="space-y-6">
                  {/* Account Metrics Card */}
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 bg-[#171717] p-4 rounded-2xl border border-[#2A2A2A]">
                    <div>
                      <span className="text-[10px] text-[#A1A1AA] uppercase">Account Status</span>
                      <div className="mt-1">
                        <Badge variant={user.status === 'suspended' ? 'danger' : 'success'}>
                          {user.status || 'Active'}
                        </Badge>
                      </div>
                    </div>
                    <div>
                      <span className="text-[10px] text-[#A1A1AA] uppercase">Borrow Limit</span>
                      <span className="font-bold text-white text-sm block mt-0.5">{user.borrowLimit || 5} books</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-[#A1A1AA] uppercase">Active Loans</span>
                      <span className="font-bold text-white text-sm block mt-0.5">{activeBooks.length} books</span>
                    </div>
                  </div>

                  {/* Profile Contact Card */}
                  <div className="bg-[#171717] border border-[#2A2A2A] rounded-2xl p-5 space-y-3">
                    <h4 className="text-xs font-semibold text-[#A1A1AA] uppercase tracking-wider flex items-center gap-1.5">
                      <FiUser className="w-3.5 h-3.5 text-white" /> Membership Specification
                    </h4>

                    <div className="grid grid-cols-2 gap-3 pt-1 text-xs">
                      <div>
                        <span className="text-[#A1A1AA] block">Email Address</span>
                        <span className="font-medium text-white truncate block">{user.email || 'N/A'}</span>
                      </div>
                      <div>
                        <span className="text-[#A1A1AA] block">Phone Number</span>
                        <span className="font-medium text-white">{user.phone || 'N/A'}</span>
                      </div>
                      <div>
                        <span className="text-[#A1A1AA] block">Department</span>
                        <span className="font-medium text-white">{user.department || 'Computer Science'}</span>
                      </div>
                      <div>
                        <span className="text-[#A1A1AA] block">Semester</span>
                        <span className="font-medium text-white">{user.semester || 'Semester 4'}</span>
                      </div>
                    </div>

                    <div className="pt-2 border-t border-[#2A2A2A]">
                      <span className="text-[#A1A1AA] block">Address / Residence</span>
                      <span className="font-medium text-white">{user.address || 'Not specified'}</span>
                    </div>
                  </div>

                  {/* Timestamps */}
                  <div className="bg-[#171717] border border-[#2A2A2A] rounded-2xl p-5 space-y-2">
                    <div className="flex justify-between">
                      <span className="text-[#A1A1AA]">Account Registered:</span>
                      <span className="font-semibold text-white">{formatDate(user.createdAt)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#A1A1AA]">Last App Login:</span>
                      <span className="font-semibold text-white">{formatDate(user.lastLogin)}</span>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 2: CURRENTLY BORROWED BOOKS */}
              {activeTab === 'active_books' && (
                <div className="space-y-4">
                  {activeBooks.length === 0 ? (
                    <div className="p-8 text-center bg-[#171717] rounded-2xl border border-[#2A2A2A]">
                      <FiBookOpen className="w-8 h-8 text-[#A1A1AA] mx-auto mb-2" />
                      <p className="font-bold text-white">No active borrowed books</p>
                      <p className="text-xs text-[#A1A1AA] mt-1">Student currently has 0 active book dispensations.</p>
                    </div>
                  ) : (
                    activeBooks.map((b) => (
                      <div key={b.id} className="bg-[#171717] border border-[#2A2A2A] rounded-xl p-4 flex items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-14 bg-[#111111] rounded border border-[#2A2A2A] overflow-hidden flex items-center justify-center shrink-0">
                            {b.bookCover ? (
                              <img src={b.bookCover} alt={b.bookTitle} className="w-full h-full object-cover" />
                            ) : (
                              <FiBook className="w-4 h-4 text-[#A1A1AA]" />
                            )}
                          </div>
                          <div>
                            <h4 className="font-bold text-white text-xs">{b.bookTitle || 'Book Title'}</h4>
                            <p className="text-[10px] text-[#A1A1AA] mt-0.5">Due Date: {formatDate(b.dueDate)}</p>
                            <Badge variant={b.isOverdue ? 'danger' : 'warning'} size="sm" className="mt-1">
                              {b.isOverdue ? 'Overdue' : b.status || 'Active'}
                            </Badge>
                          </div>
                        </div>
                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={() => {
                            onClose();
                            navigate('/transactions');
                          }}
                        >
                          Manage Return
                        </Button>
                      </div>
                    ))
                  )}
                </div>
              )}

              {/* TAB 3: BORROW HISTORY */}
              {activeTab === 'history' && (
                <div className="space-y-3">
                  {userTransactions.length === 0 ? (
                    <div className="p-8 text-center bg-[#171717] rounded-2xl border border-[#2A2A2A]">
                      <FiClock className="w-8 h-8 text-[#A1A1AA] mx-auto mb-2" />
                      <p className="font-bold text-white">No history records</p>
                      <p className="text-xs text-[#A1A1AA] mt-1">This user has no past loan records.</p>
                    </div>
                  ) : (
                    userTransactions.map((t) => (
                      <div key={t.id} className="bg-[#171717] border border-[#2A2A2A] rounded-xl p-3.5 flex items-center justify-between text-xs">
                        <div>
                          <p className="font-bold text-white">{t.bookTitle || 'Book Title'}</p>
                          <p className="text-[10px] text-[#A1A1AA] mt-0.5">
                            Issued: {formatDate(t.issueDate)} • Returned: {formatDate(t.returnDate)}
                          </p>
                        </div>
                        <Badge variant={t.status === 'returned' ? 'success' : 'warning'}>
                          {t.status}
                        </Badge>
                      </div>
                    ))
                  )}
                </div>
              )}

              {/* TAB 4: STATUS & PROFILE EDIT */}
              {activeTab === 'edit' && (
                <div className="space-y-6">
                  {/* Account Status Control */}
                  <div className="bg-[#171717] border border-[#2A2A2A] rounded-2xl p-5 space-y-4">
                    <h4 className="text-xs font-semibold text-[#A1A1AA] uppercase tracking-wider">
                      Account Status Controls
                    </h4>

                    <div className="flex flex-wrap gap-3">
                      {user.status === 'suspended' ? (
                        <Button
                          variant="success"
                          size="sm"
                          icon={FiUserCheck}
                          onClick={() => onStatusChange(user, 'active')}
                        >
                          Reactivate Account
                        </Button>
                      ) : (
                        <Button
                          variant="danger"
                          size="sm"
                          icon={FiUserX}
                          onClick={() => onStatusChange(user, 'suspended')}
                        >
                          Suspend Account
                        </Button>
                      )}

                      <Button
                        variant="secondary"
                        size="sm"
                        icon={FiEdit3}
                        onClick={() => onLimitChange(user)}
                      >
                        Modify Limit ({user.borrowLimit || 5})
                      </Button>
                    </div>
                  </div>

                  {/* Profile Edit Form */}
                  <form onSubmit={handleProfileFormSubmit} className="bg-[#171717] border border-[#2A2A2A] rounded-2xl p-5 space-y-4">
                    <h4 className="text-xs font-semibold text-[#A1A1AA] uppercase tracking-wider pb-2 border-b border-[#2A2A2A]">
                      Edit Contact Details
                    </h4>

                    {/* Immutable fields info */}
                    <div className="grid grid-cols-2 gap-3 text-[11px] bg-[#111111] p-3 rounded-xl border border-[#2A2A2A]">
                      <div>
                        <span className="text-[#A1A1AA] block">Reg Number (Immutable)</span>
                        <span className="font-mono text-white">{user.registerNumber || 'N/A'}</span>
                      </div>
                      <div>
                        <span className="text-[#A1A1AA] block">Email (Immutable)</span>
                        <span className="text-white truncate block">{user.email || 'N/A'}</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <Input
                        label="Phone Number"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                      />
                      <Input
                        label="Department"
                        value={department}
                        onChange={(e) => setDepartment(e.target.value)}
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <Input
                        label="Semester"
                        value={semester}
                        onChange={(e) => setSemester(e.target.value)}
                      />
                      <Input
                        label="Emergency Contact"
                        value={emergencyContact}
                        onChange={(e) => setEmergencyContact(e.target.value)}
                      />
                    </div>

                    <Input
                      label="Address"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                    />

                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-medium text-[#A1A1AA]">Librarian Notes</label>
                      <textarea
                        rows={3}
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        className="w-full bg-[#171717] text-white text-xs rounded-xl border border-[#2A2A2A] p-3 outline-none focus:border-white"
                      />
                    </div>

                    <div className="pt-2 flex justify-end">
                      <Button
                        type="submit"
                        variant="primary"
                        size="sm"
                        icon={FiSave}
                        loading={isUpdatingProfile}
                      >
                        Save Profile Details
                      </Button>
                    </div>
                  </form>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="p-6 border-t border-[#2A2A2A] bg-[#0E0E0E] flex justify-end">
              <Button variant="secondary" onClick={onClose}>
                Close
              </Button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default UserDrawer;
