"use client";

import React, { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import HourlyNewsFeed from "@/components/HourlyNewsFeed";
import DriveKnowledgeView from "@/components/DriveKnowledgeView";
import AgentChatDrawer from "@/components/AgentChatDrawer";
import AddDriveModal from "@/components/AddDriveModal";
import SettingsModal from "@/components/SettingsModal";
import { SAMPLE_DOCUMENTS } from "@/lib/mockData";
import { INITIAL_NEWS } from "@/lib/newsData";
import { DocumentItem, NewsItem } from "@/types";

export default function Home() {
  const [activeTab, setActiveTab] = useState<"news" | "drive" | "chat">("news");
  const [news, setNews] = useState<NewsItem[]>(INITIAL_NEWS);
  const [isRefreshingNews, setIsRefreshingNews] = useState(false);
  const [newsUpdatedAt, setNewsUpdatedAt] = useState("Just now");
  const [lastFetchTimestamp, setLastFetchTimestamp] = useState(Date.now());
  const [newsSource, setNewsSource] = useState("Live Hacker News & Dev.to");
  const [nextSyncSeconds, setNextSyncSeconds] = useState(3600); // 60 minutes = 3600 seconds
  const [lastUpdatedText, setLastUpdatedText] = useState("Updated just now");

  // Documents State
  const [documents, setDocuments] = useState<DocumentItem[]>(SAMPLE_DOCUMENTS);
  const [selectedDoc, setSelectedDoc] = useState<DocumentItem | null>(SAMPLE_DOCUMENTS[0]);
  const [isSummarizing, setIsSummarizing] = useState(false);

  // Modals & Settings
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [apiKey, setApiKey] = useState("");

  // Load API key and custom docs from localStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedKey = localStorage.getItem("drivemind_api_key");
      if (savedKey) setApiKey(savedKey);

      const savedDocs = localStorage.getItem("drivemind_documents");
      if (savedDocs) {
        try {
          const parsed = JSON.parse(savedDocs);
          if (Array.isArray(parsed) && parsed.length > 0) {
            setDocuments(parsed);
            setSelectedDoc(parsed[0]);
          }
        } catch (e) {
          console.error("Failed to load saved docs:", e);
        }
      }
    }
  }, []);

  // Compute live relative "Updated Xm ago" string for the navbar
  useEffect(() => {
    const updateRelativePill = () => {
      const diffMs = Date.now() - lastFetchTimestamp;
      const diffMin = Math.floor(diffMs / 60000);
      if (diffMin < 1) {
        setLastUpdatedText("Updated just now");
      } else {
        setLastUpdatedText(`Updated ${diffMin}m ago`);
      }
    };

    updateRelativePill();
    const pillTimer = setInterval(updateRelativePill, 30000);
    return () => clearInterval(pillTimer);
  }, [lastFetchTimestamp]);

  // Fetch real live news
  const fetchHourlyNews = async (forceRefresh = false) => {
    setIsRefreshingNews(true);
    try {
      const url = `/api/news${forceRefresh ? "?refresh=true" : ""}${
        apiKey ? `&apiKey=${encodeURIComponent(apiKey)}` : ""
      }`;
      const res = await fetch(url);
      const data = await res.json();
      if (data.success && Array.isArray(data.news)) {
        setNews(data.news);
        setNewsUpdatedAt(data.updatedAt);
        setLastFetchTimestamp(Date.now());
        setNewsSource(data.source || "Live Hacker News & Dev.to");
        setNextSyncSeconds(3600);
      }
    } catch (err) {
      console.error("Hourly news fetch error:", err);
    } finally {
      setIsRefreshingNews(false);
    }
  };

  // Initial fetch and 1-second ticking countdown timer
  useEffect(() => {
    fetchHourlyNews();

    const timer = setInterval(() => {
      setNextSyncSeconds((prev) => {
        if (prev <= 1) {
          fetchHourlyNews(true);
          return 3600;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [apiKey]);

  const handleSaveApiKey = (key: string) => {
    setApiKey(key);
    if (typeof window !== "undefined") {
      localStorage.setItem("drivemind_api_key", key);
    }
  };

  const handleAddDocument = (newDoc: DocumentItem) => {
    const updated = [newDoc, ...documents];
    setDocuments(updated);
    setSelectedDoc(newDoc);
    if (typeof window !== "undefined") {
      localStorage.setItem("drivemind_documents", JSON.stringify(updated));
    }
    handleSummarize(newDoc);
  };

  const handleSummarize = async (doc: DocumentItem) => {
    setIsSummarizing(true);
    try {
      const res = await fetch("/api/gemini/summarize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: doc.title,
          subject: doc.subject,
          content: doc.content,
          apiKey,
        }),
      });
      const data = await res.json();
      if (data.success && data.summary) {
        const updatedDoc = { ...doc, summary: data.summary };
        const updatedList = documents.map((d) => (d.id === doc.id ? updatedDoc : d));
        setDocuments(updatedList);
        setSelectedDoc(updatedDoc);
        if (typeof window !== "undefined") {
          localStorage.setItem("drivemind_documents", JSON.stringify(updatedList));
        }
      }
    } catch (err) {
      console.error("Failed to summarize:", err);
    } finally {
      setIsSummarizing(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#0a0a0c] text-zinc-100 selection:bg-zinc-800 selection:text-white">
      {/* Subtle ambient gradient mesh in background */}
      <div className="fixed inset-0 pointer-events-none gradient-glow z-0" />

      {/* Crystal Clear Minimalist Navbar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        lastUpdatedText={lastUpdatedText}
        isRefreshingNews={isRefreshingNews}
        onRefreshNews={() => fetchHourlyNews(true)}
        onOpenSettings={() => setIsSettingsOpen(true)}
        hasApiKey={!!apiKey}
      />

      {/* Main App Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 relative z-10">
        {activeTab === "news" && (
          <HourlyNewsFeed
            news={news}
            isRefreshing={isRefreshingNews}
            onRefresh={() => fetchHourlyNews(true)}
            updatedAt={newsUpdatedAt}
            source={newsSource}
            nextSyncSeconds={nextSyncSeconds}
          />
        )}

        {activeTab === "drive" && (
          <DriveKnowledgeView
            documents={documents}
            selectedDoc={selectedDoc}
            onSelectDoc={(doc) => setSelectedDoc(doc)}
            onOpenAddModal={() => setIsAddModalOpen(true)}
            isSummarizing={isSummarizing}
            onReSummarize={handleSummarize}
          />
        )}

        {activeTab === "chat" && (
          <div className="max-w-4xl mx-auto">
            <AgentChatDrawer activeDoc={selectedDoc} apiKey={apiKey} />
          </div>
        )}
      </main>

      {/* Clean Minimalist Footer */}
      <footer className="border-t border-white/[0.06] py-5 text-center text-xs text-zinc-500 relative z-10">
        <p>
          DriveMind • Real-time Live Tech & AI News Feed • Connected to Hacker News & Dev.to APIs
        </p>
      </footer>

      {/* Clean Modals */}
      <AddDriveModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAddDoc={handleAddDocument}
      />

      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        apiKey={apiKey}
        onSaveApiKey={handleSaveApiKey}
      />
    </div>
  );
}
