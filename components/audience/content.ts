// All audience-specific copy + structure lives here. Keep everything TRUTHFUL —
// no invented metrics. The wow is that the portfolio reshapes itself per visitor.

export type Audience = "recruiter" | "designer";
export type SectionKey = "signature" | "about" | "projects" | "testimonials" | "graphics" | "skills" | "contact";

export const AUDIENCES: Audience[] = ["recruiter", "designer"];

// Shown in the entry gate + lens switcher
export const AUDIENCE_META: Record<
  Audience,
  { label: string; chip: string; line: string; blurb: string; accent: string }
> = {
  recruiter: {
    label: "Recruiter / Hiring manager",
    chip: "Recruiter",
    line: "Show me the highlights.",
    blurb: "The quick, scannable version of what I do, the proof, and a résumé.",
    accent: "#4f46e5", // indigo-600
  },
  designer: {
    label: "Fellow designer",
    chip: "Designer",
    line: "Walk me through the craft.",
    blurb: "My process, the decisions, and the messy middle.",
    accent: "#0369a1", // sky-700 — passes WCAG AA (~5.9:1) for accent text on white
  },
};

// Order of sections AFTER the hero, per audience. Recruiter leads with the
// scannable TL;DR and hides the "fun" graphics; designer surfaces the craft.
export const SECTION_ORDER: Record<Audience, SectionKey[]> = {
  recruiter: ["signature", "projects", "testimonials", "skills", "about", "contact"],
  designer: ["about", "signature", "projects", "testimonials", "skills", "graphics", "contact"],
};

export const DEFAULT_ORDER: SectionKey[] = ["about", "projects", "testimonials", "graphics", "skills", "contact"];

// Per-lens accent color drives the whole-site vibe (via a --accent CSS var)
export function accentFor(a: Audience | null): string {
  return a ? AUDIENCE_META[a].accent : "#4f46e5";
}

export const RESUME_HREF = "/clay-portfolio/documents/clay-martin-resume.pdf";

export interface HeroCopy {
  eyebrow: string;
  showBadge: boolean;
  headLead: string;   // plain line
  headAccent: string; // serif-italic indigo line
  sub: string;
  primary: { label: string; href: string };
  secondary: { label: string; href: string };
  resume?: { label: string; href: string }; // recruiter résumé download
  quickFacts?: string[]; // recruiter scan-strip
}

export const HERO_DEFAULT: HeroCopy = {
  eyebrow: "Available for opportunities",
  showBadge: true,
  headLead: "Hi, I'm Clay Martin,",
  headAccent: "UX designer & researcher.",
  sub: "I work across the full UX process, from user research and wireframing to prototyping in Figma and usability testing. My focus is understanding the real problem before designing the solution, then refining it until it holds up with users.",
  primary: { label: "View my work", href: "#projects" },
  secondary: { label: "Contact me", href: "#contact" },
};

export const HERO_BY_AUDIENCE: Record<Audience, HeroCopy> = {
  recruiter: {
    eyebrow: "For recruiters & hiring managers",
    showBadge: true,
    headLead: "Research-backed",
    headAccent: "product design.",
    sub: "UX designer and researcher with two design internships and six end-to-end case studies. Strong in user research, usability testing, and turning findings into clear, accessible interfaces.",
    primary: { label: "See the work", href: "#projects" },
    secondary: { label: "Get in touch", href: "#contact" },
    resume: { label: "Résumé", href: RESUME_HREF },
    quickFacts: [
      "End-to-end UX & research",
      "2× design intern",
      "ICAgile Certified",
      "The team's “glue”",
    ],
  },
  designer: {
    eyebrow: "For fellow designers",
    showBadge: false,
    headLead: "Grounded in",
    headAccent: "research and iteration.",
    sub: "My process is research-led: interviews and usability testing up front, then synthesis, wireframing, and several rounds of iteration before anything ships.",
    primary: { label: "See my process", href: "#projects" },
    secondary: { label: "Talk craft", href: "#contact" },
  },
};

// Audience-tuned intro line for the Projects section
export const PROJECTS_INTRO: Record<Audience, string> = {
  recruiter:
    "Six case studies across UX, product, and visual design. Each one links to the full breakdown. Skim the outcomes, dig in where it matters.",
  designer:
    "A mix of UX, product, and visual work. Open any one for the research, the trade-offs, and the iterations that didn't make the final cut.",
};

export const PROJECTS_INTRO_DEFAULT =
  "A mix of UX, product, and visual design work spanning consumer apps, service design, and marketing.";

// ---- About section heading, per lens ----
export interface AboutCopy {
  headLead: string;
  headAccent: string;
}
export const ABOUT_DEFAULT: AboutCopy = {
  headLead: "How I",
  headAccent: "approach design.",
};
export const ABOUT_BY_AUDIENCE: Record<Audience, AboutCopy> = {
  recruiter: { headLead: "A designer who ships,", headAccent: "research to final pixel." },
  designer: { headLead: "Grounded in research,", headAccent: "refined by iteration." },
};
export function aboutFor(a: Audience | null): AboutCopy {
  return a ? ABOUT_BY_AUDIENCE[a] : ABOUT_DEFAULT;
}

// How I work — concrete method statements (About section)
export const PRINCIPLES: { t: string; d: string }[] = [
  { t: "Understand the problem first", d: "I dig into user needs and requirements before proposing a solution, so the design solves the actual problem." },
  { t: "Test with real users", d: "Usability testing and feedback guide the work instead of assumptions." },
  { t: "Iterate toward the details", d: "I refine through multiple rounds, down to spacing, hierarchy, and interaction states." },
  { t: "Design for accessibility", d: "Contrast, structure, and clear interaction are built in from the start, not added at the end." },
];

// ---- Skills section intro line, per lens ----
export const SKILLS_INTRO: Record<Audience, string> = {
  recruiter: "The tools and methods I'm fluent in, and where I've already put them to work.",
  designer: "How I actually work: research- and method-led, tool-agnostic, detail-obsessed.",
};
export const SKILLS_INTRO_DEFAULT =
  "A snapshot of the tools, methods, and soft skills I bring to a team.";
export function skillsIntroFor(a: Audience | null): string {
  return a ? SKILLS_INTRO[a] : SKILLS_INTRO_DEFAULT;
}

// ---- Signature modules (one unique block per lens) ----

// Recruiter: a 15-second "TL;DR" card
export const RECRUITER_TLDR = {
  status: "Open to UX Designer & Researcher roles, also into product design and Agile project management",
  location: "Fishers, IN",
  graduating: "B.A. Emerging Technology, Miami University, May 2026",
  quote:
    "His contributions served as the connective tissue of the sprint. Wherever something felt disconnected, he stepped in and made it feel cohesive.",
  highlights: [
    "6 end-to-end case studies, from research to tested, high-fidelity prototypes",
    "2 design internships (Damar Staffing and Spokenote)",
    "ICAgile Certified · IRB (Human-Subjects) Certified",
  ],
  topSkills: ["Figma", "User Research", "Usability Testing", "Prototyping", "Photoshop", "WordPress", "HTML / CSS"],
  interests: ["Software & Technology", "Healthcare & Pharma", "AI & Emerging Tech", "Agile Project Management"],
};

// Designer: the "how I work" process strip
export const DESIGNER_PROCESS: { step: string; blurb: string }[] = [
  { step: "Research", blurb: "Interviews, surveys, and usability testing to understand user needs and the problem behind the request." },
  { step: "Synthesize", blurb: "Turn findings into journey maps, user flows, and a clear problem statement the team can align on." },
  { step: "Wireframe", blurb: "Low-fidelity structure first: hierarchy, layout, and content before any visual polish." },
  { step: "Prototype & test", blurb: "High-fidelity Figma prototypes, then usability testing with real users to catch what doesn't work." },
  { step: "Iterate & refine", blurb: "Multiple rounds of refinement, down to spacing, states, and accessibility, before it ships." },
];

// ---- Per-lens project treatment ----
export const PROJECT_CTA: Record<Audience, string> = {
  recruiter: "See the case study",
  designer: "Read the process",
};
export const PROJECT_CTA_DEFAULT = "Read case study";
export function projectCtaFor(a: Audience | null): string {
  return a ? PROJECT_CTA[a] : PROJECT_CTA_DEFAULT;
}

// Real anonymous peer feedback from a group design sprint. Verbatim wording,
// punctuation lightly normalized (no em-dashes, straight quotes).
export const TESTIMONIALS: { text: string; from: string }[] = [
  {
    text: "Clay had a real knack for making all the disparate pieces feel unified. His contributions served as the connective tissue of the sprint. Wherever something felt disconnected, he stepped in and made it feel cohesive.",
    from: "Anonymous teammate",
  },
  {
    text: "Clayton's strongest contribution has been his ability to act as a subtle leader. He is thoughtful, knowledgeable, and consistently expresses his opinions in an honest and respectful way, which helps guide the team's decision-making.",
    from: "Anonymous teammate",
  },
  {
    text: "Clay did a phenomenal job submitting high-quality work and picking up wherever possible, without making a fuss or needing recognition.",
    from: "Anonymous teammate",
  },
  {
    text: "Clay was very helpful throughout the sprint, and in answering any questions the group had about their tasks. He was very patient in helping others, and this really helped our final product.",
    from: "Anonymous teammate",
  },
  {
    text: "Was willing to do the tasks other people did not want to do.",
    from: "Anonymous teammate",
  },
];

export function heroFor(a: Audience | null): HeroCopy {
  return a ? HERO_BY_AUDIENCE[a] : HERO_DEFAULT;
}
export function orderFor(a: Audience | null): SectionKey[] {
  return a ? SECTION_ORDER[a] : DEFAULT_ORDER;
}
export function projectsIntroFor(a: Audience | null): string {
  return a ? PROJECTS_INTRO[a] : PROJECTS_INTRO_DEFAULT;
}
