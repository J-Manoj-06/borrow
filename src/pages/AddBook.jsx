import React, { useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import PageContainer from '../layout/PageContainer';
import SectionHeader from '../components/SectionHeader';
import Button from '../components/Button';
import Card from '../components/Card';
import Input from '../components/Input';
import useAddBookForm from '../hooks/useAddBookForm';
import { 
  FiUploadCloud, 
  FiTrash2, 
  FiRefreshCw, 
  FiSearch, 
  FiPlus, 
  FiAlertCircle 
} from 'react-icons/fi';

export const AddBook = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const {
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
    isDepartmentRequired,
  } = useAddBookForm();

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleImageSelect(e.dataTransfer.files[0]);
    }
  };

  const categoryOptions = [
    'Academic',
    'Programming & Technology',
    'Novel',
    'Reference',
    'Research',
    'Magazine',
    'Journal',
    'Competitive Exams',
    'Career & Placement',
    'Business & Management',
    'Science',
    'Mathematics',
    'Agriculture',
    'Arts & Literature',
    'Biography & Autobiography',
    'History',
    'Geography',
    'Politics & Law',
    'Health & Medicine',
    "Children's Books",
    'Religion & Philosophy',
    'Language Learning',
    'General Knowledge',
    'Project Reports',
    'Previous Year Question Papers',
    'Others',
  ];

  const departmentOptions = [
    'Computer Science',
    'Information Technology',
    'Artificial Intelligence & Data Science',
    'Electronics & Communication Engineering',
    'Electrical & Electronics Engineering',
    'Mechanical Engineering',
    'Civil Engineering',
    'Biomedical Engineering',
    'Chemical Engineering',
    'Aeronautical Engineering',
    'Automobile Engineering',
    'Mechatronics',
    'Robotics',
    'Biotechnology',
    'Architecture',
    'Physics',
    'Chemistry',
    'Mathematics',
    'English',
    'Commerce',
    'Business Administration (MBA)',
    'Computer Applications (MCA)',
    'Agriculture',
    'General Library',
    'Others',
  ];

  return (
    <PageContainer>
      {/* Page Header */}
      <SectionHeader
        title="Add New Book"
        subtitle="Add a book to your library in seconds."
      />

      {/* Main Single-Step Centered Form Card (Max 900px) */}
      <div className="max-w-4xl mx-auto mb-8">
        <Card className="p-6 md:p-8 bg-[#111111] border-[#2A2A2A] shadow-2xl">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              {/* LEFT COLUMN: Cover Image Upload Box */}
              <div className="lg:col-span-1 space-y-2">
                <label className="block text-xs font-semibold text-white tracking-wide uppercase">
                  Book Cover <span className="text-[#EF4444]">*</span>
                </label>

                <div
                  onDragOver={handleDragOver}
                  onDrop={handleDrop}
                  onClick={() => !formData.coverPreviewUrl && fileInputRef.current?.click()}
                  className={`w-full h-80 rounded-2xl border-2 border-dashed transition-all flex flex-col items-center justify-center p-4 relative overflow-hidden select-none ${
                    errors.coverImage
                      ? 'border-[#EF4444] bg-red-950/10'
                      : formData.coverPreviewUrl
                      ? 'border-[#2A2A2A] bg-[#0E0E0E]'
                      : 'border-[#2A2A2A] hover:border-neutral-500 bg-[#171717] cursor-pointer'
                  }`}
                >
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={(e) => e.target.files?.[0] && handleImageSelect(e.target.files[0])}
                    accept="image/jpeg,image/jpg,image/png,image/webp"
                    className="hidden"
                  />

                  {formData.coverPreviewUrl ? (
                    <div className="relative w-full h-full flex flex-col items-center justify-center group">
                      <img
                        src={formData.coverPreviewUrl}
                        alt="Cover Preview"
                        className="max-h-full max-w-full object-contain rounded-xl shadow-lg"
                      />
                      {/* Image Action Overlay */}
                      <div className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 transition-opacity rounded-xl flex items-center justify-center gap-2">
                        <Button
                          type="button"
                          variant="secondary"
                          size="sm"
                          icon={FiRefreshCw}
                          onClick={(e) => {
                            e.stopPropagation();
                            fileInputRef.current?.click();
                          }}
                        >
                          Replace
                        </Button>
                        <Button
                          type="button"
                          variant="danger"
                          size="sm"
                          icon={FiTrash2}
                          onClick={(e) => {
                            e.stopPropagation();
                            removeCoverImage();
                          }}
                        >
                          Remove
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center space-y-2 p-2">
                      <div className="w-12 h-12 rounded-2xl bg-[#1E1E1E] text-white flex items-center justify-center mx-auto border border-[#2A2A2A]">
                        <FiUploadCloud className="w-6 h-6" />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-white">Click or drag image here</p>
                        <p className="text-[10px] text-[#A1A1AA] mt-0.5">JPG, PNG, WEBP (Max 5MB)</p>
                      </div>
                    </div>
                  )}

                  {/* Upload Progress Bar */}
                  {isUploading && (
                    <div className="absolute inset-x-0 bottom-0 bg-black/80 p-2 text-center text-[10px] text-white">
                      <span>Uploading to Cloudinary... {uploadProgress}%</span>
                      <div className="w-full bg-[#2A2A2A] h-1.5 rounded-full mt-1 overflow-hidden">
                        <div
                          className="bg-white h-full transition-all duration-300"
                          style={{ width: `${uploadProgress}%` }}
                        />
                      </div>
                    </div>
                  )}
                </div>

                {errors.coverImage && (
                  <p className="text-[11px] text-[#EF4444] font-medium flex items-center gap-1">
                    <FiAlertCircle className="w-3.5 h-3.5" /> {errors.coverImage}
                  </p>
                )}
              </div>

              {/* RIGHT COLUMN: Form Inputs */}
              <div className="lg:col-span-2 space-y-4">
                {/* Row 1: Book Title & Author */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input
                    label="Book Title"
                    required
                    placeholder="e.g. Clean Code"
                    value={formData.title}
                    onChange={(e) => updateField('title', e.target.value)}
                    error={errors.title}
                  />

                  <Input
                    label="Author"
                    required
                    placeholder="e.g. Robert C. Martin"
                    value={formData.author}
                    onChange={(e) => updateField('author', e.target.value)}
                    error={errors.author}
                  />
                </div>

                {/* Row 2: ISBN (Optional) & Category */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-white mb-1.5 tracking-wide uppercase">
                      ISBN <span className="text-[#A1A1AA] text-[10px] lowercase">(optional)</span>
                    </label>
                    <div className="flex gap-2">
                      <Input
                        placeholder="e.g. 9780132350884"
                        value={formData.isbn}
                        onChange={(e) => updateField('isbn', e.target.value)}
                        error={errors.isbn}
                        className="flex-1"
                      />
                      <Button
                        type="button"
                        variant="secondary"
                        size="sm"
                        icon={FiSearch}
                        loading={isCheckingIsbn}
                        disabled={!formData.isbn.trim()}
                        onClick={handleLookupIsbn}
                        title="Lookup ISBN details"
                        className="shrink-0 h-[38px] mt-0.5"
                      >
                        Lookup
                      </Button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-white mb-1.5 tracking-wide uppercase">
                      Category <span className="text-[#EF4444]">*</span>
                    </label>
                    <select
                      value={formData.category}
                      onChange={(e) => updateField('category', e.target.value)}
                      className="w-full bg-[#171717] text-white text-xs rounded-xl border border-[#2A2A2A] px-3.5 py-2.5 outline-none focus:border-white transition-colors cursor-pointer"
                    >
                      {categoryOptions.map((opt) => (
                        <option key={opt} value={opt} className="bg-[#171717]">
                          {opt}
                        </option>
                      ))}
                    </select>
                    {errors.category && (
                      <p className="text-[11px] text-[#EF4444] font-medium mt-1">{errors.category}</p>
                    )}
                  </div>
                </div>

                {/* Row 3: Department (Conditional Framer Motion Animation) & Subject */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-start">
                  <Input
                    label="Subject"
                    required
                    placeholder="e.g. Software Engineering"
                    value={formData.subject}
                    onChange={(e) => updateField('subject', e.target.value)}
                    error={errors.subject}
                  />

                  {/* Animated Department Field (Only for Academic Categories) */}
                  <AnimatePresence mode="wait">
                    {isDepartmentRequired ? (
                      <motion.div
                        key="department-field"
                        initial={{ opacity: 0, y: -10, height: 0 }}
                        animate={{ opacity: 1, y: 0, height: 'auto' }}
                        exit={{ opacity: 0, y: -10, height: 0 }}
                        transition={{ duration: 0.25, ease: 'easeOut' }}
                      >
                        <label className="block text-xs font-semibold text-white mb-1.5 tracking-wide uppercase">
                          Department <span className="text-[#EF4444]">*</span>
                        </label>
                        <select
                          value={formData.department}
                          onChange={(e) => updateField('department', e.target.value)}
                          className="w-full bg-[#171717] text-white text-xs rounded-xl border border-[#2A2A2A] px-3.5 py-2.5 outline-none focus:border-white transition-colors cursor-pointer"
                        >
                          {departmentOptions.map((opt) => (
                            <option key={opt} value={opt} className="bg-[#171717]">
                              {opt}
                            </option>
                          ))}
                        </select>
                        {errors.department && (
                          <p className="text-[11px] text-[#EF4444] font-medium mt-1">{errors.department}</p>
                        )}
                      </motion.div>
                    ) : null}
                  </AnimatePresence>
                </div>

                {/* Row 4: Total Copies, Rack Number, Shelf Number */}
                <div className="grid grid-cols-3 gap-3">
                  <Input
                    label="Total Copies"
                    required
                    type="number"
                    min="1"
                    placeholder="1"
                    value={formData.totalCopies}
                    onChange={(e) => updateField('totalCopies', e.target.value)}
                    error={errors.totalCopies}
                  />

                  <Input
                    label="Rack Number"
                    required
                    placeholder="e.g. A-4"
                    value={formData.rack}
                    onChange={(e) => updateField('rack', e.target.value)}
                    error={errors.rack}
                  />

                  <Input
                    label="Shelf Number"
                    required
                    placeholder="e.g. 3"
                    value={formData.shelf}
                    onChange={(e) => updateField('shelf', e.target.value)}
                    error={errors.shelf}
                  />
                </div>

                {/* Row 5: Description (Optional) */}
                <div>
                  <label className="block text-xs font-semibold text-white mb-1.5 tracking-wide uppercase">
                    Description <span className="text-[#A1A1AA] text-[10px] lowercase">(optional)</span>
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Provide a brief summary of the book contents..."
                    value={formData.description}
                    onChange={(e) => updateField('description', e.target.value)}
                    className="w-full bg-[#171717] text-white text-xs rounded-xl border border-[#2A2A2A] p-3 outline-none focus:border-white transition-colors resize-none placeholder:text-[#52525B]"
                  />
                </div>
              </div>
            </div>

            {/* Bottom Action Footer */}
            <div className="pt-6 border-t border-[#2A2A2A] flex items-center justify-end gap-3">
              <Button
                type="button"
                variant="secondary"
                size="md"
                onClick={() => navigate('/inventory')}
              >
                Cancel
              </Button>

              <Button
                type="submit"
                variant="primary"
                size="md"
                icon={FiPlus}
                loading={isSubmitting || isUploading}
              >
                Add Book
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </PageContainer>
  );
};

export default AddBook;
