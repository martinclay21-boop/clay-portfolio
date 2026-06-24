"use client";

import Nav from "@/components/Nav";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Projects from "@/components/Projects";
import Graphics from "@/components/Graphics";
import Skills from "@/components/Skills";
import Contact from "@/components/Contact";
import { AudienceProvider, useAudience } from "./AudienceContext";
import AudienceGate from "./AudienceGate";
import LensSwitcher from "./LensSwitcher";
import { orderFor, type SectionKey } from "./content";

const SECTIONS: Record<SectionKey, React.ComponentType> = {
  about: About,
  projects: Projects,
  graphics: Graphics,
  skills: Skills,
  contact: Contact,
};

function AdaptiveSections() {
  const { audience } = useAudience();
  const order = orderFor(audience);
  return (
    <>
      {order.map((key) => {
        const Section = SECTIONS[key];
        return <Section key={key} />;
      })}
    </>
  );
}

export default function Experience() {
  return (
    <AudienceProvider>
      <Nav />
      <main>
        <Hero />
        <AdaptiveSections />
      </main>
      <footer className="py-8 text-center text-sm text-slate-400 border-t border-slate-100">
        © {new Date().getFullYear()} Clay Martin. Built with Next.js.
      </footer>

      <LensSwitcher />
      <AudienceGate />
    </AudienceProvider>
  );
}
