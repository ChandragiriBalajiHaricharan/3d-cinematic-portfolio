"use client";

import { useMemo } from "react";
import * as THREE from "three";

// ==============================================================
// 1. SKY & SUN (Dusk over Paris transitioning to coastal sea)
// ==============================================================
export function AtmosphericSky() {
  return (
    <group>
      {/* Golden Sun */}
      <mesh position={[40, 22, -150]}>
        <sphereGeometry args={[18, 32, 32]} />
        <meshBasicMaterial color="#ffaa33" />
      </mesh>
      {/* Sun glow halo */}
      <mesh position={[40, 22, -150]}>
        <sphereGeometry args={[36, 32, 32]} />
        <meshBasicMaterial color="#ff7711" transparent opacity={0.3} />
      </mesh>
      {/* Distant Clouds */}
      {[-80, -20, 50, 110].map((cx, i) => (
        <group key={i} position={[cx, 45 + (i % 2) * 8, -200 + i * 40]}>
          <mesh>
            <sphereGeometry args={[16, 16, 16]} />
            <meshStandardMaterial color="#fff3e0" roughness={1} />
          </mesh>
          <mesh position={[12, -2, 0]}>
            <sphereGeometry args={[13, 16, 16]} />
            <meshStandardMaterial color="#ffe8cc" roughness={1} />
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
    </group>
  );
}

// ==============================================================
// 3. PARIS STREET & BOULEVARD (ACT 3: Motorcycle Ride & Skills)
// ==============================================================
export function CityBoulevard() {
  const buildings = useMemo(() => {
    const list: Array<{ x: number; z: number; w: number; h: number; d: number; color: string }> = [];
    // Paris street buildings from z: 120 down to z: -60
    for (let z = 120; z >= -60; z -= 24) {
      list.push({ x: -25, z, w: 20, h: 24, d: 22, color: "#c9ad84" });
      list.push({ x: 25, z, w: 20, h: 24, d: 22, color: "#bf9f72" });
    }
    return list;
  }, []);

  return (
    <group>
      {/* Road surface leading to harbor pier */}
      <mesh position={[0, 0.05, 30]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[24, 200]} />
        <meshStandardMaterial color="#16120d" roughness={0.2} metalness={0.8} />
      </mesh>
      {/* Sidewalks */}
      <mesh position={[-13, 0.15, 30]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[5, 200]} />
        <meshStandardMaterial color="#4a3e35" roughness={0.7} />
      </mesh>
      <mesh position={[13, 0.15, 30]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[5, 200]} />
        <meshStandardMaterial color="#4a3e35" roughness={0.7} />
      </mesh>

      {/* Buildings */}
      {buildings.map((b, i) => (
        <group key={i} position={[b.x, b.h / 2, b.z]}>
          <mesh castShadow receiveShadow>
            <boxGeometry args={[b.w, b.h, b.d]} />
            <meshStandardMaterial color={b.color} roughness={0.8} />
          </mesh>
          {/* Mansard roof */}
          <mesh position={[0, b.h / 2 + 3, 0]}>
            <boxGeometry args={[b.w - 1.5, 6, b.d - 1.5]} />
            <meshStandardMaterial color="#404a52" roughness={0.5} />
          </mesh>
        </group>
      ))}

      {/* Boulevard Street Lamps */}
      {Array.from({ length: 12 }).map((_, i) => {
        const z = 110 - i * 16;
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
            <mesh position={[10.5, 4, z]}>
              <cylinderGeometry args={[0.08, 0.15, 8, 8]} />
              <meshStandardMaterial color="#111" metalness={0.9} />
            </mesh>
            <mesh position={[10.5, 8.2, z]}>
              <octahedronGeometry args={[0.5]} />
              <meshBasicMaterial color="#ffc366" />
            </mesh>
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
    <group position={[0, -0.05, -350]}>
      {/* Vast Sparkling Turquoise Blue Ocean (Photo 5 & 6) */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[1400, 700]} />
        <meshStandardMaterial
          color="#0284c7" // Vibrant turquoise blue sea from Photo 5 & 6
          roughness={0.08}
          metalness={0.9}
        />
      </mesh>

      {/* Gentle shoreline transition foam right at harbor pier (z = -60) */}
      <mesh position={[0, 0.02, 290]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[120, 16]} />
        <meshBasicMaterial color="#bae6fd" transparent opacity={0.6} />
      </mesh>

      {/* Distant coastal city skylines lining both shores (Photo 5 & 6) */}
      {[-180, 180].map((shoreX) => (
        <group key={shoreX} position={[shoreX, 0, 0]}>
          {Array.from({ length: 18 }).map((_, i) => {
            const h = 30 + (i % 5) * 16;
            const w = 18 + (i % 3) * 6;
            const z = 320 - i * 40;
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

// ==============================================================
// 7. GIANT FLOATING BARGE BILLBOARDS (ACT 5: Exact match to Photo 5!)
// Scaffolding frame on floating red barge displaying projects!
// ==============================================================
export function FloatingBargeBillboard({
  position,
}: {
  position: [number, number, number];
}) {
  return (
    <group position={position}>
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
      {/* Black Billboard Display Screen (Photo 5) */}
      <mesh position={[0, 12, 0.7]}>
        <boxGeometry args={[28, 18, 0.2]} />
        <meshStandardMaterial color="#080811" roughness={0.2} metalness={0.9} />
      </mesh>
    </group>
  );
}
