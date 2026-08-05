import React, { useState } from 'react';
import Input from '../Input';
import Button from '../Button';
import { FiSearch, FiTag, FiX, FiAlertTriangle } from 'react-icons/fi';

export const Step1BasicInfo = ({
  formData,
  updateField,
  addKeyword,
  removeKeyword,
  errors,
  onLookupIsbn,
  isCheckingIsbn,
  isbnWarning,
}) => {
  const [tagInput, setTagInput] = useState('');

  const handleTagKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      addKeyword(tagInput);
      setTagInput('');
    }
  };

  const categories = ['Academic', 'Novel', 'Magazine', 'Reference', 'Research', 'General'];
  const departments = ['Computer Science', 'Engineering', 'Business & Econ', 'Literature', 'Science & Math', 'General'];
  const languages = ['English', 'Spanish', 'French', 'German', 'Mandarin'];

  return (
    <div className="space-y-6">
      {/* ISBN Warning Alert */}
      {isbnWarning && (
        <div className="p-4 rounded-xl bg-amber-950/60 border border-amber-800/60 flex items-center gap-3 text-amber-200 text-xs">
          <FiAlertTriangle className="w-4 h-4 text-[#F59E0B] shrink-0" />
          <span>{isbnWarning}</span>
        </div>
      )}

      {/* Row 1: Title & Subtitle */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label="Book Title *"
          placeholder="e.g. Designing Data-Intensive Applications"
          value={formData.title}
          onChange={(e) => updateField('title', e.target.value)}
          error={errors.title}
          required
        />
        <Input
          label="Subtitle (Optional)"
          placeholder="e.g. The Big Ideas Behind Reliable Systems"
          value={formData.subtitle}
          onChange={(e) => updateField('subtitle', e.target.value)}
        />
      </div>

      {/* Row 2: Author & Co-Author */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label="Author *"
          placeholder="e.g. Martin Kleppmann"
          value={formData.author}
          onChange={(e) => updateField('author', e.target.value)}
          error={errors.author}
          required
        />
        <Input
          label="Co-Author (Optional)"
          placeholder="e.g. Secondary contributor"
          value={formData.coAuthor}
          onChange={(e) => updateField('coAuthor', e.target.value)}
        />
      </div>

      {/* Row 3: ISBN & Lookup Action */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
        <div className="md:col-span-2">
          <Input
            label="ISBN Number *"
            placeholder="e.g. 9781449373321"
            value={formData.isbn}
            onChange={(e) => updateField('isbn', e.target.value)}
            error={errors.isbn}
            required
          />
        </div>
        <Button
          variant="secondary"
          size="md"
          icon={FiSearch}
          loading={isCheckingIsbn}
          onClick={onLookupIsbn}
          className="w-full"
        >
          Lookup ISBN
        </Button>
      </div>

      {/* Row 4: Publisher, Edition, Publication Year */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Input
          label="Publisher"
          placeholder="e.g. O'Reilly Media"
          value={formData.publisher}
          onChange={(e) => updateField('publisher', e.target.value)}
        />
        <Input
          label="Edition"
          placeholder="e.g. 1st Edition"
          value={formData.edition}
          onChange={(e) => updateField('edition', e.target.value)}
        />
        <Input
          label="Publication Year"
          type="number"
          placeholder="e.g. 2024"
          value={formData.publicationYear}
          onChange={(e) => updateField('publicationYear', e.target.value)}
        />
      </div>

      {/* Row 5: Category, Department, Language */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-medium text-[#A1A1AA]">Category *</label>
          <select
            value={formData.category}
            onChange={(e) => updateField('category', e.target.value)}
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
          <label className="text-xs font-medium text-[#A1A1AA]">Department *</label>
          <select
            value={formData.department}
            onChange={(e) => updateField('department', e.target.value)}
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
            value={formData.language}
            onChange={(e) => updateField('language', e.target.value)}
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

      {/* Row 6: Semester & Subject */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label="Semester / Curriculum Level"
          placeholder="e.g. Semester 4"
          value={formData.semester}
          onChange={(e) => updateField('semester', e.target.value)}
        />
        <Input
          label="Subject / Topic"
          placeholder="e.g. Distributed Systems"
          value={formData.subject}
          onChange={(e) => updateField('subject', e.target.value)}
        />
      </div>

      {/* Row 7: Description */}
      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-medium text-[#A1A1AA]">Book Description</label>
        <textarea
          rows={4}
          placeholder="Provide a comprehensive summary of the book content, scope, and key topics..."
          value={formData.description}
          onChange={(e) => updateField('description', e.target.value)}
          className="w-full bg-[#171717] text-white text-sm rounded-xl border border-[#2A2A2A] p-3.5 outline-none focus:border-white transition-all placeholder:text-[#52525B]"
        />
      </div>

      {/* Row 8: Keywords Tag Input */}
      <div className="flex flex-col gap-2">
        <label className="text-xs font-medium text-[#A1A1AA] flex items-center gap-1.5">
          <FiTag className="w-3.5 h-3.5" /> Keywords & Search Tags
        </label>
        <div className="flex items-center gap-2">
          <input
            type="text"
            placeholder="Type keyword and press Enter or comma..."
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            onKeyDown={handleTagKeyDown}
            className="flex-1 bg-[#171717] text-white text-sm rounded-xl border border-[#2A2A2A] px-3.5 py-2 outline-none focus:border-white transition-all placeholder:text-[#52525B]"
          />
          <Button
            type="button"
            variant="secondary"
            size="sm"
            onClick={() => {
              addKeyword(tagInput);
              setTagInput('');
            }}
          >
            Add Tag
          </Button>
        </div>

        {/* Render tags */}
        <div className="flex flex-wrap gap-2 pt-1">
          {formData.keywords.map((tag) => (
            <span
              key={tag}
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-[#1E1E1E] text-white text-xs border border-[#2A2A2A]"
            >
              #{tag}
              <button
                type="button"
                onClick={() => removeKeyword(tag)}
                className="text-[#A1A1AA] hover:text-white"
              >
                <FiX className="w-3.5 h-3.5" />
              </button>
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Step1BasicInfo;
