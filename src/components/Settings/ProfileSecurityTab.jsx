import React, { useState } from 'react';
import Card from '../Card';
import Button from '../Button';
import Input from '../Input';
import Avatar from '../Avatar';
import { useAuth } from '../../hooks/useAuth';
import { FiUser, FiLock, FiShield, FiSave, FiLogOut } from 'react-icons/fi';
import { toast } from 'react-hot-toast';

export const ProfileSecurityTab = () => {
  const { user } = useAuth();

  const [phone, setPhone] = useState('+1 (555) 234-5678');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isChangingPass, setIsChangingPass] = useState(false);

  const handlePasswordChange = (e) => {
    e.preventDefault();
    if (!currentPassword) {
      toast.error('Please enter your current password.');
      return;
    }
    if (newPassword.length < 6) {
      toast.error('New password must be at least 6 characters.');
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error('Passwords do not match.');
      return;
    }

    setIsChangingPass(true);
    setTimeout(() => {
      setIsChangingPass(false);
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      toast.success('Administrator password updated successfully!');
    }, 1000);
  };

  const handleProfileSave = (e) => {
    e.preventDefault();
    toast.success('Librarian profile details updated!');
  };

  return (
    <div className="space-y-6 text-xs text-white">
      {/* Librarian Profile Summary */}
      <Card className="p-6">
        <div className="border-b border-[#2A2A2A] pb-4 mb-4 flex items-center justify-between">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <FiUser className="w-4 h-4 text-white" /> Administrator Profile
          </h3>
        </div>

        <form onSubmit={handleProfileSave} className="space-y-4">
          <div className="flex items-center gap-4">
            <Avatar name={user?.email || 'Admin'} size="lg" />
            <div>
              <h4 className="text-sm font-bold text-white">{user?.displayName || user?.email?.split('@')[0] || 'Head Librarian'}</h4>
              <p className="text-xs text-[#A1A1AA]">{user?.email || 'admin@borrow.app'}</p>
              <span className="inline-block px-2 py-0.5 mt-1 rounded bg-[#111111] border border-[#2A2A2A] text-[10px] text-white font-mono uppercase">
                System Administrator
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            <Input label="Email Address (Immutable)" value={user?.email || 'admin@borrow.app'} disabled />
            <Input label="Contact Phone" value={phone} onChange={(e) => setPhone(e.target.value)} />
          </div>

          <div className="flex justify-end">
            <Button type="submit" variant="primary" size="sm" icon={FiSave}>
              Save Profile
            </Button>
          </div>
        </form>
      </Card>

      {/* Password & Security Section */}
      <Card className="p-6">
        <div className="border-b border-[#2A2A2A] pb-4 mb-4">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <FiLock className="w-4 h-4 text-white" /> Change Administrator Password
          </h3>
          <p className="text-xs text-[#A1A1AA]">Ensure your account uses a strong, secure passphrase</p>
        </div>

        <form onSubmit={handlePasswordChange} className="space-y-4 max-w-md">
          <Input
            label="Current Password *"
            type="password"
            placeholder="••••••••"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            required
          />
          <Input
            label="New Password *"
            type="password"
            placeholder="••••••••"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
          />
          <Input
            label="Confirm New Password *"
            type="password"
            placeholder="••••••••"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />

          <Button type="submit" variant="primary" size="sm" icon={FiShield} loading={isChangingPass}>
            Update Password
          </Button>
        </form>
      </Card>

      {/* Recent Security Activity Timeline */}
      <Card className="p-6">
        <h3 className="text-sm font-bold text-white mb-3">Recent Security Events</h3>
        <div className="space-y-2 text-xs">
          <div className="p-3 rounded-xl bg-[#111111] border border-[#2A2A2A] flex justify-between items-center">
            <div>
              <p className="font-semibold text-white">Successful Admin Login</p>
              <p className="text-[10px] text-[#A1A1AA]">Browser session established • IP: 192.168.1.42</p>
            </div>
            <span className="text-[#A1A1AA] font-mono text-[10px]">Today, 10:45 AM</span>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default ProfileSecurityTab;
