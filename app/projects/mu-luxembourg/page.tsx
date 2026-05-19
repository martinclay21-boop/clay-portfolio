import ProjectLayout from "@/components/ProjectLayout";

export const metadata = { title: "MU Luxembourg Foundation — Clay Martin" };

export default function MULuxembourg() {
  return (
    <ProjectLayout
      title="MU Luxembourg Foundation Website"
      category="UI Design · Emerging Technology Practicum"
      tags={["Figma", "WordPress", "Responsive Design", "UI Design", "Interaction Design"]}
    >
      <h2>Overview</h2>
      <p>
        As part of Miami University's Emerging Technology Practicum, I worked on
        the UI for the Miami University Luxembourg Foundation's donation-focused
        website. The goal was to create responsive page layouts and clear
        interaction design so visitors could quickly understand the foundation
        and find the donate page.
      </p>

      <h2>The Challenge</h2>
      <p>
        Nonprofit donation websites often struggle with cluttered layouts,
        unclear calls to action, and navigation that buries the donate flow.
        Visitors arrive with intent but leave without converting because the path
        to giving isn't obvious.
      </p>

      <h2>Approach</h2>
      <p>
        I used Figma to design responsive page layouts before building in
        WordPress. The design process focused on:
      </p>
      <ul>
        <li>Surfacing the donation call-to-action prominently on every key page</li>
        <li>Simplifying navigation so visitors understood what the foundation does within seconds</li>
        <li>Creating layouts that translated cleanly from desktop to mobile</li>
        <li>Using clear interaction design patterns to guide users through the donation flow</li>
      </ul>

      <h2>Design to Development</h2>
      <p>
        After finalizing designs in Figma, I implemented the layouts in
        WordPress — maintaining design fidelity while ensuring the site was
        maintainable by non-technical staff. Responsive breakpoints were tested
        across devices to ensure a consistent experience.
      </p>

      <h2>Outcome</h2>
      <p>
        The redesigned pages gave the foundation a cleaner, more professional
        web presence with a clear path to donation. The project reinforced how
        interaction design and layout decisions directly affect user behavior
        and mission-driven outcomes.
      </p>
    </ProjectLayout>
  );
}
