const groups = [
  {
    heading: "Design Tools",
    skills: [
      "Figma",
      "Adobe Photoshop",
      "Adobe Illustrator",
      "InDesign",
      "Inkscape",
      "DaVinci Resolve",
    ],
  },
  {
    heading: "UX Methods",
    skills: [
      "User Research",
      "Usability Testing",
      "Wireframing",
      "Prototyping",
      "Interaction Design",
      "User Flows",
      "Journey Mapping",
      "Service Design",
    ],
  },
  {
    heading: "Tech & Other",
    skills: ["HTML", "CSS", "WordPress", "Google Workspace", "PowerPoint"],
  },
];

const experience = [
  {
    role: "Design Intern",
    org: "Gaming Solutions",
    location: "Indianapolis, IN",
    period: "May – Aug 2023",
    bullets: [
      "Designed graphic and presentation decks for in-between business presentations and a certification award ceremony, improving visual consistency across brand materials.",
      "Supported social media design efforts on paid campaigns and helped implement a candidate management system.",
      "Collaborated with the marketing team to refine visual identity guidelines across social, email, and sales collateral.",
    ],
  },
  {
    role: "Design Intern",
    org: "Sparx",
    location: "Fishers, IN",
    period: "Summer 2024",
    bullets: [
      "Created visuals across 3 product pages with 28 realistic product use-case images using Photoshop and Illustrator.",
      "Participated in weekly cross-functional sales and marketing meetings to align creative deliverables with campaign priorities.",
      "Contributed to a Figma pitch deck aligned with company vision; presented outcomes to leadership to support business growth.",
    ],
  },
  {
    role: "Emerging Technology Practicum",
    org: "Miami University Foundation",
    location: "Oxford, OH",
    period: "Aug 2024 – May 2025",
    bullets: [
      "Designed responsive UI for a donation-focused foundation website using Figma and WordPress.",
      "Focused on clear interaction design so visitors could quickly understand the organization and navigate to the donate page.",
    ],
  },
  {
    role: "Social Media Executive",
    org: "Miami University Men's Club Volleyball",
    location: "Oxford, OH",
    period: "Aug 2024 – May 2025",
    bullets: [
      "Managed social media presence across multiple platforms to promote team activities and increase visibility.",
      "Produced branded graphics for tournaments, tryouts, and campus events using design software.",
      "Livestreamed and uploaded game footage to YouTube, expanding audience reach and engagement.",
    ],
  },
];

export default function Skills() {
  return (
    <section id="skills" className="py-24 px-6 bg-white">
      <div className="max-w-5xl mx-auto">
        <p className="text-xs font-semibold uppercase tracking-widest text-indigo-500 mb-4">
          Capabilities
        </p>
        <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-12">
          Skills &amp; Experience
        </h2>

        {/* Skill groups */}
        <div className="grid sm:grid-cols-3 gap-8 mb-20">
          {groups.map((g) => (
            <div key={g.heading}>
              <h3 className="text-xs font-semibold uppercase tracking-widest text-slate-400 mb-4">
                {g.heading}
              </h3>
              <div className="flex flex-wrap gap-2">
                {g.skills.map((s) => (
                  <span
                    key={s}
                    className="text-sm bg-slate-100 text-slate-700 px-3 py-1 rounded-full"
                  >
                    {s}
                  </span>
                ))}
              </div>
            </div>
          ))}
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
                <p className="font-semibold text-slate-800 text-sm mt-1">
                  {e.org}
                </p>
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
