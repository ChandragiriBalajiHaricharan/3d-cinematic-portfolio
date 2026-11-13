"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

// ==============================================================
// 1. SKY & SUN (Dusk over Paris transitioning to coastal sea)
// ==============================================================
export function AtmosphericSky() {
  return (
    <group>
      {/* Distant Golden Sunset Sun - Positioned far on the horizon */}
      <mesh position={[70, 50, -750]}>
        <sphereGeometry args={[38, 32, 32]} />
        <meshBasicMaterial color="#ffaa33" />
      </mesh>
      {/* Sun glow corona */}
      <mesh position={[70, 50, -750]}>
        <sphereGeometry args={[75, 32, 32]} />
        <meshBasicMaterial color="#ff7711" transparent opacity={0.35} />
      </mesh>
      {/* Distant Sunset Clouds along horizon */}
      {[-240, -120, 0, 140, 260].map((cx, i) => (
        <group key={i} position={[cx, 60 + (i % 2) * 12, -700 + (i % 3) * 40]}>
          <mesh>
            <sphereGeometry args={[36, 16, 16]} />
            <meshStandardMaterial color="#fed7aa" roughness={1} />
          </mesh>
          <mesh position={[24, -4, 0]}>
            <sphereGeometry args={[30, 16, 16]} />
            <meshStandardMaterial color="#fdba74" roughness={1} />
          </mesh>
        </group>
      ))}
    </group>
  );
}

// ==============================================================
// 2. EIFFEL TOWER (ACT 1: First camera focus)
// ==============================================================
export function EiffelTower({ position = [0, 0, -45] }: { position?: [number, number, number] }) {
  const ironColor = "#140e08";
  const lightGold = "#ffb040";
  const beaconBeamRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (beaconBeamRef.current) {
      beaconBeamRef.current.rotation.y = state.clock.elapsedTime * 0.35;
    }
  });

  return (
    <group position={position}>
      {/* 4 Corner Legs */}
      {[
        [-12, 0, -12],
        [12, 0, -12],
        [-12, 0, 12],
        [12, 0, 12],
      ].map(([x, y, z], i) => (
        <group key={i} position={[x, y + 16, z]} rotation={[x > 0 ? 0.22 : -0.22, 0, z > 0 ? -0.22 : 0.22]}>
          <mesh>
            <boxGeometry args={[4.5, 34, 4.5]} />
            <meshStandardMaterial color={ironColor} roughness={0.7} metalness={0.9} />
          </mesh>
          {[-8, 0, 8].map((ly, j) => (
            <mesh key={j} position={[0, ly, 0]} rotation={[0, 0, 0.78]}>
              <boxGeometry args={[5, 0.6, 4.6]} />
              <meshStandardMaterial color="#2a2015" metalness={0.8} />
            </mesh>
          ))}
        </group>
      ))}

      {/* Main Arch */}
      <mesh position={[0, 14, 0]}>
        <torusGeometry args={[11, 1.2, 12, 24, Math.PI]} />
        <meshStandardMaterial color={ironColor} metalness={0.9} />
      </mesh>

      {/* Platform 1 */}
      <mesh position={[0, 32, 0]}>
        <boxGeometry args={[28, 3.5, 28]} />
        <meshStandardMaterial color={ironColor} roughness={0.6} metalness={0.9} />
      </mesh>
      <mesh position={[0, 32, 0]}>
        <boxGeometry args={[28.6, 0.9, 28.6]} />
        <meshBasicMaterial color={lightGold} />
      </mesh>

      {/* Tier 2 Legs */}
      {[
        [-6, 34, -6],
        [6, 34, -6],
        [-6, 34, 6],
        [6, 34, 6],
      ].map(([x, y, z], i) => (
        <group key={i} position={[x, y + 18, z]} rotation={[x > 0 ? 0.16 : -0.16, 0, z > 0 ? -0.16 : 0.16]}>
          <mesh>
            <boxGeometry args={[3, 38, 3]} />
            <meshStandardMaterial color={ironColor} roughness={0.7} metalness={0.9} />
          </mesh>
        </group>
      ))}

      {/* Platform 2 */}
      <mesh position={[0, 70, 0]}>
        <boxGeometry args={[16, 2.5, 16]} />
        <meshStandardMaterial color={ironColor} roughness={0.6} metalness={0.9} />
      </mesh>
      <mesh position={[0, 70, 0]}>
        <boxGeometry args={[16.4, 0.7, 16.4]} />
        <meshBasicMaterial color={lightGold} />
      </mesh>

      {/* Spire */}
      <mesh position={[0, 105, 0]}>
        <coneGeometry args={[4.2, 70, 4]} />
        <meshStandardMaterial color={ironColor} roughness={0.7} metalness={0.9} />
      </mesh>

      {/* Beacon Tip */}
      <mesh position={[0, 142, 0]}>
        <cylinderGeometry args={[1.5, 1.8, 4, 12]} />
        <meshStandardMaterial color="#222" metalness={1} />
      </mesh>
      <mesh position={[0, 146, 0]}>
        <sphereGeometry args={[2, 16, 16]} />
        <meshBasicMaterial color="#ffffff" />
      </mesh>
      <pointLight position={[0, 146, 0]} intensity={45} color="#ffeebb" distance={250} />

      {/* Sweeping Golden Beacon Light Beam across Paris sky */}
      <group ref={beaconBeamRef} position={[0, 146, 0]}>
        <mesh position={[0, 0, 80]} rotation={[Math.PI / 2 + 0.12, 0, 0]}>
          <coneGeometry args={[14, 160, 16, 1, true]} />
          <meshBasicMaterial
            color="#fff2cc"
            transparent
            opacity={0.16}
            side={THREE.DoubleSide}
            depthWrite={false}
          />
        </mesh>
      </group>
    </group>
  );
}

// ==============================================================
// 2B. PARIS FERRIS WHEEL (Photo 1 & 2 - Paris skyline at dusk)
// ==============================================================
export function ParisFerrisWheel({ position = [68, 0, -50] }: { position?: [number, number, number] }) {
  const wheelRef = useRef<THREE.Group>(null);
  useFrame((state) => {
    if (wheelRef.current) {
      wheelRef.current.rotation.z = state.clock.elapsedTime * 0.1;
    }
  });

  return (
    <group position={position}>
      {/* Support Legs */}
      <mesh position={[-3.5, 17, 0]} rotation={[0, 0, -0.2]}>
        <cylinderGeometry args={[0.3, 0.5, 36, 8]} />
        <meshStandardMaterial color="#2d241e" metalness={0.8} />
      </mesh>
      <mesh position={[3.5, 17, 0]} rotation={[0, 0, 0.2]}>
        <cylinderGeometry args={[0.3, 0.5, 36, 8]} />
        <meshStandardMaterial color="#2d241e" metalness={0.8} />
      </mesh>

      {/* Rotating Wheel with golden illuminated spokes */}
      <group ref={wheelRef} position={[0, 34, 0]}>
        <mesh>
          <torusGeometry args={[22, 0.35, 8, 36]} />
          <meshBasicMaterial color="#ffaa33" />
        </mesh>
        <mesh>
          <torusGeometry args={[17, 0.2, 8, 32]} />
          <meshBasicMaterial color="#ff8811" />
        </mesh>
        {Array.from({ length: 12 }).map((_, i) => (
          <mesh key={i} rotation={[0, 0, (i * Math.PI) / 6]}>
            <boxGeometry args={[44, 0.12, 0.12]} />
            <meshStandardMaterial color="#ffaa33" />
          </mesh>
        ))}
      </group>
    </group>
  );
}

// ==============================================================
// 3. PARIS STREET & BOULEVARD (ACT 3: Motorcycle Ride & Skills)
// ==============================================================
export function CityBoulevard() {
  const facadeTexture = useMemo(() => {
    if (typeof window === "undefined") return null;
    const loader = new THREE.TextureLoader();
    const tex = loader.load("/textures/haussmann_facade.jpg");
    tex.wrapS = THREE.RepeatWrapping;
    tex.wrapT = THREE.RepeatWrapping;
    tex.repeat.set(1.5, 1);
    tex.colorSpace = THREE.SRGBColorSpace;
    return tex;
  }, []);

  const cobblestoneTexture = useMemo(() => {
    if (typeof window === "undefined") return null;
    const loader = new THREE.TextureLoader();
    const tex = loader.load("/textures/wet_paris_cobblestone.jpg");
    tex.wrapS = THREE.RepeatWrapping;
    tex.wrapT = THREE.RepeatWrapping;
    tex.repeat.set(3, 24);
    tex.colorSpace = THREE.SRGBColorSpace;
    return tex;
  }, []);

  const sidewalkTexture = useMemo(() => {
    if (typeof window === "undefined") return null;
    const loader = new THREE.TextureLoader();
    const tex = loader.load("/textures/paris_sidewalk_curb.jpg");
    tex.wrapS = THREE.RepeatWrapping;
    tex.wrapT = THREE.RepeatWrapping;
    tex.repeat.set(1, 16);
    tex.colorSpace = THREE.SRGBColorSpace;
    return tex;
  }, []);

  const skylineTexture = useMemo(() => {
    if (typeof window === "undefined") return null;
    const loader = new THREE.TextureLoader();
    const tex = loader.load("/textures/eiffel_tower_sunset.jpg");
    tex.colorSpace = THREE.SRGBColorSpace;
    return tex;
  }, []);

  const buildings = useMemo(() => {
    const list: Array<{ x: number; z: number; w: number; h: number; d: number; isLeft: boolean }> = [];
    // Paris street buildings from z: 120 down to z: -60
    for (let z = 120; z >= -60; z -= 24) {
      list.push({ x: -25, z, w: 20, h: 26, d: 23, isLeft: true });
      list.push({ x: 25, z, w: 20, h: 26, d: 23, isLeft: false });
    }
    return list;
  }, []);

  return (
    <group>
      {/* Photorealistic Paris Sunset & Eiffel Tower Horizon Backdrop (Photo 1 & 2) */}
      <mesh position={[0, 46, -58]}>
        <planeGeometry args={[150, 85]} />
        {skylineTexture ? (
          <meshBasicMaterial map={skylineTexture} toneMapped={false} />
        ) : (
          <meshBasicMaterial color="#1a120b" />
        )}
      </mesh>

      {/* Photorealistic Wet Paris Cobblestone Road */}
      <mesh position={[0, 0.05, 30]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[24, 200]} />
        <meshStandardMaterial
          map={cobblestoneTexture || undefined}
          color="#221a14"
          roughness={0.18}
          metalness={0.45}
        />
      </mesh>

      {/* Wet Puddle Sheen in Foreground reflecting Paris sunset & Eiffel Tower (Photo 1 & 2) */}
      <mesh position={[0, 0.08, 104]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[14, 28]} />
        <meshStandardMaterial color="#080604" roughness={0.02} metalness={0.96} />
      </mesh>
      <mesh position={[-3.5, 0.07, 72]} rotation={[-Math.PI / 2, 0, 0.08]}>
        <planeGeometry args={[8, 34]} />
        <meshStandardMaterial color="#0a0805" roughness={0.04} metalness={0.93} />
      </mesh>

      {/* Photorealistic Parisian Granite Sidewalks */}
      <mesh position={[-13, 0.15, 30]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[5, 200]} />
        <meshStandardMaterial
          map={sidewalkTexture || undefined}
          color="#6b5b4e"
          roughness={0.5}
        />
      </mesh>
      <mesh position={[13, 0.15, 30]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[5, 200]} />
        <meshStandardMaterial
          map={sidewalkTexture || undefined}
          color="#6b5b4e"
          roughness={0.5}
        />
      </mesh>

      {/* Photorealistic Parisian Haussmann Buildings */}
      {buildings.map((b, i) => (
        <group key={i} position={[b.x, b.h / 2, b.z]}>
          {/* Main building block */}
          <mesh castShadow receiveShadow>
            <boxGeometry args={[b.w, b.h, b.d]} />
            <meshStandardMaterial color="#c2a378" roughness={0.8} />
          </mesh>

          {/* Detailed Photorealistic Haussmann Facade on Avenue-Facing Side */}
          <mesh
            position={[b.isLeft ? b.w / 2 + 0.06 : -b.w / 2 - 0.06, 0, 0]}
            rotation={[0, b.isLeft ? Math.PI / 2 : -Math.PI / 2, 0]}
          >
            <planeGeometry args={[b.d, b.h]} />
            <meshStandardMaterial
              map={facadeTexture || undefined}
              roughness={0.35}
              metalness={0.05}
              emissive="#ffaa33"
              emissiveIntensity={0.12}
            />
          </mesh>

          {/* Slate Mansard roof */}
          <mesh position={[0, b.h / 2 + 3.5, 0]}>
            <boxGeometry args={[b.w - 1.5, 7, b.d - 1.5]} />
            <meshStandardMaterial color="#333d45" roughness={0.4} metalness={0.3} />
          </mesh>
        </group>
      ))}

      {/* Boulevard Street Lamps with warm ambient illumination */}
      {Array.from({ length: 12 }).map((_, i) => {
        const z = 110 - i * 16;
        const hasLight = i < 4; // Add real pointlights to foreground lamps closest to camera
        return (
          <group key={i}>
            <mesh position={[-10.5, 4, z]}>
              <cylinderGeometry args={[0.08, 0.15, 8, 8]} />
              <meshStandardMaterial color="#111" metalness={0.9} />
            </mesh>
            <mesh position={[-10.5, 8.2, z]}>
              <octahedronGeometry args={[0.5]} />
              <meshBasicMaterial color="#ffc366" />
            </mesh>
            {hasLight && (
              <pointLight position={[-10.5, 8.2, z]} intensity={3.5} distance={16} color="#ffaa33" />
            )}

            <mesh position={[10.5, 4, z]}>
              <cylinderGeometry args={[0.08, 0.15, 8, 8]} />
              <meshStandardMaterial color="#111" metalness={0.9} />
            </mesh>
            <mesh position={[10.5, 8.2, z]}>
              <octahedronGeometry args={[0.5]} />
              <meshBasicMaterial color="#ffc366" />
            </mesh>
            {hasLight && (
              <pointLight position={[10.5, 8.2, z]} intensity={3.5} distance={16} color="#ffaa33" />
            )}
          </group>
        );
      })}

      {/* Harbor Pier where motorcycle arrives and transitions to water */}
      <group position={[0, -0.2, -70]}>
        <mesh position={[0, 0, 0]}>
          <boxGeometry args={[28, 1.2, 24]} />
          <meshStandardMaterial color="#30261f" roughness={0.9} />
        </mesh>
        {/* Pier wooden bollards */}
        {[-12, -6, 6, 12].map((bx, idx) => (
          <mesh key={idx} position={[bx, 1.2, -11]}>
            <cylinderGeometry args={[0.35, 0.35, 1.5, 12]} />
            <meshStandardMaterial color="#1f1813" roughness={0.9} />
          </mesh>
        ))}
      </group>
    </group>
  );
}

// ==============================================================
// 4. MOTORCYCLE & RIDER (ACT 3)
// ==============================================================
export function BikeRider({
  position = [0, 0, 0],
  lean = 0,
}: {
  position?: [number, number, number];
  lean?: number;
}) {
  return (
    <group position={position} rotation={[0, 0, lean]}>
      {/* Front & Rear Wheels */}
      <mesh position={[0, 0.6, -1.4]} rotation={[0, 0, Math.PI / 2]}>
        <torusGeometry args={[0.6, 0.12, 12, 24]} />
        <meshStandardMaterial color="#1a1a1a" roughness={0.6} />
      </mesh>
      <mesh position={[0, 0.6, 1.4]} rotation={[0, 0, Math.PI / 2]}>
        <torusGeometry args={[0.6, 0.12, 12, 24]} />
        <meshStandardMaterial color="#1a1a1a" roughness={0.6} />
      </mesh>

      {/* Bike Chassis */}
      <mesh position={[0, 1.0, 0]}>
        <boxGeometry args={[0.3, 0.6, 2.2]} />
        <meshStandardMaterial color="#0a0a0f" metalness={0.9} roughness={0.2} />
      </mesh>
      <mesh position={[0.25, 0.5, 1.0]} rotation={[0.2, 0, 0]}>
        <cylinderGeometry args={[0.07, 0.09, 1.2, 8]} />
        <meshStandardMaterial color="#888" metalness={1} roughness={0.2} />
      </mesh>

      {/* Headlight */}
      <mesh position={[0, 1.2, -1.5]}>
        <sphereGeometry args={[0.15, 16, 16]} />
        <meshBasicMaterial color="#ffffff" />
      </mesh>
      <spotLight
        position={[0, 1.2, -1.5]}
        target-position={[0, 0, -30]}
        angle={0.6}
        penumbra={0.5}
        intensity={20}
        color="#ffeedd"
        distance={40}
      />

      {/* Taillight */}
      <mesh position={[0, 1.1, 1.5]}>
        <boxGeometry args={[0.3, 0.1, 0.05]} />
        <meshBasicMaterial color="#ff2244" />
      </mesh>
      <pointLight position={[0, 1.1, 1.7]} intensity={8} color="#ff2244" distance={8} />

      {/* Rider with blue jacket & helmet */}
      <mesh position={[0, 1.8, 0.1]} rotation={[-0.3, 0, 0]}>
        <boxGeometry args={[0.7, 0.9, 0.5]} />
        <meshStandardMaterial color="#2563eb" roughness={0.7} />
      </mesh>
      <mesh position={[0, 2.5, -0.2]}>
        <sphereGeometry args={[0.32, 20, 20]} />
        <meshStandardMaterial color="#111827" metalness={0.8} roughness={0.2} />
      </mesh>
      <mesh position={[0, 2.5, -0.45]}>
        <boxGeometry args={[0.35, 0.15, 0.1]} />
        <meshStandardMaterial color="#000" roughness={0.05} metalness={1} />
      </mesh>
      <mesh position={[-0.38, 1.7, -0.5]} rotation={[0.8, 0.2, 0]}>
        <cylinderGeometry args={[0.08, 0.08, 0.8, 8]} />
        <meshStandardMaterial color="#1e40af" />
      </mesh>
      <mesh position={[0.38, 1.7, -0.5]} rotation={[0.8, -0.2, 0]}>
        <cylinderGeometry args={[0.08, 0.08, 0.8, 8]} />
        <meshStandardMaterial color="#1e40af" />
      </mesh>
    </group>
  );
}

// ==============================================================
// 5. OPEN SEA / HARBOR OCEAN (ACT 4 & 5: Exact match to Photo 5 & 6)
// ==============================================================
export function OceanWater() {
  return (
    <group position={[0, -0.05, -400]}>
      {/* Vast Sparkling Turquoise Blue Ocean (Photo 5 & 6) */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[1600, 900]} />
        <meshStandardMaterial
          color="#0284c7" // Vibrant turquoise blue sea from Photo 5 & 6
          emissive="#03456c"
          emissiveIntensity={0.25}
          roughness={0.12}
          metalness={0.8}
        />
      </mesh>

      {/* Gentle shoreline transition foam right at harbor pier (z = -60) */}
      <mesh position={[0, 0.02, 340]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[140, 20]} />
        <meshBasicMaterial color="#bae6fd" transparent opacity={0.65} />
      </mesh>

      {/* Distant coastal city skylines lining both shores (Photo 5 & 6) */}
      {[-160, 160].map((shoreX) => (
        <group key={shoreX} position={[shoreX, 0, 0]}>
          {Array.from({ length: 22 }).map((_, i) => {
            const h = 28 + (i % 6) * 14;
            const w = 18 + (i % 3) * 6;
            const z = 380 - i * 36;
            return (
              <mesh key={i} position={[0, h / 2, z]}>
                <boxGeometry args={[w, h, w]} />
                <meshStandardMaterial color="#1e293b" roughness={0.3} metalness={0.7} />
              </mesh>
            );
          })}
        </group>
      ))}
    </group>
  );
}

// ==============================================================
// 6. SPEEDBOAT & WHITE FOAM WAKE (ACT 4 & 5: Exact match to Photo 5 & 6)
// ==============================================================
export function Speedboat() {
  return (
    <group>
      {/* Boat Hull - Sleek Powerboat with orange & blue stripes (Photo 5) */}
      <group position={[0, 0.4, 0]}>
        {/* Main hull body */}
        <mesh position={[0, 0, 0]}>
          <boxGeometry args={[3.2, 1.4, 7.5]} />
          <meshStandardMaterial color="#ea580c" roughness={0.3} metalness={0.5} /> {/* Orange hull */}
        </mesh>
        {/* Pointed bow front */}
        <mesh position={[0, 0, -4.2]} rotation={[0, Math.PI / 4, 0]}>
          <boxGeometry args={[2.3, 1.4, 2.3]} />
          <meshStandardMaterial color="#ea580c" roughness={0.3} metalness={0.5} />
        </mesh>
        {/* Blue deck racing stripe (Photo 5) */}
        <mesh position={[0, 0.72, 0]}>
          <boxGeometry args={[1.6, 0.1, 6.2]} />
          <meshStandardMaterial color="#0284c7" roughness={0.3} />
        </mesh>

        {/* Cockpit / Windshield (Photo 5) */}
        <mesh position={[0, 1.2, -0.8]} rotation={[-0.45, 0, 0]}>
          <planeGeometry args={[2.8, 1.2]} />
          <meshStandardMaterial color="#38bdf8" roughness={0.05} metalness={0.9} transparent opacity={0.7} />
        </mesh>

        {/* Driver in boat (Photo 5) */}
        <mesh position={[0, 1.3, 0.6]}>
          <boxGeometry args={[0.8, 0.9, 0.6]} />
          <meshStandardMaterial color="#f8fafc" /> {/* White shirt from Photo 5 */}
        </mesh>
        <mesh position={[0, 2.0, 0.5]}>
          <sphereGeometry args={[0.35, 16, 16]} />
          <meshStandardMaterial color="#0f172a" />
        </mesh>

        {/* Blue boat seats */}
        <mesh position={[0, 0.9, 0.9]}>
          <boxGeometry args={[2.2, 0.5, 1.4]} />
          <meshStandardMaterial color="#0369a1" />
        </mesh>
      </group>

      {/* Long White Foamy Wake behind the boat (Photo 6 exact match!) */}
      <mesh position={[0, 0.08, 11]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[5.5, 22]} />
        <meshBasicMaterial color="#ffffff" transparent opacity={0.75} />
      </mesh>
      <mesh position={[0, 0.06, 28]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[9.5, 36]} />
        <meshBasicMaterial color="#e0f2fe" transparent opacity={0.5} />
      </mesh>
    </group>
  );
}

// Helper to generate real in-world 3D billboard canvas texture (Photo 5 exact match!)
function createBillboardTexture(project?: {
  step: string;
  title: string;
  codePreview: string;
  desc: string;
  pills: string[];
}) {
  if (typeof document === "undefined" || !project) return null;

  const canvas = document.createElement("canvas");
  canvas.width = 1024;
  canvas.height = 680;
  const ctx = canvas.getContext("2d");
  if (!ctx) return null;

  // 1. Dark billboard background
  ctx.fillStyle = "#060913";
  ctx.fillRect(0, 0, 1024, 680);

  // 2. Neon purple/amber top accent bar
  const gradient = ctx.createLinearGradient(0, 0, 1024, 0);
  gradient.addColorStop(0, "#c084fc");
  gradient.addColorStop(0.5, "#ec4899");
  gradient.addColorStop(1, "#3b82f6");
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, 1024, 10);

  // 3. Top bar metadata
  ctx.fillStyle = "#d8b4fe";
  ctx.font = "bold 20px monospace";
  ctx.fillText(project.step, 48, 55);

  ctx.fillStyle = "#94a3b8";
  ctx.font = "16px monospace";
  ctx.fillText("BALAJI // CASE STUDY", 740, 55);

  // Divider line
  ctx.strokeStyle = "rgba(168, 85, 247, 0.4)";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(48, 75);
  ctx.lineTo(976, 75);
  ctx.stroke();

  // 4. Large Bold Neon Title (Photo 5)
  ctx.fillStyle = "#ffffff";
  ctx.font = "900 42px system-ui, sans-serif";
  ctx.shadowColor = "rgba(168, 85, 247, 0.9)";
  ctx.shadowBlur = 24;
  ctx.fillText(project.title, 48, 140);
  ctx.shadowBlur = 0;

  // 5. Code Preview Box
  ctx.fillStyle = "#02040a";
  ctx.fillRect(48, 175, 928, 130);
  ctx.strokeStyle = "rgba(168, 85, 247, 0.5)";
  ctx.lineWidth = 1.5;
  ctx.strokeRect(48, 175, 928, 130);

  ctx.fillStyle = "#38bdf8";
  ctx.font = "20px monospace";
  const lines = project.codePreview.split("\n");
  lines.forEach((l, i) => {
    ctx.fillText(l, 68, 222 + i * 36);
  });

  // 6. Description Text
  ctx.fillStyle = "#e2e8f0";
  ctx.font = "22px system-ui, sans-serif";
  const words = project.desc.split(" ");
  let curLine = "";
  let curY = 355;
  for (let n = 0; n < words.length; n++) {
    const testLine = curLine + words[n] + " ";
    const metrics = ctx.measureText(testLine);
    if (metrics.width > 920 && n > 0) {
      ctx.fillText(curLine, 48, curY);
      curLine = words[n] + " ";
      curY += 34;
    } else {
      curLine = testLine;
    }
  }
  ctx.fillText(curLine, 48, curY);

  // 7. Tech Stack Pills (Photo 5)
  let pillX = 48;
  const pillY = 475;
  ctx.font = "bold 18px monospace";
  project.pills.forEach((pill) => {
    const w = ctx.measureText(pill).width + 32;
    ctx.fillStyle = "rgba(168, 85, 247, 0.2)";
    ctx.fillRect(pillX, pillY, w, 42);
    ctx.strokeStyle = "#a855f7";
    ctx.lineWidth = 1.5;
    ctx.strokeRect(pillX, pillY, w, 42);
    ctx.fillStyle = "#f3e8ff";
    ctx.fillText(pill, pillX + 16, pillY + 28);
    pillX += w + 16;
  });

  // 8. Bottom CTA Button (Photo 5)
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(48, 565, 300, 54);
  ctx.fillStyle = "#000000";
  ctx.font = "900 18px monospace";
  ctx.fillText("CLICK TO INSPECT →", 75, 600);

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.needsUpdate = true;
  return texture;
}

// ==============================================================
// 7. GIANT FLOATING BARGE BILLBOARDS (ACT 5: Exact match to Photo 5!)
// Scaffolding frame on floating red barge displaying projects!
// ==============================================================
export function FloatingBargeBillboard({
  position,
  rotation = [0, 0, 0],
  project,
  onClick,
}: {
  position: [number, number, number];
  rotation?: [number, number, number];
  project?: {
    step: string;
    title: string;
    codePreview: string;
    desc: string;
    pills: string[];
  };
  onClick?: () => void;
}) {
  const texture = useMemo(() => createBillboardTexture(project), [project]);

  return (
    <group position={position} rotation={rotation}>
      {/* Floating Red Industrial Barge Platform with tires (Photo 5) */}
      <mesh position={[0, 0.8, 0]}>
        <boxGeometry args={[36, 1.8, 14]} />
        <meshStandardMaterial color="#b91c1c" roughness={0.5} metalness={0.4} /> {/* Red barge */}
      </mesh>
      {/* Barge safety bumpers / tires along edge (Photo 5) */}
      {[-16, -11, -6, 0, 6, 11, 16].map((tx, idx) => (
        <mesh key={idx} position={[tx, 0.8, 7.1]} rotation={[0, 0, Math.PI / 2]}>
          <torusGeometry args={[0.7, 0.25, 8, 16]} />
          <meshStandardMaterial color="#111" roughness={0.9} />
        </mesh>
      ))}

      {/* Metal Scaffolding Lattice Towers holding the giant screen (Photo 5) */}
      {[-16, 16].map((sx, idx) => (
        <group key={idx} position={[sx, 12, 0]}>
          <mesh>
            <cylinderGeometry args={[0.3, 0.4, 22, 8]} />
            <meshStandardMaterial color="#334155" metalness={0.9} />
          </mesh>
          {[-8, -4, 0, 4, 8].map((crossY) => (
            <mesh key={crossY} position={[0, crossY, 0]} rotation={[0, 0, 0.78]}>
              <boxGeometry args={[3.5, 0.15, 0.15]} />
              <meshStandardMaterial color="#64748b" metalness={0.9} />
            </mesh>
          ))}
        </group>
      ))}

      {/* Top support bar across scaffolding */}
      <mesh position={[0, 23, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.3, 0.3, 33, 8]} />
        <meshStandardMaterial color="#334155" metalness={0.9} />
      </mesh>

      {/* Glowing Neon Outline Border around the billboard (Photo 5 purple glow) */}
      <mesh position={[0, 12, 0.5]}>
        <boxGeometry args={[28.4, 18.4, 0.2]} />
        <meshBasicMaterial color="#a855f7" />
      </mesh>

      {/* Neon Light illuminating the sea and passing boat */}
      <pointLight position={[0, 12, 4]} intensity={4.5} distance={50} color="#c084fc" />

      {/* Back panel */}
      <mesh position={[0, 12, -0.1]} rotation={[0, Math.PI, 0]}>
        <planeGeometry args={[28, 18]} />
        <meshStandardMaterial color="#0f172a" roughness={0.8} />
      </mesh>

      {/* Real In-World Project Billboard Screen Texture (Photo 5 exact match!) */}
      <mesh
        position={[0, 12, 0.7]}
        onClick={(e) => {
          e.stopPropagation();
          onClick?.();
        }}
        onPointerOver={() => {
          if (typeof document !== "undefined") document.body.style.cursor = "pointer";
        }}
        onPointerOut={() => {
          if (typeof document !== "undefined") document.body.style.cursor = "auto";
        }}
      >
        <planeGeometry args={[28, 18]} />
        {texture ? (
          <meshBasicMaterial map={texture} toneMapped={false} />
        ) : (
          <meshStandardMaterial color="#080811" roughness={0.2} metalness={0.9} />
        )}
      </mesh>
    </group>
  );
}
