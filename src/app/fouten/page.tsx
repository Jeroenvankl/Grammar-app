"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AlertTriangle, ChevronDown, Trash2, RotateCcw, Filter } from "lucide-react";
import Link from "next/link";
import Layout from "@/components/ui/Layout";
import { useMistakes, MistakeRecord } from "@/hooks/useMistakes";

const languageNames: Record<string, { name: string; flag: string }> = {
  italian: { name: "Italiaans", flag: "🇮🇹" },
  japanese: { name: "Japans", flag: "🇯🇵" },
  spanish: { name: "Spaans", flag: "🌎" },
  french: { name: "Frans", flag: "🇫🇷" },
};

function MistakeCard({ mistake, index }: { mistake: MistakeRecord; index: number }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 5 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.03 }}
      className="bg-white rounded-xl border border-stone-200 overflow-hidden"
    >
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-start gap-3 p-4 text-left hover:bg-stone-50 transition-colors"
      >
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-medium text-stone-400 bg-stone-100 px-2 py-0.5 rounded-full">
              {mistake.topicName}
            </span>
            {mistake.count > 1 && (
              <span className="text-xs font-medium text-rose-500 bg-rose-50 px-2 py-0.5 rounded-full">
                {mistake.count}x fout
              </span>
            )}
          </div>
          <p className="text-sm font-medium text-stone-800">{mistake.question}</p>
          <p className="text-xs text-stone-500 mt-0.5 font-mono">{mistake.sentence}</p>
        </div>
        <ChevronDown
          className={`w-4 h-4 text-stone-400 flex-shrink-0 mt-1 transition-transform ${
            expanded ? "rotate-180" : ""
          }`}
        />
      </button>

      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-4 space-y-3 border-t border-stone-100 pt-3">
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-rose-50 rounded-lg p-2.5">
                  <p className="text-[10px] font-semibold text-rose-500 uppercase tracking-wide mb-0.5">Jouw antwoord</p>
                  <p className="text-sm text-rose-700 line-through">{mistake.userAnswer || "— leeg —"}</p>
                </div>
                <div className="bg-emerald-50 rounded-lg p-2.5">
                  <p className="text-[10px] font-semibold text-emerald-600 uppercase tracking-wide mb-0.5">Correct</p>
                  <p className="text-sm text-emerald-700 font-semibold">{mistake.correctAnswer}</p>
                  {mistake.alternativeAnswers && mistake.alternativeAnswers.length > 0 && (
                    <p className="text-[10px] text-stone-400 mt-0.5">
                      Ook goed: {mistake.alternativeAnswers.join(", ")}
                    </p>
                  )}
                </div>
              </div>
              <div className="bg-indigo-50 rounded-lg p-2.5">
                <p className="text-[10px] font-semibold text-indigo-600 uppercase tracking-wide mb-0.5">Regel</p>
                <p className="text-xs text-stone-600">{mistake.explanation}</p>
                <p className="text-[10px] text-indigo-500 mt-1 font-medium">{mistake.rule}</p>
              </div>
              <Link
                href={`/taal/${mistake.languageId}/${mistake.topicId}`}
                className="inline-flex items-center gap-1.5 text-xs font-medium text-indigo-600 hover:text-indigo-700"
              >
                <RotateCcw className="w-3 h-3" />
                Oefen dit topic opnieuw
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default function FoutenPage() {
  const { mistakes, isLoaded, clearAll } = useMistakes();
  const [selectedLanguage, setSelectedLanguage] = useState<string>("all");
  const [showConfirmClear, setShowConfirmClear] = useState(false);
  const [sortBy, setSortBy] = useState<"recent" | "frequency">("recent");

  const availableLanguages = useMemo(() => {
    const langs = new Set(mistakes.map((m) => m.languageId));
    return Array.from(langs);
  }, [mistakes]);

  const filteredMistakes = useMemo(() => {
    let filtered = selectedLanguage === "all"
      ? mistakes
      : mistakes.filter((m) => m.languageId === selectedLanguage);

    if (sortBy === "frequency") {
      filtered = [...filtered].sort((a, b) => b.count - a.count);
    } else {
      filtered = [...filtered].sort((a, b) => b.timestamp - a.timestamp);
    }

    return filtered;
  }, [mistakes, selectedLanguage, sortBy]);

  // Group by language for overview stats
  const stats = useMemo(() => {
    const byLang: Record<string, number> = {};
    for (const m of mistakes) {
      byLang[m.languageId] = (byLang[m.languageId] || 0) + 1;
    }
    return byLang;
  }, [mistakes]);

  if (!isLoaded) return <Layout><div className="animate-pulse p-8" /></Layout>;

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <div className="flex items-center gap-2 mb-1">
            <AlertTriangle className="w-6 h-6 text-rose-500" />
            <h1 className="text-2xl font-bold text-stone-800">Mijn Fouten</h1>
          </div>
          <p className="text-stone-500 text-sm">
            {mistakes.length === 0
              ? "Je hebt nog geen fouten gemaakt — ga oefenen!"
              : `${mistakes.length} fout${mistakes.length !== 1 ? "en" : ""} bijgehouden — leer van je fouten`}
          </p>
        </div>

        {mistakes.length > 0 && (
          <>
            {/* Stats overview */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {availableLanguages.map((langId) => {
                const lang = languageNames[langId] || { name: langId, flag: "🏳️" };
                return (
                  <button
                    key={langId}
                    onClick={() => setSelectedLanguage(selectedLanguage === langId ? "all" : langId)}
                    className={`rounded-xl p-3 border text-left transition-all ${
                      selectedLanguage === langId
                        ? "bg-indigo-50 border-indigo-200 shadow-sm"
                        : "bg-white border-stone-200 hover:border-stone-300"
                    }`}
                  >
                    <span className="text-lg">{lang.flag}</span>
                    <p className="text-xs font-medium text-stone-600 mt-1">{lang.name}</p>
                    <p className="text-lg font-bold text-stone-800">{stats[langId]}</p>
                  </button>
                );
              })}
            </div>

            {/* Filters */}
            <div className="flex items-center justify-between">
              <div className="flex gap-2">
                <button
                  onClick={() => setSelectedLanguage("all")}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                    selectedLanguage === "all" ? "bg-indigo-600 text-white" : "bg-stone-100 text-stone-600 hover:bg-stone-200"
                  }`}
                >
                  Alle ({mistakes.length})
                </button>
                <button
                  onClick={() => setSortBy(sortBy === "recent" ? "frequency" : "recent")}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-medium bg-stone-100 text-stone-600 hover:bg-stone-200 transition-colors"
                >
                  <Filter className="w-3 h-3" />
                  {sortBy === "recent" ? "Nieuwste eerst" : "Meest fout eerst"}
                </button>
              </div>
              <button
                onClick={() => setShowConfirmClear(!showConfirmClear)}
                className="text-xs text-stone-400 hover:text-rose-500 transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>

            {showConfirmClear && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                className="bg-rose-50 rounded-xl p-4 border border-rose-200"
              >
                <p className="text-sm text-rose-700 mb-2">Weet je zeker dat je alle fouten wilt wissen?</p>
                <div className="flex gap-2">
                  <button
                    onClick={() => { clearAll(); setShowConfirmClear(false); }}
                    className="px-4 py-2 bg-rose-600 text-white text-xs font-semibold rounded-lg hover:bg-rose-700"
                  >
                    Ja, wis alles
                  </button>
                  <button
                    onClick={() => setShowConfirmClear(false)}
                    className="px-4 py-2 bg-white text-stone-600 text-xs font-semibold rounded-lg border border-stone-200"
                  >
                    Annuleren
                  </button>
                </div>
              </motion.div>
            )}

            {/* Mistake cards */}
            <div className="space-y-2">
              {filteredMistakes.length === 0 ? (
                <div className="text-center py-8 text-stone-400">
                  <p>Geen fouten voor deze taal</p>
                </div>
              ) : (
                filteredMistakes.map((mistake, i) => (
                  <MistakeCard key={mistake.id} mistake={mistake} index={i} />
                ))
              )}
            </div>
          </>
        )}

        {mistakes.length === 0 && (
          <div className="text-center py-12 space-y-4">
            <div className="text-5xl">🎯</div>
            <p className="text-stone-500">Ga oefeningen maken om je fouten bij te houden</p>
            <Link
              href="/"
              className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white font-semibold rounded-xl hover:bg-indigo-700 transition-colors"
            >
              Start met oefenen
            </Link>
          </div>
        )}
      </div>
    </Layout>
  );
}
