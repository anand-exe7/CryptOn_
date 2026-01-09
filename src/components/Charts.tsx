import React, { useEffect, useState } from 'react';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { useSystemStore } from '../store';
import { motion } from 'framer-motion';

const Charts: React.FC = () => {
  const { threat_level, isRunning } = useSystemStore();
  const [attackData, setAttackData] = useState([
    { name: 'DDoS', value: 35, color: '#FF6B6B' },
    { name: 'Malware', value: 28, color: '#4ECDC4' },
    { name: 'Zero-Day', value: 22, color: '#FFE66D' },
    { name: 'Unauthorized', value: 15, color: '#95E1D3' },
  ]);

  const [timelineData, setTimelineData] = useState([
    { time: '14:00', attacks: 2 },
    { time: '14:15', attacks: 5 },
    { time: '14:30', attacks: 3 },
    { time: '14:45', attacks: 8 },
    { time: '15:00', attacks: 4 },
    { time: '15:15', attacks: 6 },
  ]);

  const [confidenceData, setConfidenceData] = useState([
    { range: '50-60%', value: 8 },
    { range: '60-70%', value: 12 },
    { range: '70-80%', value: 18 },
    { range: '80-90%', value: 25 },
    { range: '90-100%', value: 37 },
  ]);

  useEffect(() => {
    if (!isRunning) return;

    const interval = setInterval(() => {
      setTimelineData((prev) => {
        const next = [...prev.slice(1)];
        next.push({
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          attacks: Math.floor(Math.random() * 10),
        });
        return next;
      });

      setAttackData((prev) =>
        prev.map((item) => ({
          ...item,
          value: Math.max(5, item.value + (Math.random() - 0.5) * 4),
        }))
      );

      // slightly vary the distribution to keep it realistic
      setConfidenceData((prev) =>
        prev.map((item) => ({
          ...item,
          value: Math.max(2, item.value + (Math.random() - 0.5) * 3),
        }))
      );
    }, 3000);

    return () => clearInterval(interval);
  }, [isRunning]);

  const colorFromThreatLevel = () => {
    if (threat_level < 30) return '#1EA896';
    if (threat_level < 60) return '#FFE66D';
    return '#FF6B6B';
  };

  const threatStatusLabel = () => {
    if (threat_level < 30) return 'Safe';
    if (threat_level < 60) return 'Warning';
    return 'Critical';
  };

  // Custom SVG gauge—Recharts Gauge was overkill and had formatting issues
  const GaugeChart = ({ value }: { value: number }) => {
    const pct = (value / 100) * 100;
    const color = colorFromThreatLevel();
    
    return (
      <div className="flex flex-col items-center">
        <div className="relative w-32 h-20 mb-4">
          <svg viewBox="0 0 100 50" className="w-full h-full">
            <path
              d="M 10 50 A 40 40 0 0 1 90 50"
              fill="none"
              stroke="#333"
              strokeWidth="4"
            />
            <path
              d="M 10 50 A 40 40 0 0 1 90 50"
              fill="none"
              stroke={color}
              strokeWidth="4"
              strokeDasharray={`${(pct / 100) * 150}, 150`}
              style={{
                filter: 'drop-shadow(0 0 4px ' + color + ')',
              }}
            />
            <text
              x="50"
              y="35"
              textAnchor="middle"
              fontSize="16"
              fill={color}
              fontWeight="bold"
            >
              {Math.round(value)}
            </text>
          </svg>
        </div>
        <div style={{ color }} className="font-semibold text-sm">
          {threatStatusLabel()}
        </div>
      </div>
    );
  };

  return (
    <div className="h-full flex flex-col gap-4 overflow-y-auto pb-4">
      {/* Threat Gauge */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="bg-gradient-to-br from-[#1B4965] to-[#0f0f23] border border-[#1EA896]/20 rounded-lg p-4 shadow-xl"
      >
        <h3 className="text-[#1EA896] font-semibold text-sm mb-3 flex items-center gap-2">
          <motion.span
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity }}
            className="inline-block"
          >
            ⚠️
          </motion.span>
          Threat Level
        </h3>
        <div className="flex items-center justify-center">
          <GaugeChart value={threat_level} />
        </div>
      </motion.div>

      {/* Attack Type Pie Chart */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="bg-gradient-to-br from-[#1B4965] to-[#0f0f23] border border-[#1EA896]/20 rounded-lg p-4 shadow-xl"
      >
        <h3 className="text-[#1EA896] font-semibold text-sm mb-3">Attack Distribution</h3>
        <ResponsiveContainer width="100%" height={180}>
          <PieChart>
            <Pie
              data={attackData}
              cx="50%"
              cy="50%"
              innerRadius={40}
              outerRadius={70}
              dataKey="value"
              animationDuration={300}
            >
              {attackData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip
              formatter={(value: any) => typeof value === 'number' ? value.toFixed(0) : value}
              contentStyle={{ background: '#1B4965', border: '1px solid #1EA896' }}
              labelStyle={{ color: '#1EA896' }}
            />
          </PieChart>
        </ResponsiveContainer>
        <div className="flex flex-wrap gap-3 mt-3 justify-center">
          {attackData.map((item) => (
            <motion.div
              key={item.name}
              whileHover={{ scale: 1.1 }}
              className="flex items-center gap-2 text-xs"
            >
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
              <span className="text-gray-300">{item.name}</span>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Timeline Graph */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="bg-gradient-to-br from-[#1B4965] to-[#0f0f23] border border-[#1EA896]/20 rounded-lg p-4 shadow-xl"
      >
        <h3 className="text-[#1EA896] font-semibold text-sm mb-3">Attacks Per Minute</h3>
        <ResponsiveContainer width="100%" height={150}>
          <LineChart data={timelineData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1EA896" opacity={0.1} />
            <XAxis dataKey="time" stroke="#666" style={{ fontSize: '11px' }} />
            <YAxis stroke="#666" style={{ fontSize: '11px' }} />
            <Tooltip
              contentStyle={{ background: '#1B4965', border: '1px solid #1EA896' }}
              labelStyle={{ color: '#1EA896' }}
            />
            <Line
              type="monotone"
              dataKey="attacks"
              stroke="#1EA896"
              dot={{ fill: '#1EA896', r: 4 }}
              activeDot={{ r: 6 }}
              isAnimationActive={isRunning}
              animationDuration={300}
            />
          </LineChart>
        </ResponsiveContainer>
      </motion.div>

      {/* Confidence Distribution */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="bg-gradient-to-br from-[#1B4965] to-[#0f0f23] border border-[#1EA896]/20 rounded-lg p-4 shadow-xl"
      >
        <h3 className="text-[#1EA896] font-semibold text-sm mb-3">AI Confidence Distribution</h3>
        <ResponsiveContainer width="100%" height={150}>
          <BarChart data={confidenceData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1EA896" opacity={0.1} />
            <XAxis dataKey="range" stroke="#666" style={{ fontSize: '10px' }} />
            <YAxis stroke="#666" style={{ fontSize: '11px' }} />
            <Tooltip
              contentStyle={{ background: '#1B4965', border: '1px solid #1EA896' }}
              labelStyle={{ color: '#1EA896' }}
            />
            <Bar dataKey="value" fill="#1EA896" radius={[4, 4, 0, 0]} animationDuration={300} />
          </BarChart>
        </ResponsiveContainer>
      </motion.div>
    </div>
  );
};

export default Charts;
