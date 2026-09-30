import { MailingListForm } from "./MailingListForm";

/** Violet signup band: pitch on the left, email-only form on the right. */
export function NotesSignupBand({
  source,
  heading = "Studio notes",
  chip = true,
  children,
}: {
  source: "home" | "notes";
  heading?: string;
  /** "Sign up for our mailing list" label above the heading. */
  chip?: boolean;
  children: React.ReactNode;
}) {
  return (
    <section id="signup" aria-labelledby={`${source}-signup-heading`} className="on-dark scroll-mt-6 bg-violet text-paper">
      <div className="mx-auto grid w-full max-w-6xl items-end gap-x-16 gap-y-8 px-6 py-14 md:grid-cols-2 md:py-20">
        <div>
          {chip && <p className="mb-3 inline-block bg-yellow px-2 py-0.5 font-display text-sm font-bold text-ink">Sign up for our mailing list</p>}
          <h2 id={`${source}-signup-heading`} className="font-display text-3xl font-bold md:text-5xl">
            {heading}
          </h2>
          <p className="mt-4 max-w-[40ch] text-lg leading-relaxed">{children}</p>
        </div>
        <MailingListForm source={source} />
      </div>
    </section>
  );
}
