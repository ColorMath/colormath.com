import type { Metadata } from "next";
import Image from "next/image";
import { getLandingContent } from "@/sanity/lib/fetch";
import type { Founder, Service } from "@/sanity/lib/content";

export async function generateMetadata(): Promise<Metadata> {
  const content = await getLandingContent();
  return {
    title: content.seoTitle,
    description: content.seoDescription,
    openGraph: {
      title: content.seoTitle,
      description: content.seoDescription,
      url: "https://colormath.com",
      images: ["/img/logo.png"],
    },
  };
}

const glyphs = [
  // Half circle, periwinkle
  <svg key="0" viewBox="0 0 40 40" className="h-9 w-9" aria-hidden>
    <path
      d="M2 26 A18 18 0 0 1 38 26 Z"
      fill="var(--color-periwinkle)"
      stroke="var(--color-ink)"
      strokeWidth="2.5"
    />
  </svg>,
  // Triangle, butter
  <svg key="1" viewBox="0 0 40 40" className="h-9 w-9" aria-hidden>
    <path
      d="M20 6 L37 34 L3 34 Z"
      fill="var(--color-butter)"
      stroke="var(--color-ink)"
      strokeWidth="2.5"
    />
  </svg>,
  // Quarter wedge, peony
  <svg key="2" viewBox="0 0 40 40" className="h-9 w-9" aria-hidden>
    <path
      d="M6 34 A28 28 0 0 1 34 6 L34 34 Z"
      fill="var(--color-peony)"
      stroke="var(--color-ink)"
      strokeWidth="2.5"
    />
  </svg>,
];

const founderCircle = ["bg-periwinkle", "bg-mauve", "bg-peony", "bg-butter"];

function EmailButton({ email, label }: { email: string; label: string }) {
  return (
    <a
      href={`mailto:${email}`}
      className="inline-block border-2 border-ink bg-marigold px-7 py-3.5 font-display text-lg font-bold shadow-[4px_4px_0_0_var(--color-ink)] transition-[box-shadow,translate] duration-150 ease-out hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0_0_var(--color-ink)] active:translate-x-[4px] active:translate-y-[4px] active:shadow-none"
    >
      {label}
    </a>
  );
}

function initials(name: string) {
  const parts = name.split(" ").filter(Boolean);
  if (parts.length === 0) return "";
  const first = parts[0][0];
  const last = parts.length > 1 ? parts[parts.length - 1][0] : "";
  return `${first}${last}`;
}

export default async function Home() {
  const content = await getLandingContent();

  return (
    <>
      <header className="mx-auto flex w-full max-w-6xl flex-wrap items-center justify-between gap-x-8 gap-y-3 px-6 pt-7">
        <a href="#top" aria-label="ColorMath home">
          <Image
            src="/img/wordmark-mark.png"
            alt="color/math"
            width={908}
            height={332}
            priority
            className="h-9 w-auto"
          />
        </a>
        {content.contactEmail && (
          <a
            href={`mailto:${content.contactEmail}`}
            className="font-medium underline decoration-2 underline-offset-4 hover:decoration-marigold"
          >
            {content.contactEmail}
          </a>
        )}
      </header>

      <main id="top">
        {/* Hero */}
        <section className="mx-auto grid w-full max-w-6xl items-center gap-12 px-6 pb-24 pt-16 md:grid-cols-[7fr_4fr] md:pb-32 md:pt-24">
          <div>
            <p className="rise font-medium text-lg">{content.heroEyebrow}</p>
            <h1 className="rise rise-2 mt-4 font-display text-[clamp(2.9rem,8vw,5.75rem)] font-extrabold leading-[0.98] tracking-tight">
              {content.heroHeading}
            </h1>
            <p className="rise rise-3 mt-6 max-w-[52ch] text-lg leading-relaxed md:text-xl">
              {content.heroSubheading}
            </p>
            {content.contactEmail && (
              <div className="rise rise-4 mt-10">
                <EmailButton email={content.contactEmail} label="Email us" />
              </div>
            )}
          </div>
          <div className="rise rise-3 hidden justify-center md:flex">
            <Image
              src="/img/logo-mark.png"
              alt=""
              aria-hidden
              width={256}
              height={344}
              priority
              className="w-[min(19rem,100%)]"
            />
          </div>
        </section>

        {/* Services */}
        <section
          aria-labelledby="services-heading"
          className="mx-auto w-full max-w-6xl px-6 pb-24 md:pb-32"
        >
          <h2
            id="services-heading"
            className="font-display text-4xl font-bold tracking-tight md:text-5xl"
          >
            {content.servicesHeading}
          </h2>
          <ul className="mt-10 border-b-2 border-ink">
            {content.services.map((service: Service, i: number) => (
              <li
                key={service.title}
                className="grid gap-x-8 gap-y-3 border-t-2 border-ink py-8 md:grid-cols-[3rem_1fr_2fr] md:py-10"
              >
                {glyphs[i % glyphs.length]}
                <h3 className="font-display text-2xl font-semibold md:text-3xl">
                  {service.title}
                </h3>
                <p className="max-w-[60ch] text-lg leading-relaxed">
                  {service.description}
                </p>
              </li>
            ))}
          </ul>
        </section>

        {/* Founders */}
        <section
          aria-labelledby="founders-heading"
          className="mx-auto w-full max-w-6xl px-6 pb-24 md:pb-36"
        >
          <h2
            id="founders-heading"
            className="font-display text-4xl font-bold tracking-tight md:text-5xl"
          >
            {content.foundersHeading}
          </h2>
          <p className="mt-4 max-w-[52ch] text-lg leading-relaxed">
            {content.foundersIntro}
          </p>
          <div className="mt-14 grid gap-14 md:grid-cols-2 md:gap-10">
            {content.founders.map((founder: Founder, i: number) => (
              <article key={founder.name}>
                {founder.photoUrl ? (
                  /* eslint-disable-next-line @next/next/no-img-element */
                  <img
                    src={founder.photoUrl}
                    alt={founder.name}
                    className="h-32 w-32 rounded-full border-2 border-ink object-cover"
                  />
                ) : (
                  <div
                    aria-hidden
                    className={`flex h-32 w-32 items-center justify-center rounded-full border-2 border-ink font-display text-4xl font-bold ${founderCircle[i % founderCircle.length]}`}
                  >
                    {initials(founder.name)}
                  </div>
                )}
                <h3 className="mt-6 font-display text-3xl font-bold">
                  {founder.name}
                </h3>
                <p className="mt-1 text-lg font-medium italic">{founder.role}</p>
                <p className="mt-4 max-w-[48ch] text-lg leading-relaxed">
                  {founder.bio}
                </p>
                {founder.url && (
                  <a
                    href={founder.url}
                    className="mt-4 inline-block font-medium underline decoration-2 underline-offset-4 hover:decoration-marigold"
                  >
                    {founder.url.replace(/^https?:\/\//, "").replace(/\/$/, "")}
                  </a>
                )}
              </article>
            ))}
          </div>
        </section>

        {/* Pattern band */}
        <div
          aria-hidden
          className="h-24 border-y-2 border-ink bg-[url('/img/pattern.png')] bg-cover bg-center md:h-32"
        />

        {/* Contact */}
        <section
          aria-labelledby="contact-heading"
          className="border-b-2 border-ink bg-butter"
        >
          <div className="mx-auto w-full max-w-6xl px-6 py-20 md:py-28">
            <h2
              id="contact-heading"
              className="max-w-[18ch] font-display text-4xl font-bold tracking-tight md:text-6xl"
            >
              {content.contactHeading}
            </h2>
            <p className="mt-5 max-w-[45ch] text-lg leading-relaxed md:text-xl">
              {content.contactBody}
            </p>
            {content.contactEmail && (
              <div className="mt-10">
                <EmailButton
                  email={content.contactEmail}
                  label={`Email ${content.contactEmail}`}
                />
              </div>
            )}
          </div>
        </section>
      </main>

      <footer className="mx-auto flex w-full max-w-6xl flex-wrap items-center justify-between gap-4 px-6 py-10 text-sm">
        <p>© {new Date().getFullYear()} ColorMath</p>
        <nav className="flex gap-6" aria-label="Founders' sites">
          {content.founders
            .filter((f: Founder) => f.url)
            .map((f: Founder) => (
              <a
                key={f.url}
                href={f.url}
                className="underline decoration-2 underline-offset-4 hover:decoration-marigold"
              >
                {f.name}
              </a>
            ))}
        </nav>
      </footer>
    </>
  );
}
