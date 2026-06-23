"use client";

import { useRef, useState, useEffect, useMemo } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { PointerLockControls, Text, Stars } from "@react-three/drei";
import * as THREE from "three";
import type { PointerLockControls as PLCImpl } from "three-stdlib";

export interface Project {
  slug: string;
  title: string;
  category: string;
  description: string;
  color: string;
  position: [number, number, number];
  buildingHeight: number;
  buildingWidth: number;
}

export const PROJECTS: Project[] = [
  {
    slug: "cuekit",
    title: "CueKit",
    category: "UX Design · Senior Degree Project",
    description: "A mental readiness journal and cue system for college volleyball athletes — end-to-end from research to high-fidelity prototype.",
    color: "#7F77DD",
    position: [12, 0, -18],
    buildingHeight: 14,
    buildingWidth: 16,
  },
  {
    slug: "speaksynci-ai",
    title: "SpeakSyncAI",
    category: "UX Design · Concept App",
    description: "Real-time lecture transcription and AI summaries for deaf and hard-of-hearing students. Accessibility-first design.",
    color: "#378ADD",
    position: [-12, 0, -36],
    buildingHeight: 10,
    buildingWidth: 14,
  },
  {
    slug: "mu-luxembourg",
    title: "MU Luxembourg",
    category: "UI Design · WordPress",
    description: "Donation-focused foundation website with responsive layouts guiding visitors to the donate flow.",
    color: "#E24B4A",
    position: [12, 0, -54],
    buildingHeight: 16,
    buildingWidth: 18,
  },
  {
    slug: "interactive-yearbook",
    title: "Fourward",
    category: "Interaction Design · HCI",
    description: "A digital platform reimagining yearbooks as personalized multimedia experiences, built during HCI at Korea University.",
    color: "#1D9E75",
    position: [-12, 0, -72],
    buildingHeight: 11,
    buildingWidth: 14,
  },
  {
    slug: "academic-advising",
    title: "Academic Advising",
    category: "Service Design",
    description: "Identified communication breakdowns in Miami's advising process and prototyped a Canvas + Navigate integration.",
    color: "#BA7517",
    position: [12, 0, -90],
    buildingHeight: 9,
    buildingWidth: 13,
  },
  {
    slug: "spokenote",
    title: "Spokenote",
    category: "Visual Design · Marketing",
    description: "Use case illustrations across product pages using Photoshop and Illustrator, communicating Spokenote to customers.",
    color: "#9F7AEA",
    position: [-12, 0, -108],
    buildingHeight: 12,
    buildingWidth: 15,
  },
];

// Proximity threshold to interact with buildings
const INTERACT_DIST = 14;

function useKeys() {
  const keys = useRef({ w: false, a: false, s: false, d: false });
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.code === "KeyW" || e.code === "ArrowUp")    keys.current.w = true;
      if (e.code === "KeyS" || e.code === "ArrowDown")  keys.current.s = true;
      if (e.code === "KeyA" || e.code === "ArrowLeft")  keys.current.a = true;
      if (e.code === "KeyD" || e.code === "ArrowRight") keys.current.d = true;
    };
    const up = (e: KeyboardEvent) => {
      if (e.code === "KeyW" || e.code === "ArrowUp")    keys.current.w = false;
      if (e.code === "KeyS" || e.code === "ArrowDown")  keys.current.s = false;
      if (e.code === "KeyA" || e.code === "ArrowLeft")  keys.current.a = false;
      if (e.code === "KeyD" || e.code === "ArrowRight") keys.current.d = false;
    };
    window.addEventListener("keydown", down);
    window.addEventListener("keyup", up);
    return () => {
      window.removeEventListener("keydown", down);
      window.removeEventListener("keyup", up);
    };
  }, []);
  return keys;
}

function PlayerController({ controlsRef }: { controlsRef: React.RefObject<PLCImpl | null> }) {
  const keys = useKeys();
  const { camera } = useThree();
  const velocity = useRef(new THREE.Vector3());
  const direction = useRef(new THREE.Vector3());
  const bobTime = useRef(0);
  const moving = useRef(false);

  useFrame((_, delta) => {
    if (!controlsRef.current?.isLocked) return;

    // Friction — slightly lower than before for a smoother glide feel
    const friction = 8;
    velocity.current.x = THREE.MathUtils.damp(velocity.current.x, 0, friction, delta);
    velocity.current.z = THREE.MathUtils.damp(velocity.current.z, 0, friction, delta);

    direction.current.set(
      (keys.current.d ? 1 : 0) - (keys.current.a ? 1 : 0),
      0,
      (keys.current.w ? 1 : 0) - (keys.current.s ? 1 : 0),
    );
    if (direction.current.length() > 0) direction.current.normalize();

    const speed = 25; // natural walking pace
    if (keys.current.w || keys.current.s) velocity.current.z -= direction.current.z * speed * delta;
    if (keys.current.a || keys.current.d) velocity.current.x -= direction.current.x * speed * delta;

    moving.current = Math.abs(velocity.current.x) + Math.abs(velocity.current.z) > 0.05;

    controlsRef.current.moveRight(-velocity.current.x * delta);
    controlsRef.current.moveForward(-velocity.current.z * delta);

    // Subtle head bob when walking
    if (moving.current) {
      bobTime.current += delta * 7;
      camera.position.y = 1.8 + Math.sin(bobTime.current) * 0.04;
    } else {
      // Smoothly return to eye level
      camera.position.y = THREE.MathUtils.damp(camera.position.y, 1.8, 10, delta);
    }

    camera.position.x = THREE.MathUtils.clamp(camera.position.x, -6, 6);
    camera.position.z = THREE.MathUtils.clamp(camera.position.z, -120, 6);
  });

  return null;
}

// Memoize window layout so random pattern is stable across re-renders
function Windows({ width, height, depth, color }: {
  width: number; height: number; depth: number; color: string;
}) {
  const layout = useMemo(() => {
    const cols = Math.floor(width / 3.5);
    const rows = Math.floor((height - 2) / 3);
    const out: { x: number; y: number; lit: boolean; key: string }[] = [];
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        out.push({
          x: -width / 2 + 2 + c * (width / cols),
          y: 2 + r * 3 + 1.2,
          lit: Math.random() > 0.3,
          key: `${r}-${c}`,
        });
      }
    }
    return out;
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [width, height]);

  return (
    <>
      {layout.map(({ x, y, lit, key }) => (
        <mesh key={key} position={[x, y, -depth / 2 - 0.05]}>
          <planeGeometry args={[1.4, 1.8]} />
          <meshStandardMaterial
            color={lit ? color : "#080810"}
            emissive={lit ? color : "#000000"}
            emissiveIntensity={lit ? 1.2 : 0}
            roughness={0.1}
            metalness={0.1}
          />
        </mesh>
      ))}
    </>
  );
}

function Building({ project, onSelect }: {
  project: Project;
  onSelect: (p: Project) => void;
}) {
  const [hovered, setHovered] = useState(false);
  const { camera } = useThree();
  const distRef = useRef(9999);
  const [near, setNear] = useState(false);

  useFrame(() => {
    const dx = camera.position.x - project.position[0];
    const dz = camera.position.z - project.position[2];
    const d = Math.sqrt(dx * dx + dz * dz);
    distRef.current = d;
    const isNear = d < INTERACT_DIST;
    if (isNear !== near) setNear(isNear);
  });

  const w = project.buildingWidth;
  const h = project.buildingHeight;
  const d = 8;

  // Physical light values — Three.js r155+ uses candelas for point lights.
  // Sign glow: ~60 cd, boosted to ~120 cd on hover. Ground wash: ~20/40 cd.
  const signIntensity  = hovered ? 120 : 60;
  const glowIntensity  = hovered ? 40  : 18;

  return (
    <group position={project.position}>
      {/* Main body */}
      <mesh
        position={[0, h / 2, 0]}
        onClick={() => { if (near) onSelect(project); }}
        onPointerEnter={() => setHovered(true)}
        onPointerLeave={() => setHovered(false)}
      >
        <boxGeometry args={[w, h, d]} />
        <meshStandardMaterial
          color={hovered && near ? "#1e1e34" : "#0f0f1a"}
          roughness={0.85}
          metalness={0.05}
        />
      </mesh>

      {/* Ground floor storefront — slightly lighter face */}
      <mesh position={[0, 1.5, -d / 2 + 0.01]}>
        <planeGeometry args={[w, 3]} />
        <meshStandardMaterial color="#111120" roughness={0.8} />
      </mesh>

      {/* Door opening */}
      <mesh position={[0, 1.2, -d / 2 - 0.05]}>
        <planeGeometry args={[2.5, 3]} />
        <meshStandardMaterial color="#050508" />
      </mesh>

      {/* Windows */}
      <Windows width={w} height={h} depth={d} color={project.color} />

      {/* Neon sign */}
      <Text
        position={[0, h + 0.8, -d / 2 + 0.1]}
        fontSize={0.9}
        color={project.color}
        anchorX="center"
        anchorY="middle"
        maxWidth={w - 1}
      >
        {project.title.toUpperCase()}
      </Text>

      {/* Sign point light — physical units (candelas) */}
      <pointLight
        position={[0, h + 0.8, -d / 2 + 1.5]}
        color={project.color}
        intensity={signIntensity}
        distance={22}
        decay={2}
      />

      {/* Ground color wash */}
      <pointLight
        position={[0, 0.3, -d / 2 + 1]}
        color={project.color}
        intensity={glowIntensity}
        distance={12}
        decay={2}
      />

      {/* Proximity prompt — only appears when close enough to interact */}
      {near && (
        <Text
          position={[0, 3.5, -d / 2 + 0.2]}
          fontSize={0.55}
          color="white"
          anchorX="center"
          anchorY="middle"
          fillOpacity={0.9}
        >
          {`[ click to open ]`}
        </Text>
      )}
    </group>
  );
}

function Streetlight({ z }: { z: number }) {
  // Alternate sides every streetlight for realism
  const side = ((z / 15) % 2 === 0) ? 1 : -1;
  // Physical point light: a real sodium street lamp is ~100–200 cd
  return (
    <group position={[side * 6.2, 0, z]}>
      {/* Pole */}
      <mesh position={[0, 4, 0]}>
        <boxGeometry args={[0.12, 8, 0.12]} />
        <meshStandardMaterial color="#1e1e30" roughness={0.9} />
      </mesh>
      {/* Arm */}
      <mesh position={[side * -1.2, 7.85, 0]}>
        <boxGeometry args={[2.4, 0.1, 0.1]} />
        <meshStandardMaterial color="#1e1e30" roughness={0.9} />
      </mesh>
      {/* Lamp housing */}
      <mesh position={[side * -2.4, 7.7, 0]}>
        <boxGeometry args={[0.6, 0.25, 0.6]} />
        <meshStandardMaterial color="#111118" roughness={0.8} />
      </mesh>
      {/* Glowing bulb */}
      <mesh position={[side * -2.4, 7.52, 0]}>
        <sphereGeometry args={[0.15, 8, 8]} />
        <meshStandardMaterial
          color="#fffbe8"
          emissive="#fffbe8"
          emissiveIntensity={3}
        />
      </mesh>
      {/* Physical point light — warm sodium yellow, ~150 cd */}
      <pointLight
        position={[side * -2.4, 7.3, 0]}
        color="#ffedb0"
        intensity={150}
        distance={28}
        decay={2}
      />
    </group>
  );
}

function Ground() {
  return (
    <>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, -60]}>
        <planeGeometry args={[200, 200]} />
        <meshStandardMaterial color="#07070f" roughness={0.98} metalness={0} />
      </mesh>
      {/* Street */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, -60]}>
        <planeGeometry args={[10.2, 200]} />
        <meshStandardMaterial color="#0c0c18" roughness={0.92} metalness={0.02} />
      </mesh>
      {/* Center dashes */}
      {[-10, -28, -46, -64, -82, -100].map((z) => (
        <mesh key={z} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, z]}>
          <planeGeometry args={[0.15, 6]} />
          <meshStandardMaterial color="#29294a" roughness={0.8} />
        </mesh>
      ))}
      {/* Sidewalks */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[-8.5, 0.01, -60]}>
        <planeGeometry args={[5, 200]} />
        <meshStandardMaterial color="#0a0a16" roughness={0.95} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[8.5, 0.01, -60]}>
        <planeGeometry args={[5, 200]} />
        <meshStandardMaterial color="#0a0a16" roughness={0.95} />
      </mesh>
      {/* Curbs */}
      <mesh position={[-5.15, 0.12, -60]}>
        <boxGeometry args={[0.3, 0.24, 200]} />
        <meshStandardMaterial color="#111125" roughness={0.9} />
      </mesh>
      <mesh position={[5.15, 0.12, -60]}>
        <boxGeometry args={[0.3, 0.24, 200]} />
        <meshStandardMaterial color="#111125" roughness={0.9} />
      </mesh>
    </>
  );
}

export function CityScene({
  onSelectProject,
  controlsRef,
}: {
  onSelectProject: (p: Project) => void;
  controlsRef: React.RefObject<PLCImpl | null>;
}) {
  return (
    <>
      <fog attach="fog" args={["#05050f", 25, 100]} />
      <color attach="background" args={["#05050f"]} />

      {/* Ambient fill — low but non-zero so nothing is pitch black */}
      <ambientLight intensity={0.6} />
      {/* Cool moonlight directional fill */}
      <directionalLight
        position={[10, 30, 20]}
        intensity={0.4}
        color="#9999cc"
      />
      {/* Warm ground bounce — subtly fills shadowed faces from below */}
      <hemisphereLight args={["#1a1a3a", "#0a0a10", 0.3]} />

      <Stars radius={90} depth={50} count={4000} factor={3} saturation={0} fade />

      <Ground />

      {[-5, -20, -35, -50, -65, -80, -95, -110].map((z) => (
        <Streetlight key={z} z={z} />
      ))}

      {PROJECTS.map((p) => (
        <Building key={p.slug} project={p} onSelect={onSelectProject} />
      ))}

      <PointerLockControls ref={controlsRef} />
      <PlayerController controlsRef={controlsRef} />
    </>
  );
}
