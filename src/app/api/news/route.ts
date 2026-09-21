import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { INITIAL_NEWS } from "@/lib/newsData";
import { NewsItem } from "@/types";

export const dynamic = "force-dynamic";

// In-memory cache for news feed
let cachedNews: NewsItem[] = [...INITIAL_NEWS];
let lastCacheTime = 0;
const CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutes cache

// Helper to format relative time
function formatRelativeTime(dateMs: number): string {
  const diffMs = Math.max(0, Date.now() - dateMs);
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHours = Math.floor(diffMin / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffSec < 60) return "Just now";
  if (diffMin < 60) return `${diffMin}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  return `${diffDays}d ago`;
}

// Helper to extract clean domain
function extractDomain(urlStr?: string): string {
  if (!urlStr) return "news.ycombinator.com";
  try {
    const parsed = new URL(urlStr);
    return parsed.hostname.replace(/^www\./, "");
  } catch {
    return "external";
  }
}

// Helper to determine category from content
function detectCategory(title: string, tags: string[] = [], domain = ""): string {
  const text = `${title} ${tags.join(" ")} ${domain}`.toLowerCase();

  if (
    /ai|llm|gpt|claude|gemini|openai|anthropic|machine learning|deep learning|neural|r1|reasoning|agent|diffusion|vision/i.test(
      text
    )
  ) {
    return "AI & ML";
  }
  if (
    /github|repo|open-source|opensource|free software|foss|release v|library|mit license/i.test(
      text
    ) ||
    domain === "github.com"
  ) {
    return "Open Source";
  }
  if (
    /startup|venture|funding|seed|series [a-e]|valuation|yc|y combinator|show hn|launch hn|bootstrapped|revenue|saas|arr/i.test(
      text
    )
  ) {
    return "Startups";
  }
  if (
    /security|vulnerability|cve-|exploit|malware|breach|zero-day|hacked|ransomware|patch|ddos/i.test(
      text
    )
  ) {
    return "Cybersecurity";
  }
  return "Software";
}

// Helper to determine sentiment
function detectSentiment(title: string, summary: string): "positive" | "neutral" | "urgent" {
  const combined = `${title} ${summary}`.toLowerCase();
  if (/vulnerability|critical|exploit|cve|breach|outage|urgent|alert|zero-day/i.test(combined)) {
    return "urgent";
  }
  if (
    /release|breakthrough|launches|milestone|innovative|success|boost|fast|faster|record|free|funding/i.test(
      combined
    )
  ) {
    return "positive";
  }
  return "neutral";
}

// Fetch live stories from Hacker News and Dev.to
async function fetchRealNews(): Promise<NewsItem[]> {
  const newsItems: NewsItem[] = [];

  // Fetch concurrently from Hacker News and Dev.to with timeouts
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 6000);

  try {
    const [hnTopRes, devToAiRes, devToTechRes] = await Promise.allSettled([
      fetch("https://hacker-news.firebaseio.com/v0/topstories.json", {
        signal: controller.signal,
        next: { revalidate: 120 },
      }).then((r) => r.json()),
      fetch("https://dev.to/api/articles?tag=ai&per_page=5", {
        signal: controller.signal,
        headers: { "User-Agent": "DriveMind-News-Agent/1.0" },
        next: { revalidate: 120 },
      }).then((r) => r.json()),
      fetch("https://dev.to/api/articles?tag=tech&per_page=5", {
        signal: controller.signal,
        headers: { "User-Agent": "DriveMind-News-Agent/1.0" },
        next: { revalidate: 120 },
      }).then((r) => r.json()),
    ]);

    clearTimeout(timeoutId);

    // 1. Process Hacker News Top Stories
    if (hnTopRes.status === "fulfilled" && Array.isArray(hnTopRes.value)) {
      const topIds = hnTopRes.value.slice(0, 10);
      const storyPromises = topIds.map(async (id: number) => {
        try {
          const res = await fetch(
            `https://hacker-news.firebaseio.com/v0/item/${id}.json`,
            { next: { revalidate: 120 } }
          );
          return await res.json();
        } catch {
          return null;
        }
      });

      const hnStories = await Promise.all(storyPromises);
      for (const item of hnStories) {
        if (!item || !item.title || item.deleted || item.dead) continue;

        const dateMs = item.time ? item.time * 1000 : Date.now();
        const itemUrl =
          item.url || `https://news.ycombinator.com/item?id=${item.id}`;
        const domain = extractDomain(itemUrl);
        const category = detectCategory(item.title, [], domain);
        const relativeTime = formatRelativeTime(dateMs);

        const summaryText =
          item.url
            ? `Trending discussion on Hacker News by @${item.by || "engineer"}. Published via ${domain} with ${item.score || 1} points and ${item.descendants || 0} active community comments.`
            : `Ask/Show Hacker News discussion started by @${item.by || "user"} with ${item.score || 1} community points and ${item.descendants || 0} replies.`;

        newsItems.push({
          id: `hn-${item.id}`,
          title: item.title,
          category,
          summary: summaryText,
          keyPoints: [
            `${item.score || 1} community upvotes on Hacker News`,
            `${item.descendants || 0} active comments and discussions`,
            `Source origin: ${domain}`,
          ],
          source: domain === "news.ycombinator.com" ? "Hacker News" : domain,
          domain,
          url: itemUrl,
          publishedAt: relativeTime,
          isoTimestamp: new Date(dateMs).toISOString(),
          score: item.score || 0,
          commentsCount: item.descendants || 0,
          author: item.by || undefined,
          sentiment: detectSentiment(item.title, summaryText),
        });
      }
    }

    // 2. Process Dev.to Articles
    const devArticles = [];
    if (devToAiRes.status === "fulfilled" && Array.isArray(devToAiRes.value)) {
      devArticles.push(...devToAiRes.value);
    }
    if (devToTechRes.status === "fulfilled" && Array.isArray(devToTechRes.value)) {
      devArticles.push(...devToTechRes.value);
    }

    // Deduplicate Dev.to articles by ID
    const seenDevIds = new Set();
    for (const art of devArticles) {
      if (!art || !art.title || seenDevIds.has(art.id)) continue;
      seenDevIds.add(art.id);

      const dateMs = art.published_at
        ? new Date(art.published_at).getTime()
        : Date.now();
      const relativeTime = formatRelativeTime(dateMs);
      const domain = extractDomain(art.url);
      const tags = Array.isArray(art.tag_list) ? art.tag_list : [];
      const category = detectCategory(art.title, tags, domain);

      const summaryText =
        art.description && art.description.length > 20
          ? art.description.trim()
          : `Developer insights on ${tags.join(", ") || "technology"} by ${art.user?.name || "author"}.`;

      newsItems.push({
        id: `dev-${art.id}`,
        title: art.title,
        category,
        summary: summaryText,
        keyPoints: [
          `Published by ${art.user?.name || "Developer"} (${art.reading_time_minutes || 3} min read)`,
          `${art.positive_reactions_count || 0} developer reactions & ${art.comments_count || 0} comments`,
          `Topics: ${tags.slice(0, 3).join(", ") || "Tech"}`,
        ],
        source: "Dev.to",
        domain: "dev.to",
        url: art.url,
        publishedAt: relativeTime,
        isoTimestamp: new Date(dateMs).toISOString(),
        score: art.positive_reactions_count || 0,
        commentsCount: art.comments_count || 0,
        author: art.user?.name || undefined,
        sentiment: detectSentiment(art.title, summaryText),
      });
    }
  } catch (error) {
    console.error("Live news fetch error:", error);
    clearTimeout(timeoutId);
  }

  // If live items successfully retrieved, return sorted
  if (newsItems.length >= 3) {
    // Sort by recent ISO timestamp, or score
    return newsItems.sort((a, b) => {
      const timeA = a.isoTimestamp ? new Date(a.isoTimestamp).getTime() : 0;
      const timeB = b.isoTimestamp ? new Date(b.isoTimestamp).getTime() : 0;
      return timeB - timeA;
    });
  }

  // Fallback to updated INITIAL_NEWS if offline
  return INITIAL_NEWS.map((item, idx) => ({
    ...item,
    publishedAt: formatRelativeTime(Date.now() - (idx + 1) * 12 * 60 * 1000),
    isoTimestamp: new Date(Date.now() - (idx + 1) * 12 * 60 * 1000).toISOString(),
  }));
}

// Optionally enrich news with Gemini 1.5 Flash
async function enrichWithGemini(
  items: NewsItem[],
  apiKey: string
): Promise<NewsItem[]> {
  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    // Prepare headlines list
    const headlines = items.slice(0, 6).map((item, i) => ({
      index: i,
      title: item.title,
      summary: item.summary,
      domain: item.domain,
    }));

    const prompt = `You are an autonomous tech journalist. Given these REAL LIVE tech headlines, create a concise 2-sentence executive summary and 2 sharp bullet points for each.

Headlines:
${JSON.stringify(headlines, null, 2)}

Return ONLY valid JSON array with this exact structure:
[
  {
    "index": 0,
    "summary": "Crisp 2-sentence executive briefing",
    "keyPoints": ["Bullet point 1", "Bullet point 2"]
  }
]
Do NOT change the index. Do NOT output markdown code blocks.`;

    // Timeout after 4 seconds so Gemini never stalls response
    const timeoutPromise = new Promise<never>((_, reject) =>
      setTimeout(() => reject(new Error("Gemini timeout")), 4000)
    );

    const generatePromise = model.generateContent(prompt).then((r) => r.response.text());
    const textRaw = await Promise.race([generatePromise, timeoutPromise]);

    let cleanJson = textRaw.trim();
    if (cleanJson.startsWith("```")) {
      cleanJson = cleanJson.replace(/^```(json)?\n?/, "").replace(/\n?```$/, "");
    }

    const parsed: Array<{ index: number; summary: string; keyPoints: string[] }> =
      JSON.parse(cleanJson);

    if (Array.isArray(parsed)) {
      const enriched = [...items];
      for (const item of parsed) {
        if (enriched[item.index] && item.summary) {
          enriched[item.index] = {
            ...enriched[item.index],
            summary: item.summary,
            keyPoints: item.keyPoints || enriched[item.index].keyPoints,
          };
        }
      }
      return enriched;
    }
  } catch (err) {
    console.warn("Gemini enrichment skipped or timed out:", err);
  }
  return items;
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const forceRefresh = searchParams.get("refresh") === "true";
    const apiKey =
      process.env.GEMINI_API_KEY ||
      searchParams.get("apiKey") ||
      request.headers.get("x-gemini-key");

    const now = Date.now();
    const isCacheExpired = now - lastCacheTime > CACHE_TTL_MS;

    // Return in-memory cache if valid and not forcing refresh
    if (!forceRefresh && !isCacheExpired && cachedNews.length > 0) {
      // Recompute relative publishedAt strings against current time
      const freshRelativeNews = cachedNews.map((item) => {
        if (item.isoTimestamp) {
          return {
            ...item,
            publishedAt: formatRelativeTime(new Date(item.isoTimestamp).getTime()),
          };
        }
        return item;
      });

      return NextResponse.json({
        success: true,
        source: "Live Hacker News & Dev.to (Cached)",
        isLive: true,
        updatedAt: new Date(lastCacheTime).toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
        fetchedAt: new Date(lastCacheTime).toISOString(),
        nextUpdateInMinutes: Math.max(
          1,
          Math.round((CACHE_TTL_MS - (now - lastCacheTime)) / 60000)
        ),
        totalStories: freshRelativeNews.length,
        news: freshRelativeNews,
      });
    }

    // Fetch fresh real news
    let realNews = await fetchRealNews();

    // If Gemini key is available, enrich with AI synthesis
    if (apiKey) {
      realNews = await enrichWithGemini(realNews, apiKey);
    }

    cachedNews = realNews;
    lastCacheTime = now;

    return NextResponse.json({
      success: true,
      source: apiKey
        ? "Live Hacker News & Dev.to (Gemini Enriched)"
        : "Live Hacker News & Dev.to",
      isLive: true,
      updatedAt: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
      fetchedAt: new Date().toISOString(),
      nextUpdateInMinutes: 60,
      totalStories: realNews.length,
      news: realNews,
    });
  } catch (error: any) {
    console.error("GET /api/news failed:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Failed to fetch real-time news",
        fallbackNews: INITIAL_NEWS,
      },
      { status: 500 }
    );
  }
}
