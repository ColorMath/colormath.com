import { groq } from "next-sanity";
import type { PortableTextBlock } from "@portabletext/react";
import { client } from "./client";

export type Credit = { role: string; name: string; url?: string };
export type Photo = { src: string; alt: string };
export type CaseStudy = {
  title: string;
  slug: string;
  dek?: string;
  videoUrl?: string;
  posterUrl?: string;
  videoCaption?: string;
  body: PortableTextBlock[];
  gallery: Photo[];
  credits: Credit[];
};

const span = (text: string, marks: string[] = []) => ({ _type: "span", _key: Math.random().toString(36).slice(2, 10), text, marks });
const block = (children: ReturnType<typeof span>[], markDefs: object[] = []) => ({
  _type: "block",
  _key: Math.random().toString(36).slice(2, 10),
  style: "normal",
  markDefs,
  children,
});

/** Same copy as the Sanity document, so the page builds without Sanity. */
export const fallbackCaseStudies: CaseStudy[] = [
  {
    title: "Building the Color/Math Brand",
    slug: "building-blocks",
    dek: "A behind-the-scenes look at the *hand*-made Color/Math brand (emphasis on *hand*).",
    videoUrl: "/case-studies/building-blocks/under-the-table.mp4",
    posterUrl: "/case-studies/building-blocks/under-the-table.jpg",
    videoCaption: "Behind the scenes, under the table.",
    body: [
      block([
        span(
          "As a team, we believe strongly in the importance of human art and making the essential, differentiated elements of a brand by hand. We could have generated the film at the top of our homepage, but we chose to make it by hand, and to hire and support real human artists to make it with us."
        ),
      ]),
      block([
        span(
          "Craig built the set pieces out of wood, by hand. Jessica planned the shots. We hired photographer "
        ),
        span("Monica Thornton", ["monica"]),
        span(" to shoot the stills and video you see across this site."),
      ], [{ _type: "link", _key: "monica", href: "https://www.linkedin.com/in/monicabrie/" }]),
    ] as PortableTextBlock[],
    gallery: [
      { src: "/case-studies/building-blocks/01-studio.webp", alt: "The studio before the shoot: softbox lights and a camera on a tripod, with the violet tabletop on sawhorses in front of the red backdrop." },
      { src: "/case-studies/building-blocks/02-tabletop.webp", alt: "Close on the violet tabletop and its two hand holes, set with a pineapple and bananas for a test shot, with someone crouched underneath." },
      { src: "/case-studies/building-blocks/03-under-the-table.webp", alt: "The full set: the red backdrop and violet table, with someone sitting underneath ready to reach up through the holes." },
      { src: "/case-studies/building-blocks/04-camera-view.webp", alt: "The set seen from behind the camera and tripod." },
      { src: "/case-studies/building-blocks/06-softbox.webp", alt: "Monica's studio: a large softbox beside the red backdrop, with a yellow balloon waiting on a folding chair." },
      { src: "/case-studies/building-blocks/07-yellow-set-wide.webp", alt: "A second set on a yellow board, red and violet paint-splat shapes and brushes, framed between light stands." },
      { src: "/case-studies/building-blocks/08-yellow-set.webp", alt: "Closer on the yellow set: two paint splats and a pair of brushes laid out for the shot." },
      { src: "/case-studies/building-blocks/11-splat-hands.webp", alt: "Two hands reach up through holes in a yellow tabletop, one lifting a paintbrush dripping violet clay paint over red and violet splats." },
      { src: "/case-studies/building-blocks/12-splat-drip.webp", alt: "A hand holds a brush up high as a thick violet drip hangs from the bristles, the other hand reaching toward it." },
      { src: "/case-studies/building-blocks/13-splat-flatlay.webp", alt: "Overhead: red and violet clay paint splats and two brushes arranged on a yellow board against red." },
      { src: "/case-studies/building-blocks/14-splat-flatlay-2.webp", alt: "A second overhead arrangement of the clay paint splats and brushes on yellow." },
      { src: "/case-studies/building-blocks/09-studio-corner.webp", alt: "A pineapple, bananas and tomatoes posed alone on the red backdrop, seen past a light stand." },
      { src: "/case-studies/building-blocks/10-props.webp", alt: "The props table: paint jars, yarn, balls and a yellow balloon, with the red set behind." },
      { src: "/case-studies/building-blocks/05-film-frame.webp", alt: "A film-frame snapshot of the studio: a folding chair holding a yellow balloon beside a large softbox." },
    ],
    credits: [
      { role: "Photography and video", name: "Monica Thornton", url: "https://www.linkedin.com/in/monicabrie/" },
      { role: "Set pieces", name: "Craig M. Booth", url: "https://craigmbooth.com" },
      { role: "Creative direction", name: "Jessica Tenuta", url: "https://jessicatenuta.com" },
    ],
  },
];

const query = groq`*[_type == "caseStudy" && defined(slug.current)]{
  title, "slug": slug.current, dek, videoUrl, posterUrl, videoCaption, body,
  gallery[]{ src, alt }, credits[]{ role, name, url }
}`;

/** Sanity's case studies, or the fallback copy when Sanity is unavailable. */
export async function getCaseStudies(): Promise<CaseStudy[]> {
  if (!client) return fallbackCaseStudies;
  try {
    const docs: CaseStudy[] = await client.fetch(query);
    return docs.length ? docs.map((d) => ({ ...d, body: d.body ?? [], gallery: d.gallery ?? [], credits: d.credits ?? [] })) : fallbackCaseStudies;
  } catch (error) {
    console.warn("Sanity case study fetch failed; using fallback.", error);
    return fallbackCaseStudies;
  }
}
