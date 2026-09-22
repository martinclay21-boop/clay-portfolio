"use client";

import * as React from "react";
import { motion, useSpring, type SpringOptions } from "framer-motion";

import { cn } from "@/lib/utils";

interface TextRepelProps {
  /** The text content to display. */
  text: string;
  /** Cursor influence radius in pixels. Letters within this distance react. */
  radius?: number;
  /** Maximum displacement in pixels at closest proximity. */
  strength?: number;
  /** Whether letters are pushed away from or pulled toward the cursor. */
  mode?: "repel" | "attract";
  /** Spring stiffness. Higher values make letters snap back faster. */
  stiffness?: number;
  /** Spring damping. Lower values produce bouncier motion. */
  damping?: number;
  /** Spring mass. Higher values make letters feel heavier. */
  mass?: number;
  className?: string;
  letterClassName?: string;
}

type LetterHandle = {
  el: HTMLSpanElement | null;
  setOffset: (x: number, y: number) => void;
};

// Read live rather than using framer's useReducedMotion, which caches at module
// load. The site's CSS reduced-motion reset cannot reach spring-driven inline
// transforms, so this guard is what actually holds the letters still.
function useReducedMotionLive() {
  const [reduced, setReduced] = React.useState(false);

  React.useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduced(query.matches);
    update();
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);

  return reduced;
}

function Letter({
  char,
  spring,
  register,
  className,
}: {
  char: string;
  spring: SpringOptions;
  register: (handle: LetterHandle) => () => void;
  className?: string;
}) {
  const ref = React.useRef<HTMLSpanElement>(null);
  const x = useSpring(0, spring);
  const y = useSpring(0, spring);

  React.useEffect(() => {
    return register({
      el: ref.current,
      setOffset: (nx, ny) => {
        x.set(nx);
        y.set(ny);
      },
    });
  }, [register, x, y]);

  return (
    <motion.span
      ref={ref}
      style={{ x, y }}
      className={cn("inline-block will-change-transform", className)}
    >
      {char === " " ? " " : char}
    </motion.span>
  );
}

export function TextRepel({
  text,
  radius = 120,
  strength = 45,
  mode = "repel",
  stiffness = 180,
  damping = 14,
  mass = 0.4,
  className,
  letterClassName,
}: TextRepelProps) {
  const reduced = useReducedMotionLive();
  const handlesRef = React.useRef<Set<LetterHandle>>(new Set());
  const frameRef = React.useRef<number | null>(null);
  const pointerRef = React.useRef<{ x: number; y: number } | null>(null);

  const spring = React.useMemo<SpringOptions>(
    () => ({ stiffness, damping, mass }),
    [stiffness, damping, mass],
  );

  const register = React.useCallback((handle: LetterHandle) => {
    const handles = handlesRef.current;
    handles.add(handle);
    return () => {
      handles.delete(handle);
    };
  }, []);

  React.useEffect(() => {
    if (reduced) {
      handlesRef.current.forEach((h) => h.setOffset(0, 0));
      return;
    }

    const apply = () => {
      frameRef.current = null;
      const pointer = pointerRef.current;

      handlesRef.current.forEach(({ el, setOffset }) => {
        if (!el) return;
        if (!pointer) {
          setOffset(0, 0);
          return;
        }

        const rect = el.getBoundingClientRect();
        const cx = rect.left + rect.width / 2;
        const cy = rect.top + rect.height / 2;
        const dx = cx - pointer.x;
        const dy = cy - pointer.y;
        const distance = Math.hypot(dx, dy);

        if (distance >= radius || distance === 0) {
          setOffset(0, 0);
          return;
        }

        // Quadratic falloff so the effect concentrates near the cursor
        const falloff = (1 - distance / radius) ** 2;
        const push = strength * falloff * (mode === "attract" ? -1 : 1);
        setOffset((dx / distance) * push, (dy / distance) * push);
      });
    };

    const schedule = () => {
      if (frameRef.current === null) {
        frameRef.current = requestAnimationFrame(apply);
      }
    };

    const onMove = (event: PointerEvent) => {
      pointerRef.current = { x: event.clientX, y: event.clientY };
      schedule();
    };

    const onLeave = () => {
      pointerRef.current = null;
      schedule();
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerdown", onMove, { passive: true });
    document.addEventListener("pointerleave", onLeave);
    window.addEventListener("blur", onLeave);

    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerdown", onMove);
      document.removeEventListener("pointerleave", onLeave);
      window.removeEventListener("blur", onLeave);
      if (frameRef.current !== null) cancelAnimationFrame(frameRef.current);
    };
  }, [radius, strength, mode, reduced]);

  return (
    <span className={cn("relative inline-block", className)}>
      {/* Letters are split into spans, which screen readers would otherwise
          announce one character at a time. */}
      <span className="sr-only">{text}</span>
      <span aria-hidden="true">
        {text.split("").map((char, i) => (
          <Letter
            key={`${char}-${i}`}
            char={char}
            spring={spring}
            register={register}
            className={letterClassName}
          />
        ))}
      </span>
    </span>
  );
}

export type { TextRepelProps };
