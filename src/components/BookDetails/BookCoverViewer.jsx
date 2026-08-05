import React, { useState } from 'react';
import { FiBook, FiMaximize2, FiDownload } from 'react-icons/fi';
import Modal from '../Modal';
import Button from '../Button';

export const BookCoverViewer = ({ coverUrl, title = 'Book Cover' }) => {
  const [isFullscreenOpen, setIsFullscreenOpen] = useState(false);

  const handleDownload = () => {
    if (!coverUrl) return;
    const link = document.createElement('a');
    link.href = coverUrl;
    link.download = `${title.replace(/\s+/g, '_')}_cover.jpg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <>
      <div className="relative group rounded-2xl bg-[#111111] border border-[#2A2A2A] overflow-hidden flex items-center justify-center h-80 sm:h-96 shadow-2xl">
        {coverUrl ? (
          <img
            src={coverUrl}
            alt={title}
            className="max-h-full max-w-full object-contain p-2 transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="flex flex-col items-center justify-center p-6 text-center text-[#A1A1AA]">
            <FiBook className="w-12 h-12 mb-2" />
            <span className="text-xs">No Cover Image Available</span>
          </div>
        )}

        {/* Action Overlay */}
        {coverUrl && (
          <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
            <button
              type="button"
              onClick={() => setIsFullscreenOpen(true)}
              title="Expand Fullscreen"
              className="p-3 rounded-xl bg-white text-black font-semibold hover:bg-neutral-200 transition-colors shadow-lg"
            >
              <FiMaximize2 className="w-5 h-5" />
            </button>
            <button
              type="button"
              onClick={handleDownload}
              title="Download Cover Art"
              className="p-3 rounded-xl bg-[#171717] text-white border border-[#2A2A2A] hover:bg-[#1E1E1E] transition-colors shadow-lg"
            >
              <FiDownload className="w-5 h-5" />
            </button>
          </div>
        )}
      </div>

      {/* Fullscreen Image Modal */}
      <Modal
        isOpen={isFullscreenOpen}
        onClose={() => setIsFullscreenOpen(false)}
        title={title}
        subtitle="High-Resolution Cover Art"
        maxWidth="max-w-3xl"
      >
        <div className="flex flex-col items-center justify-center p-4">
          <img
            src={coverUrl}
            alt={title}
            className="max-h-[70vh] w-auto object-contain rounded-xl shadow-2xl border border-[#2A2A2A]"
          />
          <div className="mt-4 flex items-center justify-end w-full">
            <Button variant="secondary" size="sm" icon={FiDownload} onClick={handleDownload}>
              Download Cover Art
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default BookCoverViewer;
