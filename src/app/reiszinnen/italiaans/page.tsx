"use client";

import { useState, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Volume2, ChevronDown, Search, ArrowLeft } from "lucide-react";
import Link from "next/link";
import Layout from "@/components/ui/Layout";
import { italianTravelPhrases, ItalianPhraseCategory, ItalianTravelPhrase } from "@/data/phrases/italian-travel";

/** Pick the best available Italian female voice */
function getItalianVoice(): SpeechSynthesisVoice | null {
  const voices = speechSynthesis.getVoices();
  const itVoices = voices.filter(
    (v) => v.lang === "it-IT" || v.lang === "it_IT" || v.lang.startsWith("it")
  );
  const preferred = [
    "Google italiano", "Alice", "Federica", "Elsa",
    "Microsoft Elsa", "Microsoft Isabella", "Luca",
  ];
  for (const name of preferred) {
    const match = itVoices.find((v) => v.name.includes(name));
    if (match) return match;
  }
  const female = itVoices.find(
    (v) =>
      v.name.toLowerCase().includes("female") ||
      v.name.includes("Premium") ||
      v.name.includes("Enhanced") ||
      !v.name.toLowerCase().includes("male")
  );
  return female || itVoices[0] || null;
}

function PhraseCard({ phrase, index }: { phrase: ItalianTravelPhrase; index: number }) {
  const [expanded, setExpanded] = useState(false);
  const [speaking, setSpeaking] = useState(false);

  const speak = useCallback((text: string) => {
    if (!("speechSynthesis" in window)) return;
    speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "it-IT";
    utterance.rate = 0.85;
    utterance.pitch = 1.05;
    const voice = getItalianVoice();
    if (voice) utterance.voice = voice;
    utterance.onstart = () => setSpeaking(true);
    utterance.onend = () => setSpeaking(false);
    utterance.onerror = () => setSpeaking(false);
    speechSynthesis.speak(utterance);
  }, []);

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
          <p className="font-medium text-stone-800 text-sm">
            {phrase.italian}
          </p>
          <p className="text-xs text-stone-500 mt-0.5">{phrase.dutch}</p>
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
            <div className="px-4 pb-4 space-y-2 border-t border-stone-100 pt-3">
              <div className="flex items-center justify-between">
                {phrase.pronunciation ? (
                  <p className="text-sm text-emerald-600 font-mono">
                    {phrase.pronunciation}
                  </p>
                ) : (
                  <p className="text-xs text-stone-400 italic">Klik op 🔊 om te luisteren</p>
                )}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    speak(phrase.italian);
                  }}
                  className={`p-2 rounded-lg transition-colors ${
                    speaking
                      ? "bg-emerald-100 text-emerald-600 animate-pulse"
                      : "hover:bg-emerald-50 text-emerald-500"
                  }`}
                  title="Luister naar uitspraak"
                >
                  <Volume2 className="w-4 h-4" />
                </button>
              </div>
              {phrase.context && (
                <p className="text-xs text-stone-400 italic bg-stone-50 rounded-lg p-2">
                  {phrase.context}
                </p>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

function CategorySection({ category }: { category: ItalianPhraseCategory }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="space-y-2">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center gap-3 bg-white rounded-2xl p-4 border border-stone-200 shadow-sm hover:shadow-md hover:border-emerald-200 transition-all"
      >
        <span className="text-2xl">{category.icon}</span>
        <div className="flex-1 text-left">
          <h3 className="font-bold text-stone-800">{category.name}</h3>
          <p className="text-xs text-stone-500">{category.description}</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-stone-400 bg-stone-100 px-2 py-0.5 rounded-full">
            {category.phrases.length}
          </span>
          <ChevronDown
            className={`w-4 h-4 text-stone-400 transition-transform ${
              isOpen ? "rotate-180" : ""
            }`}
          />
        </div>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden space-y-1.5 pl-2"
          >
            {category.phrases.map((phrase, i) => (
              <PhraseCard key={phrase.id} phrase={phrase} index={i} />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function ReiszinnenItaliaansPage() {
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    speechSynthesis.getVoices();
    speechSynthesis.addEventListener("voiceschanged", () => {
      speechSynthesis.getVoices();
    });
  }, []);

  const totalPhrases = italianTravelPhrases.reduce(
    (sum, cat) => sum + cat.phrases.length, 0
  );

  const filteredCategories = searchQuery.trim()
    ? italianTravelPhrases
        .map((cat) => ({
          ...cat,
          phrases: cat.phrases.filter(
            (p) =>
              p.dutch.toLowerCase().includes(searchQuery.toLowerCase()) ||
              p.italian.toLowerCase().includes(searchQuery.toLowerCase()) ||
              (p.pronunciation && p.pronunciation.toLowerCase().includes(searchQuery.toLowerCase()))
          ),
        }))
        .filter((cat) => cat.phrases.length > 0)
    : italianTravelPhrases;

  return (
    <Layout>
      <div className="space-y-6">
        {/* Back + Header */}
        <div>
          <Link
            href="/reiszinnen"
            className="inline-flex items-center gap-1 text-sm text-indigo-600 hover:text-indigo-700 mb-3"
          >
            <ArrowLeft className="w-4 h-4" />
            Alle talen
          </Link>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-2xl">🇮🇹</span>
            <h1 className="text-2xl font-bold text-stone-800">
              Reiszinnen Italiaans
            </h1>
          </div>
          <p className="text-stone-500 text-sm">
            {totalPhrases} essentiële zinnen voor toeristen in Italië — met uitspraak
          </p>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Zoek een zin (NL of Italiaans)..."
            className="w-full pl-10 pr-4 py-3 rounded-xl border border-stone-200 bg-white text-sm outline-none focus:border-emerald-400 transition-colors"
          />
        </div>

        {/* Categories */}
        <div className="space-y-3">
          {filteredCategories.length === 0 ? (
            <div className="text-center py-12 text-stone-400">
              <p>Geen zinnen gevonden voor &quot;{searchQuery}&quot;</p>
            </div>
          ) : searchQuery.trim() ? (
            filteredCategories.map((cat) => (
              <div key={cat.id} className="space-y-2">
                <h3 className="text-sm font-bold text-stone-600">
                  {cat.icon} {cat.name}
                </h3>
                {cat.phrases.map((phrase, i) => (
                  <PhraseCard key={phrase.id} phrase={phrase} index={i} />
                ))}
              </div>
            ))
          ) : (
            filteredCategories.map((cat) => (
              <CategorySection key={cat.id} category={cat} />
            ))
          )}
        </div>
      </div>
    </Layout>
  );
}
