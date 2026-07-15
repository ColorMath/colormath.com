import { createClient } from "next-sanity";
import { apiVersion, dataset, isSanityConfigured, projectId } from "../env";

export const client = isSanityConfigured
  ? createClient({
      projectId,
      dataset,
      apiVersion,
      // Content is fetched only at build time; skip the CDN so builds
      // always see the latest published content.
      useCdn: false,
    })
  : null;
