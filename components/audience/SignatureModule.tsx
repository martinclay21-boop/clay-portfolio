"use client";

import { Download } from "lucide-react";
import Reveal from "@/components/Reveal";
import { Button } from "@/components/ui/button";
import { ButtonColorful } from "@/components/ui/button-colorful";
import { useAudience } from "./AudienceContext";
import { RECRUITER_TLDR, DESIGNER_PROCESS, RESUME_HREF } from "./content";

/* Recruiter — a scannable 15-second summary card */
function RecruiterTLDR() {
  const t = RECRUITER_TLDR;
  return (
    <section id="signature" className="py-16 px-6 bg-white">
      <div className="max-w-5xl mx-auto">
        <Reveal>
          <div className="rounded-3xl border border-slate-200 bg-gradient-to-br from-slate-50 to-white p-7 sm:p-9 shadow-sm">
            <h2 className="sr-only">Quick summary</h2>
            <div className="flex flex-wrap items-center gap-3 mb-6">
              <span className="inline-flex items-center gap-2 text-xs font-semibold px-3 py-1.5 rounded-full text-white" style={{ background: "var(--accent)" }}>
                <span className="w-2 h-2 rounded-full bg-white/90 animate-pulse" />
                Available
              </span>
              <span className="text-xs font-semibold uppercase tracking-widest text-slate-500">
                The 15-second version
              </span>
            </div>

            <div className="grid sm:grid-cols-3 gap-6 mb-7">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 mb-1">Looking for</p>
                <p className="text-sm text-slate-800 font-medium leading-snug">{t.status}</p>
              </div>
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 mb-1">Based in</p>
                <p className="text-sm text-slate-800 font-medium leading-snug">{t.location}</p>
              </div>
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 mb-1">Graduating</p>
                <p className="text-sm text-slate-800 font-medium leading-snug">{t.graduating}</p>
              </div>
            </div>

            <blockquote className="pl-4 border-l-2 mb-7 text-sm text-slate-600 leading-relaxed italic" style={{ borderColor: "var(--accent)" }}>
              {t.quote}
              <span className="block not-italic text-xs text-slate-500 mt-1.5">Anonymous teammate, group design sprint</span>
            </blockquote>

            <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 mb-3">Why I'm worth a call</p>
            <ul className="space-y-2 mb-7">
              {t.highlights.map((h) => (
                <li key={h} className="flex items-start gap-2.5 text-sm text-slate-700">
                  <svg className="w-4 h-4 mt-0.5 shrink-0" style={{ color: "var(--accent)" }} fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                  {h}
                </li>
              ))}
            </ul>

            <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 mb-2">Top skills</p>
            <div className="flex flex-wrap gap-2 mb-6">
              {t.topSkills.map((s) => (
                <span key={s} className="text-xs font-medium bg-slate-100 text-slate-600 px-3 py-1.5 rounded-full">{s}</span>
              ))}
            </div>

            <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 mb-2">Curious about</p>
            <div className="flex flex-wrap gap-2 mb-7">
              {t.interests.map((x) => (
                <span key={x} className="text-xs font-medium px-3 py-1.5 rounded-full" style={{ background: "var(--accent-soft)", color: "var(--accent)" }}>{x}</span>
              ))}
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <ButtonColorful
                href={RESUME_HREF}
                external
                label="Download résumé"
                className="h-10 px-5"
                icon={
                  <Download
                    aria-hidden
                    className="h-4 w-4 shrink-0 transition-transform duration-200 group-hover:translate-y-0.5"
                  />
                }
              />
              <Button
                asChild
                variant="outline"
                className="h-10 rounded-full border-slate-200 px-5 text-sm font-medium text-slate-700"
              >
                <a href="mailto:martinclay21@gmail.com">Email me</a>
              </Button>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* Designer — the "how I work" process strip */
function DesignerProcess() {
  return (
    <section id="signature" className="py-20 px-6 bg-white">
      <div className="max-w-5xl mx-auto">
        <Reveal>
          <p className="text-xs font-semibold uppercase tracking-widest mb-4" style={{ color: "var(--accent)" }}>
            How I work
          </p>
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-3 leading-tight">
            A research-led process,{" "}
            <span className="font-[family-name:var(--font-serif)] italic font-normal" style={{ color: "var(--accent)" }}>
              start to finish.
            </span>
          </h2>
          <p className="text-slate-500 text-base max-w-xl mb-12">
            Every project moves through the same stages, from understanding the problem to testing with users and refining before it ships.
          </p>
        </Reveal>

        <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {DESIGNER_PROCESS.map((p, i) => (
            <Reveal key={p.step} delay={i * 80}>
              <div className="h-full rounded-2xl border border-slate-100 bg-slate-50/60 p-5">
                <span className="inline-flex items-center justify-center w-8 h-8 rounded-lg text-white text-sm font-bold mb-3" style={{ background: "var(--accent)" }}>
                  {i + 1}
                </span>
                <h3 className="text-sm font-bold text-slate-900 mb-1.5">{p.step}</h3>
                <p className="text-xs text-slate-500 leading-relaxed">{p.blurb}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

export default function SignatureModule() {
  const { audience } = useAudience();
  if (audience === "recruiter") return <RecruiterTLDR />;
  if (audience === "designer") return <DesignerProcess />;
  return null;
}
