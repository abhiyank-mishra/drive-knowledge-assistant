export type NewsCategory = "All" | "AI & ML" | "Software" | "Startups" | "Open Source" | "Cybersecurity" | string;

export interface NewsItem {
  id: string;
  title: string;
  category: "AI & ML" | "Software" | "Startups" | "Open Source" | "Cybersecurity" | string;
  summary: string;
  keyPoints?: string[];
  source: string;
  domain?: string;
  url?: string;
  publishedAt: string;
  isoTimestamp?: string;
  score?: number;
  commentsCount?: number;
  author?: string;
  sentiment?: "positive" | "neutral" | "urgent";
}

export interface DocumentItem {
  id: string;
  title: string;
  subject: string;
  source: "drive" | "upload" | "sample";
  driveUrl?: string;
  fileType: "pdf" | "doc" | "text" | "slides";
  size: string;
  updatedAt: string;
  content: string;
  summary?: DocumentSummary;
  flashcards?: Flashcard[];
}

export interface DocumentSummary {
  executiveSummary: string[];
  keyConcepts: { title: string; explanation: string }[];
  formulasAndDefinitions: string[];
  examImportantTopics: string[];
  quickRecapHindi: string;
}

export interface Flashcard {
  id: string;
  question: string;
  answer: string;
  difficulty: "easy" | "medium" | "hard";
  subject?: string;
}

export interface ChatMessage {
  id: string;
  sender: "user" | "assistant";
  text: string;
  timestamp: string;
  sources?: string[];
}
