"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft, ChevronRight, Lock, CheckCircle } from "lucide-react";
import Layout from "@/components/ui/Layout";
import { getLanguage } from "@/lib/dataLoader";
import { useProgress } from "@/hooks/useProgress";

const levelColors = {
  beginner: "bg-emerald-100 text-emerald-700",
  gemiddeld: "bg-amber-100 text-amber-700",
  gevorderd: "bg-rose-100 text-rose-700",
};

export default function LanguagePage() {
  const params = useParams();
  const languageId = params.languageId as string;
  const language = getLanguage(languageId);
  const { progress } = useProgress();

  if (!language) {
    return (
      <Layout>
        <div className="text-center py-20">
          <h2 className="text-xl font-bold text-stone-800">Taal niet gevonden</h2>
          <Link href="/" className="text-indigo-600 hover:underline mt-2 inline-block">
            Terug naar dashboard
          </Link>
        </div>
      </Layout>
    );
  }

  const langProgress = progress.languageProgress[languageId];

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="p-2 rounded-xl hover:bg-stone-100 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-stone-500" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-stone-800">
              {language.flag} {language.name}
            </h1>
            <p className="text-sm text-stone-500">
              {language.topics.length} onderwerpen beschikbaar
            </p>
          </div>
        </div>

        <div className="grid gap-3">
          {language.topics
            .sort((a, b) => a.order - b.order)
            .map((topic, i) => {
              const topicProgress = langProgress?.topicProgress[topic.id];
              const isStarted = topicProgress && topicProgress.completed > 0;
              const isLocked = i > 0 && !langProgress?.topicProgress[language.topics[i - 1]?.id];

              return (
                <motion.div
                  key={topic.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.08 }}
                >
                  {isLocked ? (
                    <div className="flex items-center gap-4 bg-stone-50 rounded-2xl p-5 border border-stone-200 opacity-60">
                      <Lock className="w-5 h-5 text-stone-400" />
                      <div className="flex-1">
                        <h3 className="font-semibold text-stone-500">
                          {topic.name}
                        </h3>
                        <p className="text-sm text-stone-400">
                          Rond het vorige onderwerp af
                        </p>
                      </div>
                    </div>
                  ) : (
                    <Link
                      href={`/taal/${languageId}/${topic.id}`}
                      className="flex items-center gap-4 bg-white rounded-2xl p-5 border border-stone-200 shadow-sm hover:shadow-md hover:border-indigo-200 transition-all group"
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-bold text-stone-800 group-hover:text-indigo-700 transition-colors">
                            {topic.name}
                          </h3>
                          <span
                            className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${
                              levelColors[topic.level]
                            }`}
                          >
                            {topic.level}
                          </span>
                        </div>
                        <p className="text-sm text-stone-500">
                          {topic.description}
                        </p>
                        <p className="text-xs text-stone-400 mt-1">
                          {topic.exercises.length} oefeningen
                          {topicProgress &&
                            ` \u2022 Beste score: ${topicProgress.bestScore}%`}
                        </p>
                      </div>
                      {isStarted ? (
                        <CheckCircle className="w-5 h-5 text-emerald-500" />
                      ) : (
                        <ChevronRight className="w-5 h-5 text-stone-400 group-hover:text-indigo-500 transition-colors" />
                      )}
                    </Link>
                  )}
                </motion.div>
              );
            })}
        </div>
      </div>
    </Layout>
  );
}
