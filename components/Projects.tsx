"use client";

import Reveal from "@/components/Reveal";
import { useAudience } from "@/components/audience/AudienceContext";
import { projectsIntroFor } from "@/components/audience/content";

const BASE = "/clay-portfolio";

const projects = [
  {
    slug: "cuekit",
    title: "CueKit",
    category: "UX Design · Senior Degree Project",
    description:
      "A mental readiness journal and cue system for college volleyball athletes — end-to-end design from research to high-fidelity Figma prototype.",
    tags: ["Figma", "User Research", "Usability Testing"],
    accent: "from-indigo-100 via-purple-50 to-white",
    image: `${BASE}/images/cuekit/logo.jpg`,
    preview: "🏐",
  },
  {
    slug: "speaksynci-ai",
    title: "SpeakSyncAI",
    category: "UX Design · Concept App",
    description:
      "Real-time lecture transcription and AI-generated summaries for deaf and hard-of-hearing students. Accessibility-first design.",
    tags: ["Figma", "Accessibility", "Interaction Design"],
    accent: "from-sky-100 via-cyan-50 to-white",
    image: `${BASE}/images/speaksynci/three-phone-mockup.png`,
    preview: "🎧",
  },
  {
    slug: "mu-luxembourg",
    title: "MU Luxembourg Foundation",
    category: "UI Design · WordPress",
    description:
      "Donation-focused foundation website with responsive page layouts and clear interaction design that guides visitors to the donate flow.",
    tags: ["Figma", "WordPress", "UI Design"],
    accent: "from-red-100 via-orange-50 to-white",
    image: `${BASE}/images/mu-luxembourg/logo.png`,
    preview: "🎓",
  },
  {
    slug: "interactive-yearbook",
    title: "Interactive Yearbook",
    category: "Interaction Design · HCI",
    description:
      "A digital platform reimagining yearbooks as personalized, multimedia experiences — built during HCI coursework at Korea University.",
    tags: ["Figma", "HCI", "Prototyping"],
    accent: "from-emerald-100 via-teal-50 to-white",
    image: `${BASE}/images/fourward/login.webp`,
    preview: "📖",
  },
  {
    slug: "academic-advising",
    title: "Academic Advising",
    category: "Service Design",
    description:
      "Identified communication breakdowns in Miami's advising process; prototyped a Canvas + Navigate integration to reduce student confusion.",
    tags: ["Service Design", "Journey Mapping"],
    accent: "from-amber-100 via-yellow-50 to-white",
    preview: "🧭",
  },
  {
    slug: "spokenote",
    title: "Spokenote Use Cases",
    category: "Visual Design · Marketing",
    description:
      "Use case illustrations across product pages using Photoshop and Illustrator — communicating Spokenote to potential customers and partners.",
    tags: ["Photoshop", "Illustrator", "Brand"],
    accent: "from-violet-100 via-fuchsia-50 to-white",
    image: `${BASE}/images/spokenote/logo-opengraph.png`,
    preview: "✨",
  },
];

export default function Projects() {
  const { audience } = useAudience();
  return (
    <section id="projects" className="py-24 px-6 bg-slate-50">
      <div className="max-w-6xl mx-auto">
        <Reveal>
          <p className="text-xs font-semibold uppercase tracking-widest text-indigo-500 mb-4">
            Work
          </p>
          <h2 className="text-4xl sm:text-5xl font-bold text-slate-900 mb-4 leading-tight">
            <span className="font-[family-name:var(--font-serif)] italic font-normal text-indigo-600">
              Projects
            </span>
          </h2>
          <p className="text-slate-500 text-base max-w-xl mb-16">
            {projectsIntroFor(audience)}
          </p>
        </Reveal>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((p, i) => (
            <Reveal key={p.slug} delay={i * 80}>
              <a
                href={`${BASE}/projects/${p.slug}/`}
                className="group block h-full rounded-3xl bg-white border border-slate-100 overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
              >
                {/* Image / Preview area */}
                <div
                  className={`relative h-48 bg-gradient-to-br ${p.accent} overflow-hidden flex items-center justify-center`}
                >
                  {p.image ? (
                    /* eslint-disable-next-line @next/next/no-img-element */
                    <img
                      src={p.image}
                      alt={p.title}
                      className="absolute inset-0 w-full h-full object-contain p-4 group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <span className="text-7xl group-hover:scale-110 transition-transform duration-500">
                      {p.preview}
                    </span>
                  )}
                  <span className="absolute top-4 left-4 text-xs font-mono text-slate-700 bg-white/80 backdrop-blur px-2 py-1 rounded-full">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                </div>

                {/* Content */}
                <div className="p-6 flex flex-col gap-3">
                  <span className="text-xs text-slate-500 font-medium">
                    {p.category}
                  </span>
                  <h3 className="text-xl font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
                    {p.title}
                  </h3>
                  <p className="text-sm text-slate-600 leading-relaxed flex-1">
                    {p.description}
                  </p>
                  <div className="flex flex-wrap gap-2 pt-2">
                    {p.tags.map((tag) => (
                      <span
                        key={tag}
                        className="text-xs bg-slate-100 text-slate-600 px-2.5 py-1 rounded-full"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                  <span className="inline-flex items-center gap-1 text-xs font-medium text-indigo-600 mt-2 group-hover:gap-2 transition-all">
                    Read case study
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </span>
                </div>
              </a>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
