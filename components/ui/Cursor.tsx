"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

export default function Cursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Only on pointer: fine (non-touch) devices
    if (!window.matchMedia("(pointer: fine)").matches) return;

    const dot = dotRef.current;
    const ring = ringRef.current;
    if (!dot || !ring) return;

    // quickTo for maximum performance
    const moveDotX = gsap.quickTo(dot, "x", { duration: 0.08, ease: "none" });
    const moveDotY = gsap.quickTo(dot, "y", { duration: 0.08, ease: "none" });
    const moveRingX = gsap.quickTo(ring, "x", { duration: 0.45, ease: "power3.out" });
    const moveRingY = gsap.quickTo(ring, "y", { duration: 0.45, ease: "power3.out" });

    let visible = false;

    const onMouseMove = (e: MouseEvent) => {
      moveDotX(e.clientX);
      moveDotY(e.clientY);
      moveRingX(e.clientX);
      moveRingY(e.clientY);
      if (!visible) {
        gsap.to([dot, ring], { opacity: 1, duration: 0.3 });
        visible = true;
      }
    };

    // Event delegation — works for dynamically rendered children too
    const onMouseOver = (e: MouseEvent) => {
      if ((e.target as HTMLElement).closest("a, button, [role='button']")) {
        gsap.to(ring, {
          scale: 2.2,
          borderColor: "var(--color-accent)",
          duration: 0.35,
          ease: "power2.out",
        });
        gsap.to(dot, { scale: 0, duration: 0.2 });
      }
    };

    const onMouseOut = (e: MouseEvent) => {
      const related = e.relatedTarget as HTMLElement | null;
      if (!related?.closest("a, button, [role='button']")) {
        gsap.to(ring, {
          scale: 1,
          borderColor: "rgba(255,255,255,0.35)",
          duration: 0.35,
          ease: "power2.out",
        });
        gsap.to(dot, { scale: 1, duration: 0.25 });
      }
    };

    const onDocLeave = () => {
      gsap.to([dot, ring], { opacity: 0, duration: 0.25 });
      visible = false;
    };

    const onDocEnter = () => {
      if (visible) gsap.to([dot, ring], { opacity: 1, duration: 0.25 });
    };

    window.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseover", onMouseOver);
    document.addEventListener("mouseout", onMouseOut);
    document.addEventListener("mouseleave", onDocLeave);
    document.addEventListener("mouseenter", onDocEnter);

    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseover", onMouseOver);
      document.removeEventListener("mouseout", onMouseOut);
      document.removeEventListener("mouseleave", onDocLeave);
      document.removeEventListener("mouseenter", onDocEnter);
    };
  }, []);

  return (
    <>
      {/* Lagged ring */}
      <div
        ref={ringRef}
        className="fixed pointer-events-none z-[9999] opacity-0 rounded-full"
        style={{
          top: -16,
          left: -16,
          width: 32,
          height: 32,
          border: "1px solid rgba(255,255,255,0.35)",
        }}
        aria-hidden="true"
      />
      {/* Instant dot */}
      <div
        ref={dotRef}
        className="fixed pointer-events-none z-[9999] opacity-0 rounded-full"
        style={{
          top: -4,
          left: -4,
          width: 8,
          height: 8,
          backgroundColor: "var(--color-accent)",
        }}
        aria-hidden="true"
      />
    </>
  );
}
