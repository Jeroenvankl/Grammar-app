"use client";

import { useState, useEffect, useCallback } from "react";

export interface MistakeRecord {
  id: string;
  timestamp: number;
  languageId: string;
  languageName: string;
  topicId: string;
  topicName: string;
  exerciseId: string;
  exerciseType: string;
  question: string;
  sentence: string;
  userAnswer: string;
  correctAnswer: string;
  alternativeAnswers?: string[];
  explanation: string;
  rule: string;
  count: number; // how many times this exercise was answered wrong
}

const STORAGE_KEY = "syntaxlab_mistakes";
const MAX_MISTAKES = 200;

function loadMistakes(): MistakeRecord[] {
  if (typeof window === "undefined") return [];
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) return JSON.parse(stored) as MistakeRecord[];
  } catch { /* corrupted */ }
  return [];
}

function saveMistakes(mistakes: MistakeRecord[]): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(mistakes.slice(0, MAX_MISTAKES)));
  } catch { /* full */ }
}

export function useMistakes() {
  const [mistakes, setMistakes] = useState<MistakeRecord[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setMistakes(loadMistakes());
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (isLoaded) saveMistakes(mistakes);
  }, [mistakes, isLoaded]);

  const addMistake = useCallback((mistake: Omit<MistakeRecord, "id" | "timestamp" | "count">) => {
    setMistakes((prev) => {
      // Check if this exact exercise was already wrong before
      const existingIndex = prev.findIndex(
        (m) => m.exerciseId === mistake.exerciseId && m.topicId === mistake.topicId && m.languageId === mistake.languageId
      );
      if (existingIndex >= 0) {
        // Update existing: increment count, update answer and timestamp
        const updated = [...prev];
        updated[existingIndex] = {
          ...updated[existingIndex],
          userAnswer: mistake.userAnswer,
          timestamp: Date.now(),
          count: updated[existingIndex].count + 1,
        };
        return updated;
      }
      // Add new mistake
      return [
        {
          ...mistake,
          id: `${mistake.languageId}-${mistake.topicId}-${mistake.exerciseId}-${Date.now()}`,
          timestamp: Date.now(),
          count: 1,
        },
        ...prev,
      ];
    });
  }, []);

  const removeMistake = useCallback((exerciseId: string, topicId: string, languageId: string) => {
    setMistakes((prev) =>
      prev.filter((m) => !(m.exerciseId === exerciseId && m.topicId === topicId && m.languageId === languageId))
    );
  }, []);

  const clearAll = useCallback(() => {
    setMistakes([]);
    saveMistakes([]);
  }, []);

  const getMistakesByLanguage = useCallback(
    (languageId: string) => mistakes.filter((m) => m.languageId === languageId),
    [mistakes]
  );

  const getMistakesByTopic = useCallback(
    (languageId: string, topicId: string) =>
      mistakes.filter((m) => m.languageId === languageId && m.topicId === topicId),
    [mistakes]
  );

  return {
    mistakes,
    isLoaded,
    addMistake,
    removeMistake,
    clearAll,
    getMistakesByLanguage,
    getMistakesByTopic,
  };
}
