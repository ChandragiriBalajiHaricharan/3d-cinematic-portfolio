"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Reveal from "./Reveal";

gsap.registerPlugin(ScrollTrigger);

const skills = [
  { name: "AI Agent Orchestration", level: 95, category: "Core" },
  { name: "LLM Tool Calling & Function Calling", level: 92, category: "Core" },
  { name: "Vector Memory & RAG", level: 90, category: "Core" },
  { name: "Python & TypeScript", level: 88, category: "Languages" },
  { name: "LangGraph / LangChain", level: 87, category: "Frameworks" },
  { name: "Test Engineering (179 ✓)", level: 95, category: "Quality" },
  { name: "REST APIs & Backend Integration", level: 85, category: "Backend" },
  { name: "Prompt Engineering", level: 93, category: "Core" },
];

const categories = ["Core", "Languages", "Frameworks", "Quality", "Backend"];

const categoryColors: Record<string, string> = {
  Core: "#6c63ff",
  Languages: "#a78bfa",
  Frameworks: "#818cf8",
  Quality: "#34d399",
  Backend: "#f97316",
};

export default function SkillsSection() {
  const barsRef = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    barsRef.current.forEach((bar, i) => {
      if (!bar) return;
      const fill = bar.querySelector<HTMLDivElement>(".skill-fill");
      if (!fill) return;
      const level = skills[i].level;

      gsap.fromTo(
        fill,
        { width: "0%" },
        {
          width: `${level}%`,
          duration: 1.2,
          ease: "power3.out",
          scrollTrigger: {
            trigger: bar,
            start: "top 85%",
            toggleActions: "play none none none",
          },
        }
      );
    });
  }, []);

  return (
    <section id="skills" className="py-32 px-6" style={{ background: "var(--bg)" }}>
      <div className="max-w-6xl mx-auto">
        <Reveal>
          <span className="section-label block mb-4">Skills</span>
        </Reveal>
        <Reveal delay={0.1}>
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            What I bring
            <span className="gradient-text"> to the table.</span>
          </h2>
        </Reveal>
        <Reveal delay={0.15}>
          <p className="text-[var(--text-secondary)] mb-16 max-w-xl">
            From raw LLM calls to production multi-agent pipelines — the full
            stack of modern AI engineering.
          </p>
        </Reveal>

        {/* Category legend */}
        <Reveal delay={0.2}>
          <div className="flex flex-wrap gap-3 mb-10">
            {categories.map((cat) => (
              <span
                key={cat}
                className="px-3 py-1 rounded-full text-xs font-mono border"
                style={{
                  borderColor: categoryColors[cat],
                  color: categoryColors[cat],
                  background: `${categoryColors[cat]}15`,
                }}
              >
                {cat}
              </span>
            ))}
          </div>
        </Reveal>

        {/* Skill bars */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {skills.map((skill, i) => (
            <div
              key={skill.name}
              ref={(el) => { barsRef.current[i] = el; }}
              className="group"
            >
              <div className="flex justify-between items-center mb-2">
                <div className="flex items-center gap-2">
                  <span
                    className="w-2 h-2 rounded-full"
                    style={{ background: categoryColors[skill.category] }}
                  />
                  <span className="text-sm text-[var(--text-primary)] font-medium">
                    {skill.name}
                  </span>
                </div>
                <span
                  className="text-xs font-mono"
                  style={{ color: categoryColors[skill.category] }}
                >
                  {skill.level}%
                </span>
              </div>
              <div
                className="relative h-1.5 rounded-full overflow-hidden"
                style={{ background: "rgba(255,255,255,0.05)" }}
              >
                <div
                  className="skill-fill h-full rounded-full"
                  style={{
                    background: `linear-gradient(90deg, ${categoryColors[skill.category]}, ${categoryColors[skill.category]}88)`,
                    boxShadow: `0 0 8px ${categoryColors[skill.category]}66`,
                    width: "0%",
                  }}
                />
              </div>
            </div>
          ))}
        </div>

        {/* Tools grid */}
        <Reveal delay={0.1} className="mt-20">
          <h3 className="text-xl font-semibold mb-6 text-[var(--text-secondary)]">
            Tools & Technologies
          </h3>
          <div className="flex flex-wrap gap-3">
            {[
              "Python", "TypeScript", "LangGraph", "LangChain",
              "OpenAI API", "Anthropic Claude", "Pinecone", "Chroma",
              "FastAPI", "Next.js", "React", "PostgreSQL",
              "Docker", "Git", "Pytest", "Jest",
            ].map((tool) => (
              <span
                key={tool}
                className="px-4 py-2 rounded-lg text-sm font-mono text-[var(--text-secondary)] border border-[var(--border)] hover:border-[var(--accent)] hover:text-[var(--accent)] transition-all duration-200 cursor-default"
                style={{ background: "var(--surface)" }}
              >
                {tool}
              </span>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}

