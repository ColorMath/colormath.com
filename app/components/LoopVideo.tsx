"use client";

import { useEffect, useRef } from "react";

/**
 * Muted, looping, decorative video. Plays only while it is actually rendered
 * (not display:none at this breakpoint) and the visitor doesn't prefer
 * reduced motion; otherwise it stays on its poster and downloads nothing.
 */
export function LoopVideo({
  src,
  poster,
  className,
  style,
  label,
}: {
  src: string;
  poster?: string;
  className?: string;
  style?: React.CSSProperties;
  label?: string;
}) {
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = ref.current;
    if (!video) return;
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const apply = () => {
      const visible = video.offsetParent !== null;
      if (query.matches || !visible) video.pause();
      else void video.play().catch(() => {});
    };
    apply();
    query.addEventListener("change", apply);
    window.addEventListener("resize", apply);
    return () => {
      query.removeEventListener("change", apply);
      window.removeEventListener("resize", apply);
    };
  }, []);

  return (
    <video
      ref={ref}
      src={src}
      poster={poster}
      muted
      loop
      playsInline
      preload="none"
      aria-hidden={label ? undefined : true}
      aria-label={label}
      className={className}
      style={style}
    />
  );
}
