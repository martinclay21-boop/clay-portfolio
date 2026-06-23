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
  color: string;    // accent (sign / awning / cornice)
  facade: string;   // light building wall color
  position: [number, number, number];
  rotationY: number; // so the storefront faces the plaza
  buildingHeight: number;
  buildingWidth: number;
}

// Square plaza: buildings line the four sides, all facing inward.
// FRONT (z-) faces +z → rotation π · BACK (z+) faces -z → 0
// LEFT (x-) faces +x → -π/2 · RIGHT (x+) faces -x → π/2
const FACE_FRONT = Math.PI;
const FACE_BACK = 0;
const FACE_LEFT = -Math.PI / 2;
const FACE_RIGHT = Math.PI / 2;

export const PROJECTS: Project[] = [
  {
    slug: "cuekit",
    title: "CueKit",
    category: "UX Design · Senior Degree Project",
    description: "A mental readiness journal and cue system for college volleyball athletes — end-to-end from research to high-fidelity prototype.",
    color: "#7F77DD",
    facade: "#e9e7f6",
    position: [-11, 0, -18],
    rotationY: FACE_FRONT,
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
    position: [11, 0, -18],
    rotationY: FACE_FRONT,
    buildingHeight: 17,
    buildingWidth: 16,
  },
  {
    slug: "speaksynci-ai",
    title: "SpeakSyncAI",
    category: "UX Design · Concept App",
    description: "Real-time lecture transcription and AI summaries for deaf and hard-of-hearing students. Accessibility-first design.",
    color: "#378ADD",
    facade: "#e3eef8",
    position: [-18, 0, 0],
    rotationY: FACE_LEFT,
    buildingHeight: 16,
    buildingWidth: 16,
  },
  {
    slug: "academic-advising",
    title: "Academic Advising",
    category: "Service Design",
    description: "Identified communication breakdowns in Miami's advising process and prototyped a Canvas + Navigate integration.",
    color: "#BA7517",
    facade: "#f6efe1",
    position: [18, 0, 0],
    rotationY: FACE_RIGHT,
    buildingHeight: 13,
    buildingWidth: 16,
  },
  {
    slug: "spokenote",
    title: "Spokenote",
    category: "Visual Design · Marketing",
    description: "Use case illustrations across product pages using Photoshop and Illustrator, communicating Spokenote to customers.",
    color: "#9F7AEA",
    facade: "#f0e9f8",
    position: [-11, 0, 18],
    rotationY: FACE_BACK,
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
    position: [11, 0, 18],
    rotationY: FACE_BACK,
    buildingHeight: 14,
    buildingWidth: 15,
  },
];

const INTERACT_DIST = 14;
const PLAZA_HALF = 14; // player movement bound (square)

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

    const dt = Math.min(delta, 0.05);
    const friction = 8;
    velocity.current.x = THREE.MathUtils.damp(velocity.current.x, 0, friction, dt);
    velocity.current.z = THREE.MathUtils.damp(velocity.current.z, 0, friction, dt);

    direction.current.set(
      (keys.current.d ? 1 : 0) - (keys.current.a ? 1 : 0),
      0,
      (keys.current.w ? 1 : 0) - (keys.current.s ? 1 : 0),
    );
    if (direction.current.length() > 0) direction.current.normalize();

    const speed = 26;
    if (keys.current.w || keys.current.s) velocity.current.z -= direction.current.z * speed * dt;
    if (keys.current.a || keys.current.d) velocity.current.x -= direction.current.x * speed * dt;

    controlsRef.current.moveRight(-velocity.current.x * dt);
    controlsRef.current.moveForward(-velocity.current.z * dt);

    const moving = Math.abs(velocity.current.x) + Math.abs(velocity.current.z) > 0.05;
    if (moving) {
      bobTime.current += dt * 7;
      camera.position.y = 1.8 + Math.sin(bobTime.current) * 0.04;
    } else {
      camera.position.y = THREE.MathUtils.damp(camera.position.y, 1.8, 10, dt);
    }

    // Square plaza bounds
    camera.position.x = THREE.MathUtils.clamp(camera.position.x, -PLAZA_HALF, PLAZA_HALF);
    camera.position.z = THREE.MathUtils.clamp(camera.position.z, -PLAZA_HALF, PLAZA_HALF);
  });

  return null;
}

// Window grid with frames — "in-between" detail. Renders on one face,
// the parent <group> positions/orients it onto the building.
function WindowGrid({ faceWidth, height, color }: {
  faceWidth: number; height: number; color: string;
}) {
  const panes = useMemo(() => {
    const cols = Math.max(2, Math.floor(faceWidth / 3.2));
    const rows = Math.max(2, Math.floor((height - 6) / 2.9));
    const out: { x: number; y: number; lit: boolean; key: string }[] = [];
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        out.push({
          x: -faceWidth / 2 + (faceWidth / cols) * (c + 0.5),
          y: 5.5 + r * 2.9,
          lit: Math.random() > 0.55,
          key: `${r}-${c}`,
        });
      }
    }
    return out;
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [faceWidth, height]);

  return (
    <>
      {panes.map(({ x, y, lit, key }) => (
        <group key={key} position={[x, y, 0]}>
          {/* Frame / trim */}
          <mesh position={[0, 0, -0.03]}>
            <planeGeometry args={[1.95, 2.25]} />
            <meshStandardMaterial color="#f4f1ea" roughness={0.6} />
          </mesh>
          {/* Glass */}
          <mesh>
            <planeGeometry args={[1.55, 1.85]} />
            <meshStandardMaterial
              color={lit ? "#bfe2ff" : "#9fb8d4"}
              emissive={lit ? color : "#000000"}
              emissiveIntensity={lit ? 0.22 : 0}
              roughness={0.12}
              metalness={0.45}
            />
          </mesh>
        </group>
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
  const frontZ = -d / 2; // local front face

  return (
    <group position={[px, 0, pz]} rotation={[0, project.rotationY, 0]}>
      {/* Base plinth */}
      <mesh position={[0, 0.5, 0]} castShadow receiveShadow>
        <boxGeometry args={[w + 0.6, 1, d + 0.6]} />
        <meshStandardMaterial color="#9a948a" roughness={0.9} />
      </mesh>

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
        <meshStandardMaterial color={project.facade} roughness={0.7} metalness={0.05} />
      </mesh>

      {/* Corner pilasters (front) for vertical relief */}
      {[-1, 1].map((s) => (
        <mesh key={s} position={[s * (w / 2 - 0.4), h / 2, frontZ - 0.2]} castShadow>
          <boxGeometry args={[0.8, h, 0.4]} />
          <meshStandardMaterial color="#cec8bb" roughness={0.8} />
        </mesh>
      ))}

      {/* Horizontal string course at floor line */}
      <mesh position={[0, h * 0.55, frontZ - 0.06]}>
        <boxGeometry args={[w + 0.1, 0.35, 0.2]} />
        <meshStandardMaterial color="#cec8bb" roughness={0.8} />
      </mesh>

      {/* Colored cornice / parapet */}
      <mesh position={[0, h + 0.4, 0]} castShadow>
        <boxGeometry args={[w + 0.6, 0.9, d + 0.6]} />
        <meshStandardMaterial color={project.color} roughness={0.5} metalness={0.1} />
      </mesh>
      {/* Roof slab */}
      <mesh position={[0, h + 0.9, 0]}>
        <boxGeometry args={[w - 1, 0.4, d - 1]} />
        <meshStandardMaterial color="#3a3a48" roughness={0.9} />
      </mesh>

      {/* Storefront band */}
      <mesh position={[0, 2, frontZ - 0.01]}>
        <planeGeometry args={[w, 4]} />
        <meshStandardMaterial color="#2c2c3a" roughness={0.6} metalness={0.2} />
      </mesh>
      {/* Glass door */}
      <mesh position={[0, 1.6, frontZ - 0.02]}>
        <planeGeometry args={[3, 3.2]} />
        <meshStandardMaterial color="#1a2433" roughness={0.1} metalness={0.6} />
      </mesh>
      {/* Awning */}
      <mesh position={[0, 4.2, frontZ - 0.9]} rotation={[Math.PI / 2.6, 0, 0]} castShadow>
        <boxGeometry args={[w * 0.7, 1.8, 0.15]} />
        <meshStandardMaterial color={project.color} roughness={0.6} />
      </mesh>

      {/* Windows — front + both sides */}
      <group position={[0, 0, frontZ - 0.05]}>
        <WindowGrid faceWidth={w} height={h} color={project.color} />
      </group>
      <group position={[-w / 2 - 0.05, 0, 0]} rotation={[0, -Math.PI / 2, 0]}>
        <WindowGrid faceWidth={d} height={h} color={project.color} />
      </group>
      <group position={[w / 2 + 0.05, 0, 0]} rotation={[0, Math.PI / 2, 0]}>
        <WindowGrid faceWidth={d} height={h} color={project.color} />
      </group>

      {/* Sign — above the awning, FLIPPED to face the plaza (drei Text
          faces +z by default; the player views the front from -z) */}
      <Text
        position={[0, 6.4, frontZ - 0.08]}
        rotation={[0, Math.PI, 0]}
        fontSize={1}
        color={project.color}
        anchorX="center"
        anchorY="middle"
        maxWidth={w - 1.5}
        outlineWidth={0.05}
        outlineColor="#ffffff"
      >
        {project.title.toUpperCase()}
      </Text>

      {/* Soft sign light */}
      <pointLight
        position={[0, 6.4, frontZ - 1.5]}
        color={project.color}
        intensity={hovered ? 30 : 12}
        distance={14}
        decay={2}
      />

      {/* Proximity prompt (also flipped to face the plaza) */}
      {near && (
        <Text
          position={[0, h + 2, frontZ - 0.2]}
          rotation={[0, Math.PI, 0]}
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

function Planter({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      <mesh position={[0, 0.5, 0]} castShadow receiveShadow>
        <boxGeometry args={[2.4, 1, 2.4]} />
        <meshStandardMaterial color="#cfc8ba" roughness={0.85} />
      </mesh>
      <mesh position={[0, 1.4, 0]} castShadow>
        <sphereGeometry args={[1.3, 10, 10]} />
        <meshStandardMaterial color="#4aa05c" roughness={0.85} />
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

      {/* Square plaza stone */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
        <planeGeometry args={[46, 46]} />
        <meshStandardMaterial color="#cdc7ba" roughness={0.95} />
      </mesh>

      {/* Cross paths */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.005, 0]}>
        <planeGeometry args={[5, 46]} />
        <meshStandardMaterial color="#bdb6a7" roughness={0.92} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.005, 0]}>
        <planeGeometry args={[46, 5]} />
        <meshStandardMaterial color="#bdb6a7" roughness={0.92} />
      </mesh>

      {/* Center medallion */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 0]}>
        <circleGeometry args={[4.5, 40]} />
        <meshStandardMaterial color="#b6afa0" roughness={0.9} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, 0]}>
        <ringGeometry args={[3.6, 4.1, 40]} />
        <meshStandardMaterial color="#8f887a" roughness={0.85} side={THREE.DoubleSide} />
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
      <Skyline />

      {/* Corner trees + planters flanking each path */}
      {([[15, 15], [-15, 15], [15, -15], [-15, -15]] as [number, number][]).map(([x, z], i) => (
        <Tree key={`t${i}`} position={[x, 0, z]} />
      ))}
      {([[6, 6], [-6, 6], [6, -6], [-6, -6]] as [number, number][]).map(([x, z], i) => (
        <Planter key={`p${i}`} position={[x, 0, z]} />
      ))}

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
