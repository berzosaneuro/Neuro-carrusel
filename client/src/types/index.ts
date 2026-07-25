export interface Level {
  id: string;
  title: string;
  description: string;
}

export interface UnitStatus {
  id: string;
  level: string;
  order: number;
  title: string;
  subtitle: string;
  locked: boolean;
  completed: boolean;
  bestScore: number;
  totalQuestions: number;
  attempts: number;
}

export interface VocabItem {
  word: string;
  translation: string;
  example: string;
}

export interface GrammarPoint {
  title: string;
  explanation: string;
  examples: string[];
}

export interface DialogueLine {
  speaker: string;
  text: string;
}

export interface ComprehensionQuestion {
  question: string;
  options: string[];
  answer: number;
}

export interface Dialogue {
  title: string;
  lines: DialogueLine[];
  comprehension: ComprehensionQuestion[];
}

export type QuizQuestion =
  | { type: 'mc'; question: string; options: string[]; answer: number }
  | { type: 'fill'; question: string; answer: string };

export interface Unit {
  id: string;
  level: string;
  order: number;
  title: string;
  subtitle: string;
  vocabulary: VocabItem[];
  grammar: GrammarPoint;
  dialogue: Dialogue;
  quiz: QuizQuestion[];
}

export interface User {
  id: number;
  name: string;
  email: string;
  currentStreak: number;
  bestStreak: number;
}
