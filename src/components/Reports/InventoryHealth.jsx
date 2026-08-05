import React from 'react';
import Card from '../Card';
import { FiCheckCircle, FiTool, FiBookOpen, FiArchive, FiBook } from 'react-icons/fi';

export const InventoryHealth = ({ health = {} }) => {
  const items = [
    { label: 'Total Copies', value: health.totalCopies || 0, icon: FiBook, color: 'text-white' },
    { label: 'Available Copies', value: health.availableCopies || 0, icon: FiCheckCircle, color: 'text-[#22C55E]' },
    { label: 'Issued Copies', value: health.issuedCopies || 0, icon: FiBookOpen, color: 'text-white' },
    { label: 'Under Maintenance', value: health.maintenance || 0, icon: FiTool, color: 'text-[#F59E0B]' },
    { label: 'Archived Books', value: health.archived || 0, icon: FiArchive, color: 'text-[#A1A1AA]' },
    { label: 'Reference Books', value: health.reference || 0, icon: FiBook, color: 'text-white' },
  ];

  return (
    <div className="mb-6">
      <h3 className="text-sm font-bold text-white mb-3">Inventory Health Overview</h3>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {items.map((i, idx) => {
          const Icon = i.icon;
          return (
            <Card key={idx} hoverable className="p-3.5 flex items-center justify-between">
              <div>
                <span className="text-[10px] text-[#A1A1AA] uppercase tracking-wider block truncate" title={i.label}>
                  {i.label}
                </span>
                <span className="text-lg font-extrabold text-white mt-1 block">{i.value}</span>
              </div>
              <Icon className={`w-4 h-4 ${i.color}`} />
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default InventoryHealth;
