"use client";

import { createContext, useCallback, useContext, useEffect, useState } from "react";
import type { Audience } from "./content";

interface AudienceState {
  audience: Audience | null;
  mounted: boolean;
  gateOpen: boolean;
  changeSignal: number; // bumps whenever the visitor actively picks a lens
  choose: (a: Audience) => void;
  reopenGate: () => void;
  closeGate: () => void;
}

const Ctx = createContext<AudienceState | null>(null);

export function useAudience() {
  const c = useContext(Ctx);
  if (!c) throw new Error("useAudience must be used within <AudienceProvider>");
  return c;
}

const KEY = "cm-audience";
const isAudience = (v: unknown): v is Audience =>
  v === "recruiter" || v === "designer" || v === "curious";

export function AudienceProvider({ children }: { children: React.ReactNode }) {
  const [audience, setAudience] = useState<Audience | null>(null);
  const [mounted, setMounted] = useState(false);
  const [gateOpen, setGateOpen] = useState(false);
  const [changeSignal, setChangeSignal] = useState(0);

  // On first mount, restore a saved lens or open the gate
  useEffect(() => {
    setMounted(true);
    let stored: string | null = null;
    try { stored = localStorage.getItem(KEY); } catch {}
    if (isAudience(stored)) setAudience(stored);
    else setGateOpen(true);
  }, []);

  const choose = useCallback((a: Audience) => {
    setAudience(a);
    setGateOpen(false);
    setChangeSignal((n) => n + 1);
    try { localStorage.setItem(KEY, a); } catch {}
  }, []);

  const reopenGate = useCallback(() => setGateOpen(true), []);
  const closeGate = useCallback(() => setGateOpen(false), []);

  return (
    <Ctx.Provider value={{ audience, mounted, gateOpen, changeSignal, choose, reopenGate, closeGate }}>
      {children}
    </Ctx.Provider>
  );
}
