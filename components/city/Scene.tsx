"use client";

import { useRef, useState, useEffect, useMemo } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { PointerLockControls, Text, Sky } from "@react-three/drei";
import * as THREE from "three";
import type { PointerLockControls as PLCImpl } from "three-stdlib";

export interface Project {
  slug: string;
  title: string;
  category: string;
  description: string;
  color: string;   // accent (sign / awning / trim)
  facade: string;  // light building wall color
  position: [number, number, number];
  buildingHeight: number;
  buildingWidth: number;
}

// Ring radius the buildings sit on, centered on the plaza
const RING = 24;

// Helper: a point on the ring at a given degree (0 = straight ahead / -z)
function ring(deg: number): [number, number, number] {
  const r = (deg * Math.PI) / 180;
  return [RING * Math.sin(r), 0, -RING * Math.cos(r)];
}

export const PROJECTS: Project[] = [
  {
    slug: "cuekit",
    title: "CueKit",
    category: "UX Design · Senior Degree Project",
    description: "A mental readiness journal and cue system for college volleyball athletes — end-to-end from research to high-fidelity prototype.",
    color: "#7F77DD",
    facade: "#e9e7f6",
    position: ring(0),     // straight ahead
    buildingHeight: 15,
    buildingWidth: 15,
  },
  {
    slug: "mu-luxembourg",
    title: "MU Luxembourg",
    category: "UI Design · WordPress",
    description: "Donation-focused foundation website with responsive layouts guiding visitors to the donate flow.",
    color: "#E24B4A",
    facade: "#f6e7e5",
    position: ring(60),    // front-right
    buildingHeight: 17,
    buildingWidth: 16,
  },
  {
    slug: "academic-advising",
    title: "Academic Advising",
    category: "Service Design",
    description: "Identified communication breakdowns in Miami's advising process and prototyped a Canvas + Navigate integration.",
    color: "#BA7517",
    facade: "#f6efe1",
    position: ring(120),   // back-right
    buildingHeight: 12,
    buildingWidth: 14,
  },
  {
    slug: "spokenote",
    title: "Spokenote",
    category: "Visual Design · Marketing",
    description: "Use case illustrations across product pages using Photoshop and Illustrator, communicating Spokenote to customers.",
    color: "#9F7AEA",
    facade: "#f0e9f8",
    position: ring(180),   // directly behind
    buildingHeight: 14,
    buildingWidth: 15,
  },
  {
    slug: "interactive-yearbook",
    title: "Fourward",
    category: "Interaction Design · HCI",
    description: "A digital platform reimagining yearbooks as personalized multimedia experiences, built during HCI at Korea University.",
    color: "#1D9E75",
    facade: "#e5f3eb",
    position: ring(240),   // back-left
    buildingHeight: 13,
    buildingWidth: 14,
  },
  {
    slug: "speaksynci-ai",
    title: "SpeakSyncAI",
    category: "UX Design · Concept App",
    description: "Real-time lecture transcription and AI summaries for deaf and hard-of-hearing students. Accessibility-first design.",
    color: "#378ADD",
    facade: "#e3eef8",
    position: ring(300),   // front-left
    buildingHeight: 16,
    buildingWidth: 16,
  },
];

// How close (to a building's center) you must be to interact
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

  useFrame((_, delta) => {
    if (!controlsRef.current?.isLocked) return;

    const d = Math.min(delta, 0.05); // clamp big frame gaps

    const friction = 8;
    velocity.current.x = THREE.MathUtils.damp(velocity.current.x, 0, friction, d);
    velocity.current.z = THREE.MathUtils.damp(velocity.current.z, 0, friction, d);

    direction.current.set(
      (keys.current.d ? 1 : 0) - (keys.current.a ? 1 : 0),
      0,
      (keys.current.w ? 1 : 0) - (keys.current.s ? 1 : 0),
    );
    if (direction.current.length() > 0) direction.current.normalize();

    const speed = 26;
    if (keys.current.w || keys.current.s) velocity.current.z -= direction.current.z * speed * d;
    if (keys.current.a || keys.current.d) velocity.current.x -= direction.current.x * speed * d;

    controlsRef.current.moveRight(-velocity.current.x * d);
    controlsRef.current.moveForward(-velocity.current.z * d);

    const moving = Math.abs(velocity.current.x) + Math.abs(velocity.current.z) > 0.05;
    if (moving) {
      bobTime.current += d * 7;
      camera.position.y = 1.8 + Math.sin(bobTime.current) * 0.04;
    } else {
      camera.position.y = THREE.MathUtils.damp(camera.position.y, 1.8, 10, d);
    }

    // Keep the player inside the plaza, out of the fountain
    const r = Math.hypot(camera.position.x, camera.position.z);
    if (r > 20) {
      camera.position.x *= 20 / r;
      camera.position.z *= 20 / r;
    } else if (r < 3.8 && r > 0.001) {
      camera.position.x *= 3.8 / r;
      camera.position.z *= 3.8 / r;
    }
  });

  return null;
}

// A grid of window panes on one face. orientation: "front" (-z) or "side" (±x)
function WindowGrid({
  faceWidth, height, color, transform,
}: {
  faceWidth: number;
  height: number;
  color: string;
  transform: { pos: [number, number, number]; rotY: number };
}) {
  const panes = useMemo(() => {
    const cols = Math.max(2, Math.floor(faceWidth / 3.2));
    const rows = Math.max(2, Math.floor((height - 4) / 2.8));
    const out: { x: number; y: number; lit: boolean; key: string }[] = [];
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        out.push({
          x: -faceWidth / 2 + (faceWidth / cols) * (c + 0.5),
          y: 4 + r * 2.8,
          lit: Math.random() > 0.55,
          key: `${r}-${c}`,
        });
      }
    }
    return out;
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [faceWidth, height]);

  return (
    <group position={transform.pos} rotation={[0, transform.rotY, 0]}>
      {panes.map(({ x, y, lit, key }) => (
        <mesh key={key} position={[x, y, 0]}>
          <planeGeometry args={[1.6, 1.9]} />
          <meshStandardMaterial
            color={lit ? "#bfe2ff" : "#9fb8d4"}
            emissive={lit ? color : "#000000"}
            emissiveIntensity={lit ? 0.25 : 0}
            roughness={0.15}
            metalness={0.4}
          />
        </mesh>
      ))}
    </group>
  );
}

function Building({ project, onSelect }: {
  project: Project;
  onSelect: (p: Project) => void;
}) {
  const [hovered, setHovered] = useState(false);
  const { camera } = useThree();
  const [near, setNear] = useState(false);

  useFrame(() => {
    const dx = camera.position.x - project.position[0];
    const dz = camera.position.z - project.position[2];
    const isNear = Math.sqrt(dx * dx + dz * dz) < INTERACT_DIST;
    if (isNear !== near) setNear(isNear);
  });

  const w = project.buildingWidth;
  const h = project.buildingHeight;
  const d = 9;
  const [px, , pz] = project.position;
  // Rotate so the front face (door/sign/windows on local -z) faces plaza center
  const rotY = Math.atan2(px, pz);

  return (
    <group position={[px, 0, pz]} rotation={[0, rotY, 0]}>
      {/* Main body */}
      <mesh
        position={[0, h / 2, 0]}
        castShadow
        receiveShadow
        onClick={() => { if (near) onSelect(project); }}
        onPointerEnter={() => setHovered(true)}
        onPointerLeave={() => setHovered(false)}
      >
        <boxGeometry args={[w, h, d]} />
        <meshStandardMaterial
          color={project.facade}
          roughness={0.7}
          metalness={0.05}
        />
      </mesh>

      {/* Colored cornice / parapet across the top */}
      <mesh position={[0, h + 0.4, 0]} castShadow>
        <boxGeometry args={[w + 0.5, 0.8, d + 0.5]} />
        <meshStandardMaterial color={project.color} roughness={0.5} metalness={0.1} />
      </mesh>

      {/* Roof slab */}
      <mesh position={[0, h + 0.85, 0]}>
        <boxGeometry args={[w - 1, 0.4, d - 1]} />
        <meshStandardMaterial color="#3a3a48" roughness={0.9} />
      </mesh>

      {/* Storefront band */}
      <mesh position={[0, 2, -d / 2 - 0.01]}>
        <planeGeometry args={[w, 4]} />
        <meshStandardMaterial color="#2c2c3a" roughness={0.6} metalness={0.2} />
      </mesh>

      {/* Awning in the project color */}
      <mesh position={[0, 4, -d / 2 - 0.9]} rotation={[Math.PI / 2.6, 0, 0]} castShadow>
        <boxGeometry args={[w * 0.7, 1.8, 0.15]} />
        <meshStandardMaterial color={project.color} roughness={0.6} />
      </mesh>

      {/* Glass door */}
      <mesh position={[0, 1.6, -d / 2 - 0.02]}>
        <planeGeometry args={[3, 3.2]} />
        <meshStandardMaterial color="#1a2433" roughness={0.1} metalness={0.6} />
      </mesh>

      {/* Windows — front + both sides */}
      <WindowGrid faceWidth={w} height={h} color={project.color}
        transform={{ pos: [0, 0, -d / 2 - 0.05], rotY: 0 }} />
      <WindowGrid faceWidth={d} height={h} color={project.color}
        transform={{ pos: [-w / 2 - 0.05, 0, 0], rotY: -Math.PI / 2 }} />
      <WindowGrid faceWidth={d} height={h} color={project.color}
        transform={{ pos: [w / 2 + 0.05, 0, 0], rotY: Math.PI / 2 }} />

      {/* Neon-ish sign on the storefront band */}
      <Text
        position={[0, 4.4, -d / 2 - 0.1]}
        fontSize={0.95}
        color={project.color}
        anchorX="center"
        anchorY="middle"
        maxWidth={w - 1}
        outlineWidth={0.04}
        outlineColor="#ffffff"
      >
        {project.title.toUpperCase()}
      </Text>

      {/* Soft sign light (gentle in daylight) */}
      <pointLight
        position={[0, 5, -d / 2 - 1.5]}
        color={project.color}
        intensity={hovered ? 30 : 12}
        distance={14}
        decay={2}
      />

      {/* Proximity prompt — only when close enough to click */}
      {near && (
        <Text
          position={[0, h + 2, -d / 2 - 0.2]}
          fontSize={0.7}
          color="#1b1b2a"
          anchorX="center"
          anchorY="middle"
          outlineWidth={0.05}
          outlineColor="#ffffff"
        >
          {`[ click to open ]`}
        </Text>
      )}
    </group>
  );
}

function Tree({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      <mesh position={[0, 1.3, 0]} castShadow>
        <cylinderGeometry args={[0.25, 0.35, 2.6, 6]} />
        <meshStandardMaterial color="#6b4b32" roughness={0.9} />
      </mesh>
      <mesh position={[0, 3.4, 0]} castShadow>
        <coneGeometry args={[1.7, 3.2, 8]} />
        <meshStandardMaterial color="#3f8f4f" roughness={0.85} />
      </mesh>
      <mesh position={[0, 4.6, 0]} castShadow>
        <coneGeometry args={[1.2, 2.4, 8]} />
        <meshStandardMaterial color="#4aa05c" roughness={0.85} />
      </mesh>
    </group>
  );
}

function Fountain() {
  return (
    <group position={[0, 0, 0]}>
      {/* Outer basin wall */}
      <mesh position={[0, 0.4, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[3, 3.2, 0.8, 32]} />
        <meshStandardMaterial color="#cfc8ba" roughness={0.8} />
      </mesh>
      {/* Water */}
      <mesh position={[0, 0.55, 0]}>
        <cylinderGeometry args={[2.7, 2.7, 0.3, 32]} />
        <meshStandardMaterial color="#5fa8d6" roughness={0.1} metalness={0.3} transparent opacity={0.85} />
      </mesh>
      {/* Center pedestal */}
      <mesh position={[0, 1.1, 0]} castShadow>
        <cylinderGeometry args={[0.5, 0.7, 1.6, 12]} />
        <meshStandardMaterial color="#cfc8ba" roughness={0.8} />
      </mesh>
      {/* Top bowl */}
      <mesh position={[0, 1.95, 0]} castShadow>
        <cylinderGeometry args={[1, 0.4, 0.4, 16]} />
        <meshStandardMaterial color="#cfc8ba" roughness={0.8} />
      </mesh>
    </group>
  );
}

function Cloud({ position, scale = 1 }: { position: [number, number, number]; scale?: number }) {
  return (
    <group position={position} scale={scale}>
      {[[0, 0, 0, 3], [3, -0.3, 0.5, 2.4], [-3, -0.2, -0.4, 2.6], [1.4, 0.6, 0.3, 2], [-1.6, 0.5, 0.2, 1.9]].map(
        ([x, y, z, s], i) => (
          <mesh key={i} position={[x, y, z]}>
            <sphereGeometry args={[s, 10, 10]} />
            <meshStandardMaterial color="#ffffff" roughness={1} emissive="#dfe8f5" emissiveIntensity={0.15} />
          </mesh>
        ),
      )}
    </group>
  );
}

function Skyline() {
  const blocks = useMemo(() => {
    const arr: { x: number; z: number; w: number; h: number; depth: number; key: number }[] = [];
    for (let i = 0; i < 60; i++) {
      const ang = (i / 60) * Math.PI * 2 + Math.random() * 0.1;
      const rad = 70 + Math.random() * 70;
      arr.push({
        x: Math.sin(ang) * rad,
        z: -Math.cos(ang) * rad,
        w: 6 + Math.random() * 10,
        depth: 6 + Math.random() * 10,
        h: 14 + Math.random() * 50,
        key: i,
      });
    }
    return arr;
  }, []);

  return (
    <>
      {blocks.map((b) => (
        <mesh key={b.key} position={[b.x, b.h / 2, b.z]}>
          <boxGeometry args={[b.w, b.h, b.depth]} />
          <meshStandardMaterial color="#9aabc8" roughness={0.9} />
        </mesh>
      ))}
    </>
  );
}

function PlazaGround() {
  return (
    <>
      {/* Grass surround */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.02, 0]} receiveShadow>
        <planeGeometry args={[600, 600]} />
        <meshStandardMaterial color="#7faa5a" roughness={1} />
      </mesh>

      {/* Plaza stone circle */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
        <circleGeometry args={[34, 48]} />
        <meshStandardMaterial color="#cdc7ba" roughness={0.95} />
      </mesh>

      {/* Inner ring accent */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 0]}>
        <ringGeometry args={[7.5, 8.2, 48]} />
        <meshStandardMaterial color="#b6afa0" roughness={0.9} side={THREE.DoubleSide} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 0]}>
        <ringGeometry args={[5.2, 5.6, 48]} />
        <meshStandardMaterial color="#b6afa0" roughness={0.9} side={THREE.DoubleSide} />
      </mesh>

      {/* Radial paths toward each building */}
      {PROJECTS.map((p) => {
        const [px, , pz] = p.position;
        const rotY = Math.atan2(px, pz);
        return (
          <mesh key={p.slug} rotation={[-Math.PI / 2, 0, rotY]} position={[px / 2, 0.005, pz / 2]}>
            <planeGeometry args={[4, RING + 6]} />
            <meshStandardMaterial color="#bdb6a7" roughness={0.92} />
          </mesh>
        );
      })}
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
  // Trees in the gaps between buildings
  const trees = useMemo(() => {
    const out: [number, number, number][] = [];
    for (let i = 0; i < 6; i++) {
      const deg = 30 + i * 60;
      const r = (deg * Math.PI) / 180;
      out.push([Math.sin(r) * 13, 0, -Math.cos(r) * 13]);
      out.push([Math.sin(r) * 30, 0, -Math.cos(r) * 30]);
    }
    return out;
  }, []);

  return (
    <>
      <fog attach="fog" args={["#cdd8e8", 70, 240]} />
      <Sky distance={450000} sunPosition={[80, 45, 60]} turbidity={4} rayleigh={1.2} />

      {/* Daytime lighting */}
      <ambientLight intensity={0.9} />
      <hemisphereLight args={["#cfe0ff", "#6f7a55", 1.1]} />
      <directionalLight
        position={[45, 70, 35]}
        intensity={2.6}
        color="#fff4e0"
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-near={1}
        shadow-camera-far={160}
        shadow-camera-left={-50}
        shadow-camera-right={50}
        shadow-camera-top={50}
        shadow-camera-bottom={-50}
        shadow-bias={-0.0004}
      />

      <PlazaGround />
      <Fountain />
      <Skyline />

      {trees.map((t, i) => <Tree key={i} position={t} />)}

      <Cloud position={[-40, 55, -40]} scale={1.4} />
      <Cloud position={[50, 65, -20]} scale={1.8} />
      <Cloud position={[10, 60, 60]} scale={1.5} />
      <Cloud position={[-55, 70, 30]} scale={2} />

      {PROJECTS.map((p) => (
        <Building key={p.slug} project={p} onSelect={onSelectProject} />
      ))}

      <PointerLockControls ref={controlsRef} />
      <PlayerController controlsRef={controlsRef} />
    </>
  );
}
