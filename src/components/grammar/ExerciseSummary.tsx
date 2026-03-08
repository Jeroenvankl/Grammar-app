"use client";

import { motion } from "framer-motion";
import { Trophy, Star, ArrowRight, RotateCcw } from "lucide-react";
import Link from "next/link";

interface ExerciseSummaryProps {
  correct: number;
  total: number;
  xpEarned: number;
  languageId: string;
}

export default function ExerciseSummary({
  correct,
  total,
  xpEarned,
  languageId,
}: ExerciseSummaryProps) {
  const percentage = Math.round((correct / total) * 100);
  const isPerfect = correct === total;
  const isGood = percentage >= 70;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="text-center space-y-6"
    >
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.2, type: "spring", stiffness: 300 }}
      >
        {isPerfect ? (
          <Trophy className="w-20 h-20 mx-auto text-amber-500" />
        ) : isGood ? (
          <Star className="w-20 h-20 mx-auto text-indigo-500" />
        ) : (
          <RotateCcw className="w-20 h-20 mx-auto text-stone-400" />
        )}
      </motion.div>

      <div>
        <h2 className="text-2xl font-bold text-stone-800">
          {isPerfect
            ? "Perfect!"
            : isGood
            ? "Goed gedaan!"
            : "Blijf oefenen!"}
        </h2>
        <p className="text-stone-500 mt-1">
          {correct} van {total} correct ({percentage}%)
        </p>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="inline-flex items-center gap-2 bg-amber-50 text-amber-700 px-4 py-2 rounded-full font-semibold"
      >
        +{xpEarned} XP verdiend
      </motion.div>

      <div className="flex flex-col gap-3 pt-4">
        <Link
          href={`/taal/${languageId}`}
          className="flex items-center justify-center gap-2 w-full py-3 rounded-xl font-semibold text-white bg-indigo-600 hover:bg-indigo-700 transition-colors"
        >
          Terug naar overzicht
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </motion.div>
  );
}
