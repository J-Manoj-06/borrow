import React from 'react';
import Modal from '../Modal';
import Button from '../Button';
import { generateBarcodeImageURL } from '../../services/barcodeService';
import { FiPrinter } from 'react-icons/fi';
import { cn } from '../../utils/cn';

export const LabelPrintModal = ({
  isOpen,
  onClose,
  singleBook,
  selectedBooks = [],
  labelSize,
  setLabelSize,
}) => {
  const booksToPrint = singleBook ? [singleBook] : selectedBooks;

  if (booksToPrint.length === 0) return null;

  const handlePrintTrigger = () => {
    window.print();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Book Barcode & QR Label Printing"
      subtitle={`Generating ${booksToPrint.length} label(s)`}
      maxWidth="max-w-2xl"
    >
      <div className="space-y-4 text-xs text-white">
        {/* Size Selector */}
        <div className="flex items-center justify-between p-3 rounded-xl bg-[#111111] border border-[#2A2A2A]">
          <span className="text-[#A1A1AA] font-semibold">Select Label Physical Size:</span>
          <div className="flex gap-2">
            {['small', 'medium', 'large'].map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => setLabelSize(s)}
                className={cn(
                  'px-3 py-1 rounded-lg text-xs font-semibold capitalize border transition-colors',
                  labelSize === s
                    ? 'bg-white text-black border-white'
                    : 'bg-[#171717] text-[#A1A1AA] border-[#2A2A2A]'
                )}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        {/* Printable Label Previews */}
        <div className="p-4 rounded-2xl bg-[#111111] border border-[#2A2A2A] max-h-80 overflow-y-auto space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 print:grid-cols-2">
            {booksToPrint.map((b) => (
              <div
                key={b.id}
                className={cn(
                  'bg-white text-black p-3 rounded-xl border border-neutral-300 flex flex-col justify-between space-y-2 select-none shadow-xs',
                  labelSize === 'small' ? 'min-h-[120px]' : labelSize === 'large' ? 'min-h-[180px]' : 'min-h-[140px]'
                )}
              >
                <div className="flex items-center justify-between border-b border-neutral-200 pb-1.5">
                  <span className="font-bold text-[10px] tracking-tight uppercase truncate max-w-[140px]">
                    Borrow Central Library
                  </span>
                  <span className="font-mono text-[9px] font-semibold text-neutral-500">LIB-01</span>
                </div>

                <div className="flex items-center justify-between gap-2">
                  <div className="flex-1 overflow-hidden space-y-1">
                    <p className="font-extrabold text-xs text-black truncate" title={b.title}>{b.title || 'Untitled'}</p>
                    <p className="text-[10px] text-neutral-600 font-mono">ISBN: {b.isbn || 'N/A'}</p>
                    <div className="pt-1">
                      <img src={generateBarcodeImageURL(b.barcode)} alt={b.barcode} className="h-7 object-contain" />
                      <p className="font-mono text-[9px] font-bold text-center tracking-wider text-black mt-0.5">{b.barcode}</p>
                    </div>
                  </div>

                  <div className="w-14 h-14 bg-white border border-neutral-300 p-0.5 rounded shrink-0 flex items-center justify-center">
                    <img src={b.qrCode} alt="QR Code" className="w-full h-full object-cover" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="pt-4 border-t border-[#2A2A2A] flex items-center justify-end gap-2">
          <Button variant="secondary" size="sm" onClick={onClose}>
            Close
          </Button>
          <Button
            variant="primary"
            size="sm"
            icon={FiPrinter}
            onClick={handlePrintTrigger}
          >
            Print {booksToPrint.length} Label(s)
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default LabelPrintModal;
