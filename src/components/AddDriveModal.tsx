"use client";

import React, { useState } from "react";
import { X, HardDrive, Link as LinkIcon, FileText, Sparkles } from "lucide-react";
import { DocumentItem } from "@/types";

interface AddDriveModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddDoc: (doc: DocumentItem) => void;
}

export default function AddDriveModal({ isOpen, onClose, onAddDoc }: AddDriveModalProps) {
  const [activeTab, setActiveTab] = useState<"link" | "text">("link");
  const [url, setUrl] = useState("");
  const [title, setTitle] = useState("");
  const [subject, setSubject] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/drive/parse", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          url: activeTab === "link" ? url : undefined,
          rawContent: activeTab === "text" ? content : undefined,
          title: title || (activeTab === "link" ? "Google Drive Document" : "Custom Notes"),
          subject: subject || "College Notes",
        }),
      });

      const data = await res.json();
      if (data.success && data.document) {
        onAddDoc(data.document);
        setUrl("");
        setTitle("");
        setSubject("");
        setContent("");
        onClose();
      } else {
        alert(data.error || "Failed to process document");
      }
    } catch (err: any) {
      alert("Error adding document: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-fadeIn">
      <div className="rounded-2xl border border-white/[0.1] w-full max-w-lg overflow-hidden shadow-2xl bg-[#111115]">
        {/* Modal Header */}
        <div className="p-5 border-b border-white/[0.06] flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <HardDrive className="w-4 h-4 text-zinc-300" />
            <h2 className="text-sm font-semibold text-white">Import College Notes / Drive File</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-zinc-400 hover:text-white rounded-lg hover:bg-zinc-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab Selection */}
        <div className="flex border-b border-white/[0.06] bg-zinc-950/50 p-1">
          <button
            onClick={() => setActiveTab("link")}
            className={`flex-1 flex items-center justify-center space-x-2 py-2 text-xs font-medium rounded-lg transition-all ${
              activeTab === "link"
                ? "bg-zinc-800 text-white shadow-sm font-semibold"
                : "text-zinc-400 hover:text-zinc-200"
            }`}
          >
            <LinkIcon className="w-3.5 h-3.5" />
            <span>Google Drive Link</span>
          </button>

          <button
            onClick={() => setActiveTab("text")}
            className={`flex-1 flex items-center justify-center space-x-2 py-2 text-xs font-medium rounded-lg transition-all ${
              activeTab === "text"
                ? "bg-zinc-800 text-white shadow-sm font-semibold"
                : "text-zinc-400 hover:text-zinc-200"
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Paste Notes Text</span>
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          <div>
            <label className="block text-xs font-medium text-zinc-300 mb-1">
              Document Title
            </label>
            <input
              type="text"
              placeholder="e.g. Operating Systems - Unit 3: Deadlocks"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-zinc-900 border border-white/[0.08] rounded-xl px-3.5 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-zinc-500"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-zinc-300 mb-1">
              Subject / Department
            </label>
            <input
              type="text"
              placeholder="e.g. Computer Science, AI, DBMS"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="w-full bg-zinc-900 border border-white/[0.08] rounded-xl px-3.5 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-zinc-500"
            />
          </div>

          {activeTab === "link" ? (
            <div>
              <label className="block text-xs font-medium text-zinc-300 mb-1">
                Google Drive URL
              </label>
              <input
                type="url"
                required
                placeholder="https://drive.google.com/file/d/... or docs.google.com/document/d/..."
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                className="w-full bg-zinc-900 border border-white/[0.08] rounded-xl px-3.5 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-zinc-500"
              />
              <p className="text-[10px] text-zinc-500 mt-1">
                Make sure the Drive file link is set to "Anyone with the link can view".
              </p>
            </div>
          ) : (
            <div>
              <label className="block text-xs font-medium text-zinc-300 mb-1">
                Lecture Notes Content
              </label>
              <textarea
                required
                rows={5}
                placeholder="Paste your syllabus notes, lecture content, or assignment text here..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="w-full bg-zinc-900 border border-white/[0.08] rounded-xl px-3.5 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-zinc-500 font-mono"
              />
            </div>
          )}

          {/* Action Buttons */}
          <div className="pt-2 flex items-center justify-end space-x-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-3.5 py-2 text-xs font-medium text-zinc-400 hover:text-white rounded-xl hover:bg-zinc-800 transition-colors"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading}
              className="flex items-center space-x-1.5 px-4 py-2 bg-white text-zinc-950 hover:bg-zinc-200 disabled:opacity-40 text-xs font-semibold rounded-xl transition-all"
            >
              <Sparkles className="w-3.5 h-3.5 text-zinc-900" />
              <span>{loading ? "Processing..." : "Import & Analyze"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
