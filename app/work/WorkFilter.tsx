"use client";

import { useEffect, useState } from "react";
import { serviceTagClass } from "@/sanity/lib/services";

export type FilterTag = { slug: string; label: string };

/**
 * Filters the case-study cards on /work by client or work area. The active
 * filter lives in the URL hash (/work#runwayz, /work#design), so filtered
 * views can be linked to. Without JavaScript every card simply shows.
 */
export function WorkFilter({ clients, areas }: { clients: FilterTag[]; areas: FilterTag[] }) {
  const [active, setActive] = useState("");
  const [shown, setShown] = useState<number | null>(null);

  useEffect(() => {
    const read = () => setActive(decodeURIComponent(window.location.hash.slice(1)));
    read();
    window.addEventListener("hashchange", read);
    return () => window.removeEventListener("hashchange", read);
  }, []);

  useEffect(() => {
    const cards = [...document.querySelectorAll<HTMLElement>("[data-work-tags]")];
    let count = 0;
    for (const card of cards) {
      const match = !active || card.dataset.workTags!.split(" ").includes(active);
      card.hidden = !match;
      if (match) count++;
    }
    setShown(count);
  }, [active]);

  const pick = (slug: string) => {
    const next = slug === active ? "" : slug;
    history.replaceState(null, "", next ? `#${next}` : window.location.pathname);
    setActive(next);
  };

  const chip = (t: FilterTag, tone: "ink" | "yellow") => {
    const on = active === t.slug;
    return (
      <li key={t.slug}>
        <button
          type="button"
          aria-pressed={on}
          onClick={() => pick(t.slug)}
          className={`px-2.5 py-1 font-display text-sm font-bold transition-colors ${
            on
              ? tone === "ink"
                ? "bg-ink text-paper"
                : (serviceTagClass[t.slug] ?? "bg-yellow text-ink")
              : "bg-transparent text-ink ring-2 ring-ink/15 ring-inset hover:ring-ink/60"
          }`}
        >
          {t.label}
        </button>
      </li>
    );
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center gap-3">
        <span className="w-16 text-sm opacity-70">Client</span>
        <ul className="flex flex-wrap gap-2">{clients.map((t) => chip(t, "ink"))}</ul>
      </div>
      <div className="flex flex-wrap items-center gap-3">
        <span className="w-16 text-sm opacity-70">Work</span>
        <ul className="flex flex-wrap gap-2">{areas.map((t) => chip(t, "yellow"))}</ul>
      </div>
      <p aria-live="polite" className="text-sm opacity-70">
        {active && shown !== null ? (
          <>
            Showing {shown} {shown === 1 ? "case study" : "case studies"} ·{" "}
            <button type="button" onClick={() => pick("")} className="underline underline-offset-4">
              Show all
            </button>
          </>
        ) : null}
      </p>
    </div>
  );
}
