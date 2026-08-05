import React, { useRef, useState } from 'react';
import Button from '../Button';
import { FiUploadCloud, FiImage, FiTrash2, FiRefreshCw, FiCheckCircle } from 'react-icons/fi';
import { cn } from '../../utils/cn';

export const Step3ImageUpload = ({
  formData,
  onImageSelect,
  onRemoveImage,
  isUploading,
  uploadProgress,
}) => {
  const fileInputRef = useRef(null);
  const [isDragOver, setIsDragOver] = useState(false);

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      onImageSelect(e.dataTransfer.files[0]);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  return (
    <div className="space-y-6">
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        onChange={(e) => e.target.files && onImageSelect(e.target.files[0])}
        className="hidden"
      />

      {/* Upload Progress Bar if active */}
      {isUploading && (
        <div className="p-4 rounded-xl bg-[#171717] border border-[#2A2A2A] space-y-2">
          <div className="flex justify-between text-xs text-white font-medium">
            <span>Uploading Cover to Cloudinary...</span>
            <span>{uploadProgress}%</span>
          </div>
          <div className="w-full h-2 rounded-full bg-[#2A2A2A] overflow-hidden">
            <div
              className="h-full bg-white transition-all duration-200"
              style={{ width: `${uploadProgress}%` }}
            />
          </div>
        </div>
      )}

      {/* Main Image Drop / Preview Container */}
      {formData.coverPreviewUrl ? (
        <div className="flex flex-col sm:flex-row gap-6 p-6 rounded-2xl bg-[#171717] border border-[#2A2A2A] items-center">
          {/* Cover Preview Card */}
          <div className="w-40 h-56 rounded-xl bg-[#111111] border border-[#2A2A2A] overflow-hidden shadow-2xl shrink-0 relative group">
            <img
              src={formData.coverPreviewUrl}
              alt="Cover Preview"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center p-2 text-center text-xs text-white font-medium">
              Client-side crop & 16:9 ready
            </div>
          </div>

          {/* Details & Actions */}
          <div className="flex-1 space-y-4 text-center sm:text-left">
            <div className="flex items-center gap-2 text-xs font-semibold text-[#22C55E]">
              <FiCheckCircle className="w-4 h-4" />
              <span>Cover image selected & validated</span>
            </div>

            <p className="text-sm font-semibold text-white">
              {formData.coverFile?.name || 'Uploaded Book Cover'}
            </p>
            <p className="text-xs text-[#A1A1AA]">
              Format: {formData.coverFile?.type || 'Image'} • Size: {(formData.coverFile?.size ? (formData.coverFile.size / (1024 * 1024)).toFixed(2) : '< 1')} MB
            </p>

            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 pt-2">
              <Button
                variant="secondary"
                size="sm"
                icon={FiRefreshCw}
                onClick={() => fileInputRef.current?.click()}
              >
                Replace Image
              </Button>
              <Button
                variant="danger"
                size="sm"
                icon={FiTrash2}
                onClick={onRemoveImage}
              >
                Remove Cover
              </Button>
            </div>
          </div>
        </div>
      ) : (
        /* Drag and Drop Dropzone */
        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onClick={() => fileInputRef.current?.click()}
          className={cn(
            'flex flex-col items-center justify-center p-10 rounded-2xl border-2 border-dashed transition-all cursor-pointer text-center',
            isDragOver
              ? 'border-white bg-[#1E1E1E]'
              : 'border-[#2A2A2A] bg-[#171717] hover:border-neutral-500 hover:bg-[#1A1A1A]'
          )}
        >
          <div className="w-14 h-14 rounded-2xl bg-[#1E1E1E] border border-[#2A2A2A] flex items-center justify-center text-white mb-4">
            <FiUploadCloud className="w-7 h-7" />
          </div>

          <h3 className="text-base font-bold text-white tracking-tight">
            Click to upload or drag & drop book cover
          </h3>
          <p className="text-xs text-[#A1A1AA] mt-1 max-w-sm">
            Supports JPG, PNG, and WEBP files up to 5MB. Cover art will be compressed and uploaded directly to Cloudinary.
          </p>

          <Button variant="secondary" size="sm" icon={FiImage} className="mt-6 pointer-events-none">
            Browse Files
          </Button>
        </div>
      )}
    </div>
  );
};

export default Step3ImageUpload;
