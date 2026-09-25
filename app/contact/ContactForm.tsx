"use client";

import { useEffect } from "react";

/** The Tally form behind /contact (notifications go to both founders; set in Tally). */
const TALLY_FORM_ID = "LZlg11";

declare global {
  interface Window {
    Tally?: { loadEmbeds: () => void };
  }
}

/**
 * Tally's standard embed: transparent so the page's yellow shows through, no
 * repeated title (the page has its own heading), and dynamic height so it
 * sizes itself to the form. The noscript link keeps it usable without JS.
 */
export function ContactForm() {
  useEffect(() => {
    const src = "https://tally.so/widgets/embed.js";
    if (window.Tally) {
      window.Tally.loadEmbeds();
      return;
    }
    if (!document.querySelector(`script[src="${src}"]`)) {
      const script = document.createElement("script");
      script.src = src;
      script.async = true;
      script.onload = () => window.Tally?.loadEmbeds();
      document.body.appendChild(script);
    }
  }, []);

  return (
    <div className="max-w-2xl">
      <iframe
        data-tally-src={`https://tally.so/embed/${TALLY_FORM_ID}?alignLeft=1&hideTitle=1&transparentBackground=1&dynamicHeight=1`}
        loading="lazy"
        width="100%"
        height="520"
        title="Talk to Color/Math"
        className="block w-full border-0"
      />
      <noscript>
        <a href={`https://tally.so/r/${TALLY_FORM_ID}`} className="font-bold underline">
          Open the contact form
        </a>
      </noscript>
    </div>
  );
}
