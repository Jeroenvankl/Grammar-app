"use client";

import { motion } from "framer-motion";
import { Ruler } from "lucide-react";
import { DiagramType, WordBreakdown } from "@/types/grammar";
import SentenceDiagram from "./SentenceDiagram";
import ConjugationDiagram from "./ConjugationDiagram";
import PrepositionTable from "./PrepositionTable";
import ParticleDiagram from "./ParticleDiagram";
import WordOrderComparison from "./WordOrderComparison";

interface ExplanationPanelProps {
  diagramType: DiagramType;
  diagramData: Record<string, unknown>;
  rule: string;
}

function renderDiagram(diagramType: DiagramType, data: Record<string, unknown>) {
  switch (diagramType) {
    case "conjugation": {
      return (
        <ConjugationDiagram
          verb={(data.verb as string) || ""}
          stem={(data.stem as string) || ""}
          endings={(data.endings as Record<string, string>) || {}}
          highlighted={data.highlighted as string | undefined}
          iscVerb={data.iscVerb as boolean | undefined}
          error={data.error as { given: string; correct: string } | undefined}
        />
      );
    }
    case "wordOrder": {
      const words = data.words as Array<{ word: string; role: string; position: number }>;
      if (!words) return null;
      const breakdowns: WordBreakdown[] = words
        .sort((a, b) => a.position - b.position)
        .map((w) => ({ word: w.word, role: w.role as WordBreakdown["role"], color: "" }));
      return <SentenceDiagram words={breakdowns} />;
    }
    case "agreement": {
      const noun = data.noun as string | undefined;
      const article = (data.correctArticle || data.article) as string | undefined;
      if (noun && article) {
        const words: WordBreakdown[] = [
          { word: article, role: "article", color: "", annotation: `${(data.gender as string) || ""} ${(data.number as string) || ""}`.trim() },
          { word: noun, role: "object", color: "" },
        ];
        return <SentenceDiagram words={words} />;
      }
      return null;
    }
    case "preposition": {
      const preposition = data.preposition as string | undefined;
      const article = data.article as string | undefined;
      const combined = (data.combined || data.result) as string | undefined;
      return (
        <div className="space-y-4">
          {preposition && article && combined && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center justify-center gap-2 text-lg flex-wrap">
              <span className="px-3 py-1.5 bg-purple-100 text-purple-700 font-bold rounded-lg border border-purple-200">{preposition}</span>
              <span className="text-stone-400">+</span>
              <span className="px-3 py-1.5 bg-amber-100 text-amber-700 font-bold rounded-lg border border-amber-200">{article}</span>
              <span className="text-stone-400">=</span>
              <span className="px-3 py-1.5 bg-indigo-100 text-indigo-700 font-bold rounded-lg border-2 border-indigo-300 shadow-sm">{combined}</span>
            </motion.div>
          )}
          <PrepositionTable highlightPreposition={preposition} highlightArticle={article} highlightResult={combined} />
        </div>
      );
    }
    case "particle": {
      const parts = data.parts as Array<{ text: string; role: string; particle?: string; color?: string }> | undefined;
      if (parts) {
        const sentence = parts.map((p) => `${p.text}${p.particle ? p.particle : ""}`).join(" ");
        const particles = parts
          .filter((p) => p.particle)
          .map((p) => ({
            particle: p.particle!,
            word: p.text,
            function: p.role,
            color: p.color || "#607D8B",
          }));
        return <ParticleDiagram sentence={sentence} particles={particles} />;
      }
      // Fallback for simpler particle data
      const sentence = data.sentence as string | undefined;
      const particlesArr = data.particles as Array<{ particle: string; word: string; function: string; color: string }> | undefined;
      if (sentence && particlesArr) {
        return <ParticleDiagram sentence={sentence} particles={particlesArr} />;
      }
      return null;
    }
    case "wordOrderComparison": {
      const dutch = data.dutch as { words: string[]; order: string[]; sentence?: string; parts?: Array<{ word: string; role: string }> } | undefined;
      const japanese = data.japanese as { words: string[]; order: string[]; sentence?: string; parts?: Array<{ word: string; role: string }> } | undefined;
      if (!dutch || !japanese) return null;
      // Convert to WordOrderComparison format
      const dutchData = {
        sentence: dutch.sentence || dutch.words.join(" "),
        parts: dutch.parts || dutch.words.map((w, i) => ({ word: w, role: dutch.order[i] || "" })),
        order: dutch.order?.join("-") || "SVO",
      };
      const japaneseData = {
        sentence: japanese.sentence || japanese.words.join(" "),
        parts: japanese.parts || japanese.words.map((w, i) => ({ word: w, role: japanese.order[i] || "" })),
        order: japanese.order?.join("-") || "SOV",
      };
      return <WordOrderComparison dutch={dutchData} japanese={japaneseData} />;
    }
    default:
      return null;
  }
}

export default function ExplanationPanel({ diagramType, diagramData, rule }: ExplanationPanelProps) {
  return (
    <div className="space-y-3">
      <div className="flex items-start gap-2 p-3 bg-indigo-50 rounded-xl border border-indigo-100">
        <Ruler className="w-4 h-4 text-indigo-500 flex-shrink-0 mt-0.5" />
        <p className="text-sm text-indigo-600 font-medium">{rule}</p>
      </div>
      <div className="p-3 bg-stone-50 rounded-xl border border-stone-200 overflow-x-auto scrollbar-thin">
        {renderDiagram(diagramType, diagramData)}
      </div>
    </div>
  );
}
