import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  subscribeToBook, 
  updateBook, 
  archiveBook, 
  softDeleteBook, 
  subscribeToBookTransactions, 
  subscribeToRelatedBooks, 
  checkIsbnExists 
} from '../services/bookService';
import { uploadToCloudinary } from '../services/cloudinary';
import { useAuth } from './useAuth';
import { toast } from 'react-hot-toast';

export const useBookDetails = (bookId) => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Edit Mode state
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({});
  const [newCoverFile, setNewCoverFile] = useState(null);
  const [newCoverPreview, setNewCoverPreview] = useState('');
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isSaving, setIsSaving] = useState(false);
  const [formErrors, setFormErrors] = useState({});

  // Modals state
  const [showUnsavedModal, setShowUnsavedModal] = useState(false);
  const [showArchiveModal, setShowArchiveModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  // Related & Transactions state
  const [transactions, setTransactions] = useState([]);
  const [relatedBooks, setRelatedBooks] = useState([]);

  // Subscribe to book snapshot
  useEffect(() => {
    if (!bookId) return;
    setLoading(true);

    const unsubscribe = subscribeToBook(
      bookId,
      (data) => {
        if (data) {
          setBook(data);
          if (!isEditing) {
            setEditData(data);
          }
        } else {
          setError('Book document not found in library catalog.');
        }
        setLoading(false);
      },
      (err) => {
        setError(err?.message || 'Failed to sync book specification.');
        setLoading(false);
      }
    );

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, [bookId]);

  // Subscribe to transactions & related books
  useEffect(() => {
    if (!bookId || !book) return;

    const unsubTrans = subscribeToBookTransactions(bookId, (list) => {
      setTransactions(list);
    });

    const unsubRelated = subscribeToRelatedBooks(
      book.department,
      book.category,
      bookId,
      (list) => {
        setRelatedBooks(list);
      }
    );

    return () => {
      if (unsubTrans) unsubTrans();
      if (unsubRelated) unsubRelated();
    };
  }, [bookId, book]);

  // Enter Edit Mode
  const enterEditMode = () => {
    setEditData(book ? { ...book } : {});
    setNewCoverFile(null);
    setNewCoverPreview('');
    setFormErrors({});
    setIsEditing(true);
  };

  // Exit Edit Mode with unsaved check
  const requestExitEditMode = () => {
    if (isDirty) {
      setShowUnsavedModal(true);
    } else {
      setIsEditing(false);
    }
  };

  const forceDiscardChanges = () => {
    setShowUnsavedModal(false);
    setEditData(book ? { ...book } : {});
    setNewCoverFile(null);
    setNewCoverPreview('');
    setIsEditing(false);
  };

  // Field change handler
  const handleFieldChange = (field, value) => {
    setEditData((prev) => ({ ...prev, [field]: value }));
    if (formErrors[field]) {
      setFormErrors((prev) => ({ ...prev, [field]: null }));
    }
  };

  // Tags Helper
  const addTag = (tag) => {
    if (!tag || !tag.trim()) return;
    const clean = tag.trim().toLowerCase().replace(/#/g, '');
    const current = editData.keywords || [];
    if (!current.includes(clean)) {
      handleFieldChange('keywords', [...current, clean]);
    }
  };

  const removeTag = (tagToRemove) => {
    const current = editData.keywords || [];
    handleFieldChange('keywords', current.filter((t) => t !== tagToRemove));
  };

  // New Cover Select
  const handleCoverSelect = (file) => {
    if (!file) return;
    setNewCoverFile(file);
    const reader = new FileReader();
    reader.onloadend = () => {
      setNewCoverPreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  // Check if form is dirty
  const isDirty = useMemo(() => {
    if (!book || !isEditing) return false;
    if (newCoverFile) return true;
    return (
      editData.title !== book.title ||
      editData.author !== book.author ||
      editData.isbn !== book.isbn ||
      editData.description !== book.description ||
      editData.totalCopies !== book.totalCopies ||
      editData.availableCopies !== book.availableCopies ||
      editData.category !== book.category ||
      editData.department !== book.department ||
      editData.status !== book.status ||
      editData.rack !== book.rack ||
      editData.shelf !== book.shelf
    );
  }, [book, editData, isEditing, newCoverFile]);

  // Validation
  const validateForm = async () => {
    const errors = {};
    if (!editData.title?.trim()) errors.title = 'Title is required.';
    if (!editData.author?.trim()) errors.author = 'Author is required.';
    if (!editData.isbn?.trim()) errors.isbn = 'ISBN is required.';
    if (Number(editData.totalCopies) < 1) errors.totalCopies = 'Total copies must be >= 1.';
    if (Number(editData.availableCopies) < 0) errors.availableCopies = 'Available copies cannot be negative.';

    setFormErrors(errors);
    if (Object.keys(errors).length > 0) return false;

    // Check duplicate ISBN if ISBN was changed
    if (editData.isbn !== book.isbn) {
      const exists = await checkIsbnExists(editData.isbn, bookId);
      if (exists) {
        setFormErrors((prev) => ({ ...prev, isbn: 'Duplicate ISBN detected in database.' }));
        return false;
      }
    }

    return true;
  };

  // Save Book Updates
  const handleSaveBook = async () => {
    const valid = await validateForm();
    if (!valid) {
      toast.error('Please resolve validation errors before saving.');
      return;
    }

    setIsSaving(true);
    let finalCoverUrl = editData.coverImage;

    try {
      // 1. Upload new cover if selected
      if (newCoverFile) {
        setIsUploadingImage(true);
        setUploadProgress(10);
        finalCoverUrl = await uploadToCloudinary(newCoverFile, (pct) => {
          setUploadProgress(pct);
        });
        setIsUploadingImage(false);
      }

      // 2. Update Firestore document
      const updatePayload = {
        ...editData,
        coverImage: finalCoverUrl,
        totalCopies: Number(editData.totalCopies),
        availableCopies: Number(editData.availableCopies),
        title: editData.title.trim(),
        author: editData.author.trim(),
        isbn: editData.isbn.trim(),
      };

      await updateBook(bookId, updatePayload);

      toast.success(`Book "${updatePayload.title}" updated successfully!`);
      setShowUnsavedModal(false);
      setIsEditing(false);
      setNewCoverFile(null);
      setNewCoverPreview('');
    } catch (err) {
      console.error('Update book error:', err);
      toast.error(err.message || 'Failed to update book.');
    } fontally: {
      setIsSaving(false);
      setIsUploadingImage(false);
    }
  };

  // Archive Trigger
  const handleConfirmArchive = async () => {
    try {
      await archiveBook(bookId);
      toast.success(`Book "${book.title}" archived successfully.`);
      setShowArchiveModal(false);
    } catch (err) {
      toast.error('Failed to archive book.');
    }
  };

  // Soft Delete Trigger
  const handleConfirmSoftDelete = async () => {
    try {
      await softDeleteBook(bookId, user?.email || 'Librarian');
      toast.error(`Book "${book.title}" marked as deleted (soft delete).`);
      setShowDeleteModal(false);
      navigate('/inventory');
    } catch (err) {
      toast.error('Failed to soft delete book.');
    }
  };

  return {
    book,
    loading,
    error,
    isEditing,
    editData,
    isDirty,
    formErrors,
    newCoverPreview,
    isUploadingImage,
    uploadProgress,
    isSaving,
    transactions,
    relatedBooks,
    showUnsavedModal,
    setShowUnsavedModal,
    showArchiveModal,
    setShowArchiveModal,
    showDeleteModal,
    setShowDeleteModal,
    enterEditMode,
    requestExitEditMode,
    forceDiscardChanges,
    handleFieldChange,
    addTag,
    removeTag,
    handleCoverSelect,
    handleSaveBook,
    handleConfirmArchive,
    handleConfirmSoftDelete,
  };
};

export default useBookDetails;
