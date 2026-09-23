"use client";

import type { CSSProperties } from "react";
import Nav from "@/components/Nav";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Projects from "@/components/Projects";
import Graphics from "@/components/Graphics";
import Skills from "@/components/Skills";
import Contact from "@/components/Contact";
import ScrollProgress from "@/components/ScrollProgress";
import GradualBlur from "@/components/ui/gradual-blur";
import { AudienceProvider, useAudience } from "./AudienceContext";
import AudienceGate from "./AudienceGate";
import LensSwitcher from "./LensSwitcher";
import SectionDock from "./SectionDock";
import Testimonials from "./Testimonials";
import { orderFor, accentFor, type SectionKey } from "./content";

const SECTIONS: Record<SectionKey, React.ComponentType> = {
  about: About,
  projects: Projects,
  testimonials: Testimonials,
  graphics: Graphics,
  skills: Skills,
  contact: Contact,
};

function AdaptiveSections() {
  const { audience } = useAudience();
  const order = orderFor(audience);
  return (
    <div key={audience ?? "default"} className="section-swap">
      {order.map((key) => {
        const Section = SECTIONS[key];
        return <Section key={key} />;
      })}
    </div>
  );
}

// Carries the per-lens accent color as a CSS variable so the whole site re-tints
function Themed() {
  const { audience } = useAudience();
  const accent = accentFor(audience);
  const style = {
    "--accent": accent,
    "--accent-soft": `${accent}1a`, // ~10% alpha
    // Lighter sibling of the accent, used for the glow behind primary buttons
    "--accent-lift": `color-mix(in oklab, ${accent} 45%, #ffffff)`,
  } as CSSProperties;

  return (
    <div style={style}>
      <ScrollProgress />
      <Nav />
      <main id="main-content">
        <Hero />
        <AdaptiveSections />
      </main>
      {/* Bottom padding clears the fixed blur band. Without it the footer sits
          permanently inside the blur with no way to scroll it out. */}
      <footer className="pt-8 pb-40 text-center text-sm text-slate-500 border-t border-slate-100">
        © {new Date().getFullYear()} Clay Martin. Built with Next.js.
      </footer>

      {/* Full-width blur along the bottom edge, doubling as the surface the
          dock and lens switcher sit on. A `page` target adds 100 to zIndex, so
          the explicit style keeps it under the dock (70) and switcher (80). */}
      <GradualBlur
        target="page"
        position="bottom"
        height="9rem"
        strength={2}
        divCount={6}
        curve="bezier"
        exponential
        opacity={1}
        style={{ zIndex: 60 }}
      />

      <SectionDock />
      <LensSwitcher />
      <AudienceGate />
    </div>
  );
}

export default function Experience() {
  return (
    <AudienceProvider>
      <Themed />
    </AudienceProvider>
  );
}
