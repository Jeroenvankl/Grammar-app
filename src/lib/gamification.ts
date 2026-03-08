import { UserProgress, LevelUpEvent } from "@/types/gamification";

export function createInitialProgress(): UserProgress {
  return {
    xp: 0,
    level: 1,
    streak: 0,
    lastPracticeDate: null,
    languageProgress: {},
  };
}

export function getXPForLevel(level: number): number {
  return level * 100;
}

export function calculateLevel(totalXP: number): number {
  let level = 1;
  let xpNeeded = getXPForLevel(level);
  let remaining = totalXP;
  while (remaining >= xpNeeded) {
    remaining -= xpNeeded;
    level++;
    xpNeeded = getXPForLevel(level);
  }
  return level;
}

export function getLevelProgress(totalXP: number): {
  current: number;
  needed: number;
  percentage: number;
} {
  let level = 1;
  let remaining = totalXP;
  let xpNeeded = getXPForLevel(level);
  while (remaining >= xpNeeded) {
    remaining -= xpNeeded;
    level++;
    xpNeeded = getXPForLevel(level);
  }
  return {
    current: remaining,
    needed: xpNeeded,
    percentage: Math.round((remaining / xpNeeded) * 100),
  };
}

export function calculateAnswerXP(
  isPerfect: boolean,
  streak: number
): number {
  let xp = 10;
  if (isPerfect) xp = 15;
  xp += Math.min(streak, 5) * 2;
  return xp;
}

export function addXP(
  progress: UserProgress,
  amount: number
): { progress: UserProgress; levelUp: LevelUpEvent | null } {
  const newXP = progress.xp + amount;
  const oldLevel = progress.level;
  const newLevel = calculateLevel(newXP);

  const levelUp: LevelUpEvent | null =
    newLevel > oldLevel
      ? { oldLevel, newLevel, totalXP: newXP }
      : null;

  return {
    progress: { ...progress, xp: newXP, level: newLevel },
    levelUp,
  };
}

export function checkStreak(
  lastPracticeDate: string | null
): { streak: number; maintained: boolean } {
  if (!lastPracticeDate) return { streak: 1, maintained: false };

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const last = new Date(lastPracticeDate);
  last.setHours(0, 0, 0, 0);

  const diffDays = Math.floor(
    (today.getTime() - last.getTime()) / (1000 * 60 * 60 * 24)
  );

  if (diffDays === 0) return { streak: 0, maintained: true };
  if (diffDays === 1) return { streak: 1, maintained: true };
  return { streak: 1, maintained: false };
}
