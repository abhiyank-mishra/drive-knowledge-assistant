"use client";

import React, { useState } from "react";
import { NewsItem } from "@/types";
import { Sparkles, RefreshCw, Volume2, VolumeX, ExternalLink, Share2, Check, Flame, ShieldAlert, Cpu, Code2, GraduationCap } from "lucide-react";

interface HourlyNewsFeedProps {
  news: NewsItem[];
  isRefreshing: boolean;
  onRefresh: () => void;
  updatedAt: string;
  source: string;
}

export default function HourlyNewsFeed({
  news,
  isRefreshing,
  onRefresh,
  updatedAt,
  source,
}: HourlyNewsFeedProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [speakingId, setSpeakingId] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const categories = ["All", "AI & ML", "Tech & Dev", "Open Source", "Cybersecurity", "Campus"];

  const filteredNews = news.filter((item) => {
    const matchesCategory = selectedCategory === "All" || item.category === selectedCategory;
    const matchesSearch =
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.summary.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleSpeak = (item: NewsItem) => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;

    if (speakingId === item.id) {
      window.speechSynthesis.cancel();
      setSpeakingId(null);
      return;
    }

    window.speechSynthesis.cancel();
    const textToSpeak = `${item.title}. ${item.summary}`;
    const utterance = new SpeechSynthesisUtterance(textToSpeak);
    utterance.rate = 1.0;
    utterance.onend = () => setSpeakingId(null);
    utterance.onerror = () => setSpeakingId(null);

    setSpeakingId(item.id);
    window.speechSynthesis.speak(utterance);
  };

  const handleCopy = (item: NewsItem) => {
    navigator.clipboard.writeText(`${item.title}\n${item.summary}`);
    setCopiedId(item.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "AI & ML":
        return <Cpu className="w-3.5 h-3.5 text-blue-400" />;
      case "Tech & Dev":
        return <Code2 className="w-3.5 h-3.5 text-emerald-400" />;
      case "Cybersecurity":
        return <ShieldAlert className="w-3.5 h-3.5 text-rose-400" />;
      case "Campus":
        return <GraduationCap className="w-3.5 h-3.5 text-amber-400" />;
      default:
        return <Flame className="w-3.5 h-3.5 text-indigo-400" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-2xl glass-panel p-6 border border-blue-500/20 bg-gradient-to-r from-blue-950/40 via-slate-900/60 to-indigo-950/40">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-ping" />
              <span className="text-xs font-semibold uppercase tracking-wider text-emerald-400">
                Live Hourly Feed
              </span>
              <span className="text-xs text-slate-500">•</span>
              <span className="text-xs text-slate-400">
                Last generated at <strong className="text-slate-200">{updatedAt || "Current Hour"}</strong> ({source})
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
              Autonomous AI News Briefing
            </h1>
            <p className="text-sm text-slate-300 max-w-2xl">
              Har 1 ghante me Gemini Enterprise autonomous agent trending tech breakthroughs, campus hiring, aur open-source releases scan karke synthesize karta hai.
            </p>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={onRefresh}
              disabled={isRefreshing}
              className="flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-sm font-semibold shadow-lg shadow-blue-500/25 transition-all transform active:scale-95 disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${isRefreshing ? "animate-spin" : ""}`} />
              <span>{isRefreshing ? "Agent Working..." : "Trigger New Edition"}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        {/* Category Chips */}
        <div className="flex items-center space-x-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
                selectedCategory === cat
                  ? "bg-blue-600 text-white shadow-sm"
                  : "bg-slate-900/80 text-slate-400 hover:text-slate-200 hover:bg-slate-800 border border-slate-800"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative">
          <input
            type="text"
            placeholder="Search news & keywords..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full sm:w-64 px-3 py-1.5 rounded-lg bg-slate-900/80 border border-slate-800 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-colors"
          />
        </div>
      </div>

      {/* News Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredNews.map((item) => (
          <article
            key={item.id}
            className="glass-panel glass-panel-hover rounded-xl p-5 flex flex-col justify-between space-y-4 border border-slate-800/80"
          >
            <div className="space-y-2.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-1.5 px-2 py-0.5 rounded-full bg-slate-800/80 border border-slate-700/50 text-[11px] font-medium text-slate-300">
                  {getCategoryIcon(item.category)}
                  <span>{item.category}</span>
                </div>

                <div className="flex items-center space-x-1.5 text-slate-400 text-xs">
                  <span>{item.publishedAt}</span>
                </div>
              </div>

              <h2 className="text-base font-bold text-slate-100 hover:text-blue-300 transition-colors line-clamp-2">
                {item.title}
              </h2>

              <p className="text-xs text-slate-300 leading-relaxed">
                {item.summary}
              </p>

              {/* Key Takeaways */}
              {item.keyPoints && item.keyPoints.length > 0 && (
                <div className="pt-2 border-t border-slate-800/60 space-y-1.5">
                  <div className="flex items-center space-x-1 text-[11px] font-semibold uppercase tracking-wider text-blue-400">
                    <Sparkles className="w-3 h-3" />
                    <span>Key Takeaways</span>
                  </div>
                  <ul className="space-y-1 text-[11px] text-slate-400">
                    {item.keyPoints.map((point, idx) => (
                      <li key={idx} className="flex items-start space-x-1.5">
                        <span className="text-blue-400 font-bold">•</span>
                        <span>{point}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Card Footer: Source & Action Buttons */}
            <div className="flex items-center justify-between pt-3 border-t border-slate-800/60 text-xs">
              <span className="text-slate-400 font-medium truncate max-w-[150px]">
                {item.source}
              </span>

              <div className="flex items-center space-x-2">
                {/* Audio Listen */}
                <button
                  onClick={() => handleSpeak(item)}
                  title={speakingId === item.id ? "Stop Listening" : "Listen to briefing"}
                  className={`p-1.5 rounded-lg border transition-colors ${
                    speakingId === item.id
                      ? "bg-blue-600/20 text-blue-400 border-blue-500/40"
                      : "text-slate-400 hover:text-slate-200 border-slate-800 hover:bg-slate-800"
                  }`}
                >
                  {speakingId === item.id ? (
                    <VolumeX className="w-3.5 h-3.5 animate-pulse" />
                  ) : (
                    <Volume2 className="w-3.5 h-3.5" />
                  )}
                </button>

                {/* Copy Summary */}
                <button
                  onClick={() => handleCopy(item)}
                  title="Copy Headline & Summary"
                  className="p-1.5 text-slate-400 hover:text-slate-200 rounded-lg border border-slate-800 hover:bg-slate-800 transition-colors"
                >
                  {copiedId === item.id ? (
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                  ) : (
                    <Share2 className="w-3.5 h-3.5" />
                  )}
                </button>

                {item.url && (
                  <a
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center space-x-1 text-blue-400 hover:text-blue-300 font-medium px-2 py-1 rounded-lg hover:bg-blue-500/10 transition-colors"
                  >
                    <span>Read</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                )}
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
