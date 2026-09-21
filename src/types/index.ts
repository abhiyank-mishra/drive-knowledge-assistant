export interface NewsItem {
  id: string;
  title: string;
  category: "AI & ML" | "Tech & Dev" | "Open Source" | "Cybersecurity" | "Campus";
  summary: string;
  keyPoints: string[];
  source: string;
  url?: string;
  publishedAt: string;
  sentiment: "positive" | "neutral" | "urgent";
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
