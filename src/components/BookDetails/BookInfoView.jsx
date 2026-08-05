import React from 'react';
import Card from '../Card';
import Badge from '../Badge';
import { 
  FiInfo, 
  FiLayers, 
  FiGlobe, 
  FiGrid, 
  FiBookmark, 
  FiTag, 
  FiHash, 
  FiClock, 
  FiCheckCircle 
} from 'react-icons/fi';

export const BookInfoView = ({ book }) => {
  if (!book) return null;

  const {
    title = 'Untitled Book',
    subtitle,
    author = 'Unknown Author',
    coAuthor,
    publisher = 'N/A',
    edition = 'N/A',
    publicationYear = 'N/A',
    isbn = 'N/A',
    description = 'No description specified.',
    keywords = [],
    category = 'General',
    department = 'General',
    semester = 'General',
    subject = 'N/A',
    language = 'English',
    rack = 'N/A',
    shelf = 'N/A',
    floor = 'N/A',
    section = 'N/A',
    condition = 'excellent',
    status = 'available',
  } = book;

  return (
    <div className="space-y-6 text-white text-xs">
      {/* Title & Author Overview Card */}
      <Card className="p-6">
        <div className="flex flex-wrap items-center gap-2 mb-3">
          <Badge variant="neutral">{category}</Badge>
          <Badge variant="neutral">{department}</Badge>
          <span className="text-xs text-[#A1A1AA] font-mono">ISBN: {isbn}</span>
        </div>

        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">{title}</h1>
        {subtitle && <p className="text-sm text-[#A1A1AA] mt-1 font-normal">{subtitle}</p>}

        <div className="mt-3 flex flex-wrap items-center gap-4 text-xs text-white">
          <p><span className="text-[#A1A1AA]">Author:</span> <span className="font-semibold">{author}</span></p>
          {coAuthor && <p><span className="text-[#A1A1AA]">Co-Author:</span> <span className="font-semibold">{coAuthor}</span></p>}
          <p><span className="text-[#A1A1AA]">Publisher:</span> <span className="font-semibold">{publisher}</span> ({publicationYear})</p>
          <p><span className="text-[#A1A1AA]">Edition:</span> <span className="font-semibold">{edition}</span></p>
        </div>
      </Card>

      {/* Description Card */}
      <Card className="p-6">
        <h3 className="text-sm font-bold text-white tracking-tight mb-2 flex items-center gap-2">
          <FiInfo className="w-4 h-4 text-[#A1A1AA]" /> Book Summary & Scope
        </h3>
        <p className="text-xs text-[#A1A1AA] leading-relaxed bg-[#111111] p-4 rounded-xl border border-[#2A2A2A]">
          {description}
        </p>

        {/* Keywords */}
        {keywords && (Array.isArray(keywords) ? keywords.length > 0 : keywords) && (
          <div className="mt-4 pt-3 border-t border-[#2A2A2A]">
            <span className="text-xs text-[#A1A1AA] font-semibold flex items-center gap-1.5 mb-2">
              <FiTag className="w-3.5 h-3.5" /> Keywords & Index Tags
            </span>
            <div className="flex flex-wrap gap-2">
              {(Array.isArray(keywords) ? keywords : [keywords]).map((kw, i) => (
                <span key={i} className="px-2.5 py-1 rounded-lg bg-[#111111] text-[#A1A1AA] text-xs border border-[#2A2A2A]">
                  #{kw}
                </span>
              ))}
            </div>
          </div>
        )}
      </Card>

      {/* Specification Attributes Grid */}
      <Card className="p-6">
        <h3 className="text-sm font-bold text-white tracking-tight mb-4 pb-3 border-b border-[#2A2A2A]">
          Library Location & Specification Details
        </h3>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-xs">
          <div className="bg-[#111111] p-3.5 rounded-xl border border-[#2A2A2A]">
            <span className="text-[10px] text-[#A1A1AA] uppercase tracking-wider block">Department</span>
            <span className="font-semibold text-white mt-0.5 block">{department}</span>
          </div>

          <div className="bg-[#111111] p-3.5 rounded-xl border border-[#2A2A2A]">
            <span className="text-[10px] text-[#A1A1AA] uppercase tracking-wider block">Semester / Level</span>
            <span className="font-semibold text-white mt-0.5 block">{semester}</span>
          </div>

          <div className="bg-[#111111] p-3.5 rounded-xl border border-[#2A2A2A]">
            <span className="text-[10px] text-[#A1A1AA] uppercase tracking-wider block">Subject Topic</span>
            <span className="font-semibold text-white mt-0.5 block">{subject || 'General'}</span>
          </div>

          <div className="bg-[#111111] p-3.5 rounded-xl border border-[#2A2A2A]">
            <span className="text-[10px] text-[#A1A1AA] uppercase tracking-wider block">Language</span>
            <span className="font-semibold text-white mt-0.5 block">{language}</span>
          </div>

          <div className="bg-[#111111] p-3.5 rounded-xl border border-[#2A2A2A]">
            <span className="text-[10px] text-[#A1A1AA] uppercase tracking-wider block">Rack & Shelf</span>
            <span className="font-semibold text-white mt-0.5 block">Rack {rack} • Shelf {shelf}</span>
          </div>

          <div className="bg-[#111111] p-3.5 rounded-xl border border-[#2A2A2A]">
            <span className="text-[10px] text-[#A1A1AA] uppercase tracking-wider block">Floor & Wing</span>
            <span className="font-semibold text-white mt-0.5 block">{floor} ({section})</span>
          </div>

          <div className="bg-[#111111] p-3.5 rounded-xl border border-[#2A2A2A]">
            <span className="text-[10px] text-[#A1A1AA] uppercase tracking-wider block">Condition</span>
            <span className="font-semibold text-white uppercase mt-0.5 block">{condition}</span>
          </div>

          <div className="bg-[#111111] p-3.5 rounded-xl border border-[#2A2A2A]">
            <span className="text-[10px] text-[#A1A1AA] uppercase tracking-wider block">Initial Status</span>
            <span className="font-semibold text-white capitalize mt-0.5 block">{status}</span>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default BookInfoView;
