"use client";

import { useEffect, useState } from "react";

const scenes = [
  { id: "paris", label: "01 // PARIS", pct: 0.05 },
  { id: "title", label: "02 // BALAJI", pct: 0.20 },
  { id: "ride", label: "03 // BOULEVARD", pct: 0.38 },
  { id: "harbor", label: "04 // THE HARBOR", pct: 0.52 },
  { id: "sea", label: "05 // OPEN SEA", pct: 0.65 },
  { id: "projects", label: "06 // BARGES", pct: 0.78 },
  { id: "finale", label: "07 // FINALE", pct: 0.95 },
];

export default function JourneyNavigator() {
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const totalScroll = document.documentElement.scrollHeight - window.innerHeight;
      if (totalScroll > 0) {
        setScrollProgress(window.scrollY / totalScroll);
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const jumpTo = (pct: number) => {
    const totalScroll = document.documentElement.scrollHeight - window.innerHeight;
    window.scrollTo({
      top: totalScroll * pct,
      behavior: "smooth",
    });
  };

  return (
    <div className="fixed right-6 top-1/2 -translate-y-1/2 z-[100] hidden lg:flex flex-col gap-3 pointer-events-auto">
      {scenes.map((s) => {
        const isActive = Math.abs(scrollProgress - s.pct) < 0.08;
        return (
          <button
            key={s.id}
            onClick={() => jumpTo(s.pct)}
            className={`group flex items-center justify-end gap-3 text-right font-mono transition-all cursor-pointer ${
              isActive ? "text-amber-400 font-bold" : "text-gray-400 hover:text-gray-200"
            }`}
          >
            <span
              className={`text-[11px] tracking-widest uppercase transition-opacity duration-200 ${
                isActive ? "opacity-100" : "opacity-0 group-hover:opacity-100"
              }`}
              style={{
                textShadow: isActive ? "0 0 10px rgba(251,191,36,0.6)" : "none",
              }}
            >
              {s.label}
            </span>
            <span
              className={`rounded-full transition-all duration-300 ${
                isActive
                  ? "w-3 h-3 bg-amber-400 shadow-[0_0_12px_rgba(251,191,36,0.9)]"
                  : "w-1.5 h-1.5 bg-gray-600 group-hover:bg-gray-300"
              }`}
            />
          </button>
        );
      })}
    </div>
  );
}

