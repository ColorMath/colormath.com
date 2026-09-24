import { groq } from "next-sanity";
import { client } from "./client";
import { fallbackContent, type LandingContent } from "./content";

const landingPageQuery = groq`*[_type == "landingPage"][0]{
  heroEyebrow,
  heroHeading,
  heroSubheading,
  servicesHeading,
  services[]{ title, description },
  foundersHeading,
  foundersIntro,
  founders[]{ name, role, bio, url, "photoUrl": photo.asset->url },
  contactHeading,
  contactBody,
  contactEmail,
  seoTitle,
  seoDescription
}`;

/** Drop null/undefined so Sanity gaps fall through to fallback copy. */
function compact<T extends object>(value: T): Partial<T> {
  return Object.fromEntries(
    Object.entries(value).filter(([, v]) => v !== null && v !== undefined)
  ) as Partial<T>;
}

export async function getLandingContent(): Promise<LandingContent> {
  if (!client) return fallbackContent;
  try {
    const data = await client.fetch(landingPageQuery);
    if (!data) return fallbackContent;
    const cleaned = compact(data);
    // The Studio still holds pre-rebrand copy for these fields; pin the
    // artboard copy from fallbackContent until the CMS is updated, then
    // delete this list so the Studio owns them again.
    for (const key of [
      "heroEyebrow",
      "heroHeading",
      "heroSubheading",
      "foundersHeading",
      "foundersIntro",
    ] as const) {
      delete cleaned[key];
    }
    const merged = { ...fallbackContent, ...cleaned };
    // Founders merge per-field too, so a CMS entry without a photo (or any
    // other field) falls back to the defaults instead of dropping it.
    merged.founders = merged.founders.map((founder, i) => ({
      ...(fallbackContent.founders[i] ?? {}),
      ...compact(founder),
      // Pinned like the copy fields above: the artboard chip labels
      // ("Design" / "Engineering") replace pre-rebrand CMS roles, and the
      // names match the site copy until the Studio entries are updated.
      ...(fallbackContent.founders[i]?.role
        ? { role: fallbackContent.founders[i].role }
        : {}),
      ...(fallbackContent.founders[i]?.name
        ? { name: fallbackContent.founders[i].name }
        : {}),
    })) as LandingContent["founders"];
    return merged;
  } catch (error) {
    console.warn(
      "Sanity fetch failed at build time; using fallback content.",
      error
    );
    return fallbackContent;
  }
}
