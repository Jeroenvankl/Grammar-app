"use client";

import { useState, useCallback, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Volume2, ArrowLeft, RotateCcw, Check, X, Shuffle } from "lucide-react";
import Link from "next/link";
import Layout from "@/components/ui/Layout";
import { frenchTravelPhrases, FrenchTravelPhrase } from "@/data/phrases/french-travel";

function getFrenchVoice(): SpeechSynthesisVoice | null {
  const voices = speechSynthesis.getVoices();
  const frVoices = voices.filter(
    (v) => v.lang === "fr-FR" || v.lang === "fr_FR" || v.lang.startsWith("fr")
  );
  const preferred = ["Google français", "Amélie", "Audrey", "Thomas", "Microsoft Julie", "Microsoft Denise"];
  for (const name of preferred) {
    const match = frVoices.find((v) => v.name.includes(name));
    if (match) return match;
  }
  return frVoices[0] || null;
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export default function FlashcardsFransPage() {
  const allPhrases = useMemo(
    () => frenchTravelPhrases.flatMap((cat) => cat.phrases),
    []
  );
  const [cards, setCards] = useState<FrenchTravelPhrase[]>([]);
  const [index, setIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [correct, setCorrect] = useState(0);
  const [wrong, setWrong] = useState(0);
  const [speaking, setSpeaking] = useState(false);
  const [finished, setFinished] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  useEffect(() => {
    speechSynthesis.getVoices();
    speechSynthesis.addEventListener("voiceschanged", () => speechSynthesis.getVoices());
  }, []);

  useEffect(() => {
    const phrases = selectedCategory === "all"
      ? allPhrases
      : frenchTravelPhrases.find((c) => c.id === selectedCategory)?.phrases || allPhrases;
    setCards(shuffle(phrases));
    setIndex(0);
    setFlipped(false);
    setCorrect(0);
    setWrong(0);
    setFinished(false);
  }, [selectedCategory, allPhrases]);

  const speak = useCallback((text: string) => {
    if (!("speechSynthesis" in window)) return;
    speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "fr-FR";
    utterance.rate = 0.85;
    utterance.pitch = 1.05;
    const voice = getFrenchVoice();
    if (voice) utterance.voice = voice;
    utterance.onstart = () => setSpeaking(true);
    utterance.onend = () => setSpeaking(false);
    utterance.onerror = () => setSpeaking(false);
    speechSynthesis.speak(utterance);
  }, []);

  const handleRate = (wasCorrect: boolean) => {
    if (wasCorrect) setCorrect((c) => c + 1);
    else setWrong((w) => w + 1);
    if (index + 1 >= cards.length) {
      setFinished(true);
    } else {
      setFlipped(false);
      setIndex((i) => i + 1);
    }
  };

  const restart = () => {
    setCards(shuffle(cards));
    setIndex(0);
    setFlipped(false);
    setCorrect(0);
    setWrong(0);
    setFinished(false);
  };

  const current = cards[index];

  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <Link href="/flashcards" className="inline-flex items-center gap-1 text-sm text-indigo-600 hover:text-indigo-700 mb-3">
            <ArrowLeft className="w-4 h-4" />
            Alle talen
          </Link>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-2xl">🇫🇷</span>
            <h1 className="text-2xl font-bold text-stone-800">Flashcards Frans</h1>
          </div>
        </div>

        {/* Category filter */}
        <div className="flex gap-2 flex-wrap">
          <button
            onClick={() => setSelectedCategory("all")}
            className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
              selectedCategory === "all" ? "bg-blue-600 text-white" : "bg-stone-100 text-stone-600 hover:bg-stone-200"
            }`}
          >
            Alle ({allPhrases.length})
          </button>
          {frenchTravelPhrases.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                selectedCategory === cat.id ? "bg-blue-600 text-white" : "bg-stone-100 text-stone-600 hover:bg-stone-200"
              }`}
            >
              {cat.icon} {cat.name} ({cat.phrases.length})
            </button>
          ))}
        </div>

        {/* Score */}
        {!finished && cards.length > 0 && (
          <div className="flex items-center justify-between text-sm">
            <span className="text-stone-500">Kaart {index + 1} / {cards.length}</span>
            <div className="flex gap-3">
              <span className="text-emerald-600 font-medium">✓ {correct}</span>
              <span className="text-rose-600 font-medium">✗ {wrong}</span>
            </div>
          </div>
        )}

        {/* Card */}
        {finished ? (
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl p-8 border border-stone-200 shadow-md text-center space-y-4"
          >
            <div className="text-5xl mb-2">🎉</div>
            <h2 className="text-xl font-bold text-stone-800">Ronde voltooid!</h2>
            <div className="flex justify-center gap-8 text-lg">
              <div className="text-emerald-600"><span className="font-bold text-2xl">{correct}</span><p className="text-xs">Goed</p></div>
              <div className="text-rose-600"><span className="font-bold text-2xl">{wrong}</span><p className="text-xs">Fout</p></div>
              <div className="text-indigo-600"><span className="font-bold text-2xl">{cards.length > 0 ? Math.round((correct / cards.length) * 100) : 0}%</span><p className="text-xs">Score</p></div>
            </div>
            <button onClick={restart} className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition-colors">
              <Shuffle className="w-4 h-4" />
              Opnieuw (geschud)
            </button>
          </motion.div>
        ) : current ? (
          <div>
            <AnimatePresence mode="wait">
              {!flipped ? (
                <motion.div key={`front-${index}`} initial={{ rotateY: 180, opacity: 0 }} animate={{ rotateY: 0, opacity: 1 }} exit={{ rotateY: -90, opacity: 0 }} transition={{ duration: 0.35 }}
                  className="bg-white rounded-2xl p-8 border-2 border-stone-200 shadow-md flex flex-col items-center justify-center min-h-[280px] text-center"
                >
                  <p className="text-xs text-stone-400 uppercase tracking-wide mb-4">Hoe zeg je dit in het Frans?</p>
                  <p className="text-xl font-bold text-stone-800 mb-6">{current.dutch}</p>
                  {current.context && <p className="text-xs text-stone-400 italic mb-4">{current.context}</p>}
                  <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} onClick={() => setFlipped(true)}
                    className="px-8 py-3 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition-colors flex items-center gap-2"
                  >
                    <RotateCcw className="w-4 h-4" />
                    Laat het antwoord zien
                  </motion.button>
                </motion.div>
              ) : (
                <motion.div key={`back-${index}`} initial={{ rotateY: -180, opacity: 0 }} animate={{ rotateY: 0, opacity: 1 }} exit={{ rotateY: 90, opacity: 0 }} transition={{ duration: 0.35 }}
                  className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl p-8 border-2 border-blue-200 shadow-md flex flex-col items-center justify-center min-h-[280px] text-center"
                >
                  <p className="text-xs text-blue-400 uppercase tracking-wide mb-2">Antwoord</p>
                  <p className="text-2xl font-bold text-stone-800 mb-1">{current.french}</p>
                  {current.pronunciation && <p className="text-sm text-blue-600 font-mono mb-1">{current.pronunciation}</p>}
                  <p className="text-sm text-stone-500 mb-4">{current.dutch}</p>
                  <button onClick={() => speak(current.french)}
                    className={`mb-6 p-3 rounded-full transition-colors ${speaking ? "bg-blue-200 text-blue-700 animate-pulse" : "bg-blue-100 text-blue-600 hover:bg-blue-200"}`}
                    title="Luister naar uitspraak"
                  >
                    <Volume2 className="w-5 h-5" />
                  </button>
                  <p className="text-xs text-stone-400 mb-3">Had je het goed?</p>
                  <div className="flex gap-3">
                    <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => handleRate(false)}
                      className="flex items-center gap-2 px-6 py-3 bg-rose-100 text-rose-700 font-semibold rounded-xl hover:bg-rose-200 transition-colors"
                    >
                      <X className="w-4 h-4" /> Fout
                    </motion.button>
                    <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => handleRate(true)}
                      className="flex items-center gap-2 px-6 py-3 bg-emerald-100 text-emerald-700 font-semibold rounded-xl hover:bg-emerald-200 transition-colors"
                    >
                      <Check className="w-4 h-4" /> Goed
                    </motion.button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ) : null}

        {!finished && cards.length > 0 && (
          <div className="w-full bg-stone-200 rounded-full h-1.5">
            <motion.div className="bg-blue-500 h-1.5 rounded-full" animate={{ width: `${((index) / cards.length) * 100}%` }} transition={{ type: "spring", stiffness: 300, damping: 30 }} />
          </div>
        )}
      </div>
    </Layout>
  );
}
