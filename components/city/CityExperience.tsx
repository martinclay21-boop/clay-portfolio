"use client";

import { useRef, useState, useCallback, useEffect } from "react";
import { Canvas } from "@react-three/fiber";
import { CityScene, PROJECTS } from "./Scene";
import type { Project } from "./Scene";
import type { PointerLockControls as PLCImpl } from "three-stdlib";

const BASE = "/clay-portfolio";

function MobileFallback() {
  return (
    <div style={{
      position: "fixed", inset: 0,
      background: "#05050f",
      display: "flex", flexDirection: "column",
      alignItems: "center", justifyContent: "center",
      padding: "2rem", textAlign: "center",
    }}>
      <div style={{
        width: 48, height: 48, borderRadius: "50%",
        background: "linear-gradient(135deg, #534AB7, #378ADD)",
        marginBottom: "2rem",
        display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: 20, color: "white", fontWeight: 700,
      }}>CM</div>
      <p style={{ color: "#534AB7", fontSize: 11, letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: "1rem" }}>
        Clay Martin · UX Designer
      </p>
      <h1 style={{ color: "white", fontSize: "2rem", fontWeight: 700, lineHeight: 1.2, marginBottom: "1.5rem" }}>
        Best experienced<br />on a laptop
      </h1>
      <p style={{ color: "#555580", fontSize: "0.9rem", lineHeight: 1.7, maxWidth: 280, marginBottom: "2.5rem" }}>
        This portfolio is a walkable 3D city. Come back on a desktop or laptop for the full experience.
      </p>
      <a href={`${BASE}/projects/cuekit/`} style={{
        display: "inline-flex", alignItems: "center", gap: 8,
        background: "#534AB7", color: "white",
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
        background: "#05050f",
        display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center",
        cursor: "pointer", zIndex: 20,
      }}
    >
      {/* Ambient glow */}
      <div style={{
        position: "absolute", width: 600, height: 600, borderRadius: "50%",
        background: "radial-gradient(circle, rgba(83,74,183,0.12) 0%, transparent 70%)",
        pointerEvents: "none",
      }} />

      <p style={{ color: "#534AB7", fontSize: 11, letterSpacing: "0.25em", textTransform: "uppercase", marginBottom: "1.5rem" }}>
        Clay Martin
      </p>
      <h1 style={{
        color: "white", fontSize: "clamp(2.5rem, 6vw, 5rem)",
        fontWeight: 800, letterSpacing: "-0.02em",
        lineHeight: 1, marginBottom: "0.5rem", textAlign: "center",
      }}>
        UX Designer
      </h1>
      <p style={{ color: "#7F77DD", fontSize: "clamp(1rem, 2vw, 1.3rem)", marginBottom: "4rem", fontStyle: "italic" }}>
        Fishers, IN · Miami University 2026
      </p>

      <div style={{
        border: "1px solid #534AB7",
        borderRadius: 9999,
        padding: "1rem 2.5rem",
        color: "#7F77DD",
        fontSize: "0.9rem",
        letterSpacing: "0.1em",
        textTransform: "uppercase",
        transition: "all 0.2s",
      }}>
        Click to enter the city
      </div>

      <p style={{ color: "#2a2a4a", fontSize: "0.75rem", marginTop: "2rem", letterSpacing: "0.05em" }}>
        WASD to walk · Mouse to look · Click a building to open
      </p>
    </div>
  );
}

function ProjectOverlay({ project, onClose }: { project: Project; onClose: () => void }) {
  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 30,
      display: "flex", alignItems: "flex-end", justifyContent: "center",
      padding: "1.5rem",
    }}>
      {/* Backdrop */}
      <div
        onClick={onClose}
        style={{ position: "absolute", inset: 0, background: "rgba(5,5,15,0.7)" }}
      />

      {/* Panel */}
      <div style={{
        position: "relative", zIndex: 1,
        background: "#0d0d1f",
        border: `1px solid ${project.color}40`,
        borderRadius: 24,
        padding: "2rem",
        width: "100%", maxWidth: 600,
        boxShadow: `0 0 60px ${project.color}20`,
      }}>
        {/* Color accent line */}
        <div style={{ width: 40, height: 3, background: project.color, borderRadius: 9999, marginBottom: "1.25rem" }} />

        <p style={{ color: project.color, fontSize: 11, letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: "0.5rem" }}>
          {project.category}
        </p>
        <h2 style={{ color: "white", fontSize: "1.75rem", fontWeight: 700, marginBottom: "1rem", lineHeight: 1.2 }}>
          {project.title}
        </h2>
        <p style={{ color: "#8888aa", fontSize: "0.95rem", lineHeight: 1.7, marginBottom: "1.75rem" }}>
          {project.description}
        </p>

        <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
          <a
            href={`${BASE}/projects/${project.slug}/`}
            style={{
              display: "inline-flex", alignItems: "center", gap: 8,
              background: project.color,
              color: "white", padding: "0.75rem 1.5rem",
              borderRadius: 9999, fontSize: "0.85rem", fontWeight: 600,
              textDecoration: "none",
            }}
          >
            Read case study →
          </a>
          <button
            onClick={onClose}
            style={{
              background: "transparent", border: "1px solid #2a2a4a",
              color: "#555580", padding: "0.75rem 1.25rem",
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
  return (
    <>
      {isLocked && (
        <>
          {/* Crosshair */}
          <div style={{
            position: "fixed", top: "50%", left: "50%",
            transform: "translate(-50%, -50%)",
            pointerEvents: "none", zIndex: 10,
          }}>
            <div style={{ width: 16, height: 1, background: "rgba(255,255,255,0.5)", position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)" }} />
            <div style={{ width: 1, height: 16, background: "rgba(255,255,255,0.5)", position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)" }} />
          </div>
          {/* Controls hint */}
          <div style={{
            position: "fixed", bottom: 24, left: "50%", transform: "translateX(-50%)",
            color: "rgba(255,255,255,0.25)", fontSize: "0.7rem",
            letterSpacing: "0.1em", textTransform: "uppercase", zIndex: 10,
            pointerEvents: "none",
          }}>
            WASD · Mouse · Click buildings · ESC to pause
          </div>
        </>
      )}
    </>
  );
}

export default function CityExperience() {
  const isMobile = typeof window !== "undefined" && window.innerWidth < 768;

  const [started, setStarted] = useState(false);
  const [isLocked, setIsLocked] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const controlsRef = useRef<PLCImpl | null>(null);

  useEffect(() => {
    const onChange = () => setIsLocked(!!document.pointerLockElement);
    document.addEventListener("pointerlockchange", onChange);
    return () => document.removeEventListener("pointerlockchange", onChange);
  }, []);

  const tryLock = useCallback(() => {
    try { controlsRef.current?.lock(); } catch {}
  }, []);

  const handleStart = useCallback(() => {
    setStarted(true);
    setTimeout(tryLock, 100);
  }, [tryLock]);

  const handleSelectProject = useCallback((p: Project) => {
    try { controlsRef.current?.unlock(); } catch {}
    setSelectedProject(p);
  }, []);

  const handleCloseOverlay = useCallback(() => {
    setSelectedProject(null);
    setTimeout(tryLock, 100);
  }, [tryLock]);

  if (isMobile) return <MobileFallback />;

  return (
    <div style={{ position: "fixed", inset: 0, background: "#05050f" }}>
      {!started && <StartScreen onStart={handleStart} />}

      <Canvas
        camera={{ fov: 75, near: 0.1, far: 200, position: [0, 1.8, 4] }}
        style={{ position: "absolute", inset: 0 }}
        onCreated={({ gl }) => {
          gl.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        }}
      >
        <CityScene
          onSelectProject={handleSelectProject}
          controlsRef={controlsRef}
        />
      </Canvas>

      <HUD isLocked={isLocked} />

      {selectedProject && (
        <ProjectOverlay project={selectedProject} onClose={handleCloseOverlay} />
      )}
    </div>
  );
}
