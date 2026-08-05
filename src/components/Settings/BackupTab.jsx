import React from 'react';
import Card from '../Card';
import Button from '../Button';
import { FiDatabase, FiDownload, FiUpload, FiRefreshCw } from 'react-icons/fi';
import { toast } from 'react-hot-toast';

export const BackupTab = () => {
  const handleBackup = () => {
    toast.success('Database backup initiated (UI Architecture Simulation).');
  };

  const handleRestore = () => {
    toast.success('Restore pipeline initialized (UI Architecture Simulation).');
  };

  return (
    <Card className="p-6">
      <div className="border-b border-[#2A2A2A] pb-4 mb-4">
        <h3 className="text-base font-bold text-white flex items-center gap-2">
          <FiDatabase className="w-4 h-4 text-white" /> Database Backup & Configuration Restore
        </h3>
        <p className="text-xs text-[#A1A1AA]">Manage data snapshots and configuration backups</p>
      </div>

      <div className="space-y-6 text-xs text-white">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-5 rounded-2xl bg-[#111111] border border-[#2A2A2A] space-y-3">
            <h4 className="font-bold text-white text-sm flex items-center gap-2">
              <FiDownload className="w-4 h-4 text-white" /> Export Database Backup
            </h4>
            <p className="text-xs text-[#A1A1AA]">
              Generate a full JSON snapshot of books, transactions, requests, and user records.
            </p>
            <Button variant="primary" size="sm" icon={FiDownload} onClick={handleBackup}>
              Create Backup Snapshot
            </Button>
          </div>

          <div className="p-5 rounded-2xl bg-[#111111] border border-[#2A2A2A] space-y-3">
            <h4 className="font-bold text-white text-sm flex items-center gap-2">
              <FiUpload className="w-4 h-4 text-white" /> Restore Snapshot
            </h4>
            <p className="text-xs text-[#A1A1AA]">
              Import and restore data collections from a previously generated backup JSON file.
            </p>
            <Button variant="secondary" size="sm" icon={FiRefreshCw} onClick={handleRestore}>
              Import & Restore
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default BackupTab;
