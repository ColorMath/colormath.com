"use client";

const FOUNDERS = "jessica@jessicatenuta.com,hello@craigmbooth.com";

/** Opens the visitor's email app with their message addressed to both founders. */
function mailtoFallback(data: Record<string, string>) {
  const subject = `Website inquiry from ${data.name}`;
  const body = [data.message, "", data.name, data.company].filter(Boolean).join("\n");
  window.location.href = `mailto:${FOUNDERS}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}

const field =
  "mt-2 w-full border-2 border-ink bg-paper px-4 py-3 text-lg text-ink outline-none focus-visible:ring-4 focus-visible:ring-violet";
const label = "font-display text-lg font-bold";

export function ContactForm() {
  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    // Opens the visitor's email app; to be replaced by the Tally embed.
    mailtoFallback(Object.fromEntries(new FormData(e.currentTarget)) as Record<string, string>);
  }

  return (
    <form onSubmit={onSubmit} className="grid max-w-2xl gap-6">
      <div className="grid gap-6 md:grid-cols-2">
        <label className={label}>
          Name
          <input name="name" required autoComplete="name" className={field} />
        </label>
        <label className={label}>
          Email
          <input name="email" type="email" required autoComplete="email" className={field} />
        </label>
      </div>
      <label className={label}>
        Company <span className="font-body text-base font-normal">(optional)</span>
        <input name="company" autoComplete="organization" className={field} />
      </label>
      <label className={label}>
        What are you building?
        <textarea name="message" required rows={6} className={field} />
      </label>
      {/* Honeypot: hidden from people and assistive tech; bots fill it. */}
      <input
        name="website"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden
        className="absolute -left-[9999px] h-px w-px opacity-0"
      />
      <div>
        <button
          type="submit"
          className="bg-ink px-7 py-3.5 font-display text-lg font-bold text-paper transition-colors hover:bg-coal disabled:opacity-60"
        >
          Send
        </button>
      </div>
    </form>
  );
}
