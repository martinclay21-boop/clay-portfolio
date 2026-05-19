const timeline = [
  {
    year: "May 2024",
    title: "B.S. Emerging Technology in Business & Design",
    org: "Miami University — Oxford, OH",
    detail: "Concentration in Digital Design",
  },
  {
    year: "Aug – Dec 2023",
    title: "Study Abroad — Human Computer Interaction",
    org: "Korea University — Seoul, South Korea",
    detail: "Developed an interactive yearbook interface in Figma",
  },
  {
    year: "Apr 2026",
    title: "ICAgile Certified Professional (ICP)",
    org: "ICAgile",
    detail: "Certified in agile delivery methodologies",
  },
  {
    year: "Feb 2026",
    title: "Humans as Subjects — IRB Certification",
    org: "CITI Program",
    detail: "Ethical research conduct for human subjects",
  },
];

export default function About() {
  return (
    <section id="about" className="py-24 px-6 bg-white">
      <div className="max-w-5xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-16 items-start">
          {/* Left — bio */}
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-indigo-500 mb-4">
              About
            </p>
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-6 leading-snug">
              Designer who leads with empathy,{" "}
              <span className="text-indigo-600">driven by research.</span>
            </h2>
            <div className="space-y-4 text-slate-600 leading-relaxed text-base">
              <p>
                I'm a UX and product designer based in Fishers, IN, with a
                B.S. in Emerging Technology in Business &amp; Design from Miami
                University. I specialize in finding where users get stuck and
                redesigning the experience so they don't.
              </p>
              <p>
                My process starts with real users — interviews, usability
                tests, and journey mapping — then moves through wireframing and
                prototyping in Figma before landing on polished, thoughtful
                interfaces. I've applied this across consumer apps, nonprofit
                websites, and marketing materials.
              </p>
              <p>
                Outside of design, I managed social media and branded content
                for Miami University's Men's Club Volleyball team, and I'm
                conversational in Korean after studying at Korea University in
                Seoul.
              </p>
            </div>

            <a
              href="mailto:claymartin@miamioh.edu"
              className="inline-flex items-center gap-2 mt-8 text-sm font-medium text-indigo-600 hover:text-indigo-700 transition-colors"
            >
              Let's connect →
            </a>
          </div>

          {/* Right — timeline */}
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-indigo-500 mb-6">
              Education &amp; Certifications
            </p>
            <ol className="space-y-6">
              {timeline.map((item) => (
                <li key={item.title} className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <div className="w-2.5 h-2.5 rounded-full bg-indigo-400 mt-1.5 shrink-0" />
                    <div className="w-px flex-1 bg-slate-200 mt-2" />
                  </div>
                  <div className="pb-6">
                    <span className="text-xs font-medium text-slate-400 block mb-1">
                      {item.year}
                    </span>
                    <p className="font-semibold text-slate-800 text-sm">
                      {item.title}
                    </p>
                    <p className="text-slate-500 text-sm">{item.org}</p>
                    <p className="text-slate-400 text-xs mt-1">{item.detail}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </div>
    </section>
  );
}
