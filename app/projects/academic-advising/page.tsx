import ProjectLayout from "@/components/ProjectLayout";

export const metadata = { title: "Academic Advising Navigation, Clay Martin" };

export default function AcademicAdvising() {
  return (
    <ProjectLayout
      title="Academic Advising Navigation"
      category="Service Design"
      tags={["Service Design", "Journey Mapping", "User Research", "Figma", "Canvas", "Navigate"]}
    >
      <h2>Overview</h2>
      <p>
        A team service design project aimed at improving the academic advising
        experience at Miami University. The project identified communication
        breakdowns between students and advisors, then prototyped a solution
        integrating advising features into Canvas and redesigning the Navigate
        dashboard.
      </p>

      <h2>The Problem</h2>
      <p>
        Students at Miami University struggled to navigate the advising process:
      </p>
      <ul>
        <li>Students defaulted to email and got lost in long threads</li>
        <li>Confusion about scheduling pathways and which tool to use</li>
        <li>Difficulty finding advising resources on institutional websites</li>
        <li>Advisors were overwhelmed with booking demand during registration periods</li>
      </ul>

      <h2>Process</h2>
      <p>
        The team used service design methodology throughout, synthesizing pain
        points from both student and advisor perspectives, building a customer
        journey map, and creating a service blueprint to identify the highest-
        impact intervention points.
      </p>

      <h2>Design Decisions</h2>
      <p>
        Rather than building a new tool, the solution integrated into platforms
        students already use:
      </p>
      <ul>
        <li>A Canvas advising course with dedicated modules and instructional content</li>
        <li>Non-graded assignment reminders prompting pre-registration scheduling</li>
        <li>Clearer language explaining advising processes and expectations</li>
        <li>A redesigned Navigate dashboard consolidating schedules, advisor availability, and contact info</li>
      </ul>

      <h2>Outcome</h2>
      <p>
        We ended with a roadmap that fits inside the tools Miami already runs,
        so none of it depends on the school buying or adopting a brand-new
        system. The honest next step is usability testing with real students
        and advisors to find out whether the changes actually cut the confusion
        and get more people scheduled before registration opens.
      </p>
      <p>
        The lesson that stuck with me was designing for the system that exists
        instead of the one I wish existed. A fix nobody can realistically ship
        is not a fix.
      </p>
    </ProjectLayout>
  );
}
