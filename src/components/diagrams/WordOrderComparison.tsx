"use client";

import { motion } from "framer-motion";

const roleColors: Record<string, string> = {
  subject: "#4A90D9", verb: "#E85D75", object: "#4CAF50",
  adjective: "#9C27B0", preposition: "#FF9800", article: "#78909C",
  adverb: "#FFC107", particle: "#607D8B",
};

const roleLabelsNL: Record<string, string> = {
  subject: "Onderwerp", verb: "Werkwoord", object: "Voorwerp",
  adjective: "Bijv. nw.", preposition: "Voorzetsel", article: "Lidwoord",
  adverb: "Bijwoord", particle: "Partikel",
};

interface WordPart { word: string; role: string; }
interface LanguageSentence { sentence: string; parts: WordPart[]; order: string; }
interface WordOrderComparisonProps { dutch: LanguageSentence; japanese: LanguageSentence; }

export default function WordOrderComparison({ dutch, japanese }: WordOrderComparisonProps) {
  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="space-y-2">
        <div className="flex items-center gap-2">
          <span className="text-sm font-bold text-stone-600">Nederlands</span>
          <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-blue-100 text-blue-700">{dutch.order}</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {dutch.parts.map((part, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 + i * 0.1 }} className="flex flex-col items-center gap-1">
              <span className="px-3 py-2 rounded-lg text-white font-semibold text-sm shadow-sm" style={{ backgroundColor: roleColors[part.role] || "#607D8B" }}>{part.word}</span>
              <span className="text-[9px] text-stone-400 font-medium">{roleLabelsNL[part.role] || part.role}</span>
            </motion.div>
          ))}
        </div>
      </motion.div>

      <motion.div initial={{ opacity: 0, scaleY: 0 }} animate={{ opacity: 1, scaleY: 1 }} transition={{ delay: 0.4 }} className="flex flex-col items-center gap-1">
        <div className="w-0.5 h-4 bg-stone-300" />
        <motion.div animate={{ y: [0, 3, 0] }} transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }} className="flex items-center gap-2 px-3 py-1.5 bg-amber-50 border border-amber-200 rounded-full">
          <span className="text-xs font-bold text-amber-700">SVO → SOV</span>
        </motion.div>
        <div className="w-0.5 h-4 bg-stone-300" />
      </motion.div>

      <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.5 }} className="space-y-2">
        <div className="flex items-center gap-2">
          <span className="text-sm font-bold text-stone-600 font-[family-name:var(--font-noto-jp)]">日本語</span>
          <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-rose-100 text-rose-700">{japanese.order}</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {japanese.parts.map((part, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 + i * 0.1 }} className="flex flex-col items-center gap-1">
              <span className="px-3 py-2 rounded-lg text-white font-semibold text-sm shadow-sm font-[family-name:var(--font-noto-jp)]" style={{ backgroundColor: roleColors[part.role] || "#607D8B" }}>{part.word}</span>
              <span className="text-[9px] text-stone-400 font-medium">{roleLabelsNL[part.role] || part.role}</span>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
