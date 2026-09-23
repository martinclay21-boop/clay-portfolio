"use client";

import Reveal from "@/components/Reveal";
import { useAudience } from "@/components/audience/AudienceContext";
import { accentFor, projectsIntroFor, projectCtaFor } from "@/components/audience/content";
import BorderGlow from "@/components/ui/border-glow";
import { CardStack, useContainerWidth, type CardStackItem } from "@/components/ui/card-stack";

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
  const { ref, width } = useContainerWidth<HTMLDivElement>();

  const compact = width < 720;
  const cardWidth = compact
    ? Math.max(260, width - 28)
    : Math.round(Math.min(620, Math.max(360, width * 0.42)));

  return {
    ref,
    compact,
    cardWidth,
    cardHeight: compact ? 410 : 440,
    maxVisible: compact ? 3 : 5,
    spreadDeg: compact ? 24 : 40,
    overlap: compact ? 0.3 : 0.42,
  };
}

// Mesh colours for the glowing border, taken from the lens accent so the glow
// re-tints with it instead of carrying upstream's fixed purple, pink and sky.
const GLOW_COLORS = [
  "var(--accent)",
  "var(--accent-lift)",
  "color-mix(in oklab, var(--accent) 70%, #ffffff)",
];

/** BorderGlow takes its glow as an "H S L" string, so convert the accent hex. */
function hexToHslTriplet(hex: string) {
  const v = hex.replace("#", "");
  const r = parseInt(v.slice(0, 2), 16) / 255;
  const g = parseInt(v.slice(2, 4), 16) / 255;
  const b = parseInt(v.slice(4, 6), 16) / 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const l = (max + min) / 2;
  let h = 0;
  let s = 0;
  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    if (max === r) h = (g - b) / d + (g < b ? 6 : 0);
    else if (max === g) h = (b - r) / d + 2;
    else h = (r - g) / d + 4;
    h *= 60;
  }
  return `${Math.round(h)} ${Math.round(s * 100)} ${Math.round(l * 100)}`;
}

function ProjectCardBody({
  p,
  active,
  showOutcome,
  cta,
}: {
  p: Project;
  active: boolean;
  showOutcome: boolean;
  cta: string;
}) {
  return (
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
          {showOutcome ? p.outcome : p.description}
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
  );
}

export default function Projects() {
  const { audience } = useAudience();
  const cta = projectCtaFor(audience);
  const glowColor = hexToHslTriplet(accentFor(audience));
  const { ref, compact, cardWidth, cardHeight, maxVisible, spreadDeg, overlap } = useStackSize();

  // The background picks up where the hero gradient ends and dissolves to
  // white, so the wash carries behind the cards and disappears into Skills.
  return (
    <section id="projects" className="py-24 bg-gradient-to-b from-indigo-50 via-white to-white">
      <div className="max-w-6xl mx-auto px-6">
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
      </div>

      {/* Full-bleed. Clipping at the viewport edge reads as cards running off
          screen; clipping at the container edge looked like a hard slice. */}
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
            unstyledCards
            renderCard={(p, { active }) => {
              const body = (
                <ProjectCardBody
                  p={p}
                  active={active}
                  showOutcome={audience === "recruiter"}
                  cta={cta}
                />
              );

              // Only the front card glows. It mounts fresh each time a new
              // project comes forward, so the intro sweep marks the change.
              return active ? (
                <BorderGlow
                  className="h-full shadow-xl"
                  backgroundColor="#ffffff"
                  borderRadius={24}
                  glowRadius={36}
                  glowColor={glowColor}
                  colors={GLOW_COLORS}
                  animated
                  outerOnly
                  // Outer-only loses the inner wash that carried most of the
                  // visible colour, so the halo runs stronger to compensate.
                  glowIntensity={1.6}
                >
                  {body}
                </BorderGlow>
              ) : (
                <div className="h-full overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-xl">
                  {body}
                </div>
              );
            }}
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
    </section>
  );
}
