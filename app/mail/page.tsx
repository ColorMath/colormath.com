import type { Metadata } from "next";
import { Wordmark } from "../components/Wordmark";
import { SiteNav } from "../components/SiteNav";
import { MailingListForm } from "../components/MailingListForm";

export const metadata: Metadata = {
  title: "Get our mail · Color/Math",
  description:
    "Email from Color/Math when we have something worth sharing, plus real, printed mail once a quarter if you want it.",
};

export default function MailPage() {
  return (
    <div className="on-dark min-h-screen bg-violet text-paper">
      <header className="relative z-30 mx-auto flex w-full max-w-6xl items-center justify-between px-6 pt-7">
        <a href="/" aria-label="Color/Math home">
          <Wordmark className="h-10 w-auto" />
        </a>
        <SiteNav />
      </header>
      <main id="main" tabIndex={-1} className="mx-auto w-full max-w-6xl px-6 pt-14 pb-24 outline-none md:pt-20">
        <h1 className="max-w-[20ch] font-display text-4xl font-bold md:text-6xl">Get our mail</h1>
        <p className="mt-6 max-w-[45ch] text-lg leading-relaxed md:text-xl">
          We write when we have something worth sharing: what we&apos;re
          building, what we&apos;re learning, and the occasional thing we think
          you&apos;ll like.
        </p>
        <p className="mt-4 mb-12 max-w-[45ch] text-lg leading-relaxed md:text-xl">
          Once a quarter we also send real-world mail. Printed, stamped, and in
          your actual mailbox. Leave your address if you&apos;d like it.
        </p>
        <MailingListForm source="mail" />
      </main>
    </div>
  );
}
