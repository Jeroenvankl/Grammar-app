"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { BookOpen, Zap, Target, ChevronRight } from "lucide-react";
import Layout from "@/components/ui/Layout";
import { useProgress } from "@/hooks/useProgress";
import { getAllLanguages } from "@/lib/dataLoader";
import XPBar from "@/components/gamification/XPBar";
import StreakCounter from "@/components/gamification/StreakCounter";

export default function Dashboard() {
  const { progress, isLoaded } = useProgress();
  const languages = getAllLanguages();

  if (!isLoaded) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-pulse text-stone-400">Laden...</div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-8">
        {/* Welcome */}
        <div>
          <h1 className="text-2xl font-bold text-stone-800">
            Welkom bij SyntaxLab
          </h1>
          <p className="text-stone-500 mt-1">
            Leer grammatica als een programmeur
          </p>
        </div>

        {/* Stats cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          <motion.div
            whileHover={{ y: -2 }}
            className="bg-white rounded-2xl p-4 border border-stone-200 shadow-sm"
          >
            <div className="flex items-center gap-2 text-indigo-600 mb-2">
              <Zap className="w-4 h-4" />
              <span className="text-xs font-medium">Level</span>
            </div>
            <p className="text-2xl font-bold text-stone-800">
              {progress.level}
            </p>
          </motion.div>
          <motion.div
            whileHover={{ y: -2 }}
            className="bg-white rounded-2xl p-4 border border-stone-200 shadow-sm"
          >
            <div className="flex items-center gap-2 text-amber-600 mb-2">
              <Target className="w-4 h-4" />
              <span className="text-xs font-medium">XP</span>
            </div>
            <p className="text-2xl font-bold text-stone-800">{progress.xp}</p>
          </motion.div>
          <div className="col-span-2 bg-white rounded-2xl p-4 border border-stone-200 shadow-sm">
            <StreakCounter streak={progress.streak} size="lg" />
          </div>
        </div>

        {/* XP Progress */}
        <div className="bg-white rounded-2xl p-4 border border-stone-200 shadow-sm">
          <XPBar currentXP={progress.xp} level={progress.level} />
        </div>

        {/* Languages */}
        <div>
          <h2 className="text-lg font-bold text-stone-800 mb-3">
            Kies een taal
          </h2>
          <div className="grid gap-3">
            {languages.map((lang, i) => {
              const langProgress = progress.languageProgress[lang.id];
              const completedTopics = langProgress
                ? Object.values(langProgress.topicProgress).filter(
                    (t) => t.completed > 0
                  ).length
                : 0;

              return (
                <motion.div
                  key={lang.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                >
                  <Link
                    href={`/taal/${lang.id}`}
                    className="flex items-center gap-4 bg-white rounded-2xl p-5 border border-stone-200 shadow-sm hover:shadow-md hover:border-indigo-200 transition-all group"
                  >
                    <span className="text-4xl">{lang.flag}</span>
                    <div className="flex-1">
                      <h3 className="font-bold text-stone-800 group-hover:text-indigo-700 transition-colors">
                        {lang.name}
                      </h3>
                      <p className="text-sm text-stone-500">
                        {lang.topics.length} onderwerpen
                        {completedTopics > 0 &&
                          ` \u2022 ${completedTopics} begonnen`}
                      </p>
                    </div>
                    <ChevronRight className="w-5 h-5 text-stone-400 group-hover:text-indigo-500 transition-colors" />
                  </Link>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Quick tip */}
        <div className="bg-indigo-50 rounded-2xl p-5 border border-indigo-100">
          <div className="flex items-start gap-3">
            <BookOpen className="w-5 h-5 text-indigo-600 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-semibold text-indigo-800 text-sm">
                Tip van de dag
              </h3>
              <p className="text-sm text-indigo-600 mt-1">
                Als je een fout maakt, klik dan op &quot;Waarom?&quot; om een
                visueel diagram te zien dat de grammaticaregel uitlegt.
              </p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
