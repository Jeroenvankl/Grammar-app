"use client";

import { motion } from "framer-motion";

interface ComparisonDiagramProps {
  wrongSentence: string;
  correctSentence: string;
  errorWord: string;
  correctWord: string;
}

export default function ComparisonDiagram({ wrongSentence, correctSentence, errorWord, correctWord }: ComparisonDiagramProps) {
  return (
    <div className="space-y-4">
      <motion.div
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        className="p-3 bg-rose-50 rounded-xl border border-rose-200"
      >
        <div className="flex items-center gap-2 mb-1">
          <span className="text-xs font-bold text-rose-500 uppercase">Fout</span>
        </div>
        <p className="text-rose-700">
          {wrongSentence.split(errorWord).map((part, i, arr) => (
            <span key={i}>
              {part}
              {i < arr.length - 1 && (
                <span className="font-bold line-through bg-rose-100 px-1 rounded">{errorWord}</span>
              )}
            </span>
          ))}
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="flex justify-center"
      >
        <svg width="24" height="24" viewBox="0 0 24 24" className="text-stone-300">
          <path d="M12 4 L12 20 M6 14 L12 20 L18 14" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" />
        </svg>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, x: 10 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.3 }}
        className="p-3 bg-emerald-50 rounded-xl border border-emerald-200"
      >
        <div className="flex items-center gap-2 mb-1">
          <span className="text-xs font-bold text-emerald-500 uppercase">Correct</span>
        </div>
        <p className="text-emerald-700">
          {correctSentence.split(correctWord).map((part, i, arr) => (
            <span key={i}>
              {part}
              {i < arr.length - 1 && (
                <span className="font-bold bg-emerald-100 px-1 rounded">{correctWord}</span>
              )}
            </span>
          ))}
        </p>
      </motion.div>
    </div>
  );
}
