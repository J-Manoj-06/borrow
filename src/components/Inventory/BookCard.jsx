import React from 'react';
import { motion } from 'framer-motion';
import Card from '../Card';
import Badge from '../Badge';
import Dropdown from '../Dropdown';
import { FiBook, FiMoreVertical, FiEye, FiEdit2, FiCopy, FiArchive, FiTrash2 } from 'react-icons/fi';
import { toast } from 'react-hot-toast';

export const BookCard = ({
  book,
  onViewDetails,
  onEdit,
  onDuplicate,
  onArchive,
  onDelete,
}) => {
  const {
    title = 'Untitled Book',
    author = 'Unknown Author',
    isbn = 'N/A',
    coverImage,
    category = 'General',
    department = 'General',
    availableCopies = 1,
    totalCopies = 1,
    status = 'available',
  } = book;

  // Determine status variant
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
        return availableCopies > 0
          ? { variant: 'success', label: 'Available' }
          : { variant: 'warning', label: 'Borrowed' };
    }
  };

  const statusBadge = getStatusVariant(status);

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
        else toast.success(`Edit trigger for "${title}" (UI only)`);
      },
    },
    {
      label: 'Duplicate',
      icon: FiCopy,
      onClick: () => {
        if (onDuplicate) onDuplicate(book);
        else toast.success(`Duplicated "${title}" (UI only)`);
      },
    },
    {
      label: 'Archive',
      icon: FiArchive,
      onClick: () => {
        if (onArchive) onArchive(book);
        else toast.success(`Archived "${title}" (UI only)`);
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

  // Resolve cover image across all possible Firestore schema property names
  const imgSrc = book.coverImage || book.cover || book.cover_image || book.imageUrl || book.image || book.image_url || book.cover_url || book.coverUrl;
  const [imageError, setImageError] = React.useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4, scale: 1.01 }}
      transition={{ duration: 0.2, ease: 'easeOut' }}
    >
      <Card className="p-5 flex flex-col justify-between h-full relative overflow-hidden group hover:border-neutral-500 transition-all shadow-xl">
        <div>
          {/* Top Row: Category Badge & Three-Dot Menu */}
          <div className="flex items-center justify-between gap-2 mb-4">
            <Badge variant="neutral" size="sm" className="truncate max-w-[130px]">
              {category}
            </Badge>
            <div className="flex items-center gap-1.5">
              <Badge variant={statusBadge.variant} size="sm">
                {statusBadge.label}
              </Badge>
              <Dropdown
                align="right"
                trigger={
                  <button
                    type="button"
                    title="Options"
                    className="p-1 rounded-lg text-[#A1A1AA] hover:text-white hover:bg-[#1E1E1E] transition-colors"
                  >
                    <FiMoreVertical className="w-4 h-4" />
                  </button>
                }
                items={menuItems}
              />
            </div>
          </div>

          {/* Book Cover Container */}
          <div className="w-full h-48 bg-[#0E0E0E] rounded-xl border border-[#2A2A2A] overflow-hidden mb-4 relative flex items-center justify-center p-2 group-hover:border-[#3A3A3A] transition-colors">
            {imgSrc && !imageError ? (
              <img
                src={imgSrc}
                alt={title}
                onError={() => setImageError(true)}
                className="max-h-full max-w-full object-contain rounded-lg shadow-sm transition-transform duration-200 group-hover:scale-105"
              />
            ) : (
              <div className="flex flex-col items-center justify-center text-[#A1A1AA] p-4 text-center">
                <div className="w-10 h-10 rounded-full bg-[#1E1E1E] flex items-center justify-center mb-2">
                  <FiBook className="w-5 h-5 text-white" />
                </div>
                <span className="text-[11px] font-semibold text-white line-clamp-1">{title}</span>
                <span className="text-[10px] text-[#A1A1AA] mt-0.5">{author}</span>
              </div>
            )}
          </div>

          {/* Title & Author */}
          <h3
            onClick={() => onViewDetails(book)}
            className="text-base font-bold text-white tracking-tight line-clamp-1 hover:underline cursor-pointer"
            title={title}
          >
            {title}
          </h3>
          <p className="text-xs text-[#A1A1AA] mt-0.5 line-clamp-1" title={author}>
            by {author}
          </p>
        </div>

        {/* Footer Details: Copies ratio & ISBN */}
        <div className="mt-4 pt-3 border-t border-[#2A2A2A] flex items-center justify-between text-xs text-[#A1A1AA]">
          <div className="flex items-center gap-1 font-medium">
            <span className="text-white font-semibold">{availableCopies}</span>
            <span>/</span>
            <span>{totalCopies} available</span>
          </div>
          <span className="font-mono text-[11px] text-[#A1A1AA]/80" title={`ISBN: ${isbn}`}>
            {isbn !== 'N/A' ? `ISBN: ${isbn}` : department}
          </span>
        </div>
      </Card>
    </motion.div>
  );
};

export default BookCard;
