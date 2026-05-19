const projects = [
  {
    slug: "cuekit",
    title: "CueKit",
    category: "UX Design · Senior Degree Project",
    description:
      "A mental readiness journal and cue system for college volleyball athletes. Led end-to-end design from initial idea through final design, including user research, usability testing, and high-fidelity Figma wireframes.",
    tags: ["Figma", "User Research", "Usability Testing", "Prototyping"],
    accent: "from-indigo-50 to-purple-50",
    dot: "bg-indigo-400",
  },
  {
    slug: "speaksynci-ai",
    title: "SpeakSyncAI",
    category: "UX Design · Concept App",
    description:
      "A concept app providing real-time lecture transcription and AI-generated summaries for deaf and hard-of-hearing students. Focused on accessibility-first design patterns and reducing cognitive load.",
    tags: ["Figma", "Accessibility", "Interaction Design", "User Flows"],
    accent: "from-sky-50 to-cyan-50",
    dot: "bg-sky-400",
  },
  {
    slug: "mu-luxembourg",
    title: "MU Luxembourg Foundation",
    category: "UI Design · WordPress",
    description:
      "Designed the UI for Miami University Luxembourg Foundation's donation-focused website using Figma and WordPress. Created responsive page layouts with clear interaction design to help visitors find and complete the donate flow.",
    tags: ["Figma", "WordPress", "Responsive Design", "UI Design"],
    accent: "from-red-50 to-orange-50",
    dot: "bg-red-400",
  },
  {
    slug: "interactive-yearbook",
    title: "Interactive Yearbook",
    category: "Interaction Design · HCI",
    description:
      "A digital platform redesigning how students capture and revisit college memories. Built during HCI coursework at Korea University in Seoul, exploring interaction models for personalization and digital memory-making.",
    tags: ["Figma", "Interaction Design", "HCI", "Prototyping"],
    accent: "from-emerald-50 to-teal-50",
    dot: "bg-emerald-400",
  },
  {
    slug: "academic-advising",
    title: "Academic Advising Navigation",
    category: "Service Design",
    description:
      "A service design project identifying communication breakdowns in the academic advising process. Prototyped a Canvas and Navigate integration to reduce student confusion around scheduling.",
    tags: ["Service Design", "Journey Mapping", "User Research"],
    accent: "from-amber-50 to-yellow-50",
    dot: "bg-amber-400",
  },
  {
    slug: "spokenote",
    title: "Spokenote Use Cases",
    category: "Visual Design · Marketing",
    description:
      "Designed use case illustrations across 3 pages with 25 realistic product images using Photoshop and Illustrator to communicate real-world Spokenote applications to potential customers and partners.",
    tags: ["Photoshop", "Illustrator", "Figma", "Brand Design"],
    accent: "from-violet-50 to-fuchsia-50",
    dot: "bg-violet-400",
  },
];

export default function Projects() {
  return (
    <section id="projects" className="py-24 px-6 bg-slate-50">
      <div className="max-w-5xl mx-auto">
        <p className="text-xs font-semibold uppercase tracking-widest text-indigo-500 mb-4">
          Work
        </p>
        <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">
          Selected Projects
        </h2>
        <p className="text-slate-500 text-base max-w-xl mb-12">
          A mix of UX, product, and visual design work spanning consumer apps,
          service design, and marketing.
        </p>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((p) => (
            <a
              key={p.title}
              href={`/clay-portfolio/projects/${p.slug}/`}
              className={`rounded-2xl bg-gradient-to-br ${p.accent} border border-white p-6 flex flex-col gap-4 hover:shadow-md hover:-translate-y-0.5 transition-all`}
            >
              <div className="flex items-center gap-2">
                <span className={`w-2.5 h-2.5 rounded-full ${p.dot}`} />
                <span className="text-xs text-slate-500 font-medium">
                  {p.category}
                </span>
              </div>
              <h3 className="text-lg font-bold text-slate-900">{p.title}</h3>
              <p className="text-sm text-slate-600 leading-relaxed flex-1">
                {p.description}
              </p>
              <div className="flex flex-wrap gap-2 pt-2">
                {p.tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-xs bg-white/70 text-slate-600 border border-slate-200 px-2 py-0.5 rounded-full"
                  >
                    {tag}
                  </span>
                ))}
              </div>
              <span className="text-xs font-medium text-indigo-600 mt-1">
                View case study →
              </span>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
