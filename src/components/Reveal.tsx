"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

interface RevealProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  from?: "bottom" | "left" | "right" | "fade";
}

export default function Reveal({
  children,
  className = "",
  delay = 0,
  from = "bottom",
}: RevealProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current) return;

    const fromVars: Record<string, gsap.TweenVars> = {
      bottom: { y: 50, opacity: 0 },
      left: { x: -50, opacity: 0 },
      right: { x: 50, opacity: 0 },
      fade: { opacity: 0 },
    };

    gsap.fromTo(ref.current, fromVars[from], {
      y: 0,
      x: 0,
      opacity: 1,
      duration: 0.9,
      delay,
      ease: "power3.out",
      scrollTrigger: {
        trigger: ref.current,
        start: "top 85%",
        toggleActions: "play none none none",
      },
    });
  }, [delay, from]);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}

