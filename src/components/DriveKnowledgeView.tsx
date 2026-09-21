"use client";

import React, { useState } from "react";
import { DocumentItem } from "@/types";
import {
  FileText,
  Plus,
  BookOpen,
  Sparkles,
  Layers,
  HelpCircle,
  Code2,
  ExternalLink,
  Volume2,
  VolumeX,
  CheckCircle2,
  RefreshCw,
  Search,
  Check
} from "lucide-react";
import FlashcardDeck from "./FlashcardDeck";

interface DriveKnowledgeViewProps {
  documents: DocumentItem[];
  selectedDoc: DocumentItem | null;
  onSelectDoc: (doc: DocumentItem) => void;
  onOpenAddModal: () => void;
  isSummarizing: boolean;
  onReSummarize: (doc: DocumentItem) => void;
}

export default function DriveKnowledgeView({
  documents,
  selectedDoc,
  onSelectDoc,
  onOpenAddModal,
  isSummarizing,
  onReSummarize,
}: DriveKnowledgeViewProps) {
  // 4 Clear Primary Tabs: Summary, Key Concepts, Formula Sheet, Exam Questions
  const [activeTab, setActiveTab] = useState<"summary" | "concepts" | "formulas" | "exam">("summary");
  const [showFlashcards, setShowFlashcards] = useState(false);
  const [speakingHindi, setSpeakingHindi] = useState(false);
  const [searchDocQuery, setSearchDocQuery] = useState("");
  const [selectedSubject, setSelectedSubject] = useState<string>("All");

  const subjects = ["All", ...Array.from(new Set(documents.map((d) => d.subject)))];

  const filteredDocs = documents.filter((doc) => {
    const matchesSubject = selectedSubject === "All" || doc.subject === selectedSubject;
    const matchesSearch =
      searchDocQuery.trim() === "" ||
      doc.title.toLowerCase().includes(searchDocQuery.toLowerCase()) ||
      doc.subject.toLowerCase().includes(searchDocQuery.toLowerCase());
    return matchesSubject && matchesSearch;
  });

  const handleSpeakHindi = (text: string) => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;

    if (speakingHindi) {
      window.speechSynthesis.cancel();
      setSpeakingHindi(false);
      return;
    }

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "hi-IN";
    utterance.rate = 0.95;
    utterance.onend = () => setSpeakingHindi(false);
    utterance.onerror = () => setSpeakingHindi(false);

    setSpeakingHindi(true);
    window.speechSynthesis.speak(utterance);
  };

  const summary = selectedDoc?.summary;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
      {/* Minimal Left Pane: Document Library */}
      <div className="lg:col-span-4 space-y-3">
        <div className="rounded-2xl bg-[#111115] border border-white/[0.08] p-4 space-y-3">
          {/* Header + Add Action */}
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm font-semibold text-white flex items-center space-x-1.5">
                <BookOpen className="w-4 h-4 text-blue-400" />
                <span>Drive Notes</span>
              </h2>
              <p className="text-[11px] text-zinc-500 font-mono">
                {documents.length} college docs loaded
              </p>
            </div>

            <button
              onClick={onOpenAddModal}
              className="flex items-center space-x-1 px-2.5 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-white text-xs font-medium border border-white/[0.08] transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Import</span>
            </button>
          </div>

          {/* Search Box */}
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3 h-3 text-zinc-500" />
            <input
              type="text"
              placeholder="Search notes..."
              value={searchDocQuery}
              onChange={(e) => setSearchDocQuery(e.target.value)}
              className="w-full pl-7 pr-2.5 py-1 rounded-lg bg-zinc-900 border border-white/[0.06] text-xs text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-zinc-500 transition-colors"
            />
          </div>

          {/* Subject Filter Chips */}
          <div className="flex items-center space-x-1 overflow-x-auto pb-1 scrollbar-none text-xs">
            {subjects.map((sub) => (
              <button
                key={sub}
                onClick={() => setSelectedSubject(sub)}
                className={`px-2 py-0.5 rounded-md text-[11px] font-medium whitespace-nowrap transition-colors ${
                  selectedSubject === sub
                    ? "bg-zinc-700 text-white"
                    : "bg-zinc-900/80 text-zinc-400 hover:text-zinc-200 border border-white/[0.04]"
                }`}
              >
                {sub}
              </button>
            ))}
          </div>

          {/* Documents List */}
          <div className="space-y-1.5 max-h-[520px] overflow-y-auto pr-1">
            {filteredDocs.map((doc) => {
              const isSelected = selectedDoc?.id === doc.id;
              return (
                <div
                  key={doc.id}
                  onClick={() => onSelectDoc(doc)}
                  className={`cursor-pointer rounded-xl p-3 border transition-all ${
                    isSelected
                      ? "bg-zinc-800/90 border-white/[0.18] shadow-sm text-white"
                      : "bg-zinc-900/50 hover:bg-zinc-800/40 border-white/[0.05] text-zinc-400 hover:text-zinc-300"
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="space-y-1">
                      <div className="flex items-center space-x-1.5">
                        <span className="text-[9px] uppercase font-mono px-1 py-0.2 rounded bg-zinc-950 text-blue-400 border border-zinc-800">
                          {doc.fileType}
                        </span>
                        <span className="text-[11px] text-zinc-400">{doc.subject}</span>
                      </div>
                      <h3
                        className={`text-xs font-medium line-clamp-2 ${
                          isSelected ? "text-white font-semibold" : "text-zinc-300"
                        }`}
                      >
                        {doc.title}
                      </h3>
                    </div>

                    <div className="text-right shrink-0">
                      <span className="text-[10px] text-zinc-500 font-mono block">{doc.size}</span>
                      {doc.summary && (
                        <span className="inline-flex items-center text-[10px] text-emerald-400 space-x-0.5">
                          <CheckCircle2 className="w-2.5 h-2.5" />
                          <span>Ready</span>
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}

            {filteredDocs.length === 0 && (
              <p className="text-xs text-zinc-500 text-center py-6">No documents found.</p>
            )}
          </div>
        </div>
      </div>

      {/* Clean Right Pane: 4 Clear Tabs */}
      <div className="lg:col-span-8 space-y-4">
        {selectedDoc ? (
          <div className="rounded-2xl bg-[#111115] border border-white/[0.08] p-5 sm:p-6 space-y-5">
            {/* Header: Title, Subject, Re-Summarize */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-white/[0.06]">
              <div className="space-y-1">
                <div className="flex items-center space-x-2 text-xs">
                  <span className="font-semibold uppercase tracking-wider px-2 py-0.5 rounded-md bg-blue-500/10 text-blue-400 border border-blue-500/20">
                    {selectedDoc.subject}
                  </span>
                  <span className="text-zinc-600">•</span>
                  <span className="text-zinc-400 font-mono text-[11px]">{selectedDoc.updatedAt}</span>
                  {selectedDoc.driveUrl && (
                    <a
                      href={selectedDoc.driveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center space-x-1 text-xs text-blue-400 hover:underline ml-2"
                    >
                      <span>Drive Source</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                </div>

                <h1 className="text-base sm:text-lg font-bold text-white">
                  {selectedDoc.title}
                </h1>
              </div>

              <div className="flex items-center space-x-2 shrink-0">
                <button
                  onClick={() => onReSummarize(selectedDoc)}
                  disabled={isSummarizing}
                  className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-zinc-900 border border-white/[0.08] hover:bg-zinc-800 text-xs font-medium text-zinc-300 hover:text-white transition-colors disabled:opacity-50"
                >
                  <RefreshCw className={`w-3 h-3 ${isSummarizing ? "animate-spin text-emerald-400" : ""}`} />
                  <span>{isSummarizing ? "Synthesizing..." : "Re-Summarize"}</span>
                </button>
              </div>
            </div>

            {/* 4 Clear Tabs: Summary, Key Concepts, Formula Sheet, Exam Questions */}
            <div className="flex items-center justify-between border-b border-white/[0.06] pb-1">
              <nav className="flex items-center space-x-1 overflow-x-auto scrollbar-none">
                <button
                  onClick={() => {
                    setActiveTab("summary");
                    setShowFlashcards(false);
                  }}
                  className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                    activeTab === "summary" && !showFlashcards
                      ? "bg-zinc-800 text-white font-semibold shadow-sm"
                      : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900"
                  }`}
                >
                  <Sparkles className="w-3.5 h-3.5 text-blue-400" />
                  <span>Summary</span>
                </button>

                <button
                  onClick={() => {
                    setActiveTab("concepts");
                    setShowFlashcards(false);
                  }}
                  className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                    activeTab === "concepts" && !showFlashcards
                      ? "bg-zinc-800 text-white font-semibold shadow-sm"
                      : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900"
                  }`}
                >
                  <BookOpen className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Key Concepts</span>
                </button>

                <button
                  onClick={() => {
                    setActiveTab("formulas");
                    setShowFlashcards(false);
                  }}
                  className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                    activeTab === "formulas" && !showFlashcards
                      ? "bg-zinc-800 text-white font-semibold shadow-sm"
                      : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900"
                  }`}
                >
                  <Code2 className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Formula Sheet</span>
                </button>

                <button
                  onClick={() => {
                    setActiveTab("exam");
                    setShowFlashcards(false);
                  }}
                  className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                    activeTab === "exam" && !showFlashcards
                      ? "bg-zinc-800 text-white font-semibold shadow-sm"
                      : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900"
                  }`}
                >
                  <HelpCircle className="w-3.5 h-3.5 text-amber-400" />
                  <span>Exam Questions</span>
                </button>
              </nav>

              {/* Flashcards Toggle Pill */}
              {selectedDoc.flashcards && selectedDoc.flashcards.length > 0 && (
                <button
                  onClick={() => setShowFlashcards(!showFlashcards)}
                  className={`flex items-center space-x-1 px-2.5 py-1 rounded-lg text-[11px] font-medium border transition-colors ${
                    showFlashcards
                      ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/40"
                      : "bg-zinc-900 text-zinc-400 hover:text-zinc-200 border-white/[0.06]"
                  }`}
                >
                  <Layers className="w-3 h-3 text-emerald-400" />
                  <span>Flashcards ({selectedDoc.flashcards.length})</span>
                </button>
              )}
            </div>

            {/* Flashcard Deck View when toggled */}
            {showFlashcards ? (
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs text-zinc-400">
                  <span>Interactive Flashcards Mode</span>
                  <button
                    onClick={() => setShowFlashcards(false)}
                    className="text-blue-400 hover:underline"
                  >
                    Back to Notes
                  </button>
                </div>
                <FlashcardDeck cards={selectedDoc.flashcards || []} />
              </div>
            ) : (
              /* Tab Content Area */
              <div className="space-y-4">
                {/* 1. Summary Tab */}
                {activeTab === "summary" && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
                        Executive Takeaways
                      </h3>

                      {summary?.quickRecapHindi && (
                        <button
                          onClick={() => handleSpeakHindi(summary.quickRecapHindi)}
                          className={`flex items-center space-x-1.5 px-2.5 py-1 rounded-lg text-[11px] font-medium border transition-colors ${
                            speakingHindi
                              ? "bg-amber-500/20 text-amber-300 border-amber-500/40"
                              : "bg-zinc-900 text-zinc-400 hover:text-zinc-200 border-white/[0.06]"
                          }`}
                        >
                          {speakingHindi ? <VolumeX className="w-3 h-3" /> : <Volume2 className="w-3 h-3 text-amber-400" />}
                          <span>{speakingHindi ? "Stop Audio" : "Listen in Hindi"}</span>
                        </button>
                      )}
                    </div>

                    <div className="space-y-2.5">
                      {summary?.executiveSummary.map((pt, i) => (
                        <div
                          key={i}
                          className="flex items-start space-x-3 p-3.5 rounded-xl bg-zinc-900/60 border border-white/[0.05]"
                        >
                          <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-blue-500/20 text-blue-400 text-xs font-bold font-mono">
                            {i + 1}
                          </span>
                          <p className="text-xs sm:text-sm text-zinc-200 leading-relaxed">
                            {pt}
                          </p>
                        </div>
                      ))}
                    </div>

                    {summary?.quickRecapHindi && (
                      <div className="p-4 rounded-xl bg-amber-950/15 border border-amber-500/15 space-y-1.5">
                        <div className="text-xs font-semibold text-amber-400 flex items-center space-x-1.5">
                          <span>हिन्दी में सारांश</span>
                        </div>
                        <p className="text-xs text-zinc-300 leading-relaxed font-serif">
                          {summary.quickRecapHindi}
                        </p>
                      </div>
                    )}
                  </div>
                )}

                {/* 2. Key Concepts Tab */}
                {activeTab === "concepts" && (
                  <div className="space-y-3">
                    <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
                      Core Concept Breakdown
                    </h3>
                    <div className="space-y-2.5">
                      {summary?.keyConcepts.map((item, i) => (
                        <div
                          key={i}
                          className="p-4 rounded-xl bg-zinc-900/60 border border-white/[0.05] space-y-1.5"
                        >
                          <h4 className="text-sm font-semibold text-emerald-300">
                            {item.title}
                          </h4>
                          <p className="text-xs text-zinc-300 leading-relaxed">
                            {item.explanation}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* 3. Formula Sheet Tab */}
                {activeTab === "formulas" && (
                  <div className="space-y-3">
                    <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
                      Formulas & System Invariants
                    </h3>
                    <div className="grid grid-cols-1 gap-2">
                      {summary?.formulasAndDefinitions.map((f, i) => (
                        <div
                          key={i}
                          className="p-3 rounded-xl bg-zinc-950 font-mono text-xs text-cyan-300 border border-cyan-900/30 flex items-center space-x-2.5"
                        >
                          <span className="text-zinc-600 select-none">#</span>
                          <span>{f}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* 4. Exam Questions Tab */}
                {activeTab === "exam" && (
                  <div className="space-y-3">
                    <h3 className="text-xs font-semibold uppercase tracking-wider text-amber-400">
                      Predicted University Exam Questions
                    </h3>
                    <div className="space-y-2">
                      {summary?.examImportantTopics.map((q, i) => (
                        <div
                          key={i}
                          className="p-3.5 rounded-xl bg-amber-500/5 border border-amber-500/15 flex items-start space-x-3"
                        >
                          <span className="text-amber-400 font-mono font-bold text-xs shrink-0">
                            Q{i + 1}.
                          </span>
                          <p className="text-xs sm:text-sm text-zinc-200 font-medium leading-relaxed">
                            {q}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        ) : (
          <div className="rounded-2xl bg-[#111115] border border-white/[0.08] p-12 text-center space-y-2">
            <BookOpen className="w-8 h-8 text-zinc-600 mx-auto" />
            <h3 className="text-sm font-semibold text-zinc-300">No document selected</h3>
            <p className="text-xs text-zinc-500 max-w-sm mx-auto">
              Select a document from the left library or click Import to load new notes.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
