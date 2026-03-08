"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Exercise } from "@/types/grammar";

interface ErrorDetectionExerciseProps {
  exercise: Exercise;
  onAnswer: (answer: string, isCorrect: boolean) => void;
}

export default function ErrorDetectionExercise({
  exercise,
  onAnswer,
}: ErrorDetectionExerciseProps) {
  const [selected, setSelected] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const words = exercise.question.sentence.split(/\s+/);
  const correctAnswers = Array.isArray(exercise.correctAnswer)
    ? exercise.correctAnswer
    : [exercise.correctAnswer];

  const isCorrect = selected
    ? correctAnswers.some(
        (c) => c.toLowerCase() === selected.toLowerCase()
      )
    : false;

  const handleSubmit = () => {
    if (!selected || submitted) return;
    setSubmitted(true);
    onAnswer(selected, isCorrect);
  };

  return (
    <div className="space-y-6">
      <p className="text-stone-600 text-sm">{exercise.question.nl}</p>

      <div className="bg-white rounded-2xl p-6 shadow-sm border border-stone-200">
        <p className="text-sm text-stone-500 mb-3">
          Klik op het woord dat fout is:
        </p>
        <div className="flex flex-wrap gap-2">
          {words.map((word, i) => {
            const isSelected = selected === word;
            const isCorrectWord = correctAnswers.some(
              (c) => c.toLowerCase() === word.toLowerCase()
            );
            let style = "bg-stone-100 text-stone-700 hover:bg-indigo-100 hover:text-indigo-700";
            if (submitted && isCorrectWord) {
              style = "bg-emerald-100 text-emerald-700 ring-2 ring-emerald-400";
            } else if (submitted && isSelected && !isCorrect) {
              style = "bg-rose-100 text-rose-700 ring-2 ring-rose-400";
            } else if (isSelected) {
              style = "bg-indigo-100 text-indigo-700 ring-2 ring-indigo-400";
            }
            return (
              <motion.button
                key={i}
                whileHover={!submitted ? { scale: 1.05 } : {}}
                whileTap={!submitted ? { scale: 0.95 } : {}}
                onClick={() => !submitted && setSelected(word)}
                disabled={submitted}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all cursor-pointer ${style}`}
              >
                {word}
              </motion.button>
            );
          })}
        </div>
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
          disabled={!selected}
          className="w-full py-3 rounded-xl font-semibold text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        >
          Controleer
        </motion.button>
      )}
    </div>
  );
}
