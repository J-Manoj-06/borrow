import React from 'react';
import Modal from '../Modal';
import Badge from '../Badge';
import Button from '../Button';
import { FiBook, FiTag, FiLayers, FiGlobe, FiGrid, FiBookmark, FiHash, FiClock } from 'react-icons/fi';

export const BookDetailsModal = ({ isOpen, onClose, book }) => {
  if (!book) return null;

  const {
    bookId,
    title = 'Untitled Book',
    author = 'Unknown Author',
    publisher = 'Unknown Publisher',
    isbn = 'N/A',
    description = 'No description provided for this library catalog item.',
    coverImage,
    category = 'General',
    department = 'General',
    semester = 'N/A',
    language = 'English',
    rack = 'N/A',
    shelf = 'N/A',
    totalCopies = 1,
    availableCopies = 1,
    borrowCount = 0,
    keywords = [],
    status = 'available',
    createdAt,
    updatedAt,
  } = book;

  const getStatusVariant = (st) => {
    switch (st?.toLowerCase()) {
      case 'available':
        return { variant: 'success', label: 'Available' };
      case 'borrowed':
        return { variant: 'warning', label: 'Borrowed' };
      case 'maintenance':
        return { variant: 'danger', label: 'Maintenance' };
      case 'archived':
        return { variant: 'neutral', label: 'Archived' };
      default:
        return { variant: 'success', label: 'Available' };
    }
  };

  const statusInfo = getStatusVariant(status);

  const formatDate = (val) => {
    if (!val) return 'N/A';
    if (val.toDate) return val.toDate().toLocaleDateString();
    return new Date(val).toLocaleDateString();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Book Specification Details"
      subtitle={`ID: ${bookId || 'N/A'}`}
      maxWidth="max-w-2xl"
    >
      <div className="space-y-6 text-white text-xs">
        {/* Main Header Info: Cover + Key Badges */}
        <div className="flex flex-col sm:flex-row gap-5 pb-5 border-b border-[#2A2A2A]">
          <div className="w-28 h-40 rounded-xl bg-[#111111] border border-[#2A2A2A] overflow-hidden flex items-center justify-center shrink-0">
            {(book.coverImage || book.cover || book.cover_image || book.imageUrl || book.image || book.image_url || book.cover_url || book.coverUrl) ? (
              <img 
                src={book.coverImage || book.cover || book.cover_image || book.imageUrl || book.image || book.image_url || book.cover_url || book.coverUrl} 
                alt={title} 
                className="max-h-full max-w-full object-contain p-1" 
              />
            ) : (
              <FiBook className="w-8 h-8 text-[#A1A1AA]" />
            )}
          </div>

          <div className="flex-1 space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant={statusInfo.variant}>{statusInfo.label}</Badge>
              <Badge variant="neutral">{category}</Badge>
              <span className="text-[11px] text-[#A1A1AA] font-mono">ISBN: {isbn}</span>
            </div>

            <h2 className="text-xl font-bold text-white tracking-tight">{title}</h2>
            <p className="text-sm text-[#A1A1AA]">by {author}</p>
            <p className="text-xs text-[#52525B]">Publisher: {publisher}</p>

            <div className="pt-2 flex items-center gap-4 text-xs">
              <div>
                <span className="text-[#A1A1AA]">Available / Total: </span>
                <span className="font-bold text-white">{availableCopies} / {totalCopies}</span>
              </div>
              <div>
                <span className="text-[#A1A1AA]">Times Borrowed: </span>
                <span className="font-bold text-white">{borrowCount}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Description */}
        <div>
          <h4 className="text-xs font-semibold text-[#A1A1AA] uppercase tracking-wider mb-1">
            Description
          </h4>
          <p className="text-xs text-neutral-300 leading-relaxed bg-[#111111] p-3 rounded-xl border border-[#2A2A2A]">
            {description}
          </p>
        </div>

        {/* Technical Attributes Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 bg-[#111111] p-4 rounded-xl border border-[#2A2A2A]">
          <div className="flex items-center gap-2">
            <FiLayers className="w-4 h-4 text-[#A1A1AA]" />
            <div>
              <p className="text-[10px] text-[#A1A1AA] uppercase">Department</p>
              <p className="font-medium text-white">{department}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <FiBookmark className="w-4 h-4 text-[#A1A1AA]" />
            <div>
              <p className="text-[10px] text-[#A1A1AA] uppercase">Semester</p>
              <p className="font-medium text-white">{semester}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <FiGlobe className="w-4 h-4 text-[#A1A1AA]" />
            <div>
              <p className="text-[10px] text-[#A1A1AA] uppercase">Language</p>
              <p className="font-medium text-white">{language}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <FiGrid className="w-4 h-4 text-[#A1A1AA]" />
            <div>
              <p className="text-[10px] text-[#A1A1AA] uppercase">Rack / Shelf</p>
              <p className="font-medium text-white">Rack {rack} - Shelf {shelf}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <FiClock className="w-4 h-4 text-[#A1A1AA]" />
            <div>
              <p className="text-[10px] text-[#A1A1AA] uppercase">Created</p>
              <p className="font-medium text-white">{formatDate(createdAt)}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <FiHash className="w-4 h-4 text-[#A1A1AA]" />
            <div>
              <p className="text-[10px] text-[#A1A1AA] uppercase">Updated</p>
              <p className="font-medium text-white">{formatDate(updatedAt)}</p>
            </div>
          </div>
        </div>

        {/* Keywords */}
        {keywords && (Array.isArray(keywords) ? keywords.length > 0 : keywords) && (
          <div>
            <h4 className="text-xs font-semibold text-[#A1A1AA] uppercase tracking-wider mb-1.5 flex items-center gap-1">
              <FiTag className="w-3.5 h-3.5" /> Keywords
            </h4>
            <div className="flex flex-wrap gap-1.5">
              {(Array.isArray(keywords) ? keywords : [keywords]).map((kw, i) => (
                <span key={i} className="px-2 py-0.5 rounded-md bg-[#1E1E1E] text-[#A1A1AA] text-[11px] border border-[#2A2A2A]">
                  #{kw}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Footer Actions */}
        <div className="pt-4 border-t border-[#2A2A2A] flex justify-end">
          <Button variant="secondary" onClick={onClose}>
            Close Specification
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default BookDetailsModal;
