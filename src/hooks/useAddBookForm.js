import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createBook, lookupIsbnService } from '../services/bookService';
import { uploadToCloudinary } from '../services/cloudinary';
import { useAuth } from './useAuth';
import { toast } from 'react-hot-toast';

export const ACADEMIC_CATEGORIES = [
  'Academic',
  'Programming & Technology',
  'Research',
  'Science',
  'Mathematics',
  'Agriculture',
  'Project Reports',
  'Previous Year Question Papers',
];

export const isDepartmentRequired = (category = '') => {
  return ACADEMIC_CATEGORIES.includes(category);
};

const initialFormData = {
  title: '',
  author: '',
  isbn: '',
  category: 'Academic',
  department: 'Computer Science',
  subject: '',
  totalCopies: 1,
  rack: '',
  shelf: '',
  description: '',
  coverFile: null,
  coverPreviewUrl: '',
};

export const useAddBookForm = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [formData, setFormData] = useState(initialFormData);
  const [errors, setErrors] = useState({});
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCheckingIsbn, setIsCheckingIsbn] = useState(false);

  const updateField = (field, value) => {
    setFormData((prev) => {
      const updated = { ...prev, [field]: value };
      // If category changes to a non-academic category, default department to "General Library"
      if (field === 'category' && !isDepartmentRequired(value)) {
        updated.department = 'General Library';
      }
      return updated;
    });

    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: null }));
    }
  };

  // Image Selection Handler (Drag & Drop or File Input)
  const handleImageSelect = (file) => {
    if (!file) return;

    if (!['image/jpeg', 'image/jpg', 'image/png', 'image/webp'].includes(file.type)) {
      toast.error('Only JPG, PNG, and WEBP image files are allowed.');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error('Cover image size must be less than 5MB.');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setFormData((prev) => ({
        ...prev,
        coverFile: file,
        coverPreviewUrl: reader.result,
      }));
      setErrors((prev) => ({ ...prev, coverImage: null }));
    };
    reader.readAsDataURL(file);
  };

  const removeCoverImage = () => {
    setFormData((prev) => ({
      ...prev,
      coverFile: null,
      coverPreviewUrl: '',
    }));
  };

  // ISBN Lookup Service Placeholder
  const handleLookupIsbn = async () => {
    if (!formData.isbn.trim()) {
      setErrors((prev) => ({ ...prev, isbn: 'Enter an ISBN first to lookup.' }));
      return;
    }
    setIsCheckingIsbn(true);
    try {
      const result = await lookupIsbnService(formData.isbn);
      if (result && result.found) {
        setFormData((prev) => ({
          ...prev,
          title: prev.title || result.title,
          author: prev.author || result.author,
          category: prev.category || result.category || 'Academic',
          department: prev.department || result.department || 'Computer Science',
        }));
        toast.success('ISBN details loaded successfully!');
      } else {
        toast.success('ISBN lookup complete. Fill in remaining details.');
      }
    } catch {
      toast.error('ISBN lookup failed.');
    } finally {
      setIsCheckingIsbn(false);
    }
  };

  // Validation
  const validateForm = () => {
    const newErrors = {};

    if (!formData.coverPreviewUrl && !formData.coverFile) {
      newErrors.coverImage = 'Book Cover image is required.';
    }
    if (!formData.title.trim()) {
      newErrors.title = 'Book Title is required.';
    }
    if (!formData.author.trim()) {
      newErrors.author = 'Author name is required.';
    }
    if (!formData.category) {
      newErrors.category = 'Category is required.';
    }
    // Department required ONLY when category is academic-related
    if (isDepartmentRequired(formData.category) && !formData.department) {
      newErrors.department = 'Department is required.';
    }
    if (!formData.subject.trim()) {
      newErrors.subject = 'Subject is required.';
    }
    if (!formData.totalCopies || Number(formData.totalCopies) < 1) {
      newErrors.totalCopies = 'Total Copies must be at least 1.';
    }
    if (!formData.rack.trim()) {
      newErrors.rack = 'Rack Number is required.';
    }
    if (!formData.shelf.trim()) {
      newErrors.shelf = 'Shelf Number is required.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Submit Handler
  const handleSubmit = async (e) => {
    if (e) e.preventDefault();

    if (!validateForm()) {
      toast.error('Please fill in all required fields.');
      return;
    }

    setIsSubmitting(true);
    let finalCoverUrl = formData.coverPreviewUrl;

    try {
      // 1. Upload Cover Image to Cloudinary if file selected
      if (formData.coverFile) {
        setIsUploading(true);
        setUploadProgress(20);
        finalCoverUrl = await uploadToCloudinary(formData.coverFile, (percent) => {
          setUploadProgress(percent);
        });
        setIsUploading(false);
      }

      // 2. Build Firestore document payload
      const totalCount = Math.max(1, Number(formData.totalCopies));
      const requiresDept = isDepartmentRequired(formData.category);

      const bookPayload = {
        title: formData.title.trim(),
        author: formData.author.trim(),
        isbn: formData.isbn.trim() || 'N/A',
        category: formData.category,
        department: requiresDept ? formData.department : 'General Library',
        subject: formData.subject.trim(),
        description: formData.description.trim(),
        coverImage: finalCoverUrl || '',
        totalCopies: totalCount,
        availableCopies: totalCount, // Automatically set equal to totalCopies
        rack: formData.rack.trim(),
        shelf: formData.shelf.trim(),
        status: 'Available',
        borrowCount: 0,
        createdBy: user?.email || 'Librarian',
        isArchived: false,
      };

      // 3. Write document to Firestore
      await createBook(bookPayload);

      // 4. Success Feedback & Redirect
      toast.success('Book added successfully.');
      navigate('/inventory');
    } catch (err) {
      console.error('Add book error:', err);
      toast.error(err.message || 'Failed to add book. Please try again.');
    } finally {
      setIsSubmitting(false);
      setIsUploading(false);
    }
  };

  return {
    formData,
    updateField,
    errors,
    isUploading,
    uploadProgress,
    isSubmitting,
    isCheckingIsbn,
    handleLookupIsbn,
    handleImageSelect,
    removeCoverImage,
    handleSubmit,
    isDepartmentRequired: isDepartmentRequired(formData.category),
  };
};

export default useAddBookForm;
