"use client";

import { useState } from "react";
import Reveal from "./Reveal";

export default function ContactSection() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">(
    "idle"
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("sending");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        setStatus("sent");
        setForm({ name: "", email: "", message: "" });
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  };

  return (
    <section
      id="contact"
      className="py-32 px-6 relative"
      style={{ background: "var(--bg)" }}
    >
      {/* Glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 50% 50% at 50% 100%, rgba(108,99,255,0.08) 0%, transparent 70%)",
        }}
      />

      <div className="max-w-2xl mx-auto relative z-10">
        <Reveal>
          <span className="section-label block mb-4 text-center">Contact</span>
        </Reveal>
        <Reveal delay={0.1}>
          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-center">
            Let&apos;s build something
            <span className="gradient-text"> together.</span>
          </h2>
        </Reveal>
        <Reveal delay={0.15}>
          <p className="text-[var(--text-secondary)] text-center mb-12">
            Open to freelance, collaboration, or full-time roles. If you have a
            problem that needs an intelligent solution, let&apos;s talk.
          </p>
        </Reveal>

        <Reveal delay={0.2}>
          <form
            onSubmit={handleSubmit}
            className="glow-border rounded-2xl p-8 flex flex-col gap-5"
            style={{ background: "var(--surface)" }}
          >
            {/* Name */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-mono text-[var(--text-secondary)] tracking-widest uppercase">
                Name
              </label>
              <input
                type="text"
                required
                value={form.name}
                onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                placeholder="Your name"
                className="bg-[var(--bg)] border border-[var(--border)] rounded-lg px-4 py-3 text-sm text-[var(--text-primary)] placeholder:text-[var(--text-secondary)] focus:outline-none focus:border-[var(--accent)] transition-colors duration-200"
              />
            </div>

            {/* Email */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-mono text-[var(--text-secondary)] tracking-widest uppercase">
                Email
              </label>
              <input
                type="email"
                required
                value={form.email}
                onChange={(e) =>
                  setForm((f) => ({ ...f, email: e.target.value }))
                }
                placeholder="your@email.com"
                className="bg-[var(--bg)] border border-[var(--border)] rounded-lg px-4 py-3 text-sm text-[var(--text-primary)] placeholder:text-[var(--text-secondary)] focus:outline-none focus:border-[var(--accent)] transition-colors duration-200"
              />
            </div>

            {/* Message */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-mono text-[var(--text-secondary)] tracking-widest uppercase">
                Message
              </label>
              <textarea
                required
                rows={5}
                value={form.message}
                onChange={(e) =>
                  setForm((f) => ({ ...f, message: e.target.value }))
                }
                placeholder="Tell me about your project..."
                className="bg-[var(--bg)] border border-[var(--border)] rounded-lg px-4 py-3 text-sm text-[var(--text-primary)] placeholder:text-[var(--text-secondary)] focus:outline-none focus:border-[var(--accent)] transition-colors duration-200 resize-none"
              />
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={status === "sending" || status === "sent"}
              className="mt-2 px-8 py-4 rounded-full text-sm font-mono tracking-widest uppercase transition-all duration-300 disabled:opacity-50"
              style={{
                background:
                  status === "sent" ? "#34d399" : "var(--accent)",
                color: "white",
                boxShadow:
                  status === "sent"
                    ? "0 0 30px rgba(52,211,153,0.3)"
                    : "0 0 30px var(--accent-glow)",
              }}
            >
              {status === "idle" && "Send Message"}
              {status === "sending" && "Sending..."}
              {status === "sent" && "✓ Sent! I'll be in touch."}
              {status === "error" && "Error — try again"}
            </button>
          </form>
        </Reveal>

        {/* Social links */}
        <Reveal delay={0.3}>
          <div className="flex justify-center gap-6 mt-10">
            {[
              { label: "GitHub", href: "https://github.com" },
              { label: "LinkedIn", href: "https://linkedin.com" },
              { label: "Twitter / X", href: "https://twitter.com" },
            ].map((s) => (
              <a
                key={s.label}
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm font-mono text-[var(--text-secondary)] hover:text-[var(--accent)] transition-colors duration-300"
              >
                {s.label}
              </a>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}

