"use client";

import { useEffect, useRef, useState } from "react";

/**
 * A transparent (VP9-alpha WebM) portrait that starts life as its still.
 *
 * Every browser first gets the still, a transparent WebP of one chosen frame.
 * Only browsers that render VP9 alpha cleanly (Chromium, Firefox) then swap in
 * the video, seeked to that same frame so the handoff is invisible. Safari and
 * every iOS browser (all WebKit) keep the still: WebKit either can't play VP9
 * alpha or fringes HEVC alpha. So do reduced-motion visitors and copies hidden
 * at this breakpoint, which then download nothing.
 */
export function CutoutVideo({
  webm,
  still,
  start,
  label,
  className,
  style,
}: {
  webm: string;
  still: string;
  /** Seconds into the clip where `still` was taken. */
  start: number;
  label: string;
  className?: string;
  style?: React.CSSProperties;
}) {
  const imgRef = useRef<HTMLImageElement>(null);
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    const img = imgRef.current;
    if (!img) return;
    const ua = navigator.userAgent;
    const iOS =
      /iPad|iPhone|iPod/.test(ua) ||
      (/Macintosh/.test(ua) && navigator.maxTouchPoints > 1);
    const webkitOnly =
      /AppleWebKit/.test(ua) && !/Chrome|Chromium|Edg|OPR|Firefox/.test(ua);
    const vp9 =
      document.createElement("video").canPlayType('video/webm; codecs="vp9"') !==
      "";
    const calm = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const shown = img.offsetParent !== null;
    if (!iOS && !webkitOnly && vp9 && !calm && shown) setAnimate(true);
  }, []);

  if (animate) {
    return (
      <video
        src={webm}
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
