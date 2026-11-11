"use client";

import { useRef, useMemo, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { ScrollControls, Scroll, useScroll } from "@react-three/drei";
import * as THREE from "three";
import {
  AtmosphericSky,
  EiffelTower,
  CityBoulevard,
  BikeRider,
  OceanWater,
  Speedboat,
  FloatingBargeBillboard,
} from "./CityWorld";
import { SoundToggle, globalAudio } from "./SoundEngine";
import CaseStudyDrawer from "./CaseStudyDrawer";
import JourneyNavigator from "./JourneyNavigator";

// 3D Skills data
const skills = [
  {
    num: "SKILL 01",
    title: "AI Agent Orchestration",
    desc: "Cyclic multi-agent graphs, state machines, supervisor delegation with LangGraph.",
    pills: ["LangGraph", "Python", "StateGraph"],
  },
  {
    num: "SKILL 02",
    title: "Tool-Calling & Validation",
    desc: "Production LLM tool execution with strict Pydantic schemas, timeouts, and automated retries.",
    pills: ["Pydantic", "Tool Calling", "Mocks"],
  },
  {
    num: "SKILL 03",
    title: "Vector Memory & RAG",
    desc: "Long-term episodic vector storage, semantic recall, hybrid search with Pinecone & Chroma.",
    pills: ["Pinecone", "Chroma", "Embeddings"],
  },
  {
    num: "SKILL 04",
    title: "179 Automated Tests",
    desc: "Rigorous test-driven agent engineering. Deterministic mocks, regression suites, and CI/CD.",
    pills: ["Pytest", "179 Tests", "CI/CD"],
  },
];

// Barge Projects data (Photo 5)
const bargeProjects = [
  {
    step: "PROJECT 01 // ORCHESTRATION",
    title: "MULTI-AGENT RESEARCH PIPELINE",
    codePreview: "// LangGraph Supervisor + 4 Specialized Worker Agents\nconst report = await researchGraph.invoke({ query: 'LLM Reasoning Trends 2026' });",
    desc: "An autonomous swarm of research agents that break down multi-step queries, query vector indices, cross-verify sources, and synthesize verified executive briefs.",
    pills: ["+ LANGGRAPH", "+ PYTHON", "+ PINECONE", "+ OPENAI"],
    z: -170,
  },
  {
    step: "PROJECT 02 // QUALITY & TESTS",
    title: "TOOL-CALLING ENGINE (179 TESTS)",
    codePreview: "// 179 passing integration tests verifying retry logic & schemas\n$ pytest tests/ -v  # 179 passed in 4.12s [100%]",
    desc: "A battle-tested runtime for registering, sandboxing, and monitoring LLM tool calls. Zero hallucinations through strict schema enforcement and fault-tolerant fallbacks.",
    pills: ["+ PYTEST (179 PASSING)", "+ PYDANTIC", "+ CLAUDE API", "+ DOCKER"],
    z: -260,
  },
  {
    step: "PROJECT 03 // VECTOR MEMORY",
    title: "VECTOR MEMORY AGENT",
    codePreview: "// Context-aware semantic memory consolidation across sessions\nconst memories = await memoryEngine.recall({ query, threshold: 0.82 });",
    desc: "Conversational intelligence equipped with long-term vector memory consolidation. Summarizes key preferences and context across hundreds of conversation turns.",
    pills: ["+ CHROMA DB", "+ LANGCHAIN", "+ FASTAPI", "+ REACT"],
    z: -350,
  },
  {
    step: "PROJECT 04 // AUTOMATION",
    title: "AUTONOMOUS PR CODE REVIEWER",
    codePreview: "// Webhook triggers deep AST inspection & security audit\nreviewAgent.analyzeDiff(pullRequest.diff) => Approved ✓",
    desc: "An AI review agent embedded in GitHub CI pipelines. Detects anti-patterns, security vulnerabilities, edge-case bugs, and generates constructive PR comments.",
    pills: ["+ TYPESCRIPT", "+ GITHUB API", "+ CLAUDE", "+ NEXT.JS"],
    z: -440,
  },
];

// Main 3D Scene Controller
function CinematicScene({ onSelectProject }: { onSelectProject: (title: string) => void }) {
  const scroll = useScroll();
  const { camera } = useThree();

  const bikeGroupRef = useRef<THREE.Group>(null);
  const boatGroupRef = useRef<THREE.Group>(null);

  const camTarget = useMemo(() => new THREE.Vector3(), []);
  const lookTarget = useMemo(() => new THREE.Vector3(), []);

  useFrame((state) => {
    const r = scroll.offset;
    const time = state.clock.elapsedTime;

    let currentBikeX = 0;
    let currentBikeZ = 95;
    let currentBikeLean = 0;

    let currentBoatX = 0;
    let currentBoatZ = -70;

    // ==============================================================
    // ACT 1: [0.00 -> 0.14] FOCUS ON PARIS EIFFEL TOWER & BOULEVARD
    // Camera starts high on the boulevard looking down at Eiffel Tower
    // Bike is visible parked in front of camera at z=95!
    // ==============================================================
    if (r < 0.14) {
      const p = r / 0.14;
      camTarget.set(0, 16 - p * 6, 125 - p * 15);
      lookTarget.set(0, 18, -20);
      currentBikeX = 0;
      currentBikeZ = 95;
      globalAudio.update("idle", 0.1);
    }
    // ==============================================================
    // ACT 2: [0.14 -> 0.28] REVEAL MY NAME: "BALAJI — AI AGENT ENGINEER"
    // Camera glides down to boulevard level, bike is right in front waiting!
    // ==============================================================
    else if (r < 0.28) {
      const p = (r - 0.14) / 0.14;
      camTarget.set(0, 10 - p * 5, 110 - p * 8);
      lookTarget.set(0, 4, 30);
      currentBikeX = 0;
      currentBikeZ = 95;
      globalAudio.update("idle", 0.2);
    }
    // ==============================================================
    // ACT 3: [0.28 -> 0.48] MOTORCYCLE RIDE & SKILLS APPEAR ONE-BY-ONE
    // Bike speeds down boulevard from z=95 down to z=-65
    // ==============================================================
    else if (r < 0.48) {
      const p = (r - 0.28) / 0.20;
      currentBikeZ = 95 - p * 160; // down to pier z=-65
      currentBikeX = Math.sin(p * Math.PI * 4) * 1.6;
      currentBikeLean = Math.cos(p * Math.PI * 4) * 0.18;

      // 3rd-person chase camera locked behind motorcycle
      camTarget.set(currentBikeX * 0.6, 3.5, currentBikeZ + 7.5);
      lookTarget.set(currentBikeX, 2.2, currentBikeZ - 18);
      globalAudio.update("bike", 0.75);
    }
    // ==============================================================
    // ACT 4: [0.48 -> 0.58] SEAMLESS TRANSITION FROM PIER TO SPEEDBOAT (Photo 6)
    // Boat launches into turquoise open sea! Sweeping aerial view
    // ==============================================================
    else if (r < 0.58) {
      const p = (r - 0.48) / 0.10;
      currentBoatZ = -70 - p * 60; // z=-70 to z=-130
      currentBoatX = 0;

      // Aerial drone view (Photo 6 exact match!)
      camTarget.set(0, 14 + p * 6, currentBoatZ + 24);
      lookTarget.set(0, 0, currentBoatZ - 30);
      globalAudio.update("boat", 0.85);
    }
    // ==============================================================
    // ACT 5: [0.58 -> 0.88] SPEEDBOAT CRUISES PAST FLOATING BARGES ONE-BY-ONE (Photo 5 GTA Vice City match!)
    // ==============================================================
    else if (r < 0.88) {
      const p = (r - 0.58) / 0.30;
      currentBoatZ = -130 - p * 340; // sails from z=-130 to z=-470
      currentBoatX = Math.sin(p * Math.PI * 4) * 2.2; // gentle channel cruise

      // 3rd-person chase camera right behind boat (Photo 5 match!)
      camTarget.set(currentBoatX * 0.7, 4.2, currentBoatZ + 13);

      // Camera smoothly swivels to frame the billboard being passed alongside
      const gazeSide = Math.sin(p * Math.PI * 4);
      lookTarget.set(-gazeSide * 6.5, 6.0, currentBoatZ - 20);
      globalAudio.update("boat", 0.78);
    }
    // ==============================================================
    // ACT 6: [0.88 -> 1.00] DESTINATION MARINA & ABOUT BALAJI FINALE
    // ==============================================================
    else {
      const p = (r - 0.88) / 0.12;
      currentBoatZ = -470 - p * 30;
      currentBoatX = 0;

      camTarget.set(0, 7 + p * 4, currentBoatZ + 20);
      lookTarget.set(0, 8, currentBoatZ - 25);
      globalAudio.update("idle", 0.1);
    }

    // Direct GPU Three.js mutation for Motorcycle
    if (bikeGroupRef.current) {
      if (r < 0.48) {
        bikeGroupRef.current.visible = true;
        bikeGroupRef.current.position.set(currentBikeX, 0, currentBikeZ);
        bikeGroupRef.current.rotation.z = -currentBikeLean;
      } else {
        bikeGroupRef.current.visible = false;
      }
    }

    // Direct GPU Three.js mutation for Speedboat
    if (boatGroupRef.current) {
      if (r >= 0.44) {
        boatGroupRef.current.visible = true;
        const waterBob = Math.sin(time * 3.5) * 0.05;
        const waterRoll = Math.sin(time * 2.8) * 0.03;
        boatGroupRef.current.position.set(currentBoatX, -0.05 + waterBob, currentBoatZ);
        boatGroupRef.current.rotation.z = waterRoll;
      } else {
        boatGroupRef.current.visible = false;
      }
    }

    // Camera smoothing
    camera.position.lerp(camTarget, 0.08);
    const currentLook = new THREE.Vector3(0, 0, -1).applyQuaternion(camera.quaternion).add(camera.position);
    currentLook.lerp(lookTarget, 0.08);
    camera.lookAt(currentLook);
  });

  return (
    <>
      <color attach="background" args={["#0c1a2e"]} />
      <ambientLight intensity={0.7} color="#e0f2fe" />
      <directionalLight position={[60, 60, -60]} intensity={2.8} color="#ff9933" castShadow />
      <directionalLight position={[0, 80, -320]} intensity={2.6} color="#38bdf8" />
      <directionalLight position={[-60, 50, -450]} intensity={1.8} color="#fed7aa" />
      <fog attach="fog" args={["#0c1a2e", 90, 750]} />

      {/* Atmospheric Paris Sunset & Clouds */}
      <AtmosphericSky />

      {/* ACT 1: Paris Eiffel Tower at center of attention */}
      <EiffelTower position={[0, 0, -45]} />

      {/* ACT 3: Paris Boulevard with Haussmann buildings and pier */}
      <CityBoulevard />

      {/* ACT 3: Motorcycle & Rider (Controlled via direct ref) */}
      <group ref={bikeGroupRef}>
        <BikeRider />
      </group>

      {/* ACT 4 & 5: Vast Turquoise Ocean (Photo 5 & 6) */}
      <OceanWater />

      {/* ACT 4 & 5: Speedboat with White Wake (Controlled via direct ref) */}
      <group ref={boatGroupRef}>
        <Speedboat />
      </group>

      {/* ACT 5: 4 Giant Floating Barge Billboards along the waterway (Photo 5 GTA Vice City match!) */}
      {bargeProjects.map((p, idx) => {
        const isLeft = idx % 2 === 0;
        const posX = isLeft ? -17 : 17;
        const rotY = isLeft ? 0.32 : -0.32;
        const posZ = -180 - idx * 85;

        return (
          <FloatingBargeBillboard
            key={p.step}
            position={[posX, 0, posZ]}
            rotation={[0, rotY, 0]}
            project={p}
            onClick={() => onSelectProject(p.title)}
          />
        );
      })}
    </>
  );
}

// 2D HTML Scroll Overlays (Clean, responsive, never crashes React 19!)
function ScrollOverlayContent({ onSelectProject }: { onSelectProject: (title: string) => void }) {
  return (
    <div style={{ width: "100%", height: "100%", position: "relative" }}>
      {/* ACT 1: Eiffel Tower Focus (0 - 14%) */}
      <div style={{ position: "absolute", top: "8vh", left: 0, right: 0, textAlign: "center" }}>
        <p className="overlay-section-label" style={{ letterSpacing: "0.4em" }}>
          PARIS AT DUSK // SCROLL TO EXPLORE
        </p>
      </div>

      {/* ACT 2: My Name Screen (14% - 28%) */}
      <div
        style={{
          position: "absolute",
          top: "165vh",
          left: 0,
          right: 0,
          textAlign: "center",
        }}
        className="overlay-title"
      >
        <p className="sub" style={{ letterSpacing: "0.45em" }}>AI AGENT ENGINEER</p>
        <h1 style={{ color: "#fff", textShadow: "0 0 60px rgba(255,170,50,0.8)" }}>
          BALAJI
        </h1>
        <p className="sub" style={{ marginTop: "14px", color: "rgba(255,200,120,0.9)", letterSpacing: "0.28em" }}>
          ORCHESTRATION · VECTOR MEMORY · 179 TESTS
        </p>
      </div>

      {/* ACT 3: The Motorcycle Ride — The center 65% is COMPLETELY OPEN for the motorcycle! */}
      {/* Skill 1: Left side as bike starts down the avenue */}
      <div
        style={{
          position: "absolute",
          top: "290vh",
          left: "4vw",
          maxWidth: "340px",
        }}
      >
        <div className="skill-card-3d">
          <div className="num">01 // {skills[0].num}</div>
          <div className="title">{skills[0].title}</div>
          <div className="desc">{skills[0].desc}</div>
          <div className="flex gap-1.5 mt-2.5">
            {skills[0].pills.map((pill) => (
              <span key={pill} className="text-[10px] font-mono px-2 py-0.5 rounded border border-amber-500/40 text-amber-300">
                {pill}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Skill 2: Right side a bit further down */}
      <div
        style={{
          position: "absolute",
          top: "335vh",
          right: "4vw",
          maxWidth: "340px",
        }}
      >
        <div className="skill-card-3d">
          <div className="num">02 // {skills[1].num}</div>
          <div className="title">{skills[1].title}</div>
          <div className="desc">{skills[1].desc}</div>
          <div className="flex gap-1.5 mt-2.5">
            {skills[1].pills.map((pill) => (
              <span key={pill} className="text-[10px] font-mono px-2 py-0.5 rounded border border-amber-500/40 text-amber-300">
                {pill}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Skill 3: Left side further down */}
      <div
        style={{
          position: "absolute",
          top: "385vh",
          left: "4vw",
          maxWidth: "340px",
        }}
      >
        <div className="skill-card-3d">
          <div className="num">03 // {skills[2].num}</div>
          <div className="title">{skills[2].title}</div>
          <div className="desc">{skills[2].desc}</div>
          <div className="flex gap-1.5 mt-2.5">
            {skills[2].pills.map((pill) => (
              <span key={pill} className="text-[10px] font-mono px-2 py-0.5 rounded border border-amber-500/40 text-amber-300">
                {pill}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Skill 4: Right side before reaching harbor pier */}
      <div
        style={{
          position: "absolute",
          top: "435vh",
          right: "4vw",
          maxWidth: "340px",
        }}
      >
        <div className="skill-card-3d">
          <div className="num">04 // {skills[3].num}</div>
          <div className="title">{skills[3].title}</div>
          <div className="desc">{skills[3].desc}</div>
          <div className="flex gap-1.5 mt-2.5">
            {skills[3].pills.map((pill) => (
              <span key={pill} className="text-[10px] font-mono px-2 py-0.5 rounded border border-amber-500/40 text-amber-300">
                {pill}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* ACT 4: Harbor Dock & Sea Voyage Transition (48% - 58%) */}
      <div style={{ position: "absolute", top: "490vh", left: 0, right: 0, textAlign: "center" }} className="overlay-title">
        <p className="sub" style={{ color: "#38bdf8", letterSpacing: "0.4em" }}>ACT II // THE OPEN SEA</p>
        <h1 style={{ fontSize: "clamp(32px, 5.5vw, 70px)", color: "#fff", textShadow: "0 0 40px rgba(56,189,248,0.7)" }}>
          THE PROJECTS
        </h1>
        <p className="sub" style={{ color: "rgba(224,242,254,0.8)", fontSize: "12px" }}>
          SPEEDBOAT VOYAGE PAST FLOATING BARGE BILLBOARDS
        </p>
      </div>

      {/* ACT 5: In-World 3D Billboards (Projects are painted directly onto the 3D barge screens) */}
      <div
        style={{
          position: "absolute",
          top: "590vh",
          left: 0,
          right: 0,
          textAlign: "center",
          pointerEvents: "none",
        }}
      >
        <span
          style={{
            fontFamily: "monospace",
            fontSize: "12px",
            letterSpacing: "0.25em",
            textTransform: "uppercase",
            color: "#38bdf8",
            background: "rgba(15, 23, 42, 0.8)",
            border: "1px solid rgba(56, 189, 248, 0.4)",
            padding: "10px 24px",
            borderRadius: "9999px",
            backdropFilter: "blur(10px)",
          }}
        >
          💡 3D WATERWAY BILLBOARDS // CLICK ANY BILLBOARD IN 3D TO OPEN CASE STUDY
        </span>
      </div>

      {/* ACT 6: Last — About Me & Contact (88% - 100%) */}
      <div
        style={{
          position: "absolute",
          top: "890vh",
          left: 0,
          right: 0,
        }}
        className="overlay-contact"
      >
        <p className="sub" style={{ color: "rgba(255,180,60,0.9)", marginBottom: "14px", fontFamily: "monospace", letterSpacing: "0.3em" }}>
          FINAL DESTINATION // ABOUT BALAJI
        </p>
        <h2>ENGINEERING FOR HIGH STAKES</h2>
        <p style={{ maxWidth: 580, margin: "0 auto 28px", color: "rgba(255,255,255,0.75)", fontSize: 16, lineHeight: 1.7 }}>
          Finishing my B.Tech in CSE in Hyderabad. I specialize in designing autonomous
          AI agent systems with solid engineering foundations: multi-agent graph orchestration,
          zero-hallucination tool calling, vector memory RAG, and comprehensive test suites.
        </p>
        <div style={{ display: "flex", gap: "16px", justifyContent: "center", marginBottom: "32px", pointerEvents: "auto" }}>
          <a
            href="mailto:contact@balaji.dev"
            style={{
              padding: "12px 28px",
              borderRadius: "9999px",
              background: "#ffb43c",
              color: "#000",
              fontWeight: 700,
              fontFamily: "monospace",
              fontSize: "13px",
              letterSpacing: "0.15em",
              textDecoration: "none",
            }}
          >
            LET&apos;S TALK →
          </a>
        </div>
        <p className="email">
          EMAIL: <a href="mailto:contact@balaji.dev" style={{ color: "#ffb43c", textDecoration: "underline", pointerEvents: "auto" }}>contact@balaji.dev</a>
        </p>
      </div>
    </div>
  );
}

// Top Bar HUD
function TopHUD() {
  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 100,
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "20px 32px",
        pointerEvents: "none",
        fontFamily: "monospace",
        fontSize: "12px",
        letterSpacing: "0.2em",
        color: "rgba(255, 200, 120, 0.8)",
        background: "linear-gradient(180deg, rgba(10,5,0,0.7) 0%, transparent 100%)",
      }}
    >
      <div>BALAJI // AI AGENTS</div>
      <div style={{ display: "flex", gap: "20px", alignItems: "center" }}>
        <SoundToggle />
        <span className="hidden md:inline">HYDERABAD, IN</span>
        <span className="hidden md:inline">● LIVE 3D</span>
      </div>
    </div>
  );
}

// Bottom Scroll Hint
function BottomHUD() {
  return (
    <div
      style={{
        position: "fixed",
        bottom: 24,
        left: "50%",
        transform: "translateX(-50%)",
        zIndex: 100,
        pointerEvents: "none",
        fontFamily: "monospace",
        fontSize: "11px",
        letterSpacing: "0.3em",
        textTransform: "uppercase",
        color: "rgba(255, 180, 60, 0.75)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "6px",
      }}
    >
      <span>SCROLL TO ADVANCE JOURNEY</span>
      <div
        style={{
          width: 1,
          height: 20,
          background: "linear-gradient(180deg, rgba(255,180,60,0.8), transparent)",
        }}
      />
    </div>
  );
}

// Main Page Component
export default function CinematicExperience() {
  const [selectedProject, setSelectedProject] = useState<string | null>(null);

  return (
    <div style={{ width: "100vw", height: "100vh", position: "relative", overflow: "hidden", background: "#060913" }}>
      <TopHUD />
      <JourneyNavigator />
      <BottomHUD />

      {/* Case Study Modal Drawer */}
      <CaseStudyDrawer
        projectKey={selectedProject}
        onClose={() => setSelectedProject(null)}
      />

      <Canvas
        shadows
        camera={{ position: [0, 16, 125], fov: 50, near: 0.1, far: 950 }}
        gl={{
          antialias: true,
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1.15,
        }}
        style={{ width: "100%", height: "100%", position: "absolute", inset: 0 }}
      >
        <ScrollControls pages={10} damping={0.25}>
          <CinematicScene onSelectProject={(title) => setSelectedProject(title)} />
          <Scroll html style={{ width: "100%", height: "100%" }}>
            <ScrollOverlayContent onSelectProject={(title) => setSelectedProject(title)} />
          </Scroll>
        </ScrollControls>
      </Canvas>
    </div>
  );
}
