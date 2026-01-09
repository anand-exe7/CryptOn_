import React, { useEffect } from 'react';
import { useSystemStore } from '../store';
import { motion, AnimatePresence } from 'framer-motion';

const Logs: React.FC = () => {
  const { logs, pause_logs, pauseLogs, resumeLogs, clearLogs, isRunning } = useSystemStore();
  const [filter, setFilter] = React.useState<'ALL' | 'CRITICAL' | 'ALERT' | 'ACTION' | 'SYSTEM'>('ALL');
  const logsRef = React.useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (logsRef.current && !pause_logs) {
      logsRef.current.scrollTop = logsRef.current.scrollHeight;
    }
  }, [logs, pause_logs]);

  // auto-generate attacks for demo purposes when system is running
  useEffect(() => {
    if (!isRunning) return;

    const interval = setInterval(() => {
      const attackTypes = ['DDoS', 'Malware', 'Zero-Day', 'Unauthorized Access', 'SQL Injection'];
      const attack = attackTypes[Math.floor(Math.random() * attackTypes.length)];
      const conf = Math.floor(Math.random() * 40) + 60;
      const ip = `${Math.floor(Math.random() * 256)}.${Math.floor(Math.random() * 256)}.${Math.floor(Math.random() * 256)}.${Math.floor(Math.random() * 256)}`;

      // mostly warnings, occasional critical events
      if (Math.random() > 0.7) {
        useSystemStore.getState().addLog({
          timestamp: new Date().toLocaleTimeString(),
          type: 'CRITICAL',
          category: attack,
          message: `${attack} detected from ${ip} - Confidence: ${conf}%`,
        });
        useSystemStore.getState().addAttack();
        useSystemStore.getState().setThreatLevel(Math.random() * 50 + 50);
      } else if (Math.random() > 0.5) {
        useSystemStore.getState().addLog({
          timestamp: new Date().toLocaleTimeString(),
          type: 'ALERT',
          category: 'Anomaly',
          message: `Traffic pattern deviates 2.8σ from baseline - ${Math.floor(Math.random() * 30) + 70}% confidence`,
        });
      } else {
        useSystemStore.getState().addLog({
          timestamp: new Date().toLocaleTimeString(),
          type: 'ACTION',
          category: 'IP Blocked',
          message: `Blocked malicious IP: ${ip}`,
        });
      }
    }, 2000 + Math.random() * 3000); // variable interval feels more realistic

    return () => clearInterval(interval);
  }, [isRunning]);

  const filteredLogs = filter === 'ALL' ? logs : logs.filter((log) => log.type === filter);

  const typeToColor = (type: string) => {
    switch (type) {
      case 'CRITICAL':
        return 'text-red-500';
      case 'ALERT':
        return 'text-yellow-400';
      case 'ACTION':
        return 'text-blue-400';
      case 'SYSTEM':
        return 'text-purple-400';
      default:
        return 'text-gray-300';
    }
  };

  const typeBgStyle = (type: string) => {
    switch (type) {
      case 'CRITICAL':
        return 'bg-red-500/5 border-red-500/20';
      case 'ALERT':
        return 'bg-yellow-400/5 border-yellow-400/20';
      case 'ACTION':
        return 'bg-blue-400/5 border-blue-400/20';
      case 'SYSTEM':
        return 'bg-purple-400/5 border-purple-400/20';
      default:
        return 'bg-gray-400/5 border-gray-400/20';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.4 }}
      className="h-full flex flex-col bg-gradient-to-b from-[#0f0f23] to-[#1a1a3e] border border-[#1EA896]/20 rounded-lg overflow-hidden shadow-xl"
    >
      {/* Header */}
      <div className="px-4 py-3 bg-[#1B4965]/50 border-b border-[#1EA896]/20">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <motion.div
              animate={{ opacity: [1, 0.5, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="w-2 h-2 bg-[#1EA896] rounded-full"
            />
            <span className="text-[#1EA896] font-mono text-xs font-semibold">LOGS ({filteredLogs.length})</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => (pause_logs ? resumeLogs() : pauseLogs())}
              className="px-3 py-1 text-xs font-mono bg-[#1EA896]/20 text-[#1EA896] rounded hover:bg-[#1EA896]/30 transition"
            >
              {pause_logs ? '▶ Resume' : '⏸ Pause'}
            </button>
            <button
              onClick={clearLogs}
              className="px-3 py-1 text-xs font-mono bg-red-500/20 text-red-400 rounded hover:bg-red-500/30 transition"
            >
              Clear
            </button>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-2 flex-wrap">
          {(['ALL', 'CRITICAL', 'ALERT', 'ACTION', 'SYSTEM'] as const).map((tab) => (
            <motion.button
              key={tab}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setFilter(tab)}
              className={`px-3 py-1 text-xs font-mono rounded transition ${
                filter === tab
                  ? 'bg-[#1EA896] text-[#0f0f23]'
                  : 'bg-[#1EA896]/10 text-[#1EA896] hover:bg-[#1EA896]/20'
              }`}
            >
              {tab}
            </motion.button>
          ))}
        </div>
      </div>

      {/* Logs Container */}
      <div
        ref={logsRef}
        className="flex-1 overflow-y-auto font-mono text-xs space-y-1 p-3 bg-[#0f0f23]"
      >
        <AnimatePresence>
          {filteredLogs.length === 0 ? (
            <motion.div
              key="no-logs"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex items-center justify-center h-full text-gray-500"
            >
              No logs available
            </motion.div>
          ) : (
            filteredLogs.map((log, idx) => (
              <motion.div
                key={`${log.timestamp}-${idx}`}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.3 }}
                className={`p-2 rounded border border-transparent transition hover:border-[#1EA896]/50 ${typeBgStyle(log.type)}`}
              >
                <div className="flex items-start gap-3">
                  <span className="text-gray-500 flex-shrink-0">[{log.timestamp}]</span>
                  <span className={`font-semibold flex-shrink-0 w-12 ${typeToColor(log.type)}`}>
                    {log.type}
                  </span>
                  <span className="text-gray-400 flex-shrink-0 w-20">{log.category}</span>
                  <span className="text-gray-300 flex-1">{log.message}</span>
                </div>
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default Logs;
