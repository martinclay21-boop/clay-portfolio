"use client";

import React, { useEffect, useRef, useState } from "react";
import { useScroll, useTransform, motion, MotionValue } from "framer-motion";

import { cn } from "@/lib/utils";

// Read live rather than using framer's useReducedMotion, which caches at module
// load. The site's CSS reduced-motion reset cannot reach transforms that the
// scroll progress writes as inline styles.
function useReducedMotionLive() {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduced(query.matches);
    update();
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);

  return reduced;
}

export const ContainerScroll = ({
  titleComponent,
  children,
  className,
  cardClassName,
}: {
  titleComponent: string | React.ReactNode;
  children: React.ReactNode;
  className?: string;
  cardClassName?: string;
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: containerRef });
  const [isMobile, setIsMobile] = useState(false);
  const reduced = useReducedMotionLive();

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Upstream shrinks to 0.7 on mobile, which suits a screenshot but renders
  // body copy around 11px. This card holds real text, so it stays near 1.
  const scaleDimensions: [number, number] = isMobile ? [0.92, 1] : [1.05, 1];

  const rotate = useTransform(scrollYProgress, [0, 1], reduced ? [0, 0] : [20, 0]);
  const scale = useTransform(
    scrollYProgress,
    [0, 1],
    reduced ? [1, 1] : scaleDimensions,
  );
  const translate = useTransform(
    scrollYProgress,
    [0, 1],
    reduced ? [0, 0] : [0, -100],
  );

  return (
    <div
      ref={containerRef}
      className={cn(
        "relative flex h-[62rem] items-center justify-center p-2 md:h-[76rem] md:p-20",
        className,
      )}
    >
      <div className="relative w-full py-10 md:py-28" style={{ perspective: "1000px" }}>
        <Header translate={translate} titleComponent={titleComponent} />
        <Card rotate={rotate} scale={scale} className={cardClassName}>
          {children}
        </Card>
      </div>
    </div>
  );
};

export const Header = ({
  translate,
  titleComponent,
}: {
  translate: MotionValue<number>;
  titleComponent: string | React.ReactNode;
}) => {
  return (
    <motion.div
      style={{ translateY: translate }}
      className="mx-auto max-w-5xl text-center"
    >
      {titleComponent}
    </motion.div>
  );
};

export const Card = ({
  rotate,
  scale,
  children,
  className,
}: {
  rotate: MotionValue<number>;
  scale: MotionValue<number>;
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <motion.div
      style={{ rotateX: rotate, scale }}
      className={cn(
        "mx-auto mt-10 w-full max-w-5xl rounded-[30px] border border-slate-200 bg-white/80 p-2 shadow-2xl backdrop-blur md:p-4",
        className,
      )}
    >
      <div className="h-full w-full rounded-2xl bg-white p-6 ring-1 ring-slate-100 md:p-10">
        {children}
      </div>
    </motion.div>
  );
};
