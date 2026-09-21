"use client";

import * as React from "react";
import { ArrowUpRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ButtonColorfulProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  label?: string;
  /** Renders an anchor instead of a button. */
  href?: string;
  /** Opens the href in a new tab with a safe rel. */
  external?: boolean;
  /** Overrides the trailing ArrowUpRight. Pass `null` for no icon. */
  icon?: React.ReactNode;
  /** Extra classes for the glow layer (e.g. a stronger rest state on dark). */
  glowClassName?: string;
}

export function ButtonColorful({
  className,
  glowClassName,
  label = "Explore Components",
  href,
  external,
  icon,
  children,
  ...props
}: ButtonColorfulProps) {
  const content = (
    <span className="flex items-center justify-center gap-2">
      <span>{children ?? label}</span>
      {icon === undefined ? (
        <ArrowUpRight
          aria-hidden
          className="h-3.5 w-3.5 shrink-0 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
        />
      ) : (
        icon
      )}
    </span>
  );

  const face = (
    <Button
      asChild={Boolean(href)}
      style={{ background: "var(--accent)" }}
      className={cn(
        "relative h-11 rounded-full px-6 text-sm font-medium text-white",
        "shadow-sm transition-[transform,box-shadow] duration-200",
        "hover:shadow-md active:translate-y-px",
        className,
      )}
      {...props}
    >
      {href ? (
        <a
          href={href}
          {...(external
            ? { target: "_blank", rel: "noopener noreferrer" }
            : null)}
        >
          {content}
        </a>
      ) : (
        content
      )}
    </Button>
  );

  return (
    <span className="group relative inline-flex isolate">
      {/* Accent glow. Sits behind the opaque face, so it only reads as a halo
          around the edge and never lowers the white-on-accent text contrast. */}
      <span
        aria-hidden
        className={cn(
          "pointer-events-none absolute -inset-1 rounded-full blur-md",
          "opacity-45 transition-opacity duration-500",
          "group-hover:opacity-90 group-focus-within:opacity-90",
          glowClassName,
        )}
        style={{
          background:
            "linear-gradient(90deg, var(--accent-lift), var(--accent), var(--accent-lift))",
        }}
      />
      {face}
    </span>
  );
}

export type { ButtonColorfulProps };
