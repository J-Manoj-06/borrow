import React, { useState, useEffect } from 'react';
import Card from '../Card';
import Button from '../Button';
import Input from '../Input';
import { FiUpload, FiSave, FiBook } from 'react-icons/fi';

export const LibrarySettingsTab = ({ data = {}, onSave, isSaving, onUploadLogo, isUploadingLogo }) => {
  const [formData, setFormData] = useState({
    libraryName: '',
    logoUrl: '',
    collegeName: '',
    address: '',
    phone: '',
    email: '',
    website: '',
    workingHours: '',
    description: '',
  });

  useEffect(() => {
    if (data) {
      setFormData({
        libraryName: data.libraryName || 'Borrow Central Library',
        logoUrl: data.logoUrl || '',
        collegeName: data.collegeName || 'State Institute of Technology',
        address: data.address || '100 University Avenue',
        phone: data.phone || '+1 (555) 019-2834',
        email: data.email || 'library@borrow.app',
        website: data.website || 'https://borrow.app',
        workingHours: data.workingHours || 'Mon - Fri: 8:00 AM - 8:00 PM',
        description: data.description || 'Central academic library system.',
      });
    }
  }, [data]);

  const handleChange = (field, val) => {
    setFormData((prev) => ({ ...prev, [field]: val }));
  };

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = await onUploadLogo(file);
      if (url) {
        setFormData((prev) => ({ ...prev, logoUrl: url }));
      }
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave('library', formData);
  };

  return (
    <Card className="p-6">
      <form onSubmit={handleSubmit} className="space-y-6 text-xs text-white">
        <div className="border-b border-[#2A2A2A] pb-4 flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-white">Library Profile Configuration</h3>
            <p className="text-xs text-[#A1A1AA]">General institution identity & contact details</p>
          </div>
          <Button type="submit" variant="primary" size="sm" icon={FiSave} loading={isSaving}>
            Save Library Info
          </Button>
        </div>

        {/* Logo Upload Section */}
        <div className="flex items-center gap-4 p-4 rounded-2xl bg-[#111111] border border-[#2A2A2A]">
          <div className="w-16 h-16 rounded-2xl bg-[#171717] border border-[#2A2A2A] overflow-hidden flex items-center justify-center shrink-0">
            {formData.logoUrl ? (
              <img src={formData.logoUrl} alt="Library Logo" className="w-full h-full object-cover" />
            ) : (
              <FiBook className="w-6 h-6 text-[#A1A1AA]" />
            )}
          </div>
          <div className="space-y-1.5 flex-1">
            <h4 className="font-bold text-white text-xs">Library Brand Logo</h4>
            <p className="text-[11px] text-[#A1A1AA]">PNG, JPG or WebP. Automatically stored via Cloudinary.</p>
            <label className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#171717] border border-[#2A2A2A] text-white cursor-pointer hover:border-white transition-colors">
              <FiUpload className="w-3.5 h-3.5" />
              <span>{isUploadingLogo ? 'Uploading...' : 'Upload Logo'}</span>
              <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
            </label>
          </div>
        </div>

        {/* Grid Inputs */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Library Name *"
            value={formData.libraryName}
            onChange={(e) => handleChange('libraryName', e.target.value)}
            required
          />
          <Input
            label="College / Institution Name *"
            value={formData.collegeName}
            onChange={(e) => handleChange('collegeName', e.target.value)}
            required
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Input
            label="Contact Email *"
            type="email"
            value={formData.email}
            onChange={(e) => handleChange('email', e.target.value)}
            required
          />
          <Input
            label="Contact Phone"
            value={formData.phone}
            onChange={(e) => handleChange('phone', e.target.value)}
          />
          <Input
            label="Official Website"
            value={formData.website}
            onChange={(e) => handleChange('website', e.target.value)}
          />
        </div>

        <Input
          label="Library Physical Address"
          value={formData.address}
          onChange={(e) => handleChange('address', e.target.value)}
        />

        <Input
          label="Operating / Working Hours"
          value={formData.workingHours}
          onChange={(e) => handleChange('workingHours', e.target.value)}
        />

        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-medium text-[#A1A1AA]">Library Description</label>
          <textarea
            rows={3}
            value={formData.description}
            onChange={(e) => handleChange('description', e.target.value)}
            className="w-full bg-[#171717] text-white text-xs rounded-xl border border-[#2A2A2A] p-3 outline-none focus:border-white transition-colors"
          />
        </div>
      </form>
    </Card>
  );
};

export default LibrarySettingsTab;
