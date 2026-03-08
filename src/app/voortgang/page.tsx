"use client";

import { motion } from "framer-motion";
import { BarChart3, Award, Target, TrendingUp } from "lucide-react";
import Layout from "@/components/ui/Layout";
import { useProgress } from "@/hooks/useProgress";
import { getAllLanguages } from "@/lib/dataLoader";
import { getLevelProgress } from "@/lib/gamification";
import Link from "next/link";

export default function VoortgangPage() {
  const { progress, isLoaded } = useProgress();
  const languages = getAllLanguages();
  const levelInfo = getLevelProgress(progress.xp);

  if (!isLoaded) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-pulse text-stone-400">Laden...</div>
        </div>
      </Layout>
    );
  }

  // Calculate total stats
  let totalExercises = 0;
  let totalCorrect = 0;
  const weakTopics: { languageId: string; topicId: string; topicName: string; score: number }[] = [];

  languages.forEach((lang) => {
    const langProgress = progress.languageProgress[lang.id];
    if (!langProgress) return;
    lang.topics.forEach((topic) => {
      const tp = langProgress.topicProgress[topic.id];
      if (tp) {
        totalExercises += tp.completed;
        totalCorrect += Math.round((tp.bestScore / 100) * tp.total);
        if (tp.bestScore < 70 && tp.bestScore > 0) {
          weakTopics.push({
            languageId: lang.id,
            topicId: topic.id,
            topicName: `${lang.flag} ${topic.name}`,
            score: tp.bestScore,
          });
        }
      }
    });
  });

  const accuracy = totalExercises > 0 ? Math.round((totalCorrect / totalExercises) * 100) : 0;

  return (
    <Layout>
      <div className="space-y-8">
        <h1 className="text-2xl font-bold text-stone-800">Voortgang</h1>

        {/* Overview stats */}
        <div className="grid grid-cols-2 gap-3">
          <motion.div
            whileHover={{ y: -2 }}
            className="bg-white rounded-2xl p-5 border border-stone-200 shadow-sm"
          >
            <Award className="w-5 h-5 text-amber-500 mb-2" />
            <p className="text-2xl font-bold text-stone-800">
              Level {progress.level}
            </p>
            <div className="w-full bg-stone-100 rounded-full h-1.5 mt-2">
              <div
                className="bg-indigo-500 rounded-full h-1.5"
                style={{ width: `${levelInfo.percentage}%` }}
              />
            </div>
            <p className="text-[10px] text-stone-400 mt-1">
              {levelInfo.current}/{levelInfo.needed} XP
            </p>
          </motion.div>

          <motion.div
            whileHover={{ y: -2 }}
            className="bg-white rounded-2xl p-5 border border-stone-200 shadow-sm"
          >
            <TrendingUp className="w-5 h-5 text-emerald-500 mb-2" />
            <p className="text-2xl font-bold text-stone-800">{progress.xp}</p>
            <p className="text-xs text-stone-500">Totale XP</p>
          </motion.div>

          <motion.div
            whileHover={{ y: -2 }}
            className="bg-white rounded-2xl p-5 border border-stone-200 shadow-sm"
          >
            <BarChart3 className="w-5 h-5 text-indigo-500 mb-2" />
            <p className="text-2xl font-bold text-stone-800">
              {totalExercises}
            </p>
            <p className="text-xs text-stone-500">Oefeningen voltooid</p>
          </motion.div>

          <motion.div
            whileHover={{ y: -2 }}
            className="bg-white rounded-2xl p-5 border border-stone-200 shadow-sm"
          >
            <Target className="w-5 h-5 text-rose-500 mb-2" />
            <p className="text-2xl font-bold text-stone-800">{accuracy}%</p>
            <p className="text-xs text-stone-500">Nauwkeurigheid</p>
          </motion.div>
        </div>

        {/* Per language */}
        {languages.map((lang) => {
          const langProgress = progress.languageProgress[lang.id];
          return (
            <section key={lang.id} className="space-y-3">
              <h2 className="text-lg font-bold text-stone-800">
                {lang.flag} {lang.name}
              </h2>
              <div className="space-y-2">
                {lang.topics.map((topic) => {
                  const tp = langProgress?.topicProgress[topic.id];
                  const pct = tp ? tp.bestScore : 0;
                  return (
                    <Link
                      key={topic.id}
                      href={`/taal/${lang.id}/${topic.id}`}
                      className="flex items-center gap-3 bg-white rounded-xl p-4 border border-stone-200 shadow-sm hover:border-indigo-200 transition-all"
                    >
                      <div className="flex-1">
                        <p className="font-medium text-stone-800 text-sm">
                          {topic.name}
                        </p>
                        <div className="w-full bg-stone-100 rounded-full h-1.5 mt-2">
                          <div
                            className="rounded-full h-1.5 transition-all"
                            style={{
                              width: `${pct}%`,
                              backgroundColor:
                                pct >= 70
                                  ? "#10b981"
                                  : pct > 0
                                  ? "#f59e0b"
                                  : "#d6d3d1",
                            }}
                          />
                        </div>
                      </div>
                      <span
                        className={`text-sm font-bold ${
                          pct >= 70
                            ? "text-emerald-600"
                            : pct > 0
                            ? "text-amber-600"
                            : "text-stone-300"
                        }`}
                      >
                        {pct > 0 ? `${pct}%` : "-"}
                      </span>
                    </Link>
                  );
                })}
              </div>
            </section>
          );
        })}

        {/* Weak topics */}
        {weakTopics.length > 0 && (
          <section className="bg-amber-50 rounded-2xl p-5 border border-amber-100">
            <h3 className="font-bold text-amber-800 mb-2">
              Aandachtspunten
            </h3>
            <p className="text-sm text-amber-700 mb-3">
              Deze onderwerpen kun je nog verbeteren:
            </p>
            <div className="space-y-2">
              {weakTopics
                .sort((a, b) => a.score - b.score)
                .map((wt) => (
                  <Link
                    key={`${wt.languageId}-${wt.topicId}`}
                    href={`/taal/${wt.languageId}/${wt.topicId}`}
                    className="flex items-center justify-between bg-white rounded-lg px-3 py-2 text-sm hover:bg-amber-100 transition-colors"
                  >
                    <span className="text-stone-700">{wt.topicName}</span>
                    <span className="text-amber-600 font-medium">
                      {wt.score}%
                    </span>
                  </Link>
                ))}
            </div>
          </section>
        )}
      </div>
    </Layout>
  );
}
