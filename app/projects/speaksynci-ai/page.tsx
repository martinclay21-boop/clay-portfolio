import ProjectLayout from "@/components/ProjectLayout";

const BASE = "/clay-portfolio";

export const metadata = { title: "SpeakSyncAI, Clay Martin" };

export default function SpeakSyncAI() {
  return (
    <ProjectLayout
      title="SpeakSyncAI"
      category="UX Design · Concept App"
      tags={["Figma", "Accessibility", "Interaction Design", "User Research", "User Flows"]}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={`${BASE}/images/speaksynci/three-phone-mockup.png`}
        alt="SpeakSyncAI, three screen mockup showing live captions, settings, and case"
        className="not-prose w-full rounded-2xl bg-slate-50 mb-10"
      />

      <h2>Overview</h2>
      <p>
        SpeakSyncAI is a mobile app concept designed to give deaf and
        hard-of-hearing students equal access to lecture content, in the
        moment and after class. It combines real-time speech-to-text
        transcription, AI-generated summaries, handwritten annotations, and
        saved session history in one focused experience.
      </p>
      <p>
        The core problem: in a traditional classroom, students with hearing
        loss have to simultaneously manage lip-reading, watching an
        interpreter, and taking notes, an impossible cognitive load that puts
        them at a consistent disadvantage before the lecture even starts.
      </p>

      <h2>Design Problem</h2>
      <p>
        <em>
          "How might we give deaf and hard-of-hearing students equal access to
          full lecture content, both in the moment and afterward, without
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

      <h2>Onboarding</h2>
      <p>
        Setup is fast and personalized. Students select their preferred
        language, enter their name, and toggle on exactly which features they
        want, AI Summarize, Live Captions, Language Translation, or Note
        Taking. No bloat, just what's relevant to them.
      </p>

      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={`${BASE}/images/speaksynci/onboarding.png`}
        alt="SpeakSyncAI onboarding, language selection and primary use toggles"
        className="not-prose w-full rounded-2xl bg-slate-50 my-8"
      />

      <h2>Live Captions</h2>
      <p>
        The core screen is intentionally minimal. Transcribed text appears
        large and high-contrast as the professor speaks. A record button starts
        and stops the session, and the bottom nav keeps settings and audio
        controls one tap away, nothing competes with the captions themselves.
      </p>

      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={`${BASE}/images/speaksynci/live-captions.png`}
        alt="SpeakSyncAI live captions screen during an active recording session"
        className="not-prose w-full rounded-2xl bg-slate-50 my-8"
      />

      <h2>Annotation Tools</h2>
      <p>
        Students can annotate directly on the transcription, handwriting notes
        alongside the live text, or pulling up a color picker to highlight key
        concepts. These annotations are saved with the session so context isn't
        lost when reviewing later.
      </p>

      <div className="not-prose grid grid-cols-2 gap-4 my-8">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={`${BASE}/images/speaksynci/annotation.png`}
          alt="SpeakSyncAI handwritten annotation on live transcript"
          className="w-full rounded-2xl bg-slate-50"
        />
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={`${BASE}/images/speaksynci/color-picker.png`}
          alt="SpeakSyncAI color picker for annotation highlighting"
          className="w-full rounded-2xl bg-slate-50"
        />
      </div>

      <h2>Key Design Decisions</h2>
      <p>
        Accessibility was treated as a foundation, not a feature. Every
        decision, contrast ratios, tap target sizes, layout hierarchy, was
        validated against accessibility standards. The interface stays
        intentionally minimal so students can focus on the lecture, not the
        app. Customizable font sizes, color themes, and playback controls give
        each student control over the experience without overwhelming the
        default view.
      </p>

      <h2>Reflection</h2>
      <p>
        The thing that stuck with me is that captions are only the entry point.
        Real access means the whole learning cycle: catching the lecture live,
        then reviewing it, annotating it, and actually remembering it later. The
        annotation tools were not a guess. They came straight out of research
        where 40% of users asked for a way to take notes. The honest next steps
        are usability testing with deaf and hard-of-hearing students and building
        an MVP with real speech-to-text.
      </p>
    </ProjectLayout>
  );
}
