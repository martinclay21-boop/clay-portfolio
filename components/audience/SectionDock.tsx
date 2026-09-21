"use client";

import { useCallback, useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowUp,
  FolderOpen,
  Mail,
  Palette,
  Quote,
  Sparkles,
  User,
  Workflow,
  Wrench,
  type LucideIcon,
} from "lucide-react";

import { Dock, DockIcon, DockItem, DockLabel } from "@/components/ui/dock";
import { useAudience } from "./AudienceContext";
import { orderFor, sectionNavLabel, type SectionKey } from "./content";

const ICONS: Record<SectionKey, LucideIcon> = {
  signature: Sparkles,
  about: User,
  projects: FolderOpen,
  testimonials: Quote,
  graphics: Palette,
  skills: Wrench,
  contact: Mail,
};

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
            <Dock
              className="border border-slate-200 bg-white/90 shadow-lg backdrop-blur-md"
              magnification={64}
              panelHeight={56}
            >
              <DockItem
                onClick={jumpToTop}
                aria-label="Back to top"
                className="aspect-square rounded-full bg-slate-100 text-slate-600 transition-colors hover:bg-slate-200"
              >
                <DockLabel>Top</DockLabel>
                <DockIcon>
                  <ArrowUp className="h-full w-full" />
                </DockIcon>
              </DockItem>

              {order.map((key) => {
                const Icon =
                  key === "signature" && audience === "designer"
                    ? Workflow
                    : ICONS[key];
                const label = sectionNavLabel(key, audience);
                const isActive = active === key;

                return (
                  <DockItem
                    key={key}
                    onClick={() => jumpTo(key)}
                    aria-label={`Jump to ${label}`}
                    aria-current={isActive}
                    className={
                      isActive
                        ? "aspect-square rounded-full text-white"
                        : "aspect-square rounded-full bg-slate-100 text-slate-600 transition-colors hover:bg-slate-200"
                    }
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
