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
  /**
   * Transparent looping portrait (person + chair, no background); code-owned,
   * not in Sanity. Shown instead of the photo when present.
   */
  video?: {
    webm: string;
    /** HEVC-alpha copy for WebKit (Safari, all iOS browsers). */
    mov?: string;
    /** Transparent WebP of one frame: what WebKit browsers show instead. */
    still: string;
    /** Seconds into the clip where `still` was taken; playback starts there. */
    start: number;
    aspect: string;
  };
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
  heroEyebrow: "It's faster than ever to build something.",
  heroHeading: "It's harder than ever to build something great.",
  heroSubheading:
    "Color/Math is a multi-disciplinary design studio that helps teams design and build great products that achieve business outcomes in the age of AI.",
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
  foundersHeading: "Building great products (and teams) is an art and a science.",
  foundersIntro:
    "We're operators who built software businesses that scaled to millions of users and went through successful exits. We're not “consultants in a corner”, we're builders who are focused on helping your team move fast, in the right direction.",
  founders: [
    {
      name: "Jessica Tenuta",
      role: "Design",
      photoUrl: "/img/jessica.png",
      video: {
        webm: "/video/chair-clip-jess.webm",
        mov: "/video/chair-clip-jess.mov",
        still: "/video/chair-clip-jess-still.webp",
        start: 42.04, // loop frame 1260: both feet in
        aspect: "822 / 1468",
      },
      bio: "Cofounder and Chief Product Officer of Packback, leading product, design, and engineering teams as the platform scaled to 3M+ students through its 2024 acquisition. Forbes 30 Under 30, and once got Mark Cuban to invest on Shark Tank.",
      url: "https://jessicatenuta.com",
    },
    {
      name: "Craig M. Booth",
      role: "Engineering",
      photoUrl: "/img/craig.png",
      video: {
        webm: "/video/chair-clip-craig.webm",
        mov: "/video/chair-clip-craig.mov",
        still: "/video/chair-clip-craig-still.webp",
        start: 0, // 20s loop chosen to start and end settled: to camera, ankles crossed
        aspect: "822 / 1468",
      },
      bio: "Chief Technology Officer of Packback and a former computational astrophysicist who simulated galaxy formation on supercomputers before turning that rigor toward building products people learn with.",
      url: "https://craigmbooth.com",
    },
  ],
  contactHeading: "Let's make something that adds up.",
  contactBody:
    "The best projects start as conversations. Tell us what you're building.",
  // Empty hides every email CTA (header link, hero and contact buttons)
  contactEmail: "",
  seoTitle: "Color/Math",
  seoDescription: "Multi-disciplinary design studio.",
};
