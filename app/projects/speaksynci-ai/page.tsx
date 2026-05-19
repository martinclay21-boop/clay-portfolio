import ProjectLayout from "@/components/ProjectLayout";

export const metadata = { title: "SpeakSyncAI — Clay Martin" };

export default function SpeakSyncAI() {
  return (
    <ProjectLayout
      title="SpeakSyncAI"
      category="UX Design · Concept App"
      tags={["Figma", "Accessibility", "Interaction Design", "User Research", "User Flows"]}
    >
      <h2>Overview</h2>
      <p>
        SpeakSyncAI is a mobile app concept designed to provide real-time
        lecture transcription, AI-generated summaries, and saved session history
        for deaf and hard-of-hearing students.
      </p>
      <p>
        The core problem: in traditional classroom environments, students with
        hearing loss must simultaneously manage lip-reading, interpreter
        watching, and note-taking — an impossible cognitive load that puts them
        at a consistent disadvantage.
      </p>

      <h2>Design Problem</h2>
      <p>
        <em>
          "How might we give deaf and hard-of-hearing students equal access to
          the full lecture content, both in the moment and afterward, without
          adding more cognitive load?"
        </em>
      </p>

      <h2>Research</h2>
      <p>
        Survey research with the target population surfaced clear priorities:
      </p>
      <ul>
        <li>72% prioritized live speech-to-text transcription</li>
        <li>64% rated AI summarization as "extremely valuable" (5/5)</li>
        <li>88% found saved lectures useful for later review</li>
        <li>Secondary interests included translation (52%) and notation tools (40%)</li>
      </ul>

      <h2>Key Features</h2>
      <ul>
        <li>Real-time speech-to-text captions with high-contrast display</li>
        <li>AI-powered note summarization that extracts key concepts</li>
        <li>Customizable accessibility options — font sizes, color themes, playback controls</li>
        <li>Color-coded interface organizing live captions, summaries, and archives</li>
        <li>Saved session history for review after class</li>
      </ul>

      <h2>Design Decisions</h2>
      <p>
        Accessibility was treated as a foundation, not a feature. Every design
        decision — contrast ratios, tap target sizes, alt text, layout
        hierarchy — was validated against accessibility standards. The interface
        was kept intentionally minimal so students could focus on the lecture,
        not the app.
      </p>

      <h2>Reflection</h2>
      <p>
        This project reinforced that accessibility extends beyond captions — it
        means supporting the complete learning cycle, including review and
        retention. Future steps would include usability testing with deaf and
        hard-of-hearing students and MVP development with real speech-to-text
        integration.
      </p>
    </ProjectLayout>
  );
}
