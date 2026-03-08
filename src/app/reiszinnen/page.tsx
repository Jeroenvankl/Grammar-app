"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Volume2, ChevronDown, Search, Plane } from "lucide-react";
import Layout from "@/components/ui/Layout";
import { japaneseTravelPhrases, PhraseCategory, TravelPhrase } from "@/data/phrases/japanese-travel";

function PhraseCard({ phrase, index }: { phrase: TravelPhrase; index: number }) {
  const [expanded, setExpanded] = useState(false);

  const speak = (text: string) => {
    if ("speechSynthesis" in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = "ja-JP";
      utterance.rate = 0.8;
      speechSynthesis.speak(utterance);
    }
  };

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
                  className="p-2 rounded-lg hover:bg-indigo-50 text-indigo-500 transition-colors"
                  title="Luister naar uitspraak"
                >
                  <Volume2 className="w-4 h-4" />
                </button>
              </div>
              {phrase.context && (
                <p className="text-xs text-stone-400 italic bg-stone-50 rounded-lg p-2">
                  💡 {phrase.context}
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

export default function ReiszinnenPage() {
  const [searchQuery, setSearchQuery] = useState("");

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
        {/* Header */}
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Plane className="w-6 h-6 text-indigo-600" />
            <h1 className="text-2xl font-bold text-stone-800">
              Reiszinnen Japans
            </h1>
          </div>
          <p className="text-stone-500 text-sm">
            Essentiële zinnen voor toeristen in Japan — met uitspraak
          </p>
        </div>

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
            // When searching, show all results flat
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
            // Normal category view
            filteredCategories.map((cat) => (
              <CategorySection key={cat.id} category={cat} />
            ))
          )}
        </div>

        {/* Tips */}
        <div className="bg-amber-50 rounded-2xl p-5 border border-amber-100">
          <h3 className="font-bold text-amber-800 text-sm mb-2">
            💡 Tips voor Japan
          </h3>
          <ul className="text-sm text-amber-700 space-y-1.5">
            <li>• In Japan geef je <strong>geen fooi</strong> — het wordt als onbeleefd beschouwd</li>
            <li>• Koop een <strong>Suica/Pasmo kaart</strong> voor al het openbaar vervoer</li>
            <li>• <strong>Convenience stores</strong> (konbini) zijn overal en hebben alles</li>
            <li>• Spreek met <strong>twee handen</strong> als je iets aangeeft of ontvangt</li>
            <li>• Trek altijd je <strong>schoenen uit</strong> bij het betreden van tempels en ryokans</li>
          </ul>
        </div>
      </div>
    </Layout>
  );
}
