"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import dynamic from "next/dynamic";

const ParticleField = dynamic(() => import("./ParticleField"), { ssr: false });

export default function HeroSection() {
  const headingRef = useRef<HTMLHeadingElement>(null);
  const subRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const badgesRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const tl = gsap.timeline({ delay: 0.8 });

    // Split heading into words for stagger
    if (headingRef.current) {
      const words = headingRef.current.querySelectorAll(".word");
      tl.fromTo(
        words,
        { y: 80, opacity: 0, rotateX: -20 },
        {
          y: 0,
          opacity: 1,
          rotateX: 0,
          duration: 0.9,
          stagger: 0.08,
          ease: "power4.out",
        }
      );
    }

    tl.fromTo(
      subRef.current,
      { y: 30, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.7, ease: "power3.out" },
      "-=0.4"
    );

    tl.fromTo(
      badgesRef.current,
      { y: 20, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.6, ease: "power3.out" },
      "-=0.3"
    );

    tl.fromTo(
      ctaRef.current,
      { y: 20, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.6, ease: "power3.out" },
      "-=0.2"
    );
  }, []);

  const badges = ["AI Orchestration", "Vector Memory", "Custom Tools", "179 Tests ✓"];

  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden">
      {/* Three.js background */}
      <ParticleField />

      {/* Gradient radial glow */}
      <div
        className="absolute inset-0 z-0"
        style={{
          background:
            "radial-gradient(ellipse 60% 60% at 50% 40%, rgba(108,99,255,0.12) 0%, transparent 70%)",
        }}
      />

      {/* Content */}
      <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">
        {/* Top label */}
        <div className="section-label mb-6 inline-block">
          AI Agent Engineer — Hyderabad, India
        </div>

        {/* Main heading with perspective */}
        <h1
          ref={headingRef}
          className="text-6xl md:text-8xl font-bold tracking-tight mb-6 leading-none"
          style={{ perspective: "1000px" }}
        >
          {["I", "build", "AI", "agents", "that", "actually", "work."].map(
            (word, i) => (
              <span
                key={i}
                className={`word inline-block mr-4 ${
                  word === "AI" || word === "work."
                    ? "gradient-text"
                    : ""
                }`}
              >
                {word}
              </span>
            )
          )}
        </h1>

        {/* Sub */}
        <p
          ref={subRef}
          className="text-lg md:text-xl text-[var(--text-secondary)] max-w-2xl mx-auto mb-8 leading-relaxed"
        >
          Orchestration, custom tools, vector memory, and 179 passing tests.
          Currently finishing my B.Tech in CSE in Hyderabad.
        </p>

        {/* Badges */}
        <div
          ref={badgesRef}
          className="flex flex-wrap justify-center gap-2 mb-10"
        >
          {badges.map((b) => (
            <span
              key={b}
              className="px-3 py-1 rounded-full text-xs font-mono tracking-wide border border-[var(--border)] text-[var(--text-secondary)] bg-[var(--surface)]"
            >
              {b}
            </span>
          ))}
        </div>

        {/* CTA Buttons */}
        <div ref={ctaRef} className="flex flex-col sm:flex-row gap-4 justify-center">
          <a
            href="#projects"
            className="group relative px-8 py-4 rounded-full text-sm font-mono tracking-widest uppercase overflow-hidden transition-all duration-300"
            style={{
              background: "var(--accent)",
              color: "white",
              boxShadow: "0 0 30px var(--accent-glow)",
            }}
          >
            <span className="relative z-10">View Work</span>
            <span
              className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              style={{
                background:
                  "linear-gradient(135deg, #6c63ff, #a78bfa)",
              }}
            />
          </a>

          <a
            href="#contact"
            className="px-8 py-4 rounded-full text-sm font-mono tracking-widest uppercase border border-[var(--border)] text-[var(--text-secondary)] hover:border-[var(--accent)] hover:text-[var(--accent)] transition-all duration-300"
          >
            Get in Touch
          </a>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 z-10">
        <span className="text-xs font-mono text-[var(--text-secondary)] tracking-widest uppercase">
          scroll
        </span>
        <div className="w-px h-12 bg-gradient-to-b from-[var(--accent)] to-transparent animate-pulse" />
      </div>
    </section>
  );
}

