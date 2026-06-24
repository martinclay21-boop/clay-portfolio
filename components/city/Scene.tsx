"use client";

import { useRef, useState, useEffect, useMemo } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { PointerLockControls, Text, RoundedBox } from "@react-three/drei";
import * as THREE from "three";
import type { PointerLockControls as PLCImpl } from "three-stdlib";
import { PLACES, type Place, type RoofStyle } from "./data";

export { PLACES };
export type { Place };

const INTERACT_DIST = 13;
const BOUND_X = 13.5;
const BOUND_Z_NEAR = 15;
const BOUND_Z_FAR = -13.5;

// Darken a hex color toward black by amount (0..1) — used for trim/shadow tones
function shade(hex: string, amt: number) {
  const c = new THREE.Color(hex);
  c.multiplyScalar(1 - amt);
  return `#${c.getHexString()}`;
}

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

/* ---------------- Building pieces ---------------- */

function Roof({ style, w, d, h, color, facade }: {
  style: RoofStyle; w: number; d: number; h: number; color: string; facade: string;
}) {
  const trim = shade(color, 0.18);

  if (style === "dome") {
    const r = Math.min(w, d) * 0.62;
    return (
      <group>
        <mesh position={[0, h, 0]} castShadow>
          <sphereGeometry args={[r, 20, 14, 0, Math.PI * 2, 0, Math.PI / 2]} />
          <meshStandardMaterial color={color} roughness={0.7} />
        </mesh>
        <mesh position={[0, h + r + 0.25, 0]} castShadow>
          <coneGeometry args={[0.18, 0.6, 12]} />
          <meshStandardMaterial color={trim} roughness={0.6} metalness={0.3} />
        </mesh>
      </group>
    );
  }

  if (style === "flat") {
    return (
      <group>
        {/* parapet */}
        <mesh position={[0, h + 0.35, 0]} castShadow>
          <boxGeometry args={[w + 0.4, 0.7, d + 0.4]} />
          <meshStandardMaterial color={color} roughness={0.8} />
        </mesh>
        {/* recessed roof deck */}
        <mesh position={[0, h + 0.3, 0]}>
          <boxGeometry args={[w - 0.3, 0.3, d - 0.3]} />
          <meshStandardMaterial color={shade(facade, 0.25)} roughness={0.95} />
        </mesh>
      </group>
    );
  }

  if (style === "gable") {
    const roofH = 2.4;
    const ov = 0.5;                 // eave overhang
    const run = w / 2 + ov;
    const slope = Math.hypot(run, roofH);
    const ang = Math.atan2(roofH, run);
    // Gable end triangle (front + back walls under the ridge)
    const endShape = new THREE.Shape();
    endShape.moveTo(-w / 2, 0);
    endShape.lineTo(w / 2, 0);
    endShape.lineTo(0, roofH);
    endShape.closePath();
    return (
      <group position={[0, h, 0]}>
        {/* two slopes */}
        <mesh position={[run / 2, roofH / 2, 0]} rotation={[0, 0, -ang]} castShadow>
          <boxGeometry args={[slope, 0.18, d + 2 * ov]} />
          <meshStandardMaterial color={color} roughness={0.75} />
        </mesh>
        <mesh position={[-run / 2, roofH / 2, 0]} rotation={[0, 0, ang]} castShadow>
          <boxGeometry args={[slope, 0.18, d + 2 * ov]} />
          <meshStandardMaterial color={color} roughness={0.75} />
        </mesh>
        {/* ridge cap */}
        <mesh position={[0, roofH, 0]} castShadow>
          <boxGeometry args={[0.22, 0.22, d + 2 * ov]} />
          <meshStandardMaterial color={trim} roughness={0.6} />
        </mesh>
        {/* gable ends (wall-colored) */}
        <mesh position={[0, 0, -d / 2 - 0.02]} rotation={[0, Math.PI, 0]}>
          <shapeGeometry args={[endShape]} />
          <meshStandardMaterial color={facade} roughness={0.85} side={THREE.DoubleSide} />
        </mesh>
        <mesh position={[0, 0, d / 2 + 0.02]}>
          <shapeGeometry args={[endShape]} />
          <meshStandardMaterial color={facade} roughness={0.85} side={THREE.DoubleSide} />
        </mesh>
      </group>
    );
  }

  // hip (default) — pyramid
  const roofR = Math.hypot(w / 2, d / 2) * 1.06;
  const roofH = 2.5;
  return (
    <group>
      <mesh position={[0, h + roofH / 2, 0]} rotation={[0, Math.PI / 4, 0]} castShadow>
        <coneGeometry args={[roofR, roofH, 4]} />
        <meshStandardMaterial color={color} roughness={0.75} flatShading />
      </mesh>
      <mesh position={[0, h + roofH + 0.15, 0]} castShadow>
        <sphereGeometry args={[0.2, 10, 10]} />
        <meshStandardMaterial color="#ffffff" roughness={0.6} />
      </mesh>
    </group>
  );
}

function Awning({ span, y, z, color }: { span: number; y: number; z: number; color: string }) {
  const stripes = Math.max(4, Math.round(span / 1.1));
  const sw = span / stripes;
  return (
    <group position={[0, y, z]} rotation={[Math.PI / 2.7, 0, 0]}>
      {Array.from({ length: stripes }).map((_, i) => (
        <mesh key={i} position={[-span / 2 + sw * (i + 0.5), 0, 0]} castShadow>
          <boxGeometry args={[sw * 0.96, 1.5, 0.12]} />
          <meshStandardMaterial color={i % 2 === 0 ? color : "#fbf7ef"} roughness={0.7} />
        </mesh>
      ))}
      {/* scalloped valance bar */}
      <mesh position={[0, -0.78, 0.02]}>
        <boxGeometry args={[span, 0.18, 0.16]} />
        <meshStandardMaterial color={shade(color, 0.15)} roughness={0.7} />
      </mesh>
    </group>
  );
}

function Window({ x, y, frontZ, w = 1.3, h = 1.6, withBox = false, flower = "#e8607a" }: {
  x: number; y: number; frontZ: number; w?: number; h?: number; withBox?: boolean; flower?: string;
}) {
  return (
    <group position={[x, y, frontZ]}>
      <mesh position={[0, 0, -0.04]}>
        <planeGeometry args={[w + 0.3, h + 0.3]} />
        <meshStandardMaterial color="#ffffff" roughness={0.7} />
      </mesh>
      <mesh>
        <planeGeometry args={[w, h]} />
        <meshStandardMaterial color="#bfe2ff" emissive="#9fc6ec" emissiveIntensity={0.15} roughness={0.15} metalness={0.4} />
      </mesh>
      {/* muntins */}
      <mesh position={[0, 0, 0.01]}>
        <boxGeometry args={[0.06, h, 0.02]} />
        <meshStandardMaterial color="#ffffff" />
      </mesh>
      <mesh position={[0, 0, 0.01]}>
        <boxGeometry args={[w, 0.06, 0.02]} />
        <meshStandardMaterial color="#ffffff" />
      </mesh>
      {withBox && (
        <group position={[0, -h / 2 - 0.25, 0.15]}>
          <mesh castShadow>
            <boxGeometry args={[w + 0.1, 0.35, 0.35]} />
            <meshStandardMaterial color="#8a5a3c" roughness={0.9} />
          </mesh>
          {[-0.35, 0, 0.35].map((dx) => (
            <mesh key={dx} position={[dx, 0.3, 0.05]}>
              <sphereGeometry args={[0.16, 8, 8]} />
              <meshStandardMaterial color={flower} roughness={0.8} />
            </mesh>
          ))}
        </group>
      )}
    </group>
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
  const f = frontZ - 0.06; // just in front of the facade

  const signY = Math.min(4.5, h - 0.7);
  const trim = shade(place.color, 0.2);
  const lift = hovered && near ? 0.12 : 0;

  // Upper windows (only where they fit above the sign)
  const upperWindows: number[] = [];
  for (let y = signY + 1.6; y < h - 0.5; y += 1.9) upperWindows.push(y);
  const upperCols = Math.max(2, Math.round(w / 2.6));

  return (
    <group position={[px, lift, pz]} rotation={[0, place.rotationY, 0]}>
      {/* Base course */}
      <mesh position={[0, 0.35, 0]} castShadow receiveShadow>
        <boxGeometry args={[w + 0.5, 0.7, d + 0.5]} />
        <meshStandardMaterial color={shade(place.facade, 0.22)} roughness={0.9} />
      </mesh>

      {/* Body */}
      <RoundedBox
        args={[w, h, d]}
        radius={0.28}
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

      <Roof style={place.roof} w={w} d={d} h={h} color={place.color} facade={place.facade} />

      {/* Storefront: door + flanking display windows */}
      <mesh position={[0, 1.4, f]}>
        <planeGeometry args={[1.8, 2.8]} />
        <meshStandardMaterial color={trim} roughness={0.6} />
      </mesh>
      <mesh position={[0, 1.35, f - 0.01]}>
        <planeGeometry args={[1.4, 2.4]} />
        <meshStandardMaterial color="#2b2b3a" roughness={0.25} metalness={0.5} />
      </mesh>
      <mesh position={[0, 1.35, f]}>
        <sphereGeometry args={[0.08, 8, 8]} />
        <meshStandardMaterial color="#ffd36a" emissive="#ffcb4a" emissiveIntensity={0.4} metalness={0.6} roughness={0.3} />
      </mesh>
      <Window x={-(w / 2 - 1.3)} y={1.5} frontZ={f} w={1.5} h={1.9} />
      <Window x={w / 2 - 1.3} y={1.5} frontZ={f} w={1.5} h={1.9} />

      {/* Striped awning across the storefront */}
      <Awning span={Math.min(w - 0.4, 5)} y={3.0} z={frontZ - 0.7} color={place.color} />

      {/* Sign fascia board (text sits ON it — fixes the floating-text look) */}
      <group position={[0, signY, frontZ - 0.12]}>
        <RoundedBox args={[w - 0.6, 1.2, 0.25]} radius={0.1} smoothness={3} castShadow>
          <meshStandardMaterial color={trim} roughness={0.55} />
        </RoundedBox>
        <Text
          position={[0, 0, 0.16]}
          rotation={[0, Math.PI, 0]}
          fontSize={place.title.length > 12 ? 0.62 : 0.8}
          color="#ffffff"
          anchorX="center"
          anchorY="middle"
          maxWidth={w - 1}
          textAlign="center"
          fontWeight={700}
        >
          {place.title}
        </Text>
      </group>

      {/* Upper windows with flower boxes */}
      {upperWindows.map((y, ri) =>
        Array.from({ length: upperCols }).map((_, ci) => {
          const x = -w / 2 + (w / upperCols) * (ci + 0.5);
          return (
            <Window
              key={`${ri}-${ci}`}
              x={x}
              y={y}
              frontZ={f}
              w={1.2}
              h={1.5}
              withBox={ri === 0}
              flower={place.color}
            />
          );
        }),
      )}

      {/* Chimney for gable / hip roofs */}
      {(place.roof === "gable" || place.roof === "hip") && (
        <group position={[w / 2 - 1.2, h + 1.4, 0.4]}>
          <mesh castShadow>
            <boxGeometry args={[0.7, 1.6, 0.7]} />
            <meshStandardMaterial color={shade(place.facade, 0.3)} roughness={0.9} />
          </mesh>
          <mesh position={[0, 0.9, 0]}>
            <boxGeometry args={[0.9, 0.25, 0.9]} />
            <meshStandardMaterial color={trim} roughness={0.8} />
          </mesh>
        </group>
      )}

      {/* Soft accent glow */}
      <pointLight position={[0, signY, frontZ - 1.4]} color={place.color} intensity={hovered ? 22 : 9} distance={12} decay={2} />

      {/* Proximity prompt */}
      {near && (
        <Text
          position={[0, h + 2.6, frontZ - 0.2]}
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

/* ---------------- Props & environment ---------------- */

function Tree({ position, scale = 1, tone = "#7cc47f" }: { position: [number, number, number]; scale?: number; tone?: string }) {
  return (
    <group position={position} scale={scale}>
      <mesh position={[0, 1, 0]} castShadow>
        <cylinderGeometry args={[0.3, 0.42, 2, 7]} />
        <meshStandardMaterial color="#a9764e" roughness={0.9} />
      </mesh>
      <mesh position={[0, 2.7, 0]} castShadow>
        <sphereGeometry args={[1.5, 12, 12]} />
        <meshStandardMaterial color={tone} roughness={0.9} flatShading />
      </mesh>
      <mesh position={[0.95, 2.1, 0.3]} castShadow>
        <sphereGeometry args={[0.95, 12, 12]} />
        <meshStandardMaterial color={shade(tone, 0.08)} roughness={0.9} flatShading />
      </mesh>
      <mesh position={[-0.85, 2.2, -0.2]} castShadow>
        <sphereGeometry args={[0.85, 12, 12]} />
        <meshStandardMaterial color={tone} roughness={0.9} flatShading />
      </mesh>
    </group>
  );
}

function Bush({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      <mesh position={[0, 0.4, 0]} castShadow>
        <sphereGeometry args={[0.7, 10, 10]} />
        <meshStandardMaterial color="#7bbf74" roughness={0.95} flatShading />
      </mesh>
      <mesh position={[0.5, 0.3, 0.1]} castShadow>
        <sphereGeometry args={[0.5, 10, 10]} />
        <meshStandardMaterial color="#88c97f" roughness={0.95} flatShading />
      </mesh>
    </group>
  );
}

function Lamp({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      <mesh position={[0, 0.25, 0]} castShadow>
        <cylinderGeometry args={[0.35, 0.4, 0.5, 10]} />
        <meshStandardMaterial color="#4b5360" roughness={0.7} />
      </mesh>
      <mesh position={[0, 1.8, 0]} castShadow>
        <cylinderGeometry args={[0.1, 0.14, 3.4, 8]} />
        <meshStandardMaterial color="#5b6472" roughness={0.7} metalness={0.3} />
      </mesh>
      <mesh position={[0, 3.55, 0]}>
        <sphereGeometry args={[0.34, 14, 14]} />
        <meshStandardMaterial color="#fff4cf" emissive="#fff0b8" emissiveIntensity={1.5} roughness={0.4} />
      </mesh>
      <mesh position={[0, 3.85, 0]}>
        <coneGeometry args={[0.3, 0.3, 10]} />
        <meshStandardMaterial color="#3a4150" roughness={0.7} />
      </mesh>
      <pointLight position={[0, 3.55, 0]} color="#fff0c0" intensity={7} distance={9} decay={2} />
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
      {[-0.9, 0.9].map((x) => (
        <mesh key={x} position={[x, 0.25, 0]} castShadow>
          <boxGeometry args={[0.16, 0.5, 0.6]} />
          <meshStandardMaterial color="#7d8794" roughness={0.7} />
        </mesh>
      ))}
    </group>
  );
}

function Fountain() {
  return (
    <group position={[0, 0, 0]}>
      <mesh position={[0, 0.35, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[2.6, 2.9, 0.7, 28]} />
        <meshStandardMaterial color="#e7e0d2" roughness={0.85} />
      </mesh>
      <mesh position={[0, 0.6, 0]}>
        <cylinderGeometry args={[2.3, 2.3, 0.25, 28]} />
        <meshStandardMaterial color="#8ecae6" roughness={0.2} metalness={0.2} transparent opacity={0.9} />
      </mesh>
      <mesh position={[0, 1.1, 0]} castShadow>
        <cylinderGeometry args={[0.4, 0.55, 1.3, 14]} />
        <meshStandardMaterial color="#e7e0d2" roughness={0.85} />
      </mesh>
      <mesh position={[0, 1.85, 0]} castShadow>
        <cylinderGeometry args={[1, 0.3, 0.3, 18]} />
        <meshStandardMaterial color="#e7e0d2" roughness={0.85} />
      </mesh>
      <mesh position={[0, 2.3, 0]}>
        <sphereGeometry args={[0.4, 14, 14]} />
        <meshStandardMaterial color="#8ecae6" roughness={0.2} metalness={0.2} />
      </mesh>
    </group>
  );
}

function WelcomeSign() {
  return (
    <group position={[0, 0, 9.5]}>
      {[-2.2, 2.2].map((x) => (
        <mesh key={x} position={[x, 1.4, 0]} castShadow>
          <cylinderGeometry args={[0.14, 0.16, 2.8, 8]} />
          <meshStandardMaterial color="#8a5a3c" roughness={0.9} />
        </mesh>
      ))}
      <mesh position={[0, 2.5, 0]} castShadow>
        <boxGeometry args={[5.4, 1.5, 0.25]} />
        <meshStandardMaterial color="#a9764e" roughness={0.85} />
      </mesh>
      <mesh position={[0, 2.5, 0.14]}>
        <boxGeometry args={[5, 1.1, 0.05]} />
        <meshStandardMaterial color="#c98a52" roughness={0.8} />
      </mesh>
      <Text position={[0, 2.72, 0.18]} fontSize={0.5} color="#fff7ec" anchorX="center" anchorY="middle" fontWeight={700}>
        CLAY MARTIN
      </Text>
      <Text position={[0, 2.24, 0.18]} fontSize={0.26} color="#ffe9cf" anchorX="center" anchorY="middle" letterSpacing={0.1}>
        UX DESIGNER · EST. 2026
      </Text>
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
    const palette = ["#c4cfe8", "#d2c8e6", "#c7dedd", "#e6d6cc", "#cdd9ec"];
    const arr: { x: number; z: number; w: number; h: number; depth: number; color: string; key: number }[] = [];
    for (let i = 0; i < 50; i++) {
      const ang = (i / 50) * Math.PI * 2 + Math.random() * 0.12;
      const rad = 58 + Math.random() * 60;
      arr.push({
        x: Math.sin(ang) * rad,
        z: -Math.cos(ang) * rad,
        w: 6 + Math.random() * 9,
        depth: 6 + Math.random() * 9,
        h: 10 + Math.random() * 36,
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
          topColor: { value: new THREE.Color("#9fcdf2") },
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
            float hh = normalize(vWorldPosition + vec3(0.0, offset, 0.0)).y;
            float t = pow(max(hh, 0.0), exponent);
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
      {/* Plaza */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
        <planeGeometry args={[44, 44]} />
        <meshStandardMaterial color="#ece4d3" roughness={0.95} />
      </mesh>
      {/* Cobble border ring */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.004, 0]}>
        <ringGeometry args={[20.5, 22, 4, 1]} />
        <meshStandardMaterial color="#c7bca2" roughness={0.95} side={THREE.DoubleSide} />
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
      {/* Medallion */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.012, 0]}>
        <circleGeometry args={[4, 36]} />
        <meshStandardMaterial color="#d3c7a9" roughness={0.9} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.014, 0]}>
        <ringGeometry args={[3.4, 3.8, 36]} />
        <meshStandardMaterial color="#b8ab8c" roughness={0.85} side={THREE.DoubleSide} />
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
      <fog attach="fog" args={["#dfe7ee", 78, 270]} />
      <GradientSky />

      <ambientLight intensity={0.85} />
      <hemisphereLight args={["#dfeefe", "#9ab06a", 0.9]} />
      <directionalLight
        position={[28, 44, 22]}
        intensity={2.3}
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
      <WelcomeSign />

      <Bench position={[0, 0, 6]} rotationY={Math.PI} />
      <Bench position={[0, 0, -6]} />
      <Bench position={[6, 0, 0]} rotationY={Math.PI / 2} />
      <Bench position={[-6, 0, 0]} rotationY={-Math.PI / 2} />

      {([[12, 12], [-12, 12], [12, -12], [-12, -12]] as [number, number][]).map(([x, z], i) => (
        <Lamp key={`l${i}`} position={[x, 0, z]} />
      ))}

      {/* Greenery framing the entrance and corners */}
      {([[16, 15], [-16, 15], [10, 15], [-10, 15]] as [number, number][]).map(([x, z], i) => (
        <Tree key={`tr${i}`} position={[x, 0, z]} scale={0.85 + (i % 2) * 0.3} tone={i % 2 ? "#86cf86" : "#73bd72"} />
      ))}
      {([[8.5, 8.5], [-8.5, 8.5], [8.5, -8.5], [-8.5, -8.5], [13, 0], [-13, 0]] as [number, number][]).map(([x, z], i) => (
        <Bush key={`b${i}`} position={[x, 0, z]} />
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
