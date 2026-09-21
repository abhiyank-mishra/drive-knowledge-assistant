"use client";

import React, { useState, useRef, useEffect } from "react";
import { ChatMessage, DocumentItem } from "@/types";
import { Send, Bot, User, Sparkles, Trash2, ArrowRight } from "lucide-react";

interface AgentChatDrawerProps {
  activeDoc: DocumentItem | null;
  apiKey: string;
}

export default function AgentChatDrawer({ activeDoc, apiKey }: AgentChatDrawerProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "msg-1",
      sender: "assistant",
      text: "Hello! I am your AI Copilot. I can analyze your uploaded Drive notes, explain complex exam topics, or discuss live tech developments. What would you like to explore?",
      timestamp: "Just now",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  const quickPrompts = [
    activeDoc ? `Summarize ${activeDoc.subject} in 3 bullet points` : "What are the latest AI breakthroughs?",
    "Explain the hardest concept in simple terms",
    "List 3 high-probability exam questions",
    "Give me quick formula sheet recap",
  ];

  const handleSend = async (userText: string) => {
    const textToSend = userText.trim();
    if (!textToSend || loading) return;

    const userMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      sender: "user",
      text: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/gemini/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: textToSend,
          documentContext: activeDoc,
          history: messages.slice(-6),
          apiKey,
        }),
      });

      const data = await res.json();

      if (data.success && data.response) {
        const assistantMsg: ChatMessage = {
          id: `msg-${Date.now() + 1}`,
          sender: "assistant",
          text: data.response,
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        };
        setMessages((prev) => [...prev, assistantMsg]);
      } else {
        throw new Error(data.error || "No response received");
      }
    } catch (err: any) {
      const errorMsg: ChatMessage = {
        id: `msg-${Date.now() + 1}`,
        sender: "assistant",
        text: `Notice: ${err.message || "Something went wrong."} (Tip: You can configure your Gemini API Key in Settings for direct AI answers).`,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="rounded-2xl bg-[#111115] border border-white/[0.08] flex flex-col h-[640px] overflow-hidden shadow-sm">
      {/* Sleek Copilot Header */}
      <div className="px-5 py-3.5 border-b border-white/[0.06] flex items-center justify-between bg-zinc-950/40">
        <div className="flex items-center space-x-3">
          <div className="h-8 w-8 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center">
            <Bot className="w-4 h-4 text-indigo-400" />
          </div>
          <div>
            <h2 className="text-xs sm:text-sm font-semibold text-white flex items-center space-x-2">
              <span>AI Copilot</span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            </h2>
            <p className="text-[11px] text-zinc-400">
              {activeDoc ? `Context: ${activeDoc.title}` : "Context: Live Tech & Knowledge Hub"}
            </p>
          </div>
        </div>

        <button
          onClick={() => setMessages([messages[0]])}
          title="Clear Conversation"
          className="p-1.5 text-zinc-500 hover:text-zinc-300 rounded-lg hover:bg-zinc-800 transition-colors"
        >
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex items-start space-x-2.5 ${
              msg.sender === "user" ? "flex-row-reverse space-x-reverse" : "flex-row"
            }`}
          >
            <div
              className={`h-7 w-7 rounded-lg flex items-center justify-center shrink-0 ${
                msg.sender === "user"
                  ? "bg-zinc-700 text-white"
                  : "bg-zinc-900 text-indigo-400 border border-white/[0.08]"
              }`}
            >
              {msg.sender === "user" ? <User className="w-3.5 h-3.5" /> : <Bot className="w-3.5 h-3.5" />}
            </div>

            <div
              className={`max-w-[85%] sm:max-w-[75%] rounded-2xl px-4 py-3 text-xs sm:text-sm leading-relaxed ${
                msg.sender === "user"
                  ? "bg-zinc-800 text-white rounded-tr-none border border-white/[0.08]"
                  : "bg-zinc-900/90 border border-white/[0.06] text-zinc-200 rounded-tl-none whitespace-pre-wrap"
              }`}
            >
              {msg.text}
              <span
                className={`block text-[9px] mt-1.5 font-mono ${
                  msg.sender === "user" ? "text-zinc-400 text-right" : "text-zinc-500"
                }`}
              >
                {msg.timestamp}
              </span>
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex items-center space-x-2 text-zinc-400 text-xs pl-9">
            <Sparkles className="w-3.5 h-3.5 text-indigo-400 animate-spin" />
            <span>Copilot is reasoning and formulating response...</span>
          </div>
        )}

        <div ref={chatEndRef} />
      </div>

      {/* Prompt Suggestions */}
      <div className="px-4 py-2 border-t border-white/[0.04] bg-zinc-950/40">
        <div className="flex items-center space-x-1.5 overflow-x-auto pb-1 scrollbar-none">
          {quickPrompts.map((prompt, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(prompt)}
              className="text-[11px] px-2.5 py-1 rounded-full bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-zinc-200 border border-white/[0.06] whitespace-nowrap transition-colors flex items-center space-x-1"
            >
              <span>{prompt}</span>
              <ArrowRight className="w-2.5 h-2.5 text-zinc-600" />
            </button>
          ))}
        </div>
      </div>

      {/* Input Form */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSend(input);
        }}
        className="p-3 bg-zinc-950/60 border-t border-white/[0.06] flex items-center space-x-2"
      >
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={
            activeDoc
              ? `Ask anything about ${activeDoc.subject}...`
              : "Ask AI Copilot anything..."
          }
          className="flex-1 bg-zinc-900 border border-white/[0.08] rounded-xl px-3.5 py-2 text-xs sm:text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-zinc-500 transition-colors"
        />

        <button
          type="submit"
          disabled={loading || !input.trim()}
          className="p-2.5 rounded-xl bg-white text-zinc-950 hover:bg-zinc-200 disabled:opacity-30 disabled:hover:bg-white font-medium transition-colors"
        >
          <Send className="w-3.5 h-3.5" />
        </button>
      </form>
    </div>
  );
}
