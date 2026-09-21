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
  FileCode,
  Languages,
  ExternalLink,
  Volume2,
  VolumeX,
  CheckCircle2,
  RefreshCw
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
  const [activeTab, setActiveTab] = useState<"summary" | "concepts" | "formulas" | "exam" | "hindi" | "flashcards" | "raw">("summary");
  const [speakingHindi, setSpeakingHindi] = useState(false);
  const [selectedSubject, setSelectedSubject] = useState<string>("All");

  const subjects = ["All", ...Array.from(new Set(documents.map((d) => d.subject)))];

  const filteredDocs = documents.filter((doc) =>
    selectedSubject === "All" ? true : doc.subject === selectedSubject
  );

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
      {/* Sidebar: Documents Library */}
      <div className="lg:col-span-4 space-y-4">
        <div className="glass-panel rounded-2xl p-4 border border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm font-bold text-white flex items-center space-x-1.5">
                <BookOpen className="w-4 h-4 text-blue-400" />
                <span>Drive Notes Library</span>
              </h2>
              <p className="text-[11px] text-slate-400">
                {documents.length} college docs & notes loaded
              </p>
            </div>

            <button
              onClick={onOpenAddModal}
              className="flex items-center space-x-1 px-2.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-md shadow-blue-600/20 transition-all"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Drive File</span>
            </button>
          </div>

          {/* Subject Filter Chips */}
          <div className="flex items-center space-x-1.5 overflow-x-auto pb-1 scrollbar-none text-xs">
            {subjects.map((sub) => (
              <button
                key={sub}
                onClick={() => setSelectedSubject(sub)}
                className={`px-2 py-1 rounded-md text-[11px] font-medium whitespace-nowrap transition-colors ${
                  selectedSubject === sub
                    ? "bg-blue-600 text-white"
                    : "bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800"
                }`}
              >
                {sub}
              </button>
            ))}
          </div>

          {/* Documents List */}
          <div className="space-y-2 max-h-[600px] overflow-y-auto pr-1">
            {filteredDocs.map((doc) => {
              const isSelected = selectedDoc?.id === doc.id;
              return (
                <div
                  key={doc.id}
                  onClick={() => onSelectDoc(doc)}
                  className={`cursor-pointer rounded-xl p-3 border transition-all ${
                    isSelected
                      ? "bg-blue-600/10 border-blue-500/50 shadow-sm"
                      : "bg-slate-900/50 hover:bg-slate-800/60 border-slate-800/80 text-slate-400"
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="space-y-1">
                      <div className="flex items-center space-x-1.5">
                        <span className="text-[10px] uppercase font-bold px-1.5 py-0.5 rounded bg-slate-800 text-blue-400 border border-slate-700">
                          {doc.fileType}
                        </span>
                        <span className="text-[11px] text-slate-400">{doc.subject}</span>
                      </div>
                      <h3
                        className={`text-xs font-semibold line-clamp-2 ${
                          isSelected ? "text-white font-bold" : "text-slate-200"
                        }`}
                      >
                        {doc.title}
                      </h3>
                    </div>

                    <div className="text-right shrink-0">
                      <span className="text-[10px] text-slate-500 block">{doc.size}</span>
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
          </div>
        </div>
      </div>

      {/* Main Document Viewer & AI Tabs */}
      <div className="lg:col-span-8 space-y-4">
        {selectedDoc ? (
          <div className="glass-panel rounded-2xl p-6 border border-slate-800 space-y-6">
            {/* Document Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
              <div className="space-y-1">
                <div className="flex items-center space-x-2">
                  <span className="text-xs font-semibold uppercase px-2 py-0.5 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20">
                    {selectedDoc.subject}
                  </span>
                  <span className="text-xs text-slate-500">•</span>
                  <span className="text-xs text-slate-400">{selectedDoc.updatedAt}</span>
                  {selectedDoc.driveUrl && (
                    <a
                      href={selectedDoc.driveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center space-x-1 text-xs text-blue-400 hover:underline ml-2"
                    >
                      <span>Drive Link</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                </div>
                <h1 className="text-lg sm:text-xl font-bold text-white">
                  {selectedDoc.title}
                </h1>
              </div>

              <div className="flex items-center space-x-2">
                <button
                  onClick={() => onReSummarize(selectedDoc)}
                  disabled={isSummarizing}
                  className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 hover:bg-slate-800 text-xs font-medium text-slate-200 transition-colors disabled:opacity-50"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isSummarizing ? "animate-spin text-blue-400" : ""}`} />
                  <span>{isSummarizing ? "Synthesizing..." : "Re-Summarize"}</span>
                </button>
              </div>
            </div>

            {/* AI Assistant Tabs */}
            <div className="flex items-center space-x-1 overflow-x-auto pb-1 border-b border-slate-800 scrollbar-none">
              <button
                onClick={() => setActiveTab("summary")}
                className={`flex items-center space-x-1.5 px-3 py-2 rounded-t-lg text-xs font-medium border-b-2 transition-colors whitespace-nowrap ${
                  activeTab === "summary"
                    ? "border-blue-500 text-blue-400 bg-blue-500/5"
                    : "border-transparent text-slate-400 hover:text-slate-200"
                }`}
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Executive Summary</span>
              </button>

              <button
                onClick={() => setActiveTab("concepts")}
                className={`flex items-center space-x-1.5 px-3 py-2 rounded-t-lg text-xs font-medium border-b-2 transition-colors whitespace-nowrap ${
                  activeTab === "concepts"
                    ? "border-blue-500 text-blue-400 bg-blue-500/5"
                    : "border-transparent text-slate-400 hover:text-slate-200"
                }`}
              >
                <BookOpen className="w-3.5 h-3.5" />
                <span>Key Concepts</span>
              </button>

              <button
                onClick={() => setActiveTab("formulas")}
                className={`flex items-center space-x-1.5 px-3 py-2 rounded-t-lg text-xs font-medium border-b-2 transition-colors whitespace-nowrap ${
                  activeTab === "formulas"
                    ? "border-blue-500 text-blue-400 bg-blue-500/5"
                    : "border-transparent text-slate-400 hover:text-slate-200"
                }`}
              >
                <FileCode className="w-3.5 h-3.5" />
                <span>Formula Sheet</span>
              </button>

              <button
                onClick={() => setActiveTab("exam")}
                className={`flex items-center space-x-1.5 px-3 py-2 rounded-t-lg text-xs font-medium border-b-2 transition-colors whitespace-nowrap ${
                  activeTab === "exam"
                    ? "border-blue-500 text-blue-400 bg-blue-500/5"
                    : "border-transparent text-slate-400 hover:text-slate-200"
                }`}
              >
                <HelpCircle className="w-3.5 h-3.5" />
                <span>Exam Questions</span>
              </button>

              <button
                onClick={() => setActiveTab("hindi")}
                className={`flex items-center space-x-1.5 px-3 py-2 rounded-t-lg text-xs font-medium border-b-2 transition-colors whitespace-nowrap ${
                  activeTab === "hindi"
                    ? "border-amber-500 text-amber-400 bg-amber-500/5"
                    : "border-transparent text-slate-400 hover:text-slate-200"
                }`}
              >
                <Languages className="w-3.5 h-3.5 text-amber-400" />
                <span>हिन्दी Recap</span>
              </button>

              <button
                onClick={() => setActiveTab("flashcards")}
                className={`flex items-center space-x-1.5 px-3 py-2 rounded-t-lg text-xs font-medium border-b-2 transition-colors whitespace-nowrap ${
                  activeTab === "flashcards"
                    ? "border-emerald-500 text-emerald-400 bg-emerald-500/5"
                    : "border-transparent text-slate-400 hover:text-slate-200"
                }`}
              >
                <Layers className="w-3.5 h-3.5 text-emerald-400" />
                <span>Flashcards</span>
              </button>

              <button
                onClick={() => setActiveTab("raw")}
                className={`flex items-center space-x-1.5 px-3 py-2 rounded-t-lg text-xs font-medium border-b-2 transition-colors whitespace-nowrap ${
                  activeTab === "raw"
                    ? "border-slate-500 text-slate-300 bg-slate-800/30"
                    : "border-transparent text-slate-400 hover:text-slate-200"
                }`}
              >
                <FileText className="w-3.5 h-3.5" />
                <span>Raw Text</span>
              </button>
            </div>

            {/* Tab Content Display */}
            <div className="pt-2">
              {/* Tab 1: Executive Summary */}
              {activeTab === "summary" && (
                <div className="space-y-4">
                  <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-400">
                    High-Yield Takeaways
                  </h3>
                  <div className="space-y-2.5">
                    {summary?.executiveSummary.map((pt, i) => (
                      <div
                        key={i}
                        className="flex items-start space-x-3 p-3.5 rounded-xl bg-slate-900/60 border border-slate-800"
                      >
                        <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-blue-500/20 text-blue-400 text-xs font-bold">
                          {i + 1}
                        </span>
                        <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">
                          {pt}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Tab 2: Key Concepts */}
              {activeTab === "concepts" && (
                <div className="space-y-3">
                  {summary?.keyConcepts.map((item, i) => (
                    <div
                      key={i}
                      className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-1.5"
                    >
                      <h4 className="text-sm font-bold text-blue-300">
                        {item.title}
                      </h4>
                      <p className="text-xs text-slate-300 leading-relaxed">
                        {item.explanation}
                      </p>
                    </div>
                  ))}
                </div>
              )}

              {/* Tab 3: Formula Sheet */}
              {activeTab === "formulas" && (
                <div className="space-y-3">
                  <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-400">
                    Essential Formulas & Invariants
                  </h3>
                  <div className="grid grid-cols-1 gap-2.5">
                    {summary?.formulasAndDefinitions.map((f, i) => (
                      <div
                        key={i}
                        className="p-3 rounded-xl bg-slate-950 font-mono text-xs text-cyan-300 border border-cyan-900/30 flex items-center space-x-2"
                      >
                        <span className="text-slate-600 font-sans">#</span>
                        <span>{f}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Tab 4: Exam Questions */}
              {activeTab === "exam" && (
                <div className="space-y-3">
                  <h3 className="text-sm font-semibold uppercase tracking-wider text-amber-400">
                    Predicted University Exam Questions
                  </h3>
                  <div className="space-y-2">
                    {summary?.examImportantTopics.map((q, i) => (
                      <div
                        key={i}
                        className="p-3.5 rounded-xl bg-amber-500/5 border border-amber-500/20 flex items-start space-x-3"
                      >
                        <span className="text-amber-400 font-bold text-xs shrink-0">Q{i + 1}.</span>
                        <p className="text-xs sm:text-sm text-slate-200 font-medium leading-relaxed">
                          {q}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Tab 5: Hindi Quick Recap */}
              {activeTab === "hindi" && (
                <div className="p-5 rounded-2xl bg-amber-950/20 border border-amber-500/20 space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2 text-amber-400">
                      <Languages className="w-4 h-4" />
                      <span className="text-xs font-bold uppercase tracking-wider">
                        आसान हिन्दी सारांश (Quick Audio Recap)
                      </span>
                    </div>

                    <button
                      onClick={() => summary && handleSpeakHindi(summary.quickRecapHindi)}
                      className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg border text-xs font-semibold transition-colors ${
                        speakingHindi
                          ? "bg-amber-500/20 text-amber-300 border-amber-500/50"
                          : "bg-slate-900 text-slate-300 border-slate-700 hover:bg-slate-800"
                      }`}
                    >
                      {speakingHindi ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
                      <span>{speakingHindi ? "Stop Audio" : "Listen in Hindi"}</span>
                    </button>
                  </div>

                  <p className="text-sm sm:text-base text-slate-200 leading-relaxed font-serif">
                    {summary?.quickRecapHindi}
                  </p>
                </div>
              )}

              {/* Tab 6: Flashcards */}
              {activeTab === "flashcards" && (
                <FlashcardDeck cards={selectedDoc.flashcards || []} />
              )}

              {/* Tab 7: Raw Text */}
              {activeTab === "raw" && (
                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono text-slate-300 whitespace-pre-wrap max-h-[400px] overflow-y-auto leading-relaxed">
                  {selectedDoc.content}
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="glass-panel rounded-2xl p-12 border border-slate-800 text-center space-y-3">
            <BookOpen className="w-10 h-10 text-slate-600 mx-auto" />
            <h3 className="text-base font-semibold text-white">No document selected</h3>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              Select any college notes from the sidebar or click "Add Drive File" to import your own PDFs or Drive links.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
