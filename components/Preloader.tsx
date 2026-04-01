"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { useLoading } from "@/context/LoadingContext";

// Assets to preload — desktop hero, mobile hero, canvas wireframe
const HERO_IMAGES = [
  "/images/hero-bg8.webp",
  "/images/bg-mobile2.webp",
  "/images/hero-bg-front4.webp",
];
const TOTAL_ASSETS = HERO_IMAGES.length + 1; // +1 for fonts

export default function Preloader() {
  const { setLoaded } = useLoading();
  const [display, setDisplay] = useState(0);
  const overlayRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef(0); // actual loaded progress 0–100

  useEffect(() => {
    // Lock scroll while preloader is active
    document.body.style.overflow = "hidden";

    let loadedCount = 0;

    const onAssetLoaded = () => {
      loadedCount++;
      progressRef.current = Math.round((loadedCount / TOTAL_ASSETS) * 100);
    };

    // Preload images
    HERO_IMAGES.forEach((src) => {
      const img = new window.Image();
      img.onload = onAssetLoaded;
      img.onerror = onAssetLoaded; // still advance on error
      img.src = src;
    });

    // Fonts
    document.fonts.ready.then(onAssetLoaded);

    // Animated counter — lerps toward actual progress with a minimum speed
    let animFrameId: number;
    let current = 0;

    const tick = () => {
      const target = progressRef.current;
      const delta = target - current;
      // lerp coefficient + minimum speed so it never visibly stalls
      current += Math.max(delta * 0.07, current < target ? 0.4 : 0);

      if (current >= 100) {
        current = 100;
        setDisplay(100);
        cancelAnimationFrame(animFrameId);

        // Brief pause at 100% then exit
        setTimeout(() => {
          // Unlock scroll just before revealing the site
          document.body.style.overflow = "";

          gsap.to(overlayRef.current, {
            yPercent: -100,
            duration: 0.9,
            ease: "power4.inOut",
            onComplete: setLoaded,
          });
        }, 280);

        return;
      }

      setDisplay(Math.floor(current));
      animFrameId = requestAnimationFrame(tick);
    };

    animFrameId = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(animFrameId);
      document.body.style.overflow = "";
    };
  }, [setLoaded]);

  const padded = String(display).padStart(3, "0");

  return (
    <div
      ref={overlayRef}
      aria-hidden="true"
      className="fixed inset-0 z-[9999] flex flex-col bg-[#0A0A09] select-none pointer-events-none"
    >
      {/* Top-left logo — mirrors the nav */}
      <div className="absolute top-6 left-6 md:top-8 md:left-8 font-display font-bold text-[var(--color-text)] text-[1.125rem] tracking-tight">
        RA
      </div>

      {/* Centre: large counter */}
      <div className="flex-1 flex flex-col items-center justify-center gap-2">
        <span
          className="font-mono tabular-nums leading-none"
          style={{
            fontSize: "clamp(7rem, 18vw, 16rem)",
            color: "var(--color-accent)",
            letterSpacing: "-0.04em",
          }}
        >
          {padded}
        </span>
        <span
          className="font-mono"
          style={{
            fontSize: "clamp(1.5rem, 3.5vw, 3rem)",
            color: "var(--color-accent)",
            opacity: 0.6,
            letterSpacing: "0.05em",
          }}
        >
          %
        </span>
      </div>

      {/* Bottom progress bar */}
      <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-white/5">
        <div
          className="h-full"
          style={{
            width: `${display}%`,
            backgroundColor: "var(--color-accent)",
            transition: "width 60ms linear",
          }}
        />
      </div>
    </div>
  );
}
