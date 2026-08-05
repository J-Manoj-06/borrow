import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '../utils/cn';

export const PageContainer = ({ children, className }) => {
  return (
    <motion.main
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      className={cn('p-4 sm:p-6 md:p-8 max-w-7xl mx-auto w-full', className)}
    >
      {children}
    </motion.main>
  );
};

export default PageContainer;
