import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Chandragiri Balaji Haricharan — AI Agent Engineer",
  description:
    "AI Agent Engineer & Backend Architect. Specializing in LangGraph multi-agent orchestration, ChromaDB RAG pipelines, FastAPI, and 179 passing automated tests.",
  keywords: ["AI Agent Engineer", "LangGraph", "FastAPI", "ChromaDB", "Chandragiri Balaji Haricharan", "Portfolio"],
  openGraph: {
    title: "Chandragiri Balaji Haricharan — AI Agent Engineer",
    description:
      "AI Agent Engineer & Backend Architect. Specializing in LangGraph multi-agent orchestration, ChromaDB RAG pipelines, FastAPI, and 179 passing automated tests.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <div className="noise-overlay" aria-hidden="true" />
        {children}
      </body>
    </html>
  );
}
