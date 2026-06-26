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

export function AudienceProvider({ children }: { children: React.ReactNode }) {
  const [audience, setAudience] = useState<Audience | null>(null);
  const [mounted, setMounted] = useState(false);
  const [gateOpen, setGateOpen] = useState(false);
  const [changeSignal, setChangeSignal] = useState(0);

  // Greet every visit with the gate — the first thing anyone sees is the
  // "who are you?" question, so the experience is always tailored on entry.
  useEffect(() => {
    setMounted(true);
    setGateOpen(true);
  }, []);

  const choose = useCallback((a: Audience) => {
    setAudience(a);
    setGateOpen(false);
    setChangeSignal((n) => n + 1);
  }, []);

  const reopenGate = useCallback(() => setGateOpen(true), []);
  const closeGate = useCallback(() => setGateOpen(false), []);

  return (
    <Ctx.Provider value={{ audience, mounted, gateOpen, changeSignal, choose, reopenGate, closeGate }}>
      {children}
    </Ctx.Provider>
  );
}
