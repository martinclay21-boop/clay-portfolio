// Single source of truth for the city: where every building sits, what it
// is, and (for the info buildings) the content its overlay shows.

export type PlaceKind = "project" | "about" | "skills" | "experience";

export interface Place {
  id: string;
  kind: PlaceKind;
  title: string;
  subtitle: string;        // small label above the title in the overlay
  color: string;           // accent (roof / awning / sign)
  facade: string;          // pastel wall color
  position: [number, number, number];
  rotationY: number;       // so the storefront faces the plaza
  width: number;
  height: number;
  slug?: string;           // projects only
  description?: string;    // projects only
}

// Which way a building faces (front = local -z points toward plaza center)
const FACE_BACK = Math.PI;     // sits on the far (−z) wall, faces +z
const FACE_LEFT = -Math.PI / 2; // sits on the −x wall, faces +x
const FACE_RIGHT = Math.PI / 2; // sits on the +x wall, faces −x

export const PLACES: Place[] = [
  // ---- Back wall: the three info buildings (what you face on entry) ----
  {
    id: "skills",
    kind: "skills",
    title: "Skills",
    subtitle: "Capabilities",
    color: "#E8A13A",
    facade: "#fdeccb",
    position: [-12, 0, -18],
    rotationY: FACE_BACK,
    width: 8,
    height: 6,
  },
  {
    id: "about",
    kind: "about",
    title: "About Clay",
    subtitle: "Designer · Fishers, IN",
    color: "#2BB0A4",
    facade: "#d8f3ef",
    position: [0, 0, -18],
    rotationY: FACE_BACK,
    width: 9,
    height: 8,
  },
  {
    id: "experience",
    kind: "experience",
    title: "Experience",
    subtitle: "Where I've worked",
    color: "#E2607A",
    facade: "#fbe0e6",
    position: [12, 0, -18],
    rotationY: FACE_BACK,
    width: 8,
    height: 7,
  },

  // ---- Left street: three projects ----
  {
    id: "cuekit",
    kind: "project",
    title: "CueKit",
    subtitle: "UX Design · Senior Degree Project",
    description:
      "A mental readiness journal and cue system for college volleyball athletes — end-to-end from research to high-fidelity prototype.",
    slug: "cuekit",
    color: "#7F77DD",
    facade: "#e9e7f6",
    position: [-18, 0, -8],
    rotationY: FACE_LEFT,
    width: 7,
    height: 7,
  },
  {
    id: "speaksynci-ai",
    kind: "project",
    title: "SpeakSyncAI",
    subtitle: "UX Design · Concept App",
    description:
      "Real-time lecture transcription and AI summaries for deaf and hard-of-hearing students. Accessibility-first design.",
    slug: "speaksynci-ai",
    color: "#378ADD",
    facade: "#dceaf8",
    position: [-18, 0, 2],
    rotationY: FACE_LEFT,
    width: 7,
    height: 6,
  },
  {
    id: "mu-luxembourg",
    kind: "project",
    title: "MU Luxembourg",
    subtitle: "UI Design · WordPress",
    description:
      "Donation-focused foundation website with responsive layouts guiding visitors to the donate flow.",
    slug: "mu-luxembourg",
    color: "#E24B4A",
    facade: "#f6e0de",
    position: [-18, 0, 12],
    rotationY: FACE_LEFT,
    width: 8,
    height: 8,
  },

  // ---- Right street: three projects ----
  {
    id: "interactive-yearbook",
    kind: "project",
    title: "Fourward",
    subtitle: "Interaction Design · HCI",
    description:
      "A digital platform reimagining yearbooks as personalized multimedia experiences, built during HCI at Korea University.",
    slug: "interactive-yearbook",
    color: "#1D9E75",
    facade: "#dcf2e6",
    position: [18, 0, -8],
    rotationY: FACE_RIGHT,
    width: 7,
    height: 6,
  },
  {
    id: "academic-advising",
    kind: "project",
    title: "Academic Advising",
    subtitle: "Service Design",
    description:
      "Identified communication breakdowns in Miami's advising process and prototyped a Canvas + Navigate integration.",
    slug: "academic-advising",
    color: "#BA7517",
    facade: "#f6ecd6",
    position: [18, 0, 2],
    rotationY: FACE_RIGHT,
    width: 7,
    height: 5,
  },
  {
    id: "spokenote",
    kind: "project",
    title: "Spokenote",
    subtitle: "Visual Design · Marketing",
    description:
      "Use case illustrations across product pages using Photoshop and Illustrator, communicating Spokenote to customers.",
    slug: "spokenote",
    color: "#9F7AEA",
    facade: "#efe3fb",
    position: [18, 0, 12],
    rotationY: FACE_RIGHT,
    width: 7,
    height: 7,
  },
];

// ---------------------------------------------------------------------------
// Overlay content for the info buildings
// ---------------------------------------------------------------------------

export const ABOUT = {
  bio: [
    "I'm a UX and product designer based in Fishers, IN, pursuing a B.A. in Emerging Technology in Business & Design from Miami University. I specialize in finding where users get stuck and redesigning the experience so they don't.",
    "My process starts with real users — interviews, usability tests, and journey mapping — then moves through wireframing and prototyping in Figma before landing on polished, thoughtful interfaces.",
    "Outside of design, I managed social media and branded content for Miami University's Men's Club Volleyball team, and I'm conversational in Korean after studying at Korea University in Seoul.",
  ],
  education: [
    {
      year: "May 2026",
      title: "B.A. Emerging Technology in Business & Design",
      org: "Miami University — Oxford, OH",
      detail: "Concentration in Digital",
    },
    {
      year: "Aug – Dec 2025",
      title: "Study Abroad — Human Computer Interaction",
      org: "Korea University — Seoul, South Korea",
      detail: "Developed an interactive yearbook interface in Figma",
    },
  ],
  certifications: [
    {
      year: "Apr 2026",
      title: "ICAgile Certified Professional (ICP)",
      org: "ICAgile",
      detail: "Agile mindset, iterative delivery, cross-functional collaboration",
    },
    {
      year: "Feb 2026",
      title: "Humans as Subjects — IRB Certification",
      org: "CITI Program",
      detail: "Research ethics & responsible conduct · Expires 2029",
    },
  ],
  email: "martinclay21@gmail.com",
};

export const SKILL_GROUPS = [
  {
    heading: "Design Tools",
    skills: ["Figma", "Adobe Photoshop", "Adobe Illustrator", "InDesign", "DaVinci Resolve"],
  },
  {
    heading: "UX Methods",
    skills: ["User Research", "Usability Testing", "Wireframing", "Prototyping", "Interaction Design", "User Flows", "Journey Mapping", "Service Design"],
  },
  {
    heading: "Tech & Other",
    skills: ["HTML", "CSS", "WordPress", "Google Workspace", "PowerPoint"],
  },
  {
    heading: "Soft Skills",
    skills: ["Empathy", "Communication", "Cross-functional Collaboration", "Problem Solving", "Attention to Detail", "Adaptability", "Presentation", "Critical Thinking"],
  },
];

export const EXPERIENCE = [
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
      "Delivered 8 design assets (sales one-pagers, pitch decks) aligned with company vision and supported business development initiatives.",
    ],
  },
  {
    role: "Social Media Executive",
    org: "Miami University Men's Club Volleyball",
    location: "Oxford, OH",
    period: "Aug 2024 – May 2025",
    bullets: [
      "Managed social media presence across multiple platforms to promote team activities and increase club visibility.",
      "Produced branded graphics for tournaments, tryouts, and campus fairs to attract new members and communicate event details.",
      "Livestreamed and uploaded game footage to YouTube, expanding audience reach and engagement with team content.",
    ],
  },
];
