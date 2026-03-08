"use client";

import { motion } from "framer-motion";

interface ParticleInfo {
  particle: string;
  word: string;
  function: string;
  color: string;
}

interface ParticleDiagramProps {
  sentence: string;
  particles: ParticleInfo[];
  highlighted?: string;
  error?: { given: string; correct: string };
}

export default function ParticleDiagram({ sentence, particles, highlighted, error }: ParticleDiagramProps) {
  return (
    <div className="space-y-5">
      <motion.div initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} className="text-center font-[family-name:var(--font-noto-jp)]">
        <p className="text-lg text-stone-700 font-medium">{sentence}</p>
      </motion.div>

      <div className="flex flex-wrap justify-center gap-3">
        {particles.map((p, i) => {
          const isHL = highlighted && p.particle === highlighted;
          return (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 + i * 0.15, type: "spring" as const, stiffness: 400, damping: 25 }}
              className={`flex flex-col items-center gap-1.5 p-3 rounded-xl border-2 transition-all ${
                isHL ? "border-indigo-400 bg-indigo-50 shadow-md shadow-indigo-100" : "border-stone-200 bg-white"
              }`}
            >
              <span className="text-sm text-stone-500 font-[family-name:var(--font-noto-jp)]">{p.word}</span>
              <motion.div initial={{ scaleY: 0 }} animate={{ scaleY: 1 }} transition={{ delay: 0.3 + i * 0.15 }} className="w-0.5 h-4" style={{ backgroundColor: p.color }} />
              <motion.span
                initial={{ scale: 0 }} animate={{ scale: 1 }}
                transition={{ delay: 0.4 + i * 0.15, type: "spring" as const, stiffness: 500, damping: 20 }}
                className="inline-flex items-center justify-center w-10 h-10 rounded-full text-white font-bold text-lg font-[family-name:var(--font-noto-jp)]"
                style={{ backgroundColor: p.color }}
              >
                {p.particle}
              </motion.span>
              <span className="text-[10px] text-stone-400 font-medium text-center max-w-[80px] leading-tight">{p.function}</span>
            </motion.div>
          );
        })}
      </div>

      {error && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }} className="flex items-center justify-center gap-3 p-3 bg-rose-50 rounded-xl border border-rose-200">
          <span className="text-rose-500 line-through font-bold font-[family-name:var(--font-noto-jp)]">{error.given}</span>
          <span className="text-stone-400">→</span>
          <span className="text-emerald-600 font-bold font-[family-name:var(--font-noto-jp)]">{error.correct}</span>
        </motion.div>
      )}
    </div>
  );
}
