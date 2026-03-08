"use client";

import { motion } from "framer-motion";
import { WordBreakdown } from "@/types/grammar";

const roleColors: Record<string, string> = {
  subject: "#4A90D9", verb: "#E85D75", object: "#4CAF50",
  adjective: "#9C27B0", preposition: "#FF9800", article: "#78909C",
  adverb: "#FFC107", particle: "#607D8B",
};

interface SyntaxTreeProps {
  words: WordBreakdown[];
}

export default function SyntaxTree({ words }: SyntaxTreeProps) {
  const groups = words.reduce<Record<string, WordBreakdown[]>>((acc, w) => {
    if (!acc[w.role]) acc[w.role] = [];
    acc[w.role].push(w);
    return acc;
  }, {});

  const groupEntries = Object.entries(groups);
  const width = Math.max(groupEntries.length * 120, 300);
  const height = 140;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="overflow-x-auto">
      <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} className="mx-auto">
        <motion.text
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          x={width / 2} y={20} textAnchor="middle" className="text-xs font-bold fill-stone-600"
        >
          Zin
        </motion.text>

        {groupEntries.map(([role, roleWords], gi) => {
          const gx = ((gi + 0.5) / groupEntries.length) * width;
          const color = roleColors[role] || "#607D8B";
          return (
            <g key={role}>
              <motion.line
                initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
                transition={{ delay: 0.3 + gi * 0.1, duration: 0.3 }}
                x1={width / 2} y1={25} x2={gx} y2={55}
                stroke={color} strokeWidth={2} strokeLinecap="round"
              />
              <motion.text
                initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                transition={{ delay: 0.5 + gi * 0.1 }}
                x={gx} y={70} textAnchor="middle"
                className="text-[10px] font-bold" fill={color}
              >
                {role}
              </motion.text>
              {roleWords.map((w, wi) => (
                <g key={wi}>
                  <motion.line
                    initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
                    transition={{ delay: 0.6 + gi * 0.1 + wi * 0.05, duration: 0.2 }}
                    x1={gx} y1={75} x2={gx + (wi - (roleWords.length - 1) / 2) * 50} y2={100}
                    stroke={color} strokeWidth={1.5} strokeLinecap="round"
                  />
                  <motion.rect
                    initial={{ scale: 0 }} animate={{ scale: 1 }}
                    transition={{ delay: 0.7 + gi * 0.1 + wi * 0.05 }}
                    x={gx + (wi - (roleWords.length - 1) / 2) * 50 - 25} y={105}
                    width={50} height={24} rx={6} fill={color} opacity={0.15}
                  />
                  <motion.text
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                    transition={{ delay: 0.8 + gi * 0.1 + wi * 0.05 }}
                    x={gx + (wi - (roleWords.length - 1) / 2) * 50} y={121}
                    textAnchor="middle" className="text-[11px] font-semibold" fill={color}
                  >
                    {w.word}
                  </motion.text>
                </g>
              ))}
            </g>
          );
        })}
      </svg>
    </motion.div>
  );
}
