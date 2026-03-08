"use client";

import { useState, useCallback } from "react";
import { motion } from "framer-motion";
import { Exercise } from "@/types/grammar";

interface WordOrderExerciseProps {
  exercise: Exercise;
  onAnswer: (answer: string, isCorrect: boolean) => void;
}

export default function WordOrderExercise({
  exercise,
  onAnswer,
}: WordOrderExerciseProps) {
  const distractors = exercise.distractors || [];
  const correctAnswer = Array.isArray(exercise.correctAnswer)
    ? exercise.correctAnswer[0]
    : exercise.correctAnswer;
  const allWords = [...correctAnswer.split(/\s+/), ...distractors].sort(
    () => Math.random() - 0.5
  );

  const [available, setAvailable] = useState<string[]>(allWords);
  const [placed, setPlaced] = useState<string[]>([]);
  const [submitted, setSubmitted] = useState(false);

  const correctAnswers = Array.isArray(exercise.correctAnswer)
    ? exercise.correctAnswer
    : [exercise.correctAnswer];

  const userAnswer = placed.join(" ");
  const isCorrect = correctAnswers.some(
    (c) => userAnswer.toLowerCase() === c.toLowerCase()
  );

  const addWord = useCallback(
    (word: string, idx: number) => {
      if (submitted) return;
      setPlaced((prev) => [...prev, word]);
      setAvailable((prev) => prev.filter((_, i) => i !== idx));
    },
    [submitted]
  );

  const removeWord = useCallback(
    (idx: number) => {
      if (submitted) return;
      const word = placed[idx];
      setPlaced((prev) => prev.filter((_, i) => i !== idx));
      setAvailable((prev) => [...prev, word]);
    },
    [submitted, placed]
  );

  const handleSubmit = () => {
    if (placed.length === 0 || submitted) return;
    setSubmitted(true);
    onAnswer(userAnswer, isCorrect);
  };

  return (
    <div className="space-y-6">
      <p className="text-stone-600 text-sm">{exercise.question.nl}</p>

      {exercise.question.context && (
        <p className="text-sm text-stone-400 italic">{exercise.question.context}</p>
      )}

      {/* Drop zone */}
      <div className="bg-white rounded-2xl p-4 shadow-sm border-2 border-dashed border-stone-300 min-h-[60px]">
        <div className="flex flex-wrap gap-2">
          {placed.length === 0 && (
            <span className="text-stone-400 text-sm">
              Klik op woorden om ze hier te plaatsen...
            </span>
          )}
          {placed.map((word, i) => (
            <motion.button
              key={`placed-${i}`}
              layout
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              whileHover={!submitted ? { scale: 1.05 } : {}}
              onClick={() => removeWord(i)}
              disabled={submitted}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                submitted
                  ? isCorrect
                    ? "bg-emerald-100 text-emerald-700"
                    : "bg-rose-100 text-rose-700"
                  : "bg-indigo-100 text-indigo-700 cursor-pointer"
              }`}
            >
              {word}
            </motion.button>
          ))}
        </div>
      </div>

      {submitted && !isCorrect && (
        <p className="text-sm text-rose-600">
          Correct: <strong>{correctAnswers[0]}</strong>
        </p>
      )}

      {/* Available words */}
      <div className="flex flex-wrap gap-2">
        {available.map((word, i) => (
          <motion.button
            key={`avail-${i}`}
            layout
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => addWord(word, i)}
            disabled={submitted}
            className="px-3 py-1.5 rounded-lg text-sm font-medium bg-stone-100 text-stone-700 hover:bg-stone-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {word}
          </motion.button>
        ))}
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
          disabled={placed.length === 0}
          className="w-full py-3 rounded-xl font-semibold text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        >
          Controleer
        </motion.button>
      )}
    </div>
  );
}
