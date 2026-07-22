"use client";

import Reveal from "@/components/Reveal";
import { TESTIMONIALS } from "./content";

export default function Testimonials() {
  const [featured, ...rest] = TESTIMONIALS;

  return (
    <section id="testimonials" className="py-24 px-6 bg-white">
      <div className="max-w-5xl mx-auto">
        <Reveal>
          <p className="text-xs font-semibold uppercase tracking-widest mb-4" style={{ color: "var(--accent)" }}>
            Peer feedback
          </p>
          <h2 className="text-4xl sm:text-5xl font-bold text-slate-900 mb-4 leading-tight">
            What my{" "}
            <span className="font-[family-name:var(--font-serif)] italic font-normal" style={{ color: "var(--accent)" }}>
              teammates
            </span>{" "}
            say
          </h2>
          <p className="text-slate-500 text-base max-w-xl mb-14">
            Anonymous feedback from the people I actually worked with on a group design sprint.
          </p>
        </Reveal>

        {/* Featured quote */}
        <Reveal className="mb-16">
          <figure className="max-w-3xl">
            <span
              aria-hidden
              className="block font-[family-name:var(--font-serif)] text-7xl leading-none mb-1"
              style={{ color: "var(--accent)" }}
            >
              &ldquo;
            </span>
            <blockquote className="text-2xl sm:text-[1.75rem] font-[family-name:var(--font-serif)] text-slate-800 leading-snug text-balance">
              {featured.text}
            </blockquote>
            <figcaption className="mt-5 text-sm font-medium text-slate-500">
              {featured.from}, group design sprint
            </figcaption>
          </figure>
        </Reveal>

        {/* The rest, flowing in balanced columns so heights vary naturally */}
        <div className="columns-1 md:columns-2 gap-10 [column-fill:balance]">
          {rest.map((t, i) => (
            <Reveal key={i} delay={i * 70} className="break-inside-avoid mb-9">
              <figure>
                <blockquote className="text-slate-600 leading-relaxed text-[0.95rem]">
                  <span
                    aria-hidden
                    className="mr-1 font-[family-name:var(--font-serif)] text-xl"
                    style={{ color: "var(--accent)" }}
                  >
                    &ldquo;
                  </span>
                  {t.text}
                </blockquote>
                <figcaption className="mt-2.5 text-xs font-medium text-slate-500">{t.from}</figcaption>
              </figure>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
