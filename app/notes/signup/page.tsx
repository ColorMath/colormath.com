import type { Metadata } from "next";
import { Wordmark } from "../../components/Wordmark";
import { SiteNav } from "../../components/SiteNav";
import { MailingListForm } from "../../components/MailingListForm";

export const metadata: Metadata = {
  title: "Sign up for Studio notes · Color/Math",
  description:
    "Notes from the Color/Math studio by email, and once a quarter, something printed in your mailbox.",
};

export default function NotesSignupPage() {
  return (
    <div className="on-dark min-h-screen bg-violet text-paper">
      <header className="relative z-30 mx-auto flex w-full max-w-6xl items-center justify-between px-6 pt-7">
        <a href="/" aria-label="Color/Math home">
          <Wordmark className="h-10 w-auto" />
        </a>
        <SiteNav />
      </header>
      <main id="main" tabIndex={-1} className="mx-auto w-full max-w-6xl px-6 pt-14 pb-24 outline-none md:pt-20">
        <p className="mb-3 inline-block bg-yellow px-2 py-0.5 font-display text-sm font-bold text-ink">Sign up for our mailing list</p>
        <h1 className="max-w-[20ch] font-display text-4xl font-bold md:text-6xl">Studio notes</h1>
        <p className="mt-6 max-w-[45ch] text-lg leading-relaxed md:text-xl">
          Interesting things for your inbox (and sometimes your mailbox).
        </p>
        <p className="mt-4 max-w-[45ch] text-lg leading-relaxed md:text-xl">
          <strong>By email:</strong>{" "}what we&apos;re building,
          what&apos;s on our minds, and what&apos;s inspiring us. We send it
          when there&apos;s something to say, not on a schedule.
        </p>
        <p className="mt-4 mb-12 max-w-[45ch] text-lg leading-relaxed md:text-xl">
          <strong>By mail:</strong>{" "}once a quarter, something you can hold
          (yes, with a stamp). Leave your address if you&apos;d like one.
        </p>
        <MailingListForm source="signup" />
      </main>
    </div>
  );
}
