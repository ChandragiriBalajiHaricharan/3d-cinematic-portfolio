"use client";

import dynamic from "next/dynamic";

const CinematicExperience = dynamic(
  () => import("@/components/CinematicExperience"),
  { ssr: false }
);

export default function Home() {
  return (
    <main className="w-screen h-screen overflow-hidden bg-[#0a0500]">
      <CinematicExperience />
    </main>
  );
}
