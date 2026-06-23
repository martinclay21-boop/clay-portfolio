"use client";

import { useRef, useState, useCallback, useEffect } from "react";
import { Canvas } from "@react-three/fiber";
import { CityScene } from "./Scene";
import { ABOUT, SKILL_GROUPS, EXPERIENCE, type Place } from "./data";
import type { PointerLockControls as PLCImpl } from "three-stdlib";

const BASE = "/clay-portfolio";

function MobileFallback() {
  return (
    <div style={{
      position: "fixed", inset: 0,
      background: "linear-gradient(160deg, #fdeede 0%, #cfe1f3 100%)",
      display: "flex", flexDirection: "column",
      alignItems: "center", justifyContent: "center",
      padding: "2rem", textAlign: "center",
    }}>
      <div style={{
        width: 48, height: 48, borderRadius: 14,
        background: "linear-gradient(135deg, #2BB0A4, #378ADD)",
        marginBottom: "2rem",
        display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: 20, color: "white", fontWeight: 700,
      }}>CM</div>
      <p style={{ color: "#2BB0A4", fontSize: 11, letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: "1rem", fontWeight: 600 }}>
        Clay Martin · UX Designer
      </p>
      <h1 style={{ color: "#2b3a4a", fontSize: "2rem", fontWeight: 700, lineHeight: 1.2, marginBottom: "1.5rem" }}>
        Best experienced<br />on a laptop
      </h1>
      <p style={{ color: "#5a6b7a", fontSize: "0.9rem", lineHeight: 1.7, maxWidth: 280, marginBottom: "2.5rem" }}>
        This portfolio is a walkable 3D town. Come back on a desktop or laptop for the full experience.
      </p>
      <a href={`${BASE}/projects/cuekit/`} style={{
        display: "inline-flex", alignItems: "center", gap: 8,
        background: "#2BB0A4", color: "white",
        padding: "0.75rem 1.5rem", borderRadius: 9999,
        fontSize: "0.85rem", fontWeight: 600, textDecoration: "none",
      }}>
        View case studies instead →
      </a>
    </div>
  );
}

function StartScreen({ onStart }: { onStart: () => void }) {
  return (
    <div
      onClick={onStart}
      style={{
        position: "fixed", inset: 0,
        background: "linear-gradient(160deg, #fdeede 0%, #bcdaf2 60%, #a9d4f2 100%)",
        display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center",
        cursor: "pointer", zIndex: 20,
      }}
    >
      <p style={{ color: "#2BB0A4", fontSize: 11, letterSpacing: "0.25em", textTransform: "uppercase", marginBottom: "1.5rem", fontWeight: 700 }}>
        Clay Martin
      </p>
      <h1 style={{
        color: "#2b3a4a", fontSize: "clamp(2.5rem, 6vw, 5rem)",
        fontWeight: 800, letterSpacing: "-0.02em",
        lineHeight: 1, marginBottom: "0.5rem", textAlign: "center",
      }}>
        A little town<br />of my work
      </h1>
      <p style={{ color: "#56707f", fontSize: "clamp(1rem, 2vw, 1.3rem)", marginBottom: "3.5rem", fontStyle: "italic" }}>
        UX Designer · Miami University 2026
      </p>

      <div style={{
        background: "#2BB0A4", color: "white",
        borderRadius: 9999,
        padding: "1rem 2.5rem",
        fontSize: "0.9rem", fontWeight: 600,
        letterSpacing: "0.08em", textTransform: "uppercase",
        boxShadow: "0 10px 30px rgba(43,176,164,0.35)",
      }}>
        Click to enter the town
      </div>

      <p style={{ color: "#7a8a96", fontSize: "0.75rem", marginTop: "2rem", letterSpacing: "0.05em" }}>
        WASD to walk · Mouse to look · Click a building to open
      </p>
    </div>
  );
}

/* ---------- Overlay content per building type ---------- */

function ProjectBody({ place }: { place: Place }) {
  return (
    <>
      <p style={{ color: "#5a6573", fontSize: "0.95rem", lineHeight: 1.7, marginBottom: "1.75rem" }}>
        {place.description}
      </p>
      <a
        href={`${BASE}/projects/${place.slug}/`}
        target="_blank"
        rel="noopener noreferrer"
        style={{
          display: "inline-flex", alignItems: "center", gap: 8,
          background: place.color, color: "white",
          padding: "0.75rem 1.5rem", borderRadius: 9999,
          fontSize: "0.85rem", fontWeight: 600, textDecoration: "none",
        }}
      >
        Read case study ↗
      </a>
    </>
  );
}

function AboutBody({ accent }: { accent: string }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
      <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
        {ABOUT.bio.map((p, i) => (
          <p key={i} style={{ color: "#5a6573", fontSize: "0.92rem", lineHeight: 1.7 }}>{p}</p>
        ))}
      </div>

      <div>
        <p style={{ color: accent, fontSize: 11, letterSpacing: "0.15em", textTransform: "uppercase", fontWeight: 700, marginBottom: "0.75rem" }}>Education</p>
        {ABOUT.education.map((e) => (
          <div key={e.title} style={{ marginBottom: "0.85rem" }}>
            <span style={{ color: "#94a0ad", fontSize: "0.7rem" }}>{e.year}</span>
            <p style={{ color: "#2b3a4a", fontSize: "0.88rem", fontWeight: 600 }}>{e.title}</p>
            <p style={{ color: "#6b7783", fontSize: "0.82rem" }}>{e.org}</p>
            <p style={{ color: "#94a0ad", fontSize: "0.76rem" }}>{e.detail}</p>
          </div>
        ))}
      </div>

      <div>
        <p style={{ color: accent, fontSize: 11, letterSpacing: "0.15em", textTransform: "uppercase", fontWeight: 700, marginBottom: "0.75rem" }}>Certifications</p>
        {ABOUT.certifications.map((c) => (
          <div key={c.title} style={{ marginBottom: "0.85rem" }}>
            <span style={{ color: "#94a0ad", fontSize: "0.7rem" }}>{c.year}</span>
            <p style={{ color: "#2b3a4a", fontSize: "0.88rem", fontWeight: 600 }}>{c.title}</p>
            <p style={{ color: "#6b7783", fontSize: "0.82rem" }}>{c.org}</p>
            <p style={{ color: "#94a0ad", fontSize: "0.76rem" }}>{c.detail}</p>
          </div>
        ))}
      </div>

      <a href={`mailto:${ABOUT.email}`} style={{
        display: "inline-flex", alignItems: "center", gap: 8, alignSelf: "flex-start",
        background: accent, color: "white", padding: "0.7rem 1.4rem",
        borderRadius: 9999, fontSize: "0.82rem", fontWeight: 600, textDecoration: "none",
      }}>
        Let&apos;s connect →
      </a>
    </div>
  );
}

function SkillsBody({ accent }: { accent: string }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.4rem" }}>
      {SKILL_GROUPS.map((g) => (
        <div key={g.heading}>
          <p style={{ color: accent, fontSize: 11, letterSpacing: "0.15em", textTransform: "uppercase", fontWeight: 700, marginBottom: "0.65rem" }}>
            {g.heading}
          </p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "0.45rem" }}>
            {g.skills.map((s) => (
              <span key={s} style={{
                background: `${accent}18`, color: "#3a4654",
                padding: "0.35rem 0.8rem", borderRadius: 9999,
                fontSize: "0.78rem", fontWeight: 500,
              }}>{s}</span>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

function ExperienceBody({ accent }: { accent: string }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
      {EXPERIENCE.map((e) => (
        <div key={`${e.org}-${e.role}`} style={{ borderLeft: `2px solid ${accent}40`, paddingLeft: "1rem" }}>
          <span style={{ color: "#94a0ad", fontSize: "0.72rem" }}>{e.period} · {e.location}</span>
          <p style={{ color: "#2b3a4a", fontSize: "0.95rem", fontWeight: 700 }}>{e.role}</p>
          <p style={{ color: accent, fontSize: "0.82rem", fontWeight: 600, marginBottom: "0.5rem" }}>{e.org}</p>
          <ul style={{ margin: 0, paddingLeft: "1rem", display: "flex", flexDirection: "column", gap: "0.4rem" }}>
            {e.bullets.map((b, i) => (
              <li key={i} style={{ color: "#5a6573", fontSize: "0.82rem", lineHeight: 1.55 }}>{b}</li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}

function PlaceOverlay({ place, onClose }: { place: Place; onClose: () => void }) {
  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 30,
      display: "flex", alignItems: "flex-end", justifyContent: "center",
      padding: "1.5rem",
    }}>
      <div onClick={onClose} style={{ position: "absolute", inset: 0, background: "rgba(20,30,40,0.45)" }} />

      <div style={{
        position: "relative", zIndex: 1,
        background: "#ffffff",
        border: `1px solid ${place.color}40`,
        borderRadius: 24,
        padding: "2rem",
        width: "100%", maxWidth: 620,
        maxHeight: "78vh", overflowY: "auto",
        boxShadow: `0 20px 60px rgba(20,30,40,0.25)`,
      }}>
        <div style={{ width: 40, height: 4, background: place.color, borderRadius: 9999, marginBottom: "1.25rem" }} />

        <p style={{ color: place.color, fontSize: 11, letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: "0.4rem", fontWeight: 700 }}>
          {place.subtitle}
        </p>
        <h2 style={{ color: "#1f2a36", fontSize: "1.75rem", fontWeight: 700, marginBottom: "1.25rem", lineHeight: 1.2 }}>
          {place.title}
        </h2>

        {place.kind === "project" && <ProjectBody place={place} />}
        {place.kind === "about" && <AboutBody accent={place.color} />}
        {place.kind === "skills" && <SkillsBody accent={place.color} />}
        {place.kind === "experience" && <ExperienceBody accent={place.color} />}

        <div style={{ marginTop: "1.75rem" }}>
          <button
            onClick={onClose}
            style={{
              background: "transparent", border: "1px solid #d4dce4",
              color: "#7a8a96", padding: "0.7rem 1.25rem",
              borderRadius: 9999, fontSize: "0.85rem", cursor: "pointer",
            }}
          >
            Keep walking
          </button>
        </div>
      </div>
    </div>
  );
}

function HUD({ isLocked }: { isLocked: boolean }) {
  if (!isLocked) return null;
  return (
    <>
      <div style={{ position: "fixed", top: "50%", left: "50%", transform: "translate(-50%, -50%)", pointerEvents: "none", zIndex: 10 }}>
        <div style={{ width: 16, height: 1, background: "rgba(40,50,60,0.6)", position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)" }} />
        <div style={{ width: 1, height: 16, background: "rgba(40,50,60,0.6)", position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)" }} />
      </div>
      <div style={{
        position: "fixed", bottom: 24, left: "50%", transform: "translateX(-50%)",
        color: "rgba(40,50,60,0.45)", fontSize: "0.7rem",
        letterSpacing: "0.1em", textTransform: "uppercase", zIndex: 10, pointerEvents: "none",
      }}>
        WASD · Mouse · Click buildings · ESC to pause
      </div>
    </>
  );
}

export default function CityExperience() {
  const isMobile = typeof window !== "undefined" && window.innerWidth < 768;

  const [started, setStarted] = useState(false);
  const [isLocked, setIsLocked] = useState(false);
  const [selected, setSelected] = useState<Place | null>(null);
  const [pending, setPending] = useState<Place | null>(null);
  const controlsRef = useRef<PLCImpl | null>(null);

  useEffect(() => {
    const onChange = () => {
      const locked = !!document.pointerLockElement;
      setIsLocked(locked);
      if (!locked && pending) {
        setSelected(pending);
        setPending(null);
      }
    };
    document.addEventListener("pointerlockchange", onChange);
    return () => document.removeEventListener("pointerlockchange", onChange);
  }, [pending]);

  const handleStart = useCallback(() => {
    setStarted(true);
    try { controlsRef.current?.lock(); } catch (e) { console.warn("PointerLock:", e); }
  }, []);

  const handleSelectPlace = useCallback((p: Place) => {
    setPending(p);
    document.exitPointerLock();
    try { controlsRef.current?.unlock(); } catch {}
  }, []);

  const handleClose = useCallback(() => setSelected(null), []);

  const handleCanvasClick = useCallback(() => {
    if (!selected && !pending && started) {
      try { controlsRef.current?.lock(); } catch {}
    }
  }, [selected, pending, started]);

  if (isMobile) return <MobileFallback />;

  return (
    <div style={{ position: "fixed", inset: 0, background: "#cfe1f3" }}>
      {!started && <StartScreen onStart={handleStart} />}

      <Canvas
        shadows
        camera={{ fov: 70, near: 0.1, far: 600, position: [0, 1.8, 13] }}
        style={{ position: "absolute", inset: 0 }}
        onClick={handleCanvasClick}
        onCreated={({ gl }) => {
          gl.setPixelRatio(Math.min(window.devicePixelRatio, 2));
          gl.toneMapping = 4; // ACESFilmicToneMapping
          gl.toneMappingExposure = 1.05;
        }}
      >
        <CityScene onSelectPlace={handleSelectPlace} controlsRef={controlsRef} />
      </Canvas>

      <HUD isLocked={isLocked} />

      {selected && <PlaceOverlay place={selected} onClose={handleClose} />}
    </div>
  );
}
