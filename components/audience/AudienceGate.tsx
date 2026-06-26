"use client";

import { useEffect, useRef, useState } from "react";
import { useAudience } from "./AudienceContext";
import { AUDIENCES, AUDIENCE_META, type Audience } from "./content";

function Glyph({ audience }: { audience: Audience }) {
  const common = { width: 26, height: 26, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 1.7, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };
  if (audience === "recruiter") {
    return (
      <svg {...common}>
        <rect x="3" y="7" width="18" height="13" rx="2" />
        <path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
        <path d="M3 12h18" />
      </svg>
    );
  }
  // designer
  return (
    <svg {...common}>
      <path d="M12 3 3 8l9 5 9-5-9-5Z" />
      <path d="m3 13 9 5 9-5" />
      <path d="m3 18 9 5 9-5" />
    </svg>
  );
}

export default function AudienceGate() {
  const { mounted, gateOpen, choose, closeGate } = useAudience();
  const [leaving, setLeaving] = useState<Audience | null>(null);
  const [entered, setEntered] = useState(false);
  const dialogRef = useRef<HTMLDivElement>(null);

  // play entrance, lock scroll, handle Escape, restore focus
  useEffect(() => {
    if (!gateOpen) return;
    const prevFocus = document.activeElement as HTMLElement | null;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const raf = requestAnimationFrame(() => setEntered(true));
    const firstBtn = dialogRef.current?.querySelector<HTMLButtonElement>("[data-card]");
    firstBtn?.focus();

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeGate(); // dismiss without choosing → neutral default
    };
    window.addEventListener("keydown", onKey);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
      setEntered(false);
      prevFocus?.focus?.();
    };
  }, [gateOpen, closeGate]);

  if (!mounted || !gateOpen) return null;

  const pick = (a: Audience) => {
    setLeaving(a);
    window.setTimeout(() => { choose(a); setLeaving(null); }, 360);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="gate-title"
      ref={dialogRef}
      className="fixed inset-0 z-[100] flex items-center justify-center px-6"
    >
      {/* Backdrop */}
      <div
        className={`absolute inset-0 bg-gradient-to-br from-slate-50 via-white to-indigo-50 transition-opacity duration-500 motion-reduce:transition-none ${
          entered && !leaving ? "opacity-100" : "opacity-0"
        }`}
      />
      <div className="absolute top-24 right-24 w-72 h-72 bg-indigo-200/40 rounded-full blur-3xl float pointer-events-none" />
      <div className="absolute bottom-24 left-16 w-96 h-96 bg-purple-200/30 rounded-full blur-3xl float pointer-events-none" style={{ animationDelay: "2s" }} />

      <div
        className={`relative w-full max-w-xl text-center transition-all duration-500 motion-reduce:transition-none ${
          entered && !leaving ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
        }`}
      >
        {/* Identity — so visitors know whose portfolio this is before choosing */}
        <div className="flex flex-col items-center gap-3 mb-8">
          <span
            className="inline-flex w-11 h-11 rounded-2xl items-center justify-center text-white text-sm font-bold shadow-sm"
            style={{ background: "linear-gradient(135deg, #4f46e5, #0ea5e9)" }}
          >
            CM
          </span>
          <div>
            <p className="text-sm font-semibold text-slate-800">Clay Martin</p>
            <p className="text-xs text-slate-400">UX Designer · Miami University 2026</p>
          </div>
          <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            Available for full-time roles &amp; internships
          </span>
        </div>

        <h1 id="gate-title" className="text-3xl sm:text-5xl font-bold text-slate-900 leading-[1.1] mb-4">
          First — who{" "}
          <span className="font-[family-name:var(--font-serif)] italic font-normal text-indigo-600">
            are you?
          </span>
        </h1>
        <p className="text-slate-500 text-base sm:text-lg max-w-md mx-auto mb-10">
          I tailor this portfolio to whoever&apos;s reading it. To make this the
          best experience I can, which version would you like to see?
        </p>

        <div className="grid sm:grid-cols-2 gap-4">
          {AUDIENCES.map((a, i) => {
            const meta = AUDIENCE_META[a];
            return (
              <button
                key={a}
                data-card
                onClick={() => pick(a)}
                style={{ transitionDelay: entered ? `${120 + i * 90}ms` : "0ms" }}
                className={`group relative text-left rounded-2xl border border-slate-200 bg-white/70 backdrop-blur p-5 hover:-translate-y-1 hover:shadow-xl hover:border-indigo-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400 transition-all duration-500 motion-reduce:transition-none ${
                  entered && !leaving ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
                } ${leaving === a ? "ring-2 ring-indigo-400 scale-[1.03]" : ""}`}
              >
                <span
                  className="inline-flex items-center justify-center w-11 h-11 rounded-xl mb-4 text-white"
                  style={{ background: meta.accent }}
                >
                  <Glyph audience={a} />
                </span>
                <span className="block text-xs font-medium uppercase tracking-wider text-slate-400 mb-1">
                  {meta.label}
                </span>
                <span className="block text-lg font-bold text-slate-900 mb-1.5">
                  {meta.line}
                </span>
                <span className="block text-sm text-slate-500 leading-relaxed">
                  {meta.blurb}
                </span>
                <span className="mt-4 inline-flex items-center gap-1 text-xs font-semibold text-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity">
                  Enter this view
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </span>
              </button>
            );
          })}
        </div>

        <p className="mt-7 text-xs text-slate-400">
          You can switch views anytime — there&apos;s a toggle in the corner.
        </p>
        <button
          onClick={closeGate}
          className="mt-2 text-sm text-slate-400 hover:text-slate-600 transition-colors underline underline-offset-4 decoration-slate-300"
        >
          or just browse everything →
        </button>
      </div>
    </div>
  );
}
