import React from 'react';
import { FiCheck, FiInfo, FiLayers, FiImage, FiSend } from 'react-icons/fi';
import { cn } from '../../utils/cn';

export const ProgressHeader = ({ currentStep, onStepClick }) => {
  const steps = [
    { id: 1, name: 'Basic Info', icon: FiInfo },
    { id: 2, name: 'Library Info', icon: FiLayers },
    { id: 3, name: 'Cover Image', icon: FiImage },
    { id: 4, name: 'Review & Publish', icon: FiSend },
  ];

  return (
    <div className="w-full bg-[#111111] border border-[#2A2A2A] rounded-2xl p-4 mb-8">
      <div className="flex items-center justify-between relative">
        {steps.map((step, idx) => {
          const Icon = step.icon;
          const isCompleted = currentStep > step.id;
          const isActive = currentStep === step.id;

          return (
            <React.Fragment key={step.id}>
              <button
                type="button"
                onClick={() => isCompleted && onStepClick(step.id)}
                disabled={!isCompleted && !isActive}
                className={cn(
                  'flex items-center gap-2.5 z-10 py-1.5 px-3 rounded-xl transition-all text-xs font-medium select-none',
                  isActive
                    ? 'bg-white text-black font-semibold shadow-md scale-105'
                    : isCompleted
                    ? 'bg-[#1E1E1E] text-white hover:bg-[#2A2A2A] cursor-pointer'
                    : 'bg-transparent text-[#A1A1AA] cursor-not-allowed opacity-60'
                )}
              >
                <div
                  className={cn(
                    'w-6 h-6 rounded-full flex items-center justify-center text-xs shrink-0 font-bold',
                    isActive
                      ? 'bg-black text-white'
                      : isCompleted
                      ? 'bg-[#22C55E] text-black'
                      : 'bg-[#2A2A2A] text-[#A1A1AA]'
                  )}
                >
                  {isCompleted ? <FiCheck className="w-3.5 h-3.5" /> : step.id}
                </div>
                <span className="hidden sm:inline-block">{step.name}</span>
              </button>

              {idx < steps.length - 1 && (
                <div className="flex-1 h-[2px] bg-[#2A2A2A] mx-2 relative overflow-hidden">
                  <div
                    className="h-full bg-white transition-all duration-300"
                    style={{
                      width: isCompleted ? '100%' : isActive ? '50%' : '0%',
                    }}
                  />
                </div>
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};

export default ProgressHeader;
