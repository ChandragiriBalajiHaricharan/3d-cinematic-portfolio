"use client";

import { useMemo, useRef, Suspense } from "react";
import { useFrame } from "@react-three/fiber";
import { useGLTF, Sky } from "@react-three/drei";
import * as THREE from "three";

// ==============================================================
// 1. ATMOSPHERIC SKY & SUN (Balanced Golden Daylight - No Blinding Bloom)
// ==============================================================
export function AtmosphericSky() {
  return (
    <group>
      <Sky
        sunPosition={[140, 85, -240]}
        turbidity={3}
        rayleigh={1.0}
        mieCoefficient={0.003}
        mieDirectionalG={0.8}
      />

      {/* Sun Corona Core */}
      <mesh position={[140, 85, -240]}>
        <sphereGeometry args={[9, 20, 20]} />
        <meshBasicMaterial color="#fffbeb" />
      </mesh>
      {/* Soft Golden Sun Halo */}
      <mesh position={[140, 85, -240]}>
        <sphereGeometry args={[22, 20, 20]} />
        <meshBasicMaterial color="#fbbf24" transparent opacity={0.18} />
      </mesh>

      {/* Distant Clouds */}
      {[
        [-160, 85, -240, 24],
        [-50, 95, -220, 30],
        [60, 90, -250, 26],
        [170, 80, -230, 24],
      ].map(([cx, cy, cz, rad], i) => (
        <group key={i} position={[cx, cy, cz]}>
          <mesh>
            <sphereGeometry args={[rad, 12, 12]} />
            <meshStandardMaterial color="#ffffff" roughness={0.95} />
          </mesh>
          <mesh position={[rad * 0.6, -rad * 0.1, 4]}>
            <sphereGeometry args={[rad * 0.75, 12, 12]} />
            <meshStandardMaterial color="#f8fafc" roughness={0.95} />
          </mesh>
        </group>
      ))}
    </group>
  );
}

// ==============================================================
// 2. REAL 3D EIFFEL TOWER MODEL (eiffel.glb - Photo 1 Match!)
// ==============================================================
export function EiffelTower({ position = [0, 0, -50] }: { position?: [number, number, number] }) {
  const { scene } = useGLTF("/models/eiffel.glb");
  const beaconRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (beaconRef.current) {
      beaconRef.current.rotation.y = state.clock.elapsedTime * 0.45;
    }
  });

  const model = useMemo(() => {
    const clone = scene.clone(true);
    const box = new THREE.Box3().setFromObject(clone);
    const size = new THREE.Vector3();
    box.getSize(size);
    const center = new THREE.Vector3();
    box.getCenter(center);

    const targetHeight = 128;
    const s = size.y > 0 ? targetHeight / size.y : 1;
    clone.scale.set(s, s, s);
    clone.position.set(-center.x * s, -box.min.y * s, -center.z * s);

    clone.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        const m = child as THREE.Mesh;
        m.castShadow = true;
        m.receiveShadow = true;
        if (m.material) {
          (m.material as THREE.MeshStandardMaterial).color = new THREE.Color("#524032");
          (m.material as THREE.MeshStandardMaterial).roughness = 0.52;
          (m.material as THREE.MeshStandardMaterial).metalness = 0.88;
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

      {/* Sweeping 360° Eiffel Tower Beacon Light Beam */}
      <group ref={beaconRef} position={[0, 126, 0]}>
        <mesh position={[0, 0, 70]} rotation={[Math.PI / 2, 0, 0]}>
          <coneGeometry args={[16, 140, 16, 1, true]} />
          <meshBasicMaterial
            color="#fff8db"
            transparent
            opacity={0.3}
            side={THREE.DoubleSide}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
          />
        </mesh>
        <pointLight position={[0, 0, 0]} intensity={14} distance={80} color="#ffedd5" />
      </group>
    </group>
  );
}

// ==============================================================
// 3. PARIS FERRIS WHEEL (Photo 1 & 3 - Rotating Neon Skyline)
// ==============================================================
export function ParisFerrisWheel({ position = [72, 0, -50] }: { position?: [number, number, number] }) {
  const wheelRef = useRef<THREE.Group>(null);
  useFrame((state) => {
    if (wheelRef.current) {
      wheelRef.current.rotation.z = state.clock.elapsedTime * 0.12;
    }
  });

  return (
    <group position={position}>
      <mesh position={[-4, 18, 0]} rotation={[0, 0, -0.22]}>
        <cylinderGeometry args={[0.35, 0.65, 38, 8]} />
        <meshStandardMaterial color="#1e293b" metalness={0.9} roughness={0.3} />
      </mesh>
      <mesh position={[4, 18, 0]} rotation={[0, 0, 0.22]}>
        <cylinderGeometry args={[0.35, 0.65, 38, 8]} />
        <meshStandardMaterial color="#1e293b" metalness={0.9} roughness={0.3} />
      </mesh>

      <group ref={wheelRef} position={[0, 36, 0]}>
        <mesh>
          <torusGeometry args={[24, 0.45, 8, 36]} />
          <meshBasicMaterial color="#f59e0b" />
        </mesh>
        <mesh>
          <torusGeometry args={[18, 0.25, 8, 28]} />
          <meshBasicMaterial color="#fbbf24" />
        </mesh>
        {Array.from({ length: 12 }).map((_, i) => (
          <mesh key={i} rotation={[0, 0, (i * Math.PI) / 6]}>
            <boxGeometry args={[48, 0.15, 0.15]} />
            <meshStandardMaterial color="#f59e0b" emissive="#d97706" emissiveIntensity={0.6} />
          </mesh>
        ))}
      </group>
    </group>
  );
}

// ==============================================================
// 4. REAL 3D CHARACTER (person.glb)
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
// 5. HIGHWAY SUPERCAR (ferrari.glb - Fast Rendering, No Heavy Spot Shadows)
// ==============================================================
export function SupercarVehicle({
  position = [0, 0, 0],
  rotation = [0, 0, 0],
}: {
  position?: [number, number, number];
  rotation?: [number, number, number];
}) {
  const { scene } = useGLTF("/models/ferrari.glb");

  const carModel = useMemo(() => {
    const clone = scene.clone(true);
    const box = new THREE.Box3().setFromObject(clone);
    const size = new THREE.Vector3();
    box.getSize(size);
    const center = new THREE.Vector3();
    box.getCenter(center);

    const targetLength = 4.8;
    const s = size.z > 0 ? targetLength / size.z : 1;
    clone.scale.set(s, s, s);
    clone.position.set(-center.x * s, -box.min.y * s, -center.z * s);

    clone.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        const m = child as THREE.Mesh;
        m.castShadow = true;
        if (m.material) {
          const mat = m.material as THREE.MeshStandardMaterial;
          if (mat.name && mat.name.toLowerCase().includes("body")) {
            mat.roughness = 0.12;
            mat.metalness = 0.85;
            mat.color = new THREE.Color("#dc2626"); // Rosso Corsa Red
          }
        }
      }
    });

    const grp = new THREE.Group();
    grp.add(clone);
    return grp;
  }, [scene]);

  return (
    <group position={position} rotation={rotation}>
      <primitive object={carModel} />

      {/* Forward Headlight Beam Cones (Lightweight - No Shadow Pass) */}
      <spotLight
        position={[-0.8, 0.7, -2.4]}
        target-position={[-0.8, 0.2, -35]}
        angle={0.55}
        penumbra={0.4}
        intensity={24}
        color="#e0f2fe"
        distance={45}
      />
      <spotLight
        position={[0.8, 0.7, -2.4]}
        target-position={[0.8, 0.2, -35]}
        angle={0.55}
        penumbra={0.4}
        intensity={24}
        color="#e0f2fe"
        distance={45}
      />

      {/* Red LED Taillights with Volumetric Streaks */}
      <mesh position={[-0.75, 0.75, 2.3]}>
        <boxGeometry args={[0.35, 0.1, 0.05]} />
        <meshBasicMaterial color="#ff1133" />
      </mesh>
      <mesh position={[0.75, 0.75, 2.3]}>
        <boxGeometry args={[0.35, 0.1, 0.05]} />
        <meshBasicMaterial color="#ff1133" />
      </mesh>
      <pointLight position={[0, 0.75, 2.5]} intensity={8} color="#ff1133" distance={8} />

      {/* Neon Cyan Underglow */}
      <pointLight position={[0, 0.2, 0]} intensity={6} color="#06b6d4" distance={5} />
    </group>
  );
}

// ==============================================================
// 6. HIGH-PERFORMANCE CARBON SPORTS BIKE (Procedural PBR)
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
      <group position={[0, 0.45, -1.05]}>
        <mesh rotation={[0, 0, Math.PI / 2]} castShadow>
          <torusGeometry args={[0.42, 0.08, 12, 24]} />
          <meshStandardMaterial color="#0f172a" roughness={0.9} />
        </mesh>
        <mesh rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.34, 0.34, 0.04, 16]} />
          <meshStandardMaterial color="#1e293b" metalness={0.95} roughness={0.25} />
        </mesh>
      </group>

      <group position={[0, 0.45, 1.05]}>
        <mesh rotation={[0, 0, Math.PI / 2]} castShadow>
          <torusGeometry args={[0.42, 0.08, 12, 24]} />
          <meshStandardMaterial color="#0f172a" roughness={0.9} />
        </mesh>
        <mesh rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.34, 0.34, 0.04, 16]} />
          <meshStandardMaterial color="#1e293b" metalness={0.95} roughness={0.25} />
        </mesh>
      </group>

      <mesh position={[0, 0.72, 0]} castShadow>
        <boxGeometry args={[0.28, 0.42, 1.4]} />
        <meshStandardMaterial color="#090d16" metalness={0.9} roughness={0.2} />
      </mesh>

      <mesh position={[0, 0.95, -0.28]} rotation={[-0.15, 0, 0]} castShadow>
        <boxGeometry args={[0.36, 0.28, 0.75]} />
        <meshStandardMaterial color="#0284c7" metalness={0.8} roughness={0.2} />
      </mesh>

      <mesh position={[0, 0.95, -0.92]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.12, 0.12, 0.06, 16]} />
        <meshBasicMaterial color="#ffffff" />
      </mesh>
      <pointLight position={[0, 0.95, -1.0]} intensity={8} color="#ffffff" distance={12} />
    </group>
  );
}

// ==============================================================
// 7. PARIS BOULEVARD WITH WET REFLECTIVE PAVEMENT (Photo 3 Match!)
// ==============================================================
export function CityBoulevard() {
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

  const facadeTexture = useMemo(() => {
    if (typeof window === "undefined") return null;
    const loader = new THREE.TextureLoader();
    const tex = loader.load("/textures/haussmann_facade.jpg");
    tex.wrapS = THREE.RepeatWrapping;
    tex.wrapT = THREE.RepeatWrapping;
    tex.repeat.set(2, 2.5);
    tex.colorSpace = THREE.SRGBColorSpace;
    return tex;
  }, []);

  const buildings = useMemo(() => {
    const list: Array<{ x: number; z: number; w: number; h: number; d: number }> = [];
    for (let z = 120; z >= -60; z -= 24) {
      list.push({ x: -34, z, w: 18, h: 26 + (Math.abs(z) % 4) * 3, d: 22 });
      list.push({ x: 34, z, w: 18, h: 28 + (Math.abs(z) % 3) * 3, d: 22 });
    }
    return list;
  }, []);

  return (
    <group>
      <mesh position={[0, 0, 20]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[28, 220]} />
        <meshStandardMaterial
          map={cobblestoneTexture || undefined}
          color="#383028"
          roughness={0.22}
          metalness={0.75}
        />
      </mesh>

      <mesh position={[-19, 0.15, 20]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[10, 220]} />
        <meshStandardMaterial color="#475569" roughness={0.4} metalness={0.3} />
      </mesh>
      <mesh position={[19, 0.15, 20]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[10, 220]} />
        <meshStandardMaterial color="#475569" roughness={0.4} metalness={0.3} />
      </mesh>

      {/* Haussmann Buildings */}
      {buildings.map((b, idx) => (
        <group key={idx} position={[b.x, b.h / 2, b.z]}>
          <mesh castShadow receiveShadow>
            <boxGeometry args={[b.w, b.h, b.d]} />
            <meshStandardMaterial
              map={facadeTexture || undefined}
              color="#e2d4be"
              roughness={0.65}
              metalness={0.2}
            />
          </mesh>
          <mesh position={[0, b.h / 2 + 2.5, 0]}>
            <boxGeometry args={[b.w - 1.2, 5, b.d - 1.2]} />
            <meshStandardMaterial color="#334155" roughness={0.4} metalness={0.6} />
          </mesh>
        </group>
      ))}

      {/* Elevated Highway Freeway Ramp */}
      <group position={[0, 0, -20]}>
        <mesh position={[0, 4.5, -25]} rotation={[0.16, 0, 0]} receiveShadow>
          <boxGeometry args={[14, 1.2, 55]} />
          <meshStandardMaterial color="#1e293b" roughness={0.3} metalness={0.5} />
        </mesh>
      </group>
    </group>
  );
}

// ==============================================================
// 8. GTA VI DYNAMIC OCEAN SIMULATION (Optimized 72x72 Grid)
// ==============================================================
export function OceanWater() {
  const oceanMeshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (oceanMeshRef.current && (oceanMeshRef.current.material as THREE.ShaderMaterial).uniforms) {
      (oceanMeshRef.current.material as THREE.ShaderMaterial).uniforms.uTime.value = state.clock.elapsedTime;
    }
  });

  const waterMaterial = useMemo(() => {
    return new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0 },
        uDeepColor: { value: new THREE.Color("#022c43") },
        uSurfaceColor: { value: new THREE.Color("#0284c7") },
        uCrestColor: { value: new THREE.Color("#7dd3fc") },
        uSunDir: { value: new THREE.Vector3(0.5, 0.7, -0.5).normalize() },
      },
      vertexShader: `
        uniform float uTime;
        varying vec3 vNormal;
        varying vec3 vWorldPosition;
        varying float vWaveHeight;

        void main() {
          vec3 pos = position;

          float w1 = sin(pos.x * 0.035 + uTime * 1.6) * cos(pos.y * 0.035 + uTime * 1.4) * 0.85;
          float w2 = sin(pos.x * 0.08 - uTime * 2.2 + pos.y * 0.06) * 0.4;
          float elevation = w1 + w2;
          pos.z += elevation;
          vWaveHeight = elevation;

          vec4 worldPos = modelMatrix * vec4(pos, 1.0);
          vWorldPosition = worldPos.xyz;
          vNormal = normalize(normalMatrix * vec3(
            - (cos(pos.x * 0.035 + uTime * 1.6) * 0.035 * 0.85),
            - (cos(pos.y * 0.035 + uTime * 1.4) * 0.035 * 0.85),
            1.0
          ));

          gl_Position = projectionMatrix * viewMatrix * worldPos;
        }
      `,
      fragmentShader: `
        uniform vec3 uDeepColor;
        uniform vec3 uSurfaceColor;
        uniform vec3 uCrestColor;
        uniform vec3 uSunDir;
        varying vec3 vNormal;
        varying vec3 vWorldPosition;
        varying float vWaveHeight;

        void main() {
          vec3 viewDir = normalize(cameraPosition - vWorldPosition);
          vec3 norm = normalize(vNormal);

          float fresnel = pow(1.0 - max(dot(viewDir, norm), 0.0), 3.0);
          vec3 halfVector = normalize(uSunDir + viewDir);
          float spec = pow(max(dot(norm, halfVector), 0.0), 80.0) * 2.2;

          float mixWave = smoothstep(-1.0, 1.0, vWaveHeight);
          vec3 waterCol = mix(uDeepColor, uSurfaceColor, mixWave);
          waterCol = mix(waterCol, uCrestColor, fresnel * 0.65);
          waterCol += vec3(1.0, 0.95, 0.8) * spec;

          gl_FragColor = vec4(waterCol, 0.94);
        }
      `,
      transparent: true,
      side: THREE.DoubleSide,
    });
  }, []);

  return (
    <group position={[0, -0.15, -340]}>
      {/* Optimized 72x72 Grid for 60 FPS */}
      <mesh
        ref={oceanMeshRef}
        rotation={[-Math.PI / 2, 0, 0]}
        material={waterMaterial}
      >
        <planeGeometry args={[1600, 950, 72, 72]} />
      </mesh>

      {/* Coastal City Skylines on Both Shores */}
      {[-170, 170].map((shoreX) => (
        <group key={shoreX} position={[shoreX, 0, 0]}>
          {Array.from({ length: 20 }).map((_, i) => {
            const h = 32 + (i % 6) * 16;
            const w = 20 + (i % 3) * 8;
            const z = 420 - i * 42;
            return (
              <group key={i} position={[0, h / 2, z]}>
                <mesh>
                  <boxGeometry args={[w, h, w]} />
                  <meshStandardMaterial
                    color="#0f172a"
                    roughness={0.15}
                    metalness={0.85}
                  />
                </mesh>
                <mesh position={[shoreX > 0 ? -w / 2 - 0.1 : w / 2 + 0.1, 0, 0]}>
                  <planeGeometry args={[w * 0.85, h * 0.85]} />
                  <meshStandardMaterial
                    color="#38bdf8"
                    emissive="#0284c7"
                    emissiveIntensity={0.25}
                    roughness={0.05}
                  />
                </mesh>
              </group>
            );
          })}
        </group>
      ))}
    </group>
  );
}

// ==============================================================
// 9. ULTRA-HIGH-DETAIL OFFSHORE RACING SPEEDBOAT (Photo 2 & 5)
// ==============================================================
export function Speedboat() {
  const propRef1 = useRef<THREE.Group>(null);
  const propRef2 = useRef<THREE.Group>(null);

  useFrame((state) => {
    const spin = state.clock.elapsedTime * 45;
    if (propRef1.current) propRef1.current.rotation.z = spin;
    if (propRef2.current) propRef2.current.rotation.z = -spin;
  });

  return (
    <group>
      <group position={[0, 0.45, 0]}>
        <mesh position={[0, 0.1, 0]} castShadow>
          <boxGeometry args={[3.4, 1.4, 8.4]} />
          <meshStandardMaterial color="#f8fafc" roughness={0.08} metalness={0.2} />
        </mesh>

        <mesh position={[0, 0.1, -4.8]} rotation={[0, Math.PI / 4, 0]} castShadow>
          <boxGeometry args={[2.4, 1.4, 2.4]} />
          <meshStandardMaterial color="#f8fafc" roughness={0.08} metalness={0.2} />
        </mesh>

        <mesh position={[0, 0.45, 0]}>
          <boxGeometry args={[3.45, 0.35, 8.2]} />
          <meshStandardMaterial color="#0284c7" roughness={0.15} metalness={0.6} />
        </mesh>
        <mesh position={[0, 0.82, -0.6]}>
          <boxGeometry args={[1.2, 0.08, 6.4]} />
          <meshStandardMaterial color="#f97316" roughness={0.2} />
        </mesh>

        {/* Wraparound Windshield */}
        <group position={[0, 1.35, -1.2]}>
          <mesh rotation={[-0.48, 0, 0]}>
            <boxGeometry args={[2.8, 0.85, 0.06]} />
            <meshStandardMaterial color="#0284c7" roughness={0.05} metalness={0.9} transparent opacity={0.8} />
          </mesh>
        </group>

        {/* Cockpit Seats */}
        <group position={[0, 0.9, 0.5]}>
          <mesh position={[-0.7, 0.3, 0]}>
            <boxGeometry args={[0.8, 0.7, 0.8]} />
            <meshStandardMaterial color="#0f172a" roughness={0.7} />
          </mesh>
          <mesh position={[0.7, 0.3, 0]}>
            <boxGeometry args={[0.8, 0.7, 0.8]} />
            <meshStandardMaterial color="#0f172a" roughness={0.7} />
          </mesh>
        </group>

        {/* Seated Pilot Figure */}
        <group position={[-0.7, 1.35, 0.4]}>
          <mesh position={[0, 0.45, 0]}>
            <boxGeometry args={[0.65, 0.8, 0.5]} />
            <meshStandardMaterial color="#f8fafc" roughness={0.8} />
          </mesh>
          <mesh position={[0, 1.05, 0]}>
            <sphereGeometry args={[0.26, 12, 12]} />
            <meshStandardMaterial color="#0f172a" />
          </mesh>
        </group>

        {/* Twin Outboard Racing Engines */}
        {[-0.95, 0.95].map((engineX, eIdx) => (
          <group key={eIdx} position={[engineX, 0.55, 4.9]}>
            <mesh castShadow>
              <boxGeometry args={[0.6, 1.25, 0.9]} />
              <meshStandardMaterial color="#090d16" metalness={0.9} roughness={0.15} />
            </mesh>
            <mesh position={[0, 0.3, 0.46]}>
              <boxGeometry args={[0.4, 0.15, 0.05]} />
              <meshBasicMaterial color="#ef4444" />
            </mesh>
            <group ref={eIdx === 0 ? propRef1 : propRef2} position={[0, -1.1, 0.4]}>
              <mesh rotation={[Math.PI / 2, 0, 0]}>
                <cylinderGeometry args={[0.08, 0.08, 0.2, 8]} />
                <meshStandardMaterial color="#d97706" metalness={0.98} />
              </mesh>
              {[0, (Math.PI * 2) / 3, (Math.PI * 4) / 3].map((angle, bIdx) => (
                <mesh key={bIdx} rotation={[0, 0, angle]}>
                  <boxGeometry args={[0.55, 0.12, 0.03]} />
                  <meshStandardMaterial color="#b45309" metalness={0.95} roughness={0.15} />
                </mesh>
              ))}
            </group>
          </group>
        ))}
      </group>

      {/* Foamy V-Wake (Photo 2 Match!) */}
      <mesh position={[0, 0.08, 9]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[4.2, 16]} />
        <meshBasicMaterial color="#ffffff" transparent opacity={0.85} />
      </mesh>
      <mesh position={[0, 0.06, 26]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[9.5, 34]} />
        <meshBasicMaterial color="#e0f2fe" transparent opacity={0.55} />
      </mesh>
    </group>
  );
}

// ==============================================================
// 10. REAL RESUME FLOATING BARGE BILLBOARDS
// ==============================================================
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

  const bgGrad = ctx.createLinearGradient(0, 0, 0, 680);
  bgGrad.addColorStop(0, "#030712");
  bgGrad.addColorStop(1, "#0b0f19");
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, 1024, 680);

  const stripGrad = ctx.createLinearGradient(0, 0, 1024, 0);
  stripGrad.addColorStop(0, "#38bdf8");
  stripGrad.addColorStop(0.5, "#a855f7");
  stripGrad.addColorStop(1, "#f59e0b");
  ctx.fillStyle = stripGrad;
  ctx.fillRect(0, 0, 1024, 12);

  ctx.fillStyle = "#38bdf8";
  ctx.font = "bold 20px monospace";
  ctx.fillText(project.step, 48, 55);

  ctx.fillStyle = "#cbd5e1";
  ctx.font = "bold 16px monospace";
  ctx.fillText("CHANDRAGIRI BALAJI // PRODUCTION SYSTEM", 580, 55);

  ctx.strokeStyle = "rgba(56, 189, 248, 0.35)";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(48, 76);
  ctx.lineTo(976, 76);
  ctx.stroke();

  ctx.fillStyle = "#ffffff";
  ctx.font = "900 38px system-ui, sans-serif";
  ctx.shadowColor = "rgba(56, 189, 248, 0.9)";
  ctx.shadowBlur = 20;
  ctx.fillText(project.title, 48, 135);
  ctx.shadowBlur = 0;

  ctx.fillStyle = "#02040a";
  ctx.fillRect(48, 168, 928, 140);
  ctx.strokeStyle = "rgba(56, 189, 248, 0.5)";
  ctx.lineWidth = 1.5;
  ctx.strokeRect(48, 168, 928, 140);

  ctx.fillStyle = "#a5f3fc";
  ctx.font = "19px monospace";
  const lines = project.codePreview.split("\n");
  lines.forEach((l, i) => {
    ctx.fillText(l, 68, 212 + i * 34);
  });

  ctx.fillStyle = "#e2e8f0";
  ctx.font = "21px system-ui, sans-serif";
  const words = project.desc.split(" ");
  let curLine = "";
  let curY = 356;
  for (let n = 0; n < words.length; n++) {
    const testLine = curLine + words[n] + " ";
    const metrics = ctx.measureText(testLine);
    if (metrics.width > 920 && n > 0) {
      ctx.fillText(curLine, 48, curY);
      curLine = words[n] + " ";
      curY += 32;
    } else {
      curLine = testLine;
    }
  }
  ctx.fillText(curLine, 48, curY);

  let pillX = 48;
  const pillY = 478;
  ctx.font = "bold 17px monospace";
  project.pills.forEach((pill) => {
    const w = ctx.measureText(pill).width + 32;
    ctx.fillStyle = "rgba(56, 189, 248, 0.15)";
    ctx.fillRect(pillX, pillY, w, 40);
    ctx.strokeStyle = "#38bdf8";
    ctx.lineWidth = 1.5;
    ctx.strokeRect(pillX, pillY, w, 40);
    ctx.fillStyle = "#e0f2fe";
    ctx.fillText(pill, pillX + 16, pillY + 26);
    pillX += w + 16;
  });

  ctx.fillStyle = "#ffffff";
  ctx.fillRect(48, 565, 340, 54);
  ctx.fillStyle = "#000000";
  ctx.font = "900 18px monospace";
  ctx.fillText("CLICK TO INSPECT CASE STUDY →", 68, 600);

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.needsUpdate = true;
  return texture;
}

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
      <mesh position={[0, 0.8, 0]} castShadow>
        <boxGeometry args={[36, 1.8, 14]} />
        <meshStandardMaterial color="#991b1b" roughness={0.4} metalness={0.6} />
      </mesh>

      <mesh position={[0, 1.6, 7.05]}>
        <boxGeometry args={[36, 0.25, 0.1]} />
        <meshStandardMaterial color="#eab308" roughness={0.3} />
      </mesh>

      {[-16, 16].map((sx, idx) => (
        <group key={idx} position={[sx, 12, 0]}>
          <mesh castShadow>
            <cylinderGeometry args={[0.35, 0.45, 22, 8]} />
            <meshStandardMaterial color="#334155" metalness={0.95} roughness={0.2} />
          </mesh>
        </group>
      ))}

      <mesh position={[0, 12, 0.5]}>
        <boxGeometry args={[28.4, 18.4, 0.2]} />
        <meshBasicMaterial color="#38bdf8" />
      </mesh>

      <pointLight position={[0, 12, 4]} intensity={4.5} distance={50} color="#38bdf8" />

      <mesh position={[0, 12, -0.1]} rotation={[0, Math.PI, 0]}>
        <planeGeometry args={[28, 18]} />
        <meshStandardMaterial color="#0b0f19" roughness={0.8} />
      </mesh>

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
