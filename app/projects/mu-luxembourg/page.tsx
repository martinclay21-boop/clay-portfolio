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
      </ul>

      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={`${BASE}/images/mu-luxembourg/about-us-moodboard.png`}
        alt="About Us page mood board — visual inspiration for the MULF website"
        className="not-prose w-full rounded-2xl bg-slate-50 my-8"
      />

      <ul>
        <li>
          <strong>Sprint 2 — Wireframing:</strong> Produced hand-drawn layout
          sketches, then iterated into low- and medium-fidelity wireframes in
          Figma. Each team member owned an assigned page while the full team
          reviewed and gave feedback to maintain consistency.
        </li>
      </ul>

      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={`${BASE}/images/mu-luxembourg/about-us-sketches.png`}
        alt="About Us page hand-drawn layout sketches"
        className="not-prose w-full rounded-2xl bg-slate-50 my-8"
      />

      <div className="not-prose grid grid-cols-2 gap-6 my-8">
        <div className="flex flex-col gap-2">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={`${BASE}/images/mu-luxembourg/about-us-lofi-desktop.png`}
            alt="About Us page low-fidelity wireframe — desktop"
            className="w-full rounded-xl border border-slate-200 bg-white object-top object-cover"
            style={{ maxHeight: "380px" }}
          />
          <p className="text-xs text-center text-slate-500 font-medium">Desktop</p>
        </div>
        <div className="flex flex-col gap-2">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={`${BASE}/images/mu-luxembourg/about-us-lofi-mobile.png`}
            alt="About Us page low-fidelity wireframe — mobile"
            className="w-full rounded-xl border border-slate-200 bg-white object-top object-cover"
            style={{ maxHeight: "380px" }}
          />
          <p className="text-xs text-center text-slate-500 font-medium">Mobile</p>
        </div>
      </div>

      <ul>
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

      <h2>Wireframes</h2>
      <p>
        Medium-fidelity wireframes produced in Sprint 2 for all five site
        pages — Home, About, Donation, Thank You, and Contact. Each team
        member owned an assigned page and iterated based on group feedback.
      </p>

      <div className="not-prose grid grid-cols-2 sm:grid-cols-3 gap-4 my-8">
        {[
          { file: "wireframe-home", label: "Home" },
          { file: "wireframe-about", label: "About" },
          { file: "wireframe-donation-hero", label: "Donation" },
          { file: "wireframe-donation-form", label: "Donation Form" },
          { file: "wireframe-thank-you", label: "Thank You" },
          { file: "wireframe-contact", label: "Contact" },
        ].map(({ file, label }) => (
          <div key={file} className="flex flex-col gap-2">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={`${BASE}/images/mu-luxembourg/${file}.png`}
              alt={`MULF wireframe — ${label} page`}
              className="w-full rounded-xl border border-slate-200 bg-white"
            />
            <p className="text-xs text-center text-slate-500 font-medium">{label}</p>
          </div>
        ))}
      </div>

      <div className="not-prose mt-10 rounded-2xl border border-slate-200 bg-slate-50 p-6 flex flex-col sm:flex-row items-start sm:items-center gap-4">
        <div className="flex-1">
          <p className="font-semibold text-slate-800 text-sm">Full Process Book</p>
          <p className="text-slate-500 text-sm mt-1">
            The complete IMS 440 class process book documenting all teams' sprints,
            research, wireframes, and reflections across the semester.
          </p>
        </div>
        <a
          href={`${BASE}/documents/mulf-process-book.pdf`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 shrink-0 bg-red-700 text-white text-sm font-medium px-5 py-2.5 rounded-full hover:bg-red-800 transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3M3 17V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
          </svg>
          View Process Book
        </a>
      </div>
    </ProjectLayout>
  );
}
