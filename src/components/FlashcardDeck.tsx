"use client";

import React, { useState } from "react";
import { Flashcard } from "@/types";
import { ChevronLeft, ChevronRight, RotateCcw, Award } from "lucide-react";

interface FlashcardDeckProps {
  cards: Flashcard[];
}

export default function FlashcardDeck({ cards }: FlashcardDeckProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);

  if (!cards || cards.length === 0) {
    return (
      <div className="text-center py-12 text-slate-400">
        <p>No flashcards generated for this document yet.</p>
      </div>
    );
  }

  const currentCard = cards[currentIndex];

  const handleNext = () => {
    setIsFlipped(false);
    setCurrentIndex((prev) => (prev + 1) % cards.length);
  };

  const handlePrev = () => {
    setIsFlipped(false);
    setCurrentIndex((prev) => (prev - 1 + cards.length) % cards.length);
  };

  const getDifficultyColor = (diff: string) => {
    switch (diff) {
      case "easy":
        return "bg-emerald-500/10 text-emerald-400 border-emerald-500/20";
      case "hard":
        return "bg-rose-500/10 text-rose-400 border-rose-500/20";
      default:
        return "bg-amber-500/10 text-amber-400 border-amber-500/20";
    }
  };

  return (
    <div className="max-w-xl mx-auto space-y-4 py-4">
      {/* Progress & Difficulty */}
      <div className="flex items-center justify-between text-xs text-slate-400">
        <div className="flex items-center space-x-2">
          <span className="font-semibold text-white">Card {currentIndex + 1}</span>
          <span>of {cards.length}</span>
        </div>
        <span
          className={`px-2 py-0.5 rounded-md border text-[10px] font-semibold uppercase tracking-wider ${getDifficultyColor(
            currentCard.difficulty
          )}`}
        >
          {currentCard.difficulty}
        </span>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
        <div
          className="bg-blue-500 h-full transition-all duration-300"
          style={{ width: `${((currentIndex + 1) / cards.length) * 100}%` }}
        />
      </div>

      {/* Flip Card Container */}
      <div
        onClick={() => setIsFlipped(!isFlipped)}
        className="cursor-pointer min-h-[220px] rounded-2xl glass-panel border border-slate-800 p-8 flex flex-col justify-between items-center text-center hover:border-blue-500/40 transition-all duration-200 transform hover:scale-[1.01]"
      >
        <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
          {isFlipped ? "Answer" : "Question • Click card to reveal answer"}
        </span>

        <div className="my-auto">
          {isFlipped ? (
            <p className="text-base sm:text-lg font-medium text-emerald-300 leading-relaxed animate-fadeIn">
              {currentCard.answer}
            </p>
          ) : (
            <h3 className="text-base sm:text-lg font-bold text-white leading-relaxed">
              {currentCard.question}
            </h3>
          )}
        </div>

        <div className="flex items-center space-x-1 text-xs text-blue-400 font-medium">
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Flip Card</span>
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-between pt-2">
        <button
          onClick={handlePrev}
          className="flex items-center space-x-1 px-4 py-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:bg-slate-800 text-xs font-semibold transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Previous</span>
        </button>

        <button
          onClick={() => {
            setIsFlipped(false);
            setCurrentIndex(0);
          }}
          title="Restart Deck"
          className="p-2 text-slate-500 hover:text-slate-300 transition-colors"
        >
          <RotateCcw className="w-4 h-4" />
        </button>

        <button
          onClick={handleNext}
          className="flex items-center space-x-1 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-md shadow-blue-600/30 transition-colors"
        >
          <span>Next Card</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
