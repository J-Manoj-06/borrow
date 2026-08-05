import React from 'react';
import Card from '../Card';
import Button from '../Button';
import Input from '../Input';
import Avatar from '../Avatar';
import Badge from '../Badge';
import { 
  FiCheckCircle, 
  FiUser, 
  FiBook, 
  FiMapPin, 
  FiRotateCcw, 
  FiRepeat, 
  FiSearch, 
  FiCheck, 
  FiZap 
} from 'react-icons/fi';
import { cn } from '../../utils/cn';

export const ScanCenter = ({
  scanMode,
  setScanMode,
  studentInput,
  setStudentInput,
  scannedStudent,
  bookInput,
  setBookInput,
  scannedBook,
  isFastIssuing,
  handleSearchStudent,
  handleSearchBook,
  handleConfirmFastIssue,
  returnBookInput,
  setReturnBookInput,
  scannedReturnBook,
  isFastReturning,
  handleSearchReturnBook,
  handleConfirmFastReturn,
}) => {
  return (
    <div className="space-y-6 text-xs text-white">
      {/* Scan Mode Sub-Tabs */}
      <div className="flex border-b border-[#2A2A2A] bg-[#111111] px-4 rounded-2xl">
        {[
          { id: 'fast_issue', label: 'Fast Issue Workflow', icon: FiZap },
          { id: 'fast_return', label: 'Fast Return Check-in', icon: FiRotateCcw },
          { id: 'location_finder', label: 'Book Location Finder', icon: FiMapPin },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = scanMode === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setScanMode(tab.id)}
              className={cn(
                'py-3.5 px-4 text-xs font-semibold border-b-2 flex items-center gap-2 transition-colors',
                isActive
                  ? 'border-white text-white font-bold'
                  : 'border-transparent text-[#A1A1AA] hover:text-white'
              )}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* MODE 1: FAST ISSUE WORKFLOW */}
      {scanMode === 'fast_issue' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Step 1: Scan Student */}
          <Card className="p-5 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#2A2A2A]">
              <span className="font-bold text-white text-sm flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-white text-black text-[11px] flex items-center justify-center font-bold">1</span>
                Scan Student ID / Reg No
              </span>
              {scannedStudent && <Badge variant="success">Verified</Badge>}
            </div>

            <div className="flex gap-2">
              <Input
                placeholder="Scan Student Barcode or Reg No (e.g. CS2024-042)..."
                value={studentInput}
                onChange={(e) => setStudentInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearchStudent()}
              />
              <Button variant="primary" size="sm" icon={FiSearch} onClick={handleSearchStudent}>
                Verify
              </Button>
            </div>

            {scannedStudent ? (
              <div className="p-4 rounded-xl bg-[#111111] border border-[#2A2A2A] flex items-center gap-3">
                <Avatar name={scannedStudent.name || scannedStudent.email} size="md" />
                <div>
                  <h4 className="font-bold text-white text-xs">{scannedStudent.name || 'Member'}</h4>
                  <p className="text-[10px] text-[#A1A1AA]">Reg: {scannedStudent.registerNumber || 'N/A'}</p>
                  <p className="text-[10px] text-[#22C55E]">Active Loans: {scannedStudent.activeBorrowCount || 0} / 5 books</p>
                </div>
              </div>
            ) : (
              <div className="p-6 text-center bg-[#111111] rounded-xl border border-dashed border-[#2A2A2A] text-[#A1A1AA]">
                <FiUser className="w-6 h-6 mx-auto mb-1 opacity-50" />
                <p>Scan student ID or enter registration number above</p>
              </div>
            )}
          </Card>

          {/* Step 2: Scan Book */}
          <Card className="p-5 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#2A2A2A]">
              <span className="font-bold text-white text-sm flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-white text-black text-[11px] flex items-center justify-center font-bold">2</span>
                Scan Book Barcode / ISBN
              </span>
              {scannedBook && <Badge variant="success">Identified</Badge>}
            </div>

            <div className="flex gap-2">
              <Input
                placeholder="Scan Book Barcode (e.g. BORROW-A1B2C3D4)..."
                value={bookInput}
                onChange={(e) => setBookInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearchBook()}
              />
              <Button variant="primary" size="sm" icon={FiSearch} onClick={handleSearchBook}>
                Verify
              </Button>
            </div>

            {scannedBook ? (
              <div className="p-4 rounded-xl bg-[#111111] border border-[#2A2A2A] flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-14 bg-[#171717] rounded border border-[#2A2A2A] overflow-hidden flex items-center justify-center shrink-0">
                    {scannedBook.coverImage ? (
                      <img src={scannedBook.coverImage} alt={scannedBook.title} className="w-full h-full object-cover" />
                    ) : (
                      <FiBook className="w-5 h-5 text-[#A1A1AA]" />
                    )}
                  </div>
                  <div>
                    <h4 className="font-bold text-white text-xs">{scannedBook.title}</h4>
                    <p className="text-[10px] text-[#A1A1AA]">ISBN: {scannedBook.isbn || 'N/A'}</p>
                    <p className="text-[10px] text-[#22C55E]">Copies Available: {scannedBook.availableCopies ?? 1}</p>
                  </div>
                </div>

                {/* Location Badge */}
                <div className="text-right text-[10px] bg-[#171717] p-2 rounded-lg border border-[#2A2A2A]">
                  <span className="text-[#A1A1AA] block">Location</span>
                  <span className="font-bold text-white">{scannedBook.floor || 'Floor 2'} • {scannedBook.rack || 'Rack A-4'}</span>
                </div>
              </div>
            ) : (
              <div className="p-6 text-center bg-[#111111] rounded-xl border border-dashed border-[#2A2A2A] text-[#A1A1AA]">
                <FiBook className="w-6 h-6 mx-auto mb-1 opacity-50" />
                <p>Scan book barcode or enter ISBN value above</p>
              </div>
            )}

            {/* Step 3: Fast Issue Trigger */}
            {scannedStudent && scannedBook && (
              <div className="pt-2 border-t border-[#2A2A2A] flex justify-end">
                <Button
                  variant="primary"
                  size="md"
                  icon={FiZap}
                  loading={isFastIssuing}
                  onClick={handleConfirmFastIssue}
                >
                  Execute Fast Issue (14-Day Loan)
                </Button>
              </div>
            )}
          </Card>
        </div>
      )}

      {/* MODE 2: FAST RETURN WORKFLOW */}
      {scanMode === 'fast_return' && (
        <Card className="p-6 max-w-xl mx-auto space-y-4">
          <div className="border-b border-[#2A2A2A] pb-3">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <FiRotateCcw className="w-4 h-4 text-[#22C55E]" /> Fast Return Check-in
            </h3>
            <p className="text-xs text-[#A1A1AA]">Scan book barcode to automatically check in returned book</p>
          </div>

          <div className="flex gap-2">
            <Input
              placeholder="Scan returned book barcode or ISBN..."
              value={returnBookInput}
              onChange={(e) => setReturnBookInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearchReturnBook()}
            />
            <Button variant="primary" size="sm" icon={FiSearch} onClick={handleSearchReturnBook}>
              Lookup
            </Button>
          </div>

          {scannedReturnBook ? (
            <div className="p-4 rounded-2xl bg-[#111111] border border-[#2A2A2A] space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-16 bg-[#171717] rounded-xl border border-[#2A2A2A] overflow-hidden flex items-center justify-center shrink-0">
                  {scannedReturnBook.coverImage ? (
                    <img src={scannedReturnBook.coverImage} alt={scannedReturnBook.title} className="w-full h-full object-cover" />
                  ) : (
                    <FiBook className="w-6 h-6 text-[#A1A1AA]" />
                  )}
                </div>
                <div>
                  <h4 className="font-bold text-white text-sm">{scannedReturnBook.title}</h4>
                  <p className="text-xs text-[#A1A1AA]">ISBN: {scannedReturnBook.isbn || 'N/A'}</p>
                  <p className="text-xs text-white font-mono mt-0.5">Barcode: {scannedReturnBook.barcode}</p>
                </div>
              </div>

              <div className="flex justify-end pt-2 border-t border-[#2A2A2A]">
                <Button
                  variant="primary"
                  size="md"
                  icon={FiRotateCcw}
                  loading={isFastReturning}
                  onClick={handleConfirmFastReturn}
                >
                  Confirm Fast Return Check-in
                </Button>
              </div>
            </div>
          ) : (
            <div className="p-8 text-center bg-[#111111] rounded-2xl border border-dashed border-[#2A2A2A] text-[#A1A1AA]">
              <FiRotateCcw className="w-8 h-8 mx-auto mb-2 opacity-50 text-[#22C55E]" />
              <p className="font-bold text-white">Scan book barcode to initiate check-in</p>
            </div>
          )}
        </Card>
      )}

      {/* MODE 3: LOCATION FINDER */}
      {scanMode === 'location_finder' && (
        <Card className="p-6 max-w-xl mx-auto space-y-4">
          <div className="border-b border-[#2A2A2A] pb-3">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <FiMapPin className="w-4 h-4 text-white" /> Smart Book Location Finder
            </h3>
            <p className="text-xs text-[#A1A1AA]">Scan or enter barcode to locate physical shelf & floor</p>
          </div>

          <div className="flex gap-2">
            <Input
              placeholder="Scan barcode or enter book title..."
              value={bookInput}
              onChange={(e) => setBookInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearchBook()}
            />
            <Button variant="primary" size="sm" icon={FiSearch} onClick={handleSearchBook}>
              Locate
            </Button>
          </div>

          {scannedBook && (
            <div className="p-5 rounded-2xl bg-[#111111] border border-[#2A2A2A] space-y-4">
              <h4 className="font-bold text-white text-sm">{scannedBook.title}</h4>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
                <div className="p-3 rounded-xl bg-[#171717] border border-[#2A2A2A]">
                  <span className="text-[10px] text-[#A1A1AA] uppercase">Floor</span>
                  <span className="font-bold text-white text-sm block mt-0.5">{scannedBook.floor || 'Floor 2'}</span>
                </div>
                <div className="p-3 rounded-xl bg-[#171717] border border-[#2A2A2A]">
                  <span className="text-[10px] text-[#A1A1AA] uppercase">Rack</span>
                  <span className="font-bold text-white text-sm block mt-0.5">{scannedBook.rack || 'Rack A-4'}</span>
                </div>
                <div className="p-3 rounded-xl bg-[#171717] border border-[#2A2A2A]">
                  <span className="text-[10px] text-[#A1A1AA] uppercase">Shelf</span>
                  <span className="font-bold text-white text-sm block mt-0.5">{scannedBook.shelf || 'Shelf 3'}</span>
                </div>
                <div className="p-3 rounded-xl bg-[#171717] border border-[#2A2A2A]">
                  <span className="text-[10px] text-[#A1A1AA] uppercase">Section</span>
                  <span className="font-bold text-white text-sm block mt-0.5 truncate">{scannedBook.section || 'CS'}</span>
                </div>
              </div>
            </div>
          )}
        </Card>
      )}
    </div>
  );
};

export default ScanCenter;
