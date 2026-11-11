import Reveal from "./Reveal";

const projects = [
  {
    title: "Multi-Agent Research Pipeline",
    description:
      "An orchestrated pipeline of specialized AI agents that autonomously break down complex research queries, fetch sources, synthesize findings, and produce structured reports.",
    tags: ["LangGraph", "Python", "Pinecone", "OpenAI"],
    highlight: "Orchestration",
    icon: "🧠",
    link: "#",
  },
  {
    title: "Custom Tool-Calling Framework",
    description:
      "A lightweight framework for building, registering, and testing LLM tool calls — with schema validation, retry logic, and 179 automated integration tests.",
    tags: ["Python", "Pydantic", "Pytest", "Claude API"],
    highlight: "179 Tests",
    icon: "🔧",
    link: "#",
  },
  {
    title: "Vector Memory Agent",
    description:
      "A conversational agent with long-term vector memory using semantic search, automatic memory consolidation, and context-aware retrieval across sessions.",
    tags: ["Chroma", "LangChain", "FastAPI", "React"],
    highlight: "Vector Memory",
    icon: "🗄️",
    link: "#",
  },
  {
    title: "AI-Powered Code Reviewer",
    description:
      "An agent that reviews pull requests, identifies bugs, suggests improvements, and generates documentation — integrated directly into GitHub workflows.",
    tags: ["GitHub API", "OpenAI", "TypeScript", "Next.js"],
    highlight: "Automation",
    icon: "👁️",
    link: "#",
  },
];

export default function ProjectsSection() {
  return (
    <section
      id="projects"
      className="py-32 px-6"
      style={{ background: "var(--surface)" }}
    >
      <div
        className="absolute left-0 right-0 h-px"
        style={{
          background:
            "linear-gradient(90deg, transparent, var(--accent), transparent)",
          opacity: 0.3,
        }}
      />

      <div className="max-w-6xl mx-auto">
        <Reveal>
          <span className="section-label block mb-4">Projects</span>
        </Reveal>
        <Reveal delay={0.1}>
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Agents I&apos;ve built.
          </h2>
        </Reveal>
        <Reveal delay={0.15}>
          <p className="text-[var(--text-secondary)] mb-16 max-w-xl">
            Real systems, not demos. Each project is production-engineered with
            tests, error handling, and proper abstractions.
          </p>
        </Reveal>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {projects.map((project, i) => (
            <Reveal key={project.title} delay={i * 0.1}>
              <a
                href={project.link}
                className="group block h-full glow-border rounded-2xl p-7 transition-all duration-300 hover:scale-[1.02]"
                style={{
                  background: "var(--bg)",
                  boxShadow: "none",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.boxShadow =
                    "0 0 40px var(--accent-glow)";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.boxShadow = "none";
                }}
              >
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <span className="text-3xl">{project.icon}</span>
                  <span
                    className="text-xs font-mono px-2 py-1 rounded-full"
                    style={{
                      background: "var(--accent-glow)",
                      color: "var(--accent)",
                      border: "1px solid var(--accent)",
                    }}
                  >
                    {project.highlight}
                  </span>
                </div>

                {/* Title */}
                <h3 className="text-xl font-bold mb-3 group-hover:text-[var(--accent)] transition-colors duration-300">
                  {project.title}
                </h3>

                {/* Description */}
                <p className="text-[var(--text-secondary)] text-sm leading-relaxed mb-5">
                  {project.description}
                </p>

                {/* Tags */}
                <div className="flex flex-wrap gap-2">
                  {project.tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-xs font-mono px-2 py-0.5 rounded border border-[var(--border)] text-[var(--text-secondary)]"
                      style={{ background: "var(--surface)" }}
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                {/* Arrow */}
                <div className="mt-5 flex items-center gap-2 text-xs font-mono text-[var(--accent)] opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  View project <span>→</span>
                </div>
              </a>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

