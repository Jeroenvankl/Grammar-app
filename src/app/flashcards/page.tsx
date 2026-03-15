"use client";

import { motion } from "framer-motion";
import { Layers, ChevronRight } from "lucide-react";
import Link from "next/link";
import Layout from "@/components/ui/Layout";

const languages = [
  {
    id: "japans",
    name: "Japans",
    flag: "🇯🇵",
    color: "from-rose-50 to-pink-50",
    border: "border-rose-200",
    description: "Oefen Japanse reiszinnen met romaji en uitspraak",
  },
  {
    id: "italiaans",
    name: "Italiaans",
    flag: "🇮🇹",
    color: "from-emerald-50 to-green-50",
    border: "border-emerald-200",
    description: "Oefen Italiaanse zinnen met uitspraak",
  },
  {
    id: "spaans",
    name: "Spaans (Latijns-Amerika)",
    flag: "🌎",
    color: "from-amber-50 to-orange-50",
    border: "border-amber-200",
    description: "Oefen Latijns-Amerikaanse zinnen met uitspraak",
  },
  {
    id: "frans",
    name: "Frans",
    flag: "🇫🇷",
    color: "from-blue-50 to-cyan-50",
    border: "border-blue-200",
    description: "Oefen Franse zinnen met uitspraak",
  },
];

export default function FlashcardsHubPage() {
  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Layers className="w-6 h-6 text-indigo-600" />
            <h1 className="text-2xl font-bold text-stone-800">Flashcards</h1>
          </div>
          <p className="text-stone-500 text-sm">
            Train jezelf met omdraaibaarkaarten — bedenk het antwoord en check of je het goed had
          </p>
        </div>

        <div className="bg-indigo-50 rounded-xl p-4 border border-indigo-100">
          <p className="text-sm text-indigo-700">
            <span className="font-semibold">Hoe werkt het?</span> Je ziet een Nederlandse zin en bedenkt zelf de vertaling.
            Draai de kaart om om het antwoord te zien, en geef eerlijk aan of je het goed had!
          </p>
        </div>

        <div className="space-y-3">
          {languages.map((lang, index) => (
            <motion.div
              key={lang.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Link
                href={`/flashcards/${lang.id}`}
                className={`block bg-gradient-to-r ${lang.color} rounded-2xl p-5 border ${lang.border} hover:shadow-lg transition-all group`}
              >
                <div className="flex items-center gap-4">
                  <span className="text-4xl">{lang.flag}</span>
                  <div className="flex-1">
                    <h2 className="font-bold text-lg text-stone-800 group-hover:text-indigo-700 transition-colors">
                      {lang.name}
                    </h2>
                    <p className="text-sm text-stone-600">{lang.description}</p>
                  </div>
                  <ChevronRight className="w-5 h-5 text-stone-400 group-hover:text-indigo-600 group-hover:translate-x-1 transition-all" />
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </Layout>
  );
}
