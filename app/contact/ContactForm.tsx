"use client";

import { useEffect, useRef, useState } from "react";

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
  const [sent, setSent] = useState(false);
  const thanksRef = useRef<HTMLDivElement>(null);

  // Tally's embed posts a message when the form is submitted; swap in our own
  // thank-you (Tally's customisable one is a Pro feature).
  useEffect(() => {
    const onMessage = (e: MessageEvent) => {
      if (e.origin !== "https://tally.so" || typeof e.data !== "string") return;
      try {
        const msg = JSON.parse(e.data);
        if (msg?.event === "Tally.FormSubmitted" && msg?.payload?.formId === TALLY_FORM_ID) setSent(true);
      } catch {
        // not a Tally message
      }
    };
    window.addEventListener("message", onMessage);
    return () => window.removeEventListener("message", onMessage);
  }, []);

  useEffect(() => {
    if (sent) thanksRef.current?.focus();
  }, [sent]);

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

  if (sent) {
    return (
      <div
        ref={thanksRef}
        tabIndex={-1}
        role="status"
        className="max-w-2xl outline-none"
      >
        <p className="font-display text-3xl font-bold md:text-5xl">Thank you.</p>
        <p className="mt-5 max-w-[40ch] text-lg leading-relaxed md:text-xl">
          Your message is on its way to both of us. We read every one and
          we&apos;ll reply personally, usually within a couple of days.
        </p>
        <a
          href="/"
          className="mt-10 inline-flex items-center gap-2 font-display text-lg font-bold underline decoration-transparent decoration-2 underline-offset-4 transition-colors hover:decoration-ink focus-visible:decoration-ink"
        >
          <svg aria-hidden viewBox="0 0 10 12" className="h-3 w-2.5 fill-current">
            <path d="M0 6 10 0v12z" />
          </svg>
          Back to Color/Math
        </a>
      </div>
    );
  }

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
