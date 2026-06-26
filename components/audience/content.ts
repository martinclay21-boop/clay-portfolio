// All audience-specific copy + structure lives here. Keep everything TRUTHFUL —
// no invented metrics. The wow is that the portfolio reshapes itself per visitor.

export type Audience = "recruiter" | "designer" | "curious";
export type SectionKey = "signature" | "about" | "projects" | "graphics" | "skills" | "contact";

export const AUDIENCES: Audience[] = ["recruiter", "designer", "curious"];

// Shown in the entry gate + lens switcher
export const AUDIENCE_META: Record<
  Audience,
  { label: string; chip: string; line: string; blurb: string; accent: string }
> = {
  recruiter: {
    label: "Recruiter / Hiring manager",
    chip: "Recruiter",
    line: "Show me impact, fast.",
    blurb: "Outcomes, highlights, and a résumé — no scrolling marathon.",
    accent: "#4f46e5", // indigo-600
  },
  designer: {
    label: "Fellow designer",
    chip: "Designer",
    line: "Walk me through the craft.",
    blurb: "Process, the decisions, and the messy middle.",
    accent: "#0ea5e9", // sky-500
  },
  curious: {
    label: "Just exploring",
    chip: "Exploring",
    line: "I'm only curious.",
    blurb: "The short, human version. No jargon.",
    accent: "#7c3aed", // violet-600
  },
};

// Order of sections AFTER the hero, per audience. Recruiter hides the "fun"
// graphics; designer surfaces craft; curious leads with the human/visual side.
export const SECTION_ORDER: Record<Audience, SectionKey[]> = {
  // recruiter leads with a scannable TL;DR card, then the work
  recruiter: ["signature", "projects", "skills", "about", "contact"],
  // designer gets the "how I work" process strip before the projects
  designer: ["about", "signature", "projects", "skills", "graphics", "contact"],
  // curious gets the warm "human" panel up front, fewer/bigger projects
  curious: ["signature", "graphics", "projects", "skills", "contact"],
};

export const DEFAULT_ORDER: SectionKey[] = ["about", "projects", "graphics", "skills", "contact"];

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
  headLead: "Hi, I'm Clay Martin —",
  headAccent: "UX & Product Designer.",
  sub: "I turn real problems into clearer, more usable experiences — using research, usability testing, and visual design to find where people get stuck and redesign the flows that move them forward.",
  primary: { label: "View my work", href: "#projects" },
  secondary: { label: "Contact me", href: "#contact" },
};

export const HERO_BY_AUDIENCE: Record<Audience, HeroCopy> = {
  recruiter: {
    eyebrow: "For recruiters & hiring managers",
    showBadge: true,
    headLead: "Research in,",
    headAccent: "shipped experiences out.",
    sub: "UX & product designer with two design internships and six end-to-end case studies. Here's the work — scannable, outcomes first.",
    primary: { label: "See the work", href: "#projects" },
    secondary: { label: "Get in touch", href: "#contact" },
    resume: { label: "Résumé", href: RESUME_HREF },
    quickFacts: [
      "End-to-end UX",
      "2× design intern",
      "ICAgile Certified",
      "Figma · Research · Prototyping",
    ],
  },
  designer: {
    eyebrow: "For fellow designers",
    showBadge: false,
    headLead: "I sweat the",
    headAccent: "why behind every flow.",
    sub: "Interviews, usability tests, journey maps, and a lot of iteration before anything gets polished. Come for the process — stay for the messy middle.",
    primary: { label: "See my process", href: "#projects" },
    secondary: { label: "Talk craft", href: "#contact" },
  },
  curious: {
    eyebrow: "Hey, nice to meet you 👋",
    showBadge: false,
    headLead: "I make confusing things",
    headAccent: "make sense.",
    sub: "I'm Clay — a designer who figures out where people get stuck and smooths the path. Have a look around; it's friendlier than it sounds.",
    primary: { label: "Take a look", href: "#projects" },
    secondary: { label: "Say hi", href: "#contact" },
  },
};

// Audience-tuned intro line for the Projects section
export const PROJECTS_INTRO: Record<Audience, string> = {
  recruiter:
    "Six case studies across UX, product, and visual design. Each one links to the full breakdown — skim the outcomes, dig in where it matters.",
  designer:
    "A mix of UX, product, and visual work. Open any one for the research, the trade-offs, and the iterations that didn't make the final cut.",
  curious:
    "A little bit of everything I've made — apps, a nonprofit site, even some posters. Poke around whatever looks interesting.",
};

export const PROJECTS_INTRO_DEFAULT =
  "A mix of UX, product, and visual design work spanning consumer apps, service design, and marketing.";

// ---- About section heading, per lens ----
export interface AboutCopy {
  headLead: string;
  headAccent: string;
}
export const ABOUT_DEFAULT: AboutCopy = {
  headLead: "Designer who leads with empathy,",
  headAccent: "driven by research.",
};
export const ABOUT_BY_AUDIENCE: Record<Audience, AboutCopy> = {
  recruiter: { headLead: "A designer who ships —", headAccent: "research to final pixel." },
  designer: { headLead: "Empathy first,", headAccent: "iteration always." },
  curious: { headLead: "Hi — I'm Clay,", headAccent: "I like untangling things." },
};
export function aboutFor(a: Audience | null): AboutCopy {
  return a ? ABOUT_BY_AUDIENCE[a] : ABOUT_DEFAULT;
}

// ---- Skills section intro line, per lens ----
export const SKILLS_INTRO: Record<Audience, string> = {
  recruiter: "The tools and methods I'm fluent in — and where I've already put them to work.",
  designer: "How I actually work: research- and method-led, tool-agnostic, detail-obsessed.",
  curious: "The stuff I'm good at — design tools, a bit of code, and working well with people.",
};
export const SKILLS_INTRO_DEFAULT =
  "A snapshot of the tools, methods, and soft skills I bring to a team.";
export function skillsIntroFor(a: Audience | null): string {
  return a ? SKILLS_INTRO[a] : SKILLS_INTRO_DEFAULT;
}

// ---- Signature modules (one unique block per lens) ----

// Recruiter: a 15-second "TL;DR" card
export const RECRUITER_TLDR = {
  status: "Open to full-time UX/Product roles & internships",
  location: "Fishers, IN",
  graduating: "B.A. Emerging Technology — Miami University, May 2026",
  highlights: [
    "6 end-to-end case studies, research → hi-fi prototype",
    "2 design internships (Damar Staffing, Spokenote)",
    "ICAgile Certified · IRB (human-subjects) Certified",
  ],
  topSkills: ["Figma", "User Research", "Usability Testing", "Prototyping", "Photoshop", "WordPress"],
};

// Designer: the "how I work" process strip
export const DESIGNER_PROCESS: { step: string; blurb: string }[] = [
  { step: "Research", blurb: "Interviews, surveys, and usability tests to find where people actually get stuck." },
  { step: "Synthesize", blurb: "Journey maps and user flows that turn messy findings into one clear problem." },
  { step: "Wireframe", blurb: "Low-fi structure first — hierarchy and content before any polish." },
  { step: "Prototype", blurb: "High-fidelity Figma prototypes that feel like the real thing." },
  { step: "Test & iterate", blurb: "Put it in front of users and refine until the flow just works." },
];

// Curious: the warm "human" panel
export const CURIOUS_HUMAN = {
  intro:
    "Hey — I'm Clay. I'm a senior at Miami University who fell for design because I like figuring out why things feel confusing and then quietly fixing them.",
  facts: [
    { emoji: "🏐", text: "Ran social media + content for Miami's Men's Club Volleyball team." },
    { emoji: "🇰🇷", text: "Studied in Seoul and got conversational in Korean." },
    { emoji: "🎨", text: "Makes posters for fun — cars, volleyball, whatever looks cool." },
    { emoji: "🎓", text: "Graduating May 2026, hunting for my first full-time design role." },
  ],
};

// ---- Per-lens project treatment ----
export const PROJECT_CTA: Record<Audience, string> = {
  recruiter: "See the case study",
  designer: "Read the process",
  curious: "Take a peek",
};
export const PROJECT_CTA_DEFAULT = "Read case study";
export function projectCtaFor(a: Audience | null): string {
  return a ? PROJECT_CTA[a] : PROJECT_CTA_DEFAULT;
}

// Curious sees a curated top 3 (her strongest), shown bigger
export const CURIOUS_TOP3 = ["cuekit", "speaksynci-ai", "mu-luxembourg"];

export function heroFor(a: Audience | null): HeroCopy {
  return a ? HERO_BY_AUDIENCE[a] : HERO_DEFAULT;
}
export function orderFor(a: Audience | null): SectionKey[] {
  return a ? SECTION_ORDER[a] : DEFAULT_ORDER;
}
export function projectsIntroFor(a: Audience | null): string {
  return a ? PROJECTS_INTRO[a] : PROJECTS_INTRO_DEFAULT;
}
