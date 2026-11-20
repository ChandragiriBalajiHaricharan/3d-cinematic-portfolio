"use client";

import { useRef, useMemo, useState, useEffect, Suspense } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Text } from "@react-three/drei";
import { EffectComposer, Bloom, Vignette } from "@react-three/postprocessing";
import * as THREE from "three";
import {
  AtmosphericSky,
  EiffelTower,
  ParisFerrisWheel,
  CityBoulevard,
  RealManCharacter,
  SupercarVehicle,
  RealCarbonBike,
  OceanWater,
  Speedboat,
  FloatingBargeBillboard,
} from "./CityWorld";
import { SoundToggle, globalAudio } from "./SoundEngine";
import CaseStudyDrawer from "./CaseStudyDrawer";
import JourneyNavigator from "./JourneyNavigator";

// 3D Skills Data from Resume
const skills = [
  {
    num: "SKILL 01",
    title: "Multi-Agent Orchestration",
    desc: "Cyclic state graphs, supervisor delegation, and stateful session memory using LangGraph & Python.",
    pills: ["LangGraph", "Python", "StateGraph"],
  },
  {
    num: "SKILL 02",
    title: "Tool-Calling & Sandboxing",
    desc: "Production LLM tool execution with strict Pydantic schemas, AST-based checks, and Claude API.",
    pills: ["Pydantic", "Claude API", "Sandboxes"],
  },
  {
    num: "SKILL 03",
    title: "Vector Memory & RAG",
    desc: "High-throughput episodic retrieval, semantic recall, and low-latency embeddings with ChromaDB.",
    pills: ["ChromaDB", "RAG", "Embeddings"],
  },
  {
    num: "SKILL 04",
    title: "179 Automated Tests",
    desc: "Rigorous test-driven agent engineering. Deterministic mocks, regression suites, and Pytest coverage.",
    pills: ["Pytest", "179 Tests", "FastAPI"],
  },
];

// Real Resume Barge Projects (Photo 5 GTA Vice City Style)
const bargeProjects = [
  {
    step: "PROJECT 01 // ORCHESTRATION",
    title: "AUTONOMOUS NL2SQL AGENT",
    codePreview: "// LangGraph Stateful Agent with PostgreSQL Safety Constraints\nconst agent = StateGraph(NL2SQLState).compile({ checkpointer: postgresMemory });\nconst sql = await agent.invoke({ query: 'Show top 10 revenue agents' });",
    desc: "A stateful multi-turn LangGraph agent that translates complex natural language queries into safe, PostgreSQL-compatible SQL. Features schema validation, unsafe query prevention, and an asynchronous FastAPI backend.",
    pills: ["+ LANGGRAPH", "+ FASTAPI", "+ POSTGRESQL", "+ PYDANTIC"],
    z: -170,
  },
  {
    step: "PROJECT 02 // MULTI-AGENT WORKSPACE",
    title: "PROJECTMIND AI (179 TESTS)",
    codePreview: "// 5-Agent Architecture: Supervisor -> Coding -> Review -> Testing -> Chat\n$ pytest tests/ -v  # 179 passed in 3.84s [100%]\nagentSupervisor.route(context, activeTask) => 'SANDBOX_VALIDATED'",
    desc: "A collaborative 5-agent developer workspace with Supervisor, Coding, Review, Testing, and Direct Chat agents. Includes sandboxed file tools, AST-based code validation, local-first LLM fallback, and 179 passing automated tests.",
    pills: ["+ 5-AGENT SYSTEM", "+ 179 TESTS", "+ AST CHECK", "+ CHROMA DB"],
    z: -260,
  },
  {
    step: "PROJECT 03 // DEEP LEARNING",
    title: "COVID-19 MEDICAL CNN",
    codePreview: "// Deep CNN Architecture with OpenCV Imbalance Augmentation\nmodel.fit(trainLoader) => Epoch 40: Accuracy 89.15% | Precision 91.00%\nmetrics = evaluateConfusionMatrix(testSet);",
    desc: "A PyTorch and OpenCV convolutional neural network for automated COVID-19 chest X-ray classification. Addressed critical medical dataset imbalance using advanced spatial augmentation, reaching 89.15% accuracy and 91% precision.",
    pills: ["+ PYTORCH", "+ OPENCV", "+ CNN", "+ SCIKIT-LEARN"],
    z: -350,
  },
  {
    step: "PROJECT 04 // INTERNSHIP & CERTIFICATION",
    title: "COGNIFYZ AI/ML & CLAUDE API",
    codePreview: "// ChromaDB RAG Pipeline + Anthropic Claude API Integration\nragPipeline.retrieve(query, k=5) => Latency reduced by 34%\nclaudeAgent.executeFunctionCall(toolSchema) => Verified ✓",
    desc: "AI/ML Engineering Internship at Cognifyz Technologies. Engineered a ChromaDB RAG pipeline reducing lookup latency and boosting prediction accuracy by 12%. Certified by Anthropic in Building with the Claude API.",
    pills: ["+ COGNIFYZ INTERN", "+ CHROMADB RAG", "+ CLAUDE API", "+ DOCKER"],
    z: -440,
  },
];

// Main 3D Scene Controller with 100% Bulletproof Native Document Scroll
function CinematicScene({ onSelectProject }: { onSelectProject: (title: string) => void }) {
  const { camera } = useThree();

  const vehicleGroupRef = useRef<THREE.Group>(null);
  const boatGroupRef = useRef<THREE.Group>(null);
  const titleGroupRef = useRef<THREE.Group>(null);
  const gantryGroupRef = useRef<THREE.Group>(null);

  const scrollRef = useRef(0);
  const targetScrollRef = useRef(0);

  const camTarget = useMemo(() => new THREE.Vector3(), []);
  const lookTarget = useMemo(() => new THREE.Vector3(), []);

  // Listen to native browser window scroll
  useEffect(() => {
    const handleScroll = () => {
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      if (maxScroll > 0) {
        targetScrollRef.current = Math.min(1, Math.max(0, window.scrollY / maxScroll));
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useFrame((state) => {
    // Smooth responsive camera interpolation
    scrollRef.current = THREE.MathUtils.lerp(scrollRef.current, targetScrollRef.current, 0.09);
    const r = scrollRef.current;
    const time = state.clock.elapsedTime;

    let currentVehicleX = 0;
    let currentVehicleZ = 95;
    let currentVehicleLean = 0;

    let currentBoatX = 0;
    let currentBoatZ = -70;

    // Visibility management
    if (titleGroupRef.current) {
      titleGroupRef.current.visible = r >= 0.12 && r < 0.32;
    }
    if (gantryGroupRef.current) {
      gantryGroupRef.current.visible = r >= 0.28 && r < 0.48;
    }

    // ==============================================================
    // ACT 1: [0.00 -> 0.14] HERO EIFFEL TOWER & DAYLIGHT SKY (Image 1 match!)
    // Low-angle dramatic camera looking up at Eiffel Tower in bright blue sky
    // ==============================================================
    if (r < 0.14) {
      const p = r / 0.14;
      const swayX = Math.sin(time * 0.7) * 0.2;
      const swayY = Math.cos(time * 0.5) * 0.12;
      camTarget.set(7 + swayX, 8 + swayY - p * 2, 28 - p * 8);
      lookTarget.set(-2, 42, -50);
      currentVehicleX = 0;
      currentVehicleZ = 95;
      globalAudio.update("idle", 0.1);
    }
    // ==============================================================
    // ACT 2: [0.14 -> 0.28] 3D GIANT CITY TITLE (Image 4 match!)
    // Camera moves to boulevard level, framing 3D title in city sky
    // ==============================================================
    else if (r < 0.28) {
      const p = (r - 0.14) / 0.14;
      camTarget.set(0, 10 - p * 4, 38 - p * 10);
      lookTarget.set(0, 11 - p * 3, 8);
      currentVehicleX = 0;
      currentVehicleZ = 95;
      globalAudio.update("idle", 0.2);
    }
    // ==============================================================
    // ACT 3: [0.28 -> 0.48] FREEWAY RAMP VEHICLE CHASE (Image 5 match!)
    // Speeds up elevated freeway ramp towards overhead gantry 'STILL WITH ME?'
    // ==============================================================
    else if (r < 0.48) {
      const p = (r - 0.28) / 0.20;
      currentVehicleZ = 95 - p * 160;
      currentVehicleX = Math.sin(p * Math.PI * 4) * 1.5;
      currentVehicleLean = Math.cos(p * Math.PI * 4) * 0.18;
      const vehicleY = currentVehicleZ < 20 ? (20 - currentVehicleZ) * 0.08 : 0;

      camTarget.set(currentVehicleX * 0.6, vehicleY + 3.4, currentVehicleZ + 7.5);
      lookTarget.set(currentVehicleX, vehicleY + 2.0, currentVehicleZ - 18);
      globalAudio.update("bike", 0.75);
    }
    // ==============================================================
    // ACT 4: [0.48 -> 0.58] SPEEDBOAT ON TURQUOISE SEA (Image 2 match!)
    // Sweeping high aerial drone view over speedboat leaving foamy wake
    // ==============================================================
    else if (r < 0.58) {
      const p = (r - 0.48) / 0.10;
      currentBoatZ = -70 - p * 60;
      currentBoatX = 0;

      camTarget.set(0, 24 + p * 6, currentBoatZ + 36);
      lookTarget.set(0, 0, currentBoatZ - 40);
      globalAudio.update("boat", 0.85);
    }
    // ==============================================================
    // ACT 5: [0.58 -> 0.88] SPEEDBOAT CRUISES PAST FLOATING BARGES (Photo 5 match!)
    // ==============================================================
    else if (r < 0.88) {
      const p = (r - 0.58) / 0.30;
      currentBoatZ = -130 - p * 340;
      currentBoatX = Math.sin(p * Math.PI * 4) * 2.2;

      camTarget.set(currentBoatX * 0.7, 4.2, currentBoatZ + 13);
      const gazeSide = Math.sin(p * Math.PI * 4);
      lookTarget.set(-gazeSide * 6.5, 6.0, currentBoatZ - 20);
      globalAudio.update("boat", 0.78);
    }
    // ==============================================================
    // ACT 6: [0.88 -> 1.00] DESTINATION MARINA & BALAJI PROFILE FINALE
    // ==============================================================
    else {
      const p = (r - 0.88) / 0.12;
      currentBoatZ = -470 - p * 30;
      currentBoatX = 0;

      camTarget.set(0, 7 + p * 4, currentBoatZ + 20);
      lookTarget.set(0, 8, currentBoatZ - 25);
      globalAudio.update("idle", 0.1);
    }

    // Direct GPU Three.js mutation for Highway Vehicle
    if (vehicleGroupRef.current) {
      if (r < 0.48) {
        vehicleGroupRef.current.visible = true;
        const vehicleY = currentVehicleZ < 20 ? (20 - currentVehicleZ) * 0.08 : 0;
        vehicleGroupRef.current.position.set(currentVehicleX, vehicleY, currentVehicleZ);
        vehicleGroupRef.current.rotation.z = -currentVehicleLean;
      } else {
        vehicleGroupRef.current.visible = false;
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

    // Smooth Camera Motion
    camera.position.lerp(camTarget, 0.12);
    camera.lookAt(lookTarget);
  });

  return (
    <>
      <ambientLight intensity={1.2} color="#ffffff" />
      <directionalLight
        position={[60, 85, -45]}
        intensity={3.4}
        color="#fff1cc"
        castShadow
        shadow-mapSize={[1024, 1024]}
        shadow-bias={-0.0005}
      />
      <directionalLight position={[-40, 45, 60]} intensity={1.2} color="#bae6fd" />
      <fog attach="fog" args={["#7dd3fc", 160, 950]} />

      {/* Atmospheric Daylight Sky */}
      <AtmosphericSky />

      {/* ACT 1: Real 3D Eiffel Tower Model */}
      <Suspense fallback={null}>
        <EiffelTower position={[0, 0, -50]} />
      </Suspense>

      {/* ACT 1: Paris Ferris Wheel on skyline */}
      <ParisFerrisWheel position={[72, 0, -50]} />

      {/* ACT 2: 3D Title in City Sky (Properly Scaled & Framed) */}
      <group ref={titleGroupRef} position={[0, 12, 10]}>
        <Text
          position={[0, 2.8, 0]}
          fontSize={1.25}
          color="#ffffff"
          anchorX="center"
          anchorY="middle"
          letterSpacing={0.12}
        >
          CHANDRAGIRI BALAJI HARICHARAN
        </Text>
        <Text
          position={[0, 0.9, 0]}
          fontSize={0.75}
          color="#38bdf8"
          anchorX="center"
          anchorY="middle"
          letterSpacing={0.16}
        >
          AI AGENT ENGINEER // BACKEND ARCHITECT
        </Text>
        <Text
          position={[0, -0.6, 0]}
          fontSize={0.4}
          color="#fde047"
          anchorX="center"
          anchorY="middle"
          letterSpacing={0.12}
        >
          LANGGRAPH · FASTAPI · CHROMADB · 179 TESTS · CLAUDE CERTIFIED
        </Text>
      </group>

      {/* ACT 3: Highway Sign Gantry Text (Over Freeway Ramp Only) */}
      <group ref={gantryGroupRef} position={[0, 8.5, -20]}>
        <mesh position={[0, 0, 0]}>
          <boxGeometry args={[14, 2.2, 0.4]} />
          <meshStandardMaterial color="#0f172a" metalness={0.9} />
        </mesh>
        <Text
          position={[0, 0, 0.25]}
          fontSize={1.05}
          color="#ffffff"
          anchorX="center"
          anchorY="middle"
          letterSpacing={0.18}
        >
          STILL WITH ME?
        </Text>
      </group>

      {/* ACT 3: Paris Boulevard with 3D Haussmann buildings */}
      <CityBoulevard />

      {/* Highway Vehicle: Supercar */}
      <group ref={vehicleGroupRef}>
        <Suspense fallback={null}>
          <SupercarVehicle position={[0, 0, 0]} rotation={[0, Math.PI, 0]} />
        </Suspense>
      </group>

      {/* Real 3D Man Character & Carbon Bike in Foreground */}
      <Suspense fallback={null}>
        <RealManCharacter position={[0, 0, 96]} rotation={[0, Math.PI, 0]} />
        <RealCarbonBike position={[2.2, 0, 95]} rotation={[0, Math.PI / 2 + 0.15, 0]} />
      </Suspense>

      {/* ACT 4 & 5: Dynamic GTA VI Ocean Simulation */}
      <OceanWater />

      {/* ACT 4 & 5: Offshore Speedboat */}
      <group ref={boatGroupRef}>
        <Speedboat />
      </group>

      {/* ACT 5: 4 Real Resume Floating Barge Billboards */}
      {bargeProjects.map((p, idx) => {
        const isLeft = idx % 2 === 0;
        const posX = isLeft ? -18 : 18;
        const rotY = isLeft ? 0.32 : -0.32;
        const posZ = -170 - idx * 90;

        return (
          <FloatingBargeBillboard
            key={p.title}
            position={[posX, 0, posZ]}
            rotation={[0, rotY, 0]}
            project={p}
            onClick={() => onSelectProject(p.title)}
          />
        );
      })}

      {/* High-Performance Bloom (Balanced, No White Washout) */}
      <EffectComposer>
        <Bloom
          luminanceThreshold={0.82}
          intensity={0.45}
        />
        <Vignette offset={0.2} darkness={0.6} />
      </EffectComposer>
    </>
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
        color: "rgba(56, 189, 248, 0.9)",
        background: "linear-gradient(180deg, rgba(3,7,18,0.85) 0%, transparent 100%)",
      }}
    >
      <div>CHANDRAGIRI BALAJI // AI AGENTS</div>
      <div style={{ display: "flex", gap: "20px", alignItems: "center" }}>
        <SoundToggle />
        <span className="hidden md:inline">HYDERABAD, IN</span>
        <span className="hidden md:inline">● 60 FPS 3D</span>
      </div>
    </div>
  );
}

// Bottom Scroll Hint with Working Advance Button
function BottomHUD() {
  const advance = () => {
    const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
    const nextY = Math.min(maxScroll, window.scrollY + window.innerHeight * 0.95);
    window.scrollTo({ top: nextY, behavior: "smooth" });
  };

  return (
    <div
      style={{
        position: "fixed",
        bottom: "32px",
        left: 0,
        right: 0,
        zIndex: 100,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        pointerEvents: "none",
      }}
    >
      <button
        onClick={advance}
        style={{ pointerEvents: "auto" }}
        className="flex flex-col items-center gap-1.5 px-6 py-2 rounded-full bg-slate-900/85 border border-cyan-500/50 text-cyan-300 font-mono text-[11px] tracking-widest uppercase hover:bg-cyan-500/25 hover:border-cyan-400 transition-all cursor-pointer backdrop-blur-md shadow-[0_0_20px_rgba(56,189,248,0.3)]"
      >
        <span>SCROLL OR CLICK TO ADVANCE ↓</span>
        <div className="w-[1px] h-4 bg-gradient-to-b from-cyan-400 to-transparent animate-pulse" />
      </button>
    </div>
  );
}

// Main Component
export default function CinematicExperience() {
  const [selectedProject, setSelectedProject] = useState<string | null>(null);

  // Global Keyboard Navigation (Arrow Keys / PageDown)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (selectedProject) return;
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      const step = window.innerHeight * 0.9;
      if (e.key === "ArrowDown" || e.key === "PageDown" || e.key === " ") {
        e.preventDefault();
        window.scrollTo({ top: Math.min(maxScroll, window.scrollY + step), behavior: "smooth" });
      } else if (e.key === "ArrowUp" || e.key === "PageUp") {
        e.preventDefault();
        window.scrollTo({ top: Math.max(0, window.scrollY - step), behavior: "smooth" });
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedProject]);

  return (
    <div style={{ position: "relative", width: "100%", background: "#030712" }}>
      {/* Cinematic Letterbox Bars */}
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

      {/* Fixed Full-Screen 3D WebGL Canvas */}
      <div
        style={{
          position: "fixed",
          inset: 0,
          width: "100vw",
          height: "100vh",
          zIndex: 1,
          pointerEvents: "auto",
        }}
      >
        <Canvas
          shadows
          camera={{ position: [0, 16, 125], fov: 50, near: 0.1, far: 950 }}
          gl={{
            antialias: true,
            powerPreference: "high-performance",
            toneMapping: THREE.ACESFilmicToneMapping,
            toneMappingExposure: 1.25,
          }}
          style={{ width: "100%", height: "100%" }}
        >
          <CinematicScene onSelectProject={(title) => setSelectedProject(title)} />
        </Canvas>
      </div>

      {/* Native Browser Scroll Track (600vh height - 100% Reliable, Never Gets Stuck) */}
      <div style={{ position: "relative", width: "100%", height: "600vh", pointerEvents: "none", zIndex: 10 }}>
        {/* ACT 1: Prologue */}
        <div
          style={{
            position: "absolute",
            top: "8vh",
            left: 0,
            right: 0,
            textAlign: "center",
          }}
        >
          <span
            style={{
              fontFamily: "monospace",
              fontSize: "11px",
              letterSpacing: "0.4em",
              textTransform: "uppercase",
              color: "rgba(255, 255, 255, 0.9)",
              background: "rgba(0, 0, 0, 0.45)",
              border: "1px solid rgba(255, 255, 255, 0.2)",
              padding: "8px 22px",
              borderRadius: "9999px",
              backdropFilter: "blur(8px)",
            }}
          >
            PARIS AT DUSK // SCROLL OR PRESS ARROW KEYS TO COMMENCE
          </span>
        </div>

        {/* ACT 3: Freeway Ride Skill Cards */}
        <div style={{ position: "absolute", top: "180vh", left: "4vw", maxWidth: "340px" }}>
          <div className="skill-card-3d">
            <div className="num">01 // {skills[0].num}</div>
            <div className="title">{skills[0].title}</div>
            <div className="desc">{skills[0].desc}</div>
            <div className="flex gap-1.5 mt-2.5">
              {skills[0].pills.map((pill) => (
                <span key={pill} className="text-[10px] font-mono px-2 py-0.5 rounded border border-cyan-500/40 text-cyan-300">
                  {pill}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div style={{ position: "absolute", top: "215vh", right: "4vw", maxWidth: "340px" }}>
          <div className="skill-card-3d">
            <div className="num">02 // {skills[1].num}</div>
            <div className="title">{skills[1].title}</div>
            <div className="desc">{skills[1].desc}</div>
            <div className="flex gap-1.5 mt-2.5">
              {skills[1].pills.map((pill) => (
                <span key={pill} className="text-[10px] font-mono px-2 py-0.5 rounded border border-cyan-500/40 text-cyan-300">
                  {pill}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div style={{ position: "absolute", top: "250vh", left: "4vw", maxWidth: "340px" }}>
          <div className="skill-card-3d">
            <div className="num">03 // {skills[2].num}</div>
            <div className="title">{skills[2].title}</div>
            <div className="desc">{skills[2].desc}</div>
            <div className="flex gap-1.5 mt-2.5">
              {skills[2].pills.map((pill) => (
                <span key={pill} className="text-[10px] font-mono px-2 py-0.5 rounded border border-cyan-500/40 text-cyan-300">
                  {pill}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div style={{ position: "absolute", top: "285vh", right: "4vw", maxWidth: "340px" }}>
          <div className="skill-card-3d">
            <div className="num">04 // {skills[3].num}</div>
            <div className="title">{skills[3].title}</div>
            <div className="desc">{skills[3].desc}</div>
            <div className="flex gap-1.5 mt-2.5">
              {skills[3].pills.map((pill) => (
                <span key={pill} className="text-[10px] font-mono px-2 py-0.5 rounded border border-cyan-500/40 text-cyan-300">
                  {pill}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* ACT 4: Transition to Waterway */}
        <div
          style={{
            position: "absolute",
            top: "330vh",
            left: 0,
            right: 0,
            textAlign: "center",
          }}
          className="overlay-title"
        >
          <p className="sub" style={{ color: "#38bdf8" }}>ACT II // THE OPEN SEA</p>
          <h1 style={{ textShadow: "0 0 50px rgba(56, 189, 248, 0.85)" }}>THE PROJECTS</h1>
          <p className="sub" style={{ marginTop: "12px", fontSize: "13px", color: "rgba(255, 255, 255, 0.75)" }}>
            SPEEDBOAT VOYAGE PAST FLOATING BARGE BILLBOARDS
          </p>
        </div>

        {/* ACT 5: In-World 3D Billboards Hint */}
        <div
          style={{
            position: "absolute",
            top: "420vh",
            left: 0,
            right: 0,
            textAlign: "center",
          }}
        >
          <span
            style={{
              fontFamily: "monospace",
              fontSize: "12px",
              letterSpacing: "0.25em",
              textTransform: "uppercase",
              color: "#38bdf8",
              background: "rgba(15, 23, 42, 0.85)",
              border: "1px solid rgba(56, 189, 248, 0.5)",
              padding: "10px 24px",
              borderRadius: "9999px",
              backdropFilter: "blur(10px)",
            }}
          >
            💡 3D WATERWAY BILLBOARDS // CLICK ANY BILLBOARD IN 3D TO OPEN CASE STUDY
          </span>
        </div>

        {/* ACT 6: Last — About Chandragiri Balaji Haricharan */}
        <div
          style={{
            position: "absolute",
            top: "520vh",
            left: 0,
            right: 0,
          }}
          className="overlay-contact"
        >
          <p className="sub" style={{ color: "#38bdf8", marginBottom: "14px", fontFamily: "monospace", letterSpacing: "0.3em" }}>
            FINAL DESTINATION // ABOUT BALAJI
          </p>
          <h2>CHANDRAGIRI BALAJI HARICHARAN</h2>
          <p style={{ maxWidth: 640, margin: "0 auto 24px", color: "rgba(255,255,255,0.8)", fontSize: 16, lineHeight: 1.7 }}>
            Computer Science Undergraduate (B.Tech, 2027) at Keshav Memorial Engineering College, Hyderabad (CGPA: 7.7).
            AI/ML Engineer Intern at Cognifyz Technologies. Specialized in LangGraph multi-agent orchestration,
            ChromaDB RAG pipelines, FastAPI backends, and certified in Anthropic Claude API development.
          </p>
          <div style={{ display: "flex", gap: "16px", justifyContent: "center", marginBottom: "32px", pointerEvents: "auto" }}>
            <a
              href="mailto:balajiharicharan53@gmail.com"
              style={{
                padding: "12px 28px",
                borderRadius: "9999px",
                background: "#38bdf8",
                color: "#000",
                fontWeight: 800,
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
            EMAIL: <a href="mailto:balajiharicharan53@gmail.com" style={{ color: "#38bdf8", textDecoration: "underline", pointerEvents: "auto" }}>balajiharicharan53@gmail.com</a>
            {" "} | TEL: <span style={{ color: "#e2e8f0" }}>+91 7670840541</span>
          </p>
        </div>
      </div>
    </div>
  );
}
