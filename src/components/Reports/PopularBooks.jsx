import React from 'react';
import Card from '../Card';
import Badge from '../Badge';
import { FiTrendingUp, FiBook } from 'react-icons/fi';

export const PopularBooks = ({ popularBooks = [], leastUsedBooks = [] }) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
      {/* Top 10 Popular Books (2 cols) */}
      <Card className="p-5 lg:col-span-2">
        <div className="flex items-center justify-between mb-4 pb-3 border-b border-[#2A2A2A]">
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <FiTrendingUp className="w-4 h-4 text-[#22C55E]" /> Top 10 Most Borrowed Books
            </h3>
            <p className="text-xs text-[#A1A1AA]">Highest demand titles across all departments</p>
          </div>
          <Badge variant="neutral">Popularity Ranking</Badge>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {popularBooks.map((b, idx) => (
            <div key={b.id || idx} className="flex items-center gap-3 p-2.5 rounded-xl bg-[#111111] border border-[#2A2A2A]">
              <div className="w-8 text-center text-xs font-bold text-[#A1A1AA] font-mono">
                #{idx + 1}
              </div>
              <div className="w-9 h-12 rounded bg-[#171717] border border-[#2A2A2A] overflow-hidden flex items-center justify-center shrink-0">
                {b.coverImage || b.cover ? (
                  <img src={b.coverImage || b.cover} alt={b.title} className="w-full h-full object-cover" />
                ) : (
                  <FiBook className="w-4 h-4 text-[#A1A1AA]" />
                )}
              </div>
              <div className="flex-1 overflow-hidden text-xs">
                <p className="font-bold text-white truncate" title={b.title}>{b.title || 'Untitled Book'}</p>
                <p className="text-[10px] text-[#A1A1AA] truncate">{b.author || 'Unknown Author'}</p>
                <p className="text-[10px] text-[#22C55E] font-semibold mt-0.5">
                  {b.borrowCount || 0} times borrowed
                </p>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Least Used Books (1 col) */}
      <Card className="p-5">
        <div className="flex items-center justify-between mb-4 pb-3 border-b border-[#2A2A2A]">
          <div>
            <h3 className="text-sm font-bold text-white">Least Used Books</h3>
            <p className="text-xs text-[#A1A1AA]">Low circulation candidates</p>
          </div>
        </div>

        <div className="space-y-3 text-xs">
          {leastUsedBooks.map((b, idx) => (
            <div key={b.id || idx} className="flex items-center gap-3 p-2 rounded-xl bg-[#111111] border border-[#2A2A2A]">
              <div className="w-8 h-10 rounded bg-[#171717] border border-[#2A2A2A] overflow-hidden flex items-center justify-center shrink-0">
                {b.coverImage ? (
                  <img src={b.coverImage} alt={b.title} className="w-full h-full object-cover" />
                ) : (
                  <FiBook className="w-3.5 h-3.5 text-[#A1A1AA]" />
                )}
              </div>
              <div className="flex-1 overflow-hidden">
                <p className="font-semibold text-white truncate">{b.title || 'Untitled'}</p>
                <p className="text-[10px] text-[#A1A1AA]">Borrows: {b.borrowCount || 0}</p>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};

export default PopularBooks;
