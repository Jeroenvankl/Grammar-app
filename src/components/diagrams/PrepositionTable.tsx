"use client";

import { motion } from "framer-motion";

const prepositions = ["di", "a", "da", "in", "su"];
const articles = ["il", "lo", "la", "l'", "i", "gli", "le"];
const combinations: Record<string, Record<string, string>> = {
  di: { il: "del", lo: "dello", la: "della", "l'": "dell'", i: "dei", gli: "degli", le: "delle" },
  a: { il: "al", lo: "allo", la: "alla", "l'": "all'", i: "ai", gli: "agli", le: "alle" },
  da: { il: "dal", lo: "dallo", la: "dalla", "l'": "dall'", i: "dai", gli: "dagli", le: "dalle" },
  in: { il: "nel", lo: "nello", la: "nella", "l'": "nell'", i: "nei", gli: "negli", le: "nelle" },
  su: { il: "sul", lo: "sullo", la: "sulla", "l'": "sull'", i: "sui", gli: "sugli", le: "sulle" },
};

interface PrepositionTableProps {
  highlightPreposition?: string;
  highlightArticle?: string;
  highlightResult?: string;
}

export default function PrepositionTable({ highlightPreposition, highlightArticle, highlightResult }: PrepositionTableProps) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm border-collapse">
        <thead>
          <tr>
            <th className="p-2 text-stone-400 text-xs"></th>
            {articles.map((art) => (
              <th key={art} className={`p-2 text-xs font-bold ${
                art === highlightArticle ? "text-amber-600 bg-amber-50" : "text-stone-500"
              }`}>
                {art}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {prepositions.map((prep, pi) => (
            <tr key={prep}>
              <td className={`p-2 text-xs font-bold ${
                prep === highlightPreposition ? "text-purple-600 bg-purple-50" : "text-stone-500"
              }`}>
                {prep}
              </td>
              {articles.map((art, ai) => {
                const result = combinations[prep]?.[art] || "";
                const isHighlighted = prep === highlightPreposition && art === highlightArticle;
                return (
                  <td key={art} className="p-0">
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: (pi * 7 + ai) * 0.02 }}
                      className={`p-2 text-center text-xs font-medium rounded ${
                        isHighlighted
                          ? "bg-indigo-100 text-indigo-700 font-bold ring-2 ring-indigo-300"
                          : result === highlightResult
                            ? "bg-indigo-50 text-indigo-600"
                            : "text-stone-600"
                      }`}
                    >
                      {result}
                    </motion.div>
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
