import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { INITIAL_NEWS } from "@/lib/newsData";
import { NewsItem } from "@/types";

// In-memory cache for hourly news
let cachedNews: NewsItem[] = [...INITIAL_NEWS];
let lastUpdatedTime = Date.now();

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const forceRefresh = searchParams.get("refresh") === "true";
    const apiKey = process.env.GEMINI_API_KEY || searchParams.get("apiKey");

    const now = Date.now();
    const oneHourMs = 60 * 60 * 1000;
    const isExpired = now - lastUpdatedTime > oneHourMs;

    // If cache is fresh and not force-refreshing, return cached news immediately
    if (!forceRefresh && !isExpired && cachedNews.length > 0) {
      return NextResponse.json({
        success: true,
        source: "cache",
        updatedAt: new Date(lastUpdatedTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        nextUpdateInMinutes: Math.max(1, Math.round((oneHourMs - (now - lastUpdatedTime)) / 60000)),
        news: cachedNews,
      });
    }

    // Try generating fresh hourly news using Gemini API if key is available
    if (apiKey) {
      try {
        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        const prompt = `You are an Autonomous AI News Agent. It is the current hour.
Generate 5 fresh, high-impact news items across:
1. AI & LLMs (Breakthroughs, models, research)
2. Tech & Dev (Frameworks, tools, languages)
3. Open Source (GitHub trending repos, releases)
4. Cybersecurity (Zero-days, alerts)
5. College & Tech Careers (Hiring trends, skills)

Return ONLY valid JSON array matching this exact TypeScript structure:
[
  {
    "id": "news-generated-1",
    "title": "Headline",
    "category": "AI & ML" (one of: "AI & ML", "Tech & Dev", "Open Source", "Cybersecurity", "Campus"),
    "summary": "2-sentence executive summary",
    "keyPoints": ["Bullet 1", "Bullet 2", "Bullet 3"],
    "source": "Source Name (e.g. Google DeepMind, HackerNews, TechCrunch)",
    "publishedAt": "Current Hour Edition",
    "sentiment": "positive" (one of: "positive", "neutral", "urgent")
  }
]
Do NOT wrap in markdown backticks. Return raw JSON string only.`;

        const result = await model.generateContent(prompt);
        let text = result.response.text().trim();

        // Clean up markdown block if present
        if (text.startsWith("```")) {
          text = text.replace(/^```(json)?\n?/, "").replace(/\n?```$/, "");
        }

        const parsedNews: NewsItem[] = JSON.parse(text);
        if (Array.isArray(parsedNews) && parsedNews.length > 0) {
          cachedNews = parsedNews;
          lastUpdatedTime = now;
          return NextResponse.json({
            success: true,
            source: "gemini-live-agent",
            updatedAt: new Date(lastUpdatedTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            nextUpdateInMinutes: 60,
            news: cachedNews,
          });
        }
      } catch (geminiError) {
        console.warn("Gemini generation failed, using updated fallback:", geminiError);
      }
    }

    // Fallback: Generate dynamic simulated hourly news update
    const dynamicTimestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    cachedNews = INITIAL_NEWS.map((item, index) => ({
      ...item,
      publishedAt: `${dynamicTimestamp} (${index === 0 ? "Top Story" : `${(index + 1) * 12} mins ago`})`
    }));
    lastUpdatedTime = now;

    return NextResponse.json({
      success: true,
      source: apiKey ? "gemini-fallback" : "local-agent",
      updatedAt: dynamicTimestamp,
      nextUpdateInMinutes: 60,
      news: cachedNews,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Failed to fetch hourly news" },
      { status: 500 }
    );
  }
}
