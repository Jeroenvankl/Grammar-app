"use client";

import { motion } from "framer-motion";
import { Plane, ChevronRight } from "lucide-react";
import Link from "next/link";
import Layout from "@/components/ui/Layout";

const languages = [
  {
    id: "japans",
    name: "Japans",
    flag: "🇯🇵",
    phrases: "140+",
    color: "from-rose-50 to-pink-50",
    border: "border-rose-200",
    hoverShadow: "hover:shadow-rose-100",
    description: "Essentiële zinnen voor toeristen in Japan — met uitspraak en romaji",
    extra: "Cultuur & etiquette gids",
  },
  {
    id: "italiaans",
    name: "Italiaans",
    flag: "🇮🇹",
    phrases: "130+",
    color: "from-emerald-50 to-green-50",
    border: "border-emerald-200",
    hoverShadow: "hover:shadow-emerald-100",
    description: "Van begroetingen tot noodgevallen — alles voor je reis naar Italië",
    extra: null,
  },
  {
    id: "spaans",
    name: "Spaans (Latijns-Amerika)",
    flag: "🌎",
    phrases: "140+",
    color: "from-amber-50 to-orange-50",
    border: "border-amber-200",
    hoverShadow: "hover:shadow-amber-100",
    description: "Reiszinnen voor heel Latijns-Amerika — met regionale uitdrukkingen",
    extra: "Lokale slang & tips",
  },
  {
    id: "frans",
    name: "Frans",
    flag: "🇫🇷",
    phrases: "130+",
    color: "from-blue-50 to-cyan-50",
    border: "border-blue-200",
    hoverShadow: "hover:shadow-blue-100",
    description: "Van begroetingen tot noodgevallen — alles voor je reis naar Frankrijk",
    extra: "Uitspraaktips voor Nederlanders",
  },
];

export default function ReiszinnenHubPage() {
  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Plane className="w-6 h-6 text-indigo-600" />
            <h1 className="text-2xl font-bold text-stone-800">Reiszinnen</h1>
          </div>
          <p className="text-stone-500 text-sm">
            Handige zinnen en uitdrukkingen voor op reis — kies je taal
          </p>
        </div>

        {/* Language cards */}
        <div className="space-y-3">
          {languages.map((lang, index) => (
            <motion.div
              key={lang.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Link
                href={`/reiszinnen/${lang.id}`}
                className={`block bg-gradient-to-r ${lang.color} rounded-2xl p-5 border ${lang.border} ${lang.hoverShadow} hover:shadow-lg transition-all group`}
              >
                <div className="flex items-start gap-4">
                  <span className="text-4xl">{lang.flag}</span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h2 className="font-bold text-lg text-stone-800 group-hover:text-indigo-700 transition-colors">
                        {lang.name}
                      </h2>
                      <span className="text-xs text-stone-400 bg-white/60 px-2 py-0.5 rounded-full">
                        {lang.phrases} zinnen
                      </span>
                    </div>
                    <p className="text-sm text-stone-600">{lang.description}</p>
                    {lang.extra && (
                      <p className="text-xs text-indigo-600 font-medium mt-1.5">
                        ✦ {lang.extra}
                      </p>
                    )}
                  </div>
                  <ChevronRight className="w-5 h-5 text-stone-400 group-hover:text-indigo-600 group-hover:translate-x-1 transition-all flex-shrink-0 mt-2" />
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Tip */}
        <div className="bg-indigo-50 rounded-xl p-4 border border-indigo-100">
          <p className="text-sm text-indigo-700">
            <span className="font-semibold">💡 Tip:</span> Klik op een zin om de uitspraak te horen.
            Alle pagina&apos;s werken ook offline — handig voor onderweg!
          </p>
        </div>
      </div>
    </Layout>
  );
}
