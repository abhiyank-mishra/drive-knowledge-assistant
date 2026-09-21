"use client";

import React, { useState } from "react";
import { X, Key, ShieldCheck, ExternalLink, HelpCircle, Bot, Check } from "lucide-react";

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
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
      <div className="glass-panel rounded-2xl border border-slate-700 w-full max-w-lg overflow-hidden shadow-2xl bg-slate-950">
        {/* Header */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Key className="w-5 h-5 text-blue-400" />
            <h2 className="text-base font-bold text-white">Gemini & Agent Configuration</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSave} className="p-5 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Gemini API Key
            </label>
            <input
              type="password"
              placeholder="AIzaSy..."
              value={inputKey}
              onChange={(e) => setInputKey(e.target.value)}
              className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 font-mono"
            />
            <p className="text-[11px] text-slate-400 mt-1.5 leading-relaxed">
              Aapka key browser ke local storage me safe rahega. Agar aap Vercel par deploy kar rahe hain, toh Vercel Environment Variables me <code className="text-blue-400 font-mono">GEMINI_API_KEY</code> add kar sakte hain.
            </p>
          </div>

          {/* Guide Card */}
          <div className="p-3.5 rounded-xl bg-blue-950/30 border border-blue-500/20 space-y-2 text-xs">
            <div className="flex items-center space-x-2 text-blue-400 font-semibold">
              <HelpCircle className="w-4 h-4" />
              <span>Free Gemini API Key Kaise Lein?</span>
            </div>
            <ol className="list-decimal list-inside space-y-1 text-slate-300 text-[11px] leading-relaxed">
              <li>
                <a
                  href="https://aistudio.google.com/app/apikey"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-400 underline inline-flex items-center space-x-0.5"
                >
                  <span>Google AI Studio</span>
                  <ExternalLink className="w-2.5 h-2.5 ml-0.5" />
                </a>{" "}
                par visit karein.
              </li>
              <li>"Create API Key" par click karke key copy karein.</li>
              <li>College Gemini Enterprise account se bhi aap Vertex AI API key generate kar sakte hain.</li>
            </ol>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 space-y-1 text-xs">
            <div className="flex items-center space-x-1.5 text-emerald-400 font-semibold text-[11px]">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Offline / Demo Mode Supported</span>
            </div>
            <p className="text-[11px] text-slate-400">
              Bina API key ke bhi app simulated enterprise agent responses aur sample college notes ke sath 100% interact karne ke liye ready hai!
            </p>
          </div>

          {/* Actions */}
          <div className="pt-2 flex items-center justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-white rounded-xl hover:bg-slate-900 transition-colors"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="flex items-center space-x-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold rounded-xl shadow-md shadow-blue-600/30 transition-all"
            >
              {saved ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Saved!</span>
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
