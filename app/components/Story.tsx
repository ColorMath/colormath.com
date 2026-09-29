import type { PortableTextComponents } from "@portabletext/react";

type VideoClipValue = { youtubeId?: string; start?: number; end?: number; title?: string; caption?: string };
type PullQuoteValue = { text?: string; source?: string; sourceUrl?: string };
type ImageGroupValue = { images?: { src?: string; alt?: string }[]; caption?: string };

/** Ink or paper, whichever has more contrast on `hex` (WCAG relative luminance). */
function inkOn(hex: string) {
  const [r, g, b] = [1, 3, 5].map((i) => {
    const v = parseInt(hex.slice(i, i + 2), 16) / 255;
    return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4;
  });
  const l = 0.2126 * r + 0.7152 * g + 0.0722 * b;
  // Ink #211F1E ≈ 0.0138, paper #FDFCFA ≈ 0.97.
  return (l + 0.05) / (0.0138 + 0.05) >= (0.97 + 0.05) / (l + 0.05) ? "var(--color-ink)" : "var(--color-paper)";
}

/** Story renderer; pull quotes are highlighted in `accent`, the client's brand color. */
export const storyComponents = (accent: string): PortableTextComponents => ({
  types: {
    // A direct quote pulled out of the story: set large on a solid highlight
    // in the client's color, with its source.
    // One segment of a YouTube video (privacy-enhanced embed), full story width.
    videoClip: ({ value }: { value: VideoClipValue }) => {
      if (!value.youtubeId) return null;
      const q = new URLSearchParams({ start: String(Math.floor(value.start ?? 0)), rel: "0", modestbranding: "1" });
      if (value.end) q.set("end", String(Math.ceil(value.end)));
      return (
        <figure className="my-10">
          <div className="aspect-video w-full bg-ink">
            <iframe
              src={`https://www.youtube-nocookie.com/embed/${value.youtubeId}?${q}`}
              title={value.title ?? "Video"}
              loading="lazy"
              allow="accelerometer; encrypted-media; gyroscope; picture-in-picture; fullscreen"
              allowFullScreen
              className="h-full w-full"
            />
          </div>
          {value.caption && <figcaption className="mt-3 text-sm opacity-80">{value.caption}</figcaption>}
        </figure>
      );
    },
    pullQuote: ({ value }: { value: PullQuoteValue }) =>
      value.text ? (
        <figure className="pull-quote my-14" style={{ "--quote": accent, "--quote-ink": inkOn(accent) } as React.CSSProperties}>
          <blockquote className="font-display text-[1.75rem] leading-[1.6] md:text-[2.25rem]">
            <p>
              <span className="pull-quote-text">&ldquo;{value.text.replace(/^["“]|["”]$/g, "")}&rdquo;</span>
            </p>
          </blockquote>
          {value.source && (
            <figcaption className="mt-4 text-base">
              <span aria-hidden="true">&mdash; </span>
              {value.sourceUrl ? (
                <a href={value.sourceUrl} className="underline decoration-2 underline-offset-4 hover:decoration-violet">
                  {value.source}
                </a>
              ) : (
                value.source
              )}
            </figcaption>
          )}
        </figure>
      ) : null,
    // Inline images in the story: 1–3 side by side, uncropped, optional caption.
    imageGroup: ({ value }: { value: ImageGroupValue }) => {
      const images = (value.images ?? []).filter((i) => i.src);
      if (!images.length) return null;
      return (
        <figure className="my-10">
          <div className={`grid gap-4 ${images.length === 2 ? "sm:grid-cols-2" : images.length === 3 ? "grid-cols-3" : ""}`}>
            {images.map((img) => (
              /* eslint-disable-next-line @next/next/no-img-element */
              <img key={img.src} src={img.src} alt={img.alt ?? ""} loading="lazy" className="block h-auto w-full" />
            ))}
          </div>
          {value.caption && <figcaption className="mt-3 text-sm opacity-80">{value.caption}</figcaption>}
        </figure>
      );
    },
  },
  block: {
    normal: ({ children }) => <p className="mt-5 text-lg leading-relaxed first:mt-0">{children}</p>,
    h2: ({ children }) => <h2 className="mt-10 font-display text-2xl font-bold">{children}</h2>,
  },
  marks: {
    link: ({ children, value }) => (
      <a href={value?.href} className="font-medium underline decoration-2 underline-offset-4 hover:decoration-violet">
        {children}
      </a>
    ),
  },
});
