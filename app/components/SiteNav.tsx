"use client";

import { useEffect, useId, useRef, useState } from "react";

const LINKS = [
  { href: "/work/", label: "Work" },
  { href: "/contact/", label: "Contact" },
];

/**
 * The header nav. From md up: "/ Work  / Contact" inline. On phones: a
 * "/ Menu" button whose slash swings into an × as it opens a full-screen
 * ink menu with the same links, set large.
 */
export function SiteNav({ current }: { current?: string }) {
  const [open, setOpen] = useState(false);
  const panelId = useId();
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        buttonRef.current?.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    document.documentElement.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.documentElement.style.overflow = "";
    };
  }, [open]);

  return (
    <nav aria-label="Main">
      <ul className="hidden items-center gap-x-6 md:flex">
        {LINKS.map((l) => (
          <li key={l.href}>
            <a href={l.href} aria-current={current === l.label ? "page" : undefined} className="nav-swipe font-display text-lg font-bold">
              <span aria-hidden className="mr-1.5">/</span>
              {l.label}
            </a>
          </li>
        ))}
      </ul>

      <button
        ref={buttonRef}
        type="button"
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => setOpen((o) => !o)}
        className={`relative z-50 flex items-center gap-2 font-display text-lg font-bold md:hidden ${open ? "text-paper" : ""}`}
      >
        {/* The slash is one bar; opening swings it to 45° and fades in its
            partner at -45°, making an ×. */}
        <span aria-hidden className="relative block h-5 w-3">
          <span className={`absolute top-0 left-1/2 block h-full w-[2px] -translate-x-1/2 bg-current transition-transform duration-300 ${open ? "rotate-45" : "rotate-[22deg]"}`} />
          <span className={`absolute top-0 left-1/2 block h-full w-[2px] -translate-x-1/2 bg-current transition duration-300 ${open ? "-rotate-45 opacity-100" : "rotate-[22deg] opacity-0"}`} />
        </span>
        {open ? "Close" : "Menu"}
      </button>

      <div
        id={panelId}
        hidden={!open}
        className="fixed inset-0 z-40 bg-ink px-6 pt-32 text-paper md:hidden"
      >
        <ul className="space-y-6">
          {LINKS.map((l) => (
            <li key={l.href}>
              <a
                href={l.href}
                aria-current={current === l.label ? "page" : undefined}
                onClick={() => setOpen(false)}
                className="font-display text-5xl font-bold underline decoration-transparent decoration-4 underline-offset-8 hover:decoration-yellow focus-visible:decoration-yellow"
              >
                <span aria-hidden className="mr-3 text-yellow">/</span>
                {l.label}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}
