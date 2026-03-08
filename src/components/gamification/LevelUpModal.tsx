"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Trophy } from "lucide-react";

interface LevelUpModalProps {
  oldLevel: number;
  newLevel: number;
  onDismiss: () => void;
}

export default function LevelUpModal({ oldLevel, newLevel, onDismiss }: LevelUpModalProps) {
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 backdrop-blur-sm"
        onClick={onDismiss}
      >
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.5, opacity: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
          className="bg-white rounded-3xl p-8 shadow-2xl max-w-sm mx-4 text-center relative overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Confetti */}
          {Array.from({ length: 20 }).map((_, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 1, y: 0, x: 0 }}
              animate={{
                opacity: 0,
                y: [0, -100 - Math.random() * 100],
                x: [(Math.random() - 0.5) * 200],
              }}
              transition={{ duration: 1.5, delay: Math.random() * 0.3 }}
              className="absolute w-2 h-2 rounded-full"
              style={{
                backgroundColor: ["#f59e0b", "#6366f1", "#10b981", "#f43f5e"][i % 4],
                left: "50%",
                top: "40%",
              }}
            />
          ))}

          <motion.div
            animate={{ rotate: [0, -10, 10, 0] }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-amber-400 to-amber-500 shadow-lg shadow-amber-200 mb-4"
          >
            <Trophy className="w-10 h-10 text-white" />
          </motion.div>

          <h2 className="text-2xl font-bold text-stone-800 mb-1">Level Up!</h2>
          <p className="text-stone-500 mb-4">
            Level {oldLevel} → Level {newLevel}
          </p>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onDismiss}
            className="px-8 py-3 bg-indigo-600 text-white font-semibold rounded-xl hover:bg-indigo-700 transition-colors"
          >
            Geweldig!
          </motion.button>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
