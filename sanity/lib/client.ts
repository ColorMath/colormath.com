import { createClient } from "next-sanity";
import { apiVersion, dataset, isSanityConfigured, projectId } from "../env";

/**
 * Local draft preview: set SANITY_PREVIEW_TOKEN in .env.local (never in CI) and
 * localhost renders drafts as if published. The deploy has no token, so the
 * live site only ever shows published content. Server-only: not NEXT_PUBLIC.
 */
const previewToken = process.env.SANITY_PREVIEW_TOKEN;

export const isDraftPreview = Boolean(previewToken);

export const client = isSanityConfigured
  ? createClient({
      projectId,
      dataset,
      apiVersion,
      // Content is fetched only at build time; skip the CDN so builds
      // always see the latest published content.
      useCdn: false,
      ...(previewToken ? { token: previewToken, perspective: "drafts" as const } : {}),
    })
  : null;
