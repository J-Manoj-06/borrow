import React from 'react';
import Card from '../Card';
import { FiBook, FiInfo, FiCode, FiLayers } from 'react-icons/fi';

export const AboutTab = () => {
  const infoItems = [
    { label: 'Borrow Admin Version', value: 'v1.0.0 (Production Ready)' },
    { label: 'Core Framework', value: 'React 19.0.0' },
    { label: 'Build Tooling', value: 'Vite 8.2.0 & Rolldown' },
    { label: 'Database & Auth', value: 'Firebase Firestore & Auth (v10.14.1)' },
    { label: 'Styling Engine', value: 'Tailwind CSS v4.0' },
    { label: 'Animation Library', value: 'Framer Motion v12.4' },
    { label: 'Cloud Storage', value: 'Cloudinary API v1.1' },
    { label: 'Mobile Synchronization', value: 'Borrow Flutter Mobile Application' },
    { label: 'Environment', value: 'Production Web App' },
    { label: 'Target Audience', value: 'Librarians & Academic Library Staff' },
  ];

  return (
    <Card className="p-6">
      <div className="border-b border-[#2A2A2A] pb-4 mb-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-white text-black flex items-center justify-center font-bold">
            <FiBook className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white">Borrow Admin System Specification</h3>
            <p className="text-xs text-[#A1A1AA]">Next-generation SaaS library management system</p>
          </div>
        </div>
      </div>

      <div className="space-y-6 text-xs text-white">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {infoItems.map((item, idx) => (
            <div key={idx} className="p-3.5 rounded-xl bg-[#111111] border border-[#2A2A2A] flex justify-between items-center">
              <span className="text-[#A1A1AA] font-medium">{item.label}</span>
              <span className="font-bold text-white font-mono text-[11px]">{item.value}</span>
            </div>
          ))}
        </div>

        <div className="p-4 rounded-2xl bg-[#111111] border border-[#2A2A2A] space-y-1 text-xs">
          <p className="font-bold text-white">Developed for Borrow Platform</p>
          <p className="text-[#A1A1AA]">
            Built with strict adherence to monochrome dark UI standards, real-time Firestore architecture, multi-step validation, and instant synchronization with the Borrow Flutter mobile app.
          </p>
        </div>
      </div>
    </Card>
  );
};

export default AboutTab;
