export type Service = {
  title: string;
  description: string;
};

export type Founder = {
  name: string;
  role: string;
  bio: string;
  url?: string;
  photoUrl?: string;
};

export type LandingContent = {
  heroEyebrow: string;
  heroHeading: string;
  heroSubheading: string;
  servicesHeading: string;
  services: Service[];
  foundersHeading: string;
  foundersIntro: string;
  founders: Founder[];
  contactHeading: string;
  contactBody: string;
  contactEmail: string;
  seoTitle: string;
  seoDescription: string;
};

/**
 * Used until the Sanity project is connected (or if a fetch fails at build
 * time), and as the per-field default for anything left empty in the Studio.
 */
export const fallbackContent: LandingContent = {
  heroEyebrow: "A product design & engineering collaboration studio",
  heroHeading: "Products that add up.",
  heroSubheading:
    "ColorMath is a collaboration studio between two senior executives: a designer and an engineer who built, scaled, and sold a product together. Now they build with you.",
  servicesHeading: "What we do",
  services: [
    {
      title: "Product strategy",
      description:
        "Positioning, roadmaps, and the hard calls about what to build next.",
    },
    {
      title: "Design",
      description:
        "Brand, UX, and interface design, from the first sketch to the design system.",
    },
    {
      title: "Engineering",
      description:
        "Architecture, AI, and production code that actually ships.",
    },
  ],
  foundersHeading: "Two people. One practice.",
  foundersIntro:
    "Design and engineering aren't service lines here. They're the two of us, in the same room, on your problem.",
  founders: [
    {
      name: "Jessica Tenuta",
      role: "Design · the color",
      bio: "Cofounder and Chief Product Officer of Packback, where she led product, design, and engineering teams and scaled the platform to 3M+ students through its 2024 acquisition. Forbes 30 Under 30, and once got Mark Cuban to invest on Shark Tank.",
      url: "https://jessicatenuta.com",
    },
    {
      name: "Craig M Booth",
      role: "Engineering · the math",
      bio: "Chief Technology Officer of Packback and a former computational astrophysicist who simulated galaxy formation on supercomputers before turning that rigor toward building products people learn with.",
      url: "https://craigmbooth.com",
    },
  ],
  contactHeading: "Let's make something that adds up.",
  contactBody:
    "The best projects start as conversations. Tell us what you're building.",
  // Empty hides every email CTA (header link, hero and contact buttons)
  contactEmail: "",
  seoTitle: "ColorMath — A product design & engineering collaboration studio",
  seoDescription:
    "ColorMath is a collaboration studio between two senior executives: designer Jessica Tenuta and engineer Craig M Booth. Color is design. Math is engineering.",
};
