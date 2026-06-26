import ProjectLayout from "@/components/ProjectLayout";

const BASE = "/clay-portfolio";

export const metadata = { title: "CueKit, Clay Martin" };

export default function CueKit() {
  return (
    <ProjectLayout
      title="CueKit"
      category="UX Design · Senior Degree Project"
      tags={["Figma", "User Research", "Usability Testing", "Wireframing", "Prototyping"]}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={`${BASE}/images/cuekit/logo.jpg`}
        alt="CK Mental Performance logo"
        className="not-prose w-full rounded-2xl bg-slate-50 mb-10"
      />

      <h2>Overview</h2>
      <p>
        CueKit is a three-part mental performance system for college volleyball
        athletes — a reflection journal, an interactive Cue Plan Builder website,
        and a set of color-coded shoe straps. I designed it as my Senior Degree
        Project at Miami University, from research through final deliverable.
      </p>
      <p>
        The tagline is <em>"Wear your gameplan"</em> — and that's literally what
        it does. The mental preparation athletes build in the journal moves to the
        website, gets turned into a personalized plan, and then travels onto the
        court on their laces.
      </p>

      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={`${BASE}/images/cuekit/website-home.png`}
        alt="CueKit homepage — 'Struggle mentally during matches?' hero section"
        className="not-prose w-full rounded-2xl bg-slate-50 my-8"
      />

      <h2>The Problem</h2>
      <p>
        Picture this: it's 30 minutes before a match. Alex, a junior libero, is
        in the locker room lacing up her shoes. She's practiced 20 hours this
        week. Physically, she's ready. But her mind is still replaying a serve
        error from last match — and she can't remember which mental strategy to
        start with, so she does nothing and walks onto the court already behind
        mentally.
      </p>
      <p>
        That's the loop I was trying to break. Teams spend 30–45 minutes on
        structured physical warm-ups, but when it comes to mental preparation —
        managing anxiety, resetting after errors, deciding what to focus on —
        most athletes are completely on their own. The mental side gets treated
        as "extra" instead of something structured and repeatable. Athletes
        experience stress, reflect inconsistently, and show up to the next match
        starting from the same place they always do.
      </p>
      <p>
        The opportunity I saw: what if the 3–5 minutes before warm-up could
        prepare an athlete's mind the same way warm-up prepares their body?
      </p>

      <h2>Research</h2>
      <p>
        Before I designed anything, I needed to actually understand the problem —
        so I spent serious time in both academic research and direct conversations
        with the people closest to it.
      </p>
      <p>
        On the secondary research side, I pulled from five main sources. The most
        foundational was Zimmerman's Self-Regulated Learning (SRL) cycle —
        forethought, performance, and reflection — which ended up becoming the
        literal structure of CueKit. I also leaned on Van Raalte et al.'s study
        showing a structured mental warm-up as short as 5 minutes can produce a
        71% increase in readiness and up to an 80% drop in stress for
        high-anxiety athletes. That number stuck with me throughout the whole
        project.
      </p>
      <p>
        My primary research was four conversations, and each one meaningfully
        changed my direction:
      </p>
      <ul>
        <li>
          A sport psychology professor pushed me to stop treating forethought and
          reflection as separate problems. He was right — the quality of what an
          athlete reflects on after a match directly determines what they can plan
          before the next one. That's what turned CueKit from a pre-game
          checklist into a full loop.
        </li>
        <li>
          A college volleyball setter told me his mental prep was "basically
          nonexistent in any structured way," that he could realistically hold one
          or two things in his head before it became noise, and that a phone app
          wouldn't work during warm-up — it had to happen before the gym. That
          shaped the journal design completely.
        </li>
        <li>
          A burnout researcher reframed the whole project for me. Unmanaged
          pre-competition anxiety isn't just a performance problem — over time
          it's a direct pathway to burnout. She also pushed back on a design
          assumption I was making: showing athletes their burnout scores without a
          clear actionable next step can actually make things worse. That's
          exactly why CueKit has to close the loop with a concrete plan, not just
          a reflection prompt.
        </li>
        <li>
          My external UX mentor challenged me to think more holistically about
          scope and later identified that the homepage wasn't communicating the
          value of the system clearly — and that two very different users (athletes
          brand new to CueKit vs. athletes coming in with scores ready) were
          landing in the same place with no distinction.
        </li>
      </ul>

      <h2>Affinity Mapping & Insight Statements</h2>
      <p>
        Once I had my research, I used affinity mapping to organize everything
        into themes — the goal wasn't to confirm what I already thought, it was
        to let the data show me something I hadn't seen yet. Three themes rose to
        the top and directly drove my design decisions:
      </p>
      <ul>
        <li>
          <strong>Reflection shapes readiness.</strong> Athletes reflect naturally
          after performances, but they struggle to translate that reflection into
          something concrete for next time. The loop doesn't close on its own.
        </li>
        <li>
          <strong>Mental routines fail when they feel forced.</strong> Athletes
          ignore strategies that feel coach-assigned or abstract — even
          evidence-based ones. Routines only stick when athletes feel ownership
          over them.
        </li>
        <li>
          <strong>Preparation needs structure, not overload.</strong> Too much
          structure overwhelms athletes in fast, high-pressure moments. What they
          need is a small, focused set of cues — three to five — that they chose
          themselves and can actually access when it matters.
        </li>
      </ul>
      <p>
        These weren't just observations. They became my design criteria for
        everything that followed.
      </p>

      <h2>Competitive Analysis</h2>
      <p>
        I looked at three categories of existing tools: digital apps for mental
        skills, sport-specific coaching services, and free worksheet-based tools.
      </p>
      <p>
        <strong>Restoic</strong> is probably the strongest competitor — a mobile
        app with on-demand audio sessions for relaxation, self-talk, and imagery.
        Science-based, professional testimonials. But it has no volleyball
        context, no connection to what happened in her last match, and no way to
        turn what she hears into a plan she can carry onto the court. It also
        requires a subscription.
      </p>
      <p>
        <strong>Thrive Volleyball</strong> does workshops and one-on-one coaching
        specifically for volleyball — which is a real strength. But it's
        episodic. There's no system that travels with an athlete into every match
        and connects last game's reflection to this game's plan.
      </p>
      <p>
        Free worksheets fall short for the same core reason: they're static and
        assigned, not chosen. My research made it clear that routines fail when
        athletes don't feel ownership — and a PDF handed to them by a coach
        doesn't create ownership.
      </p>
      <p>
        The gap I identified: none of these tools close the full loop between
        post-match reflection, pre-match planning, and in-game regulation — match
        by match. That's exactly the space CueKit is designed to fill.
      </p>

      <h2>The Solution</h2>
      <p>CueKit is built around one repeatable loop, three parts:</p>

      <h3>The Journal</h3>
      <p>
        The starting point. After every practice or match, an athlete answers
        three reflection questions — what worked, where they felt friction, and
        what specific goal they'll carry into their next performance. Then they
        rate themselves on four dimensions: confidence, anxiety, focus, and
        physical tension, each on a 1–5 scale. The journal has a colored bar
        system at the front — each bar corresponds to a dimension and color, so
        athletes can visually see where they are and which techniques to reach
        for. The whole thing takes 3–5 minutes by design. It had to be
        lightweight and usable anywhere — locker room, bus, dorm room.
      </p>

      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={`${BASE}/images/cuekit/website-journal.png`}
        alt="CueKit website — 'Three pieces, one loop' journal section"
        className="not-prose w-full rounded-2xl bg-slate-50 my-8"
      />

      <h3>The Cue Plan Builder</h3>
      <p>
        The journal is fully self-contained — an athlete who never touches the
        website still gets real value. But for moments when scores are mixed or
        something felt off and they can't name it, the Cue Plan Builder goes
        deeper. The athlete inputs their four journal scores, the site classifies
        each as low, okay, or high, and for anything outside the okay range it
        asks a short follow-up question. The output is a personalized plan: a
        primary technique and color, a before-match routine, a during-match
        reminder, and an optional secondary technique if needed.
      </p>

      <h3>The Shoe Straps</h3>
      <p>
        This is the part that makes CueKit different from everything else in the
        landscape. Once an athlete has their cue plan — say, blue for breathing
        and orange for self-talk — they pick those two straps and put them on
        their shoes before warm-up. During a tight set, when cognitive load is at
        its highest and they can't recall what their coach said or what they wrote
        in their journal, they glance down. The color is there. It doesn't ask
        them to think — it just triggers the cue they already chose for
        themselves. I want to be transparent: the prototype used pre-made straps
        sourced from Amazon. The concept is what matters — the system, and the
        straps as physical proof it can work.
      </p>

      <h3>The Color System</h3>
      <p>
        Every color is evidence-based, not chosen for aesthetics. Blue maps to
        breathing because cool tones stimulate the parasympathetic nervous system.
        Orange maps to self-talk because it triggers alertness. Yellow supports
        imagery and visualization without over-arousal. Purple promotes focused
        concentration. Black maps to muscle relaxation — grounding, earthy.
        White is a visual reset, a flush-it command for clearing an error. The
        color system does double duty: it's the product and the brand at the same
        time.
      </p>

      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={`${BASE}/images/cuekit/website-colors.png`}
        alt="CueKit website — 'Your cue colors' showing six technique cards"
        className="not-prose w-full rounded-2xl bg-slate-50 my-8"
      />

      <h2>Feedback & Iteration</h2>
      <p>
        Iteration on CueKit came from three sources at different stages. My
        faculty advisor pushed back early on designing only for pre-game prep —
        he pointed out that without connecting it to post-game reflection, it
        would feel like half a product. That conversation expanded CueKit from a
        single tool into the full three-part loop.
      </p>
      <p>
        My external UX mentor reviewed the live site and flagged two issues I
        hadn't seen: the homepage wasn't communicating the value of the system
        clearly, and athletes coming in brand new versus athletes coming in with
        scores already in hand were landing in the same place with no
        differentiation. That drove a homepage rewrite and the two-entry flow.
      </p>
      <p>
        The Student Expo was the most honest feedback I got — it was the first
        time all three parts of CueKit were in front of people with zero prior
        context. The most common question was some version of <em>"why do I need
        both the journal and the website?"</em> Two completely separate sources —
        my design mentor months before the expo and a room full of strangers at
        the expo — flagged the same problem independently. When that happens,
        it's not a coincidence. It's a real design gap. A volleyball player also
        said the Cue Plan Builder questions didn't feel all-encompassing — that
        they might miss emotional states athletes actually experience. On the
        positive side, the concept clicked quickly for most people, the
        personalized output was well received, and several people said it felt
        polished and like a real brand — which, coming from people who had never
        heard of CueKit before, was the most validating thing I heard all day.
      </p>
      <p>
        What I changed: two separate entry paths on the website, a clearer
        homepage, and expanded Cue Plan Builder questions. What I didn't change:
        someone at the expo suggested replacing the straps with color-changing LED
        lights. I thought about it and said no. It adds hardware complexity and
        cost that completely contradict the point — a low-friction system an
        athlete can actually use this season. Knowing what not to change is just
        as important as knowing what to fix.
      </p>

      <div className="not-prose grid grid-cols-2 gap-4 my-8">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={`${BASE}/images/cuekit/website-techniques.png`}
          alt="CueKit techniques page — Breathing technique with color filter tabs"
          className="w-full rounded-2xl bg-slate-50"
        />
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={`${BASE}/images/cuekit/website-breathing.png`}
          alt="CueKit techniques page — four researched ways to put breathing to work"
          className="w-full rounded-2xl bg-slate-50"
        />
      </div>

      <h2>Reflection</h2>
      <p>
        This project pushed me to actually use research rather than just
        reference it. Zimmerman's SRL cycle isn't just a citation in my
        bibliography — it's the literal structure of CueKit. The journal is the
        reflection phase. The website is forethought. The straps are performance.
        That connection only became that clear through the process of building
        something real.
      </p>
      <p>
        The most humbling part was iteration. The distinction between the journal
        and the website felt completely obvious to me by the time I built it. At
        the expo, the first question almost every person asked was "why do I need
        both?" That forced me to rethink how I was framing the system, not just
        how I was building it. I also learned to hold the tension between what I
        wanted to build and what was actually feasible. A full mobile app, custom
        manufactured straps — those are real future ideas. But a printed journal,
        a working website, and straps from Amazon is a complete, testable loop
        that I could hand to an athlete today. And for a capstone project, that
        mattered a lot more than a concept that only lives on a slide.
      </p>
    </ProjectLayout>
  );
}
