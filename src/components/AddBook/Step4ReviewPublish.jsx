import React from 'react';
import Card from '../Card';
import Badge from '../Badge';
import Button from '../Button';
import { FiBook, FiSend, FiCheck, FiLayers, FiGlobe, FiGrid, FiBookmark, FiTag } from 'react-icons/fi';

export const Step4ReviewPublish = ({ formData, isPublishing, onPublish }) => {
  return (
    <div className="space-y-6">
      <Card className="p-6">
        <h3 className="text-lg font-bold text-white tracking-tight mb-4 pb-3 border-b border-[#2A2A2A]">
          Final Review Before Publishing
        </h3>

        <div className="flex flex-col md:flex-row gap-6">
          {/* Cover Preview Column */}
          <div className="w-40 h-56 rounded-xl bg-[#111111] border border-[#2A2A2A] overflow-hidden shrink-0 flex items-center justify-center relative">
            {formData.coverPreviewUrl ? (
              <img src={formData.coverPreviewUrl} alt={formData.title} className="w-full h-full object-cover" />
            ) : (
              <div className="flex flex-col items-center text-center p-4 text-[#A1A1AA]">
                <FiBook className="w-8 h-8 mb-2" />
                <span className="text-xs">No Cover Image</span>
              </div>
            )}
          </div>

          {/* Key Details Summary */}
          <div className="flex-1 space-y-4">
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="success">{formData.status}</Badge>
              <Badge variant="neutral">{formData.category}</Badge>
              <span className="text-xs text-[#A1A1AA] font-mono">ISBN: {formData.isbn || 'N/A'}</span>
            </div>

            <div>
              <h2 className="text-2xl font-extrabold text-white tracking-tight">{formData.title || 'Untitled Book'}</h2>
              {formData.subtitle && <p className="text-sm text-[#A1A1AA] mt-0.5">{formData.subtitle}</p>}
              <p className="text-sm font-medium text-white mt-1">by {formData.author || 'Unknown'}</p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 bg-[#111111] p-4 rounded-xl border border-[#2A2A2A] text-xs">
              <div>
                <span className="text-[#A1A1AA] block">Department</span>
                <span className="font-semibold text-white">{formData.department}</span>
              </div>
              <div>
                <span className="text-[#A1A1AA] block">Copies (Avail / Total)</span>
                <span className="font-semibold text-white">{formData.availableCopies} / {formData.totalCopies}</span>
              </div>
              <div>
                <span className="text-[#A1A1AA] block">Location</span>
                <span className="font-semibold text-white">Rack {formData.rack} • Shelf {formData.shelf}</span>
              </div>
              <div>
                <span className="text-[#A1A1AA] block">Publisher</span>
                <span className="font-semibold text-white">{formData.publisher || 'N/A'}</span>
              </div>
              <div>
                <span className="text-[#A1A1AA] block">Condition</span>
                <span className="font-semibold text-white uppercase">{formData.condition}</span>
              </div>
              <div>
                <span className="text-[#A1A1AA] block">Language</span>
                <span className="font-semibold text-white">{formData.language}</span>
              </div>
            </div>

            {/* Description Preview */}
            {formData.description && (
              <div className="text-xs text-[#A1A1AA] bg-[#111111] p-3 rounded-xl border border-[#2A2A2A]">
                <span className="font-semibold text-white block mb-1">Description:</span>
                <p className="line-clamp-3">{formData.description}</p>
              </div>
            )}
          </div>
        </div>

        {/* Action Button Container */}
        <div className="mt-8 pt-6 border-t border-[#2A2A2A] flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-xs text-[#22C55E]">
            <FiCheck className="w-4 h-4" />
            <span>Ready for instant sync with Borrow mobile app</span>
          </div>

          <Button
            variant="primary"
            size="lg"
            icon={FiSend}
            loading={isPublishing}
            onClick={onPublish}
            className="w-full sm:w-auto px-8"
          >
            Publish Book to Catalog
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default Step4ReviewPublish;
