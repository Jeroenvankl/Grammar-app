"use client";

import { motion } from "framer-motion";
import { Flame } from "lucide-react";

interface StreakCounterProps {
  streak: number;
  isActive?: boolean;
  size?: "sm" | "lg";
}

export default function StreakCounter({ streak, isActive, size = "lg" }: StreakCounterProps) {
  const active = isActive ?? streak > 0;

  if (size === "sm") {
    return (
      <div className={`flex items-center gap-1.5 ${active ? "text-orange-600" : "text-stone-400"}`}>
        <Flame className="w-4 h-4" />
        <span className="font-bold text-sm">{streak}</span>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className={`flex items-center gap-2 px-4 py-2 rounded-xl border ${
        active
          ? "bg-orange-50 border-orange-200 text-orange-700"
          : "bg-stone-50 border-stone-200 text-stone-400"
      }`}
    >
      <motion.div
        animate={active ? { scale: [1, 1.2, 1] } : {}}
        transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
      >
        <Flame className={`w-5 h-5 ${active ? "text-orange-500" : "text-stone-300"}`} />
      </motion.div>
      <span className="font-bold text-lg">{streak}</span>
      <span className="text-xs">{streak === 1 ? "dag" : "dagen"} streak</span>
    </motion.div>
  );
}
