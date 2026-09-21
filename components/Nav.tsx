"use client";

import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ButtonColorful } from "@/components/ui/button-colorful";

const links = [
  { label: "About", href: "#about" },
  { label: "Projects", href: "#projects" },
  { label: "Skills", href: "#skills" },
  { label: "Contact", href: "#contact" },
];

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
        scrolled ? "bg-white/90 backdrop-blur-md shadow-sm" : "bg-transparent"
      }`}
    >
      <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
        <a
          href="#"
          className="text-base font-semibold text-slate-900 tracking-tight"
        >
          Clay Martin
        </a>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-8">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="text-sm text-slate-600 hover:text-indigo-600 transition-colors"
            >
              {l.label}
            </a>
          ))}
          <ButtonColorful
            href="mailto:martinclay21@gmail.com"
            label="Get in touch"
            icon={null}
            className="h-9 px-4"
            // The header stays calm at rest; the glow is a hover affordance only.
            glowClassName="opacity-0 group-hover:opacity-80 group-focus-within:opacity-80"
          />
        </nav>

        {/* Mobile hamburger */}
        <Button
          variant="ghost"
          size="icon"
          className="text-slate-600 md:hidden"
          onClick={() => setOpen(!open)}
          aria-label="Toggle menu"
          aria-expanded={open}
        >
          {open ? (
            <X aria-hidden className="h-5 w-5" />
          ) : (
            <Menu aria-hidden className="h-5 w-5" />
          )}
        </Button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden bg-white border-t border-slate-100 px-6 py-4 flex flex-col gap-4">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              className="text-sm text-slate-700 hover:text-indigo-600"
            >
              {l.label}
            </a>
          ))}
          <a
            href="mailto:martinclay21@gmail.com"
            className="text-sm text-indigo-600 font-medium"
          >
            Get in touch
          </a>
        </div>
      )}
    </header>
  );
}
