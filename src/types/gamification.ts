export interface TopicProgress {
  completed: number;
  total: number;
  bestScore: number;
  level: number;
}

export interface LanguageProgress {
  topicProgress: {
    [topicId: string]: TopicProgress;
  };
}

export interface UserProgress {
  xp: number;
  level: number;
  streak: number;
  lastPracticeDate: string | null;
  languageProgress: {
    [languageId: string]: LanguageProgress;
  };
}

export interface XPEvent {
  amount: number;
  reason: "correct" | "perfect" | "exercise_complete" | "streak_bonus";
}

export interface LevelUpEvent {
  oldLevel: number;
  newLevel: number;
  totalXP: number;
}
