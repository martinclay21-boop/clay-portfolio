"use client";

import { useRef, useState, useEffect, useMemo } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { PointerLockControls, Text, RoundedBox } from "@react-three/drei";
import * as THREE from "three";
import type { PointerLockControls as PLCImpl } from "three-stdlib";
import { PLACES, type Place } from "./data";

export { PLACES };
export type { Place };

const INTERACT_DIST = 13;
// Player roams the square interior; these keep them off the buildings
const BOUND_X = 13.5;
const BOUND_Z_NEAR = 15;   // open front side
const BOUND_Z_FAR = -13.5; // back wall

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

    const speed = 24;
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

    camera.position.x = THREE.MathUtils.clamp(camera.position.x, -BOUND_X, BOUND_X);
    camera.position.z = THREE.MathUtils.clamp(camera.position.z, BOUND_Z_FAR, BOUND_Z_NEAR);
  });

  return null;
}

// Simple toy windows: a few rounded panes on the front face
function ToyWindows({ width, height, color }: { width: number; height: number; color: string }) {
  const panes = useMemo(() => {
    const cols = Math.max(2, Math.round(width / 3));
    const rows = Math.max(1, Math.round((height - 4) / 2.6));
    const out: { x: number; y: number; key: string }[] = [];
    for (let r = 0; r < rows; r++)
      for (let c = 0; c < cols; c++)
        out.push({
          x: -width / 2 + (width / cols) * (c + 0.5),
          y: 4.2 + r * 2.4,
          key: `${r}-${c}`,
        });
    return out;
  }, [width, height]);

  return (
    <>
      {panes.map(({ x, y, key }) => (
        <group key={key} position={[x, y, 0]}>
          {/* frame */}
          <mesh position={[0, 0, -0.04]}>
            <planeGeometry args={[1.5, 1.7]} />
            <meshStandardMaterial color="#ffffff" roughness={0.7} />
          </mesh>
          {/* glass */}
          <mesh>
            <planeGeometry args={[1.15, 1.35]} />
            <meshStandardMaterial color="#bfe2ff" emissive={color} emissiveIntensity={0.12} roughness={0.2} metalness={0.3} />
          </mesh>
        </group>
      ))}
    </>
  );
}

function Building({ place, onSelect }: { place: Place; onSelect: (p: Place) => void }) {
  const [hovered, setHovered] = useState(false);
  const { camera } = useThree();
  const [near, setNear] = useState(false);

  useFrame(() => {
    const dx = camera.position.x - place.position[0];
    const dz = camera.position.z - place.position[2];
    const isNear = Math.sqrt(dx * dx + dz * dz) < INTERACT_DIST;
    if (isNear !== near) setNear(isNear);
  });

  const w = place.width;
  const h = place.height;
  const d = 6;
  const [px, , pz] = place.position;
  const frontZ = -d / 2;

  // Hip roof: a 4-sided pyramid, rotated 45° so its faces align with the walls
  const roofR = Math.hypot(w / 2, d / 2) * 1.08;
  const roofH = 2.4;

  const lift = hovered && near ? 0.15 : 0; // gentle bob on hover

  return (
    <group position={[px, lift, pz]} rotation={[0, place.rotationY, 0]}>
      {/* Body */}
      <RoundedBox
        args={[w, h, d]}
        radius={0.35}
        smoothness={4}
        position={[0, h / 2, 0]}
        castShadow
        receiveShadow
        onClick={() => { if (near) onSelect(place); }}
        onPointerEnter={() => setHovered(true)}
        onPointerLeave={() => setHovered(false)}
      >
        <meshStandardMaterial color={place.facade} roughness={0.85} metalness={0} />
      </RoundedBox>

      {/* Hip roof */}
      <mesh position={[0, h + roofH / 2, 0]} rotation={[0, Math.PI / 4, 0]} castShadow>
        <coneGeometry args={[roofR, roofH, 4]} />
        <meshStandardMaterial color={place.color} roughness={0.8} flatShading />
      </mesh>
      {/* Little roof finial */}
      <mesh position={[0, h + roofH + 0.2, 0]} castShadow>
        <sphereGeometry args={[0.22, 10, 10]} />
        <meshStandardMaterial color="#ffffff" roughness={0.6} />
      </mesh>

      {/* Door */}
      <mesh position={[0, 1.3, frontZ - 0.02]}>
        <planeGeometry args={[1.6, 2.6]} />
        <meshStandardMaterial color={place.color} roughness={0.6} />
      </mesh>
      <mesh position={[0, 1.3, frontZ - 0.03]}>
        <planeGeometry args={[1.2, 2.2]} />
        <meshStandardMaterial color="#2b2b3a" roughness={0.3} metalness={0.4} />
      </mesh>

      {/* Striped awning over the door */}
      <mesh position={[0, 2.9, frontZ - 0.7]} rotation={[Math.PI / 2.7, 0, 0]} castShadow>
        <boxGeometry args={[Math.min(w * 0.6, 4), 1.3, 0.12]} />
        <meshStandardMaterial color={place.color} roughness={0.7} />
      </mesh>

      {/* Windows */}
      <group position={[0, 0, frontZ - 0.05]}>
        <ToyWindows width={w} height={h} color={place.color} />
      </group>

      {/* Sign — flipped to face the plaza (drei Text faces +z by default) */}
      <Text
        position={[0, h + 0.05, frontZ - 0.08]}
        rotation={[0, Math.PI, 0]}
        fontSize={0.85}
        color="#ffffff"
        anchorX="center"
        anchorY="middle"
        maxWidth={w - 0.5}
        outlineWidth={0.06}
        outlineColor={place.color}
      >
        {place.title}
      </Text>

      {/* Proximity prompt */}
      {near && (
        <Text
          position={[0, h + roofH + 1.4, frontZ - 0.2]}
          rotation={[0, Math.PI, 0]}
          fontSize={0.6}
          color="#33333f"
          anchorX="center"
          anchorY="middle"
          outlineWidth={0.05}
          outlineColor="#ffffff"
        >
          {`[ click to enter ]`}
        </Text>
      )}
    </group>
  );
}

function Tree({ position, scale = 1 }: { position: [number, number, number]; scale?: number }) {
  return (
    <group position={position} scale={scale}>
      <mesh position={[0, 1, 0]} castShadow>
        <cylinderGeometry args={[0.3, 0.4, 2, 7]} />
        <meshStandardMaterial color="#a9764e" roughness={0.9} />
      </mesh>
      <mesh position={[0, 2.6, 0]} castShadow>
        <sphereGeometry args={[1.5, 12, 12]} />
        <meshStandardMaterial color="#7cc47f" roughness={0.9} flatShading />
      </mesh>
      <mesh position={[0.9, 2, 0.3]} castShadow>
        <sphereGeometry args={[0.9, 12, 12]} />
        <meshStandardMaterial color="#8fd190" roughness={0.9} flatShading />
      </mesh>
      <mesh position={[-0.8, 2.1, -0.2]} castShadow>
        <sphereGeometry args={[0.8, 12, 12]} />
        <meshStandardMaterial color="#8fd190" roughness={0.9} flatShading />
      </mesh>
    </group>
  );
}

function Lamp({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      <mesh position={[0, 1.6, 0]} castShadow>
        <cylinderGeometry args={[0.12, 0.16, 3.2, 8]} />
        <meshStandardMaterial color="#5b6472" roughness={0.7} metalness={0.3} />
      </mesh>
      <mesh position={[0, 3.4, 0]}>
        <sphereGeometry args={[0.32, 12, 12]} />
        <meshStandardMaterial color="#fff4cf" emissive="#fff0b8" emissiveIntensity={1.4} roughness={0.4} />
      </mesh>
      <pointLight position={[0, 3.4, 0]} color="#fff0c0" intensity={8} distance={9} decay={2} />
    </group>
  );
}

function Bench({ position, rotationY = 0 }: { position: [number, number, number]; rotationY?: number }) {
  return (
    <group position={position} rotation={[0, rotationY, 0]}>
      <mesh position={[0, 0.5, 0]} castShadow>
        <boxGeometry args={[2.2, 0.18, 0.7]} />
        <meshStandardMaterial color="#c98a52" roughness={0.85} />
      </mesh>
      <mesh position={[0, 0.9, -0.28]} castShadow>
        <boxGeometry args={[2.2, 0.6, 0.14]} />
        <meshStandardMaterial color="#c98a52" roughness={0.85} />
      </mesh>
    </group>
  );
}

function Fountain() {
  return (
    <group position={[0, 0, 0]}>
      <mesh position={[0, 0.35, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[2.4, 2.6, 0.7, 24]} />
        <meshStandardMaterial color="#e7e0d2" roughness={0.85} />
      </mesh>
      <mesh position={[0, 0.55, 0]}>
        <cylinderGeometry args={[2.1, 2.1, 0.25, 24]} />
        <meshStandardMaterial color="#8ecae6" roughness={0.2} metalness={0.2} transparent opacity={0.9} />
      </mesh>
      <mesh position={[0, 1, 0]} castShadow>
        <cylinderGeometry args={[0.35, 0.5, 1.2, 12]} />
        <meshStandardMaterial color="#e7e0d2" roughness={0.85} />
      </mesh>
      <mesh position={[0, 1.7, 0]} castShadow>
        <sphereGeometry args={[0.45, 14, 14]} />
        <meshStandardMaterial color="#8ecae6" roughness={0.2} metalness={0.2} />
      </mesh>
    </group>
  );
}

function Cloud({ position, scale = 1 }: { position: [number, number, number]; scale?: number }) {
  return (
    <group position={position} scale={scale}>
      {[[0, 0, 0, 2.6], [2.6, -0.2, 0.3, 2], [-2.6, -0.2, -0.3, 2.1], [1.2, 0.5, 0.2, 1.7], [-1.3, 0.4, 0.2, 1.6]].map(
        ([x, y, z, s], i) => (
          <mesh key={i} position={[x, y, z]}>
            <sphereGeometry args={[s, 10, 10]} />
            <meshStandardMaterial color="#ffffff" roughness={1} />
          </mesh>
        ),
      )}
    </group>
  );
}

function Skyline() {
  const blocks = useMemo(() => {
    const palette = ["#cdd6ea", "#d6cee6", "#cfe2e0", "#e6d9cf"];
    const arr: { x: number; z: number; w: number; h: number; depth: number; color: string; key: number }[] = [];
    for (let i = 0; i < 46; i++) {
      const ang = (i / 46) * Math.PI * 2 + Math.random() * 0.12;
      const rad = 60 + Math.random() * 55;
      arr.push({
        x: Math.sin(ang) * rad,
        z: -Math.cos(ang) * rad,
        w: 6 + Math.random() * 9,
        depth: 6 + Math.random() * 9,
        h: 10 + Math.random() * 34,
        color: palette[i % palette.length],
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
          <meshStandardMaterial color={b.color} roughness={0.95} />
        </mesh>
      ))}
    </>
  );
}

function GradientSky() {
  const mat = useMemo(
    () =>
      new THREE.ShaderMaterial({
        side: THREE.BackSide,
        depthWrite: false,
        uniforms: {
          topColor: { value: new THREE.Color("#a9d4f2") },
          bottomColor: { value: new THREE.Color("#fdeede") },
          offset: { value: 28 },
          exponent: { value: 0.7 },
        },
        vertexShader: `
          varying vec3 vWorldPosition;
          void main() {
            vec4 wp = modelMatrix * vec4(position, 1.0);
            vWorldPosition = wp.xyz;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          }`,
        fragmentShader: `
          uniform vec3 topColor;
          uniform vec3 bottomColor;
          uniform float offset;
          uniform float exponent;
          varying vec3 vWorldPosition;
          void main() {
            float h = normalize(vWorldPosition + vec3(0.0, offset, 0.0)).y;
            float t = pow(max(h, 0.0), exponent);
            gl_FragColor = vec4(mix(bottomColor, topColor, t), 1.0);
          }`,
      }),
    [],
  );
  return (
    <mesh material={mat}>
      <sphereGeometry args={[400, 32, 16]} />
    </mesh>
  );
}

function Ground() {
  return (
    <>
      {/* Grass */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.02, 0]} receiveShadow>
        <planeGeometry args={[800, 800]} />
        <meshStandardMaterial color="#9cc06f" roughness={1} />
      </mesh>
      {/* Square plaza */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
        <planeGeometry args={[44, 44]} />
        <meshStandardMaterial color="#ece4d3" roughness={0.95} />
      </mesh>
      {/* Cross paths */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.006, 0]}>
        <planeGeometry args={[5, 44]} />
        <meshStandardMaterial color="#ddd2bb" roughness={0.95} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.006, 0]}>
        <planeGeometry args={[44, 5]} />
        <meshStandardMaterial color="#ddd2bb" roughness={0.95} />
      </mesh>
      {/* Center medallion */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.012, 0]}>
        <circleGeometry args={[4, 36]} />
        <meshStandardMaterial color="#d3c7a9" roughness={0.9} />
      </mesh>
    </>
  );
}

export function CityScene({
  onSelectPlace,
  controlsRef,
}: {
  onSelectPlace: (p: Place) => void;
  controlsRef: React.RefObject<PLCImpl | null>;
}) {
  return (
    <>
      <fog attach="fog" args={["#dfe7ee", 75, 260]} />
      <GradientSky />

      {/* Soft toy-world lighting */}
      <ambientLight intensity={0.85} />
      <hemisphereLight args={["#dfeefe", "#9ab06a", 0.9]} />
      <directionalLight
        position={[28, 44, 22]}
        intensity={2.2}
        color="#fff3df"
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-near={1}
        shadow-camera-far={130}
        shadow-camera-left={-40}
        shadow-camera-right={40}
        shadow-camera-top={40}
        shadow-camera-bottom={-40}
        shadow-bias={-0.0004}
      />

      <Ground />
      <Skyline />
      <Fountain />

      {/* Benches around the fountain */}
      <Bench position={[0, 0, 6]} rotationY={Math.PI} />
      <Bench position={[0, 0, -6]} />
      <Bench position={[6, 0, 0]} rotationY={Math.PI / 2} />
      <Bench position={[-6, 0, 0]} rotationY={-Math.PI / 2} />

      {/* Corner lamps + trees */}
      {([[12, 12], [-12, 12], [12, -12], [-12, -12]] as [number, number][]).map(([x, z], i) => (
        <Lamp key={`l${i}`} position={[x, 0, z]} />
      ))}
      {([[16, 16], [-16, 16], [9, 16], [-9, 16]] as [number, number][]).map(([x, z], i) => (
        <Tree key={`tr${i}`} position={[x, 0, z]} scale={0.9 + (i % 2) * 0.25} />
      ))}

      <Cloud position={[-34, 48, -34]} scale={1.4} />
      <Cloud position={[42, 56, -18]} scale={1.8} />
      <Cloud position={[8, 52, 52]} scale={1.5} />
      <Cloud position={[-48, 60, 26]} scale={2} />

      {PLACES.map((p) => (
        <Building key={p.id} place={p} onSelect={onSelectPlace} />
      ))}

      <PointerLockControls ref={controlsRef} />
      <PlayerController controlsRef={controlsRef} />
    </>
  );
}
