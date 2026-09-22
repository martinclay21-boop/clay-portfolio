"use client";

import { useEffect, useState } from "react";
import { ArrowRight, Download } from "lucide-react";
import { useAudience } from "@/components/audience/AudienceContext";
import {
  heroFor,
  LOOKING_FOR,
  TARGET_ROLES,
} from "@/components/audience/content";
import { Button } from "@/components/ui/button";
import { ButtonColorful } from "@/components/ui/button-colorful";
import { ContainerScroll } from "@/components/ui/container-scroll-animation";
import { TextRepel } from "@/components/ui/text-repel";

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
    <section className="relative overflow-hidden bg-gradient-to-br from-slate-50 via-white to-indigo-50">
      {/* Soft floating blobs */}
      <div className="pointer-events-none absolute right-20 top-20 h-72 w-72 rounded-full bg-indigo-200/40 blur-3xl float" />
      <div className="pointer-events-none absolute bottom-20 left-10 h-96 w-96 rounded-full bg-purple-200/30 blur-3xl float" style={{ animationDelay: "2s" }} />

      <ContainerScroll
        className="relative"
        titleComponent={
          <div key={audience ?? "default"} className="hero-swap px-4">
            {copy.showBadge ? (
              <div
                className="mb-6 inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-sm font-medium"
                style={{ color: "var(--accent)", background: "var(--accent-soft)" }}
              >
                <span className="h-2 w-2 animate-pulse rounded-full" style={{ background: "var(--accent)" }} />
                {copy.eyebrow}
              </div>
            ) : (
              <p className="mb-5 text-xs font-semibold uppercase tracking-[0.2em]" style={{ color: "var(--accent)" }}>
                {copy.eyebrow}
              </p>
            )}

            <h1 className="text-5xl font-bold leading-[1.05] tracking-tight text-slate-900 sm:text-6xl lg:text-7xl">
              <TextRepel text="Clay Martin" radius={140} strength={38} />
            </h1>

            <p className="mt-4 font-[family-name:var(--font-serif)] text-2xl italic sm:text-3xl lg:text-4xl" style={{ color: "var(--accent)" }}>
              <TextRepel text={TARGET_ROLES.join(" · ")} radius={110} strength={13} />
            </p>

            <p className="mt-4 text-base text-slate-500 sm:text-lg">
              <TextRepel text={LOOKING_FOR} radius={90} strength={8} />
            </p>
          </div>
        }
      >
        <div key={audience ?? "default"} className="hero-swap flex h-full flex-col justify-center text-left">
          <p className="max-w-2xl text-base leading-relaxed text-slate-600 sm:text-lg">
            {copy.sub}
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-4">
            <ButtonColorful
              href={copy.primary.href}
              label={copy.primary.label}
              icon={
                <ArrowRight
                  aria-hidden
                  className="h-4 w-4 shrink-0 transition-transform duration-200 group-hover:translate-x-1"
                />
              }
            />
            <Button
              asChild
              variant="outline"
              className="h-11 rounded-full border-slate-200 bg-white/60 px-6 text-sm font-medium text-slate-700 backdrop-blur"
            >
              <a href={copy.secondary.href}>{copy.secondary.label}</a>
            </Button>
            {copy.resume && (
              <Button
                asChild
                variant="ghost"
                className="group h-11 rounded-full px-5 text-sm font-medium text-slate-700"
              >
                <a href={copy.resume.href} target="_blank" rel="noopener noreferrer">
                  <Download
                    aria-hidden
                    className="mr-2 h-4 w-4 shrink-0 transition-transform duration-200 group-hover:translate-y-0.5"
                  />
                  {copy.resume.label}
                </a>
              </Button>
            )}
          </div>

          {/* Recruiter-only scan strip — truthful quick facts */}
          {copy.quickFacts && (
            <div className="mt-6 flex flex-wrap gap-2">
              {copy.quickFacts.map((fact) => (
                <span key={fact} className="rounded-full border border-slate-200 bg-white/70 px-3 py-1.5 text-xs font-medium text-slate-600 backdrop-blur">
                  {fact}
                </span>
              ))}
            </div>
          )}

          <div className="mt-10 grid max-w-2xl grid-cols-3 gap-6 border-t border-slate-200 pt-8 sm:gap-16">
            <div>
              <div className="font-[family-name:var(--font-serif)] text-3xl font-bold text-slate-900 sm:text-4xl">
                <AnimatedNumber target={6} suffix="+" delay={0} />
              </div>
              <div className="mt-1 text-xs text-slate-500 sm:text-sm">Case Studies</div>
            </div>
            <div>
              <div className="font-[family-name:var(--font-serif)] text-3xl font-bold text-slate-900 sm:text-4xl">
                <AnimatedNumber target={2} suffix="+" delay={200} />
              </div>
              <div className="mt-1 text-xs text-slate-500 sm:text-sm">Years Experience</div>
            </div>
            <div>
              <div className="font-[family-name:var(--font-serif)] text-3xl font-bold text-slate-900 sm:text-4xl">
                <AnimatedText text="ICP" delay={400} />
              </div>
              <div className="mt-1 text-xs text-slate-500 sm:text-sm">Agile Certified</div>
            </div>
          </div>
        </div>
      </ContainerScroll>
    </section>
  );
}
