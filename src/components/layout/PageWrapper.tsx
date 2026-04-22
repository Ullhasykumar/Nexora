/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { motion } from 'motion/react';
import { Sidebar } from './Sidebar';
import { Topbar } from './Topbar';

interface PageWrapperProps {
  children: React.ReactNode;
}

export const PageWrapper: React.FC<PageWrapperProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-bg-base text-text-primary flex">
      <Sidebar />
      <div className="flex-1 ml-[80px] flex flex-col">
        <Topbar />
        <motion.main
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="p-8"
        >
          {children}
        </motion.main>
      </div>
    </div>
  );
};
