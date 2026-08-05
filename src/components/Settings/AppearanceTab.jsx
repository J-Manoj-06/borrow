import React, { useState } from 'react';
import Card from '../Card';
import Button from '../Button';
import { FiSliders, FiSave, FiCheck } from 'react-icons/fi';
import { toast } from 'react-hot-toast';

export const AppearanceTab = () => {
  const [theme, setTheme] = useState('dark');
  const [sidebarWidth, setSidebarWidth] = useState('normal');
  const [fontSize, setFontSize] = useState('medium');

  const handleSave = () => {
    toast.success('Appearance preferences updated!');
  };

  return (
    <Card className="p-6">
      <div className="border-b border-[#2A2A2A] pb-4 mb-4 flex items-center justify-between">
        <div>
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <FiSliders className="w-4 h-4 text-white" /> Appearance & Display Theme
          </h3>
          <p className="text-xs text-[#A1A1AA]">Customize your dashboard visual preferences</p>
        </div>
        <Button variant="primary" size="sm" icon={FiSave} onClick={handleSave}>
          Save Appearance
        </Button>
      </div>

      <div className="space-y-6 text-xs text-white">
        {/* Theme Selector */}
        <div>
          <h4 className="font-bold text-white mb-2">Theme Mode</h4>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div
              onClick={() => setTheme('dark')}
              className={`p-4 rounded-xl border cursor-pointer flex items-center justify-between ${
                theme === 'dark' ? 'bg-[#171717] border-white' : 'bg-[#111111] border-[#2A2A2A]'
              }`}
            >
              <div>
                <p className="font-bold text-white">Dark Mode (Default)</p>
                <p className="text-[10px] text-[#A1A1AA]">Monochrome dark palette</p>
              </div>
              {theme === 'dark' && <FiCheck className="w-4 h-4 text-white" />}
            </div>

            <div className="p-4 rounded-xl border bg-[#111111] border-[#2A2A2A] opacity-50 cursor-not-allowed">
              <p className="font-bold text-[#A1A1AA]">Light Mode (Disabled)</p>
              <p className="text-[10px] text-[#A1A1AA]">Preserved dark theme contract</p>
            </div>

            <div className="p-4 rounded-xl border bg-[#111111] border-[#2A2A2A] opacity-50 cursor-not-allowed">
              <p className="font-bold text-[#A1A1AA]">System Sync (Disabled)</p>
              <p className="text-[10px] text-[#A1A1AA]">Follow system settings</p>
            </div>
          </div>
        </div>

        {/* Sidebar Width */}
        <div>
          <h4 className="font-bold text-white mb-2">Sidebar Layout Width</h4>
          <div className="flex gap-3">
            {['compact', 'normal', 'large'].map((w) => (
              <button
                key={w}
                type="button"
                onClick={() => setSidebarWidth(w)}
                className={`px-4 py-2 rounded-xl text-xs font-semibold capitalize border ${
                  sidebarWidth === w ? 'bg-white text-black border-white' : 'bg-[#111111] text-[#A1A1AA] border-[#2A2A2A]'
                }`}
              >
                {w}
              </button>
            ))}
          </div>
        </div>

        {/* Font Size */}
        <div>
          <h4 className="font-bold text-white mb-2">Typography Density</h4>
          <div className="flex gap-3">
            {['small', 'medium', 'large'].map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => setFontSize(s)}
                className={`px-4 py-2 rounded-xl text-xs font-semibold capitalize border ${
                  fontSize === s ? 'bg-white text-black border-white' : 'bg-[#111111] text-[#A1A1AA] border-[#2A2A2A]'
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      </div>
    </Card>
  );
};

export default AppearanceTab;
