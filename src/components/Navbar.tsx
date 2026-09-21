"use client";

import React, { useState, useEffect } from "react";
import { Sparkles, Clock, Settings, HardDrive, Newspaper, MessageSquareCode, Github, RefreshCw, ExternalLink } from "lucide-react";

interface NavbarProps {
  activeTab: "news" | "drive" | "chat";
  setActiveTab: (tab: "news" | "drive" | "chat") => void;
  nextUpdateMinutes: number;
  isRefreshingNews: boolean;
  onRefreshNews: () => void;
  onOpenSettings: () => void;
  hasApiKey: boolean;
}

export default function Navbar({
  activeTab,
  setActiveTab,
  nextUpdateMinutes,
  isRefreshingNews,
  onRefreshNews,
  onOpenSettings,
  hasApiKey,
}: NavbarProps) {
  const [time, setTime] = useState("");

  useEffect(() => {
    const updateTime = () => {
      setTime(new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" }));
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <header className="sticky top-0 z-40 border-b border-slate-800/80 glass-panel bg-slate-950/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand / Logo */}
          <div className="flex items-center space-x-3">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-500 to-cyan-400 p-[2px] shadow-lg shadow-blue-500/20">
              <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-cyan-400 animate-pulse" />
              </div>
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-bold text-lg tracking-tight bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">
                  DriveMind<span className="text-blue-400">.AI</span>
                </span>
                <span className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20">
                  Gemini Enterprise
                </span>
              </div>
              <p className="text-xs text-slate-400 hidden sm:block">
                Autonomous Drive Knowledge & Hourly Agent Hub
              </p>
            </div>
          </div>

          {/* Navigation Tabs */}
          <nav className="flex items-center space-x-1 bg-slate-900/90 p-1 rounded-xl border border-slate-800">
            <button
              onClick={() => setActiveTab("news")}
              className={`flex items-center space-x-2 px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-all ${
                activeTab === "news"
                  ? "bg-blue-600 text-white shadow-md shadow-blue-600/30"
                  : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/50"
              }`}
            >
              <Newspaper className="w-4 h-4" />
              <span>Hourly News</span>
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            </button>

            <button
              onClick={() => setActiveTab("drive")}
              className={`flex items-center space-x-2 px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-all ${
                activeTab === "drive"
                  ? "bg-blue-600 text-white shadow-md shadow-blue-600/30"
                  : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/50"
              }`}
            >
              <HardDrive className="w-4 h-4" />
              <span>Drive Notes</span>
            </button>

            <button
              onClick={() => setActiveTab("chat")}
              className={`flex items-center space-x-2 px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-all ${
                activeTab === "chat"
                  ? "bg-blue-600 text-white shadow-md shadow-blue-600/30"
                  : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/50"
              }`}
            >
              <MessageSquareCode className="w-4 h-4" />
              <span>Agent Copilot</span>
            </button>
          </nav>

          {/* Controls & Status */}
          <div className="flex items-center space-x-3">
            {/* Live Clock & Auto-sync badge */}
            <div className="hidden md:flex items-center space-x-2 px-3 py-1 rounded-lg bg-slate-900/60 border border-slate-800 text-xs text-slate-300">
              <Clock className="w-3.5 h-3.5 text-blue-400" />
              <span>{time}</span>
              <span className="text-slate-600">|</span>
              <span className="text-slate-400">Next sync in {nextUpdateMinutes}m</span>
              <button
                onClick={onRefreshNews}
                disabled={isRefreshingNews}
                title="Force refresh news now"
                className="p-1 hover:text-blue-400 transition-colors"
              >
                <RefreshCw className={`w-3 h-3 ${isRefreshingNews ? "animate-spin text-blue-400" : ""}`} />
              </button>
            </div>

            {/* Live Vertex Enterprise Session Button */}
            <a
              href="https://vertexaisearch.cloud.google.com/home/cid/167338f8-6657-45e2-b5d2-48ef44228600/r/agent/9268429337751159874/session/-?hl=en_US"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-gradient-to-r from-cyan-500/20 to-blue-600/20 border border-cyan-500/40 text-cyan-300 hover:border-cyan-400 hover:bg-cyan-500/30 transition-all shadow-sm"
              title="Open Google Enterprise Agent Workspace"
            >
              <Sparkles className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
              <span className="hidden md:inline">Live Enterprise Agent</span>
              <ExternalLink className="w-3 h-3 ml-0.5" />
            </a>

            {/* API Settings Trigger */}
            <button
              onClick={onOpenSettings}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${
                hasApiKey
                  ? "bg-slate-900 text-emerald-400 border-emerald-500/30 hover:border-emerald-500/60"
                  : "bg-amber-500/10 text-amber-300 border-amber-500/30 hover:bg-amber-500/20"
              }`}
            >
              <Settings className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">{hasApiKey ? "Connected" : "Set API Key"}</span>
            </button>

            {/* GitHub Repo Button */}
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800/80 transition-colors"
              title="View on GitHub"
            >
              <Github className="w-4 h-4" />
            </a>
          </div>
        </div>
      </div>
    </header>
  );
}
