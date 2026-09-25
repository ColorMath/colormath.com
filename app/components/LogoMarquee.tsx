"use client";

import { useState } from "react";

export type Company = { name: string; logo: string; url: string };

/**
 * One continuously scrolling row of company logos (the list is rendered twice
 * so the loop is seamless). WCAG 2.2.2: anything that moves for more than 5s
 * needs a way to stop it, so there's a pause/play button; the row also pauses
 * on hover and on keyboard focus, and is static with reduced motion.
 */
export function LogoMarquee({ companies }: { companies: Company[] }) {
  const [paused, setPaused] = useState(false);
  return (
    <>
      <button
        type="button"
        aria-pressed={paused}
        onClick={() => setPaused((p) => !p)}
        className="logo-toggle font-display text-base font-bold underline decoration-2 underline-offset-4 hover:decoration-violet"
      >
        {paused ? "Play logos" : "Pause logos"}
      </button>
      <div
        className="logo-marquee mt-6 overflow-hidden py-3 pb-10"
        data-paused={paused || undefined}
      >
        <ul className="logo-track">
          {[0, 1].map((copy) =>
            companies.map((c) => (
              <li
                key={`${copy}-${c.name}`}
                aria-hidden={copy === 1 ? true : undefined}
                className="w-40 shrink-0 px-4 md:w-52 md:px-6"
              >
                <a
                  href={c.url}
                  tabIndex={copy === 1 ? -1 : undefined}
                  className="logo-link block text-ink/70 transition-colors hover:text-violet focus-visible:text-violet"
                >
                  <span
                    role="img"
                    aria-label={c.name}
                    className="logo-mark block aspect-[432/218] w-full"
                    style={{ "--logo": `url(/logos/${c.logo}.svg)` } as React.CSSProperties}
                  />
                </a>
              </li>
            ))
          )}
        </ul>
      </div>
    </>
  );
}
