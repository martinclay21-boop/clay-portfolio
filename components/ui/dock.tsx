"use client";

import {
  motion,
  MotionValue,
  useMotionValue,
  useSpring,
  useTransform,
  type SpringOptions,
  AnimatePresence,
} from "framer-motion";
import {
  Children,
  cloneElement,
  createContext,
  isValidElement,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { cn } from "@/lib/utils";

const DOCK_HEIGHT = 128;
const DEFAULT_MAGNIFICATION = 80;
const DEFAULT_DISTANCE = 150;
const DEFAULT_PANEL_HEIGHT = 64;
const DEFAULT_ITEM_SIZE = 40;

type DockProps = {
  children: React.ReactNode;
  className?: string;
  distance?: number;
  panelHeight?: number;
  magnification?: number;
  baseItemSize?: number;
  spring?: SpringOptions;
};

// Injected onto DockLabel / DockIcon by DockItem via cloneElement.
type DockChildProps = {
  width?: MotionValue<number>;
  isHovered?: MotionValue<number>;
};

type DockItemProps = DockChildProps & {
  className?: string;
  children: React.ReactNode;
  onClick?: () => void;
  style?: React.CSSProperties;
  "aria-label"?: string;
  "aria-current"?: boolean;
};
type DockLabelProps = DockChildProps & {
  className?: string;
  children: React.ReactNode;
};
type DockIconProps = DockChildProps & {
  className?: string;
  children: React.ReactNode;
};

type DocContextType = {
  mouseX: MotionValue;
  spring: SpringOptions;
  magnification: number;
  distance: number;
  baseItemSize: number;
  reduced: boolean;
};
type DockProviderProps = {
  children: React.ReactNode;
  value: DocContextType;
};

const DockContext = createContext<DocContextType | undefined>(undefined);

// Read live rather than using framer's useReducedMotion, which caches its
// result at module load. The site's CSS reduced-motion reset cannot reach the
// inline styles the springs write, so this guard is what disables magnification.
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

function DockProvider({ children, value }: DockProviderProps) {
  return <DockContext.Provider value={value}>{children}</DockContext.Provider>;
}

function useDock() {
  const context = useContext(DockContext);
  if (!context) {
    throw new Error("useDock must be used within an DockProvider");
  }
  return context;
}

function Dock({
  children,
  className,
  spring = { mass: 0.1, stiffness: 150, damping: 12 },
  magnification = DEFAULT_MAGNIFICATION,
  distance = DEFAULT_DISTANCE,
  panelHeight = DEFAULT_PANEL_HEIGHT,
  baseItemSize = DEFAULT_ITEM_SIZE,
}: DockProps) {
  const mouseX = useMotionValue(Infinity);
  const isHovered = useMotionValue(0);
  const reduced = useReducedMotionLive();

  const maxHeight = useMemo(() => {
    return Math.max(DOCK_HEIGHT, magnification + magnification / 2 + 4);
  }, [magnification]);

  const heightRow = useTransform(isHovered, [0, 1], [panelHeight, maxHeight]);
  const heightSpring = useSpring(heightRow, spring);
  const staticHeight = useMotionValue(panelHeight);
  const height = reduced ? staticHeight : heightSpring;

  return (
    <motion.div
      style={{ height, scrollbarWidth: "none" }}
      className="mx-2 flex max-w-full items-end overflow-x-auto"
    >
      <motion.div
        onMouseMove={({ pageX }) => {
          if (reduced) return;
          isHovered.set(1);
          mouseX.set(pageX);
        }}
        onMouseLeave={() => {
          isHovered.set(0);
          mouseX.set(Infinity);
        }}
        className={cn("mx-auto flex w-fit gap-4 rounded-2xl px-4", className)}
        style={{ height: panelHeight }}
        role="toolbar"
        aria-label="Section navigation"
      >
        <DockProvider
          value={{ mouseX, spring, distance, magnification, baseItemSize, reduced }}
        >
          {children}
        </DockProvider>
      </motion.div>
    </motion.div>
  );
}

function DockItem({
  children,
  className,
  onClick,
  style,
  "aria-label": ariaLabel,
  "aria-current": ariaCurrent,
}: DockItemProps) {
  const ref = useRef<HTMLButtonElement>(null);
  const { distance, magnification, mouseX, spring, baseItemSize, reduced } =
    useDock();

  const isHovered = useMotionValue(0);

  const mouseDistance = useTransform(mouseX, (val) => {
    const domRect = ref.current?.getBoundingClientRect() ?? { x: 0, width: 0 };
    return val - domRect.x - domRect.width / 2;
  });

  const widthTransform = useTransform(
    mouseDistance,
    [-distance, 0, distance],
    [baseItemSize, magnification, baseItemSize],
  );

  const widthSpring = useSpring(widthTransform, spring);
  const staticWidth = useMotionValue(baseItemSize);
  const width = reduced ? staticWidth : widthSpring;

  return (
    <motion.button
      ref={ref}
      type="button"
      style={{ ...style, width }}
      onClick={onClick}
      onHoverStart={() => isHovered.set(1)}
      onHoverEnd={() => isHovered.set(0)}
      onFocus={() => isHovered.set(1)}
      onBlur={() => isHovered.set(0)}
      className={cn(
        "relative inline-flex items-center justify-center",
        className,
      )}
      aria-label={ariaLabel}
      aria-current={ariaCurrent ? "true" : undefined}
    >
      {Children.map(children, (child) =>
        isValidElement(child)
          ? cloneElement(child as React.ReactElement<DockChildProps>, {
              width,
              isHovered,
            })
          : child,
      )}
    </motion.button>
  );
}

function DockLabel({ children, className, isHovered }: DockLabelProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (!isHovered) return;
    const unsubscribe = isHovered.on("change", (latest) => {
      setIsVisible(latest === 1);
    });
    return () => unsubscribe();
  }, [isHovered]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 0 }}
          animate={{ opacity: 1, y: -10 }}
          exit={{ opacity: 0, y: 0 }}
          transition={{ duration: 0.2 }}
          className={cn(
            "absolute -top-7 left-1/2 w-fit whitespace-pre rounded-md border border-slate-200 bg-white px-2 py-0.5 text-xs font-medium text-slate-700 shadow-sm",
            className,
          )}
          role="tooltip"
          style={{ x: "-50%" }}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function DockIcon({ children, className, width }: DockIconProps) {
  const fallback = useMotionValue(DEFAULT_ITEM_SIZE);
  const source = width ?? fallback;
  const widthTransform = useTransform(source, (val) => val / 2);

  return (
    <motion.div
      style={{ width: widthTransform }}
      className={cn("flex items-center justify-center", className)}
    >
      {children}
    </motion.div>
  );
}

export { Dock, DockIcon, DockItem, DockLabel };
