"use client";

import { useRef, useMemo, useState, Suspense } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { ScrollControls, Scroll, useScroll, Text } from "@react-three/drei";
import * as THREE from "three";
import {
  AtmosphericSky,
  EiffelTower,
  ParisFerrisWheel,
  CityBoulevard,
  RealManCharacter,
  RealCarbonBike,
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
    // ACT 1: [0.00 -> 0.14] HERO EIFFEL TOWER & BLUE PARIS SKY (Image 1 match!)
    // Low-angle dramatic camera looking up at Eiffel Tower in the bright blue sky
    // ==============================================================
    if (r < 0.14) {
      const p = r / 0.14;
      const swayX = Math.sin(time * 0.7) * 0.25;
      const swayY = Math.cos(time * 0.5) * 0.15;
      camTarget.set(7 + swayX, 8 + swayY - p * 2, 28 - p * 8);
      lookTarget.set(-2, 42, -50);
      currentBikeX = 0;
      currentBikeZ = 95;
      globalAudio.update("idle", 0.1);
    }
    // ==============================================================
    // ACT 2: [0.14 -> 0.28] 3D GIANT CITY TITLE (Image 4 match!)
    // Camera swoops down to boulevard level, framing 3D title in city sky
    // ==============================================================
    else if (r < 0.28) {
      const p = (r - 0.14) / 0.14;
      camTarget.set(0, 11 - p * 5, 42 - p * 12);
      lookTarget.set(0, 14 - p * 6, 12);
      currentBikeX = 0;
      currentBikeZ = 95;
      globalAudio.update("idle", 0.2);
    }
    // ==============================================================
    // ACT 3: [0.28 -> 0.48] MOTORCYCLE RIDE UP HIGHWAY RAMP (Image 5 match!)
    // Bike speeds up bridge ramp towards overhead sign 'STILL WITH ME?'
    // ==============================================================
    else if (r < 0.48) {
      const p = (r - 0.28) / 0.20;
      currentBikeZ = 95 - p * 160; // down to pier z=-65
      currentBikeX = Math.sin(p * Math.PI * 4) * 1.5;
      currentBikeLean = Math.cos(p * Math.PI * 4) * 0.18;
      const bikeY = currentBikeZ < 20 ? (20 - currentBikeZ) * 0.08 : 0;

      // 3rd-person chase camera locked behind motorcycle
      camTarget.set(currentBikeX * 0.6, bikeY + 3.4, currentBikeZ + 7.5);
      lookTarget.set(currentBikeX, bikeY + 2.0, currentBikeZ - 18);
      globalAudio.update("bike", 0.75);
    }
    // ==============================================================
    // ACT 4: [0.48 -> 0.58] SPEEDBOAT ON TURQUOISE SEA (Image 2 match!)
    // Sweeping high aerial drone view of boat in turquoise water
    // ==============================================================
    else if (r < 0.58) {
      const p = (r - 0.48) / 0.10;
      currentBoatZ = -70 - p * 60; // z=-70 to z=-130
      currentBoatX = 0;

      // Aerial drone view (Image 2 exact match!)
      camTarget.set(0, 24 + p * 6, currentBoatZ + 36);
      lookTarget.set(0, 0, currentBoatZ - 40);
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
        const bikeY = currentBikeZ < 20 ? (20 - currentBikeZ) * 0.08 : 0;
        bikeGroupRef.current.position.set(currentBikeX, bikeY, currentBikeZ);
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
      {/* Radiant Azure Blue Sky & Sun (Image 1 & 2 match!) */}
      <color attach="background" args={["#38bdf8"]} />
      <ambientLight intensity={1.1} color="#ffffff" />
      <directionalLight position={[60, 80, -40]} intensity={3.5} color="#fff1cc" castShadow />
      <directionalLight position={[-40, 40, 60]} intensity={1.2} color="#bae6fd" />
      <fog attach="fog" args={["#7dd3fc", 140, 850]} />

      {/* Atmospheric Paris Sky & Fluffy Clouds (Image 1 & 2) */}
      <AtmosphericSky />

      {/* ACT 1: Real 3D Eiffel Tower Model (eiffel.glb) */}
      <Suspense fallback={null}>
        <EiffelTower position={[0, 0, -50]} />
      </Suspense>

      {/* ACT 1: Paris Ferris Wheel on skyline (Photo 1 & 2) */}
      <ParisFerrisWheel position={[68, 0, -50]} />

      {/* ACT 2: Giant 3D Title in City Sky (Image 4 exact match!) */}
      <group position={[0, 15, 12]}>
        <Text
          position={[0, 3.8, 0]}
          fontSize={2.8}
          color="#ffffff"
          anchorX="center"
          anchorY="middle"
          letterSpacing={0.15}
        >
          BALAJI
        </Text>
        <Text
          position={[0, 1.2, 0]}
          fontSize={1.4}
          color="#fde047"
          anchorX="center"
          anchorY="middle"
          letterSpacing={0.2}
        >
          AI AGENT ENGINEER
        </Text>
        <Text
          position={[0, -0.8, 0]}
          fontSize={0.7}
          color="#e0f2fe"
          anchorX="center"
          anchorY="middle"
          letterSpacing={0.12}
        >
          LANGGRAPH · PYTHON · PINECONE · CHROMA · 179 TESTS
        </Text>
      </group>

      {/* Highway Sign Gantry Text (Image 5 exact match!) */}
      <group position={[0, 8.5, -19.8]}>
        <Text
          fontSize={1.1}
          color="#ffffff"
          anchorX="center"
          anchorY="middle"
          letterSpacing={0.18}
        >
          STILL WITH ME?
        </Text>
      </group>

      {/* ACT 3: Paris Boulevard with 3D Haussmann buildings, trees, highway ramp and loop */}
      <CityBoulevard />

      {/* Real 3D Man & Carbon Bike roaming the city of Paris */}
      <group ref={bikeGroupRef}>
        <Suspense fallback={null}>
          <RealManCharacter position={[0, 0, 0.5]} rotation={[0, Math.PI, 0]} />
          <RealCarbonBike position={[1.8, 0, 0]} rotation={[0, Math.PI / 2 + 0.15, 0]} />
        </Suspense>
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
      {/* ACT 1: Prologue Paris Screen Marker (0 - 14%) */}
      <div
        style={{
          position: "absolute",
          top: "8vh",
          left: 0,
          right: 0,
          textAlign: "center",
          pointerEvents: "none",
        }}
      >
        <span
          style={{
            fontFamily: "monospace",
            fontSize: "11px",
            letterSpacing: "0.4em",
            textTransform: "uppercase",
            color: "rgba(255, 255, 255, 0.85)",
            background: "rgba(0, 0, 0, 0.4)",
            border: "1px solid rgba(255, 255, 255, 0.15)",
            padding: "8px 20px",
            borderRadius: "9999px",
            backdropFilter: "blur(6px)",
          }}
        >
          PARIS AT DUSK // SCROLL TO COMMENCE
        </span>
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
        bottom: 32,
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
      {/* Top & Bottom Cinematic Letterbox Bars */}
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          height: "22px",
          background: "#000000",
          zIndex: 90,
          pointerEvents: "none",
          borderBottom: "1px solid rgba(255, 255, 255, 0.05)",
        }}
      />
      <div
        style={{
          position: "fixed",
          bottom: 0,
          left: 0,
          right: 0,
          height: "22px",
          background: "#000000",
          zIndex: 90,
          pointerEvents: "none",
          borderTop: "1px solid rgba(255, 255, 255, 0.05)",
        }}
      />

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
