"use client";

import Reveal from "@/components/Reveal";
import { useAudience } from "@/components/audience/AudienceContext";
import { aboutFor } from "@/components/audience/content";

const education = [
  {
    year: "May 2026",
    title: "B.A. Emerging Technology in Business & Design",
    org: "Miami University — Oxford, OH",
    detail: "Concentration in Digital",
  },
  {
    year: "Aug – Dec 2025",
    title: "Study Abroad — Human Computer Interaction",
    org: "Korea University — Seoul, South Korea",
    detail: "Developed an interactive yearbook interface in Figma",
  },
];

const certifications = [
  {
    year: "Apr 2026",
    title: "ICAgile Certified Professional (ICP)",
    org: "ICAgile",
    detail: "Training in agile mindset, iterative delivery, and cross-functional collaboration",
  },
  {
    year: "Feb 2026",
    title: "Humans as Subjects — IRB Certification",
    org: "CITI Program",
    detail: "Training in research ethics and responsible conduct for human subjects research · Expires 2029",
  },
];

export default function About() {
  const { audience } = useAudience();
  const copy = aboutFor(audience);
  return (
    <section id="about" className="py-24 px-6 bg-white">
      <div className="max-w-5xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-16 items-start">
          {/* Left — bio */}
          <Reveal>
            <p className="text-xs font-semibold uppercase tracking-widest mb-4" style={{ color: "var(--accent)" }}>
              About
            </p>
            <h2 key={audience ?? "default"} className="text-4xl sm:text-5xl font-bold text-slate-900 mb-6 leading-[1.1] hero-swap">
              {copy.headLead}{" "}
              <span className="font-[family-name:var(--font-serif)] italic font-normal" style={{ color: "var(--accent)" }}>
                {copy.headAccent}
              </span>
            </h2>
            <div className="space-y-4 text-slate-600 leading-relaxed text-base">
              <p>
                I'm a UX and product designer based in Fishers, IN, pursuing a
                B.A. in Emerging Technology in Business &amp; Design from Miami
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
              href="mailto:martinclay21@gmail.com"
              className="inline-flex items-center gap-2 mt-8 text-sm font-medium text-indigo-600 hover:text-indigo-700 transition-colors"
            >
              Let's connect →
            </a>
          </Reveal>

          {/* Right — timeline */}
          <Reveal delay={120}>
            <p className="text-xs font-semibold uppercase tracking-widest text-indigo-500 mb-6">
              Education
            </p>
            <ol className="space-y-6 mb-8">
              {education.map((item, i) => (
                <li key={item.title} className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <div className="w-2.5 h-2.5 rounded-full bg-indigo-400 mt-1.5 shrink-0" />
                    {i < education.length - 1 && (
                      <div className="w-px flex-1 bg-slate-200 mt-2" />
                    )}
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

            <p className="text-xs font-semibold uppercase tracking-widest text-indigo-500 mb-6">
              Certifications
            </p>
            <ol className="space-y-6">
              {certifications.map((item, i) => (
                <li key={item.title} className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <div className="w-2.5 h-2.5 rounded-full bg-indigo-400 mt-1.5 shrink-0" />
                    {i < certifications.length - 1 && (
                      <div className="w-px flex-1 bg-slate-200 mt-2" />
                    )}
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
          </Reveal>
        </div>
      </div>
    </section>
  );
}
