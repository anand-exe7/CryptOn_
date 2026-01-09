import React, { useEffect } from 'react';
import { useSystemStore } from '../store';
import { motion, AnimatePresence } from 'framer-motion';

const Terminal: React.FC = () => {
  const { 
    terminal_history, 
    addTerminalOutput, 
    clearTerminal, 
    addLog, 
    setThreatLevel, 
    addAttack, 
    setTelegramStatus 
  } = useSystemStore();
  const [input, setInput] = React.useState('');
  const terminalRef = React.useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [terminal_history]);

  const handleCommand = (cmdStr: string) => {
    const cmd = cmdStr.trim().toLowerCase();

    if (!cmd) {
      addTerminalOutput('crypton-ids> ');
      return;
    }

    addTerminalOutput(cmd);

    // TODO: eventually split these into separate handlers instead of this giant switch
    if (cmd === 'system start') {
      setTimeout(() => addTerminalOutput('[SYS] >> Initializing CRYPTON engine...'), 100);
      setTimeout(() => addTerminalOutput('[AI] ✓ Model loaded (v1.3 - LSTM)'), 300);
      setTimeout(() => addTerminalOutput('[NET] 📡 Sensors online (4/4)'), 600);
      setTimeout(() => addTerminalOutput('[AI] ✓ Threat model: READY'), 800);
      setTimeout(() => addTerminalOutput('[OK] ★ SYSTEM OPERATIONAL ★'), 1000);
      addLog({
        timestamp: new Date().toLocaleTimeString(),
        type: 'SYSTEM',
        category: 'Startup',
        message: 'Intrusion detection engine started',
      });
      setTelegramStatus(true, '🟢 System Online');
    } 
    else if (cmd === 'system stop') {
      addTerminalOutput('[SYS] >> Shutting down system...');
      setTimeout(() => addTerminalOutput('[NET] Sensors offline'), 200);
      setTimeout(() => addTerminalOutput('[AI] Models unloaded'), 400);
      setTimeout(() => addTerminalOutput('[OK] System stopped'), 600);
      addLog({
        timestamp: new Date().toLocaleTimeString(),
        type: 'SYSTEM',
        category: 'Shutdown',
        message: 'Intrusion detection engine stopped',
      });
      setTelegramStatus(false, '🔴 System Offline');
    } 
    else if (cmd === 'status') {
      const state = useSystemStore.getState();
      addTerminalOutput(`╔════════════════════════════════════╗`);
      addTerminalOutput(`║  CRYPTON IDS - SYSTEM STATUS      ║`);
      addTerminalOutput(`╠════════════════════════════════════╣`);
      addTerminalOutput(`║ System: ${state.isRunning ? '✓ RUNNING' : '✗ STOPPED'}                      ║`);
      addTerminalOutput(`║ Sensors: 4/4 Online                ║`);
      addTerminalOutput(`║ Model: v1.3 LSTM (Ready)           ║`);
      addTerminalOutput(`║ Logs: ${state.logs.length} stored                 ║`);
      addTerminalOutput(`║ Threat Level: ${Math.round(state.threat_level)}%                  ║`);
      addTerminalOutput(`╚════════════════════════════════════╝`);
    } 
    else if (cmd.startsWith('logs --tail')) {
      const parts = cmd.split(' ');
      const num = parts[2] ? parseInt(parts[2]) : 5;
      const state = useSystemStore.getState();
      const recentLogs = state.logs.slice(0, Math.min(num, state.logs.length));
      
      addTerminalOutput(`[LOG] ▼ Last ${recentLogs.length} events:`);
      if (recentLogs.length === 0) {
        addTerminalOutput('[LOG] No logs available');
      } else {
        recentLogs.forEach((log) => {
          const icon = log.type === 'CRITICAL' ? '🔴' : log.type === 'ALERT' ? '⚠️' : '✓';
          addTerminalOutput(`${icon} [${log.timestamp}] ${log.type} | ${log.category} | ${log.message}`);
        });
      }
    } 
    else if (cmd === 'clear') {
      clearTerminal();
    } 
    else if (cmd === 'telegram status') {
      const state = useSystemStore.getState();
      const connected = state.telegram_status ? '✓ CONNECTED' : '✗ DISCONNECTED';
      addTerminalOutput(`[TG] Bot Status: ${connected}`);
      addTerminalOutput(`[TG] Last: ${state.telegram_last_message}`);
    } 
    else if (cmd.startsWith('simulate attack')) {
      const parts = cmd.split(' ');
      const attackType = parts.slice(2).join(' ') || 'generic';
      
      addTerminalOutput(`[SIM] ⚡ Simulating ${attackType.toUpperCase()} attack...`);
      setTimeout(() => {
        addTerminalOutput('[DETECT] 🔍 Anomaly detected: 3.2σ deviation from baseline');
        const conf = Math.floor(Math.random() * 40) + 60;
        addTerminalOutput(`[CLASSIFY] 🎯 Threat: ${attackType.toUpperCase()} (${conf}% confidence)`);
        addTerminalOutput('[ACTION] 🚫 Blocking source IP: 192.168.1.105');
        addTerminalOutput('[TG] 📱 Alert sent to Telegram');
        
        addLog({
          timestamp: new Date().toLocaleTimeString(),
          type: 'CRITICAL',
          category: attackType.charAt(0).toUpperCase() + attackType.slice(1),
          message: `Simulated ${attackType} attack detected and blocked`,
        });
        addAttack();
        setThreatLevel(Math.random() * 60 + 40);
      }, 1000);
    } 
    else if (cmd === 'help') {
      addTerminalOutput('╔════════════════════════════════════╗');
      addTerminalOutput('║  CRYPTON IDS - COMMAND REFERENCE  ║');
      addTerminalOutput('╠════════════════════════════════════╣');
      addTerminalOutput('║ system start   - Start IDS engine  ║');
      addTerminalOutput('║ system stop    - Stop IDS engine   ║');
      addTerminalOutput('║ status         - Show system stats ║');
      addTerminalOutput('║ logs --tail N  - Show last N logs  ║');
      addTerminalOutput('║ telegram status- Check Telegram   ║');
      addTerminalOutput('║ simulate attack- Test detection    ║');
      addTerminalOutput('║ clear          - Clear terminal    ║');
      addTerminalOutput('║ help           - Show this help    ║');
      addTerminalOutput('╚════════════════════════════════════╝');
    } 
    else {
      addTerminalOutput(`[ERR] ✗ Unknown command: ${cmd}`);
      addTerminalOutput('[HINT] Type "help" for available commands');
    }

    setInput('');
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -30 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6 }}
      className="h-full flex flex-col bg-gradient-to-b from-[#0a0e27] to-[#1a0f3a] border-2 border-[#1EA896]/40 rounded-lg overflow-hidden shadow-2xl relative"
      style={{
        boxShadow: '0 0 30px rgba(30, 168, 150, 0.3), inset 0 0 30px rgba(30, 168, 150, 0.1)',
      }}
    >
      <motion.div
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 3, repeat: Infinity }}
        className="absolute inset-0 border-2 border-[#00d9a3]/0 rounded-lg pointer-events-none"
        style={{
          boxShadow: '0 0 20px rgba(0, 217, 163, 0.3), inset 0 0 20px rgba(0, 217, 163, 0.1)',
        }}
      />

      {/* header */}
      <div className="flex items-center justify-between px-4 py-3 bg-gradient-to-r from-[#1B4965]/80 to-transparent border-b-2 border-[#1EA896]/30 relative z-10">
        <div className="flex items-center gap-3">
          <motion.div
            animate={{ scale: [1, 1.2, 1], opacity: [1, 0.6, 1] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="w-3 h-3 bg-[#1EA896] rounded-full"
            style={{
              boxShadow: '0 0 10px #1EA896, 0 0 20px #00d9a3',
            }}
          />
          <span className="text-[#1EA896] font-mono text-xs font-bold tracking-widest neon-text">
            ▌TERMINAL
          </span>
        </div>
        <span className="text-[#666] font-mono text-xs">v1.3</span>
      </div>

      {/* output */}
      <div
        ref={terminalRef}
        className="flex-1 overflow-y-auto p-4 font-mono text-sm bg-[#0a0e27] space-y-0.5 relative z-10"
        style={{
          color: '#00ff00',
          textShadow: '0 0 5px rgba(0, 255, 0, 0.3)',
        }}
      >
        <AnimatePresence mode="popLayout">
          {terminal_history.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-[#1EA896] opacity-60"
            >
              {'{>'} System ready. Type "help" for commands.
            </motion.div>
          )}
          {terminal_history.map((line, idx) => {
            const colorClass = 
              line.includes('[ERR]') ? 'text-red-500' :
              line.includes('[OK]') ? 'text-[#00ff00]' :
              line.includes('[SYS]') ? 'text-cyan-400' :
              line.includes('[NET]') ? 'text-purple-400' :
              line.includes('[AI]') ? 'text-yellow-400' :
              line.includes('[CRITICAL]') ? 'text-red-500' :
              line.includes('[TG]') ? 'text-pink-400' :
              line.includes('║') ? 'text-[#1EA896]' :
              'text-gray-300';

            return (
              <motion.div
                key={`${idx}-${line}`}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className={`font-mono text-xs leading-relaxed ${colorClass}`}
              >
                {line}
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {/* input */}
      <div className="px-4 py-3 border-t-2 border-[#1EA896]/30 bg-gradient-to-t from-[#1B4965]/40 to-transparent flex items-center gap-2 relative z-10">
        <span className="text-[#1EA896] font-mono text-sm font-bold">{'> '}</span>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => {
            if (e.key === 'Enter') handleCommand(input);
          }}
          placeholder="Enter command..."
          className="flex-1 bg-transparent text-[#00ff00] font-mono text-sm outline-none placeholder-gray-600"
          style={{
            textShadow: '0 0 5px rgba(0, 255, 0, 0.3)',
          }}
          autoFocus
        />
        <motion.span
          animate={{ opacity: [1, 0] }}
          transition={{ duration: 0.6, repeat: Infinity }}
          className="w-2 h-4 bg-[#1EA896]"
          style={{
            boxShadow: '0 0 10px #1EA896, 0 0 20px #00d9a3',
          }}
        />
      </div>
    </motion.div>
  );
};

export default Terminal;
