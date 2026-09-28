"use client";

import { usePathname } from "next/navigation";
import { GoogleAnalytics } from "@next/third-parties/google";

export function Analytics({ gaId }: { gaId: string }) {
  // Keep our own Sanity editing sessions out of the numbers.
  if (usePathname()?.startsWith("/studio")) return null;
  return <GoogleAnalytics gaId={gaId} />;
}
