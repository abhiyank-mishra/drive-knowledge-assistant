"use client";

import React, { useState } from "react";
import { X, Key, ShieldCheck, ExternalLink, HelpCircle, Check } from "lucide-react";

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  apiKey: string;
  onSaveApiKey: (key: string) => void;
}

export default function SettingsModal({
  isOpen,
  onClose,
  apiKey,
  onSaveApiKey,
}: SettingsModalProps) {
  const [inputKey, setInputKey] = useState(apiKey);
  const [saved, setSaved] = useState(false);

  if (!isOpen) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveApiKey(inputKey.trim());
    setSaved(true);
    setTimeout(() => {
      setSaved(false);
      onClose();
    }, 1000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-fadeIn">
      <div className="rounded-2xl border border-white/[0.1] w-full max-w-lg overflow-hidden shadow-2xl bg-[#111115]">
        {/* Header */}
        <div className="p-5 border-b border-white/[0.06] flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Key className="w-4 h-4 text-zinc-300" />
            <h2 className="text-sm font-semibold text-white">Gemini API Configuration</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-zinc-400 hover:text-white rounded-lg hover:bg-zinc-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSave} className="p-5 space-y-4">
          <div>
            <label className="block text-xs font-medium text-zinc-300 mb-1">
              Google Gemini API Key
            </label>
            <input
              type="password"
              placeholder="AIzaSy..."
              value={inputKey}
              onChange={(e) => setInputKey(e.target.value)}
              className="w-full bg-zinc-900 border border-white/[0.08] rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-zinc-500 font-mono"
            />
            <p className="text-[11px] text-zinc-400 mt-1.5 leading-relaxed">
              Stored locally in your browser. For Vercel deployments, you can also set <code className="text-zinc-300 font-mono">GEMINI_API_KEY</code> in project environment variables.
            </p>
          </div>

          {/* AI Studio Info */}
          <div className="p-3.5 rounded-xl bg-zinc-900/60 border border-white/[0.06] space-y-1.5 text-xs">
            <div className="flex items-center space-x-2 text-zinc-200 font-medium">
              <HelpCircle className="w-3.5 h-3.5 text-zinc-400" />
              <span>Get Free Gemini API Key</span>
            </div>
            <p className="text-zinc-400 text-[11px] leading-relaxed">
              Generate a free key at{" "}
              <a
                href="https://aistudio.google.com/app/apikey"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white underline inline-flex items-center space-x-0.5"
              >
                <span>Google AI Studio</span>
                <ExternalLink className="w-2.5 h-2.5 ml-0.5" />
              </a>
              . Free tier includes generous RPM quotas for Gemini 1.5 Flash.
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-zinc-900/40 border border-white/[0.05] space-y-1 text-xs">
            <div className="flex items-center space-x-1.5 text-emerald-400 font-medium text-[11px]">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Zero-Auth Live News Active</span>
            </div>
            <p className="text-[11px] text-zinc-400">
              The live tech news feed queries live public endpoints (Hacker News & Dev.to) and works 100% in real-time even without an API key!
            </p>
          </div>

          {/* Actions */}
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
              className="flex items-center space-x-1.5 px-4 py-2 bg-white text-zinc-950 hover:bg-zinc-200 text-xs font-semibold rounded-xl transition-all"
            >
              {saved ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Saved</span>
                </>
              ) : (
                <span>Save Key</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
