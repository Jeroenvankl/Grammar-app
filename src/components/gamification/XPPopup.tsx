"use client";

import { motion } from "framer-motion";
import { useEffect } from "react";

interface XPPopupProps {
  amount: number;
  onComplete: () => void;
}

export default function XPPopup({ amount, onComplete }: XPPopupProps) {
  useEffect(() => {
    const timer = setTimeout(onComplete, 2000);
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div className="fixed top-4 right-4 z-50">
      <motion.div
        initial={{ opacity: 0, y: -20, scale: 0.8 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -10, scale: 0.9 }}
        transition={{ type: "spring", stiffness: 400, damping: 25 }}
        className="flex items-center gap-2 px-4 py-2 bg-amber-50 border border-amber-200 rounded-xl shadow-lg"
      >
        <span className="text-amber-500 font-bold">+{amount} XP</span>
      </motion.div>
    </div>
  );
}
