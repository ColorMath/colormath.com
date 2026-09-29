import { MailingListForm } from "./MailingListForm";

/** Violet signup band: pitch on the left, email-only form on the right. */
export function NotesSignupBand({
  source,
  heading = "Studio notes",
  children,
}: {
  source: "home" | "notes";
  heading?: string;
  children: React.ReactNode;
}) {
  return (
    <section aria-labelledby={`${source}-signup-heading`} className="on-dark bg-violet text-paper">
      <div className="mx-auto grid w-full max-w-6xl items-end gap-x-16 gap-y-8 px-6 py-14 md:grid-cols-2 md:py-20">
        <div>
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
