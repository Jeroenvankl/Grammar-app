"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle, XCircle, ChevronDown, Bot } from "lucide-react";
import { Exercise } from "@/types/grammar";
import ExplanationPanel from "@/components/diagrams/ExplanationPanel";
import { getAvailableProvider, sendChatMessage, getSystemPrompt } from "@/lib/ai";

interface FeedbackPanelProps {
  exercise: Exercise;
  isCorrect: boolean;
  userAnswer: string;
  onNext: () => void;
  languageId?: string;
}

export default function FeedbackPanel({
  exercise,
  isCorrect,
  userAnswer,
  onNext,
  languageId,
}: FeedbackPanelProps) {
  const [showDiagram, setShowDiagram] = useState(false);
  const [aiResponse, setAiResponse] = useState<string | null>(null);
  const [aiLoading, setAiLoading] = useState(false);
  const hasAI = getAvailableProvider() !== null;

  const askAI = async () => {
    if (aiLoading || aiResponse) return;
    setAiLoading(true);
    const correctAnswer = Array.isArray(exercise.correctAnswer)
      ? exercise.correctAnswer[0]
      : exercise.correctAnswer;
    const result = await sendChatMessage([
      { role: "system", content: getSystemPrompt(languageId) },
      {
        role: "user",
        content: `De leerling maakte een fout bij deze oefening:
Vraag: ${exercise.question.nl}
Zin: ${exercise.question.sentence}
Antwoord leerling: "${userAnswer}"
Correct antwoord: "${correctAnswer}"
Regel: ${exercise.explanation.rule}

Leg kort uit (max 3 zinnen) waarom het antwoord fout is en wat de regel is.`,
      },
    ]);
    setAiResponse(result.response);
    setAiLoading(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`rounded-2xl p-5 border-2 ${
        isCorrect
          ? "bg-emerald-50 border-emerald-200"
          : "bg-rose-50 border-rose-200"
      }`}
    >
      <div className="flex items-start gap-3 mb-3">
        {isCorrect ? (
          <CheckCircle className="w-6 h-6 text-emerald-500 flex-shrink-0 mt-0.5" />
        ) : (
          <XCircle className="w-6 h-6 text-rose-500 flex-shrink-0 mt-0.5" />
        )}
        <div className="flex-1">
          <h3
            className={`font-bold text-lg ${
              isCorrect ? "text-emerald-700" : "text-rose-700"
            }`}
          >
            {isCorrect ? "Goed gedaan!" : "Niet helemaal"}
          </h3>

          {/* Show correct answer when wrong */}
          {!isCorrect && (
            <div className="mt-2 bg-white/70 rounded-xl p-3 border border-rose-200">
              <div className="flex items-start gap-2 mb-1.5">
                <span className="text-xs font-semibold text-rose-500 uppercase tracking-wide">Jouw antwoord</span>
              </div>
              <p className="text-sm text-rose-600 line-through mb-2.5">{userAnswer || <span className="italic text-rose-400">— leeg —</span>}</p>

              <div className="flex items-start gap-2 mb-1.5">
                <span className="text-xs font-semibold text-emerald-600 uppercase tracking-wide">Correct antwoord</span>
              </div>
              <p className="text-base font-semibold text-emerald-700">
                {Array.isArray(exercise.correctAnswer)
                  ? exercise.correctAnswer[0]
                  : exercise.correctAnswer}
              </p>
              {Array.isArray(exercise.correctAnswer) && exercise.correctAnswer.length > 1 && (
                <p className="text-xs text-stone-500 mt-1">
                  Ook goed: {exercise.correctAnswer.slice(1).join(", ")}
                </p>
              )}
            </div>
          )}

          <p className="text-sm text-stone-600 mt-2">
            {exercise.explanation.nl}
          </p>
        </div>
      </div>

      {/* Show diagram button */}
      {!isCorrect && (
        <button
          onClick={() => setShowDiagram(!showDiagram)}
          className="flex items-center gap-2 text-sm font-medium text-indigo-600 hover:text-indigo-700 mb-3"
        >
          <ChevronDown
            className={`w-4 h-4 transition-transform ${
              showDiagram ? "rotate-180" : ""
            }`}
          />
          {showDiagram ? "Verberg uitleg" : "Waarom?"}
        </button>
      )}

      <AnimatePresence>
        {showDiagram && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <ExplanationPanel
              diagramType={exercise.explanation.diagramType}
              diagramData={exercise.explanation.diagramData}
              rule={exercise.explanation.rule}
            />

            {/* AI button */}
            {hasAI && !isCorrect && (
              <div className="mt-3">
                {!aiResponse ? (
                  <button
                    onClick={askAI}
                    disabled={aiLoading}
                    className="flex items-center gap-2 text-sm font-medium text-indigo-600 hover:text-indigo-700 disabled:opacity-50"
                  >
                    <Bot className="w-4 h-4" />
                    {aiLoading
                      ? "Even denken..."
                      : "Vraag het aan de AI-tutor"}
                  </button>
                ) : (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="bg-white rounded-xl p-3 border border-indigo-100 text-sm text-stone-700"
                  >
                    <div className="flex items-center gap-1.5 mb-1.5 text-indigo-600 font-medium text-xs">
                      <Bot className="w-3.5 h-3.5" />
                      SyntaxBot
                    </div>
                    {aiResponse}
                  </motion.div>
                )}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={onNext}
        className={`w-full mt-4 py-3 rounded-xl font-semibold text-white transition-colors ${
          isCorrect
            ? "bg-emerald-500 hover:bg-emerald-600"
            : "bg-indigo-600 hover:bg-indigo-700"
        }`}
      >
        Volgende
      </motion.button>
    </motion.div>
  );
}
