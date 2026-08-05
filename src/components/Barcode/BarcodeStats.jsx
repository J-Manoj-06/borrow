import React from 'react';
import Card from '../Card';
import { FiMaximize, FiPrinter, FiCheckCircle, FiClock } from 'react-icons/fi';

export const BarcodeStats = ({ stats = {} }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {/* Books With Barcode */}
      <Card hoverable className="p-5 flex flex-col justify-between">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-[#A1A1AA] uppercase tracking-wider flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
            Books With Barcode
          </span>
          <div className="p-2 rounded-lg bg-[#1E1E1E] text-white">
            <FiCheckCircle className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-4">
          <h3 className="text-3xl font-extrabold text-white tracking-tight">{stats.booksWithBarcode || 0}</h3>
          <p className="text-xs text-[#A1A1AA] mt-1">Unique Code128 barcodes</p>
        </div>
      </Card>

      {/* Books With QR */}
      <Card hoverable className="p-5 flex flex-col justify-between">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-[#A1A1AA] uppercase tracking-wider flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#22C55E] animate-pulse" />
            Books With QR
          </span>
          <div className="p-2 rounded-lg bg-[#1E1E1E] text-[#22C55E]">
            <FiMaximize className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-4">
          <h3 className="text-3xl font-extrabold text-white tracking-tight">{stats.booksWithQR || 0}</h3>
          <p className="text-xs text-[#22C55E] mt-1">100% QR catalog coverage</p>
        </div>
      </Card>

      {/* Labels Printed */}
      <Card hoverable className="p-5 flex flex-col justify-between">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-[#A1A1AA] uppercase tracking-wider flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#F59E0B]" />
            Labels Printed
          </span>
          <div className="p-2 rounded-lg bg-[#1E1E1E] text-[#F59E0B]">
            <FiPrinter className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-4">
          <h3 className="text-3xl font-extrabold text-white tracking-tight">{stats.labelsPrinted || 0}</h3>
          <p className="text-xs text-[#F59E0B] mt-1">Label sheets generated</p>
        </div>
      </Card>

      {/* Pending Labels */}
      <Card hoverable className="p-5 flex flex-col justify-between">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-[#A1A1AA] uppercase tracking-wider flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-neutral-400" />
            Pending Labels
          </span>
          <div className="p-2 rounded-lg bg-[#1E1E1E] text-neutral-300">
            <FiClock className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-4">
          <h3 className="text-3xl font-extrabold text-white tracking-tight">{stats.pendingLabels || 0}</h3>
          <p className="text-xs text-[#A1A1AA] mt-1">Awaiting physical printing</p>
        </div>
      </Card>
    </div>
  );
};

export default BarcodeStats;
