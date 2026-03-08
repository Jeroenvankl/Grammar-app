export type WordRole =
  | "subject"
  | "verb"
  | "object"
  | "adjective"
  | "preposition"
  | "article"
  | "adverb"
  | "particle";

export interface WordBreakdown {
  word: string;
  role: WordRole;
  color: string;
  annotation?: string;
}

export interface GrammarRule {
  id: string;
  title: string;
  explanation: string;
  formula: string;
  examples: {
    italian: string;
    dutch: string;
    breakdown: WordBreakdown[];
  }[];
}

export type ExerciseType =
  | "zinsvolgorde"
  | "invullen"
  | "foutherkenning"
  | "vertalen";

export type DiagramType =
  | "wordOrder"
  | "conjugation"
  | "agreement"
  | "preposition"
  | "particle"
  | "wordOrderComparison";

export interface Exercise {
  id: string;
  type: ExerciseType;
  difficulty: 1 | 2 | 3 | 4 | 5;
  question: {
    nl: string;
    sentence: string;
    context?: string;
  };
  correctAnswer: string | string[];
  distractors?: string[];
  explanation: {
    nl: string;
    rule: string;
    diagramType: DiagramType;
    diagramData: Record<string, unknown>;
  };
  hints: string[];
}

export type TopicLevel = "beginner" | "gemiddeld" | "gevorderd";

export interface Topic {
  id: string;
  name: string;
  description: string;
  level: TopicLevel;
  order: number;
  exercises: Exercise[];
  grammarRules: GrammarRule[];
}

export interface Language {
  id: string;
  name: string;
  flag: string;
  topics: Topic[];
}
