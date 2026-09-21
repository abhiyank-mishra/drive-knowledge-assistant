import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { DocumentSummary } from "@/types";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { content, title, subject, apiKey: clientApiKey } = body;

    if (!content || content.trim().length === 0) {
      return NextResponse.json(
        { success: false, error: "Document content is required" },
        { status: 400 }
      );
    }

    const apiKey = process.env.GEMINI_API_KEY || clientApiKey;

    if (!apiKey) {
      // Return smart structured mock summary if API key is not yet configured
      const mockSummary: DocumentSummary = {
        executiveSummary: [
          `Comprehensive synthesis of ${title || "the document"} covering essential theoretical foundations and practical applications.`,
          "Critical mechanisms, algorithmic steps, and real-world system constraints highlighted.",
          "Core dependencies and edge cases cataloged for efficient revision."
        ],
        keyConcepts: [
          {
            title: "Primary Theorem & Principles",
            explanation: `The document establishes core fundamentals in ${subject || "the subject"}, emphasizing sequential execution and validation constraints.`
          },
          {
            title: "Algorithmic Complexity & Trade-offs",
            explanation: "Detailed evaluation of time vs memory overheads, scalability bottlenecks, and mitigation strategies."
          }
        ],
        formulasAndDefinitions: [
          "Primary Evaluation Metric: Performance = (Throughput / Latency) * Efficiency",
          "Verification Condition: Invariant must hold true across all active states."
        ],
        examImportantTopics: [
          `Explain the foundational architecture of ${title || "the topic"} with neat block diagrams (10 Marks).`,
          "Derive the primary mathematical relationship and discuss two edge conditions (15 Marks)."
        ],
        quickRecapHindi: `Yeh document ${subject || "subject"} ke core topic '${title || "notes"}' ko cover karta hai. Isme theoretical concepts, key formulas aur exam ke important questions shamil hain. Aap iske sath interactive chat me doubt bhi pooch sakte hain!`
      };

      return NextResponse.json({
        success: true,
        source: "simulated-agent",
        summary: mockSummary
      });
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `You are an expert College Professor and AI Academic Assistant.
Analyze the following lecture notes/document titled "${title || 'College Notes'}" in subject "${subject || 'General'}":

"""
${content.slice(0, 15000)}
"""

Provide an exhaustive, student-friendly academic breakdown formatted as strict JSON:
{
  "executiveSummary": ["Point 1", "Point 2", "Point 3"],
  "keyConcepts": [
    {"title": "Concept Name", "explanation": "Clear explanation in 2 sentences."}
  ],
  "formulasAndDefinitions": ["Formula / Definition 1", "Formula / Definition 2"],
  "examImportantTopics": ["Expected 10-mark question 1", "Expected 10-mark question 2"],
  "quickRecapHindi": "A friendly 2-3 sentence Hindi summary of what these notes are about and what to focus on for exams."
}

Return ONLY raw JSON. No markdown blocks, no prefix or suffix.`;

    const result = await model.generateContent(prompt);
    let text = result.response.text().trim();

    if (text.startsWith("```")) {
      text = text.replace(/^```(json)?\n?/, "").replace(/\n?```$/, "");
    }

    const summary: DocumentSummary = JSON.parse(text);

    return NextResponse.json({
      success: true,
      source: "gemini-live",
      summary
    });
  } catch (error: any) {
    console.error("Summarization error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to generate summary" },
      { status: 500 }
    );
  }
}
