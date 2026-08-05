import React from 'react';
import Card from '../Card';
import Badge from '../Badge';
import Dropdown from '../Dropdown';
import { FiBook, FiMoreVertical, FiEye, FiEdit2, FiCopy, FiArchive, FiTrash2 } from 'react-icons/fi';
import { toast } from 'react-hot-toast';

export const BookTableView = ({
  books = [],
  onViewDetails,
  onEdit,
  onDuplicate,
  onArchive,
  onDelete,
}) => {
  const getStatusVariant = (st, avail) => {
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
        return avail > 0
          ? { variant: 'success', label: 'Available' }
          : { variant: 'warning', label: 'Borrowed' };
    }
  };

  return (
    <Card className="p-0 overflow-hidden border-[#2A2A2A]">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="bg-[#111111] border-b border-[#2A2A2A] text-[#A1A1AA] uppercase tracking-wider font-semibold sticky top-0 z-10">
            <tr>
              <th className="py-3.5 px-4 w-14">Cover</th>
              <th className="py-3.5 px-4">Title</th>
              <th className="py-3.5 px-4">Author</th>
              <th className="py-3.5 px-4">ISBN</th>
              <th className="py-3.5 px-4">Department</th>
              <th className="py-3.5 px-4">Category</th>
              <th className="py-3.5 px-4">Copies</th>
              <th className="py-3.5 px-4">Status</th>
              <th className="py-3.5 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#2A2A2A]">
            {books.map((book) => {
              const statusBadge = getStatusVariant(book.status, book.availableCopies);

              const menuItems = [
                {
                  label: 'View Details',
                  icon: FiEye,
                  onClick: () => onViewDetails(book),
                },
                {
                  label: 'Edit Info',
                  icon: FiEdit2,
                  onClick: () => {
                    if (onEdit) onEdit(book);
                    else toast.success(`Edit trigger for "${book.title}" (UI only)`);
                  },
                },
                {
                  label: 'Duplicate',
                  icon: FiCopy,
                  onClick: () => {
                    if (onDuplicate) onDuplicate(book);
                    else toast.success(`Duplicated "${book.title}" (UI only)`);
                  },
                },
                {
                  label: 'Archive',
                  icon: FiArchive,
                  onClick: () => {
                    if (onArchive) onArchive(book);
                    else toast.success(`Archived "${book.title}" (UI only)`);
                  },
                },
                { divider: true },
                {
                  label: 'Delete Book',
                  icon: FiTrash2,
                  danger: true,
                  onClick: () => onDelete(book),
                },
              ];

              return (
                <tr key={book.id} className="hover:bg-[#1E1E1E]/60 transition-colors">
                  <td className="py-3 px-4">
                    <div className="w-9 h-12 rounded bg-[#111111] border border-[#2A2A2A] overflow-hidden flex items-center justify-center text-white shrink-0">
                      {(book.coverImage || book.cover || book.cover_image || book.imageUrl || book.image || book.image_url || book.cover_url || book.coverUrl) ? (
                        <img 
                          src={book.coverImage || book.cover || book.cover_image || book.imageUrl || book.image || book.image_url || book.cover_url || book.coverUrl} 
                          alt={book.title} 
                          className="max-h-full max-w-full object-contain p-0.5" 
                        />
                      ) : (
                        <FiBook className="w-4 h-4 text-[#A1A1AA]" />
                      )}
                    </div>
                  </td>
                  <td className="py-3 px-4 font-semibold text-white max-w-[200px] truncate">
                    <span 
                      onClick={() => onViewDetails(book)} 
                      className="hover:underline cursor-pointer"
                    >
                      {book.title || 'Untitled Book'}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-[#A1A1AA] max-w-[150px] truncate">
                    {book.author || 'Unknown'}
                  </td>
                  <td className="py-3 px-4 font-mono text-[11px] text-[#A1A1AA]">
                    {book.isbn || 'N/A'}
                  </td>
                  <td className="py-3 px-4 text-[#A1A1AA]">
                    {book.department || 'General'}
                  </td>
                  <td className="py-3 px-4">
                    <Badge variant="neutral" size="sm">
                      {book.category || 'General'}
                    </Badge>
                  </td>
                  <td className="py-3 px-4 text-white font-medium">
                    {book.availableCopies ?? 1} / {book.totalCopies ?? 1}
                  </td>
                  <td className="py-3 px-4">
                    <Badge variant={statusBadge.variant} size="sm">
                      {statusBadge.label}
                    </Badge>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <Dropdown
                      align="right"
                      trigger={
                        <button
                          type="button"
                          className="p-1 rounded-lg text-[#A1A1AA] hover:text-white hover:bg-[#1E1E1E] transition-colors"
                        >
                          <FiMoreVertical className="w-4 h-4" />
                        </button>
                      }
                      items={menuItems}
                    />
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

export default BookTableView;
