"use client";

import { useCallback, useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowUp,
  FolderOpen,
  Mail,
  Palette,
  Quote,
  User,
  Wrench,
  type LucideIcon,
} from "lucide-react";

import { Dock, DockIcon, DockItem, DockLabel } from "@/components/ui/dock";
import { useAudience } from "./AudienceContext";
import { orderFor, sectionNavLabel, type SectionKey } from "./content";

const ICONS: Record<SectionKey, LucideIcon> = {
  about: User,
  projects: FolderOpen,
  testimonials: Quote,
  graphics: Palette,
  skills: Wrench,
  contact: Mail,
};

// The dock has no panel behind it, so each circle carries its own surface to
// stay legible over whatever section is scrolling past underneath.
const INACTIVE_ITEM =
  "rounded-full bg-white text-slate-600 shadow-md ring-1 ring-slate-200/80 transition-colors hover:bg-slate-50";
const ACTIVE_ITEM = "rounded-full text-white shadow-md";

function prefersReducedMotion() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export default function SectionDock() {
  const { audience, mounted, gateOpen } = useAudience();
  const order = orderFor(audience);

  const [pastFold, setPastFold] = useState(false);
  const [active, setActive] = useState<SectionKey | null>(null);

  // Only surface the dock once the hero is behind you.
  useEffect(() => {
    const onScroll = () => setPastFold(window.scrollY > window.innerHeight * 0.7);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Highlight whichever section is crossing the middle of the viewport.
  useEffect(() => {
    const els = order
      .map((key) => document.getElementById(key))
      .filter((el): el is HTMLElement => el !== null);
    if (els.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const hit = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (hit) setActive(hit.target.id as SectionKey);
      },
      { rootMargin: "-45% 0px -45% 0px" },
    );

    els.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [order]);

  const jumpTo = useCallback((id: SectionKey) => {
    document.getElementById(id)?.scrollIntoView({
      behavior: prefersReducedMotion() ? "auto" : "smooth",
      block: "start",
    });
  }, []);

  const jumpToTop = useCallback(() => {
    window.scrollTo({
      top: 0,
      behavior: prefersReducedMotion() ? "auto" : "smooth",
    });
  }, []);

  const show = mounted && pastFold && !gateOpen;

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 24 }}
          transition={{ duration: 0.25, ease: "easeOut" }}
          // Hover magnification is a pointer affordance, and at phone widths the
          // dock would sit under the lens switcher. Mobile keeps the nav menu.
          className="fixed bottom-6 left-1/2 z-[70] hidden -translate-x-1/2 md:block"
        >
          <nav aria-label="Jump to section">
            <Dock magnification={64} panelHeight={48}>
              <DockItem
                onClick={jumpToTop}
                aria-label="Back to top"
                className={INACTIVE_ITEM}
              >
                <DockLabel>Top</DockLabel>
                <DockIcon>
                  <ArrowUp className="h-full w-full" />
                </DockIcon>
              </DockItem>

              {order.map((key) => {
                const Icon = ICONS[key];
                const label = sectionNavLabel(key);
                const isActive = active === key;

                return (
                  <DockItem
                    key={key}
                    onClick={() => jumpTo(key)}
                    aria-label={`Jump to ${label}`}
                    aria-current={isActive}
                    className={isActive ? ACTIVE_ITEM : INACTIVE_ITEM}
                    style={
                      isActive ? { background: "var(--accent)" } : undefined
                    }
                  >
                    <DockLabel>{label}</DockLabel>
                    <DockIcon>
                      <Icon className="h-full w-full" />
                    </DockIcon>
                  </DockItem>
                );
              })}
            </Dock>
          </nav>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
