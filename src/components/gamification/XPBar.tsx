"use client";

import { motion, useSpring, useTransform } from "framer-motion";
import { getLevelProgress } from "@/lib/gamification";

interface XPBarProps {
  currentXP?: number;
  totalXP?: number;
  level: number;
  compact?: boolean;
}

export default function XPBar({ currentXP, totalXP, level, compact }: XPBarProps) {
  const xp = currentXP ?? totalXP ?? 0;
  const { current, needed, percentage } = getLevelProgress(xp);
  const springValue = useSpring(0, { stiffness: 100, damping: 30 });
  const displayXP = useTransform(springValue, (v) => Math.round(v));

  springValue.set(current);

  if (compact) {
    return (
      <div className="space-y-1">
        <div className="flex items-center justify-between text-xs">
          <span className="font-medium text-stone-600">Lv {level}</span>
          <span className="text-stone-400">
            <motion.span className="font-mono text-amber-600">{displayXP}</motion.span>
            /{needed} XP
          </span>
        </div>
        <div className="h-1.5 bg-stone-100 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${percentage}%` }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="h-full rounded-full bg-gradient-to-r from-amber-400 to-yellow-400"
          />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <motion.div
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            className="flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-br from-amber-400 to-amber-500 shadow-lg shadow-amber-200"
          >
            <span className="text-white font-bold text-sm">{level}</span>
          </motion.div>
          <span className="text-sm font-semibold text-stone-700">Level {level}</span>
        </div>
        <div className="flex items-center gap-1 text-xs text-stone-400">
          <motion.span className="font-mono font-bold text-amber-600">{displayXP}</motion.span>
          <span>/</span>
          <span>{needed} XP</span>
        </div>
      </div>
      <div className="h-3 bg-stone-100 rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="h-full rounded-full bg-gradient-to-r from-amber-400 via-amber-500 to-yellow-400"
        />
      </div>
    </div>
  );
}
