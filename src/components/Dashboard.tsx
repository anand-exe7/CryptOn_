import React from 'react';
import { useSystemStore } from '../store';
import { motion } from 'framer-motion';

const Dashboard: React.FC = () => {
  const { isRunning, toggleSystem, sensors_online, total_attacks, threat_level, telegram_status, telegram_last_message } = useSystemStore();
  const [showSettings, setShowSettings] = React.useState(false);
  const [alertThreshold, setAlertThreshold] = React.useState(50);
  const [tgEnabled, setTgEnabled] = React.useState(true);
  const [simMode, setSimMode] = React.useState(false);

  return (
    <>
      {/* Top Bar */}
      <motion.div
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="bg-gradient-to-r from-[#1B4965] via-[#0f0f23] to-[#1a0f3a] border-b-2 border-[#1EA896]/40 px-6 py-4 flex items-center justify-between shadow-2xl relative overflow-hidden"
        style={{
          boxShadow: '0 0 30px rgba(30, 168, 150, 0.3), inset 0 0 30px rgba(30, 168, 150, 0.1)',
        }}
      >
        {/* Animated background */}
        <motion.div
          animate={{ x: [0, 100, 0] }}
          transition={{ duration: 5, repeat: Infinity }}
          className="absolute inset-0 opacity-10"
          style={{
            background: 'linear-gradient(90deg, transparent, #1EA896, transparent)',
          }}
        />

        <div className="flex items-center gap-6 relative z-10">
          {/* Logo */}
          <motion.div
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center gap-3 cursor-pointer"
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
              className="text-3xl"
            >
              🛡️
            </motion.div>
            <div>
              <motion.h1 className="text-2xl font-bold text-[#1EA896] tracking-widest neon-text">
                CRYPTON IDS
              </motion.h1>
              <p className="text-xs text-gray-400 font-mono">Real-Time Threat Detection</p>
            </div>
          </motion.div>

          {/* Status Indicators */}
          <div className="flex items-center gap-8 ml-8 border-l-2 border-[#1EA896]/30 pl-8">
            {/* System Status */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="flex items-center gap-3"
            >
              <motion.div
                animate={{
                  boxShadow: isRunning
                    ? ['0 0 0 0 rgba(30, 168, 150, 0.7)', '0 0 0 15px rgba(30, 168, 150, 0)']
                    : 'none',
                }}
                transition={{ duration: 1.5, repeat: Infinity }}
                className={`w-4 h-4 rounded-full ${isRunning ? 'bg-[#1EA896]' : 'bg-red-500'}`}
                style={{
                  boxShadow: isRunning ? '0 0 15px #1EA896, 0 0 30px #00d9a3' : '0 0 10px #ff4444',
                }}
              />
              <span className="text-sm font-mono font-bold tracking-wide">
                {isRunning ? (
                  <span className="text-[#00ff00] neon-text">● ONLINE</span>
                ) : (
                  <span className="text-red-400">● OFFLINE</span>
                )}
              </span>
            </motion.div>

            {/* Sensors Online */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              whileHover={{ scale: 1.1 }}
              className="flex items-center gap-2 px-3 py-1 bg-[#1EA896]/10 rounded border border-[#1EA896]/30"
            >
              <span className="text-lg">📡</span>
              <span className="text-sm font-mono font-bold text-[#1EA896]">
                {sensors_online}/4
              </span>
            </motion.div>

            {/* Total Attacks */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              whileHover={{ scale: 1.1 }}
              className="flex items-center gap-2 px-3 py-1 bg-red-500/10 rounded border border-red-500/30"
            >
              <span className="text-lg">⚠️</span>
              <span className="text-sm font-mono font-bold text-red-400">
                {total_attacks}
              </span>
            </motion.div>

            {/* Threat Level */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              whileHover={{ scale: 1.1 }}
              className="flex items-center gap-2 px-3 py-1 rounded border"
              style={{
                borderColor: threat_level < 30 ? '#1EA896' : threat_level < 60 ? '#FFE66D' : '#FF6B6B',
                backgroundColor: threat_level < 30 ? 'rgba(30, 168, 150, 0.1)' : threat_level < 60 ? 'rgba(255, 230, 109, 0.1)' : 'rgba(255, 107, 107, 0.1)',
              }}
            >
              <span className="text-lg">🎯</span>
              <span className="text-sm font-mono font-bold" style={{
                color: threat_level < 30 ? '#1EA896' : threat_level < 60 ? '#FFE66D' : '#FF6B6B'
              }}>
                {Math.round(threat_level)}%
              </span>
            </motion.div>
          </div>
        </div>

        {/* Control Buttons */}
        <div className="flex items-center gap-3 relative z-10">
          <motion.button
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.92 }}
            onClick={toggleSystem}
            className={`px-6 py-3 rounded-lg font-bold text-sm transition uppercase tracking-widest border-2 ${
              isRunning
                ? 'border-red-500 text-red-400 hover:text-red-500'
                : 'border-[#1EA896] text-[#1EA896] hover:text-white'
            }`}
            style={{
              boxShadow: isRunning 
                ? '0 0 20px rgba(255, 107, 107, 0.5)' 
                : '0 0 20px rgba(30, 168, 150, 0.5)',
            }}
          >
            {isRunning ? '⏹ STOP' : '▶ START'}
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.08, rotate: 90 }}
            whileTap={{ scale: 0.92 }}
            onClick={() => setShowSettings(!showSettings)}
            className="px-4 py-3 rounded-lg font-bold text-sm bg-gradient-to-r from-[#1B4965] to-[#1a0f3a] hover:from-[#1EA896]/20 hover:to-[#1EA896]/10 text-[#1EA896] border-2 border-[#1EA896]/50 transition uppercase tracking-wider"
          >
            ⚙️
          </motion.button>
        </div>
      </motion.div>

      {/* Settings Panel */}
      {showSettings && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.3 }}
          className="bg-[#1B4965]/30 border-b border-[#1EA896]/20 px-6 py-4"
        >
          <div className="grid grid-cols-3 gap-6 max-w-2xl">
            <div>
              <label className="text-sm text-gray-400 block mb-2">Alert Threshold</label>
              <div className="flex items-center gap-3">
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={alertThreshold}
                  onChange={(e) => setAlertThreshold(parseInt(e.target.value))}
                  className="flex-1 h-2 bg-[#1EA896]/20 rounded-lg appearance-none cursor-pointer"
                />
                <span className="text-[#1EA896] font-mono text-sm w-8">{alertThreshold}</span>
              </div>
            </div>

            <div>
              <label className="text-sm text-gray-400 block mb-2">Telegram Alerts</label>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setTgEnabled(!tgEnabled)}
                className={`px-4 py-2 rounded text-sm font-mono transition ${
                  tgEnabled
                    ? 'bg-[#1EA896] text-[#0f0f23]'
                    : 'bg-gray-600 text-gray-300'
                }`}
              >
                {tgEnabled ? '✓ Enabled' : '✗ Disabled'}
              </motion.button>
            </div>

            <div>
              <label className="text-sm text-gray-400 block mb-2">Simulation Mode</label>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setSimMode(!simMode)}
                className={`px-4 py-2 rounded text-sm font-mono transition ${
                  simMode
                    ? 'bg-yellow-600 text-yellow-100'
                    : 'bg-gray-600 text-gray-300'
                }`}
              >
                {simMode ? '🎬 ON' : '🎬 OFF'}
              </motion.button>
            </div>
          </div>
        </motion.div>
      )}

      {/* Telegram Status Bar */}
      {tgEnabled && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="bg-gradient-to-r from-pink-900/20 to-purple-900/20 border-b border-pink-500/20 px-6 py-2 flex items-center justify-between"
        >
          <div className="flex items-center gap-3">
            <motion.div
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="text-lg"
            >
              📱
            </motion.div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-400">Telegram Bot:</span>
              <motion.div
                animate={{
                  boxShadow: telegram_status
                    ? ['0 0 0 0 rgba(168, 85, 247, 0.7)', '0 0 0 6px rgba(168, 85, 247, 0)']
                    : 'none',
                }}
                transition={{ duration: 1.5, repeat: Infinity }}
                className={`w-2 h-2 rounded-full ${telegram_status ? 'bg-purple-500' : 'bg-gray-500'}`}
              />
              <span className="text-sm font-mono">
                {telegram_status ? (
                  <span className="text-purple-400">Connected</span>
                ) : (
                  <span className="text-gray-400">Disconnected</span>
                )}
              </span>
            </div>
            <span className="text-xs text-gray-500 border-l border-gray-600 pl-3 ml-3">
              {telegram_last_message}
            </span>
          </div>
        </motion.div>
      )}
    </>
  );
};

export default Dashboard;
