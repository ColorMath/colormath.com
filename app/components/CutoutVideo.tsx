"use client";

import { useEffect, useRef, useState } from "react";

/**
 * A transparent portrait that starts life as its still.
 *
 * Every browser first gets the still, a transparent WebP of one chosen frame,
 * then swaps in the video that engine renders cleanly, seeked to that same
 * frame so the handoff is invisible:
 * - Chromium and Firefox: VP9-alpha WebM.
 * - WebKit (Safari, and every iOS browser, Chrome included): HEVC-alpha MOV.
 *   Its edge pixels are colour-bled before encoding, since HEVC smears alpha
 *   and would otherwise reveal the red backdrop as a fringe.
 * Reduced-motion visitors, engines that can play neither, and copies hidden
 * at this breakpoint keep the still and download nothing.
 */
export function CutoutVideo({
  webm,
  mov,
  still,
  start,
  label,
  className,
  style,
}: {
  webm: string;
  /** HEVC-alpha for WebKit; without it WebKit keeps the still. */
  mov?: string;
  still: string;
  /** Seconds into the clip where `still` was taken. */
  start: number;
  label: string;
  className?: string;
  style?: React.CSSProperties;
}) {
  const imgRef = useRef<HTMLImageElement>(null);
  const [source, setSource] = useState<string | null>(null);

  useEffect(() => {
    const img = imgRef.current;
    if (!img) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (img.offsetParent === null) return; // hidden at this breakpoint
    const ua = navigator.userAgent;
    const iOS =
      /iPad|iPhone|iPod/.test(ua) ||
      (/Macintosh/.test(ua) && navigator.maxTouchPoints > 1);
    const webkit =
      iOS || (/AppleWebKit/.test(ua) && !/Chrome|Chromium|Edg|OPR|Firefox/.test(ua));
    const probe = document.createElement("video");
    if (webkit) {
      // Chromium also reports HEVC support but drops its alpha, hence the UA gate.
      if (mov && probe.canPlayType('video/mp4; codecs="hvc1"')) setSource(mov);
    } else if (probe.canPlayType('video/webm; codecs="vp9"')) {
      setSource(webm);
    }
  }, [webm, mov]);

  if (source) {
    return (
      <video
        src={source}
        poster={still}
        muted
        loop
        playsInline
        preload="auto"
        aria-label={label}
        className={className}
        style={style}
        onLoadedMetadata={(e) => {
          const video = e.currentTarget;
          video.currentTime = start;
          void video.play().catch(() => {});
        }}
      />
    );
  }

  return (
    /* eslint-disable-next-line @next/next/no-img-element */
    <img
      ref={imgRef}
      src={still}
      alt={label}
      className={className}
      style={style}
    />
  );
}
