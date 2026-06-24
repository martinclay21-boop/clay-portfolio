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
const LOOK_THRESH = 0.72; // ~44° cone — counts as "looking at" a building
const BOUND_X = 13.5;
const BOUND_Z_NEAR = 15;
const BOUND_Z_FAR = -13.5;

// reusable temp so we don't allocate every frame
const _fwd = new THREE.Vector3();

function shade(hex: string, amt: number) {
  const c = new THREE.Color(hex);
  c.multiplyScalar(1 - amt);
  return `#${c.getHexString()}`;
}

/* ---------------- Procedural textures (client-only, cached) ----------------
   Built on a <canvas> at runtime so there are no external image files to load
   in the static export. Adds real surface variation + bump relief so flat
   boxes catch light unevenly and read as dimensional. */

function canvas2d(size: number) {
  const c = document.createElement("canvas");
  c.width = c.height = size;
  return { c, ctx: c.getContext("2d")! };
}

function makeFacadeMap(color: string): THREE.Texture {
  const { c, ctx } = canvas2d(256);
  ctx.fillStyle = color;
  ctx.fillRect(0, 0, 256, 256);
  // plaster speckle
  for (let i = 0; i < 2600; i++) {
    const a = Math.random() * 0.06;
    ctx.fillStyle = Math.random() > 0.5 ? `rgba(0,0,0,${a})` : `rgba(255,255,255,${a})`;
    ctx.fillRect(Math.random() * 256, Math.random() * 256, 2, 2);
  }
  // faint horizontal courses
  ctx.strokeStyle = "rgba(0,0,0,0.05)";
  ctx.lineWidth = 1;
  for (let y = 0; y < 256; y += 32) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(256, y);
    ctx.stroke();
  }
  const t = new THREE.CanvasTexture(c);
  t.wrapS = t.wrapT = THREE.RepeatWrapping;
  t.repeat.set(2, 2);
  t.anisotropy = 4;
  return t;
}

function makeBump(): THREE.Texture {
  const { c, ctx } = canvas2d(128);
  const img = ctx.createImageData(128, 128);
  for (let i = 0; i < img.data.length; i += 4) {
    const v = 128 + (Math.random() - 0.5) * 70;
    img.data[i] = img.data[i + 1] = img.data[i + 2] = v;
    img.data[i + 3] = 255;
  }
  ctx.putImageData(img, 0, 0);
  const t = new THREE.CanvasTexture(c);
  t.wrapS = t.wrapT = THREE.RepeatWrapping;
  t.repeat.set(4, 4);
  return t;
}

function makeCobble(): THREE.Texture {
  const { c, ctx } = canvas2d(256);
  ctx.fillStyle = "#bcb09a"; // grout
  ctx.fillRect(0, 0, 256, 256);
  const tile = 32;
  for (let gy = 0; gy < 256 / tile; gy++) {
    for (let gx = 0; gx < 256 / tile; gx++) {
      const off = gy % 2 === 0 ? 0 : tile / 2;
      const x = gx * tile + off;
      const y = gy * tile;
      const shadeV = 200 + Math.floor(Math.random() * 30);
      ctx.fillStyle = `rgb(${shadeV},${shadeV - 12},${shadeV - 30})`;
      ctx.beginPath();
      if (typeof ctx.roundRect === "function") {
        ctx.roundRect(x + 2, y + 2, tile - 4, tile - 4, 6);
        ctx.fill();
      } else {
        ctx.fillRect(x + 2, y + 2, tile - 4, tile - 4);
      }
    }
  }
  const t = new THREE.CanvasTexture(c);
  t.wrapS = t.wrapT = THREE.RepeatWrapping;
  t.repeat.set(7, 7);
  t.anisotropy = 4;
  return t;
}

function makeGrass(): THREE.Texture {
  const { c, ctx } = canvas2d(128);
  ctx.fillStyle = "#9cc06f";
  ctx.fillRect(0, 0, 128, 128);
  for (let i = 0; i < 4000; i++) {
    const g = 90 + Math.floor(Math.random() * 70);
    ctx.fillStyle = `rgba(${g - 40},${g + 30},${g - 30},0.5)`;
    ctx.fillRect(Math.random() * 128, Math.random() * 128, 2, 3);
  }
  const t = new THREE.CanvasTexture(c);
  t.wrapS = t.wrapT = THREE.RepeatWrapping;
  t.repeat.set(60, 60);
  return t;
}

// lazy module-level caches (only invoked inside client useMemo)
const _facadeCache = new Map<string, THREE.Texture>();
function getFacadeMap(color: string) {
  if (!_facadeCache.has(color)) _facadeCache.set(color, makeFacadeMap(color));
  return _facadeCache.get(color)!;
}
let _bump: THREE.Texture | null = null;
const getBump = () => (_bump ??= makeBump());
let _cobble: THREE.Texture | null = null;
const getCobble = () => (_cobble ??= makeCobble());
let _grass: THREE.Texture | null = null;
const getGrass = () => (_grass ??= makeGrass());

/* ---------------- Controls ---------------- */

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

// Returns the place the camera is near + looking at, or null. Shared by the
// click handler and per-building highlight so they always agree.
function focusedPlace(camera: THREE.Camera): Place | null {
  camera.getWorldDirection(_fwd);
  const fx = _fwd.x, fz = _fwd.z;
  const flen = Math.hypot(fx, fz) || 1;
  let best: Place | null = null;
  let bestAlign = LOOK_THRESH;
  for (const p of PLACES) {
    const dx = p.position[0] - camera.position.x;
    const dz = p.position[2] - camera.position.z;
    const dist = Math.hypot(dx, dz);
    if (dist > INTERACT_DIST) continue;
    const align = (fx * dx + fz * dz) / (flen * (dist || 1));
    if (align > bestAlign) { bestAlign = align; best = p; }
  }
  return best;
}

// Click → open whatever building you're aiming at (crosshair), independent of
// the OS cursor position which is frozen during pointer lock.
function Interactor({ onSelect, controlsRef }: {
  onSelect: (p: Place) => void;
  controlsRef: React.RefObject<PLCImpl | null>;
}) {
  const { camera, gl } = useThree();
  const onSelectRef = useRef(onSelect);
  onSelectRef.current = onSelect;

  useEffect(() => {
    const handler = () => {
      if (!controlsRef.current?.isLocked) return;
      const p = focusedPlace(camera);
      if (p) onSelectRef.current(p);
    };
    const el = gl.domElement;
    el.addEventListener("click", handler);
    return () => el.removeEventListener("click", handler);
  }, [camera, gl, controlsRef]);

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
        <mesh position={[0, h + 0.35, 0]} castShadow>
          <boxGeometry args={[w + 0.4, 0.7, d + 0.4]} />
          <meshStandardMaterial color={color} roughness={0.8} />
        </mesh>
        <mesh position={[0, h + 0.3, 0]}>
          <boxGeometry args={[w - 0.3, 0.3, d - 0.3]} />
          <meshStandardMaterial color={shade(facade, 0.25)} roughness={0.95} />
        </mesh>
      </group>
    );
  }

  if (style === "gable") {
    const roofH = 2.4;
    const ov = 0.5;
    const run = w / 2 + ov;
    const slope = Math.hypot(run, roofH);
    const ang = Math.atan2(roofH, run);
    const endShape = new THREE.Shape();
    endShape.moveTo(-w / 2, 0);
    endShape.lineTo(w / 2, 0);
    endShape.lineTo(0, roofH);
    endShape.closePath();
    return (
      <group position={[0, h, 0]}>
        <mesh position={[run / 2, roofH / 2, 0]} rotation={[0, 0, -ang]} castShadow>
          <boxGeometry args={[slope, 0.18, d + 2 * ov]} />
          <meshStandardMaterial color={color} roughness={0.75} />
        </mesh>
        <mesh position={[-run / 2, roofH / 2, 0]} rotation={[0, 0, ang]} castShadow>
          <boxGeometry args={[slope, 0.18, d + 2 * ov]} />
          <meshStandardMaterial color={color} roughness={0.75} />
        </mesh>
        <mesh position={[0, roofH, 0]} castShadow>
          <boxGeometry args={[0.22, 0.22, d + 2 * ov]} />
          <meshStandardMaterial color={trim} roughness={0.6} />
        </mesh>
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

  // hip
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

function Building({ place }: { place: Place }) {
  const { camera } = useThree();
  const [active, setActive] = useState(false);
  const groupRef = useRef<THREE.Group>(null);

  const facadeMap = useMemo(() => getFacadeMap(place.facade), [place.facade]);
  const bump = useMemo(() => getBump(), []);

  useFrame(() => {
    const isActive = focusedPlace(camera)?.id === place.id;
    if (isActive !== active) setActive(isActive);
    // gentle hover bob when focused
    if (groupRef.current) {
      const target = isActive ? 0.12 : 0;
      groupRef.current.position.y += (target - groupRef.current.position.y) * 0.15;
    }
  });

  const w = place.width;
  const h = place.height;
  const d = 6;
  const [px, , pz] = place.position;
  const frontZ = -d / 2;
  const f = frontZ - 0.06;

  const signY = Math.min(4.5, h - 0.7);
  const trim = shade(place.color, 0.2);

  const upperWindows: number[] = [];
  for (let y = signY + 1.6; y < h - 0.5; y += 1.9) upperWindows.push(y);
  const upperCols = Math.max(2, Math.round(w / 2.6));

  return (
    <group ref={groupRef} position={[px, 0, pz]} rotation={[0, place.rotationY, 0]}>
      <mesh position={[0, 0.35, 0]} castShadow receiveShadow>
        <boxGeometry args={[w + 0.5, 0.7, d + 0.5]} />
        <meshStandardMaterial color={shade(place.facade, 0.22)} roughness={0.9} />
      </mesh>

      <RoundedBox
        args={[w, h, d]}
        radius={0.28}
        smoothness={4}
        position={[0, h / 2, 0]}
        castShadow
        receiveShadow
      >
        <meshStandardMaterial map={facadeMap} bumpMap={bump} bumpScale={0.04} roughness={0.88} metalness={0} />
      </RoundedBox>

      <Roof style={place.roof} w={w} d={d} h={h} color={place.color} facade={place.facade} />

      {/* Storefront */}
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

      <Awning span={Math.min(w - 0.4, 5)} y={3.0} z={frontZ - 0.7} color={place.color} />

      {/* Sign fascia */}
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
        >
          {place.title}
        </Text>
      </group>

      {upperWindows.map((y, ri) =>
        Array.from({ length: upperCols }).map((_, ci) => {
          const x = -w / 2 + (w / upperCols) * (ci + 0.5);
          return (
            <Window key={`${ri}-${ci}`} x={x} y={y} frontZ={f} w={1.2} h={1.5} withBox={ri === 0} flower={place.color} />
          );
        }),
      )}

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

      <pointLight position={[0, signY, frontZ - 1.4]} color={place.color} intensity={active ? 24 : 9} distance={12} decay={2} />

      {active && (
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
        <meshStandardMaterial color="#a9764e" roughness={0.9} flatShading />
      </mesh>
      <mesh position={[0, 2.7, 0]} castShadow>
        <icosahedronGeometry args={[1.5, 1]} />
        <meshStandardMaterial color={tone} roughness={0.9} flatShading />
      </mesh>
      <mesh position={[0.95, 2.1, 0.3]} castShadow>
        <icosahedronGeometry args={[0.95, 1]} />
        <meshStandardMaterial color={shade(tone, 0.08)} roughness={0.9} flatShading />
      </mesh>
      <mesh position={[-0.85, 2.2, -0.2]} castShadow>
        <icosahedronGeometry args={[0.85, 1]} />
        <meshStandardMaterial color={tone} roughness={0.9} flatShading />
      </mesh>
    </group>
  );
}

function Bush({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      <mesh position={[0, 0.4, 0]} castShadow>
        <icosahedronGeometry args={[0.7, 1]} />
        <meshStandardMaterial color="#7bbf74" roughness={0.95} flatShading />
      </mesh>
      <mesh position={[0.5, 0.3, 0.1]} castShadow>
        <icosahedronGeometry args={[0.5, 1]} />
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
      <Text position={[0, 2.72, 0.18]} fontSize={0.5} color="#fff7ec" anchorX="center" anchorY="middle">
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
  const cobble = useMemo(() => getCobble(), []);
  const grass = useMemo(() => getGrass(), []);
  const bump = useMemo(() => getBump(), []);
  return (
    <>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.02, 0]} receiveShadow>
        <planeGeometry args={[800, 800]} />
        <meshStandardMaterial map={grass} color="#aacb80" roughness={1} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
        <planeGeometry args={[44, 44]} />
        <meshStandardMaterial map={cobble} bumpMap={bump} bumpScale={0.06} color="#eee7d8" roughness={0.95} />
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

      {/* More contrast for dimensional form: stronger key, less fill */}
      <ambientLight intensity={0.5} />
      <hemisphereLight args={["#dfeefe", "#8f9a64", 0.55]} />
      <directionalLight
        position={[26, 40, 20]}
        intensity={3.1}
        color="#fff2da"
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
      {/* cool rim/fill from the opposite side so shadows aren't muddy */}
      <directionalLight position={[-22, 16, -18]} intensity={0.5} color="#adc4e0" />

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
        <Building key={p.id} place={p} />
      ))}

      <PointerLockControls ref={controlsRef} />
      <PlayerController controlsRef={controlsRef} />
      <Interactor onSelect={onSelectPlace} controlsRef={controlsRef} />
    </>
  );
}
