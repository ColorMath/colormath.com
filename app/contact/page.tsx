import type { Metadata } from "next";
import { Wordmark } from "../components/Wordmark";
import { ContactForm } from "./ContactForm";

export const metadata: Metadata = {
  title: "Contact · Color/Math",
  description: "Tell us what you're building. The message goes straight to both founders.",
};

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-yellow text-ink">
      <header className="mx-auto w-full max-w-6xl px-6 pt-7">
        <a href="/" aria-label="Color/Math home">
          <Wordmark className="h-10 w-auto" />
        </a>
      </header>
      <main id="main" tabIndex={-1} className="mx-auto w-full max-w-6xl px-6 pt-14 pb-24 outline-none md:pt-20">
        <h1 className="max-w-[20ch] font-display text-4xl font-bold md:text-6xl">
          Talk to us
        </h1>
        <p className="mt-6 mb-12 max-w-[45ch] text-lg leading-relaxed md:text-xl">
          Tell us what you&apos;re building. Your message goes straight to
          both of us, and we reply personally.
        </p>
        <ContactForm />
      </main>
    </div>
  );
}
