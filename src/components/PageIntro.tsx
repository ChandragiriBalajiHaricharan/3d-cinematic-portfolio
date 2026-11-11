"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

export default function PageIntro() {
  const overlayRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const tl = gsap.timeline();

    tl.fromTo(
      textRef.current,
      { opacity: 0, y: 10 },
      { opacity: 1, y: 0, duration: 0.6, ease: "power3.out" }
    )
      .to(textRef.current, { opacity: 0, y: -10, duration: 0.5, ease: "power3.in", delay: 0.5 })
      .to(overlayRef.current, {
        yPercent: -100,
        duration: 0.8,
        ease: "power4.inOut",
      });

    // Prevent scroll during intro
    document.body.style.overflow = "hidden";
    tl.eventCallback("onComplete", () => {
      document.body.style.overflow = "";
    });
  }, []);

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-[9999] flex items-center justify-center"
      style={{ background: "var(--bg)" }}
    >
      <div ref={textRef} className="text-center">
        <p className="text-xs font-mono tracking-[0.4em] uppercase text-[var(--accent)] mb-3">
          Loading
        </p>
        <h1 className="text-4xl font-bold gradient-text">Balaji</h1>
        <div className="mt-4 flex justify-center gap-1">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="w-1 h-1 rounded-full"
              style={{
                background: "var(--accent)",
                animation: `pulse 1s ease-in-out ${i * 0.2}s infinite`,
              }}
            />
          ))}
        </div>
      </div>
      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 0.3; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.5); }
        }
      `}</style>
    </div>
  );
}

