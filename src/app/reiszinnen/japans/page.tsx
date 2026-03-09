"use client";

import { useState, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Volume2, ChevronDown, Search, ArrowLeft, BookOpen } from "lucide-react";
import Link from "next/link";
import Layout from "@/components/ui/Layout";
import { japaneseTravelPhrases, PhraseCategory, TravelPhrase } from "@/data/phrases/japanese-travel";

/** Pick the best available Japanese female voice */
function getJapaneseVoice(): SpeechSynthesisVoice | null {
  const voices = speechSynthesis.getVoices();
  const jaVoices = voices.filter(
    (v) => v.lang === "ja-JP" || v.lang === "ja_JP" || v.lang.startsWith("ja")
  );
  const preferred = [
    "Google 日本語", "O-Ren", "Kyoko", "Haruka", "Nanami",
    "Microsoft Nanami", "Microsoft Haruka", "Sayaka",
  ];
  for (const name of preferred) {
    const match = jaVoices.find((v) => v.name.includes(name));
    if (match) return match;
  }
  const female = jaVoices.find(
    (v) =>
      v.name.toLowerCase().includes("female") ||
      v.name.includes("Premium") ||
      v.name.includes("Enhanced") ||
      !v.name.toLowerCase().includes("male")
  );
  return female || jaVoices[0] || null;
}

function PhraseCard({ phrase, index }: { phrase: TravelPhrase; index: number }) {
  const [expanded, setExpanded] = useState(false);
  const [speaking, setSpeaking] = useState(false);

  const speak = useCallback((text: string) => {
    if (!("speechSynthesis" in window)) return;
    speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "ja-JP";
    utterance.rate = 0.75;
    utterance.pitch = 1.1;
    const voice = getJapaneseVoice();
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
          <p className="font-medium text-stone-800 text-sm font-[family-name:'Noto_Sans_JP']">
            {phrase.japanese}
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
                <p className="text-sm text-indigo-600 font-mono">
                  {phrase.romaji}
                </p>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    speak(phrase.japanese);
                  }}
                  className={`p-2 rounded-lg transition-colors ${
                    speaking
                      ? "bg-indigo-100 text-indigo-600 animate-pulse"
                      : "hover:bg-indigo-50 text-indigo-500"
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

function CategorySection({ category }: { category: PhraseCategory }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="space-y-2">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center gap-3 bg-white rounded-2xl p-4 border border-stone-200 shadow-sm hover:shadow-md hover:border-indigo-200 transition-all"
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

export default function ReiszinnenJapansPage() {
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    speechSynthesis.getVoices();
    speechSynthesis.addEventListener("voiceschanged", () => {
      speechSynthesis.getVoices();
    });
  }, []);

  const totalPhrases = japaneseTravelPhrases.reduce(
    (sum, cat) => sum + cat.phrases.length, 0
  );

  const filteredCategories = searchQuery.trim()
    ? japaneseTravelPhrases
        .map((cat) => ({
          ...cat,
          phrases: cat.phrases.filter(
            (p) =>
              p.dutch.toLowerCase().includes(searchQuery.toLowerCase()) ||
              p.japanese.includes(searchQuery) ||
              p.romaji.toLowerCase().includes(searchQuery.toLowerCase())
          ),
        }))
        .filter((cat) => cat.phrases.length > 0)
    : japaneseTravelPhrases;

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
            <span className="text-2xl">🇯🇵</span>
            <h1 className="text-2xl font-bold text-stone-800">
              Reiszinnen Japans
            </h1>
          </div>
          <p className="text-stone-500 text-sm">
            {totalPhrases} essentiële zinnen voor toeristen in Japan — met uitspraak
          </p>
        </div>

        {/* Culture page link */}
        <Link
          href="/japan-gids"
          className="flex items-center gap-3 bg-gradient-to-r from-rose-50 to-amber-50 rounded-2xl p-4 border border-rose-100 hover:shadow-md transition-all group"
        >
          <span className="text-2xl">⛩️</span>
          <div className="flex-1">
            <h3 className="font-bold text-stone-800 group-hover:text-rose-700 transition-colors">
              Japanse Cultuur &amp; Etiquette
            </h3>
            <p className="text-xs text-stone-500">
              Onmisbare omgangsvormen, gewoonten en do&apos;s &amp; don&apos;ts
            </p>
          </div>
          <BookOpen className="w-5 h-5 text-rose-400 group-hover:text-rose-600" />
        </Link>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Zoek een zin (NL, JP of romaji)..."
            className="w-full pl-10 pr-4 py-3 rounded-xl border border-stone-200 bg-white text-sm outline-none focus:border-indigo-400 transition-colors"
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
