import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "DriveMind AI - Gemini Drive Knowledge & Hourly Agent Hub",
  description: "Autonomous Gemini Enterprise Agent Hub: Hourly live news, Google Drive notes summarization, flashcards, and multi-document Q&A copilot.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen bg-[#070b14] text-slate-100 antialiased selection:bg-blue-600 selection:text-white">
        {children}
      </body>
    </html>
  );
}
