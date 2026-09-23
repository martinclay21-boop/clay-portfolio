"use client";

import * as React from "react";

export type BorderGlowProps = {
  children?: React.ReactNode;
  className?: string;
  /** How close the pointer must be to the edge for the glow to appear (0-100). */
  edgeSensitivity?: number;
  /** HSL values for the glow colour, as "H S L" (e.g. "40 80 80"). */
  glowColor?: string;
  backgroundColor?: string;
  /** Corner radius of the card in pixels. */
  borderRadius?: number;
  /** How far the outer glow extends beyond the card in pixels. */
  glowRadius?: number;
  /** Multiplier for glow opacity (0.1-3.0). */
  glowIntensity?: number;
  /** Width of the directional cone mask as a percentage (5-45). */
  coneSpread?: number;
  /** Play an intro sweep animation on mount. */
  animated?: boolean;
  /** Three colours for the mesh-gradient border. Any CSS colour, including var(). */
  colors?: string[];
  fillOpacity?: number;
  /**
   * Keep the glow outside the card: no tinted fill and no inward shadows.
   * Those sit behind the content, so they only show through transparent
   * areas and vanish behind anything opaque such as an image header.
   */
  outerOnly?: boolean;
};

function parseHSL(hslStr: string) {
  const match = hslStr.match(/([\d.]+)\s*([\d.]+)%?\s*([\d.]+)%?/);
  if (!match) return { h: 40, s: 80, l: 80 };
  return { h: parseFloat(match[1]), s: parseFloat(match[2]), l: parseFloat(match[3]) };
}

function buildGlowVars(glowColor: string, intensity: number) {
  const { h, s, l } = parseHSL(glowColor);
  const base = `${h}deg ${s}% ${l}%`;
  const opacities = [100, 60, 50, 40, 30, 20, 10];
  const keys = ["", "-60", "-50", "-40", "-30", "-20", "-10"];
  const vars: Record<string, string> = {};
  for (let i = 0; i < opacities.length; i++) {
    vars[`--glow-color${keys[i]}`] = `hsl(${base} / ${Math.min(opacities[i] * intensity, 100)}%)`;
  }
  return vars;
}

const GRADIENT_POSITIONS = ["80% 55%", "69% 34%", "8% 6%", "41% 38%", "86% 85%", "82% 18%", "51% 4%"];
const GRADIENT_KEYS = [
  "--gradient-one",
  "--gradient-two",
  "--gradient-three",
  "--gradient-four",
  "--gradient-five",
  "--gradient-six",
  "--gradient-seven",
];
const COLOR_MAP = [0, 1, 2, 0, 1, 2, 1];

function buildGradientVars(colors: string[]) {
  const vars: Record<string, string> = {};
  for (let i = 0; i < 7; i++) {
    const c = colors[Math.min(COLOR_MAP[i], colors.length - 1)];
    vars[GRADIENT_KEYS[i]] = `radial-gradient(at ${GRADIENT_POSITIONS[i]}, ${c} 0px, transparent 50%)`;
  }
  vars["--gradient-base"] = `linear-gradient(${colors[0]} 0 100%)`;
  return vars;
}

function isLightColor(color: string) {
  const value = color.trim().replace("#", "");
  if (!/^[\da-f]{3}([\da-f]{3})?$/i.test(value)) return false;
  const hex = value.length === 3 ? value.split("").map((c) => c + c).join("") : value;
  const red = parseInt(hex.slice(0, 2), 16);
  const green = parseInt(hex.slice(2, 4), 16);
  const blue = parseInt(hex.slice(4, 6), 16);
  return red * 0.2126 + green * 0.7152 + blue * 0.0722 > 180;
}

const easeOutCubic = (x: number) => 1 - Math.pow(1 - x, 3);
const easeInCubic = (x: number) => x * x * x;

// Read live rather than trusting a cached value: the sweep writes CSS variables
// from JS every frame, which the site's CSS reduced-motion reset cannot reach.
function prefersReducedMotion() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export default function BorderGlow({
  children,
  className,
  edgeSensitivity = 30,
  glowColor = "40 80 80",
  backgroundColor = "#120F17",
  borderRadius = 28,
  glowRadius = 40,
  glowIntensity = 1.0,
  coneSpread = 25,
  animated = false,
  colors = ["#c084fc", "#f472b6", "#38bdf8"],
  fillOpacity = 0.5,
  outerOnly = false,
}: BorderGlowProps) {
  const cardRef = React.useRef<HTMLDivElement>(null);
  const stopSweepRef = React.useRef<(() => void) | null>(null);

  const handlePointerMove = React.useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    const card = cardRef.current;
    if (!card) return;

    // The sweep writes the angle and proximity every frame, so while it runs
    // the glow ignores the cursor. The pointer wins the moment it arrives.
    stopSweepRef.current?.();

    const rect = card.getBoundingClientRect();
    const cx = rect.width / 2;
    const cy = rect.height / 2;
    const dx = e.clientX - rect.left - cx;
    const dy = e.clientY - rect.top - cy;

    const kx = dx !== 0 ? cx / Math.abs(dx) : Infinity;
    const ky = dy !== 0 ? cy / Math.abs(dy) : Infinity;
    const edge = Math.min(Math.max(1 / Math.min(kx, ky), 0), 1);

    let angle = 0;
    if (dx !== 0 || dy !== 0) {
      angle = Math.atan2(dy, dx) * (180 / Math.PI) + 90;
      if (angle < 0) angle += 360;
    }

    card.style.setProperty("--edge-proximity", `${(edge * 100).toFixed(3)}`);
    card.style.setProperty("--cursor-angle", `${angle.toFixed(3)}deg`);
  }, []);

  React.useEffect(() => {
    const card = cardRef.current;
    if (!animated || !card || prefersReducedMotion()) return;

    // Upstream fires these and forgets them. Track them so a card that stops
    // being active mid-sweep does not keep animating a detached node.
    let cancelled = false;
    const timers: number[] = [];
    const run = ({
      start = 0,
      end = 100,
      duration = 1000,
      delay = 0,
      ease = easeOutCubic,
      onUpdate,
      onEnd,
    }: {
      start?: number;
      end?: number;
      duration?: number;
      delay?: number;
      ease?: (x: number) => number;
      onUpdate: (v: number) => void;
      onEnd?: () => void;
    }) => {
      const t0 = performance.now() + delay;
      const tick = () => {
        if (cancelled) return;
        const t = Math.min((performance.now() - t0) / duration, 1);
        onUpdate(start + (end - start) * ease(t));
        if (t < 1) requestAnimationFrame(tick);
        else onEnd?.();
      };
      timers.push(window.setTimeout(() => requestAnimationFrame(tick), delay));
    };

    const angleStart = 110;
    const angleEnd = 465;
    const setAngle = (v: number) =>
      card.style.setProperty("--cursor-angle", `${(angleEnd - angleStart) * (v / 100) + angleStart}deg`);
    const setEdge = (v: number) => card.style.setProperty("--edge-proximity", `${v}`);

    card.classList.add("sweep-active");
    card.style.setProperty("--cursor-angle", `${angleStart}deg`);

    run({ duration: 500, onUpdate: setEdge });
    run({ ease: easeInCubic, duration: 1500, end: 50, onUpdate: setAngle });
    run({ ease: easeOutCubic, delay: 1500, duration: 2250, start: 50, end: 100, onUpdate: setAngle });
    run({
      ease: easeInCubic,
      delay: 2500,
      duration: 1500,
      start: 100,
      end: 0,
      onUpdate: setEdge,
      onEnd: () => card.classList.remove("sweep-active"),
    });

    const stop = () => {
      cancelled = true;
      timers.forEach(clearTimeout);
      card.classList.remove("sweep-active");
      stopSweepRef.current = null;
    };
    stopSweepRef.current = stop;
    return stop;
  }, [animated]);

  const style = {
    "--card-bg": backgroundColor,
    "--edge-sensitivity": edgeSensitivity,
    "--border-radius": `${borderRadius}px`,
    "--glow-padding": `${glowRadius}px`,
    "--cone-spread": coneSpread,
    "--fill-opacity": fillOpacity,
    ...buildGlowVars(glowColor, glowIntensity),
    ...buildGradientVars(colors),
  } as React.CSSProperties;

  return (
    <div
      ref={cardRef}
      onPointerMove={handlePointerMove}
      // Not cn(): tailwind-merge reads both of these as `border-*` colour
      // utilities, treats them as conflicting and silently drops the base one.
      className={[
        "border-glow-card",
        isLightColor(backgroundColor) && "border-glow-card--light",
        outerOnly && "border-glow-card--outer",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      style={style}
    >
      <span aria-hidden className="edge-light" />
      <div className="border-glow-inner">{children}</div>
    </div>
  );
}
