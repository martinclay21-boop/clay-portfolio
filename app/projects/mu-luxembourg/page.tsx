import ProjectLayout from "@/components/ProjectLayout";

const BASE = "/clay-portfolio";

export const metadata = { title: "MU Luxembourg Foundation — Clay Martin" };

export default function MULuxembourg() {
  return (
    <ProjectLayout
      title="MU Luxembourg Foundation Website"
      category="UI Design · Emerging Technology Practicum"
      tags={["Figma", "WordPress", "Wireframing", "Usability Testing", "UI Design"]}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={`${BASE}/images/mu-luxembourg/logo.png`}
        alt="Miami University Luxembourg Foundation logo"
        className="not-prose w-full max-w-sm mx-auto rounded-2xl bg-slate-50 p-8 mb-10"
      />

      <h2>Overview</h2>
      <p>
        As part of Miami University's IMS 440 senior practicum (Spring 2026),
        I was a member of the Blueprint Design Team working in collaboration
        with the Miami University Luxembourg Foundation (MULF) — an
        organization established in 2023 to provide European alumni and
        donors a tax-efficient vehicle to support MUDEC, Miami's study-abroad
        program in Luxembourg.
      </p>
      <p>
        The course challenge: <em>"How might we create a digital presence that
        inspires potential donors in Europe to donate, builds trust, and
        facilitates a good online donation experience?"</em>
      </p>

      <h2>My Role</h2>
      <p>
        I contributed across two phases of the project — visual design and
        usability testing:
      </p>
      <ul>
        <li>
          <strong>Blueprint Design Team:</strong> Developed the site's visual
          foundation — moodboard, style guide, wireframes, and WordPress
          implementation.
        </li>
        <li>
          <strong>Usability Testing Subgroup:</strong> Later in the project,
          joined the cross-team UX research group to evaluate the live
          prototype with real users.
        </li>
      </ul>

      <h2>Design Process</h2>
      <p>
        The Blueprint Design Team worked in an agile sprint structure across
        the semester:
      </p>
      <ul>
        <li>
          <strong>Sprint 1 — Visual Foundation:</strong> Researched comparable
          nonprofit websites, built a moodboard drawing from Luxembourg's
          cultural identity and Miami University's brand, and delivered a
          comprehensive style guide covering color palette, typography, logo
          usage, and imagery direction.
        </li>
        <li>
          <strong>Sprint 2 — Wireframing:</strong> Produced hand-drawn layout
          sketches, then iterated into low- and medium-fidelity wireframes in
          Figma. Each team member owned an assigned page while the full team
          reviewed and gave feedback to maintain consistency.
        </li>
        <li>
          <strong>Sprint 3 — WordPress Build:</strong> Translated Figma
          wireframes into a live WordPress site hosted on CloudHosting.lu,
          applying the approved style guide and exploring plugins for donation
          processing and contact forms.
        </li>
      </ul>

      <h2>Usability Testing</h2>
      <p>
        As part of the cross-team usability testing subgroup, I helped evaluate
        the final MULF website prototype with real users. The testing script
        focused on five key areas:
      </p>
      <ul>
        <li>Overall first impression on the homepage</li>
        <li>Clarity of mission and impact</li>
        <li>Trust and institutional identity</li>
        <li>Ease of navigation</li>
        <li>Understanding of the "donate from abroad" flow</li>
      </ul>
      <p>
        Sessions were conducted with representative users — a Luxembourg
        alumnus, a Miami parent, and a Luxembourg student — using a
        think-aloud protocol. We observed hesitation points, misclicks, and
        moments of confusion, then followed up with structured questions about
        confidence in donating. Findings directly informed iterative design
        revisions.
      </p>

      <h2>Outcome</h2>
      <p>
        The project delivered a fully functional, multilingual (English, French,
        German) WordPress website for the Miami University Luxembourg
        Foundation — a clean, donor-focused experience designed to build trust
        with European audiences and facilitate international giving. The
        usability testing phase confirmed that core flows were navigable and
        helped surface improvements to the donation flow before launch.
      </p>
    </ProjectLayout>
  );
}
