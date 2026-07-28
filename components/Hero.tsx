"use client";

import { useEffect, useState } from "react";
import { useAudience } from "@/components/audience/AudienceContext";
import { heroFor } from "@/components/audience/content";

const prefersReducedMotion = () =>
  typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

function AnimatedNumber({ target, suffix = "", delay = 0 }: { target: number; suffix?: string; delay?: number }) {
  const [value, setValue] = useState(0);
  useEffect(() => {
    if (prefersReducedMotion()) {
      setValue(target);
      return;
    }
    const timeout = setTimeout(() => {
      const duration = 1400;
      const startTime = performance.now();
      let raf = 0;
      const tick = (now: number) => {
        const t = Math.min(1, (now - startTime) / duration);
        const eased = 1 - Math.pow(1 - t, 3);
        setValue(Math.round(target * eased));
        if (t < 1) raf = requestAnimationFrame(tick);
      };
      raf = requestAnimationFrame(tick);
      return () => cancelAnimationFrame(raf);
    }, delay);
    return () => clearTimeout(timeout);
  }, [target, delay]);
  return <>{value}{suffix}</>;
}

function AnimatedText({ text, delay = 0 }: { text: string; delay?: number }) {
  const [visible, setVisible] = useState(false);
  const reduce = prefersReducedMotion();
  useEffect(() => {
    if (reduce) {
      setVisible(true);
      return;
    }
    const t = setTimeout(() => setVisible(true), delay);
    return () => clearTimeout(t);
  }, [delay, reduce]);
  return (
    <span
      style={reduce ? undefined : { transition: `opacity 600ms ease ${delay}ms, transform 600ms ease ${delay}ms` }}
      className={visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"}
    >
      {text}
    </span>
  );
}

export default function Hero() {
  const { audience } = useAudience();
  const copy = heroFor(audience);

  return (
    <section className="relative min-h-screen flex items-center bg-gradient-to-br from-slate-50 via-white to-indigo-50 px-6 overflow-hidden">
      {/* Soft floating blobs */}
      <div className="absolute top-20 right-20 w-72 h-72 bg-indigo-200/40 rounded-full blur-3xl float pointer-events-none" />
      <div className="absolute bottom-20 left-10 w-96 h-96 bg-purple-200/30 rounded-full blur-3xl float pointer-events-none" style={{ animationDelay: "2s" }} />

      {/* key forces a soft re-animation when the lens changes */}
      <div key={audience ?? "default"} className="max-w-5xl mx-auto w-full pt-24 pb-16 relative hero-swap">
        {copy.showBadge && (
          <div className="inline-flex items-center gap-2 text-sm font-medium px-3 py-1.5 rounded-full mb-6" style={{ color: "var(--accent)", background: "var(--accent-soft)" }}>
            <span className="w-2 h-2 rounded-full animate-pulse" style={{ background: "var(--accent)" }} />
            {copy.eyebrow}
          </div>
        )}
        {!copy.showBadge && (
          <p className="text-xs font-semibold uppercase tracking-[0.2em] mb-5" style={{ color: "var(--accent)" }}>
            {copy.eyebrow}
          </p>
        )}

        <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-slate-900 leading-[1.05] tracking-tight mb-6">
          {copy.headLead}
          <br />
          <span className="font-[family-name:var(--font-serif)] italic font-normal" style={{ color: "var(--accent)" }}>
            {copy.headAccent}
          </span>
        </h1>

        <p className="text-lg sm:text-xl text-slate-500 max-w-2xl leading-relaxed mb-10">
          {copy.sub}
        </p>

        <div className="flex flex-wrap gap-4">
          <a
            href={copy.primary.href}
            style={{ background: "var(--accent)" }}
            className="group inline-flex items-center gap-2 text-white px-6 py-3 rounded-full font-medium hover:opacity-90 transition-opacity text-sm"
          >
            {copy.primary.label}
            <svg
              className="w-4 h-4 transition-transform group-hover:translate-x-1"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </a>
          <a
            href={copy.secondary.href}
            className="inline-flex items-center gap-2 border border-slate-200 text-slate-700 px-6 py-3 rounded-full font-medium hover:border-indigo-300 hover:text-indigo-600 transition-colors text-sm bg-white/60 backdrop-blur"
          >
            {copy.secondary.label}
          </a>
          {copy.resume && (
            <a
              href={copy.resume.href}
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center gap-2 text-slate-700 px-5 py-3 rounded-full font-medium hover:text-indigo-600 transition-colors text-sm"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3M4 6a2 2 0 012-2h8l6 6v8a2 2 0 01-2 2H6a2 2 0 01-2-2V6z" />
              </svg>
              {copy.resume.label}
            </a>
          )}
        </div>

        {/* Recruiter-only scan strip — truthful quick facts */}
        {copy.quickFacts && (
          <div className="flex flex-wrap gap-2 mt-6">
            {copy.quickFacts.map((fact) => (
              <span key={fact} className="text-xs font-medium bg-white/70 border border-slate-200 text-slate-600 px-3 py-1.5 rounded-full backdrop-blur">
                {fact}
              </span>
            ))}
          </div>
        )}

        {/* Quick stats with animated counters */}
        <div className="mt-16 pt-10 border-t border-slate-200 grid grid-cols-3 gap-6 sm:gap-16 max-w-2xl">
          <div>
            <div className="text-3xl sm:text-4xl font-bold text-slate-900 font-[family-name:var(--font-serif)]">
              <AnimatedNumber target={6} suffix="+" delay={0} />
            </div>
            <div className="text-xs sm:text-sm text-slate-500 mt-1">Case Studies</div>
          </div>
          <div>
            <div className="text-3xl sm:text-4xl font-bold text-slate-900 font-[family-name:var(--font-serif)]">
              <AnimatedNumber target={2} suffix="+" delay={200} />
            </div>
            <div className="text-xs sm:text-sm text-slate-500 mt-1">Years Experience</div>
          </div>
          <div>
            <div className="text-3xl sm:text-4xl font-bold text-slate-900 font-[family-name:var(--font-serif)]">
              <AnimatedText text="ICP" delay={400} />
            </div>
            <div className="text-xs sm:text-sm text-slate-500 mt-1">Agile Certified</div>
          </div>
        </div>
      </div>

      {/* Scroll indicator — positioned relative to the full section */}
      <div className="hidden md:flex absolute bottom-8 left-0 right-0 justify-center flex-col items-center gap-2 text-slate-500 pointer-events-none">
        <span className="text-xs uppercase tracking-widest">Scroll</span>
        <div className="w-px h-10 bg-gradient-to-b from-slate-400 to-transparent" />
      </div>
    </section>
  );
}
