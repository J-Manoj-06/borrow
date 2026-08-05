import React, { useState, useEffect } from 'react';
import Card from '../Card';
import Button from '../Button';
import { FiSave, FiCheckSquare, FiSquare, FiBell } from 'react-icons/fi';

export const NotificationsTab = ({ data = {}, onSave, isSaving }) => {
  const [prefs, setPrefs] = useState({
    borrowApproved: true,
    borrowRejected: true,
    dueTomorrow: true,
    overdueReminder: true,
    bookReturned: true,
    accountApproved: true,
    accountSuspended: true,
  });

  useEffect(() => {
    if (data) {
      setPrefs({
        borrowApproved: data.borrowApproved ?? true,
        borrowRejected: data.borrowRejected ?? true,
        dueTomorrow: data.dueTomorrow ?? true,
        overdueReminder: data.overdueReminder ?? true,
        bookReturned: data.bookReturned ?? true,
        accountApproved: data.accountApproved ?? true,
        accountSuspended: data.accountSuspended ?? true,
      });
    }
  }, [data]);

  const togglePref = (key) => {
    setPrefs((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave('notification_preferences', prefs);
  };

  const notificationItems = [
    { key: 'borrowApproved', label: 'Borrow Request Approved Notification', desc: 'Notify student when their borrow request is approved' },
    { key: 'borrowRejected', label: 'Borrow Request Declined Notification', desc: 'Notify student when their borrow request is rejected' },
    { key: 'dueTomorrow', label: 'Due Tomorrow Reminder', desc: 'Send automated reminder 24 hours before due date' },
    { key: 'overdueReminder', label: 'Overdue Loan Notification', desc: 'Send notification when loan exceeds due date' },
    { key: 'bookReturned', label: 'Book Returned Check-in Confirmation', desc: 'Send confirmation when book return is processed' },
    { key: 'accountApproved', label: 'Account Approval Notification', desc: 'Notify student when registration is verified' },
    { key: 'accountSuspended', label: 'Account Suspension Notice', desc: 'Notify student if account access is suspended' },
  ];

  return (
    <Card className="p-6">
      <form onSubmit={handleSubmit} className="space-y-6 text-xs text-white">
        <div className="border-b border-[#2A2A2A] pb-4 flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <FiBell className="w-4 h-4 text-white" /> Mobile Notification Preferences
            </h3>
            <p className="text-xs text-[#A1A1AA]">Configure automated event messages dispatched to the Borrow Flutter app</p>
          </div>
          <Button type="submit" variant="primary" size="sm" icon={FiSave} loading={isSaving}>
            Save Preferences
          </Button>
        </div>

        <div className="space-y-3">
          {notificationItems.map((item) => {
            const isChecked = prefs[item.key];
            return (
              <div
                key={item.key}
                onClick={() => togglePref(item.key)}
                className="flex items-center justify-between p-4 rounded-xl bg-[#111111] border border-[#2A2A2A] cursor-pointer hover:border-neutral-500 transition-colors select-none"
              >
                <div>
                  <h4 className="font-bold text-white text-xs">{item.label}</h4>
                  <p className="text-[11px] text-[#A1A1AA] mt-0.5">{item.desc}</p>
                </div>
                {isChecked ? (
                  <FiCheckSquare className="w-5 h-5 text-white shrink-0" />
                ) : (
                  <FiSquare className="w-5 h-5 text-[#A1A1AA] shrink-0" />
                )}
              </div>
            );
          })}
        </div>
      </form>
    </Card>
  );
};

export default NotificationsTab;
