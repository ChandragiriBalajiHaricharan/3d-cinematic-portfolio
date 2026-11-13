"use client";

import { useMemo, useRef, Suspense } from "react";
import { useFrame } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import * as THREE from "three";

// ==============================================================
// 1. SKY & SUN (Radiant Blue Sky & Golden Sunlight - Image 1 & 2 match!)
// ==============================================================
export function AtmosphericSky() {
  return (
    <group>
      {/* Radiant Golden Sun in Azure Sky (Image 1 & 2) */}
      <mesh position={[85, 80, -220]}>
        <sphereGeometry args={[26, 32, 32]} />
        <meshBasicMaterial color="#fff3cc" />
      </mesh>
      {/* Sun glow halo */}
      <mesh position={[85, 80, -220]}>
        <sphereGeometry args={[55, 32, 32]} />
        <meshBasicMaterial color="#ffbb44" transparent opacity={0.35} />
      </mesh>

      {/* Fluffy White Clouds across the Sky (Image 1 & 2) */}
      {[
        [-180, 75, -260],
        [-60, 90, -240],
        [40, 85, -280],
        [160, 70, -250],
        [-100, 65, -120],
        [120, 80, -100],
      ].map(([cx, cy, cz], i) => (
        <group key={i} position={[cx, cy, cz]}>
          <mesh>
            <sphereGeometry args={[22, 16, 16]} />
            <meshStandardMaterial color="#ffffff" roughness={0.9} />
          </mesh>
          <mesh position={[14, -2, 4]}>
            <sphereGeometry args={[18, 16, 16]} />
            <meshStandardMaterial color="#ffffff" roughness={0.9} />
          </mesh>
          <mesh position={[-14, -3, -4]}>
            <sphereGeometry args={[16, 16, 16]} />
            <meshStandardMaterial color="#f0f9ff" roughness={0.9} />
          </mesh>
        </group>
      ))}
    </group>
  );
}

// ==============================================================
// 2. REAL 3D EIFFEL TOWER MODEL (eiffel.glb)
// ==============================================================
export function EiffelTower({ position = [0, 0, -50] }: { position?: [number, number, number] }) {
  const { scene } = useGLTF("/models/eiffel.glb");
  const beaconBeamRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (beaconBeamRef.current) {
      beaconBeamRef.current.rotation.y = state.clock.elapsedTime * 0.35;
    }
  });

  const model = useMemo(() => {
    const clone = scene.clone(true);
    const box = new THREE.Box3().setFromObject(clone);
    const size = new THREE.Vector3();
    box.getSize(size);
    const center = new THREE.Vector3();
    box.getCenter(center);

    // Scale so height is ~125 units
    const targetHeight = 125;
    const s = size.y > 0 ? targetHeight / size.y : 1;
    clone.scale.set(s, s, s);
    clone.position.set(-center.x * s, -box.min.y * s, -center.z * s);

    // Warm golden hour metallic lighting on iron latticework
    clone.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        const m = child as THREE.Mesh;
        m.castShadow = true;
        m.receiveShadow = true;
        if (m.material) {
          (m.material as THREE.MeshStandardMaterial).color = new THREE.Color("#4a3728");
          (m.material as THREE.MeshStandardMaterial).roughness = 0.55;
          (m.material as THREE.MeshStandardMaterial).metalness = 0.85;
        }
      }
    });

    const grp = new THREE.Group();
    grp.add(clone);
    return grp;
  }, [scene]);

  return (
    <group position={position}>
      <primitive object={model} />
      {/* Tower gold lighting */}
      <pointLight position={[0, 45, 0]} intensity={45} color="#ffa533" distance={160} />
      <pointLight position={[0, 85, 0]} intensity={35} color="#ffcc66" distance={140} />

      {/* Sweeping Golden Paris Beacon Searchlight across sky */}
      <group ref={beaconBeamRef} position={[0, 122, 0]}>
        <pointLight intensity={50} color="#fff6dd" distance={240} />
        <mesh position={[0, 0, 80]} rotation={[Math.PI / 2 + 0.12, 0, 0]}>
          <coneGeometry args={[15, 160, 16, 1, true]} />
          <meshBasicMaterial
            color="#fff2cc"
            transparent
            opacity={0.18}
            side={THREE.DoubleSide}
            depthWrite={false}
          />
        </mesh>
      </group>
    </group>
  );
}

// ==============================================================
// 2B. REAL 3D CHARACTER (person.glb - Real man roaming Paris)
// ==============================================================
export function RealManCharacter({
  position = [0, 0, 96],
  rotation = [0, Math.PI, 0],
}: {
  position?: [number, number, number];
  rotation?: [number, number, number];
}) {
  const { scene } = useGLTF("/models/person.glb");

  const model = useMemo(() => {
    const clone = scene.clone(true);
    const box = new THREE.Box3().setFromObject(clone);
    const size = new THREE.Vector3();
    box.getSize(size);
    const center = new THREE.Vector3();
    box.getCenter(center);

    // Real human scale ~2.2 units
    const targetHeight = 2.2;
    const s = size.y > 0 ? targetHeight / size.y : 1;
    clone.scale.set(s, s, s);
    clone.position.set(-center.x * s, -box.min.y * s, -center.z * s);

    clone.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        child.castShadow = true;
      }
    });

    const grp = new THREE.Group();
    grp.add(clone);
    return grp;
  }, [scene]);

  return (
    <group position={position} rotation={rotation}>
      <primitive object={model} />
    </group>
  );
}

// ==============================================================
// 2C. REAL 3D CARBON BIKE (Custom PBR Cafe Racer / Sports Bike)
// ==============================================================
export function RealCarbonBike({
  position = [1.8, 0, 95],
  rotation = [0, Math.PI / 2 + 0.15, 0],
}: {
  position?: [number, number, number];
  rotation?: [number, number, number];
}) {
  return (
    <group position={position} rotation={rotation}>
      {/* Front & Rear Wheels (Tires + Rims + Spokes) */}
      <group position={[0, 0.45, -1.05]}>
        <mesh rotation={[0, 0, Math.PI / 2]} castShadow>
          <torusGeometry args={[0.42, 0.08, 16, 32]} />
          <meshStandardMaterial color="#111" roughness={0.9} />
        </mesh>
        <mesh rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.34, 0.34, 0.04, 24]} />
          <meshStandardMaterial color="#222" metalness={0.9} roughness={0.3} />
        </mesh>
        {/* Brake Disc */}
        <mesh rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.26, 0.26, 0.05, 16]} />
          <meshStandardMaterial color="#94a3b8" metalness={0.95} roughness={0.2} />
        </mesh>
      </group>

      <group position={[0, 0.45, 1.05]}>
        <mesh rotation={[0, 0, Math.PI / 2]} castShadow>
          <torusGeometry args={[0.42, 0.08, 16, 32]} />
          <meshStandardMaterial color="#111" roughness={0.9} />
        </mesh>
        <mesh rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.34, 0.34, 0.04, 24]} />
          <meshStandardMaterial color="#222" metalness={0.9} roughness={0.3} />
        </mesh>
        {/* Rear Sprocket & Disc */}
        <mesh rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.22, 0.22, 0.05, 16]} />
          <meshStandardMaterial color="#64748b" metalness={0.9} roughness={0.25} />
        </mesh>
      </group>

      {/* Main Frame / Carbon Trellis Chassis */}
      <mesh position={[0, 0.72, 0]} castShadow>
        <boxGeometry args={[0.28, 0.42, 1.4]} />
        <meshStandardMaterial color="#0f172a" metalness={0.85} roughness={0.25} />
      </mesh>

      {/* Engine Block with Cooling Fins */}
      <mesh position={[0, 0.52, -0.1]} castShadow>
        <boxGeometry args={[0.34, 0.36, 0.6]} />
        <meshStandardMaterial color="#334155" metalness={0.95} roughness={0.2} />
      </mesh>

      {/* Sculpted Fuel Tank (Matte Dark Navy / Carbon) */}
      <mesh position={[0, 0.95, -0.28]} rotation={[-0.15, 0, 0]} castShadow>
        <boxGeometry args={[0.36, 0.28, 0.75]} />
        <meshStandardMaterial color="#1e293b" metalness={0.7} roughness={0.3} />
      </mesh>

      {/* Racing Leather Seat */}
      <mesh position={[0, 0.88, 0.38]} rotation={[0.08, 0, 0]} castShadow>
        <boxGeometry args={[0.26, 0.12, 0.6]} />
        <meshStandardMaterial color="#18181b" roughness={0.85} />
      </mesh>

      {/* Gold Front Forks */}
      <mesh position={[-0.12, 0.72, -0.85]} rotation={[0.35, 0, 0]} castShadow>
        <cylinderGeometry args={[0.035, 0.035, 0.85, 12]} />
        <meshStandardMaterial color="#eab308" metalness={0.9} roughness={0.15} />
      </mesh>
      <mesh position={[0.12, 0.72, -0.85]} rotation={[0.35, 0, 0]} castShadow>
        <cylinderGeometry args={[0.035, 0.035, 0.85, 12]} />
        <meshStandardMaterial color="#eab308" metalness={0.9} roughness={0.15} />
      </mesh>

      {/* Clip-on Handlebars */}
      <mesh position={[0, 1.05, -0.72]}>
        <cylinderGeometry args={[0.02, 0.02, 0.62, 8]} />
        <meshStandardMaterial color="#475569" metalness={0.9} roughness={0.2} />
      </mesh>

      {/* Swept Chrome Dual Exhaust Pipes */}
      <mesh position={[0.2, 0.42, 0.45]} rotation={[-0.2, 0.1, 0]} castShadow>
        <cylinderGeometry args={[0.045, 0.055, 0.9, 12]} />
        <meshStandardMaterial color="#cbd5e1" metalness={0.98} roughness={0.1} />
      </mesh>

      {/* Halo LED Projector Headlight */}
      <mesh position={[0, 0.95, -0.92]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.12, 0.12, 0.06, 20]} />
        <meshBasicMaterial color="#ffffff" />
      </mesh>
      <pointLight position={[0, 0.95, -1.0]} intensity={6} color="#ffffff" distance={12} />

      {/* LED Tail Bar */}
      <mesh position={[0, 0.92, 0.72]}>
        <boxGeometry args={[0.2, 0.04, 0.04]} />
        <meshBasicMaterial color="#ef4444" />
      </mesh>
      <pointLight position={[0, 0.92, 0.76]} intensity={3} color="#ef4444" distance={5} />
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
    tex.repeat.set(4, 28);
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

  const buildings = useMemo(() => {
    const list: Array<{ x: number; z: number; w: number; h: number; d: number; isLeft: boolean }> = [];
    // Spacious grand Paris boulevard: buildings set back at x = -34 and x = 34
    for (let z = 120; z >= -60; z -= 24) {
      list.push({ x: -34, z, w: 20, h: 26, d: 23, isLeft: true });
      list.push({ x: 34, z, w: 20, h: 26, d: 23, isLeft: false });
    }
    return list;
  }, []);

  return (
    <group>
      {/* Real Wet Paris Cobblestone Road (Spacious 28-unit width) */}
      <mesh position={[0, 0.05, 30]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[28, 200]} />
        <meshStandardMaterial
          map={cobblestoneTexture || undefined}
          color="#221a14"
          roughness={0.16}
          metalness={0.45}
        />
      </mesh>

      {/* Wet Puddle Sheen in Foreground reflecting Paris sunset & Eiffel Tower (Photo 1 & 2) */}
      <mesh position={[0, 0.08, 104]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[16, 28]} />
        <meshStandardMaterial color="#080604" roughness={0.02} metalness={0.96} />
      </mesh>
      <mesh position={[-4, 0.07, 72]} rotation={[-Math.PI / 2, 0, 0.08]}>
        <planeGeometry args={[10, 34]} />
        <meshStandardMaterial color="#0a0805" roughness={0.04} metalness={0.93} />
      </mesh>

      {/* Parisian Granite Sidewalks (8-unit wide promenades on both sides) */}
      <mesh position={[-19, 0.15, 30]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[10, 200]} />
        <meshStandardMaterial
          map={sidewalkTexture || undefined}
          color="#6b5b4e"
          roughness={0.5}
        />
      </mesh>
      <mesh position={[19, 0.15, 30]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[10, 200]} />
        <meshStandardMaterial
          map={sidewalkTexture || undefined}
          color="#6b5b4e"
          roughness={0.5}
        />
      </mesh>

      {/* 3D Parisian Avenue Trees lining the sidewalks */}
      {[-16, 16].map((tx) => (
        <group key={tx}>
          {[104, 80, 56, 32, 8, -16, -40].map((tz) => (
            <group key={tz} position={[tx, 0, tz]}>
              {/* Tree trunk */}
              <mesh position={[0, 3.5, 0]}>
                <cylinderGeometry args={[0.22, 0.35, 7, 8]} />
                <meshStandardMaterial color="#3d2f23" roughness={0.9} />
              </mesh>
              {/* Layered spherical foliage canopies */}
              <mesh position={[0, 7.5, 0]}>
                <sphereGeometry args={[2.6, 12, 12]} />
                <meshStandardMaterial color="#2d5a27" roughness={0.8} />
              </mesh>
              <mesh position={[0, 9.2, 0]}>
                <sphereGeometry args={[1.9, 10, 10]} />
                <meshStandardMaterial color="#3f7238" roughness={0.8} />
              </mesh>
            </group>
          ))}
        </group>
      ))}

      {/* 3D Parisian Haussmann Architecture with Real Balconies & Storefronts */}
      {buildings.map((b, i) => (
        <group key={i} position={[b.x, b.h / 2, b.z]}>
          {/* Main limestone building structure */}
          <mesh castShadow receiveShadow>
            <boxGeometry args={[b.w, b.h, b.d]} />
            <meshStandardMaterial color="#c2a378" roughness={0.75} />
          </mesh>

          {/* Detailed Facade on Avenue-Facing Side */}
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

          {/* 3D Protruding Stone Balconies with Wrought-Iron Railings on Upper Floors */}
          {[1, 6, 11].map((by) => (
            <group key={by} position={[b.isLeft ? b.w / 2 + 0.8 : -b.w / 2 - 0.8, by, 0]}>
              {/* Stone balcony base */}
              <mesh position={[0, -0.15, 0]}>
                <boxGeometry args={[1.4, 0.3, b.d - 4]} />
                <meshStandardMaterial color="#8c7860" roughness={0.7} />
              </mesh>
              {/* Black wrought iron railing */}
              <mesh position={[b.isLeft ? 0.65 : -0.65, 0.5, 0]}>
                <boxGeometry args={[0.08, 0.9, b.d - 4]} />
                <meshStandardMaterial color="#111827" metalness={0.9} roughness={0.3} />
              </mesh>
            </group>
          ))}

          {/* 3D Ground Floor French Bistro Storefront with Striped Awning */}
          <group position={[b.isLeft ? b.w / 2 + 1.2 : -b.w / 2 - 1.2, -b.h / 2 + 4, 0]}>
            <mesh rotation={[0, 0, b.isLeft ? -0.35 : 0.35]}>
              <boxGeometry args={[2.6, 0.25, b.d - 2]} />
              <meshStandardMaterial color={b.isLeft ? "#b91c1c" : "#0369a1"} roughness={0.6} />
            </mesh>
            <pointLight
              position={[b.isLeft ? 1.2 : -1.2, -0.8, 0]}
              intensity={4}
              distance={16}
              color="#ffa533"
            />
          </group>

          {/* Slate Mansard roof with decorative dormers */}
          <mesh position={[0, b.h / 2 + 3.5, 0]}>
            <boxGeometry args={[b.w - 1.5, 7, b.d - 1.5]} />
            <meshStandardMaterial color="#333d45" roughness={0.4} metalness={0.3} />
          </mesh>
        </group>
      ))}

      {/* Boulevard Vintage Street Lamps with warm ambient illumination */}
      {[-15, 15].map((lx) => (
        <group key={lx}>
          {[110, 90, 70, 50, 30, 10, -10, -30, -50].map((lz, idx) => (
            <group key={lz} position={[lx, 0, lz]}>
              {/* Cast iron lamp post */}
              <mesh position={[0, 4, 0]}>
                <cylinderGeometry args={[0.08, 0.18, 8, 8]} />
                <meshStandardMaterial color="#111827" metalness={0.9} />
              </mesh>
              {/* Ornate hexagonal glowing lamp lantern */}
              <mesh position={[0, 8.2, 0]}>
                <octahedronGeometry args={[0.55]} />
                <meshBasicMaterial color="#ffc366" />
              </mesh>
              {idx < 4 && (
                <pointLight position={[0, 8.2, 0]} intensity={4.5} distance={18} color="#ffaa33" />
              )}
            </group>
          ))}
        </group>
      ))}

      {/* Highway Gantry Sign & Loop (Image 5 exact match!) */}
      <group position={[0, 8.5, -20]}>
        {/* Support pillars */}
        <mesh position={[-12, -3.5, 0]}>
          <cylinderGeometry args={[0.3, 0.3, 7, 8]} />
          <meshStandardMaterial color="#334155" metalness={0.8} />
        </mesh>
        <mesh position={[12, -3.5, 0]}>
          <cylinderGeometry args={[0.3, 0.3, 7, 8]} />
          <meshStandardMaterial color="#334155" metalness={0.8} />
        </mesh>
        {/* Overhead beam */}
        <mesh position={[0, 0.5, 0]}>
          <boxGeometry args={[25, 0.5, 0.5]} />
          <meshStandardMaterial color="#334155" metalness={0.8} />
        </mesh>
        {/* Highway Sign Board */}
        <mesh position={[0, 0, 0.2]}>
          <boxGeometry args={[14, 2.8, 0.2]} />
          <meshStandardMaterial color="#047857" roughness={0.3} />
        </mesh>
      </group>

      {/* Circular looping highway overpass in the sky (Image 5 exact match!) */}
      <group position={[32, 22, -65]} rotation={[0.35, 0.3, 0]}>
        <mesh>
          <torusGeometry args={[30, 2.2, 8, 36, Math.PI * 1.6]} />
          <meshStandardMaterial color="#475569" roughness={0.5} metalness={0.5} />
        </mesh>
        {[-18, 0, 18].map((px) => (
          <mesh key={px} position={[px, -11, 0]}>
            <cylinderGeometry args={[1.2, 1.4, 22, 8]} />
            <meshStandardMaterial color="#64748b" roughness={0.7} />
          </mesh>
        ))}
      </group>

      {/* Harbor Pier where motorcycle arrives and transitions to water */}
      <group position={[0, -0.2, -70]}>
        <mesh position={[0, 0, 0]}>
          <boxGeometry args={[32, 1.2, 24]} />
          <meshStandardMaterial color="#30261f" roughness={0.9} />
        </mesh>
        {/* Pier wooden bollards */}
        {[-14, -7, 7, 14].map((bx, idx) => (
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
