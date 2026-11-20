"use client";

import { useEffect, useState } from "react";
import { scrollBridge } from "./CinematicExperience";

const scenes = [
  { id: "paris", label: "01 // PARIS", pct: 0.04 },
  { id: "title", label: "02 // BALAJI", pct: 0.18 },
  { id: "ride", label: "03 // FREEWAY", pct: 0.36 },
  { id: "harbor", label: "04 // THE HARBOR", pct: 0.52 },
  { id: "sea", label: "05 // SPEEDBOAT", pct: 0.68 },
  { id: "projects", label: "06 // BARGES", pct: 0.82 },
  { id: "finale", label: "07 // ABOUT ME", pct: 0.98 },
];

export default function JourneyNavigator() {
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handler = (pct: number) => {
      setScrollProgress(pct);
    };
    scrollBridge.listeners.add(handler);
    return () => {
      scrollBridge.listeners.delete(handler);
    };
  }, []);

  const jumpTo = (pct: number) => {
    scrollBridge.scrollTo(pct);
  };

  return (
    <div className="fixed right-6 top-1/2 -translate-y-1/2 z-[100] hidden lg:flex flex-col gap-3.5 pointer-events-auto">
      {scenes.map((s) => {
        const isActive = Math.abs(scrollProgress - s.pct) < 0.08;
        return (
          <button
            key={s.id}
            onClick={() => jumpTo(s.pct)}
            className={`group flex items-center justify-end gap-3 text-right font-mono transition-all cursor-pointer ${
              isActive ? "text-cyan-400 font-bold" : "text-gray-400 hover:text-gray-200"
            }`}
          >
            <span
              className={`text-[11px] tracking-widest uppercase transition-opacity duration-200 ${
                isActive ? "opacity-100" : "opacity-0 group-hover:opacity-100"
              }`}
              style={{
                textShadow: isActive ? "0 0 10px rgba(56,189,248,0.7)" : "none",
              }}
            >
              {s.label}
            </span>
            <span
              className={`rounded-full transition-all duration-300 ${
                isActive
                  ? "w-3 h-3 bg-cyan-400 shadow-[0_0_12px_rgba(56,189,248,0.9)]"
                  : "w-1.5 h-1.5 bg-gray-600 group-hover:bg-gray-300"
              }`}
            />
          </button>
        );
      })}
    </div>
  );
}
