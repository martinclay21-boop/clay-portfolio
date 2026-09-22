"use client";

import { useEffect, useRef, useState } from "react";
import Reveal from "@/components/Reveal";
import { useAudience } from "@/components/audience/AudienceContext";
import { projectsIntroFor, projectCtaFor } from "@/components/audience/content";
import { CardStack, type CardStackItem } from "@/components/ui/card-stack";

const BASE = "/clay-portfolio";

type Project = CardStackItem & {
  slug: string;
  category: string;
  outcome: string;
  description: string;
  tags: string[];
  accent: string;
  preview: string;
};

const projects: Project[] = [
  {
    id: "cuekit",
    slug: "cuekit",
    title: "CueKit",
    category: "UX Design · Senior Degree Project",
    outcome:
      "Took a mental-readiness tool from research and usability testing to a high-fidelity prototype.",
    description:
      "A mental readiness journal and cue system for college volleyball athletes, end-to-end design from research to high-fidelity Figma prototype.",
    tags: ["Figma", "User Research", "Usability Testing"],
    accent: "from-indigo-100 via-purple-50 to-white",
    imageSrc: `${BASE}/images/cuekit/logo.jpg`,
    preview: "🏐",
  },
  {
    id: "speaksynci-ai",
    slug: "speaksynci-ai",
    title: "SpeakSyncAI",
    category: "UX Design · Concept App",
    outcome:
      "Accessibility-first concept: real-time captions and AI summaries for deaf and hard-of-hearing students.",
    description:
      "Real-time lecture transcription and AI-generated summaries for deaf and hard-of-hearing students. Accessibility-first design.",
    tags: ["Figma", "Accessibility", "Interaction Design"],
    accent: "from-sky-100 via-cyan-50 to-white",
    imageSrc: `${BASE}/images/speaksynci/three-phone-mockup.png`,
    preview: "🎧",
  },
  {
    id: "mu-luxembourg",
    slug: "mu-luxembourg",
    title: "MU Luxembourg Foundation",
    category: "UI Design · WordPress",
    outcome:
      "Built a responsive donation UI that guides visitors to the donate page fast (Figma + WordPress).",
    description:
      "Donation-focused foundation website with responsive page layouts and clear interaction design that guides visitors to the donate flow.",
    tags: ["Figma", "WordPress", "UI Design"],
    accent: "from-red-100 via-orange-50 to-white",
    imageSrc: `${BASE}/images/mu-luxembourg/logo.png`,
    preview: "🎓",
  },
  {
    id: "interactive-yearbook",
    slug: "interactive-yearbook",
    title: "Interactive Yearbook",
    category: "Interaction Design · HCI",
    outcome:
      "Reimagined the yearbook as a personalized multimedia experience, built in Figma at Korea University.",
    description:
      "A digital platform reimagining yearbooks as personalized, multimedia experiences, built during HCI coursework at Korea University.",
    tags: ["Figma", "HCI", "Prototyping"],
    accent: "from-emerald-100 via-teal-50 to-white",
    imageSrc: `${BASE}/images/fourward/login.webp`,
    preview: "📖",
  },
  {
    id: "academic-advising",
    slug: "academic-advising",
    title: "Academic Advising",
    category: "Service Design",
    outcome:
      "Mapped advising communication breakdowns and prototyped a Canvas + Navigate fix.",
    description:
      "Identified communication breakdowns in Miami's advising process; prototyped a Canvas + Navigate integration to reduce student confusion.",
    tags: ["Service Design", "Journey Mapping"],
    accent: "from-amber-100 via-yellow-50 to-white",
    preview: "🧭",
  },
  {
    id: "spokenote",
    slug: "spokenote",
    title: "Spokenote Use Cases",
    category: "Visual Design · Marketing",
    outcome:
      "Produced 25 product use-case images across 3 pages, sharpening product clarity.",
    description:
      "Use case illustrations across product pages using Photoshop and Illustrator, communicating Spokenote to potential customers and partners.",
    tags: ["Photoshop", "Illustrator", "Brand"],
    accent: "from-violet-100 via-fuchsia-50 to-white",
    imageSrc: `${BASE}/images/spokenote/logo-opengraph.png`,
    preview: "✨",
  },
];

/** Card geometry that fits the container, since the stack is absolutely sized. */
function useStackSize() {
  const ref = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(1024);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new ResizeObserver(([entry]) => {
      setWidth(entry.contentRect.width);
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const compact = width < 720;
  const cardWidth = Math.round(Math.min(compact ? width - 24 : 460, Math.max(260, width * 0.62)));

  return {
    ref,
    compact,
    cardWidth,
    cardHeight: compact ? 400 : 380,
    maxVisible: compact ? 3 : 5,
    spreadDeg: compact ? 24 : 40,
    overlap: compact ? 0.3 : 0.42,
  };
}

export default function Projects() {
  const { audience } = useAudience();
  const cta = projectCtaFor(audience);
  const { ref, compact, cardWidth, cardHeight, maxVisible, spreadDeg, overlap } = useStackSize();

  return (
    <section id="projects" className="py-24 px-6 bg-slate-50">
      <div className="max-w-6xl mx-auto">
        <Reveal>
          <p className="text-xs font-semibold uppercase tracking-widest mb-4" style={{ color: "var(--accent)" }}>
            Work
          </p>
          <h2 className="text-4xl sm:text-5xl font-bold text-slate-900 mb-4 leading-tight">
            <span className="font-[family-name:var(--font-serif)] italic font-normal" style={{ color: "var(--accent)" }}>
              Projects
            </span>
          </h2>
          <p className="text-slate-500 text-base max-w-xl mb-12">
            {projectsIntroFor(audience)}
          </p>
        </Reveal>

        <div ref={ref}>
          <CardStack<Project>
            items={projects}
            label="Case studies"
            maxVisible={maxVisible}
            cardWidth={cardWidth}
            cardHeight={cardHeight}
            spreadDeg={spreadDeg}
            overlap={overlap}
            depthPx={compact ? 80 : 130}
            renderCard={(p, { active }) => (
              <article className="flex h-full flex-col">
                <div
                  className={`relative flex h-40 shrink-0 items-center justify-center overflow-hidden bg-gradient-to-br ${p.accent}`}
                >
                  {p.imageSrc ? (
                    /* eslint-disable-next-line @next/next/no-img-element */
                    <img
                      src={p.imageSrc}
                      alt=""
                      className="absolute inset-0 h-full w-full object-contain p-4"
                      draggable={false}
                    />
                  ) : (
                    <span className="text-6xl" aria-hidden>
                      {p.preview}
                    </span>
                  )}
                </div>

                <div className="flex flex-1 flex-col gap-2 p-5">
                  <span className="text-xs font-medium text-slate-500">{p.category}</span>
                  <h3 className="text-lg font-bold leading-snug text-slate-900">{p.title}</h3>
                  <p className="line-clamp-3 flex-1 text-sm leading-relaxed text-slate-600">
                    {audience === "recruiter" ? p.outcome : p.description}
                  </p>

                  <div className="flex flex-wrap gap-1.5">
                    {p.tags.map((tag) => (
                      <span key={tag} className="rounded-full bg-slate-100 px-2.5 py-1 text-xs text-slate-600">
                        {tag}
                      </span>
                    ))}
                  </div>

                  {/* Only the front card is reachable; the rest are aria-hidden,
                      so their links must stay out of the tab order. */}
                  <a
                    href={`${BASE}/projects/${p.slug}/`}
                    tabIndex={active ? undefined : -1}
                    className="mt-1 inline-flex w-fit items-center gap-1 text-sm font-medium transition-all hover:gap-2"
                    style={{ color: "var(--accent)" }}
                  >
                    {cta}
                    <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </a>
                </div>
              </article>
            )}
          />
        </div>

        {/* The stack only exposes the front card, so every case study still gets
            a plain reachable link here for keyboard users and crawlers. */}
        <nav aria-label="All case studies" className="sr-only">
          <ul>
            {projects.map((p) => (
              <li key={p.slug}>
                <a href={`${BASE}/projects/${p.slug}/`}>{p.title}</a>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </section>
  );
}
