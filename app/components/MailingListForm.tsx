"use client";

import { useEffect, useId, useRef, useState } from "react";
import { sendGAEvent } from "@next/third-parties/google";

/**
 * Loops signup form (Settings → Forms in Loops). The form endpoint is public by
 * design: it takes no API key, so nothing secret lives in the browser.
 */
const LOOPS_FORM_ID = "cmun9qjyb05rl0j024o8nv5ji";
/** Mailing list to join (Audience → Lists); double opt-in is set on the list. */
const LOOPS_LIST_ID = "cmuna4xxe3tcc0j0z2lohhc0t";

/**
 * Postal address fields → Loops custom contact properties. Each API name must
 * exist in Loops (Audience → Properties, type "string") or Loops drops it.
 */
const ADDRESS = [
  { name: "addressLine1", label: "Street address", autoComplete: "address-line1", span: true },
  { name: "addressLine2", label: "Apartment, suite, etc.", autoComplete: "address-line2", span: true },
  { name: "addressCity", label: "City", autoComplete: "address-level2" },
  { name: "addressRegion", label: "State / region", autoComplete: "address-level1" },
  { name: "addressPostalCode", label: "Postal code", autoComplete: "postal-code" },
  { name: "addressCountry", label: "Country", autoComplete: "country-name" },
] as const;

type Status = "idle" | "sending" | "sent" | "error";

const field =
  "mt-1.5 block w-full border-2 border-ink bg-paper px-3 py-2.5 text-lg text-ink placeholder:text-ink/40";
const label = "block font-display text-base font-bold";

/**
 * Email signup with an optional postal address for the quarterly printed
 * mail. Loops only writes custom properties when it creates a contact, so an
 * existing subscriber resubmitting won't change a saved address.
 */
export function MailingListForm({ source }: { source: "home" | "notes" | "signup" }) {
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState("");
  const [withAddress, setWithAddress] = useState(false);
  const thanksRef = useRef<HTMLDivElement>(null);
  const id = useId();

  useEffect(() => {
    if (status === "sent") thanksRef.current?.focus();
  }, [status]);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    // Honeypot: people never see this field; bots fill it. Pretend it worked.
    if (data.get("website")) {
      setStatus("sent");
      return;
    }
    const body = new URLSearchParams();
    body.set("email", String(data.get("email") ?? "").trim());
    body.set("source", `colormath.com/${source}`);
    if (LOOPS_LIST_ID) body.set("mailingLists", LOOPS_LIST_ID);
    for (const key of ["firstName", "lastName", ...ADDRESS.map((a) => a.name)]) {
      const value = String(data.get(key) ?? "").trim();
      if (value) body.set(key, value);
    }

    setStatus("sending");
    setError("");
    try {
      const res = await fetch(`https://app.loops.so/api/newsletter-form/${LOOPS_FORM_ID}`, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body,
      });
      const json = await res.json().catch(() => ({}));
      if (res.status === 429) throw new Error("Too many tries at once. Give it a minute and try again.");
      if (!res.ok || !json.success) throw new Error(json.message || "Something went wrong.");
      setStatus("sent");
      sendGAEvent("event", "sign_up", { method: "mailing_list", source, address: withAddress });
    } catch (err) {
      setStatus("error");
      setError(err instanceof Error ? err.message : "Something went wrong.");
    }
  }

  const honeypot = (
    <div aria-hidden className="absolute -left-[9999px] h-px w-px overflow-hidden">
      <label>
        Website
        <input name="website" tabIndex={-1} autoComplete="off" />
      </label>
    </div>
  );

  if (status === "sent") {
    return (
      <div ref={thanksRef} tabIndex={-1} role="status" className="max-w-2xl outline-none">
        <p className="font-display text-3xl font-bold md:text-4xl">You&apos;re on the list.</p>
        <p className="mt-4 max-w-[42ch] text-lg leading-relaxed">
          Thanks! Look for us in your inbox{withAddress ? ", and in your mailbox next quarter" : ""}.
        </p>
      </div>
    );
  }

  // Compact (email only) everywhere but the signup page itself.
  if (source !== "signup") {
    return (
      <form onSubmit={onSubmit} className="w-full max-w-xl">
        <label htmlFor={`${id}-email`} className={label}>
          Email
        </label>
        <div className="mt-1.5 flex flex-col gap-3 sm:flex-row">
          <input
            id={`${id}-email`}
            name="email"
            type="email"
            required
            autoComplete="email"
            className={`${field} !mt-0 min-w-0 flex-1`}
          />
          <button
            type="submit"
            disabled={status === "sending"}
            className="shrink-0 bg-ink px-6 py-3 font-display text-lg font-bold text-paper transition-colors hover:bg-coal disabled:opacity-60"
          >
            {status === "sending" ? "Signing up…" : "Sign me up"}
          </button>
        </div>
        {honeypot}
        {status === "error" && (
          <p role="alert" className="mt-3 font-bold">
            {error}
          </p>
        )}
        <p className="mt-4 text-base leading-relaxed">
          Want the paper one too?{" "}
          <a href="/notes/signup/" className="font-bold underline decoration-2 underline-offset-4 hover:decoration-yellow">
            Add your address
          </a>
        </p>
      </form>
    );
  }

  return (
    <form onSubmit={onSubmit} className="max-w-2xl">
      <div className="grid gap-5 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <label htmlFor={`${id}-email`} className={label}>
            Email
          </label>
          <input
            id={`${id}-email`}
            name="email"
            type="email"
            required
            autoComplete="email"
            className={field}
          />
        </div>
        <div>
          <label htmlFor={`${id}-first`} className={label}>
            First name{!withAddress && <span className="font-normal"> (optional)</span>}
          </label>
          <input id={`${id}-first`} name="firstName" autoComplete="given-name" required={withAddress} className={field} />
        </div>
        <div>
          <label htmlFor={`${id}-last`} className={label}>
            Last name{!withAddress && <span className="font-normal"> (optional)</span>}
          </label>
          <input id={`${id}-last`} name="lastName" autoComplete="family-name" required={withAddress} className={field} />
        </div>
      </div>

      <div className="mt-6">
        <label className="inline-flex cursor-pointer items-start gap-3 text-lg">
          <input
            type="checkbox"
            checked={withAddress}
            onChange={(e) => setWithAddress(e.target.checked)}
            className="mt-1 size-5 shrink-0 accent-ink"
          />
          <span>
            <span className="font-bold">Send me the paper one too.</span>{" "}
            Once a quarter, to your door.
          </span>
        </label>
      </div>

      {withAddress && (
        <fieldset className="mt-5 grid gap-5 sm:grid-cols-2">
          <legend className="sr-only">Mailing address</legend>
          {ADDRESS.map((a) => (
            <div key={a.name} className={"span" in a ? "sm:col-span-2" : undefined}>
              <label htmlFor={`${id}-${a.name}`} className={label}>
                {a.label}
                {a.name === "addressLine2" && <span className="font-normal"> (optional)</span>}
              </label>
              <input
                id={`${id}-${a.name}`}
                name={a.name}
                autoComplete={a.autoComplete}
                required={a.name !== "addressLine2" && a.name !== "addressRegion"}
                className={field}
              />
            </div>
          ))}
        </fieldset>
      )}

      {/* Honeypot, hidden from people and assistive tech. */}
      {honeypot}

      <button
        type="submit"
        disabled={status === "sending"}
        className="mt-8 inline-block bg-ink px-7 py-3.5 font-display text-lg font-bold text-paper transition-colors hover:bg-coal disabled:opacity-60"
      >
        {status === "sending" ? "Signing you up…" : "Sign me up"}
      </button>

      {status === "error" && (
        <p role="alert" className="mt-4 text-lg font-bold">
          {error}
        </p>
      )}

      <p className="mt-6 max-w-[52ch] text-sm leading-relaxed">
        Your address is only for our quarterly mail. We don&apos;t share it,
        and you can unsubscribe from either one anytime.
      </p>
    </form>
  );
}
