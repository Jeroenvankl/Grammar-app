"use client";

import { motion } from "framer-motion";
import { WordBreakdown } from "@/types/grammar";

const roleColors: Record<string, string> = {
  subject: "#4A90D9", verb: "#E85D75", object: "#4CAF50",
  adjective: "#9C27B0", preposition: "#FF9800", article: "#78909C",
  adverb: "#FFC107", particle: "#607D8B",
};

const roleLabels: Record<string, string> = {
  subject: "Onderwerp", verb: "Werkwoord", object: "Voorwerp",
  adjective: "Bijv.nw.", preposition: "Voorzetsel", article: "Lidwoord",
  adverb: "Bijwoord", particle: "Partikel",
};

interface SentenceDiagramProps {
  words: WordBreakdown[];
}

export default function SentenceDiagram({ words }: SentenceDiagramProps) {
  return (
    <div className="flex flex-wrap gap-3 justify-center py-4">
      {words.map((word, i) => {
        const color = roleColors[word.role] || "#607D8B";
        return (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1, type: "spring" as const, stiffness: 400, damping: 25 }}
            className="flex flex-col items-center gap-1.5"
          >
            <motion.div
              whileHover={{ scale: 1.05, y: -2 }}
              className="px-4 py-2 rounded-xl text-white font-semibold text-sm shadow-md"
              style={{ backgroundColor: color }}
            >
              {word.word}
            </motion.div>
            <span className="text-[10px] font-medium text-stone-400">
              {roleLabels[word.role] || word.role}
            </span>
            {word.annotation && (
              <span className="text-[9px] text-stone-400 italic">{word.annotation}</span>
            )}
          </motion.div>
        );
      })}
    </div>
  );
}
