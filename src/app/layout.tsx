import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
});

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
    <html lang="en" className={`${inter.variable} ${jetbrainsMono.variable}`}>
      <body>
        <div className="noise-overlay" aria-hidden="true" />
        {children}
      </body>
    </html>
  );
}
