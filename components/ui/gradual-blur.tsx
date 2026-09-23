"use client";

import * as React from "react";

import { cn } from "@/lib/utils";

type Position = "top" | "bottom" | "left" | "right";
type Curve = "linear" | "bezier" | "ease-in" | "ease-out" | "ease-in-out";
type Target = "parent" | "page";

export type GradualBlurProps = {
  /** Edge to attach the blur overlay. */
  position?: Position;
  /** Base blur strength multiplier (affects each layer). */
  strength?: number;
  /** Overlay height (for top / bottom positions). */
  height?: string;
  /** Custom width. Defaults to 100% for vertical positions. */
  width?: string;
  /** Number of stacked blur layers (higher = smoother gradient). */
  divCount?: number;
  /** Use exponential progression for stronger end blur. */
  exponential?: boolean;
  /** Distribution curve applied to layer progression. */
  curve?: Curve;
  /** Opacity applied to each blur layer. */
  opacity?: number;
  /** Fade in (true) or reveal on scroll ("scroll"). */
  animated?: boolean | "scroll";
  duration?: string;
  easing?: string;
  /** Multiplier applied to strength while hovered. */
  hoverIntensity?: number;
  /** Position relative to parent container or the entire page (fixed). */
  target?: Target;
  preset?: keyof typeof PRESETS;
  responsive?: boolean;
  /** Base z-index. A `page` target adds +100; override via `style` if needed. */
  zIndex?: number;
  onAnimationComplete?: () => void;
  className?: string;
  style?: React.CSSProperties;
};

const DEFAULT_CONFIG = {
  position: "bottom" as Position,
  strength: 2,
  height: "6rem",
  divCount: 5,
  exponential: false,
  zIndex: 1000,
  animated: false as boolean | "scroll",
  duration: "0.3s",
  easing: "ease-out",
  opacity: 1,
  curve: "linear" as Curve,
  responsive: false,
  target: "parent" as Target,
  className: "",
  style: {} as React.CSSProperties,
};

const PRESETS: Record<string, Partial<GradualBlurProps>> = {
  top: { position: "top", height: "6rem" },
  bottom: { position: "bottom", height: "6rem" },
  left: { position: "left", height: "6rem" },
  right: { position: "right", height: "6rem" },
  subtle: { height: "4rem", strength: 1, opacity: 0.8, divCount: 3 },
  intense: { height: "10rem", strength: 4, divCount: 8, exponential: true },
  smooth: { height: "8rem", curve: "bezier", divCount: 10 },
  sharp: { height: "5rem", curve: "linear", divCount: 4 },
  header: { position: "top", height: "8rem", curve: "ease-out" },
  footer: { position: "bottom", height: "8rem", curve: "ease-out" },
  sidebar: { position: "left", height: "6rem", strength: 2.5 },
  "page-header": { position: "top", height: "10rem", target: "page", strength: 3 },
  "page-footer": { position: "bottom", height: "10rem", target: "page", strength: 3 },
};

const CURVE_FUNCTIONS: Record<Curve, (p: number) => number> = {
  linear: (p) => p,
  bezier: (p) => p * p * (3 - 2 * p),
  "ease-in": (p) => p * p,
  "ease-out": (p) => 1 - Math.pow(1 - p, 2),
  "ease-in-out": (p) => (p < 0.5 ? 2 * p * p : 1 - Math.pow(-2 * p + 2, 2) / 2),
};

const GRADIENT_DIRECTION: Record<Position, string> = {
  top: "to top",
  bottom: "to bottom",
  left: "to left",
  right: "to right",
};

function useIntersectionObserver(
  ref: React.RefObject<HTMLDivElement | null>,
  shouldObserve = false,
) {
  const [isVisible, setIsVisible] = React.useState(!shouldObserve);

  React.useEffect(() => {
    if (!shouldObserve || !ref.current) return;
    const observer = new IntersectionObserver(
      ([entry]) => setIsVisible(entry.isIntersecting),
      { threshold: 0.1 },
    );
    observer.observe(ref.current);
    return () => observer.disconnect();
  }, [ref, shouldObserve]);

  return isVisible;
}

function GradualBlur(props: GradualBlurProps) {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = React.useState(false);

  const preset = props.preset ? PRESETS[props.preset] : undefined;
  const config = { ...DEFAULT_CONFIG, ...preset, ...props };

  const isVisible = useIntersectionObserver(
    containerRef,
    config.animated === "scroll",
  );

  const blurDivs = React.useMemo(() => {
    const divs: React.ReactNode[] = [];
    const increment = 100 / config.divCount;
    const currentStrength =
      isHovered && config.hoverIntensity
        ? config.strength * config.hoverIntensity
        : config.strength;
    const curveFunc = CURVE_FUNCTIONS[config.curve] ?? CURVE_FUNCTIONS.linear;

    for (let i = 1; i <= config.divCount; i++) {
      const progress = curveFunc(i / config.divCount);

      const blurValue = config.exponential
        ? Math.pow(2, progress * 4) * 0.0625 * currentStrength
        : 0.0625 * (progress * config.divCount + 1) * currentStrength;

      const p1 = Math.round((increment * i - increment) * 10) / 10;
      const p2 = Math.round(increment * i * 10) / 10;
      const p3 = Math.round((increment * i + increment) * 10) / 10;
      const p4 = Math.round((increment * i + increment * 2) * 10) / 10;

      let gradient = `transparent ${p1}%, black ${p2}%`;
      if (p3 <= 100) gradient += `, black ${p3}%`;
      if (p4 <= 100) gradient += `, transparent ${p4}%`;

      const mask = `linear-gradient(${GRADIENT_DIRECTION[config.position]}, ${gradient})`;

      divs.push(
        <div
          key={i}
          style={{
            position: "absolute",
            inset: 0,
            maskImage: mask,
            WebkitMaskImage: mask,
            backdropFilter: `blur(${blurValue.toFixed(3)}rem)`,
            WebkitBackdropFilter: `blur(${blurValue.toFixed(3)}rem)`,
            opacity: config.opacity,
            transition:
              config.animated && config.animated !== "scroll"
                ? `backdrop-filter ${config.duration} ${config.easing}`
                : undefined,
          }}
        />,
      );
    }

    return divs;
  }, [
    config.divCount,
    config.strength,
    config.curve,
    config.exponential,
    config.position,
    config.opacity,
    config.animated,
    config.duration,
    config.easing,
    config.hoverIntensity,
    isHovered,
  ]);

  const isVertical = config.position === "top" || config.position === "bottom";
  const isPageTarget = config.target === "page";

  const containerStyle: React.CSSProperties = {
    position: isPageTarget ? "fixed" : "absolute",
    pointerEvents: config.hoverIntensity ? "auto" : "none",
    isolation: "isolate",
    opacity: isVisible ? 1 : 0,
    transition: config.animated
      ? `opacity ${config.duration} ${config.easing}`
      : undefined,
    zIndex: isPageTarget ? config.zIndex + 100 : config.zIndex,
    ...(isVertical
      ? {
          height: config.height,
          width: config.width ?? "100%",
          [config.position]: 0,
          left: 0,
          right: 0,
        }
      : {
          width: config.width ?? config.height,
          height: "100%",
          [config.position]: 0,
          top: 0,
          bottom: 0,
        }),
    // Spread last so callers can override anything above, z-index included.
    ...config.style,
  };

  const { animated, onAnimationComplete, duration } = config;
  React.useEffect(() => {
    if (isVisible && animated === "scroll" && onAnimationComplete) {
      const ms = parseFloat(duration) * 1000;
      const t = setTimeout(() => onAnimationComplete(), ms);
      return () => clearTimeout(t);
    }
  }, [isVisible, animated, onAnimationComplete, duration]);

  return (
    <div
      ref={containerRef}
      aria-hidden
      className={cn(
        "pointer-events-none",
        !isPageTarget && "overflow-hidden",
        config.className,
      )}
      style={containerStyle}
      onMouseEnter={config.hoverIntensity ? () => setIsHovered(true) : undefined}
      onMouseLeave={config.hoverIntensity ? () => setIsHovered(false) : undefined}
    >
      <div className="pointer-events-none relative h-full w-full">{blurDivs}</div>
    </div>
  );
}

const GradualBlurMemo = React.memo(GradualBlur);
GradualBlurMemo.displayName = "GradualBlur";

export { PRESETS, CURVE_FUNCTIONS };
export default GradualBlurMemo;
