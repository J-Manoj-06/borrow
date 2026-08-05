import React, { useRef } from 'react';
import Card from '../Card';
import Input from '../Input';
import Button from '../Button';
import { FiUploadCloud, FiRefreshCw, FiTag, FiX } from 'react-icons/fi';

export const BookEditForm = ({
  editData,
  onChange,
  onImageChange,
  onAddTag,
  onRemoveTag,
  errors = {},
  isUploadingImage,
  uploadProgress,
}) => {
  const fileRef = useRef(null);
  const [tagInput, setTagInput] = React.useState('');

  const categories = ['Academic', 'Novel', 'Magazine', 'Reference', 'Research', 'General'];
  const departments = ['Computer Science', 'Engineering', 'Business & Econ', 'Literature', 'Science & Math', 'General'];
  const languages = ['English', 'Spanish', 'French', 'German', 'Mandarin'];

  const handleTagKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      onAddTag(tagInput);
      setTagInput('');
    }
  };

  return (
    <div className="space-y-6">
      <input
        ref={fileRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        onChange={(e) => e.target.files && onImageChange(e.target.files[0])}
        className="hidden"
      />

      {/* Cover Replacement Section */}
      <Card className="p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h4 className="text-sm font-semibold text-white">Cover Image Replacement</h4>
          <p className="text-xs text-[#A1A1AA] mt-0.5">
            Upload new cover art to Cloudinary. Replaces existing URL upon saving.
          </p>
          {isUploadingImage && (
            <div className="mt-2 text-xs text-white font-medium">
              Uploading to Cloudinary: {uploadProgress}%
            </div>
          )}
        </div>
        <Button
          type="button"
          variant="secondary"
          size="sm"
          icon={FiUploadCloud}
          loading={isUploadingImage}
          onClick={() => fileRef.current?.click()}
        >
          Change Cover Art
        </Button>
      </Card>

      {/* Form Controls Grid */}
      <Card className="p-6 space-y-6">
        <h3 className="text-base font-bold text-white tracking-tight pb-3 border-b border-[#2A2A2A]">
          Edit Book Parameters
        </h3>

        {/* Row 1: Title & Subtitle */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Book Title *"
            value={editData.title || ''}
            onChange={(e) => onChange('title', e.target.value)}
            error={errors.title}
          />
          <Input
            label="Subtitle"
            value={editData.subtitle || ''}
            onChange={(e) => onChange('subtitle', e.target.value)}
          />
        </div>

        {/* Row 2: Author & Co-Author */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Author Name *"
            value={editData.author || ''}
            onChange={(e) => onChange('author', e.target.value)}
            error={errors.author}
          />
          <Input
            label="Co-Author"
            value={editData.coAuthor || ''}
            onChange={(e) => onChange('coAuthor', e.target.value)}
          />
        </div>

        {/* Row 3: ISBN, Publisher, Edition, Year */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Input
            label="ISBN *"
            value={editData.isbn || ''}
            onChange={(e) => onChange('isbn', e.target.value)}
            error={errors.isbn}
          />
          <Input
            label="Publisher"
            value={editData.publisher || ''}
            onChange={(e) => onChange('publisher', e.target.value)}
          />
          <Input
            label="Edition"
            value={editData.edition || ''}
            onChange={(e) => onChange('edition', e.target.value)}
          />
          <Input
            label="Publication Year"
            type="number"
            value={editData.publicationYear || ''}
            onChange={(e) => onChange('publicationYear', e.target.value)}
          />
        </div>

        {/* Row 4: Category, Department, Language */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-[#A1A1AA]">Category</label>
            <select
              value={editData.category || 'General'}
              onChange={(e) => onChange('category', e.target.value)}
              className="bg-[#171717] text-white text-sm rounded-xl border border-[#2A2A2A] px-3.5 py-2.5 outline-none focus:border-white transition-colors"
            >
              {categories.map((c) => (
                <option key={c} value={c} className="bg-[#171717]">
                  {c}
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-[#A1A1AA]">Department</label>
            <select
              value={editData.department || 'General'}
              onChange={(e) => onChange('department', e.target.value)}
              className="bg-[#171717] text-white text-sm rounded-xl border border-[#2A2A2A] px-3.5 py-2.5 outline-none focus:border-white transition-colors"
            >
              {departments.map((d) => (
                <option key={d} value={d} className="bg-[#171717]">
                  {d}
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-[#A1A1AA]">Language</label>
            <select
              value={editData.language || 'English'}
              onChange={(e) => onChange('language', e.target.value)}
              className="bg-[#171717] text-white text-sm rounded-xl border border-[#2A2A2A] px-3.5 py-2.5 outline-none focus:border-white transition-colors"
            >
              {languages.map((l) => (
                <option key={l} value={l} className="bg-[#171717]">
                  {l}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Row 5: Copies & Location */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Input
            label="Total Copies"
            type="number"
            min="1"
            value={editData.totalCopies ?? 1}
            onChange={(e) => onChange('totalCopies', Number(e.target.value))}
            error={errors.totalCopies}
          />
          <Input
            label="Available Copies"
            type="number"
            min="0"
            value={editData.availableCopies ?? 1}
            onChange={(e) => onChange('availableCopies', Number(e.target.value))}
            error={errors.availableCopies}
          />
          <Input
            label="Rack Number"
            value={editData.rack || ''}
            onChange={(e) => onChange('rack', e.target.value)}
          />
          <Input
            label="Shelf Number"
            value={editData.shelf || ''}
            onChange={(e) => onChange('shelf', e.target.value)}
          />
        </div>

        {/* Row 6: Description */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-medium text-[#A1A1AA]">Description</label>
          <textarea
            rows={4}
            value={editData.description || ''}
            onChange={(e) => onChange('description', e.target.value)}
            className="w-full bg-[#171717] text-white text-sm rounded-xl border border-[#2A2A2A] p-3.5 outline-none focus:border-white transition-all"
          />
        </div>

        {/* Keywords */}
        <div className="flex flex-col gap-2">
          <label className="text-xs font-medium text-[#A1A1AA] flex items-center gap-1.5">
            <FiTag className="w-3.5 h-3.5" /> Keywords
          </label>
          <div className="flex items-center gap-2">
            <input
              type="text"
              placeholder="Add tag and press Enter..."
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={handleTagKeyDown}
              className="flex-1 bg-[#171717] text-white text-sm rounded-xl border border-[#2A2A2A] px-3.5 py-2 outline-none focus:border-white"
            />
            <Button
              type="button"
              variant="secondary"
              size="sm"
              onClick={() => {
                onAddTag(tagInput);
                setTagInput('');
              }}
            >
              Add Tag
            </Button>
          </div>
          <div className="flex flex-wrap gap-2 pt-1">
            {(editData.keywords || []).map((t) => (
              <span
                key={t}
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-[#111111] text-white text-xs border border-[#2A2A2A]"
              >
                #{t}
                <button type="button" onClick={() => onRemoveTag(t)}>
                  <FiX className="w-3.5 h-3.5 text-[#A1A1AA] hover:text-white" />
                </button>
              </span>
            ))}
          </div>
        </div>
      </Card>
    </div>
  );
};

export default BookEditForm;
