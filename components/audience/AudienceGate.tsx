"use client";

import { useEffect, useRef, useState } from "react";
import { useAudience } from "./AudienceContext";
import { AUDIENCES, AUDIENCE_META, type Audience } from "./content";

function Glyph({ audience }: { audience: Audience }) {
  const common = { width: 28, height: 28, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 1.7, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };
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

type Leaving = { audience: Audience; x: number; y: number; accent: string };

export default function AudienceGate() {
  const { mounted, gateOpen, choose, closeGate } = useAudience();
  const [leaving, setLeaving] = useState<Leaving | null>(null);
  const [entered, setEntered] = useState(false);
  const dialogRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!gateOpen) return;
    const prevFocus = document.activeElement as HTMLElement | null;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const raf = requestAnimationFrame(() => setEntered(true));
    dialogRef.current?.querySelector<HTMLButtonElement>("[data-card]")?.focus();

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeGate();
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

  const pick = (a: Audience, e: React.MouseEvent<HTMLButtonElement>) => {
    const reduce = typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const r = e.currentTarget.getBoundingClientRect();
    setLeaving({ audience: a, x: r.left + r.width / 2, y: r.top + r.height / 2, accent: AUDIENCE_META[a].accent });
    window.setTimeout(() => choose(a), reduce ? 140 : 560);
  };

  const show = entered && !leaving;
  const t = (i: number) =>
    ({ transitionDelay: entered ? `${i}ms` : "0ms" }) as React.CSSProperties;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="gate-title"
      ref={dialogRef}
      className="fixed inset-0 z-[100] flex items-center justify-center px-6 overflow-hidden"
      style={{ background: "#090b14" }}
    >
      {/* Ambient drifting orbs */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div
          className="gate-orb-a absolute -left-[10%] top-[8%] h-[42rem] w-[42rem] rounded-full blur-[100px]"
          style={{ background: "radial-gradient(circle, rgba(99,102,241,0.55) 0%, transparent 68%)" }}
        />
        <div
          className="gate-orb-b absolute -right-[8%] bottom-[2%] h-[40rem] w-[40rem] rounded-full blur-[100px]"
          style={{ background: "radial-gradient(circle, rgba(14,165,233,0.5) 0%, transparent 68%)" }}
        />
        {/* faint grid for depth */}
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage:
              "linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)",
            backgroundSize: "64px 64px",
          }}
        />
      </div>

      {/* Color sweep on choose */}
      {leaving && (
        <div className="pointer-events-none absolute inset-0 z-[5]">
          <span
            className="gate-sweep absolute rounded-full"
            style={{
              left: leaving.x, top: leaving.y,
              width: "260vmax", height: "260vmax",
              marginLeft: "-130vmax", marginTop: "-130vmax",
              background: leaving.accent,
            }}
          />
        </div>
      )}

      <div className="relative z-10 w-full max-w-3xl text-center">
        {/* Identity */}
        <div
          className={`flex items-center justify-center gap-3 mb-10 transition-all duration-500 motion-reduce:transition-none ${show ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-2"}`}
        >
          <span
            className="inline-flex w-9 h-9 rounded-xl items-center justify-center text-white text-xs font-bold shadow-lg"
            style={{ background: "linear-gradient(135deg, #6366f1, #0ea5e9)", boxShadow: "0 0 24px rgba(99,102,241,0.5)" }}
          >
            CM
          </span>
          <span className="text-sm text-slate-300">
            Clay Martin <span className="text-slate-500">· UX &amp; Product Designer</span>
          </span>
          <span className="hidden sm:inline-flex items-center gap-1.5 text-[11px] font-medium text-emerald-300 border border-emerald-400/25 bg-emerald-400/10 px-2.5 py-1 rounded-full">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            Available
          </span>
        </div>

        {/* Headline */}
        <h2
          id="gate-title"
          className={`text-5xl sm:text-7xl font-bold text-white leading-[0.98] tracking-tight mb-5 transition-all duration-700 motion-reduce:transition-none ${show ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
          style={t(80)}
        >
          One portfolio,
          <br />
          <span className="font-[family-name:var(--font-serif)] italic font-normal text-indigo-300">
            two ways in.
          </span>
        </h2>

        <p
          className={`text-slate-400 text-base sm:text-lg max-w-md mx-auto mb-12 transition-all duration-700 motion-reduce:transition-none ${show ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
          style={t(160)}
        >
          This site reshapes around whoever&apos;s reading it. Pick your view to
          start, and switch anytime.
        </p>

        {/* Choice cards */}
        <div className="grid sm:grid-cols-2 gap-4 sm:gap-5">
          {AUDIENCES.map((a, i) => {
            const meta = AUDIENCE_META[a];
            const chosen = leaving?.audience === a;
            return (
              <button
                key={a}
                data-card
                onClick={(e) => pick(a, e)}
                style={t(260 + i * 90)}
                className={`group relative overflow-hidden rounded-3xl border border-white/10 bg-white/[0.035] p-6 sm:p-7 text-left backdrop-blur-sm transition-all duration-500 hover:-translate-y-1.5 hover:border-white/25 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/40 motion-reduce:transition-none motion-reduce:hover:translate-y-0 ${show ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"} ${chosen ? "scale-[1.02] border-white/30" : ""}`}
              >
                {/* accent wash on hover */}
                <span
                  className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  style={{ background: `radial-gradient(130% 130% at 50% -10%, ${meta.accent}33, transparent 70%)` }}
                />
                <span className="relative block">
                  <span
                    className="inline-flex items-center justify-center w-12 h-12 rounded-2xl mb-5 text-white transition-transform duration-300 group-hover:scale-105"
                    style={{ background: meta.accent, boxShadow: `0 0 28px -6px ${meta.accent}` }}
                  >
                    <Glyph audience={a} />
                  </span>
                  <span className="block text-lg font-bold text-white mb-1.5">{meta.label}</span>
                  <span className="block text-sm text-slate-400 leading-relaxed">{meta.blurb}</span>
                  <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold" style={{ color: meta.accent }}>
                    <span className="opacity-70 group-hover:opacity-100 transition-opacity">Enter</span>
                    <svg className="w-4 h-4 -translate-x-1 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </span>
                </span>
              </button>
            );
          })}
        </div>

        <button
          onClick={closeGate}
          className={`mt-8 text-sm text-slate-500 hover:text-slate-300 transition-all duration-700 motion-reduce:transition-none underline underline-offset-4 decoration-slate-700 ${show ? "opacity-100" : "opacity-0"}`}
          style={t(460)}
        >
          or just browse everything
        </button>
      </div>
    </div>
  );
}
