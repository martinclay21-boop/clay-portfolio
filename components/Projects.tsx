const projects = [
  {
    title: "Spirra",
    category: "UX Design · Mobile App",
    description:
      "A mental readiness journal and cue system for college volleyball athletes. Led end-to-end design from discovery to final prototype, including user research, usability testing, wireframing, and high-fidelity Figma prototypes.",
    tags: ["Figma", "User Research", "Usability Testing", "Prototyping"],
    accent: "from-indigo-50 to-purple-50",
    dot: "bg-indigo-400",
  },
  {
    title: "SpeakSync AI",
    category: "UX Design · Concept App",
    description:
      "A concept app providing live captions and AI-generated summaries for students with hearing loss. Focused on accessibility-first design patterns and reducing cognitive load in lecture environments.",
    tags: ["Figma", "Accessibility", "Interaction Design", "User Flows"],
    accent: "from-sky-50 to-cyan-50",
    dot: "bg-sky-400",
  },
  {
    title: "MU Foundation Website",
    category: "UI Design · WordPress",
    description:
      "Redesigned the UI for Miami University Foundation's donation-focused website. Used Figma and WordPress to create responsive page layouts with clear interaction design, helping visitors quickly find and complete the donate flow.",
    tags: ["Figma", "WordPress", "Responsive Design", "UI Design"],
    accent: "from-red-50 to-orange-50",
    dot: "bg-red-400",
  },
  {
    title: "Interactive Yearbook",
    category: "Interaction Design · HCI",
    description:
      "Developed an interactive yearbook interface during HCI coursework at Korea University in Seoul. Explored interaction models for browsing and memory recall within a digital artifact context.",
    tags: ["Figma", "Interaction Design", "HCI", "Prototyping"],
    accent: "from-emerald-50 to-teal-50",
    dot: "bg-emerald-400",
  },
  {
    title: "Academic Advising Navigation",
    category: "Service Design",
    description:
      "A service design project addressing communication breakdowns in the student academic advising experience. Mapped the full service journey and proposed touchpoint improvements to reduce student confusion.",
    tags: ["Service Design", "Journey Mapping", "User Research"],
    accent: "from-amber-50 to-yellow-50",
    dot: "bg-amber-400",
  },
  {
    title: "Spokenote Use Cases",
    category: "Visual Design · Marketing",
    description:
      "Created visuals across 3 product pages with 28 realistic product use-case images using Photoshop and Illustrator. Collaborated with the design team to ensure brand consistency and contributed to a Figma pitch deck.",
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
            <article
              key={p.title}
              className={`rounded-2xl bg-gradient-to-br ${p.accent} border border-white p-6 flex flex-col gap-4 hover:shadow-md transition-shadow`}
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
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
