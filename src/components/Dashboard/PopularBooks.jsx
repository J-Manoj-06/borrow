import React from 'react';
import Card, { CardTitle, CardDescription } from '../Card';
import Badge from '../Badge';
import EmptyState from '../EmptyState';
import { FiBook, FiTrendingUp } from 'react-icons/fi';

export const PopularBooks = ({ books = [] }) => {
  return (
    <Card className="p-6">
      <div className="flex items-center justify-between pb-4 border-b border-[#2A2A2A] mb-4">
        <div>
          <CardTitle className="text-lg">Popular Books</CardTitle>
          <CardDescription>Top titles with highest demand</CardDescription>
        </div>
        <div className="flex items-center gap-1.5 text-xs text-[#A1A1AA]">
          <FiTrendingUp className="w-4 h-4 text-white" />
          <span>Top Borrowed</span>
        </div>
      </div>

      {books.length === 0 ? (
        <EmptyState
          icon={FiBook}
          title="No books registered"
          description="Popular books will be highlighted here once inventory items are added."
          className="border-0 bg-transparent p-4"
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {books.map((book, idx) => (
            <div
              key={book.id || idx}
              className="bg-[#111111] border border-[#2A2A2A] rounded-xl p-4 flex items-center gap-3.5 hover:bg-[#1E1E1E] transition-colors"
            >
              {/* Book Cover Placeholder */}
              <div className="w-12 h-16 rounded-lg bg-[#2A2A2A] flex-shrink-0 flex items-center justify-center text-white overflow-hidden border border-[#3A3A3A] relative">
                {book.coverUrl ? (
                  <img src={book.coverUrl} alt={book.title} className="w-full h-full object-cover" />
                ) : (
                  <FiBook className="w-5 h-5 text-[#A1A1AA]" />
                )}
              </div>

              {/* Details */}
              <div className="overflow-hidden flex-1">
                <h4 className="text-sm font-semibold text-white truncate" title={book.title}>
                  {book.title || 'Untitled Book'}
                </h4>
                <p className="text-xs text-[#A1A1AA] truncate mt-0.5" title={book.author}>
                  {book.author || 'Unknown Author'}
                </p>
                <div className="mt-2 flex items-center gap-2">
                  <Badge variant="neutral" size="sm">
                    {book.borrowCount || 0} borrows
                  </Badge>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
};

export default PopularBooks;
