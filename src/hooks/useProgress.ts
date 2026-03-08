"use client";

import { useState, useEffect, useCallback } from "react";
import { UserProgress, XPEvent, LevelUpEvent } from "@/types/gamification";
import {
  createInitialProgress,
  addXP as addXPToProgress,
  checkStreak,
} from "@/lib/gamification";

const STORAGE_KEY = "syntaxlab_progress";

function loadProgress(): UserProgress {
  if (typeof window === "undefined") return createInitialProgress();
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) return JSON.parse(stored) as UserProgress;
  } catch { /* reset */ }
  return createInitialProgress();
}

function saveProgress(progress: UserProgress): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  } catch { /* full */ }
}

export function useProgress() {
  const [progress, setProgress] = useState<UserProgress>(createInitialProgress);
  const [pendingXPEvents, setPendingXPEvents] = useState<XPEvent[]>([]);
  const [levelUpEvent, setLevelUpEvent] = useState<LevelUpEvent | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const loaded = loadProgress();
    setProgress(loaded);
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (isLoaded) saveProgress(progress);
  }, [progress, isLoaded]);

  const addXP = useCallback((amount: number, reason: XPEvent["reason"] = "correct") => {
    setProgress((prev) => {
      const result = addXPToProgress(prev, amount);
      if (result.levelUp) setLevelUpEvent(result.levelUp);
      return result.progress;
    });
    setPendingXPEvents((prev) => [...prev, { amount, reason }]);
  }, []);

  const clearXPEvents = useCallback(() => setPendingXPEvents([]), []);
  const dismissLevelUp = useCallback(() => setLevelUpEvent(null), []);

  const completeExercise = useCallback(
    (languageId: string, topicId: string, score: number, total: number) => {
      addXP(25, "exercise_complete");
      setProgress((prev) => {
        const langProgress = prev.languageProgress[languageId] || { topicProgress: {} };
        const topicProgress = langProgress.topicProgress[topicId] || {
          completed: 0, total, bestScore: 0, level: 1,
        };
        const newCompleted = Math.min(topicProgress.completed + 1, total);
        const newBestScore = Math.max(topicProgress.bestScore, score);
        const scorePercentage = (score / total) * 100;
        const newLevel = Math.min(5, Math.max(1, Math.ceil(scorePercentage / 20)));
        return {
          ...prev,
          languageProgress: {
            ...prev.languageProgress,
            [languageId]: {
              topicProgress: {
                ...langProgress.topicProgress,
                [topicId]: { completed: newCompleted, total, bestScore: newBestScore, level: newLevel },
              },
            },
          },
        };
      });
    },
    [addXP]
  );

  const updateStreak = useCallback(() => {
    setProgress((prev) => {
      const result = checkStreak(prev.lastPracticeDate);
      const today = new Date().toISOString().split("T")[0];
      if (result.streak === 0) return { ...prev, lastPracticeDate: today };
      const newStreak = result.maintained ? prev.streak + result.streak : result.streak;
      return { ...prev, streak: newStreak, lastPracticeDate: today };
    });
  }, []);

  const resetProgress = useCallback(() => {
    const fresh = createInitialProgress();
    setProgress(fresh);
    saveProgress(fresh);
  }, []);

  return {
    progress, isLoaded, addXP, completeExercise, updateStreak, resetProgress,
    pendingXPEvents, clearXPEvents, levelUpEvent, dismissLevelUp,
  };
}
