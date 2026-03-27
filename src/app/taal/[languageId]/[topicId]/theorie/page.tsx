"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft, BookOpen, Play, Lightbulb } from "lucide-react";
import Layout from "@/components/ui/Layout";
import { getTopic, getLanguage } from "@/lib/dataLoader";

const roleColors: Record<string, string> = {
  subject: "bg-blue-100 text-blue-700 border-blue-200",
  verb: "bg-red-100 text-red-700 border-red-200",
  object: "bg-emerald-100 text-emerald-700 border-emerald-200",
  adjective: "bg-orange-100 text-orange-700 border-orange-200",
  preposition: "bg-amber-100 text-amber-700 border-amber-200",
  article: "bg-purple-100 text-purple-700 border-purple-200",
  adverb: "bg-cyan-100 text-cyan-700 border-cyan-200",
  particle: "bg-pink-100 text-pink-700 border-pink-200",
};

const roleLabels: Record<string, string> = {
  subject: "onderwerp",
  verb: "werkwoord",
  object: "lijdend vw.",
  adjective: "bijv. nw.",
  preposition: "voorzetsel",
  article: "lidwoord",
  adverb: "bijwoord",
  particle: "partikel",
};

export default function TheoriePage() {
  const params = useParams();
  const languageId = params.languageId as string;
  const topicId = params.topicId as string;
  const topic = getTopic(languageId, topicId);
  const language = getLanguage(languageId);

  if (!topic || !language) {
    return (
      <Layout>
        <div className="text-center py-20">
          <h2 className="text-xl font-bold text-stone-800">Onderwerp niet gevonden</h2>
          <Link href="/" className="text-indigo-600 hover:underline mt-2 inline-block">
            Terug naar dashboard
          </Link>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <Link
            href={`/taal/${languageId}`}
            className="inline-flex items-center gap-1 text-sm text-indigo-600 hover:text-indigo-700 mb-3"
          >
            <ArrowLeft className="w-4 h-4" />
            {language.flag} {language.name}
          </Link>
          <div className="flex items-center gap-2 mb-1">
            <BookOpen className="w-6 h-6 text-indigo-600" />
            <h1 className="text-2xl font-bold text-stone-800">
              {topic.name}
            </h1>
          </div>
          <p className="text-stone-500 text-sm">{topic.description}</p>
        </div>

        {/* Start exercises CTA */}
        <Link
          href={`/taal/${languageId}/${topicId}`}
          className="flex items-center gap-3 bg-indigo-50 rounded-xl p-4 border border-indigo-200 hover:bg-indigo-100 transition-colors group"
        >
          <div className="p-2 bg-indigo-600 rounded-lg">
            <Play className="w-4 h-4 text-white" />
          </div>
          <div className="flex-1">
            <p className="font-semibold text-indigo-700 group-hover:text-indigo-800">Start de oefeningen</p>
            <p className="text-xs text-indigo-500">{topic.exercises.length} oefeningen beschikbaar</p>
          </div>
        </Link>

        {/* Grammar rules */}
        <div className="space-y-6">
          {topic.grammarRules.map((rule, ruleIndex) => (
            <motion.div
              key={rule.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: ruleIndex * 0.1 }}
              className="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-sm"
            >
              {/* Rule header */}
              <div className="p-5 border-b border-stone-100">
                <div className="flex items-start gap-3">
                  <div className="p-1.5 bg-amber-100 rounded-lg mt-0.5">
                    <Lightbulb className="w-4 h-4 text-amber-600" />
                  </div>
                  <div className="flex-1">
                    <h2 className="text-lg font-bold text-stone-800 mb-2">{rule.title}</h2>
                    <p className="text-sm text-stone-600 leading-relaxed">{rule.explanation}</p>
                  </div>
                </div>
              </div>

              {/* Formula */}
              <div className="px-5 py-3 bg-stone-50 border-b border-stone-100">
                <p className="text-xs font-semibold text-stone-400 uppercase tracking-wide mb-1">Formule</p>
                <p className="text-sm font-mono text-indigo-700 bg-white rounded-lg px-3 py-2 border border-indigo-100">
                  {rule.formula}
                </p>
              </div>

              {/* Examples with breakdown */}
              <div className="p-5 space-y-4">
                <p className="text-xs font-semibold text-stone-400 uppercase tracking-wide">Voorbeelden</p>
                {rule.examples.map((example, exIndex) => {
                  // Find the language-specific field (italian, japanese, french, spanish, etc.)
                  const targetSentence = Object.entries(example).find(
                    ([key]) => key !== "dutch" && key !== "breakdown" && typeof example[key as keyof typeof example] === "string"
                  );

                  return (
                    <div key={exIndex} className="space-y-2">
                      <div className="bg-gradient-to-r from-indigo-50 to-blue-50 rounded-xl p-4 border border-indigo-100">
                        {targetSentence && (
                          <p className="font-semibold text-stone-800 text-base mb-1">
                            {targetSentence[1] as string}
                          </p>
                        )}
                        <p className="text-sm text-stone-500">{example.dutch}</p>
                      </div>

                      {/* Word breakdown */}
                      {example.breakdown && example.breakdown.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 px-1">
                          {example.breakdown.map((word, wIndex) => (
                            <div
                              key={wIndex}
                              className={`rounded-lg px-2.5 py-1.5 border text-xs ${roleColors[word.role] || "bg-stone-100 text-stone-600 border-stone-200"}`}
                            >
                              <span className="font-bold">{word.word}</span>
                              <span className="text-[10px] ml-1 opacity-70">
                                {roleLabels[word.role] || word.role}
                              </span>
                              {word.annotation && (
                                <p className="text-[10px] opacity-60 mt-0.5">{word.annotation}</p>
                              )}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="text-center py-4">
          <Link
            href={`/taal/${languageId}/${topicId}`}
            className="inline-flex items-center gap-2 px-8 py-3 bg-indigo-600 text-white font-semibold rounded-xl hover:bg-indigo-700 transition-colors"
          >
            <Play className="w-4 h-4" />
            Start met oefenen
          </Link>
        </div>
      </div>
    </Layout>
  );
}
