import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Studio notes · Color/Math",
  robots: { index: false },
  alternates: { canonical: "/notes/signup/" },
};

/** The signup page moved to /notes/signup; keep the old link working. */
export default function MailRedirect() {
  return (
    <>
      <meta httpEquiv="refresh" content="0; url=/notes/signup/" />
      <p className="p-6">
        This page moved to <a href="/notes/signup/" className="underline">/notes/signup</a>.
      </p>
    </>
  );
}
