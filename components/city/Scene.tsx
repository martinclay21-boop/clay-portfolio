"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { PointerLockControls, Text, Stars } from "@react-three/drei";
import * as THREE from "three";
import type { PointerLockControls as PLCImpl } from "three-stdlib";

const BASE = "/clay-portfolio";

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

function useKeys() {
  const keys = useRef({ w: false, a: false, s: false, d: false });
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.code === "KeyW" || e.code === "ArrowUp") keys.current.w = true;
      if (e.code === "KeyS" || e.code === "ArrowDown") keys.current.s = true;
      if (e.code === "KeyA" || e.code === "ArrowLeft") keys.current.a = true;
      if (e.code === "KeyD" || e.code === "ArrowRight") keys.current.d = true;
    };
    const up = (e: KeyboardEvent) => {
      if (e.code === "KeyW" || e.code === "ArrowUp") keys.current.w = false;
      if (e.code === "KeyS" || e.code === "ArrowDown") keys.current.s = false;
      if (e.code === "KeyA" || e.code === "ArrowLeft") keys.current.a = false;
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

  useFrame((_, delta) => {
    if (!controlsRef.current?.isLocked) return;

    velocity.current.x -= velocity.current.x * 10 * delta;
    velocity.current.z -= velocity.current.z * 10 * delta;

    direction.current.set(
      (keys.current.d ? 1 : 0) - (keys.current.a ? 1 : 0),
      0,
      (keys.current.w ? 1 : 0) - (keys.current.s ? 1 : 0)
    );

    if (direction.current.length() > 0) direction.current.normalize();

    const speed = 40;
    if (keys.current.w || keys.current.s) velocity.current.z -= direction.current.z * speed * delta;
    if (keys.current.a || keys.current.d) velocity.current.x -= direction.current.x * speed * delta;

    controlsRef.current.moveRight(-velocity.current.x * delta);
    controlsRef.current.moveForward(-velocity.current.z * delta);

    camera.position.y = 1.8;
    camera.position.x = THREE.MathUtils.clamp(camera.position.x, -6, 6);
    camera.position.z = THREE.MathUtils.clamp(camera.position.z, -120, 6);
  });

  return null;
}

function Windows({
  width,
  height,
  depth,
  color,
}: {
  width: number;
  height: number;
  depth: number;
  color: string;
}) {
  const cols = Math.floor(width / 3.5);
  const rows = Math.floor((height - 2) / 3);
  const windows = [];

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const x = -width / 2 + 2 + c * (width / cols);
      const y = 2 + r * 3 + 1.2;
      const lit = Math.random() > 0.25;
      windows.push(
        <mesh key={`${r}-${c}`} position={[x, y, -depth / 2 - 0.05]}>
          <planeGeometry args={[1.4, 1.8]} />
          <meshStandardMaterial
            color={lit ? color : "#0a0a14"}
            emissive={lit ? color : "#000000"}
            emissiveIntensity={lit ? 0.6 : 0}
            roughness={0.1}
          />
        </mesh>
      );
    }
  }
  return <>{windows}</>;
}

function Building({
  project,
  onSelect,
}: {
  project: Project;
  onSelect: (p: Project) => void;
}) {
  const [hovered, setHovered] = useState(false);
  const { camera } = useThree();
  const [near, setNear] = useState(false);

  useFrame(() => {
    const dist = Math.sqrt(
      Math.pow(camera.position.x - project.position[0], 2) +
        Math.pow(camera.position.z - project.position[2], 2)
    );
    setNear(dist < 12);
  });

  const w = project.buildingWidth;
  const h = project.buildingHeight;
  const d = 8;

  return (
    <group position={project.position}>
      {/* Main body */}
      <mesh
        position={[0, h / 2, 0]}
        onClick={() => onSelect(project)}
        onPointerEnter={() => setHovered(true)}
        onPointerLeave={() => setHovered(false)}
      >
        <boxGeometry args={[w, h, d]} />
        <meshStandardMaterial color={hovered ? "#1a1a2e" : "#0f0f1a"} roughness={0.9} />
      </mesh>

      {/* Ground floor storefront */}
      <mesh position={[0, 1.5, -0.02]}>
        <boxGeometry args={[w, 3, d - 0.1]} />
        <meshStandardMaterial color="#0a0a12" roughness={0.8} />
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

      {/* Neon sign glow */}
      <pointLight
        position={[0, h + 0.8, -d / 2 + 1]}
        color={project.color}
        intensity={hovered ? 4 : 2}
        distance={16}
      />

      {/* Ground glow */}
      <pointLight
        position={[0, 0.1, -d / 2 + 1]}
        color={project.color}
        intensity={hovered ? 1.5 : 0.6}
        distance={8}
      />

      {/* Proximity prompt */}
      {near && (
        <Text
          position={[0, 4, -d / 2 + 0.2]}
          fontSize={0.5}
          color="#ffffff"
          anchorX="center"
          anchorY="middle"
          fillOpacity={0.8}
        >
          Click to open
        </Text>
      )}
    </group>
  );
}

function Streetlight({ z }: { z: number }) {
  const side = z % 30 === 0 ? 1 : -1;
  return (
    <group position={[side * 6, 0, z]}>
      <mesh position={[0, 4, 0]}>
        <boxGeometry args={[0.12, 8, 0.12]} />
        <meshStandardMaterial color="#1a1a2a" roughness={0.8} />
      </mesh>
      <mesh position={[side * -1, 7.8, 0]}>
        <boxGeometry args={[2, 0.12, 0.12]} />
        <meshStandardMaterial color="#1a1a2a" roughness={0.8} />
      </mesh>
      <mesh position={[side * -1, 7.6, 0]}>
        <sphereGeometry args={[0.25]} />
        <meshStandardMaterial color="#fffbe0" emissive="#fffbe0" emissiveIntensity={1} />
      </mesh>
      <pointLight position={[side * -1, 7.4, 0]} color="#fffbe0" intensity={1.2} distance={18} />
    </group>
  );
}

function Ground() {
  return (
    <>
      {/* Main ground */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, -60]}>
        <planeGeometry args={[200, 200]} />
        <meshStandardMaterial color="#080810" roughness={0.95} />
      </mesh>
      {/* Street */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, -60]}>
        <planeGeometry args={[10, 200]} />
        <meshStandardMaterial color="#0d0d1a" roughness={0.9} />
      </mesh>
      {/* Center line */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, -60]}>
        <planeGeometry args={[0.15, 200]} />
        <meshStandardMaterial color="#2a2a4a" roughness={0.8} />
      </mesh>
      {/* Left curb */}
      <mesh position={[-5.1, 0.15, -60]}>
        <boxGeometry args={[0.3, 0.3, 200]} />
        <meshStandardMaterial color="#111122" roughness={0.9} />
      </mesh>
      {/* Right curb */}
      <mesh position={[5.1, 0.15, -60]}>
        <boxGeometry args={[0.3, 0.3, 200]} />
        <meshStandardMaterial color="#111122" roughness={0.9} />
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
      <fog attach="fog" args={["#05050f", 20, 90]} />
      <color attach="background" args={["#05050f"]} />
      <ambientLight intensity={0.5} />
      <directionalLight position={[0, 20, 10]} intensity={0.8} color="#8888cc" />
      <Stars radius={80} depth={40} count={3000} factor={3} saturation={0} fade />

      <Ground />

      {[0, -15, -30, -45, -60, -75, -90, -105].map((z) => (
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
