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
  const [nextUpdateMinutes, setNextUpdateMinutes] = useState(60);
  const [newsUpdatedAt, setNewsUpdatedAt] = useState("Current Hour");
  const [newsSource, setNewsSource] = useState("Agent Initial Feed");

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

  // Fetch Hourly News on mount and set interval for auto-refresh
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
        setNextUpdateMinutes(data.nextUpdateInMinutes || 60);
        setNewsSource(data.source === "gemini-live-agent" ? "Gemini Enterprise Live" : "Local Agent");
      }
    } catch (err) {
      console.error("Hourly news fetch error:", err);
    } finally {
      setIsRefreshingNews(false);
    }
  };

  useEffect(() => {
    fetchHourlyNews();

    // Countdown interval every 60 seconds
    const countdownTimer = setInterval(() => {
      setNextUpdateMinutes((prev) => {
        if (prev <= 1) {
          fetchHourlyNews(true);
          return 60;
        }
        return prev - 1;
      });
    }, 60000);

    return () => clearInterval(countdownTimer);
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
    // Auto-generate summary for new doc
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
    <div className="min-h-screen flex flex-col bg-[#070b14] text-slate-100 selection:bg-blue-600 selection:text-white">
      {/* Background radial glowing effects */}
      <div className="fixed inset-0 pointer-events-none gradient-glow z-0" />

      {/* Navbar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        nextUpdateMinutes={nextUpdateMinutes}
        isRefreshingNews={isRefreshingNews}
        onRefreshNews={() => fetchHourlyNews(true)}
        onOpenSettings={() => setIsSettingsOpen(true)}
        hasApiKey={!!apiKey}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">
        {activeTab === "news" && (
          <HourlyNewsFeed
            news={news}
            isRefreshing={isRefreshingNews}
            onRefresh={() => fetchHourlyNews(true)}
            updatedAt={newsUpdatedAt}
            source={newsSource}
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

      {/* Footer */}
      <footer className="border-t border-slate-900 py-6 text-center text-xs text-slate-500 relative z-10">
        <p>
          DriveMind AI • Powered by Google Gemini Enterprise & Google Cloud Vertex Agents • Built for Next.js & Vercel
        </p>
      </footer>

      {/* Modals */}
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
