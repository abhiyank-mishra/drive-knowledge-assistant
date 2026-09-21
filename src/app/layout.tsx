import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "DriveMind - Live Tech Feed & Drive Knowledge Assistant",
  description: "Real-time tech and AI news feed powered by Hacker News and Dev.to APIs with college Google Drive notes synthesizer and AI copilot.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen bg-[#0a0a0c] text-zinc-100 antialiased selection:bg-zinc-800 selection:text-white">
        {children}
      </body>
    </html>
  );
}
