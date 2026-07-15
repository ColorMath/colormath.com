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
    return { ...fallbackContent, ...compact(data) };
  } catch (error) {
    console.warn(
      "Sanity fetch failed at build time; using fallback content.",
      error
    );
    return fallbackContent;
  }
}
