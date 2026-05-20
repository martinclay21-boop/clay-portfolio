import ProjectLayout from "@/components/ProjectLayout";

const BASE = "/clay-portfolio";

export const metadata = { title: "Interactive Yearbook — Clay Martin" };

export default function InteractiveYearbook() {
  return (
    <ProjectLayout
      title="Interactive Yearbook"
      category="Interaction Design · HCI Coursework"
      tags={["Figma", "Interaction Design", "HCI", "Prototyping", "User Research"]}
    >
      <h2>Overview</h2>
      <p>
        Developed during Human Computer Interaction coursework at Korea
        University in Seoul, <strong>Fourward</strong> reimagines the
        traditional yearbook as an interactive, social digital platform that
        tracks student milestones from orientation to graduation. Users can
        filter by cohort, clubs, or friends to quickly surface what matters
        to them.
      </p>

      {/* Home dashboard */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={`${BASE}/images/fourward/home.png`}
        alt="Fourward home dashboard — calendar and upcoming events"
        className="not-prose w-full rounded-2xl border border-slate-100 shadow-sm my-8"
      />

      <h2>The Problem</h2>
      <p>
        Traditional yearbooks are static, one-time print artifacts with no
        support for video, dynamic content, or personalization. They serve
        everyone the same way regardless of individual communities or interests,
        and make it difficult for students to revisit specific meaningful
        moments across their four years.
      </p>

      <h2>Research & Key Insights</h2>
      <p>
        The project involved mapping distinct needs across students, faculty,
        and moderators. Four patterns drove the design direction:
      </p>
      <ul>
        <li>Communities need club- and cohort-specific views, not one-size-fits-all feeds</li>
        <li>Favoriting and filtering reduce friction when revisiting key moments</li>
        <li>Event-based memory surfacing ("friends who attended") triggers organic recall</li>
        <li>Focusing navigation on core use cases keeps the experience from feeling overwhelming</li>
      </ul>

      {/* Events page */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={`${BASE}/images/fourward/events.png`}
        alt="Fourward events page — upcoming events list with photos and map pins"
        className="not-prose w-full rounded-2xl border border-slate-100 shadow-sm my-8"
      />

      <h2>Key Features</h2>
      <ul>
        <li>Personal four-year timelines for each student from orientation to graduation</li>
        <li>Event calendar with photo coverage and location pins for campus events</li>
        <li>Friends list filterable by major, year of enrollment, and more</li>
        <li>Event detail pages showing recap content and friends who attended</li>
        <li>Moderator dashboard and badge system for content management</li>
        <li>Privacy controls on individual posts and profiles</li>
      </ul>

      {/* Friends page */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={`${BASE}/images/fourward/friends.png`}
        alt="Fourward friends page — sortable list by name, major, and year of enrollment"
        className="not-prose w-full rounded-2xl border border-slate-100 shadow-sm my-8"
      />

      {/* Event detail */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={`${BASE}/images/fourward/event-detail.png`}
        alt="Fourward event detail — Movie Night recap with friends who attended"
        className="not-prose w-full rounded-2xl border border-slate-100 shadow-sm my-8"
      />

      <h2>Reflection</h2>
      <p>
        Fourward deepened my understanding of designing for multiple stakeholder
        types with competing needs — students want personalization and social
        connection, while moderators need control and consistency. Working within
        an HCI framework at Korea University also exposed me to international
        perspectives on digital memory and community platforms, which shaped how
        I thought about filtering, privacy, and what "belonging" looks like in a
        UI.
      </p>
    </ProjectLayout>
  );
}
