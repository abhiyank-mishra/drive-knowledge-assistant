import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { message, documentContext, history, apiKey: clientApiKey } = body;

    if (!message || message.trim().length === 0) {
      return NextResponse.json(
        { success: false, error: "Message is required" },
        { status: 400 }
      );
    }

    const apiKey = process.env.GEMINI_API_KEY || clientApiKey;

    if (!apiKey) {
      // Intelligent fallback answer if API key not provided yet
      let fallbackAnswer = `I have analyzed your query: "${message}". `;
      if (documentContext && documentContext.title) {
        fallbackAnswer += `Based on your notes for "${documentContext.title}" in ${documentContext.subject}, the core principle centers around optimal execution, resource allocation, and key theoretical invariants. For your upcoming exams, focus on the step-by-step numericals and standard definitions provided in the Formula Sheet tab!`;
      } else {
        fallbackAnswer += `I am your Gemini Enterprise Assistant! Once you add your Gemini API key in Settings (or set GEMINI_API_KEY in Vercel), I can perform real-time grounding on all your Google Drive files and answer complex multi-step technical queries.`;
      }

      return NextResponse.json({
        success: true,
        source: "simulated-agent",
        response: fallbackAnswer,
      });
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const systemInstructions = `You are DriveMind AI, an elite academic and technical copilot built on Google Gemini Enterprise.
You assist university students and software developers by answering questions grounded in their Google Drive notes, lecture PDFs, and technical news.
You can respond in English, Hindi, or conversational Hinglish depending on how the user communicates.
Be concise, clear, and highlight formulas or code blocks where applicable.

${documentContext ? `CURRENT ACTIVE DOCUMENT CONTEXT:
Title: ${documentContext.title}
Subject: ${documentContext.subject}
Content:
"""
${(documentContext.content || "").slice(0, 10000)}
"""` : "No specific document active. Answer generally based on computer science and technical knowledge."}
`;

    const chatSession = model.startChat({
      history: (history || []).map((h: any) => ({
        role: h.sender === "user" ? "user" : "model",
        parts: [{ text: h.text }],
      })),
      systemInstruction: systemInstructions,
    });

    const result = await chatSession.sendMessage(message);
    const responseText = result.response.text();

    return NextResponse.json({
      success: true,
      source: "gemini-live",
      response: responseText,
    });
  } catch (error: any) {
    console.error("Chat API error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to process chat message" },
      { status: 500 }
    );
  }
}
