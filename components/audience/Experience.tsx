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
import { AudienceProvider, useAudience } from "./AudienceContext";
import AudienceGate from "./AudienceGate";
import LensSwitcher from "./LensSwitcher";
import SignatureModule from "./SignatureModule";
import Testimonials from "./Testimonials";
import { orderFor, accentFor, type SectionKey } from "./content";

const SECTIONS: Record<SectionKey, React.ComponentType> = {
  signature: SignatureModule,
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
  } as CSSProperties;

  return (
    <div style={style}>
      <ScrollProgress />
      <Nav />
      <main id="main-content">
        <Hero />
        <AdaptiveSections />
      </main>
      <footer className="py-8 text-center text-sm text-slate-400 border-t border-slate-100">
        © {new Date().getFullYear()} Clay Martin. Built with Next.js.
      </footer>

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
