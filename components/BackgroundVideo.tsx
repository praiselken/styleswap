"use client";

import { useEffect, useRef, useState } from "react";

const POSTER = "/videos/golden-brown-moving-bg-poster.jpg";

export default function BackgroundVideo() {
  const ref = useRef<HTMLVideoElement | null>(null);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setReducedMotion(query.matches);

    sync();
    query.addEventListener("change", sync);
    return () => query.removeEventListener("change", sync);
  }, []);

  useEffect(() => {
    const v = ref.current;
    if (!v) return;

    if (reducedMotion) {
      v.pause();
      return;
    }

    const play = () => {
      if (!document.hidden) v.play().catch(() => {});
    };

    play();

    // Browsers pause background video on hidden tabs and don't resume on return,
    // which would leave the page on a black background.
    document.addEventListener("visibilitychange", play);
    return () => document.removeEventListener("visibilitychange", play);
  }, [reducedMotion]);

  // Readers who asked for less motion get the still frame, and never the 9MB download.
  if (reducedMotion) {
    return (
      <div
        aria-hidden
        className="fixed inset-0 z-[-2] bg-cover bg-center pointer-events-none"
        style={{ backgroundImage: `url(${POSTER})` }}
      />
    );
  }

  return (
    <video
      ref={ref}
      src="/videos/golden-brown-moving-bg.mp4"
      poster={POSTER}
      aria-hidden
      autoPlay
      loop
      muted
      playsInline
      preload="metadata"
      className="fixed inset-0 z-[-2] h-full w-full object-cover pointer-events-none"
    />
  );
}
