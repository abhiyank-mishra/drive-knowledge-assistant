"use client";

import React, { useState, useEffect } from "react";
import { NewsItem } from "@/types";
import {
  ExternalLink,
  Volume2,
  VolumeX,
  Share2,
  Check,
  Radio,
  Clock,
  MessageSquare,
  ArrowUpRight,
  TrendingUp,
  Search,
  Sparkles,
  Layers,
  Cpu,
  Terminal,
  Rocket,
  Code,
  ShieldCheck,
} from "lucide-react";

interface HourlyNewsFeedProps {
  news: NewsItem[];
  isRefreshing: boolean;
  onRefresh: () => void;
  updatedAt: string;
  source: string;
  nextSyncSeconds: number;
}

export default function HourlyNewsFeed({
  news,
  isRefreshing,
  onRefresh,
  updatedAt,
  source,
  nextSyncSeconds,
}: HourlyNewsFeedProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [speakingId, setSpeakingId] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Live countdown formatting: MM:SS
  const formatCountdown = (totalSec: number) => {
    const mins = Math.floor(Math.max(0, totalSec) / 60);
    const secs = Math.max(0, totalSec) % 60;
    return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
  };

  const categories = ["All", "AI & ML", "Software", "Startups", "Open Source"];

  const filteredNews = news.filter((item) => {
    const matchesCategory =
      selectedCategory === "All" ||
      item.category.toLowerCase() === selectedCategory.toLowerCase() ||
      (selectedCategory === "Software" && (item.category === "Tech & Dev" || item.category === "Software"));

    const matchesSearch =
      searchQuery.trim() === "" ||
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.domain && item.domain.toLowerCase().includes(searchQuery.toLowerCase()));

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
    const text = `${item.title}\n${item.url || ""}`;
    navigator.clipboard.writeText(text);
    setCopiedId(item.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const getCategoryBadgeClass = (category: string) => {
    switch (category) {
      case "AI & ML":
        return "bg-purple-500/10 text-purple-400 border-purple-500/20";
      case "Software":
      case "Tech & Dev":
        return "bg-blue-500/10 text-blue-400 border-blue-500/20";
      case "Startups":
        return "bg-amber-500/10 text-amber-400 border-amber-500/20";
      case "Open Source":
        return "bg-emerald-500/10 text-emerald-400 border-emerald-500/20";
      case "Cybersecurity":
        return "bg-rose-500/10 text-rose-400 border-rose-500/20";
      default:
        return "bg-zinc-800/80 text-zinc-300 border-zinc-700/50";
    }
  };

  return (
    <div className="space-y-6">
      {/* Big Clean Header (Linear / Vercel style) */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-2 border-b border-white/[0.06]">
        <div className="space-y-2">
          <div className="inline-flex items-center space-x-2 px-2.5 py-1 rounded-full bg-zinc-900 border border-white/[0.08] text-[11px] text-zinc-400">
            <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-ping" />
            <span className="font-semibold text-emerald-400 uppercase tracking-wide">
              Live Real-Time Feed
            </span>
            <span className="text-zinc-600">•</span>
            <span className="text-zinc-400">Zero Auth • Live Hacker News & Dev.to APIs</span>
          </div>

          <div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
              Live Tech & AI Feed
            </h1>
            <p className="text-sm text-zinc-400 mt-0.5">
              Real-time tech stories auto-updating hourly • Syncing actual headlines from around the world
            </p>
          </div>
        </div>

        {/* Live Countdown Badge */}
        <div className="flex items-center space-x-3 shrink-0">
          <div className="flex items-center space-x-2 px-3.5 py-2 rounded-xl bg-[#111115] border border-white/[0.08] text-xs">
            <Clock className="w-3.5 h-3.5 text-zinc-400" />
            <span className="text-zinc-400">Next hourly sync in</span>
            <span className="font-mono font-semibold text-emerald-400">
              {formatCountdown(nextSyncSeconds)}
            </span>
          </div>
        </div>
      </div>

      {/* Category Pills & Search Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        {/* Category Pills */}
        <div className="flex items-center space-x-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
          {categories.map((cat) => {
            const isSelected = selectedCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-all whitespace-nowrap ${
                  isSelected
                    ? "bg-white text-zinc-950 font-semibold shadow-sm"
                    : "bg-zinc-900/90 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/80 border border-white/[0.06]"
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>

        {/* Search Input */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-500 pointer-events-none" />
          <input
            type="text"
            placeholder="Search live stories & domains..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full sm:w-64 pl-8 pr-3 py-1.5 rounded-xl bg-zinc-900/90 border border-white/[0.08] text-xs text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-zinc-500 transition-colors"
          />
        </div>
      </div>

      {/* Elegant News Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredNews.map((item) => (
          <article
            key={item.id}
            className="group relative flex flex-col justify-between p-5 rounded-2xl bg-[#111115] border border-white/[0.08] hover:border-white/[0.18] hover:bg-[#14141a] transition-all duration-200 shadow-sm"
          >
            <div className="space-y-3">
              {/* Header: Category Badge + Published Time + Domain */}
              <div className="flex items-center justify-between gap-2 text-xs">
                <div className="flex items-center space-x-2">
                  <span
                    className={`text-[10px] font-semibold uppercase px-2 py-0.5 rounded-md border ${getCategoryBadgeClass(
                      item.category
                    )}`}
                  >
                    {item.category}
                  </span>

                  {item.domain && (
                    <span className="text-[11px] text-zinc-400 font-mono flex items-center space-x-1">
                      <span className="text-zinc-600">via</span>
                      <span className="text-zinc-300 font-medium">{item.domain}</span>
                    </span>
                  )}
                </div>

                <div className="flex items-center space-x-1 text-zinc-500 text-[11px] font-mono shrink-0">
                  <Clock className="w-3 h-3 text-zinc-500" />
                  <span>{item.publishedAt}</span>
                </div>
              </div>

              {/* Headline */}
              <h2 className="text-sm sm:text-base font-semibold text-zinc-100 group-hover:text-white leading-snug">
                <a
                  href={item.url || "#"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:underline flex items-start gap-1"
                >
                  <span>{item.title}</span>
                </a>
              </h2>

              {/* 2-line Description */}
              <p className="text-xs text-zinc-400 line-clamp-2 leading-relaxed">
                {item.summary}
              </p>

              {/* Key Takeaways (if available) */}
              {item.keyPoints && item.keyPoints.length > 0 && (
                <div className="pt-2 border-t border-white/[0.05] space-y-1">
                  <ul className="space-y-1 text-[11px] text-zinc-400">
                    {item.keyPoints.slice(0, 2).map((pt, i) => (
                      <li key={i} className="flex items-start space-x-1.5">
                        <span className="text-emerald-400 text-xs font-bold leading-none mt-0.5">›</span>
                        <span className="line-clamp-1">{pt}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Card Bottom: Scores/Discussion + Action Buttons */}
            <div className="pt-3 mt-3 border-t border-white/[0.06] flex items-center justify-between gap-2">
              <div className="flex items-center space-x-3 text-[11px] text-zinc-400 font-mono">
                {item.score !== undefined && item.score > 0 && (
                  <span className="flex items-center space-x-1 text-zinc-300">
                    <TrendingUp className="w-3 h-3 text-emerald-400" />
                    <span>{item.score} pts</span>
                  </span>
                )}
                {item.commentsCount !== undefined && item.commentsCount > 0 && (
                  <span className="flex items-center space-x-1 text-zinc-400">
                    <MessageSquare className="w-3 h-3 text-zinc-500" />
                    <span>{item.commentsCount}</span>
                  </span>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex items-center space-x-1.5">
                {/* TTS Audio */}
                <button
                  onClick={() => handleSpeak(item)}
                  title={speakingId === item.id ? "Stop voice" : "Listen to summary"}
                  className={`p-1.5 rounded-lg border text-xs transition-colors ${
                    speakingId === item.id
                      ? "bg-purple-500/20 text-purple-300 border-purple-500/40"
                      : "text-zinc-400 hover:text-zinc-200 border-white/[0.06] hover:bg-zinc-800"
                  }`}
                >
                  {speakingId === item.id ? (
                    <VolumeX className="w-3.5 h-3.5 animate-pulse text-purple-400" />
                  ) : (
                    <Volume2 className="w-3.5 h-3.5" />
                  )}
                </button>

                {/* Copy Link */}
                <button
                  onClick={() => handleCopy(item)}
                  title="Copy headline & link"
                  className="p-1.5 rounded-lg border border-white/[0.06] text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800 transition-colors"
                >
                  {copiedId === item.id ? (
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                  ) : (
                    <Share2 className="w-3.5 h-3.5" />
                  )}
                </button>

                {/* Read Article Direct External Link */}
                {item.url && (
                  <a
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-white/[0.08] text-xs font-medium text-zinc-200 hover:text-white transition-colors"
                  >
                    <span>Read Article</span>
                    <ArrowUpRight className="w-3.5 h-3.5 text-zinc-400" />
                  </a>
                )}
              </div>
            </div>
          </article>
        ))}
      </div>

      {filteredNews.length === 0 && (
        <div className="p-12 text-center rounded-2xl bg-[#111115] border border-white/[0.08] space-y-2">
          <p className="text-sm font-semibold text-zinc-300">No stories match your filter</p>
          <p className="text-xs text-zinc-500">Try choosing "All" or clearing your search keywords.</p>
        </div>
      )}
    </div>
  );
}
