import ProjectLayout from "@/components/ProjectLayout";

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
        University in Seoul, this project reimagines the traditional yearbook as
        an interactive, multimedia-enabled digital platform aligned with how
        students naturally share experiences online.
      </p>

      <h2>The Problem</h2>
      <p>
        Traditional yearbooks are static, one-time print artifacts with limited
        personalization and no support for video or dynamic content. They make it
        difficult for students to quickly revisit meaningful moments — and they
        serve everyone the same way, regardless of individual communities or
        interests.
      </p>

      <h2>Research & Key Insights</h2>
      <p>
        The project involved identifying distinct stakeholder needs across
        students, faculty, and moderators. Four critical patterns emerged from
        research:
      </p>
      <ul>
        <li>Communities need club-specific yearbooks, not one-size-fits-all designs</li>
        <li>Favoriting reduces friction when revisiting key moments</li>
        <li>Time-based resurfacing ("on this day") triggers memories organically</li>
        <li>Focusing on core use cases maintains navigational clarity</li>
      </ul>

      <h2>Solution</h2>
      <p>Key components of the design included:</p>
      <ul>
        <li>Personal four-year timelines for each student</li>
        <li>Multimedia posts supporting photos, video, and text</li>
        <li>Moderator dashboards and badge systems for content management</li>
        <li>Privacy controls for individual posts and profiles</li>
        <li>Event calendars and community views organized by club or group</li>
      </ul>

      <h2>Accessibility</h2>
      <p>
        Accessibility and inclusion were foundational requirements throughout —
        including contrast ratios, tap targets, and alt text standards built into
        the design from the start.
      </p>

      <h2>Reflection</h2>
      <p>
        This project deepened my understanding of designing for multiple
        stakeholder types with conflicting needs, and how to use interaction
        patterns that surface content without overwhelming users. Working within
        an HCI framework at Korea University also exposed me to international
        perspectives on digital memory and community platforms.
      </p>
    </ProjectLayout>
  );
}
