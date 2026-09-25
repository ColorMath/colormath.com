"use client";

import { useEffect, useRef, useState } from "react";

/** How long a video may take to start before we give up and keep the still. */
const START_TIMEOUT_MS = 8000;

/**
 * True when the frame's corners come out transparent, as they must: both clips
 * are padded, so every corner is empty. A decoder that drops or misaligns the
 * alpha channel (seen with HEVC on a real iPhone) paints them opaque.
 */
function alphaLooksRight(video: HTMLVideoElement): boolean {
  const w = 48;
  const h = Math.max(1, Math.round((w * video.videoHeight) / video.videoWidth));
  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d", { willReadFrequently: true });
  if (!ctx) return true; // can't check; trust the browser
  try {
    ctx.drawImage(video, 0, 0, w, h);
    const { data } = ctx.getImageData(0, 0, w, h);
    let sum = 0;
    let n = 0;
    for (const [x0, y0] of [[0, 0], [w - 3, 0], [0, h - 3], [w - 3, h - 3]]) {
      for (let y = y0; y < y0 + 3; y++)
        for (let x = x0; x < x0 + 3; x++) {
          sum += data[(y * w + x) * 4 + 3];
          n++;
        }
    }
    return sum / n < 24;
  } catch {
    return true; // canvas unreadable; nothing to go on
  }
}

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
 * - iOS in the phone layout (`solid` given): an ordinary H.264 MP4 with the section's
 *   violet (#6318fb) baked in, padded top and bottom. Plays everywhere,
 *   iPhones included, and is lighter. It runs full-bleed (no side edges) and
 *   fades out over its padding, because iOS and Android colour-manage video
 *   differently (~10 levels apart) and no single baked colour matches both.
 * Reduced-motion visitors, engines that can play neither, and copies hidden
 * at this breakpoint keep the still and download nothing. Everyone else only
 * starts downloading once the still is within about a screen of the viewport.
 *
 * Fallback: if the video errors, doesn't start within START_TIMEOUT_MS, or
 * its first frame fails the corner-alpha check, the still comes back for good.
 */
export function CutoutVideo({
  webm,
  mov,
  solid,
  still,
  start,
  label,
  className,
  style,
}: {
  webm: string;
  /** HEVC-alpha for WebKit; without it WebKit keeps the still. */
  mov?: string;
  /** Opaque MP4 on the section violet; used on iOS only (others keep alpha). */
  solid?: string;
  still: string;
  /** Seconds into the clip where `still` was taken. */
  start: number;
  label: string;
  className?: string;
  style?: React.CSSProperties;
}) {
  const imgRef = useRef<HTMLImageElement>(null);
  const [source, setSource] = useState<string | null>(null);
  const [failed, setFailed] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Start-up watchdog: no playback in time means back to the still.
  useEffect(() => {
    if (!source) return;
    const timer = window.setTimeout(() => {
      const v = videoRef.current;
      if (!v || v.paused || v.readyState < 3) setFailed(true);
    }, START_TIMEOUT_MS);
    return () => window.clearTimeout(timer);
  }, [source]);

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
    // Don't download anything until the still is within about a screen of
    // the viewport; most visitors see the hero long before the founders.
    const choose = () => {
      const probe = document.createElement("video");
      if (solid && iOS) {
        // iPhones can't render alpha video correctly; everyone else keeps it.
        if (probe.canPlayType('video/mp4; codecs="avc1.640028"')) setSource(solid);
      } else if (webkit) {
        // Chromium also reports HEVC support but drops its alpha, hence the UA gate.
        if (mov && probe.canPlayType('video/mp4; codecs="hvc1"')) setSource(mov);
      } else if (probe.canPlayType('video/webm; codecs="vp9"')) {
        setSource(webm);
      }
    };
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          io.disconnect();
          choose();
        }
      },
      { rootMargin: "100% 0px" }
    );
    io.observe(img);
    return () => io.disconnect();
  }, [webm, mov, solid]);

  if (source && !failed) {
    return (
      <video
        ref={videoRef}
        src={source}
        poster={still}
        muted
        loop
        playsInline
        preload="auto"
        aria-label={label}
        className={`${className ?? ""} ${source === solid ? "solid-feather" : ""}`}
        style={style}
        onLoadedMetadata={(e) => {
          const video = e.currentTarget;
          video.currentTime = start;
          void video.play().catch(() => {});
        }}
        onError={() => setFailed(true)}
        onPlaying={(e) => {
          const video = e.currentTarget;
          // Check a real decoded frame, a moment after playback begins.
          if (source === solid) return; // opaque by design; nothing to check
          window.setTimeout(() => {
            if (!alphaLooksRight(video)) setFailed(true);
          }, 300);
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
