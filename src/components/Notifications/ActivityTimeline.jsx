import React from 'react';
import { motion } from 'framer-motion';
import Card from '../Card';
import Avatar from '../Avatar';
import EmptyState from '../EmptyState';
import { FiActivity, FiClock, FiCheckCircle, FiBookOpen, FiUser, FiSliders } from 'react-icons/fi';

export const ActivityTimeline = ({ logs = [] }) => {
  const formatDate = (val) => {
    if (!val) return 'Just now';
    if (val.toDate) return val.toDate().toLocaleString();
    return new Date(val).toLocaleString();
  };

  const getIcon = (type = '') => {
    const t = type.toLowerCase();
    if (t.includes('approved')) return <FiCheckCircle className="w-3.5 h-3.5 text-[#22C55E]" />;
    if (t.includes('issued') || t.includes('returned')) return <FiBookOpen className="w-3.5 h-3.5 text-white" />;
    if (t.includes('user') || t.includes('profile')) return <FiUser className="w-3.5 h-3.5 text-white" />;
    if (t.includes('settings')) return <FiSliders className="w-3.5 h-3.5 text-white" />;
    return <FiActivity className="w-3.5 h-3.5 text-[#A1A1AA]" />;
  };

  if (logs.length === 0) {
    return (
      <EmptyState
        icon={FiClock}
        title="No activity history."
        description="System activity timeline will populate automatically as actions occur."
      />
    );
  }

  return (
    <Card className="p-6">
      <h3 className="text-sm font-bold text-white mb-6 border-b border-[#2A2A2A] pb-3 flex items-center gap-2">
        <FiClock className="w-4 h-4 text-white" /> System Activity Timeline
      </h3>

      <div className="relative pl-6 space-y-6 border-l border-[#2A2A2A] ml-3">
        {logs.map((item, idx) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: idx * 0.05 }}
            className="relative flex items-start justify-between gap-4 group"
          >
            {/* Timeline Icon Node */}
            <div className="absolute -left-[31px] top-0.5 w-6 h-6 rounded-full bg-[#171717] border border-[#2A2A2A] flex items-center justify-center shrink-0 group-hover:border-white transition-colors">
              {getIcon(item.type || item.title)}
            </div>

            {/* Content */}
            <div className="space-y-1 flex-1">
              <div className="flex items-center gap-2">
                <Avatar name={item.userEmail || 'Librarian'} size="sm" />
                <h4 className="font-bold text-white text-xs">{item.title || item.type || 'Activity'}</h4>
              </div>
              <p className="text-xs text-[#A1A1AA] leading-relaxed pl-7">
                {item.action || item.description || 'System operation executed.'}
              </p>
            </div>

            {/* Timestamp */}
            <div className="text-[10px] text-[#A1A1AA] font-mono shrink-0">
              {formatDate(item.timestamp)}
            </div>
          </motion.div>
        ))}
      </div>
    </Card>
  );
};

export default ActivityTimeline;
