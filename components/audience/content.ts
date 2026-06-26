// All audience-specific copy + structure lives here. Keep everything TRUTHFUL —
// no invented metrics. The wow is that the portfolio reshapes itself per visitor.

export type Audience = "recruiter" | "designer";
export type SectionKey = "signature" | "about" | "projects" | "graphics" | "skills" | "contact";

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
    accent: "#0ea5e9", // sky-500
  },
};

// Order of sections AFTER the hero, per audience. Recruiter leads with the
// scannable TL;DR and hides the "fun" graphics; designer surfaces the craft.
export const SECTION_ORDER: Record<Audience, SectionKey[]> = {
  recruiter: ["signature", "projects", "skills", "about", "contact"],
  designer: ["about", "signature", "projects", "skills", "graphics", "contact"],
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
  headLead: "Hi, I'm Clay Martin,",
  headAccent: "UX designer & researcher.",
  sub: "I start every project with the root need, the real thing someone's trying to do, then treat the rest like a puzzle worth solving: research, iteration, and a lot of care for the small details.",
  primary: { label: "View my work", href: "#projects" },
  secondary: { label: "Contact me", href: "#contact" },
};

export const HERO_BY_AUDIENCE: Record<Audience, HeroCopy> = {
  recruiter: {
    eyebrow: "For recruiters & hiring managers",
    showBadge: true,
    headLead: "Research in,",
    headAccent: "experiences that work out.",
    sub: "UX designer and researcher with two internships and six end-to-end case studies. I find the root need, sweat the details, and keep a team's work feeling cohesive.",
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
    headLead: "Design is a puzzle",
    headAccent: "with no single right answer.",
    sub: "So I start with context and the root need, look everywhere for inspiration, then interpret and build, and let it fail a few times until the small stuff is right.",
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
  headLead: "I design by starting with the",
  headAccent: "root need.",
};
export const ABOUT_BY_AUDIENCE: Record<Audience, AboutCopy> = {
  recruiter: { headLead: "A designer who ships,", headAccent: "root need to final pixel." },
  designer: { headLead: "Backed by purpose,", headAccent: "shaped by iteration." },
};
export function aboutFor(a: Audience | null): AboutCopy {
  return a ? ABOUT_BY_AUDIENCE[a] : ABOUT_DEFAULT;
}

// What I believe — short design principles, in Clay's voice (About section)
export const PRINCIPLES: { t: string; d: string }[] = [
  { t: "Start with the root need", d: "A design out of context is just decoration. I get the real need first." },
  { t: "There's no single right answer", d: "Only the best interpretation of the problem in front of me." },
  { t: "Iteration over perfection", d: "You build, it fails, and each failure shows you the next thing to fix." },
  { t: "Purpose first, polish last", d: "Backed by research, but it should still look good and feel effortless." },
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
    "Teammates kept calling me the “glue” of the team, detail-obsessed, full of ideas, and the reason the work felt cohesive.",
  highlights: [
    "6 end-to-end case studies, from root need to tested, high-fidelity prototypes",
    "2 design internships (Damar Staffing and Spokenote)",
    "ICAgile Certified · IRB (Human-Subjects) Certified",
  ],
  topSkills: ["Figma", "User Research", "Usability Testing", "Prototyping", "Photoshop", "WordPress", "HTML / CSS"],
  interests: ["Software & Technology", "Healthcare & Pharma", "AI & Emerging Tech", "Agile Project Management"],
};

// Designer: the "how I work" process strip
export const DESIGNER_PROCESS: { step: string; blurb: string }[] = [
  { step: "Find the root need", blurb: "First I get clear on what's actually being asked, and the context it lives in. Miss this and everything after is off." },
  { step: "Gather the pieces", blurb: "I look everywhere for inspiration and dig into real user needs. No single right answer, so I collect a lot before I commit." },
  { step: "Interpret & build", blurb: "All of it turns into wireframes and flows, something that does exactly what was asked, and maybe a little more." },
  { step: "Test, and let it fail", blurb: "I put it in front of real people expecting it to break. Every failure points straight to the next fix." },
  { step: "Sweat the details", blurb: "Then the small stuff, a color a shade off, a button a few pixels over. Nothing's ever perfect, but it gets close." },
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

export function heroFor(a: Audience | null): HeroCopy {
  return a ? HERO_BY_AUDIENCE[a] : HERO_DEFAULT;
}
export function orderFor(a: Audience | null): SectionKey[] {
  return a ? SECTION_ORDER[a] : DEFAULT_ORDER;
}
export function projectsIntroFor(a: Audience | null): string {
  return a ? PROJECTS_INTRO[a] : PROJECTS_INTRO_DEFAULT;
}
