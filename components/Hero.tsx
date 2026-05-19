"use client";

import { useEffect, useState } from "react";

function AnimatedNumber({ target, suffix = "" }: { target: number; suffix?: string }) {
  const [value, setValue] = useState(0);
  useEffect(() => {
    let start = 0;
    const duration = 1400;
    const startTime = performance.now();
    let raf = 0;
    const tick = (now: number) => {
      const t = Math.min(1, (now - startTime) / duration);
      const eased = 1 - Math.pow(1 - t, 3);
      setValue(Math.round(start + (target - start) * eased));
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target]);
  return <>{value}{suffix}</>;
}

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center bg-gradient-to-br from-slate-50 via-white to-indigo-50 px-6 overflow-hidden">
      {/* Soft floating blobs */}
      <div className="absolute top-20 right-20 w-72 h-72 bg-indigo-200/40 rounded-full blur-3xl float pointer-events-none" />
      <div className="absolute bottom-20 left-10 w-96 h-96 bg-purple-200/30 rounded-full blur-3xl float pointer-events-none" style={{ animationDelay: "2s" }} />

      <div className="max-w-5xl mx-auto w-full pt-24 pb-16 relative">
        <div className="inline-flex items-center gap-2 text-sm text-indigo-600 font-medium bg-indigo-50 px-3 py-1.5 rounded-full mb-6 reveal in-view">
          <span className="w-2 h-2 bg-indigo-500 rounded-full animate-pulse" />
          Available for opportunities
        </div>

        <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-slate-900 leading-[1.05] tracking-tight mb-6">
          Hi, I&apos;m Clay Martin.
          <br />
          <span className="font-[family-name:var(--font-serif)] italic font-normal text-indigo-600">
            UX &amp; Product
          </span>{" "}
          <span className="text-indigo-600">Designer.</span>
        </h1>

        <p className="text-lg sm:text-xl text-slate-500 max-w-2xl leading-relaxed mb-10">
          I turn real problems into clearer, more usable experiences — using
          research, usability testing, and visual design to find where people
          get stuck and{" "}
          <span className="font-[family-name:var(--font-serif)] italic text-slate-700">
            redesign flows
          </span>{" "}
          that move them forward.
        </p>

        <div className="flex flex-wrap gap-4">
          <a
            href="#projects"
            className="group inline-flex items-center gap-2 bg-indigo-600 text-white px-6 py-3 rounded-full font-medium hover:bg-indigo-700 transition-colors text-sm"
          >
            View my work
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
            href="#contact"
            className="inline-flex items-center gap-2 border border-slate-200 text-slate-700 px-6 py-3 rounded-full font-medium hover:border-indigo-300 hover:text-indigo-600 transition-colors text-sm bg-white/60 backdrop-blur"
          >
            Contact me
          </a>
        </div>

        {/* Quick stats with animated counters */}
        <div className="mt-16 pt-10 border-t border-slate-200 grid grid-cols-3 gap-6 sm:gap-16 max-w-2xl">
          {[
            { value: 6, suffix: "+", label: "Case Studies" },
            { value: 2, suffix: "+", label: "Years Experience" },
            { value: 0, suffix: "", label: "Agile Certified", text: "ICP" },
          ].map((s) => (
            <div key={s.label}>
              <div className="text-3xl sm:text-4xl font-bold text-slate-900 font-[family-name:var(--font-serif)]">
                {s.text ? s.text : <AnimatedNumber target={s.value} suffix={s.suffix} />}
              </div>
              <div className="text-xs sm:text-sm text-slate-500 mt-1">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Scroll indicator */}
        <div className="hidden md:flex absolute bottom-8 left-1/2 -translate-x-1/2 flex-col items-center gap-2 text-slate-400">
          <span className="text-xs uppercase tracking-widest">Scroll</span>
          <div className="w-px h-10 bg-gradient-to-b from-slate-400 to-transparent" />
        </div>
      </div>
    </section>
  );
}
