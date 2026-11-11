import Reveal from "./Reveal";

const stats = [
  { value: "179", label: "Passing Tests" },
  { value: "B.Tech", label: "CSE, Hyderabad" },
  { value: "AI", label: "Agent Specialist" },
];

export default function AboutSection() {
  return (
    <section
      id="about"
      className="relative py-32 px-6"
      style={{ background: "var(--surface)" }}
    >
      {/* Subtle top border glow */}
      <div
        className="absolute top-0 left-0 right-0 h-px"
        style={{
          background:
            "linear-gradient(90deg, transparent, var(--accent), transparent)",
          opacity: 0.3,
        }}
      />

      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          {/* Left — text */}
          <div>
            <Reveal>
              <span className="section-label block mb-4">About</span>
            </Reveal>
            <Reveal delay={0.1}>
              <h2 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
                Engineering the minds
                <br />
                <span className="gradient-text">behind the machines.</span>
              </h2>
            </Reveal>
            <Reveal delay={0.2}>
              <p className="text-[var(--text-secondary)] text-lg leading-relaxed mb-6">
                Hi, I&apos;m{" "}
                <span className="text-[var(--text-primary)] font-semibold">
                  Balaji
                </span>
                . I design AI agents and the solid engineering behind them —
                orchestration pipelines, custom tool integrations, vector memory
                systems, and production-grade test suites.
              </p>
            </Reveal>
            <Reveal delay={0.3}>
              <p className="text-[var(--text-secondary)] leading-relaxed mb-8">
                Currently finishing my B.Tech in Computer Science in Hyderabad,
                I combine the rigour of engineering fundamentals with the
                cutting edge of large language model tooling to build agents
                that don&apos;t just demo well — they ship.
              </p>
            </Reveal>
            <Reveal delay={0.35}>
              <a
                href="#contact"
                className="inline-flex items-center gap-2 text-sm font-mono text-[var(--accent)] hover:gap-4 transition-all duration-300"
              >
                Let&apos;s build something →
              </a>
            </Reveal>
          </div>

          {/* Right — stats + avatar placeholder */}
          <div className="flex flex-col gap-6">
            {/* Avatar card */}
            <Reveal from="right" delay={0.1}>
              <div
                className="glow-border rounded-2xl p-6 flex items-center gap-5"
                style={{ background: "rgba(108,99,255,0.05)" }}
              >
                {/* Avatar placeholder */}
                <div
                  className="w-20 h-20 rounded-full flex items-center justify-center text-2xl font-bold flex-shrink-0"
                  style={{
                    background:
                      "linear-gradient(135deg, var(--accent), #a78bfa)",
                    boxShadow: "0 0 24px var(--accent-glow)",
                  }}
                >
                  B
                </div>
                <div>
                  <p className="font-semibold text-[var(--text-primary)]">
                    Balaji
                  </p>
                  <p className="text-sm text-[var(--text-secondary)] font-mono">
                    AI Agent Engineer
                  </p>
                  <p className="text-xs text-[var(--accent)] font-mono mt-1">
                    ● Available for work
                  </p>
                </div>
              </div>
            </Reveal>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4">
              {stats.map((stat, i) => (
                <Reveal key={stat.label} from="right" delay={0.15 + i * 0.08}>
                  <div
                    className="glow-border rounded-xl p-4 text-center"
                    style={{ background: "rgba(108,99,255,0.03)" }}
                  >
                    <p className="text-2xl font-bold gradient-text mb-1">
                      {stat.value}
                    </p>
                    <p className="text-xs text-[var(--text-secondary)] font-mono">
                      {stat.label}
                    </p>
                  </div>
                </Reveal>
              ))}
            </div>

            {/* Code snippet decoration */}
            <Reveal from="right" delay={0.3}>
              <div
                className="glow-border rounded-xl p-5 font-mono text-xs leading-relaxed"
                style={{ background: "var(--bg)" }}
              >
                <span className="text-[var(--text-secondary)]">// Balaji&apos;s stack</span>
                <br />
                <span className="text-[#a78bfa]">const</span>{" "}
                <span className="text-[var(--text-primary)]">agent</span>{" "}
                <span className="text-[var(--text-secondary)]">=</span>{" "}
                <span className="text-[#a78bfa]">new</span>{" "}
                <span className="text-[var(--accent)]">AIAgent</span>
                <span className="text-[var(--text-secondary)]">{"({"}</span>
                <br />
                <span className="pl-4 text-[var(--text-secondary)]">
                  orchestration:{" "}
                </span>
                <span className="text-green-400">&quot;LangGraph&quot;</span>
                <span className="text-[var(--text-secondary)]">,</span>
                <br />
                <span className="pl-4 text-[var(--text-secondary)]">
                  memory:{" "}
                </span>
                <span className="text-green-400">&quot;Pinecone&quot;</span>
                <span className="text-[var(--text-secondary)]">,</span>
                <br />
                <span className="pl-4 text-[var(--text-secondary)]">
                  tests:{" "}
                </span>
                <span className="text-orange-400">179</span>
                <span className="text-[var(--text-secondary)]">,</span>
                <br />
                <span className="text-[var(--text-secondary)]">{"});"}</span>
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}

