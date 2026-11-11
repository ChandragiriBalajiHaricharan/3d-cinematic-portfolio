import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Balaji — AI Agent Engineer",
  description:
    "I design AI agents and the solid engineering behind them: orchestration, custom tools, vector memory, and 179 passing tests.",
  keywords: ["AI", "agents", "engineering", "portfolio", "Balaji"],
  openGraph: {
    title: "Balaji — AI Agent Engineer",
    description:
      "I design AI agents and the solid engineering behind them: orchestration, custom tools, vector memory, and 179 passing tests.",
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
