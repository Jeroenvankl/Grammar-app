"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Exercise } from "@/types/grammar";

interface TranslationExerciseProps {
  exercise: Exercise;
  onAnswer: (answer: string, isCorrect: boolean) => void;
}

function fuzzyMatch(input: string, correct: string): boolean {
  const normalize = (s: string) =>
    s.toLowerCase().trim().replace(/[''`]/g, "'").replace(/\s+/g, " ");
  const a = normalize(input);
  const b = normalize(correct);
  if (a === b) return true;
  // Allow minor typos: 1 char difference for short strings, 2 for longer
  const maxDist = b.length <= 6 ? 1 : 2;
  if (Math.abs(a.length - b.length) > maxDist) return false;
  let dist = 0;
  let i = 0, j = 0;
  while (i < a.length && j < b.length) {
    if (a[i] !== b[j]) {
      dist++;
      if (dist > maxDist) return false;
      if (a.length > b.length) i++;
      else if (b.length > a.length) j++;
      else { i++; j++; }
    } else {
      i++; j++;
    }
  }
  return dist + (a.length - i) + (b.length - j) <= maxDist;
}

export default function TranslationExercise({ exercise, onAnswer }: TranslationExerciseProps) {
  const [answer, setAnswer] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const correctAnswers = Array.isArray(exercise.correctAnswer)
    ? exercise.correctAnswer
    : [exercise.correctAnswer];

  const isCorrect = correctAnswers.some((correct) => fuzzyMatch(answer, correct));

  const handleSubmit = () => {
    if (!answer.trim() || submitted) return;
    setSubmitted(true);
    onAnswer(answer.trim(), isCorrect);
  };

  return (
    <div className="space-y-6">
      <p className="text-stone-600 text-sm">{exercise.question.nl}</p>

      <div className="bg-white rounded-2xl p-6 shadow-sm border border-stone-200">
        <p className="text-lg text-stone-800 font-medium mb-4">
          {exercise.question.sentence}
        </p>

        <textarea
          value={answer}
          onChange={(e) => !submitted && setAnswer(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              handleSubmit();
            }
          }}
          disabled={submitted}
          className={`w-full p-3 rounded-xl border-2 resize-none h-20 outline-none transition-colors ${
            submitted
              ? isCorrect
                ? "border-emerald-400 bg-emerald-50"
                : "border-rose-400 bg-rose-50"
              : "border-stone-200 focus:border-indigo-400"
          }`}
          placeholder="Typ je vertaling hier..."
          autoFocus
        />

        {submitted && !isCorrect && (
          <p className="mt-2 text-sm text-rose-600">
            Correct antwoord: <strong>{correctAnswers[0]}</strong>
          </p>
        )}
      </div>

      {exercise.hints.length > 0 && !submitted && (
        <p className="text-xs text-stone-400 italic">
          Hint: {exercise.hints[0]}
        </p>
      )}

      {!submitted && (
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleSubmit}
          disabled={!answer.trim()}
          className="w-full py-3 rounded-xl font-semibold text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        >
          Controleer
        </motion.button>
      )}
    </div>
  );
}
