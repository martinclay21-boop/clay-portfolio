"use client";

import { useState } from "react";
import { useAudience } from "@/components/audience/AudienceContext";
import { skillsIntroFor } from "@/components/audience/content";

const groups = [
  {
    heading: "Design Tools",
    color: "indigo",
    skills: ["Figma", "Adobe Photoshop", "Adobe Illustrator", "InDesign", "DaVinci Resolve"],
  },
  {
    heading: "UX Methods",
    color: "sky",
    skills: ["User Research", "Usability Testing", "Wireframing", "Prototyping", "Interaction Design", "User Flows", "Journey Mapping", "Service Design"],
  },
  {
    heading: "Tech & Other",
    color: "emerald",
    skills: ["HTML", "CSS", "WordPress", "Google Workspace", "PowerPoint"],
  },
  {
    heading: "Soft Skills",
    color: "violet",
    skills: ["Empathy", "Communication", "Cross-functional Collaboration", "Problem Solving", "Attention to Detail", "Adaptability", "Presentation", "Critical Thinking"],
  },
];

const colorMap: Record<string, { pill: string; active: string; dot: string }> = {
  indigo: {
    pill: "bg-indigo-50 text-indigo-700 hover:bg-indigo-100 hover:text-indigo-800 hover:shadow-indigo-100",
    active: "bg-indigo-600 text-white shadow-indigo-200",
    dot: "bg-indigo-400",
  },
  sky: {
    pill: "bg-sky-50 text-sky-700 hover:bg-sky-100 hover:text-sky-800 hover:shadow-sky-100",
    active: "bg-sky-500 text-white shadow-sky-200",
    dot: "bg-sky-400",
  },
  emerald: {
    pill: "bg-emerald-50 text-emerald-700 hover:bg-emerald-100 hover:text-emerald-800 hover:shadow-emerald-100",
    active: "bg-emerald-500 text-white shadow-emerald-200",
    dot: "bg-emerald-400",
  },
  violet: {
    pill: "bg-violet-50 text-violet-700 hover:bg-violet-100 hover:text-violet-800 hover:shadow-violet-100",
    active: "bg-violet-500 text-white shadow-violet-200",
    dot: "bg-violet-400",
  },
};

const experience = [
  {
    role: "Intern",
    org: "Damar Staffing Solutions",
    location: "Indianapolis, IN",
    period: "May – Aug 2025",
    bullets: [
      "Designed branded graphics and presentation decks for 4+ inter-business presentations and 1 certification award ceremony, improving visual consistency across brand materials.",
      "Supported end-to-end execution of digital and email campaigns while mapping process gaps and helping implement candidate retention initiatives.",
      "Partnered with the marketing team to refine visual identity guidelines and apply them across social, email, and sales collateral.",
    ],
  },
  {
    role: "Intern",
    org: "Spokenote",
    location: "Fishers, IN",
    period: "May 2023 – Aug 2024",
    bullets: [
      "Updated visuals across 3 pages with 25 realistic product use-case images using Photoshop and Illustrator, improving clarity of product presentation.",
      "Collaborated with the design team to ensure new visuals aligned with brand guidelines and maintained overall site consistency.",
      "Participated in weekly cross-functional sales and marketing meetings to align creative deliverables with campaign priorities.",
      "Delivered 8 design assets (sales one-pagers, pitch decks) aligned with company vision and supported business development initiatives.",
      "Researched outreach efforts to generate 5–10 leads per day and uncover growth opportunities for the business.",
    ],
  },
  {
    role: "Social Media Executive",
    org: "Miami University Men's Club Volleyball",
    location: "Oxford, OH",
    period: "Aug 2024 – May 2025",
    bullets: [
      "Managed social media presence across multiple platforms to promote team activities and increase club visibility.",
      "Produced branded graphics for tournaments, tryouts, and campus fairs using design software to attract new members and communicate event details.",
      "Livestreamed and uploaded game footage to YouTube, expanding audience reach and engagement with team content.",
    ],
  },
];

export default function Skills() {
  const { audience } = useAudience();
  const [active, setActive] = useState<string | null>(null);

  const visibleGroups = active ? groups.filter((g) => g.heading === active) : groups;

  return (
    <section id="skills" className="py-24 px-6 bg-white">
      <div className="max-w-5xl mx-auto">
        <p className="text-xs font-semibold uppercase tracking-widest mb-4" style={{ color: "var(--accent)" }}>
          Capabilities
        </p>
        <h2 className="text-4xl sm:text-5xl font-bold text-slate-900 mb-6 leading-tight">
          Skills &amp;{" "}
          <span className="font-[family-name:var(--font-serif)] italic font-normal" style={{ color: "var(--accent)" }}>
            Experience
          </span>
        </h2>

        <p key={audience ?? "default"} className="text-slate-500 text-base max-w-xl mb-8 hero-swap">
          {skillsIntroFor(audience)}
        </p>

        {/* Category filter tabs */}
        <div className="flex flex-wrap gap-2 mb-10">
          <button
            onClick={() => setActive(null)}
            className={`text-xs font-medium px-4 py-1.5 rounded-full border transition-all duration-200 ${
              active === null
                ? "bg-slate-900 text-white border-slate-900"
                : "bg-white text-slate-500 border-slate-200 hover:border-slate-400 hover:text-slate-700"
            }`}
          >
            All
          </button>
          {groups.map((g) => {
            const c = colorMap[g.color];
            return (
              <button
                key={g.heading}
                onClick={() => setActive(active === g.heading ? null : g.heading)}
                className={`text-xs font-medium px-4 py-1.5 rounded-full border transition-all duration-200 flex items-center gap-1.5 ${
                  active === g.heading
                    ? `${c.active} border-transparent shadow-md`
                    : "bg-white text-slate-500 border-slate-200 hover:border-slate-400 hover:text-slate-700"
                }`}
              >
                <span className={`w-1.5 h-1.5 rounded-full ${active === g.heading ? "bg-white/70" : c.dot}`} />
                {g.heading}
              </button>
            );
          })}
        </div>

        {/* Skill groups */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-20">
          {visibleGroups.map((g) => {
            const c = colorMap[g.color];
            return (
              <div key={g.heading}>
                <h3 className="text-xs font-semibold uppercase tracking-widest text-slate-400 mb-4">
                  {g.heading}
                </h3>
                <div className="flex flex-wrap gap-2">
                  {g.skills.map((s) => (
                    <span
                      key={s}
                      className={`text-xs font-medium px-3 py-1.5 rounded-full cursor-default transition-all duration-150 hover:scale-105 hover:shadow-md ${c.pill}`}
                    >
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* Experience */}
        <h3 className="text-xs font-semibold uppercase tracking-widest text-slate-400 mb-8">
          Experience
        </h3>
        <div className="space-y-10">
          {experience.map((e) => (
            <div
              key={`${e.org}-${e.role}`}
              className="grid sm:grid-cols-[200px_1fr] gap-4 sm:gap-8 pb-10 border-b border-slate-100 last:border-0 last:pb-0"
            >
              <div>
                <p className="text-xs text-slate-400">{e.period}</p>
                <p className="font-semibold text-slate-800 text-sm mt-1">{e.org}</p>
                <p className="text-xs text-slate-500">{e.location}</p>
              </div>
              <div>
                <p className="font-semibold text-slate-900 mb-3">{e.role}</p>
                <ul className="space-y-2">
                  {e.bullets.map((b) => (
                    <li
                      key={b.slice(0, 30)}
                      className="flex gap-2 text-sm text-slate-600 leading-relaxed"
                    >
                      <span className="mt-2 w-1.5 h-1.5 rounded-full bg-indigo-300 shrink-0" />
                      {b}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
