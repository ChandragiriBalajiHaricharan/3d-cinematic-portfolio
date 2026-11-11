"use client";

export default function Footer() {
  return (
    <footer
      className="py-8 px-6 border-t text-center"
      style={{
        borderColor: "var(--border)",
        background: "var(--surface)",
      }}
    >
      <p className="text-xs font-mono text-[var(--text-secondary)]">
        © 2026 Balaji — Built with Next.js, GSAP, Lenis &amp; Three.js
      </p>
    </footer>
  );
}

