"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Exercise } from "@/types/grammar";

interface FillInExerciseProps {
  exercise: Exercise;
  onAnswer: (answer: string, isCorrect: boolean) => void;
  languageId?: string;
}

/**
 * For Japanese answers like "は (wa)" or "食べます (tabemasu)",
 * extract all acceptable forms: full string, Japanese only, romaji only.
 */
function getAcceptableAnswers(correctAnswer: string, languageId?: string): string[] {
  const answers = [correctAnswer.toLowerCase()];
  if (languageId !== "japanese") return answers;
  // Pattern: "Japanese (romaji)"
  const match = correctAnswer.match(/^(.+?)\s*[\(（](.+?)[\)）]$/);
  if (match) {
    answers.push(match[1].trim().toLowerCase());
    answers.push(match[2].trim().toLowerCase());
  }
  return answers;
}

export default function FillInExercise({ exercise, onAnswer, languageId }: FillInExerciseProps) {
  const [answer, setAnswer] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const correctAnswers = Array.isArray(exercise.correctAnswer)
    ? exercise.correctAnswer
    : [exercise.correctAnswer];

  const isCorrect = correctAnswers.some((correct) => {
    const acceptable = getAcceptableAnswers(correct, languageId);
    return acceptable.some((a) => answer.trim().toLowerCase() === a);
  });

  const handleSubmit = () => {
    if (!answer.trim() || submitted) return;
    setSubmitted(true);
    onAnswer(answer.trim(), isCorrect);
  };

  const parts = exercise.question.sentence.split("___");

  return (
    <div className="space-y-6">
      <p className="text-stone-600 text-sm">{exercise.question.nl}</p>

      <div className="bg-white rounded-2xl p-6 shadow-sm border border-stone-200">
        <p className="text-lg text-stone-800 leading-relaxed flex flex-wrap items-center gap-1">
          {parts.map((part, i) => (
            <span key={i}>
              {part}
              {i < parts.length - 1 && (
                <input
                  type="text"
                  value={answer}
                  onChange={(e) => !submitted && setAnswer(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
                  disabled={submitted}
                  className={`inline-block w-32 mx-1 px-3 py-1 rounded-lg border-2 text-center font-medium transition-colors outline-none ${
                    submitted
                      ? isCorrect
                        ? "border-emerald-400 bg-emerald-50 text-emerald-700"
                        : "border-rose-400 bg-rose-50 text-rose-700"
                      : "border-indigo-300 bg-indigo-50/50 text-stone-800 focus:border-indigo-500"
                  }`}
                  placeholder="..."
                  autoFocus
                />
              )}
            </span>
          ))}
        </p>
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
