import ProjectLayout from "@/components/ProjectLayout";

export const metadata = { title: "CueKit — Clay Martin" };

export default function CueKit() {
  return (
    <ProjectLayout
      title="CueKit"
      category="UX Design · Senior Degree Project"
      tags={["Figma", "User Research", "Usability Testing", "Wireframing", "Prototyping"]}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/clay-portfolio/images/cuekit/logo.jpg"
        alt="CK Mental Performance logo"
        className="not-prose w-full rounded-2xl bg-slate-50 mb-10"
      />

      <h2>Overview</h2>
      <p>
        CueKit is a mental readiness journal and cue system designed for college
        volleyball athletes. The project was my Senior Degree Project at Miami
        University, where I led end-to-end design from initial idea through
        final prototype.
      </p>
      <p>
        The goal was to give athletes a structured way to build pre-performance
        mental routines — reducing anxiety, improving focus, and making
        psychological readiness as intentional as physical warm-ups.
      </p>

      <h2>The Problem</h2>
      <p>
        College volleyball athletes often develop mental readiness habits
        informally, without structure or feedback. There was no dedicated tool
        that combined journaling, cue-building, and performance reflection in
        one focused experience built specifically for athletes.
      </p>

      <h2>Research</h2>
      <p>
        I conducted user research with college volleyball players to understand
        their current mental preparation routines, pain points, and what would
        make a digital tool feel genuinely useful rather than burdensome. Key
        findings shaped the core feature set:
      </p>
      <ul>
        <li>Athletes wanted quick, pre-game check-ins — not long journals</li>
        <li>Cue systems needed to be personal and customizable</li>
        <li>Post-game reflection was valued but rarely happened consistently</li>
      </ul>

      <h2>Design Process</h2>
      <p>
        Starting from low-fidelity wireframes, I iterated through multiple
        rounds of usability testing before arriving at a high-fidelity Figma
        prototype. The design prioritized speed and clarity — an athlete should
        be able to complete their pre-game routine in under three minutes.
      </p>

      <h2>Key Features</h2>
      <ul>
        <li>Pre-game cue builder for building personal mental routines</li>
        <li>Quick journaling prompts tuned to sport-specific mindset needs</li>
        <li>Post-game reflection log for tracking patterns over a season</li>
        <li>Minimal, distraction-free UI designed for locker room use</li>
      </ul>

      <h2>Outcome</h2>
      <p>
        The final prototype demonstrated a focused, athlete-centered experience
        that addressed both the emotional and structural gaps in mental
        performance preparation. Usability testing confirmed the core flows were
        intuitive and the journaling format felt approachable rather than
        clinical.
      </p>
    </ProjectLayout>
  );
}
