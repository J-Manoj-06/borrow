import React from 'react';
import Card from '../Card';
import Badge from '../Badge';
import Button from '../Button';
import EmptyState from '../EmptyState';
import { generateBarcodeImageURL, generateQRCodeURL } from '../../services/barcodeService';
import { FiPrinter, FiMaximize, FiBook, FiCheckSquare, FiSquare, FiDownload, FiRefreshCw } from 'react-icons/fi';
import { toast } from 'react-hot-toast';

export const BookLabelTable = ({
  books = [],
  selectedBookIds = [],
  onToggleSelectBook,
  onToggleSelectAll,
  onPrintSingle,
}) => {
  if (books.length === 0) {
    return (
      <EmptyState
        icon={FiMaximize}
        title="No book barcode records found."
        description="Book catalog items will automatically appear here with generated barcodes and QR codes."
      />
    );
  }

  const isAllSelected = selectedBookIds.length > 0 && selectedBookIds.length === books.length;

  const handleDownloadImage = (url, filename) => {
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success(`Downloaded ${filename}`);
  };

  const handleRegenerate = (book) => {
    toast.success(`Regenerated barcode & QR label for "${book.title}".`);
  };

  return (
    <Card className="p-0 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="bg-[#111111] border-b border-[#2A2A2A] text-[#A1A1AA] uppercase tracking-wider font-semibold sticky top-0 z-10">
            <tr>
              <th className="py-3.5 px-4 w-10 text-center">
                <button type="button" onClick={onToggleSelectAll} className="text-[#A1A1AA] hover:text-white">
                  {isAllSelected ? <FiCheckSquare className="w-4 h-4 text-white" /> : <FiSquare className="w-4 h-4" />}
                </button>
              </th>
              <th className="py-3.5 px-4">Book Cover</th>
              <th className="py-3.5 px-4">Book Title</th>
              <th className="py-3.5 px-4 font-mono">ISBN</th>
              <th className="py-3.5 px-4">Barcode Preview</th>
              <th className="py-3.5 px-4">QR Preview</th>
              <th className="py-3.5 px-4">Status</th>
              <th className="py-3.5 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#2A2A2A]">
            {books.map((b) => {
              const isSelected = selectedBookIds.includes(b.id);
              const barcodeImg = generateBarcodeImageURL(b.barcode);
              const qrImg = b.qrCode || generateQRCodeURL(b);

              return (
                <tr key={b.id} className="hover:bg-[#1E1E1E]/60 transition-colors">
                  <td className="py-3.5 px-4 text-center">
                    <button type="button" onClick={() => onToggleSelectBook(b.id)} className="text-[#A1A1AA] hover:text-white">
                      {isSelected ? <FiCheckSquare className="w-4 h-4 text-white" /> : <FiSquare className="w-4 h-4" />}
                    </button>
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="w-9 h-12 rounded bg-[#111111] border border-[#2A2A2A] overflow-hidden flex items-center justify-center shrink-0">
                      {(b.coverImage || b.cover || b.imageUrl) ? (
                        <img src={b.coverImage || b.cover || b.imageUrl} alt={b.title} className="max-h-full max-w-full object-contain p-0.5" />
                      ) : (
                        <FiBook className="w-4 h-4 text-[#A1A1AA]" />
                      )}
                    </div>
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="max-w-[200px] truncate">
                      <p className="font-semibold text-white truncate" title={b.title}>{b.title || 'Untitled Book'}</p>
                      <p className="text-[10px] text-[#A1A1AA]">{b.author || 'Unknown Author'}</p>
                    </div>
                  </td>
                  <td className="py-3.5 px-4 font-mono text-[11px] text-[#A1A1AA]">
                    {b.isbn || 'N/A'}
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-2">
                      <div className="p-1 rounded bg-white w-20 h-6 flex items-center justify-center overflow-hidden shrink-0">
                        <img src={barcodeImg} alt={b.barcode} className="h-full object-contain" />
                      </div>
                      <span className="font-mono text-[10px] text-white">{b.barcode}</span>
                    </div>
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="w-8 h-8 rounded bg-white p-0.5 overflow-hidden flex items-center justify-center">
                      <img src={qrImg} alt="QR Code" className="w-full h-full object-cover" />
                    </div>
                  </td>
                  <td className="py-3.5 px-4">
                    <Badge variant={(b.availableCopies ?? 1) > 0 ? 'success' : 'warning'}>
                      {(b.availableCopies ?? 1) > 0 ? 'Available' : 'Issued'}
                    </Badge>
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <Button
                        variant="secondary"
                        size="sm"
                        icon={FiPrinter}
                        onClick={() => onPrintSingle(b)}
                        className="px-2 py-1 text-[11px]"
                        title="Print Label"
                      >
                        Print
                      </Button>

                      <Button
                        variant="secondary"
                        size="sm"
                        icon={FiDownload}
                        onClick={() => handleDownloadImage(barcodeImg, `${b.title}_barcode.png`)}
                        className="px-2 py-1 text-[11px]"
                        title="Download Barcode"
                      >
                        Barcode
                      </Button>

                      <Button
                        variant="secondary"
                        size="sm"
                        icon={FiDownload}
                        onClick={() => handleDownloadImage(qrImg, `${b.title}_qr.png`)}
                        className="px-2 py-1 text-[11px]"
                        title="Download QR"
                      >
                        QR
                      </Button>

                      <button
                        type="button"
                        onClick={() => handleRegenerate(b)}
                        title="Regenerate Codes"
                        className="p-1.5 rounded-lg text-[#A1A1AA] hover:text-white hover:bg-[#1E1E1E] transition-colors"
                      >
                        <FiRefreshCw className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </Card>
  );
};

export default BookLabelTable;
