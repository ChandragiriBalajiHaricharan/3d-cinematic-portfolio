"use client";

import dynamic from "next/dynamic";

const CinematicExperience = dynamic(
  () => import("@/components/CinematicExperience"),
  { ssr: false }
);

export default function Home() {
  return (
    <main className="w-full min-h-screen relative bg-[#030712]">
      <CinematicExperience />
    </main>
  );
}
