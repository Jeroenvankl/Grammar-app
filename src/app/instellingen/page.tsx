"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Key, RotateCcw, Eye, EyeOff, Check } from "lucide-react";
import Layout from "@/components/ui/Layout";
import { useProgress } from "@/hooks/useProgress";

export default function InstellingenPage() {
  const { resetProgress } = useProgress();
  const [geminiKey, setGeminiKey] = useState("");
  const [groqKey, setGroqKey] = useState("");
  const [showGemini, setShowGemini] = useState(false);
  const [showGroq, setShowGroq] = useState(false);
  const [saved, setSaved] = useState(false);
  const [confirmReset, setConfirmReset] = useState(false);

  useEffect(() => {
    const gk = localStorage.getItem("syntaxlab_gemini_key") || "";
    const qk = localStorage.getItem("syntaxlab_groq_key") || "";
    setGeminiKey(gk);
    setGroqKey(qk);
  }, []);

  const saveKeys = () => {
    if (geminiKey.trim()) {
      localStorage.setItem("syntaxlab_gemini_key", geminiKey.trim());
    } else {
      localStorage.removeItem("syntaxlab_gemini_key");
    }
    if (groqKey.trim()) {
      localStorage.setItem("syntaxlab_groq_key", groqKey.trim());
    } else {
      localStorage.removeItem("syntaxlab_groq_key");
    }
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleReset = () => {
    if (!confirmReset) {
      setConfirmReset(true);
      return;
    }
    resetProgress();
    setConfirmReset(false);
  };

  return (
    <Layout>
      <div className="space-y-8">
        <h1 className="text-2xl font-bold text-stone-800">Instellingen</h1>

        {/* AI API Keys */}
        <section className="bg-white rounded-2xl p-6 border border-stone-200 shadow-sm space-y-5">
          <div className="flex items-center gap-2">
            <Key className="w-5 h-5 text-indigo-600" />
            <h2 className="text-lg font-bold text-stone-800">AI Tutor</h2>
          </div>
          <p className="text-sm text-stone-500">
            Voeg een gratis API-key toe om de AI-tutor te activeren. De app
            werkt ook prima zonder AI.
          </p>

          {/* Gemini */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-stone-700">
              Google Gemini API Key
            </label>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <input
                  type={showGemini ? "text" : "password"}
                  value={geminiKey}
                  onChange={(e) => setGeminiKey(e.target.value)}
                  placeholder="AIza..."
                  className="w-full px-4 py-2.5 pr-10 rounded-xl border border-stone-200 text-sm outline-none focus:border-indigo-400"
                />
                <button
                  onClick={() => setShowGemini(!showGemini)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400"
                >
                  {showGemini ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>
            <p className="text-xs text-stone-400">
              Gratis te verkrijgen via aistudio.google.com
            </p>
          </div>

          {/* Groq */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-stone-700">
              Groq API Key (fallback)
            </label>
            <div className="relative">
              <input
                type={showGroq ? "text" : "password"}
                value={groqKey}
                onChange={(e) => setGroqKey(e.target.value)}
                placeholder="gsk_..."
                className="w-full px-4 py-2.5 pr-10 rounded-xl border border-stone-200 text-sm outline-none focus:border-indigo-400"
              />
              <button
                onClick={() => setShowGroq(!showGroq)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400"
              >
                {showGroq ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
            </div>
            <p className="text-xs text-stone-400">
              Gratis te verkrijgen via console.groq.com
            </p>
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={saveKeys}
            className="flex items-center gap-2 px-6 py-2.5 bg-indigo-600 text-white rounded-xl font-semibold text-sm hover:bg-indigo-700 transition-colors"
          >
            {saved ? (
              <>
                <Check className="w-4 h-4" /> Opgeslagen!
              </>
            ) : (
              "Opslaan"
            )}
          </motion.button>
        </section>

        {/* Reset */}
        <section className="bg-white rounded-2xl p-6 border border-stone-200 shadow-sm space-y-4">
          <div className="flex items-center gap-2">
            <RotateCcw className="w-5 h-5 text-rose-500" />
            <h2 className="text-lg font-bold text-stone-800">
              Voortgang resetten
            </h2>
          </div>
          <p className="text-sm text-stone-500">
            Dit verwijdert al je XP, levels, streaks en voltooide oefeningen.
            Dit kan niet ongedaan worden gemaakt.
          </p>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleReset}
            className={`px-6 py-2.5 rounded-xl font-semibold text-sm transition-colors ${
              confirmReset
                ? "bg-rose-600 text-white hover:bg-rose-700"
                : "bg-rose-100 text-rose-700 hover:bg-rose-200"
            }`}
          >
            {confirmReset
              ? "Weet je het zeker? Klik nogmaals"
              : "Alles resetten"}
          </motion.button>
        </section>
      </div>
    </Layout>
  );
}
