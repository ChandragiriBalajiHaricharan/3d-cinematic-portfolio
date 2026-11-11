const items = [
  "AI Agent Engineering",
  "LLM Orchestration",
  "Vector Memory",
  "Custom Tool Calling",
  "179 Passing Tests",
  "B.Tech CSE",
  "Hyderabad",
  "Available for Work",
];

export default function Marquee() {
  const all = [...items, ...items]; // duplicate for seamless loop

  return (
    <div
      className="relative overflow-hidden py-4 border-y"
      style={{
        borderColor: "var(--border)",
        background: "var(--surface)",
      }}
    >
      {/* Fade edges */}
      <div
        className="absolute left-0 top-0 bottom-0 w-20 z-10 pointer-events-none"
        style={{
          background: "linear-gradient(90deg, var(--surface), transparent)",
        }}
      />
      <div
        className="absolute right-0 top-0 bottom-0 w-20 z-10 pointer-events-none"
        style={{
          background: "linear-gradient(-90deg, var(--surface), transparent)",
        }}
      />

      <div
        className="flex whitespace-nowrap"
        style={{
          animation: "marquee 24s linear infinite",
        }}
      >
        {all.map((item, i) => (
          <span
            key={i}
            className="inline-flex items-center gap-4 px-6 text-sm font-mono tracking-widest uppercase text-[var(--text-secondary)]"
          >
            <span
              className="w-1.5 h-1.5 rounded-full flex-shrink-0"
              style={{ background: "var(--accent)" }}
            />
            {item}
          </span>
        ))}
      </div>

      <style>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
      `}</style>
    </div>
  );
}

