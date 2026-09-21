import { NewsItem } from "../types";

export const INITIAL_NEWS: NewsItem[] = [
  {
    id: "news-1",
    title: "Google DeepMind Unveils Next-Gen Multimodal Reasoning Models for Gemini",
    category: "AI & ML",
    summary: "Google has deployed new specialized reasoning architectures enabling sub-second multi-step code execution and long-context synthesis across enterprise workspaces.",
    keyPoints: [
      "2M+ token native context window with 99.8% needle-in-a-haystack retrieval.",
      "Direct grounding in Google Workspace: Drive, Gmail, Docs, and Calendar.",
      "Reduced API latency by 45% using speculative decoding."
    ],
    source: "DeepMind Tech Blog",
    url: "https://blog.google/technology/ai/",
    publishedAt: "Just now (Hourly Edition)",
    sentiment: "positive"
  },
  {
    id: "news-2",
    title: "Next.js 15 Enters General Availability with Turbopack by Default",
    category: "Tech & Dev",
    summary: "Vercel announced the stable release of Next.js 15, featuring asynchronous request APIs, optimized server actions, and Turbopack as the default bundler for 7x faster local dev.",
    keyPoints: [
      "Turbopack is now 99.9% test-passing and active by default in next dev.",
      "Improved caching defaults to prevent stale server-side responses.",
      "React 19 RC support with enhanced Server Actions error boundary."
    ],
    source: "Vercel Engineering",
    url: "https://nextjs.org/blog",
    publishedAt: "24 mins ago",
    sentiment: "positive"
  },
  {
    id: "news-3",
    title: "Python 3.13 Released with Experimental Free-Threaded (No-GIL) Mode",
    category: "Open Source",
    summary: "The Python Software Foundation officially shipped Python 3.13, bringing an experimental mode to disable the Global Interpreter Lock (GIL) for true multi-core CPU scaling.",
    keyPoints: [
      "Enables CPU-bound concurrent threads to execute in parallel without multiprocessing overhead.",
      "New modern interactive REPL with syntax highlighting and multi-line editing.",
      "Up to 15-20% speedup on standard numeric and async workloads."
    ],
    source: "Python Foundation",
    url: "https://www.python.org/downloads/",
    publishedAt: "48 mins ago",
    sentiment: "positive"
  },
  {
    id: "news-4",
    title: "Critical Security Patch Issued for OpenSSH Remote Execution Vulnerability",
    category: "Cybersecurity",
    summary: "Cybersecurity researchers discovered a race condition in OpenSSH server (sshd) on glibc-based Linux systems, prompting instant patches across Debian, Ubuntu, and RedHat.",
    keyPoints: [
      "Tagged as CVE-2024-6387 ('regreSSHion').",
      "Affects specific versions of OpenSSH from 8.5p1 up to 9.8p1.",
      "Sysadmins urged to apply security patches or set LoginGraceTime 0 as mitigation."
    ],
    source: "Qualys Security Advisory",
    url: "https://www.qualys.com/security-advisories/",
    publishedAt: "1 hour ago",
    sentiment: "urgent"
  },
  {
    id: "news-5",
    title: "College Placement Trends 2026: AI Engineering & Cloud Security Top Hiring Charts",
    category: "Campus",
    summary: "Engineering campus hiring data reveals a 60% surge in demand for Full-Stack AI Engineers capable of building RAG agents, LLM pipelines, and cloud automation.",
    keyPoints: [
      "Companies prioritizing practical agent-building portfolios over theoretical LeetCode only.",
      "Proficiency in Next.js, Python FastAPI, and Gemini/Claude APIs ranked highest in recruiter filters.",
      "Average package for AI Solutions Engineer roles up 28% year-over-year."
    ],
    source: "Tech Career Pulse",
    url: "https://news.ycombinator.com",
    publishedAt: "1 hour ago",
    sentiment: "positive"
  }
];
