"use client";

import { useEffect, useRef, useState } from "react";
import { useAudience } from "./AudienceContext";
import { AUDIENCES, AUDIENCE_META } from "./content";

function Toast() {
  const { changeSignal, audience, gateOpen } = useAudience();
  const [show, setShow] = useState(false);
  const first = useRef(true);

  useEffect(() => {
    if (changeSignal === 0) return; // never fired
    if (first.current) { first.current = false; }
    setShow(true);
    const t = window.setTimeout(() => setShow(false), 3600);
    return () => window.clearTimeout(t);
  }, [changeSignal]);

  if (!audience || gateOpen) return null;
  const meta = AUDIENCE_META[audience];

  return (
    <div
      aria-live="polite"
      className={`fixed bottom-24 right-6 z-[80] max-w-[18rem] transition-all duration-300 motion-reduce:transition-none ${
        show ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3 pointer-events-none"
      }`}
    >
      <div className="rounded-xl bg-slate-900 text-white shadow-xl px-4 py-3 flex items-start gap-3">
        <span className="mt-0.5 inline-flex w-5 h-5 items-center justify-center rounded-full" style={{ background: meta.accent }}>
          <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth={3} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </span>
        <p className="text-xs leading-relaxed">
          Reshaped for a <span className="font-semibold">{meta.chip.toLowerCase()}</span>.
          Sections reordered and the intro rewritten for you.
        </p>
      </div>
    </div>
  );
}

export default function LensSwitcher() {
  const { mounted, audience, gateOpen, choose, reopenGate } = useAudience();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onDown = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, []);

  if (!mounted || gateOpen) return null;

  const current = audience ? AUDIENCE_META[audience] : null;

  return (
    <>
      <Toast />
      <div ref={ref} className="fixed bottom-6 right-6 z-[80]">
        {open && (
          <div className="absolute bottom-full right-0 mb-3 w-60 rounded-2xl bg-white shadow-2xl border border-slate-100 p-2">
            <p className="px-3 pt-2 pb-1 text-[10px] font-semibold uppercase tracking-wider text-slate-500">
              View this portfolio as
            </p>
            {AUDIENCES.map((a) => {
              const meta = AUDIENCE_META[a];
              const activeLens = a === audience;
              return (
                <button
                  key={a}
                  onClick={() => { choose(a); setOpen(false); }}
                  className={`w-full flex items-center gap-3 text-left px-3 py-2 rounded-xl transition-colors ${
                    activeLens ? "bg-slate-50" : "hover:bg-slate-50"
                  }`}
                >
                  <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: meta.accent }} />
                  <span className="flex-1">
                    <span className="block text-sm font-medium text-slate-800">{meta.chip}</span>
                    <span className="block text-xs text-slate-500">{meta.line}</span>
                  </span>
                  {activeLens && (
                    <svg className="w-4 h-4 text-indigo-600" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </button>
              );
            })}
            <button
              onClick={() => { reopenGate(); setOpen(false); }}
              className="w-full text-left px-3 py-2 mt-1 rounded-xl text-xs text-slate-500 hover:text-slate-600 hover:bg-slate-50 transition-colors border-t border-slate-100"
            >
              ↺ Start over
            </button>
          </div>
        )}

        <button
          onClick={() => setOpen((o) => !o)}
          className="flex items-center gap-2 rounded-full bg-white shadow-lg border border-slate-200 pl-3 pr-3.5 py-2.5 hover:shadow-xl transition-shadow"
          aria-label="Switch viewing lens"
        >
          <svg className="w-4 h-4 text-slate-500" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7Z" />
            <circle cx="12" cy="12" r="3" />
          </svg>
          <span className="text-xs font-medium text-slate-600">
            {current ? <>Viewing as <span className="font-semibold text-slate-900">{current.chip}</span></> : "Choose a lens"}
          </span>
          <span className="w-1.5 h-1.5 rounded-full" style={{ background: current?.accent ?? "#94a3b8" }} />
        </button>
      </div>
    </>
  );
}
