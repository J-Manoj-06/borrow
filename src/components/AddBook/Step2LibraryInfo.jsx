import React from 'react';
import Input from '../Input';

export const Step2LibraryInfo = ({ formData, updateField, errors }) => {
  const statusOptions = [
    { value: 'available', label: 'Available for Borrowing' },
    { value: 'maintenance', label: 'Under Maintenance / Repair' },
    { value: 'reference', label: 'Reference Only (In-library)' },
    { value: 'reserved', label: 'Reserved' },
  ];

  const conditionOptions = [
    { value: 'excellent', label: 'Excellent (Brand New)' },
    { value: 'good', label: 'Good (Minor wear)' },
    { value: 'fair', label: 'Fair (Usable condition)' },
    { value: 'damaged', label: 'Damaged (Needs repair)' },
  ];

  return (
    <div className="space-y-6">
      {/* Row 1: Copies */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label="Total Copies *"
          type="number"
          min="1"
          placeholder="e.g. 5"
          value={formData.totalCopies}
          onChange={(e) => {
            const val = Number(e.target.value);
            updateField('totalCopies', val);
            if (formData.availableCopies > val) {
              updateField('availableCopies', val);
            }
          }}
          error={errors.totalCopies}
          required
        />

        <Input
          label="Available Copies *"
          type="number"
          min="0"
          max={formData.totalCopies}
          placeholder="e.g. 5"
          value={formData.availableCopies}
          onChange={(e) => updateField('availableCopies', Number(e.target.value))}
          error={errors.availableCopies}
          required
        />
      </div>

      {/* Row 2: Location (Rack, Shelf, Floor, Section) */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Input
          label="Rack Number"
          placeholder="e.g. Rack 12"
          value={formData.rack}
          onChange={(e) => updateField('rack', e.target.value)}
        />
        <Input
          label="Shelf Number"
          placeholder="e.g. Shelf B3"
          value={formData.shelf}
          onChange={(e) => updateField('shelf', e.target.value)}
        />
        <Input
          label="Floor Level"
          placeholder="e.g. 2nd Floor"
          value={formData.floor}
          onChange={(e) => updateField('floor', e.target.value)}
        />
        <Input
          label="Library Section"
          placeholder="e.g. Science & Tech Wing"
          value={formData.section}
          onChange={(e) => updateField('section', e.target.value)}
        />
      </div>

      {/* Row 3: Status & Condition */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-medium text-[#A1A1AA]">Initial Status *</label>
          <select
            value={formData.status}
            onChange={(e) => updateField('status', e.target.value)}
            className="bg-[#171717] text-white text-sm rounded-xl border border-[#2A2A2A] px-3.5 py-2.5 outline-none focus:border-white transition-colors"
          >
            {statusOptions.map((opt) => (
              <option key={opt.value} value={opt.value} className="bg-[#171717]">
                {opt.label}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-medium text-[#A1A1AA]">Physical Condition *</label>
          <select
            value={formData.condition}
            onChange={(e) => updateField('condition', e.target.value)}
            className="bg-[#171717] text-white text-sm rounded-xl border border-[#2A2A2A] px-3.5 py-2.5 outline-none focus:border-white transition-colors"
          >
            {conditionOptions.map((opt) => (
              <option key={opt.value} value={opt.value} className="bg-[#171717]">
                {opt.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Row 4: Acquisition Date */}
      <Input
        label="Acquisition Date"
        type="date"
        value={formData.acquisitionDate}
        onChange={(e) => updateField('acquisitionDate', e.target.value)}
      />
    </div>
  );
};

export default Step2LibraryInfo;
