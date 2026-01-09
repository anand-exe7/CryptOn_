import React from 'react';
import { motion } from 'framer-motion';

interface LandingPageProps {
  onNavigate: (page: 'landing' | 'dashboard') => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onNavigate }) => {
  const [demoLogs, setDemoLogs] = React.useState<string[]>([
    '[14:32:11] CRITICAL | Zero-Day | auth-service | 94%',
    '[14:32:14] ACTION  | IP Blocked | 185.xxx.xxx.xxx',
    '[14:32:16] ALERT   | Telegram Notification Sent',
  ]);

  React.useEffect(() => {
    const sim = setInterval(() => {
      const logEntry = `[${new Date().toLocaleTimeString()}] ${['CRITICAL', 'ACTION', 'ALERT'][Math.floor(Math.random() * 3)]} | ${['DDoS', 'Malware', 'Zero-Day'][Math.floor(Math.random() * 3)]} | ${Math.floor(Math.random() * 100)}%`;
      setDemoLogs((prev) => [logEntry, ...prev.slice(0, 4)]);
    }, 2000);

    return () => clearInterval(sim);
  }, []);

  const sectionStagger = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemFade = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 },
    },
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f0f23] via-[#1a1a3e] to-[#0f0f23] overflow-hidden">
      {/* Animated Background Elements */}
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 60, repeat: Infinity, ease: 'linear' }}
        className="fixed top-10 right-10 w-40 h-40 bg-[#1EA896]/10 rounded-full blur-3xl"
      />
      <motion.div
        animate={{ rotate: -360 }}
        transition={{ duration: 80, repeat: Infinity, ease: 'linear' }}
        className="fixed bottom-20 left-20 w-52 h-52 bg-[#1B4965]/10 rounded-full blur-3xl"
      />

      <div className="relative z-10 max-w-7xl mx-auto px-6 py-12">
        {/* Hero Section */}
        <motion.section
          variants={sectionStagger}
          initial="hidden"
          animate="visible"
          className="min-h-screen flex flex-col justify-center items-center text-center mb-20 relative"
        >
          <motion.div
            variants={itemFade}
            animate={{ y: [0, -15, 0], scale: [1, 1.1, 1] }}
            transition={{ duration: 4, repeat: Infinity, type: 'spring' }}
            className="text-8xl mb-8 drop-shadow-2xl filter"
            style={{
              filter: 'drop-shadow(0 0 30px rgba(30, 168, 150, 0.6))',
            }}
          >
            🛡️
          </motion.div>

          <motion.h1
            variants={itemFade}
            className="text-7xl font-bold text-white mb-6 leading-tight tracking-tight"
            style={{
              textShadow: '0 0 30px rgba(30, 168, 150, 0.5), 0 0 60px rgba(30, 168, 150, 0.3)',
            }}
          >
            Real-Time AI-Powered
            <br />
            <motion.span
              animate={{ backgroundPosition: ['0%', '100%', '0%'] }}
              transition={{ duration: 3, repeat: Infinity }}
              className="text-transparent bg-clip-text bg-gradient-to-r from-[#1EA896] via-cyan-400 to-[#00d9a3]"
            >
              Intrusion Detection System
            </motion.span>
          </motion.h1>

          <motion.p 
            variants={itemFade} 
            className="text-2xl text-gray-300 mb-12 max-w-2xl font-mono tracking-wide"
          >
            <motion.span
              animate={{ opacity: [0.7, 1, 0.7] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              ◆ Live monitoring • AI threat analysis • Automated alerts ◆
            </motion.span>
          </motion.p>

          <motion.button
            variants={itemFade}
            whileHover={{ 
              scale: 1.12, 
              boxShadow: '0 0 50px rgba(30, 168, 150, 0.8), 0 0 100px rgba(0, 217, 163, 0.5)',
            }}
            whileTap={{ scale: 0.92 }}
            onClick={() => onNavigate('dashboard')}
            className="px-10 py-5 border-2 border-[#1EA896] text-[#1EA896] font-bold text-xl rounded-lg transition mb-20 uppercase tracking-widest"
            style={{
              boxShadow: '0 0 20px rgba(30, 168, 150, 0.5)',
            }}
          >
            ▶ LAUNCH DASHBOARD
          </motion.button>

          {/* Live Demo Strip */}
          <motion.div
            variants={itemFade}
            className="w-full max-w-3xl bg-[#1B4965]/50 border border-[#1EA896]/30 rounded-lg p-6 backdrop-blur-sm"
          >
            <div className="flex items-center gap-3 mb-4">
              <motion.div
                animate={{ opacity: [1, 0.5, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="w-2 h-2 bg-[#1EA896] rounded-full"
              />
              <span className="text-[#1EA896] font-mono text-sm">LIVE DEMO</span>
            </div>
            <div className="space-y-2 font-mono text-sm h-24 overflow-hidden">
              {demoLogs.map((log, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.3 }}
                  className={`${
                    log.includes('CRITICAL') ? 'text-red-500' :
                    log.includes('ACTION') ? 'text-blue-400' :
                    'text-yellow-400'
                  }`}
                >
                  {log}
                </motion.div>
              ))}
            </div>
          </motion.div>
        </motion.section>

        {/* What It Does */}
        <motion.section
          variants={sectionStagger}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: false, amount: 0.2 }}
          className="py-20 mb-20"
        >
          <motion.h2
            variants={itemFade}
            className="text-4xl font-bold text-center text-white mb-16"
          >
            What It Does
          </motion.h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: '⚡', title: 'Real-Time Detection', desc: 'Instant threat identification' },
              { icon: '🧠', title: 'AI Classification', desc: 'Threat type & severity analysis' },
              { icon: '🔔', title: 'Auto Alerts', desc: 'Telegram bot notifications' },
              { icon: '🎮', title: 'Command Control', desc: 'Terminal-based system control' },
            ].map((item, idx) => (
              <motion.div
                key={idx}
                variants={itemFade}
                whileHover={{ y: -5, boxShadow: '0 10px 30px rgba(30, 168, 150, 0.2)' }}
                className="bg-gradient-to-br from-[#1B4965]/40 to-[#0f0f23] border border-[#1EA896]/20 rounded-lg p-6 text-center"
              >
                <div className="text-4xl mb-3">{item.icon}</div>
                <h3 className="text-[#1EA896] font-bold mb-2">{item.title}</h3>
                <p className="text-gray-400 text-sm">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Architecture Diagram */}
        <motion.section
          variants={sectionStagger}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: false, amount: 0.2 }}
          className="py-20 mb-20"
        >
          <motion.h2
            variants={itemFade}
            className="text-4xl font-bold text-center text-white mb-16"
          >
            System Architecture
          </motion.h2>

          <div className="flex items-center justify-center gap-8 flex-wrap">
            {['📡 Sensors', '🧠 AI Engine', '📊 Dashboard', '📱 Telegram'].map((item, idx) => (
              <div key={idx} className="flex items-center gap-8">
                <motion.div
                  variants={itemFade}
                  whileHover={{ scale: 1.1 }}
                  className="bg-[#1B4965] border border-[#1EA896] rounded-lg px-6 py-3 text-center font-mono text-[#1EA896]"
                >
                  {item}
                </motion.div>
                {idx < 3 && (
                  <motion.div
                    animate={{ x: [0, 10, 0] }}
                    transition={{ duration: 1, repeat: Infinity }}
                    className="text-2xl text-[#1EA896]"
                  >
                    →
                  </motion.div>
                )}
              </div>
            ))}
          </div>
        </motion.section>

        {/* Tech Stack */}
        <motion.section
          variants={sectionStagger}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: false, amount: 0.2 }}
          className="py-20"
        >
          <motion.h2
            variants={itemFade}
            className="text-4xl font-bold text-center text-white mb-12"
          >
            Tech Stack
          </motion.h2>

          <motion.div
            variants={itemFade}
            className="bg-gradient-to-r from-[#1B4965]/50 to-[#0f0f23] border border-[#1EA896]/30 rounded-lg p-8 max-w-2xl mx-auto text-center"
          >
            <p className="text-gray-300 font-mono text-lg leading-relaxed">
              React • WebSockets • TensorFlow/LSTM AI Models • Telegram Bot API •
              <br />
              Real-Time Stream Processing • Python Backend
            </p>
          </motion.div>

          <motion.div
            variants={itemFade}
            className="mt-12 text-center"
          >
            <motion.button
              whileHover={{ scale: 1.05, boxShadow: '0 0 30px rgba(30, 168, 150, 0.5)' }}
              whileTap={{ scale: 0.95 }}
              onClick={() => onNavigate('dashboard')}
              className="px-8 py-4 bg-[#1EA896] text-[#0f0f23] font-bold text-lg rounded-lg hover:shadow-2xl transition"
            >
              Enter Dashboard →
            </motion.button>
          </motion.div>
        </motion.section>
      </div>

      {/* Footer */}
      <motion.footer
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="border-t border-[#1EA896]/20 py-6 text-center text-gray-500 text-sm"
      >
        <p>CryptOn IDS © 2026 | Advanced Threat Detection & Prevention</p>
      </motion.footer>
    </div>
  );
};

export default LandingPage;
