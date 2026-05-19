const groups = [
  {
    heading: "Design Tools",
    skills: [
      "Figma",
      "Adobe Photoshop",
      "Adobe Illustrator",
      "InDesign",
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
