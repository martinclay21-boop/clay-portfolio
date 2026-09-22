"use client";

import Reveal from "@/components/Reveal";
import {
  CardStack,
  useContainerWidth,
  type CardStackItem,
} from "@/components/ui/card-stack";
import { TESTIMONIALS } from "./content";

type Quote = CardStackItem & { text: string; from: string };

// Verbatim peer feedback. Wording is not edited here, only carried through.
const quotes: Quote[] = TESTIMONIALS.map((t, i) => ({
  id: i,
  title: t.from,
  text: t.text,
  from: t.from,
}));

function useStackSize() {
  const { ref, width } = useContainerWidth<HTMLDivElement>();

  const compact = width < 720;
  const cardWidth = compact
    ? Math.max(260, width - 28)
    : Math.round(Math.min(560, Math.max(340, width * 0.38)));

  return {
    ref,
    compact,
    cardWidth,
    // Sized for the longest quote; shorter ones centre rather than leaving a gap.
    cardHeight: compact ? 340 : 300,
    maxVisible: compact ? 3 : 5,
    spreadDeg: compact ? 22 : 34,
    overlap: compact ? 0.3 : 0.4,
  };
}

export default function Testimonials() {
  const { ref, compact, cardWidth, cardHeight, maxVisible, spreadDeg, overlap } =
    useStackSize();

  return (
    <section id="testimonials" className="py-24 bg-white">
      <div className="max-w-5xl mx-auto px-6">
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
          <p className="text-slate-500 text-base max-w-xl mb-12">
            Anonymous feedback from the people I actually worked with on a group design sprint.
          </p>
        </Reveal>
      </div>

      <div ref={ref}>
        <CardStack<Quote>
          items={quotes}
          label="Peer feedback"
          maxVisible={maxVisible}
          cardWidth={cardWidth}
          cardHeight={cardHeight}
          spreadDeg={spreadDeg}
          overlap={overlap}
          depthPx={compact ? 80 : 120}
          renderCard={(q) => (
            <figure className="flex h-full flex-col justify-center p-7 sm:p-8">
              <span
                aria-hidden
                className="mb-1 block font-[family-name:var(--font-serif)] text-5xl leading-none"
                style={{ color: "var(--accent)" }}
              >
                &ldquo;
              </span>
              <blockquote className="font-[family-name:var(--font-serif)] text-lg leading-snug text-slate-800 text-balance sm:text-xl">
                {q.text}
              </blockquote>
              <figcaption className="mt-4 text-xs font-medium text-slate-500">
                {q.from}, group design sprint
              </figcaption>
            </figure>
          )}
        />
      </div>

      {/* The stack only exposes the front card, so the full set stays readable
          for anyone not using the carousel. */}
      <div className="sr-only">
        <h3>All peer feedback</h3>
        <ul>
          {quotes.map((q) => (
            <li key={q.id}>
              <blockquote>{q.text}</blockquote>
              <p>{q.from}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
