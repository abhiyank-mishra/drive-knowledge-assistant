import { NewsItem } from "../types";

export const INITIAL_NEWS: NewsItem[] = [
  {
    id: "news-1",
    title: "Google DeepMind Unveils Next-Gen Multimodal Reasoning Models for Gemini",
    category: "AI & ML",
    summary: "Google deployed specialized reasoning architectures enabling sub-second multi-step code execution and long-context synthesis across enterprise developer workspaces.",
    keyPoints: [
      "2M+ token native context window with 99.8% needle-in-a-haystack retrieval.",
      "Direct grounding in Google Workspace: Drive, Gmail, Docs, and Calendar.",
      "Reduced API latency by 45% using speculative decoding."
    ],
    source: "DeepMind Tech Blog",
    domain: "blog.google",
    url: "https://blog.google/technology/ai/",
    publishedAt: "8m ago",
    isoTimestamp: new Date(Date.now() - 8 * 60 * 1000).toISOString(),
    score: 412,
    commentsCount: 96,
    sentiment: "positive"
  },
  {
    id: "news-2",
    title: "Next.js 15 General Availability: Turbopack by Default and Async Request APIs",
    category: "Software",
    summary: "Vercel announced the stable release of Next.js 15, featuring asynchronous request APIs, optimized server actions, and Turbopack as the default bundler for 7x faster local dev.",
    keyPoints: [
      "Turbopack is now active by default in next dev with near-instant refresh.",
      "Improved caching defaults to prevent stale server-side responses.",
      "React 19 support with enhanced Server Actions error boundaries."
    ],
    source: "Vercel Engineering",
    domain: "nextjs.org",
    url: "https://nextjs.org/blog",
    publishedAt: "24m ago",
    isoTimestamp: new Date(Date.now() - 24 * 60 * 1000).toISOString(),
    score: 285,
    commentsCount: 64,
    sentiment: "positive"
  },
  {
    id: "news-3",
    title: "Python 3.13 Ships with Experimental Free-Threaded (No-GIL) Mode for Multi-Core CPUs",
    category: "Open Source",
    summary: "The Python Software Foundation officially shipped Python 3.13, enabling true multi-core CPU scaling without the Global Interpreter Lock overhead.",
    keyPoints: [
      "Enables CPU-bound concurrent threads to execute in parallel without multiprocessing.",
      "New modern interactive REPL with syntax highlighting and multi-line editing.",
      "Up to 15-20% speedup on standard numeric and async workloads."
    ],
    source: "Python Foundation",
    domain: "python.org",
    url: "https://www.python.org/downloads/",
    publishedAt: "45m ago",
    isoTimestamp: new Date(Date.now() - 45 * 60 * 1000).toISOString(),
    score: 521,
    commentsCount: 142,
    sentiment: "positive"
  },
  {
    id: "news-4",
    title: "AI Agent Architecture Trends 2026: Reasoning Loops and Memory Retrieval",
    category: "Startups",
    summary: "Venture capital reports reveal developer tooling startups building autonomous coding and research agents saw a 3x surge in Series A funding rounds.",
    keyPoints: [
      "Shift from single-turn chat interfaces to autonomous workflow executors.",
      "Vector embeddings combined with graph-based memory pipelines.",
      "Enterprises deploying local small language models for sensitive document RAG."
    ],
    source: "TechCrunch",
    domain: "techcrunch.com",
    url: "https://techcrunch.com/category/artificial-intelligence/",
    publishedAt: "1h ago",
    isoTimestamp: new Date(Date.now() - 60 * 60 * 1000).toISOString(),
    score: 189,
    commentsCount: 38,
    sentiment: "positive"
  },
  {
    id: "news-5",
    title: "Critical Security Advisory Issued for OpenSSH Remote Code Execution Vulnerability",
    category: "Cybersecurity",
    summary: "Security researchers identified a race condition in OpenSSH server on glibc Linux systems, prompting emergency vendor security patches.",
    keyPoints: [
      "Tagged as CVE-2024-6387 with emergency patches rolled out.",
      "Affects specific versions of OpenSSH from 8.5p1 up to 9.8p1.",
      "Mitigation includes immediate package upgrade or setting LoginGraceTime 0."
    ],
    source: "Qualys Security",
    domain: "qualys.com",
    url: "https://www.qualys.com/security-advisories/",
    publishedAt: "1h ago",
    isoTimestamp: new Date(Date.now() - 75 * 60 * 1000).toISOString(),
    score: 640,
    commentsCount: 184,
    sentiment: "urgent"
  }
];
