"use client";

import { motion } from "framer-motion";

interface ConjugationDiagramProps {
  verb: string;
  stem: string;
  endings: Record<string, string>;
  highlighted?: string;
  iscVerb?: boolean;
  error?: { given: string; correct: string };
}

export default function ConjugationDiagram({ verb, stem, endings, highlighted, error }: ConjugationDiagramProps) {
  return (
    <div className="space-y-4">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-center"
      >
        <span className="text-lg font-bold text-stone-700">{verb}</span>
      </motion.div>

      <div className="flex justify-center gap-1">
        <motion.span
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          className="px-3 py-2 bg-indigo-100 text-indigo-700 font-bold rounded-l-xl text-lg"
        >
          {stem}
        </motion.span>
        <motion.span
          initial={{ opacity: 0, x: 10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.15 }}
          className="px-3 py-2 bg-rose-100 text-rose-700 font-bold rounded-r-xl text-lg"
        >
          {highlighted ? endings[highlighted] || "..." : "..."}
        </motion.span>
      </div>

      <div className="space-y-1.5">
        {Object.entries(endings).map(([label, ending], i) => (
          <motion.div
            key={label}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 + i * 0.08 }}
            className={`flex items-center justify-between p-2 rounded-lg text-sm ${
              label === highlighted ? "bg-indigo-50 border border-indigo-200" : "bg-stone-50"
            }`}
          >
            <span className="text-stone-500 font-medium">{label}</span>
            <span className={`font-bold ${label === highlighted ? "text-indigo-600" : "text-stone-700"}`}>
              {ending}
            </span>
          </motion.div>
        ))}
      </div>

      {error && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="flex items-center justify-center gap-3 p-3 bg-rose-50 rounded-xl border border-rose-200"
        >
          <span className="text-rose-500 line-through font-bold">{error.given}</span>
          <span className="text-stone-400">→</span>
          <span className="text-emerald-600 font-bold">{error.correct}</span>
        </motion.div>
      )}
    </div>
  );
}
