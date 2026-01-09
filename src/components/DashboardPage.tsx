import React from 'react';
import Terminal from './Terminal';
import Charts from './Charts';
import Logs from './Logs';
import { motion } from 'framer-motion';

const DashboardPage: React.FC<{ onNavigate: (page: 'landing' | 'dashboard') => void }> = ({ onNavigate }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="h-screen flex flex-col bg-gradient-to-br from-[#0f0f23] via-[#1a1a3e] to-[#0f0f23] text-gray-100"
    >
      {/* Navigation bar */}
      <div className="px-6 py-4 bg-[#1B4965]/50 border-b border-[#1EA896]/20 flex items-center justify-between">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => onNavigate('landing')}
          className="text-[#1EA896] font-semibold hover:underline flex items-center gap-2"
        >
          ← Back to Landing
        </motion.button>
        <h1 className="text-lg font-bold text-[#1EA896]">CryptOn IDS - Control Room</h1>
        <div />
      </div>

      {/* 3-column layout: terminal left, charts/logs right */}
      <div className="flex-1 overflow-hidden p-4 gap-4 grid grid-cols-3 grid-rows-2">
        <div className="col-span-1 row-span-2 overflow-hidden">
          <Terminal />
        </div>

        <div className="col-span-2 row-span-1 overflow-hidden">
          <Charts />
        </div>

        <div className="col-span-2 row-span-1 overflow-hidden">
          <Logs />
        </div>
      </div>
    </motion.div>
  );
};

export default DashboardPage;
