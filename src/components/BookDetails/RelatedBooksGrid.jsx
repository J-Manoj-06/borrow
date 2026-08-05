import React from 'react';
import { useNavigate } from 'react-router-dom';
import Card, { CardTitle, CardDescription } from '../Card';
import Badge from '../Badge';
import { FiBook } from 'react-icons/fi';

export const RelatedBooksGrid = ({ books = [] }) => {
  const navigate = useNavigate();

  if (!books || books.length === 0) return null;

  return (
    <Card className="p-6">
      <div className="pb-4 border-b border-[#2A2A2A] mb-4">
        <CardTitle className="text-base">Related Books</CardTitle>
        <CardDescription>Catalog items in the same department & category</CardDescription>
      </div>

      <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-none">
        {books.map((b) => (
          <div
            key={b.id}
            onClick={() => navigate(`/inventory/${b.id}`)}
            className="w-56 shrink-0 bg-[#111111] border border-[#2A2A2A] rounded-xl p-3.5 hover:bg-[#1E1E1E] hover:border-neutral-500 transition-all cursor-pointer group"
          >
            <div className="w-full h-32 rounded-lg bg-[#171717] border border-[#2A2A2A] overflow-hidden mb-3 flex items-center justify-center">
              {b.coverImage ? (
                <img src={b.coverImage} alt={b.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
              ) : (
                <FiBook className="w-6 h-6 text-[#A1A1AA]" />
              )}
            </div>

            <Badge variant="neutral" size="sm" className="mb-1">
              {b.category || 'General'}
            </Badge>

            <h4 className="text-xs font-bold text-white truncate" title={b.title}>
              {b.title || 'Untitled'}
            </h4>
            <p className="text-[11px] text-[#A1A1AA] truncate mt-0.5" title={b.author}>
              by {b.author || 'Unknown'}
            </p>
          </div>
        ))}
      </div>
    </Card>
  );
};

export default RelatedBooksGrid;
