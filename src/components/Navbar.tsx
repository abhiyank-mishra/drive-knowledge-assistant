"use client";

import React from "react";
import { Newspaper, HardDrive, Bot, RefreshCw, Settings, Github, Radio } from "lucide-react";

interface NavbarProps {
  activeTab: "news" | "drive" | "chat";
  setActiveTab: (tab: "news" | "drive" | "chat") => void;
  lastUpdatedText: string;
  isRefreshingNews: boolean;
  onRefreshNews: () => void;
  onOpenSettings: () => void;
  hasApiKey: boolean;
}

export default function Navbar({
  activeTab,
  setActiveTab,
  lastUpdatedText,
  isRefreshingNews,
  onRefreshNews,
  onOpenSettings,
  hasApiKey,
}: NavbarProps) {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-white/[0.08] bg-[#0a0a0c]/80 backdrop-blur-xl transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14">
          {/* Brand Logo with Pulsing Live Dot */}
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-2.5 group cursor-pointer" onClick={() => setActiveTab("news")}>
              <div className="relative flex items-center justify-center w-8 h-8 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-100 shadow-sm group-hover:border-zinc-700 transition-colors">
                <span className="font-bold text-sm tracking-tight bg-gradient-to-br from-white to-zinc-400 bg-clip-text text-transparent">
                  DM
                </span>
                {/* Live pulsing dot */}
                <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                </span>
              </div>

              <div className="flex items-center space-x-2">
                <span className="font-semibold text-sm tracking-tight text-white">
                  DriveMind
                </span>
                <span className="hidden sm:inline-flex items-center text-[10px] font-medium tracking-wide uppercase px-2 py-0.5 rounded-full bg-zinc-900 text-zinc-400 border border-zinc-800">
                  Live
                </span>
              </div>
            </div>
          </div>

          {/* 3 Clean Pill Tabs in Minimal Segmented Control */}
          <nav className="flex items-center p-1 rounded-full bg-zinc-900/90 border border-white/[0.08] shadow-inner">
            <button
              onClick={() => setActiveTab("news")}
              className={`flex items-center space-x-2 px-3 sm:px-4 py-1.5 rounded-full text-xs font-medium transition-all ${
                activeTab === "news"
                  ? "bg-zinc-800 text-white shadow-sm border border-white/[0.1]"
                  : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/40"
              }`}
            >
              <Radio className={`w-3.5 h-3.5 ${activeTab === "news" ? "text-emerald-400" : "text-zinc-500"}`} />
              <span className="whitespace-nowrap">Live Tech Feed</span>
            </button>

            <button
              onClick={() => setActiveTab("drive")}
              className={`flex items-center space-x-2 px-3 sm:px-4 py-1.5 rounded-full text-xs font-medium transition-all ${
                activeTab === "drive"
                  ? "bg-zinc-800 text-white shadow-sm border border-white/[0.1]"
                  : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/40"
              }`}
            >
              <HardDrive className={`w-3.5 h-3.5 ${activeTab === "drive" ? "text-blue-400" : "text-zinc-500"}`} />
              <span className="whitespace-nowrap">Drive Notes</span>
            </button>

            <button
              onClick={() => setActiveTab("chat")}
              className={`flex items-center space-x-2 px-3 sm:px-4 py-1.5 rounded-full text-xs font-medium transition-all ${
                activeTab === "chat"
                  ? "bg-zinc-800 text-white shadow-sm border border-white/[0.1]"
                  : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/40"
              }`}
            >
              <Bot className={`w-3.5 h-3.5 ${activeTab === "chat" ? "text-indigo-400" : "text-zinc-500"}`} />
              <span className="whitespace-nowrap">AI Copilot</span>
            </button>
          </nav>

          {/* Right Utilities: Last Updated Pill + Refresh Button + Settings + GitHub */}
          <div className="flex items-center space-x-2">
            {/* Last Updated Pill */}
            <div className="hidden md:flex items-center space-x-1.5 px-2.5 py-1 rounded-full bg-zinc-900/90 border border-white/[0.06] text-[11px] text-zinc-400 font-mono">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span>{lastUpdatedText}</span>
            </div>

            {/* Clean Refresh Button */}
            <button
              onClick={onRefreshNews}
              disabled={isRefreshingNews}
              title="Refresh live tech news now"
              className="flex items-center space-x-1 px-2.5 py-1.5 rounded-lg bg-zinc-900/80 hover:bg-zinc-800 border border-white/[0.08] text-xs text-zinc-300 hover:text-white transition-colors disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isRefreshingNews ? "animate-spin text-emerald-400" : ""}`} />
              <span className="hidden sm:inline text-[11px] font-medium">Refresh</span>
            </button>

            {/* API Settings */}
            <button
              onClick={onOpenSettings}
              title="Settings & API Key"
              className={`p-1.5 rounded-lg border text-xs transition-colors ${
                hasApiKey
                  ? "bg-zinc-900 text-emerald-400 border-emerald-500/30 hover:border-emerald-500/60"
                  : "bg-zinc-900 text-zinc-400 border-white/[0.08] hover:text-white hover:border-zinc-700"
              }`}
            >
              <Settings className="w-3.5 h-3.5" />
            </button>

            {/* GitHub Link */}
            <a
              href="https://github.com/abhiyank-mishra/drive-knowledge-assistant"
              target="_blank"
              rel="noopener noreferrer"
              title="View on GitHub"
              className="p-1.5 rounded-lg bg-zinc-900 border border-white/[0.08] text-zinc-400 hover:text-white hover:border-zinc-700 transition-colors"
            >
              <Github className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </div>
    </header>
  );
}
