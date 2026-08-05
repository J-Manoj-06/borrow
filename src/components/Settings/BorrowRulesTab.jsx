import React, { useState, useEffect } from 'react';
import Card from '../Card';
import Button from '../Button';
import Input from '../Input';
import { FiSave, FiCheckSquare, FiSquare } from 'react-icons/fi';

export const BorrowRulesTab = ({ data = {}, onSave, isSaving }) => {
  const [rules, setRules] = useState({
    maxBooksPerStudent: 5,
    defaultBorrowDurationDays: 14,
    maxRenewalCount: 2,
    maxReservationLimit: 3,
    gracePeriodDays: 2,
    referenceBookPolicy: 'in_library_only',
    minAvailableCopiesRequired: 1,
    allowWeekendBorrowing: true,
    allowHolidayBorrowing: false,
    allowBookRenewal: true,
    allowReservation: true,
  });

  useEffect(() => {
    if (data) {
      setRules({
        maxBooksPerStudent: data.maxBooksPerStudent ?? 5,
        defaultBorrowDurationDays: data.defaultBorrowDurationDays ?? 14,
        maxRenewalCount: data.maxRenewalCount ?? 2,
        maxReservationLimit: data.maxReservationLimit ?? 3,
        gracePeriodDays: data.gracePeriodDays ?? 2,
        referenceBookPolicy: data.referenceBookPolicy || 'in_library_only',
        minAvailableCopiesRequired: data.minAvailableCopiesRequired ?? 1,
        allowWeekendBorrowing: data.allowWeekendBorrowing ?? true,
        allowHolidayBorrowing: data.allowHolidayBorrowing ?? false,
        allowBookRenewal: data.allowBookRenewal ?? true,
        allowReservation: data.allowReservation ?? true,
      });
    }
  }, [data]);

  const handleChange = (field, val) => {
    setRules((prev) => ({ ...prev, [field]: val }));
  };

  const toggleRule = (field) => {
    setRules((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave('borrowing_rules', rules);
  };

  return (
    <Card className="p-6">
      <form onSubmit={handleSubmit} className="space-y-6 text-xs text-white">
        <div className="border-b border-[#2A2A2A] pb-4 flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-white">Borrowing Rules & Limits</h3>
            <p className="text-xs text-[#A1A1AA]">Configure circulation thresholds and dispensation constraints</p>
          </div>
          <Button type="submit" variant="primary" size="sm" icon={FiSave} loading={isSaving}>
            Save Rules
          </Button>
        </div>

        {/* Limits & Durations */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Input
            label="Max Books Per Student *"
            type="number"
            min="1"
            max="20"
            value={rules.maxBooksPerStudent}
            onChange={(e) => handleChange('maxBooksPerStudent', Number(e.target.value))}
            required
          />
          <Input
            label="Default Borrow Duration (Days) *"
            type="number"
            min="1"
            max="90"
            value={rules.defaultBorrowDurationDays}
            onChange={(e) => handleChange('defaultBorrowDurationDays', Number(e.target.value))}
            required
          />
          <Input
            label="Max Renewal Count *"
            type="number"
            min="0"
            max="10"
            value={rules.maxRenewalCount}
            onChange={(e) => handleChange('maxRenewalCount', Number(e.target.value))}
            required
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Input
            label="Max Reservation Limit *"
            type="number"
            min="1"
            max="10"
            value={rules.maxReservationLimit}
            onChange={(e) => handleChange('maxReservationLimit', Number(e.target.value))}
            required
          />
          <Input
            label="Late Return Grace Period (Days)"
            type="number"
            min="0"
            max="14"
            value={rules.gracePeriodDays}
            onChange={(e) => handleChange('gracePeriodDays', Number(e.target.value))}
          />
          <Input
            label="Min Available Copies Required"
            type="number"
            min="0"
            max="5"
            value={rules.minAvailableCopiesRequired}
            onChange={(e) => handleChange('minAvailableCopiesRequired', Number(e.target.value))}
          />
        </div>

        {/* Policy Toggles */}
        <div className="pt-4 border-t border-[#2A2A2A] space-y-3">
          <h4 className="font-bold text-white text-xs">Circulation Policy Toggles</h4>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[
              { key: 'allowWeekendBorrowing', label: 'Allow Weekend Borrowing' },
              { key: 'allowHolidayBorrowing', label: 'Allow Holiday Borrowing' },
              { key: 'allowBookRenewal', label: 'Allow Book Renewal' },
              { key: 'allowReservation', label: 'Allow Digital Reservation' },
            ].map((item) => {
              const isChecked = rules[item.key];
              return (
                <div
                  key={item.key}
                  onClick={() => toggleRule(item.key)}
                  className="flex items-center justify-between p-3.5 rounded-xl bg-[#111111] border border-[#2A2A2A] cursor-pointer hover:border-neutral-500 transition-colors select-none"
                >
                  <span className="font-medium text-white">{item.label}</span>
                  {isChecked ? (
                    <FiCheckSquare className="w-5 h-5 text-white" />
                  ) : (
                    <FiSquare className="w-5 h-5 text-[#A1A1AA]" />
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </form>
    </Card>
  );
};

export default BorrowRulesTab;
