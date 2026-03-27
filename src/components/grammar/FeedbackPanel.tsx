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
  topicName?: string;
}

export default function FeedbackPanel({
  exercise,
  isCorrect,
  userAnswer,
  onNext,
  languageId,
  topicName,
}: FeedbackPanelProps) {
  const [showDiagram, setShowDiagram] = useState(false);
  const [aiResponse, setAiResponse] = useState<string | null>(null);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiFollowUp, setAiFollowUp] = useState("");
  const [aiFollowUpResponse, setAiFollowUpResponse] = useState<string | null>(null);
  const [aiFollowUpLoading, setAiFollowUpLoading] = useState(false);
  const hasAI = getAvailableProvider() !== null;

  const correctAnswer = Array.isArray(exercise.correctAnswer)
    ? exercise.correctAnswer[0]
    : exercise.correctAnswer;

  const buildContext = () => {
    const langName = languageId === "italian" ? "Italiaans"
      : languageId === "japanese" ? "Japans"
      : languageId === "spanish" ? "Spaans"
      : languageId === "french" ? "Frans"
      : "de taal";
    return `Taal: ${langName}${topicName ? ` | Onderwerp: ${topicName}` : ""}
Oefening type: ${exercise.type}
Vraag: ${exercise.question.nl}
Zin: ${exercise.question.sentence}${exercise.question.context ? `\nContext: ${exercise.question.context}` : ""}
Antwoord leerling: "${userAnswer}"
Correct antwoord: "${correctAnswer}"${Array.isArray(exercise.correctAnswer) && exercise.correctAnswer.length > 1 ? `\nAlternatieve antwoorden: ${exercise.correctAnswer.slice(1).join(", ")}` : ""}
Grammaticaregel: ${exercise.explanation.rule}
Uitleg: ${exercise.explanation.nl}`;
  };

  const askAI = async () => {
    if (aiLoading || aiResponse) return;
    setAiLoading(true);
    const result = await sendChatMessage([
      { role: "system", content: getSystemPrompt(languageId) },
      {
        role: "user",
        content: `${buildContext()}

Leg persoonlijk en kort uit (max 4 zinnen) waarom "${userAnswer}" fout is en "${correctAnswer}" correct. Focus op het specifieke verschil tussen wat de leerling schreef en het juiste antwoord. Geef een ezelsbruggetje of tip om het te onthouden.`,
      },
    ]);
    setAiResponse(result.response);
    setAiLoading(false);
  };

  const askFollowUp = async () => {
    if (aiFollowUpLoading || !aiFollowUp.trim() || !aiResponse) return;
    setAiFollowUpLoading(true);
    const result = await sendChatMessage([
      { role: "system", content: getSystemPrompt(languageId) },
      {
        role: "user",
        content: `${buildContext()}

Eerdere uitleg van SyntaxBot: "${aiResponse}"

Vervolgvraag van de leerling: "${aiFollowUp}"

Beantwoord de vervolgvraag kort en duidelijk (max 3 zinnen). Gebruik voorbeelden in de doeltaal als dat helpt.`,
      },
    ]);
    setAiFollowUpResponse(result.response);
    setAiFollowUpLoading(false);
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
                {correctAnswer}
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

      {/* Action buttons row — AI and diagram always visible when wrong */}
      {!isCorrect && (
        <div className="flex gap-2 mb-3">
          {hasAI && (
            <button
              onClick={askAI}
              disabled={aiLoading || !!aiResponse}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
                aiResponse
                  ? "bg-indigo-100 text-indigo-600 cursor-default"
                  : aiLoading
                  ? "bg-indigo-50 text-indigo-400 animate-pulse"
                  : "bg-indigo-600 text-white hover:bg-indigo-700 shadow-sm hover:shadow-md"
              }`}
            >
              <Bot className="w-4 h-4" />
              {aiLoading ? "Denkt na..." : aiResponse ? "Uitleg ontvangen" : "Leg uit met AI"}
            </button>
          )}
          <button
            onClick={() => setShowDiagram(!showDiagram)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium bg-white text-stone-600 border border-stone-200 hover:bg-stone-50 transition-colors"
          >
            <ChevronDown
              className={`w-4 h-4 transition-transform ${showDiagram ? "rotate-180" : ""}`}
            />
            {showDiagram ? "Verberg diagram" : "Toon diagram"}
          </button>
        </div>
      )}

      {/* AI Response — shown prominently */}
      <AnimatePresence>
        {aiResponse && (
          <motion.div
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-3 bg-white rounded-xl p-4 border border-indigo-200 shadow-sm"
          >
            <div className="flex items-center gap-1.5 mb-2">
              <div className="p-1 bg-indigo-100 rounded-md">
                <Bot className="w-3.5 h-3.5 text-indigo-600" />
              </div>
              <span className="text-xs font-semibold text-indigo-600">SyntaxBot</span>
            </div>
            <p className="text-sm text-stone-700 leading-relaxed whitespace-pre-line">{aiResponse}</p>

            {/* Follow-up response */}
            {aiFollowUpResponse && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="mt-3 pt-3 border-t border-indigo-100"
              >
                <p className="text-sm text-stone-700 leading-relaxed whitespace-pre-line">{aiFollowUpResponse}</p>
              </motion.div>
            )}

            {/* Follow-up input */}
            {!aiFollowUpResponse && (
              <div className="mt-3 flex gap-2">
                <input
                  type="text"
                  value={aiFollowUp}
                  onChange={(e) => setAiFollowUp(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && askFollowUp()}
                  placeholder="Stel een vervolgvraag..."
                  className="flex-1 text-xs px-3 py-2 rounded-lg border border-stone-200 bg-stone-50 outline-none focus:border-indigo-300 transition-colors"
                />
                <button
                  onClick={askFollowUp}
                  disabled={aiFollowUpLoading || !aiFollowUp.trim()}
                  className="px-3 py-2 rounded-lg text-xs font-medium bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-40 transition-colors"
                >
                  {aiFollowUpLoading ? "..." : "Vraag"}
                </button>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Diagram */}
      <AnimatePresence>
        {showDiagram && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden mb-3"
          >
            <ExplanationPanel
              diagramType={exercise.explanation.diagramType}
              diagramData={exercise.explanation.diagramData}
              rule={exercise.explanation.rule}
            />
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={onNext}
        className={`w-full py-3 rounded-xl font-semibold text-white transition-colors ${
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
